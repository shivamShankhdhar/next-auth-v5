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