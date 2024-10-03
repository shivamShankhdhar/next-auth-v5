"use server"
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { error } from "console";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid credentials" };
  }

  const {email,password} = validatedFields.data;
  
  const isExistingUser = await getUserByEmail(email)

  if (!isExistingUser || !isExistingUser.password || !isExistingUser.email) { 
    return { error: "Email does not exist, try login with register instead." };
  }

  if (!isExistingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(isExistingUser.email)
  
    await sendVerificationEmail(isExistingUser.email, verificationToken.token)
    
    return {error: "Oops! Your email is not verified yet, We have sent you a verification email. Please verify your email first to login."}
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