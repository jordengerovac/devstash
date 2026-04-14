"use server"

import bcrypt from "bcryptjs"
import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function changePassword(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" }
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" }
  }

  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (!user?.password) {
    return { error: "Cannot change password for OAuth accounts" }
  }

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return { error: "Current password is incorrect" }

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  })

  return { success: true }
}

export async function deleteAccount(): Promise<{ error?: string } | void> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  try {
    await prisma.user.delete({ where: { id: session.user.id } })
  } catch {
    return { error: "Failed to delete account. Please try again." }
  }

  await signOut({ redirectTo: "/sign-in" })
}
