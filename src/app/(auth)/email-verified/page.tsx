import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function EmailVerifiedPage() {
  return (
    <div className="w-full max-w-sm px-4 space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-emerald-500/10 p-4">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Email verified!</h1>
        <p className="text-sm text-muted-foreground">
          Your email has been verified. You can now sign in to DevStash.
        </p>
      </div>
      <Link href="/sign-in" className={cn(buttonVariants(), "w-full")}>
        Sign in
      </Link>
    </div>
  )
}
