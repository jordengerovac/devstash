import { resend } from "./resend"

const FROM = process.env.RESEND_FROM_EMAIL ?? "DevStash <onboarding@resend.dev>"
const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${BASE_URL}/api/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your DevStash email",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0f0f0f; color: #e5e5e5; border-radius: 12px;">
        <h2 style="margin: 0 0 8px; font-size: 22px; color: #ffffff;">Welcome to DevStash!</h2>
        <p style="margin: 0 0 24px; color: #a3a3a3; font-size: 15px;">Click the button below to verify your email address. This link expires in 24 hours.</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #ffffff; color: #0f0f0f; font-weight: 600; font-size: 14px; border-radius: 8px; text-decoration: none;">
          Verify Email
        </a>
        <p style="margin: 24px 0 0; font-size: 13px; color: #525252;">
          If you didn't create a DevStash account, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}
