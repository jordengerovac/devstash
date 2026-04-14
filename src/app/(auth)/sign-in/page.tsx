import { SignInForm } from "@/components/auth/SignInForm"

interface SignInPageProps {
  searchParams: Promise<{ reset?: string }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { reset } = await searchParams

  return (
    <div className="w-full max-w-sm px-4 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">Welcome back to DevStash</p>
      </div>
      <SignInForm resetSuccess={reset === "success"} />
    </div>
  )
}
