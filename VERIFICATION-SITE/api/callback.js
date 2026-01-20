module.exports = async (req, res) => {
  const { code, state } = req.query

  if (!code || !state) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Verification Failed</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
            .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
            h1 { color: #ff6b6b; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verification Failed</h1>
            <p>Invalid or missing parameters. Please try again.</p>
          </div>
        </body>
      </html>
    `)
  }

  try {
    // Exchange OAuth code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI || process.env.REDIRECT_URI || "https://1wolds-site.vercel.app/api/callback",
      }),
    })

    if (!tokenResponse.ok) {
      console.error("[v0] Token response status:", tokenResponse.status)
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authorization Failed</title>
            <style>
              body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
              .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
              h1 { color: #ff6b6b; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Authorization Failed</h1>
              <p>Failed to exchange OAuth code. Please try again.</p>
            </div>
          </body>
        </html>
      `)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      console.error("[v0] No access token received")
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authorization Failed</title>
            <style>
              body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
              .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
              h1 { color: #ff6b6b; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Authorization Failed</h1>
              <p>Failed to obtain access token. Please try again.</p>
            </div>
          </body>
        </html>
      `)
    }

    // Fetch user's guilds
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!guildsResponse.ok) {
      console.error("[v0] Guilds response status:", guildsResponse.status)
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Failed to Fetch Servers</title>
            <style>
              body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
              .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
              h1 { color: #ff6b6b; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Failed to Fetch Servers</h1>
              <p>Could not retrieve your server list. Please try again.</p>
            </div>
          </body>
        </html>
      `)
    }

    const userGuilds = await guildsResponse.json()
    const userGuildIds = userGuilds.map((guild) => guild.id)

    // Hardcoded blacklist check (since we can't read files on Vercel)
    const blacklist = ["1150662099492086169"] // Add your blacklisted server IDs here

    // Check if user is in any blacklisted servers
    const blacklistedServers = userGuildIds.filter((id) => blacklist.includes(id))

    if (blacklistedServers.length > 0) {
      console.log("[v0] User verified but in blacklisted servers:", userGuildIds, blacklistedServers)
      return res.status(403).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Verification Blocked</title>
            <style>
              body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
              .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
              h1 { color: #ff6b6b; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Verification Blocked</h1>
              <p>You are a member of a blacklisted server. You have been banned from the server.</p>
            </div>
          </body>
        </html>
      `)
    }

    // User is clean - send success response
    console.log("[v0] Verification successful for user with guilds:", userGuildIds)
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Verification Successful</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
            .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
            h1 { color: #00D9FF; }
            p { color: #a0a0a0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verification Successful!</h1>
            <p>You have been verified. You can now close this window.</p>
          </div>
        </body>
      </html>
    `)
  } catch (error) {
    console.error("[v0] OAuth Callback Error:", error.message, error.stack)
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Server Error</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
            .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; max-width: 600px; }
            h1 { color: #ff6b6b; }
            p { color: #a0a0a0; font-size: 14px; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Server Error</h1>
            <p>Error: ${error.message}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">Details have been logged. Please contact support.</p>
          </div>
        </body>
      </html>
    `)
  }
}
