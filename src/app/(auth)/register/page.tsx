import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm px-4 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Get started with DevStash</p>
      </div>
      <RegisterForm />
    </div>
  )
}
