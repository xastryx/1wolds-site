"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export function VerificationCard() {
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    setIsLoading(true)
    try {
      // Redirect to Discord OAuth
      const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
      const redirectUri = `${window.location.origin}/api/auth/callback`
      const scopes = ["identify", "guilds"]

      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes.join(" "))}`

      window.location.href = authUrl
    } catch (error) {
      console.error("Verification error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border border-border bg-card/50 backdrop-blur-sm p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-balance">MM2Plug Verification</h1>
            <p className="text-muted-foreground">Verify your Discord account to access the community</p>
          </div>

          {/* Security Info */}
          <div className="bg-secondary/10 rounded-lg p-4 space-y-2 border border-border">
            <div className="flex gap-2">
              <div className="text-accent text-xl leading-none mt-1">✓</div>
              <div>
                <p className="text-sm font-semibold">Secure Verification</p>
                <p className="text-xs text-muted-foreground">We only check your Discord servers for safety</p>
              </div>
            </div>
          </div>

          {/* Verification Button */}
          <Button
            onClick={handleVerify}
            disabled={isLoading}
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block animate-spin">⟳</span>
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.294.075.075 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 0 1 .079.009c.12.098.246.198.373.295a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.699.77 1.364 1.225 1.994a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.057c.5-4.467.151-8.841-.7-13.17a.055.055 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156 0-1.193.948-2.157 2.157-2.157 1.211 0 2.157.964 2.157 2.157 0 1.191-.946 2.157-2.157 2.157zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.948-2.157 2.157-2.157 1.211 0 2.157.964 2.157 2.157 0 1.191-.946 2.157-2.157 2.157z" />
                </svg>
                Verify with Discord
              </span>
            )}
          </Button>

          {/* Info Text */}
          <div className="text-center space-y-2 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">This link expires in 10 minutes</p>
            <p className="text-xs text-muted-foreground">By verifying, you agree to our community guidelines</p>
          </div>
        </div>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Need help? Contact support in our Discord</p>
        <p>MM2Plug © 2025</p>
      </div>
    </div>
  )
}
