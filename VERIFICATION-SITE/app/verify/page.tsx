import { Suspense } from "react"
import { VerificationResult } from "@/components/verification-result"

function VerificationContent() {
  return <VerificationResult />
}

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-center">Loading verification...</div>}>
        <VerificationContent />
      </Suspense>
    </main>
  )
}
