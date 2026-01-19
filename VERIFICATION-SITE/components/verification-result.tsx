"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type VerificationStatus = "loading" | "success" | "blacklisted" | "error"

interface ResultData {
  status: VerificationStatus
  username?: string
  discordId?: string
  message?: string
}

interface VerificationResultProps {
  code?: string
  state?: string
}

function VerificationResultContent({ code, state }: VerificationResultProps) {
  const router = useRouter()
  const [result, setResult] = useState<ResultData>({
    status: "loading",
  })

  useEffect(() => {
    if (!code) {
      setResult({
        status: "error",
        message: "No authorization code received",
      })
      return
    }

    const verifyUser = async () => {
      try {
        const response = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        })

        const data = await response.json()

        if (!response.ok) {
          setResult({
            status: data.blacklisted ? "blacklisted" : "error",
            message: data.message,
            username: data.username,
            discordId: data.discordId,
          })
          return
        }

        setResult({
          status: "success",
          username: data.username,
          discordId: data.discordId,
        })

        // Auto-redirect after 3 seconds
        setTimeout(() => {
          window.location.href = `https://discord.com/channels/@me`
        }, 3000)
      } catch (error) {
        setResult({
          status: "error",
          message: "An error occurred during verification",
        })
      }
    }

    verifyUser()
  }, [code, state])

  return (
    <Card className="border border-border bg-card/50 backdrop-blur-sm p-8 w-full max-w-md">
      {result.status === "loading" && (
        <div className="space-y-4 text-center">
          <div className="inline-block animate-spin text-4xl">⟳</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Verifying...</h2>
            <p className="text-muted-foreground">Please wait while we verify your account</p>
          </div>
        </div>
      )}

      {result.status === "success" && (
        <div className="space-y-4 text-center">
          <div className="text-5xl">✓</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-accent">Verified!</h2>
            <p className="text-muted-foreground">
              Welcome to MM2Plug, <span className="font-semibold">{result.username}</span>
            </p>
            <p className="text-sm text-muted-foreground">You have been granted access to the server</p>
          </div>
          <div className="pt-4 text-sm text-muted-foreground">Redirecting to Discord...</div>
        </div>
      )}

      {result.status === "blacklisted" && (
        <div className="space-y-4 text-center">
          <div className="text-5xl">⚠</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
            <p className="text-muted-foreground">Your account has been flagged for security reasons</p>
            <p className="text-sm text-muted-foreground mt-4 bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              {result.message || "You are in a blacklisted server. The bot admins have been notified."}
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-4">Check your Discord DMs for more information from the bot</p>
        </div>
      )}

      {result.status === "error" && (
        <div className="space-y-4 text-center">
          <div className="text-5xl">✕</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="text-muted-foreground">{result.message || "An unexpected error occurred"}</p>
          </div>
          <Button onClick={() => router.push("/")} className="w-full mt-6 bg-accent hover:bg-accent/90">
            Try Again
          </Button>
        </div>
      )}
    </Card>
  )
}

export function VerificationResult() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code") || undefined
  const state = searchParams.get("state") || undefined

  return <VerificationResultContent code={code} state={state} />
}
