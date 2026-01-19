import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.redirect(`${request.nextUrl.origin}/verify?error=no_code`)
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/verify?code=${code}&state=${state || ""}`)
}
