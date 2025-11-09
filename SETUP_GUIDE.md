# Complete Setup Guide for Grateful & Roasted

This guide will walk you through setting up the Thanksgiving game platform from scratch.

## Step 1: Install Dependencies

The dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

## Step 2: Set Up Supabase Database

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Click "New Project"
5. Fill in:
   - Name: `thanksgiving-game` (or your preferred name)
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Pricing Plan: Free
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### 2.2 Get Your Supabase Keys

1. Once the project is ready, go to **Settings** (gear icon in sidebar)
2. Click **API** in the left sidebar
3. You'll see:
   - **Project URL**: Copy this (e.g., `https://xxxxx.supabase.co`)
   - **API Keys**:
     - `anon` `public`: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` `secret`: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 2.3 Run the Database Schema

1. In Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **New Query**
3. Copy the entire contents of `database-schema.sql` from this project
4. Paste it into the query editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned" - this is good!
7. Verify by clicking **Table Editor** - you should see 5 tables:
   - games
   - players
   - submissions
   - votes
   - reactions

### 2.4 Enable Realtime (Important!)

1. Go to **Database** > **Replication** in sidebar
2. Find the tables and enable Realtime for:
   - `games`
   - `players`
   - `submissions`
   - `votes`
3. Click the toggle switches to enable them

## Step 3: Set Up Clerk Authentication

### 3.1 Create a Clerk Application

1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Click "Create application"
4. Fill in:
   - Application name: `Thanksgiving Game`
   - Choose how users will sign in: Select **Email**
5. Click "Create application"

### 3.2 Get Your Clerk Keys

1. After creation, you'll see the **API Keys** page
2. Copy both keys:
   - **Publishable key**: This is your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key**: This is your `CLERK_SECRET_KEY` (keep secret!)

### 3.3 Configure Clerk Settings (Optional but Recommended)

1. Go to **User & Authentication** > **Email, Phone, Username**
2. Under Email address:
   - Make sure "Email address" is enabled
   - Enable "Require" if you want all users to verify email
3. Go to **Paths**:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

## Step 4: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in your editor

3. Fill in all the values:

```env
# Clerk Authentication (from Step 3.2)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase (from Step 2.2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGxxxxxxxxxxxxxxxxxxxxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Save the file

## Step 5: Run the Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in XXXms
```

## Step 6: Test the Application

### 6.1 Test Landing Page
1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the beautiful landing page with the turkey emoji 🦃

### 6.2 Test Game Creation
1. Click "Create Game - Free" button
2. You'll be redirected to Clerk sign-in (this is correct!)
3. Sign up with your email
4. After verification, you'll land on the dashboard
5. Click "Create New Game"
6. Fill in:
   - Game Name: "Test Thanksgiving 2024"
   - Game Mode: "Both"
7. Click "Create Game"

### 6.3 Test Player Join (Multi-Device Simulation)
1. After creating game, you'll see a QR code and game code (e.g., "ABC123")
2. Open a **private/incognito window** (simulates another device)
3. Go to `http://localhost:3000/join`
4. Enter the game code
5. Enter a player name (e.g., "Sarah")
6. Click "Join Game"
7. You should see the submission screen

### 6.4 Test Real-time Updates
1. Keep both windows open (host and player)
2. Add another player by opening another incognito window
3. Watch the host screen - player count should update automatically!
4. Click "Start Game" on host screen
5. Watch player screens update to show submission form

### 6.5 Test Submissions
1. On player screen, write a gratitude or roast
2. Click "Submit Anonymously"
3. Watch the submission count update on host screen

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure `.env.local` exists and has all Supabase keys filled in. Restart dev server after adding them.

### Issue: Clerk redirect loop
**Solution**:
1. Check that middleware.ts is properly configured
2. Verify Clerk keys in `.env.local`
3. Clear browser cookies and try again

### Issue: Database errors
**Solution**:
1. Make sure you ran the full `database-schema.sql` script
2. Check Supabase logs in Dashboard > Logs
3. Verify RLS policies are enabled

### Issue: Realtime not working
**Solution**:
1. Go to Supabase > Database > Replication
2. Enable realtime for all tables (games, players, submissions)
3. Restart your dev server

### Issue: QR code not showing
**Solution**:
1. Make sure `react-qr-code` is installed: `npm install react-qr-code`
2. Check console for errors

## Development Workflow

### Testing Multi-Player Locally

Use different browsers/windows:
- **Host (you)**: Regular Chrome/Firefox window, signed in with Clerk
- **Player 1**: Chrome Incognito window
- **Player 2**: Firefox Private window
- **Player 3**: Mobile phone on same WiFi network

### Recommended Testing Order

1. ✅ Create game as host
2. ✅ Join with 2-3 players
3. ✅ Verify real-time player list updates
4. ✅ Start game
5. ✅ Submit content from each player
6. ✅ Watch submission count update
7. ✅ Test different game modes
8. ⏳ (Future) Test reveals and voting

## Next Steps

Once basic functionality is working:

1. **Add Reveal Animations**: Implement the reveal screen with Framer Motion
2. **Build Voting UI**: Allow players to guess who wrote what
3. **Implement Scoring**: Track and display scores
4. **Add Game Results**: Show final standings and highlights
5. **Deploy to Vercel**: Share with your family!

## Production Deployment Checklist

When ready to deploy:

- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Import GitHub repository to Vercel
- [ ] Add all environment variables to Vercel
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL (e.g., `https://your-game.vercel.app`)
- [ ] Update Clerk allowed origins to include production URL
- [ ] Test entire flow on production
- [ ] Share with family and friends!

## Support

If you run into issues:

1. Check the error message in browser console (F12)
2. Check Supabase logs
3. Check Clerk logs
4. Review this guide again
5. Search for similar issues online

## Tips for Best Experience

- **For TV Display**: Use a laptop connected to TV, or cast your browser
- **For Players**: Share the join URL or QR code via text/email
- **For Testing**: Use ngrok or similar to test on real devices before deploying
- **For Fun**: Test with real family members before Thanksgiving!

Happy Thanksgiving! 🦃🎉
