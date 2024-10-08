"use server"
import * as z from "zod"


import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"

export const reset = async (values:z.infer <typeof ResetSchema>)=> {
  const validatedFields = ResetSchema.safeParse(values);

  if(!validatedFields.success) {
    return { error: "Invalid credentials" };
  }

  const { email } = validatedFields.data;

  const user = await getUserByEmail(email);

  if(!user) {
    return { error: "Email does not exist" };
  }
 
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
  
  return { success: "Password Reset Email Sent!" };
}