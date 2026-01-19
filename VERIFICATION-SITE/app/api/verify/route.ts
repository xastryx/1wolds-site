import { type NextRequest, NextResponse } from "next/server"

interface DiscordTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

interface DiscordUser {
  id: string
  username: string
  avatar: string
  discriminator: string
}

interface DiscordGuild {
  id: string
  name: string
  owner: boolean
}

async function getDiscordToken(code: string): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }).toString(),
  })

  const data: DiscordTokenResponse = await response.json()
  return data.access_token
}

async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  return response.json()
}

async function getUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  return response.json()
}

async function getBlacklist(): Promise<string[]> {
  try {
    const botApiUrl = process.env.BOT_API_URL || "http://localhost:3001"
    const response = await fetch(`${botApiUrl}/api/blacklist`)
    const data = await response.json()
    return data.blacklist || []
  } catch {
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ message: "Missing authorization code" }, { status: 400 })
    }

    const accessToken = await getDiscordToken(code)
    const user = await getDiscordUser(accessToken)
    const guilds = await getUserGuilds(accessToken)
    const userGuildIds = guilds.map((g) => g.id)

    const blacklist = await getBlacklist()
    const isBlacklisted = userGuildIds.some((guildId) => blacklist.includes(guildId))

    if (isBlacklisted) {
      const botApiUrl = process.env.BOT_API_URL || "http://localhost:3001"
      try {
        await fetch(`${botApiUrl}/api/ban-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            username: user.username,
            reason: "Member in blacklisted server",
          }),
        })
      } catch (error) {
        console.error("Error notifying bot to ban:", error)
      }

      return NextResponse.json(
        {
          blacklisted: true,
          message: "You are a member of a blacklisted server. Contact admins for appeals.",
          username: user.username,
          discordId: user.id,
        },
        { status: 403 },
      )
    }

    const botApiUrl = process.env.BOT_API_URL || "http://localhost:3001"
    try {
      await fetch(`${botApiUrl}/api/verify-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          guildId: process.env.DISCORD_GUILD_ID,
        }),
      })
    } catch (error) {
      console.error("Error notifying bot to verify:", error)
    }

    return NextResponse.json({
      success: true,
      username: user.username,
      discordId: user.id,
      message: "Verification successful",
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ message: "Verification failed" }, { status: 500 })
  }
}
