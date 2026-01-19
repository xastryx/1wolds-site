import { VerificationCard } from "@/components/verification-card"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <VerificationCard />
      </div>
    </main>
  )
}
