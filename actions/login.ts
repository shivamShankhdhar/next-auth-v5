"use server"
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken,generateTwoFactorToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail,sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid credentials" };
  }

  const {email,password,code} = validatedFields.data;
  
  const isExistingUser = await getUserByEmail(email)

  if (!isExistingUser || !isExistingUser.password || !isExistingUser.email) { 
    return { error: "Email does not exist, try login with register instead." };
  }

  if (!isExistingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(isExistingUser.email)
  
    await sendVerificationEmail(isExistingUser.email, verificationToken.token)
    
    return {error: "Oops! Your email is not verified yet, We have sent you a verification email. Please verify your email first to login."}
  }
  
  if (isExistingUser.isTwoFactorEnabled && isExistingUser.email) { 
    if (code) { 
      const twoFactorToken = await getTwoFactorTokenByEmail(isExistingUser.email)

      if(!twoFactorToken) {
        return { error: "Invalid code" }
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code" }
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code has expired" }
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id
        }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(isExistingUser.id);
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id
          }
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: isExistingUser.id
        }
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(isExistingUser.email)
  
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
    
      return { twoFactor: true }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo:DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch(error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}