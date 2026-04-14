import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, password, confirmPassword } = body as {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    )
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: "A user with that email already exists" },
      { status: 409 }
    )
  }

  const emailVerificationEnabled = process.env.EMAIL_VERIFICATION_ENABLED !== "false"

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      // Mark as verified immediately when verification is disabled
      ...(emailVerificationEnabled ? {} : { emailVerified: new Date() }),
    },
    select: { id: true, name: true, email: true },
  })

  if (emailVerificationEnabled) {
    // Create a verification token (expires in 24 hours)
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    })

    // Send verification email (non-blocking — user is created regardless)
    try {
      await sendVerificationEmail(email, token)
    } catch (err) {
      console.error("[register] Failed to send verification email:", err)
    }
  }

  return NextResponse.json({ success: true, user }, { status: 201 })
}
