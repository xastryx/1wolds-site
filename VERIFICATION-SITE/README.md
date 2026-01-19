# MM2Plug Verification Website

A standalone Next.js application for verifying Discord users before granting access to your server.

## Features

- Discord OAuth authentication
- Blacklist checking (prevents users from blacklisted servers)
- Role assignment on verification
- Auto-ban notification for blacklisted users
- Auto-verify for special invite links
- Modern dark gaming UI

## Prerequisites

- Node.js 18+ or access to Vercel
- Discord Bot Token
- Discord Application OAuth Credentials
- Discord Guild ID

## Setup Instructions

### 1. Clone & Install

```bash
git clone <your-github-repo-url>
cd verification-site
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Discord OAuth
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Discord Guild
DISCORD_GUILD_ID=1156620994920861698

# Bot Communication
BOT_API_URL=http://localhost:3001
BOT_TOKEN=your_bot_token_here

# Optional: For logging
LOG_CHANNEL_ID=your_log_channel_id
```

### 3. Get Discord Credentials

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application or select existing
3. Copy **Client ID** → `NEXT_PUBLIC_DISCORD_CLIENT_ID`
4. Generate **Client Secret** → `DISCORD_CLIENT_SECRET`
5. Go to OAuth2 → Redirects
6. Add: `http://localhost:3000/api/auth/callback` (for local testing)
7. When deployed to Vercel, add: `https://your-vercel-url.vercel.app/api/auth/callback`

### 4. Local Testing

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Option B: Using GitHub
1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables
6. Deploy

### 6. Post-Deployment

1. Get your Vercel URL (e.g., `https://verification-site.vercel.app`)
2. Update Discord OAuth Redirects to: `https://your-vercel-url.vercel.app/api/auth/callback`
3. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
4. Update `BOT_API_URL` to your bot's API server URL

## Bot Integration

Your Discord bot needs to:

1. Have an API server running (api-server.js from the main bot repo)
2. Listen for verification requests at:
   - `POST /api/verify-user` - Grant verified role
   - `POST /api/ban-user` - Ban blacklisted users
3. Have Admin permissions in your guild

## Verification Flow

```
User clicks Verify Button
        ↓
Discord OAuth Authorization
        ↓
Get User Guilds
        ↓
Check Against Blacklist
        ↓
✓ If Clean → Grant Role → Success Page
✗ If Blacklisted → Ban User → Error Page
```

## File Structure

```
verification-site/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts    # Discord OAuth callback
│   │   └── verify/route.ts           # Verification logic
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Home page
│   ├── verify/page.tsx                # Verification result page
│   └── globals.css                    # Tailwind styles
├── components/
│   ├── verification-card.tsx          # Main verification component
│   ├── verification-result.tsx        # Result display component
│   └── ui/                            # shadcn UI components
├── package.json
├── tsconfig.json
└── next.config.mjs
```

## Troubleshooting

### "No authorization code received"
- Check Discord OAuth redirects are correct
- Clear browser cache and cookies

### Verification fails silently
- Check bot API server is running
- Check `BOT_API_URL` environment variable
- Check bot has Admin permissions

### Blacklist check not working
- Ensure `blacklist.json` is in the bot directory
- Check bot API can access the file

### Users not getting role
- Check bot has "Manage Roles" permission
- Check verified role ID is correct
- Check role is below bot's highest role

## Support

For issues or questions, check the main bot repository or contact admins.
