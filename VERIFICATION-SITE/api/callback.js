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
    const { handleOAuthCallback } = require("../../handlers/oauthCallbackHandler")
    const { Client, GatewayIntentBits, Partials } = require("discord.js")

    // Create a temporary Discord client for this request
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Channel, Partials.Message],
    })

    const result = await handleOAuthCallback(code, state, client)

    if (result.success) {
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
              <p>${result.message}</p>
              <p>You can close this window now.</p>
            </div>
          </body>
        </html>
      `)
    } else {
      const color = result.banned ? "#ff6b6b" : "#ffaa00"
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Verification Failed</title>
            <style>
              body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
              .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
              h1 { color: ${color}; }
              p { color: #a0a0a0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Verification Failed</h1>
              <p>${result.message}</p>
              <p>You can close this window now.</p>
            </div>
          </body>
        </html>
      `)
    }
  } catch (error) {
    console.error("OAuth Callback Error:", error)
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Server Error</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a2e; color: #fff; }
            .container { text-align: center; padding: 40px; background: #16213e; border-radius: 10px; }
            h1 { color: #ff6b6b; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Server Error</h1>
            <p>An error occurred during verification. Please try again later.</p>
          </div>
        </body>
      </html>
    `)
  }
}
