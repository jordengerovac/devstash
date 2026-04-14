"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function signInWithCredentials(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
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
