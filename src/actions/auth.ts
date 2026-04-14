"use server"

import { headers } from "next/headers"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { rateLimit, rateLimitErrorMessage } from "@/lib/rate-limit"

export async function signInWithCredentials(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = (formData.get("email") as string) ?? ""

  const hdrs = await headers()
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const { success, reset } = await rateLimit(`login:${ip}:${email}`, 5, "15 m")
  if (!success) return { error: rateLimitErrorMessage(reset) }

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
    return null
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" }
        default:
          return { error: "Something went wrong. Please try again." }
      }
    }
    // Re-throw redirect errors so Next.js can handle them
    throw error
  }
}

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/dashboard" })
}

export async function signOutUser() {
  await signOut({ redirectTo: "/sign-in" })
}
