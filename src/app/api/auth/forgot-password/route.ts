import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"

const PASSWORD_RESET_PREFIX = "password-reset:"

export async function POST(request: Request) {
  const body = await request.json()
  const { email } = body as { email?: string }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  // Always respond with success to avoid leaking whether an email is registered
  const genericResponse = NextResponse.json({ success: true }, { status: 200 })

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  })

  // Skip silently if user doesn't exist or is an OAuth-only user (no password)
  if (!user?.password) return genericResponse

  // Delete any existing password reset tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: `${PASSWORD_RESET_PREFIX}${email}` },
  })

  const token = crypto.randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.verificationToken.create({
    data: {
      identifier: `${PASSWORD_RESET_PREFIX}${email}`,
      token,
      expires,
    },
  })

  try {
    await sendPasswordResetEmail(email, token)
  } catch (err) {
    console.error("[forgot-password] Failed to send reset email:", err)
  }

  return genericResponse
}
