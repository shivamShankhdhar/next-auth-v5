import { UserRole } from "@prisma/client";
import * as z from "zod";

export const ResetSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Email is invalid" }),
})


export const NewPasswordSchema = z.object({
 password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
})

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  code:z.optional(z.string())
})

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
})

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password:z.optional(z.string().min(6)),
  newPassword:z.optional(z.string().min(6))
}).refine((data) => {
  if (data.password && !data.newPassword) return false;

  return true;
}, {
  message: "New Password is required!",
  path: ["newPassword"],
}).refine((data) => {
  if (data.newPassword && !data.password) return false;

  return true;
}, {
  message: "Password is required!",
  path: ["password"],
})