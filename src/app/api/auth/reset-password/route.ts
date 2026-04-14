import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const PASSWORD_RESET_PREFIX = "password-reset:"

export async function POST(request: Request) {
  const body = await request.json()
  const { token, password, confirmPassword } = body as {
    token?: string
    password?: string
    confirmPassword?: string
  }

  if (!token || !password || !confirmPassword) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    )
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } })

  if (!record || !record.identifier.startsWith(PASSWORD_RESET_PREFIX)) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 })
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } })
    return NextResponse.json({ error: "This reset link has expired" }, { status: 400 })
  }

  const email = record.identifier.slice(PASSWORD_RESET_PREFIX.length)

  const hashed = await bcrypt.hash(password, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { password: hashed },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ])

  return NextResponse.json({ success: true }, { status: 200 })
}
