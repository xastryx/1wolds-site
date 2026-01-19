# Deploying to Vercel - Step by Step

## Prerequisites

- GitHub account
- Vercel account (free)
- Discord Developer Portal access

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **New Repository**
3. Name it: `mm2plug-verification-site`
4. Choose **Public** (or Private if you prefer)
5. Click **Create repository**

## Step 2: Push Code to GitHub

### If you have Git installed locally:

```bash
cd VERIFICATION-SITE
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mm2plug-verification-site.git
git push -u origin main
```

### If you don't have Git:

1. Click **Upload files** on your GitHub repo
2. Drag and drop all files from the `VERIFICATION-SITE` folder
3. Click **Commit changes**

## Step 3: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub (or create account)
3. Click **Add New Project**
4. Find your `mm2plug-verification-site` repository
5. Click **Import**
6. Click **Continue**

## Step 4: Configure Environment Variables

In the Vercel configuration page, add these environment variables:

```
NEXT_PUBLIC_DISCORD_CLIENT_ID = (your client ID from Discord)
DISCORD_CLIENT_SECRET = (your client secret from Discord)
NEXT_PUBLIC_APP_URL = https://mm2plug-verification-site.vercel.app
DISCORD_GUILD_ID = 1156620994920861698
BOT_API_URL = (your bot API URL - see below)
BOT_TOKEN = (your bot token)
```

Then click **Deploy**

## Step 5: Get Your Vercel URL

After deployment completes (usually 1-2 minutes):
1. You'll see a success message with your URL
2. Your URL looks like: `https://mm2plug-verification-site.vercel.app`
3. Copy this URL

## Step 6: Update Discord OAuth Settings

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Go to **OAuth2** → **Redirects**
4. Add your Vercel URL with `/api/auth/callback`:
   ```
   https://mm2plug-verification-site.vercel.app/api/auth/callback
   ```
5. **Save Changes**

## Step 7: Update Vercel Environment Variables

1. Go back to your Vercel project
2. Go to **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_APP_URL`
4. Change it to your actual Vercel URL: `https://mm2plug-verification-site.vercel.app`
5. Save and **redeploy** (Vercel will do this automatically)

## Step 8: Set Up Bot API URL

Your verification site needs to communicate with your bot API server.

### Option A: Run Bot Locally (Testing)
Set `BOT_API_URL` to: `http://localhost:3001`

### Option B: Deploy Bot API to Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Deploy with repo: Push your bot code to GitHub
4. Connect Railway to your GitHub repo
5. Set start command: `node api-server.js`
6. Add environment variables (BOT_TOKEN, DISCORD_GUILD_ID, etc.)
7. Get public URL from Railway
8. Update `BOT_API_URL` in Vercel to that URL

## Step 9: Test Everything

1. Go to your Vercel URL: `https://your-vercel-url.vercel.app`
2. Click **Verify with Discord**
3. Authorize the application
4. You should see either:
   - ✓ Success (if not in blacklist)
   - ⚠ Denied (if in blacklist)

## Troubleshooting

### Blank Page or 404
- Check environment variables are set
- Check deployment logs (click deployment in Vercel)
- Try rebuilding: **Settings** → **Redeploy**

### "Missing authorization code"
- Check Discord OAuth redirects are correct
- Check `NEXT_PUBLIC_APP_URL` matches your Vercel URL
- Clear browser cache and try again

### Verification fails silently
- Check `BOT_API_URL` is correct
- Check bot API server is running
- Check Vercel deployment logs for errors

### Users not getting role
- Check bot has "Manage Roles" permission
- Check role ID is correct (1436508255558832219)
- Check role is below bot's highest role

## Making Updates

After deployment, if you need to make changes:

1. Update files in `VERIFICATION-SITE` folder
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update verification system"
   git push
   ```
3. Vercel will automatically redeploy

## Important Notes

- ✅ Vercel free tier is sufficient for this
- ✅ Automatic HTTPS included
- ✅ No credit card required
- ⚠️ Cold starts may take 5-10 seconds (normal for free tier)
- ⚠️ Keep environment variables secret - never commit them to GitHub

## Getting Help

Check the main README.md in the VERIFICATION-SITE folder for more detailed information about the verification system.
