import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="w-full max-w-sm px-4 space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Invalid link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has already been used.
          </p>
        </div>
        <Link href="/forgot-password" className={cn(buttonVariants(), "w-full")}>
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm px-4 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">Enter your new password below</p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  )
}
