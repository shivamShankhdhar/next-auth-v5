"use server"
import { RegisterSchema } from "@/schemas";
import * as z from "zod";

import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid credentials" };
  }

  const { name, email, password } = validatedFields.data;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const isExistingUser =  await getUserByEmail(email)

  if(isExistingUser) {
    return { error: "Email already in use." }
  }

  await db.user.create(
    {
      data: {
        name,
        email,
        password: hashedPassword
      }
    }
  )
try {
  const verificationToken = await generateVerificationToken(email)

await sendVerificationEmail(email, verificationToken.token)
  return { success: "Verification Email Sent!" };
} catch (error:any) {
  return { error: error.message };
}
}