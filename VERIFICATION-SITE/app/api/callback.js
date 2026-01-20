const fs = require("fs")

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
    const CLIENT_ID = process.env.CLIENT_ID
    const CLIENT_SECRET = process.env.CLIENT_SECRET
    const GUILD_ID = process.env.GUILD_ID
    const VERIFICATION_ROLE_ID = process.env.VERIFICATION_ROLE_ID

    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to get token")
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user's guilds
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    const guilds = await guildsResponse.json()
    const blacklistData = fs.readFileSync("./blacklist.json", "utf-8")
    const blacklist = JSON.parse(blacklistData)

    let isBlacklisted = false
    for (const guild of guilds) {
      if (blacklist.includes(guild.id)) {
        isBlacklisted = true
        break
      }
    }

    if (isBlacklisted) {
      return res.send(`
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
              <h1>You have been banned</h1>
              <p>You are a member of a blacklisted server.</p>
            </div>
          </body>
        </html>
      `)
    }

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Verification Successful</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
            .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
            h1 { color: #00D9FF; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verification Successful!</h1>
            <p>You have been verified. You can close this window.</p>
          </div>
        </body>
      </html>
    `)
  } catch (error) {
    console.error(error)
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Verification Error</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
            .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
            h1 { color: #ffaa00; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Error</h1>
            <p>An error occurred during verification. Please try again.</p>
          </div>
        </body>
      </html>
    `)
  }
}
