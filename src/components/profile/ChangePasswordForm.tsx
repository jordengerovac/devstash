"use client"

import { useActionState } from "react"
import { changePassword } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null)

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <h3 className="text-sm font-medium">Change password</h3>

      {state?.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-600 dark:text-green-400">
          Password updated successfully.
        </div>
      )}

      <form action={action} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="currentPassword" className="text-sm font-medium leading-none">
            Current password
          </label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-sm font-medium leading-none">
            New password
          </label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
            Confirm new password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>

        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  )
}
