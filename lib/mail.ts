import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async(
  email: string,
  token:string
) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Please confirm your account",
    text: `Please confirm your account by clicking here: ${confirmLink}`,
    html: `<a href="${confirmLink}">Please confirm your account</a>`
  })
}

export const sendPasswordResetEmail = async(
  email: string,
  token:string
) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    text: `Reset your password by clicking here: ${resetLink}`,
    html: `<a href="${resetLink}">Reset your password</a>`
  })
}

export const sendTwoFactorTokenEmail = async(
  email: string,
  token:string
) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Two Factor Authentication",
    text: `Your two factor authentication code is: ${token}`,
    html: `<p>Your two factor authentication code is: ${token}</p>`
  })
}