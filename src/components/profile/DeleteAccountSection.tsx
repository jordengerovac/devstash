"use client"

import { useState, useTransition } from "react"
import { deleteAccount } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DeleteAccountSectionProps {
  email: string
}

export function DeleteAccountSection({ email }: DeleteAccountSectionProps) {
  const [confirming, setConfirming] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleCancel() {
    setConfirming(false)
    setInputValue("")
    setError(null)
  }

  function handleDelete() {
    if (inputValue !== email) {
      setError("Email does not match")
      return
    }

    startTransition(async () => {
      const result = await deleteAccount()
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="rounded-lg border border-destructive/30 bg-card p-4 space-y-3">
      <div>
        <h3 className="text-sm font-medium text-destructive">Delete account</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
      </div>

      {!confirming ? (
        <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
          Delete account
        </Button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Type <span className="font-medium text-foreground">{email}</span> to confirm.
          </p>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Input
            type="email"
            placeholder={email}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setError(null)
            }}
            disabled={isPending}
          />

          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPending || inputValue !== email}
            >
              {isPending ? "Deleting..." : "Confirm delete"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
