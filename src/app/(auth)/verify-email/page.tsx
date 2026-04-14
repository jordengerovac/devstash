import Link from "next/link"
import { MailOpen, AlertCircle, Clock } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VerifyEmailPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { error } = await searchParams

  if (error === "invalid") {
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
            This verification link is invalid or has already been used.
          </p>
        </div>
        <Link href="/register" className={cn(buttonVariants(), "w-full")}>
          Create a new account
        </Link>
      </div>
    )
  }

  if (error === "expired") {
    return (
      <div className="w-full max-w-sm px-4 space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-amber-500/10 p-4">
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Link expired</h1>
          <p className="text-sm text-muted-foreground">
            This verification link has expired. Please register again to receive a new one.
          </p>
        </div>
        <Link href="/register" className={cn(buttonVariants(), "w-full")}>
          Register again
        </Link>
      </div>
    )
  }

  if (error === "unverified") {
    return (
      <div className="w-full max-w-sm px-4 space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-amber-500/10 p-4">
            <MailOpen className="h-8 w-8 text-amber-500" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Email not verified</h1>
          <p className="text-sm text-muted-foreground">
            You must verify your email address before signing in. Check your inbox for the verification link.
          </p>
        </div>
        <Link href="/sign-in" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          Back to sign in
        </Link>
      </div>
    )
  }

  // Default — shown after successful registration
  return (
    <div className="w-full max-w-sm px-4 space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-4">
          <MailOpen className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your email address. Click it to activate your account.
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        Already verified?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
