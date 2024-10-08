"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import { SettingsSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"

export const settings = async (values:z.infer <typeof SettingsSchema>)=> {
  
  const user = await currentUser()

  if (!user) {
    return { error: "Unauthorized" }
  }
  
  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  /**  
   * if user is not logged in with the credentials instead of it logged in with oauth
   * we need to remove email and password from the request body
   * */

  if(user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // update email only if its different from the existing one and also doesnot exist in the db already

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return {error:"Email already in use!"}
    }
  }

  await db.user.update({
    where: {
      id: dbUser.id
    },
    data: {
      ...values
    }
  })

  return { success: "Settings updated!" }
}
