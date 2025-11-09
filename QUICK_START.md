# Quick Start Guide

You're seeing the "Publishable key not valid" error because the environment variables aren't configured yet. Follow these steps to get the app running:

## Option 1: Quick Test (Skip Authentication for Now)

If you just want to see the app running without setting up services:

1. **Temporarily disable Clerk middleware**:

Create a file `middleware.ts.backup`:
```bash
mv middleware.ts middleware.ts.backup
```

2. **Create a simpler middleware**:
```bash
cat > middleware.ts << 'EOF'
import { NextResponse } from 'next/server';

export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
};
EOF
```

3. **Restart the dev server**:
```bash
npm run dev
```

4. **Visit**: http://localhost:3000

**Note**: This will let you see the landing page, but game creation won't work without proper setup.

## Option 2: Full Setup (Recommended)

### Step 1: Set Up Supabase (5 minutes)

1. Go to https://supabase.com and create account
2. Click "New Project"
3. Fill in:
   - Name: `thanksgiving-game`
   - Database Password: (create a strong password)
   - Region: (choose closest)
4. Wait 2 minutes for project to be ready
5. Go to **Settings** → **API**
6. Copy these values:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key
7. Go to **SQL Editor** → **New Query**
8. Copy all content from `database-schema.sql` and paste it
9. Click **Run**
10. Go to **Database** → **Replication** and enable Realtime for all tables

### Step 2: Set Up Clerk (3 minutes)

1. Go to https://clerk.com and create account
2. Click "Create Application"
3. Application name: `Thanksgiving Game`
4. Select: **Email** authentication
5. Click "Create Application"
6. Copy both keys shown:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)

### Step 3: Configure Environment Variables

1. Open `.env.local` in your editor
2. Replace the placeholder values:

```env
# Clerk Authentication (from Step 2)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase (from Step 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Save the file

### Step 4: Run the App

```bash
npm run dev
```

Visit http://localhost:3000

## Testing the Full Flow

### As Host:
1. Click "Create Game - Free"
2. Sign up with your email
3. Create a new game
4. You'll see a QR code and game code

### As Player (use another browser/incognito window):
1. Go to http://localhost:3000/join
2. Enter the game code
3. Enter your name
4. Submit gratitudes/roasts

### Watch Real-time Updates:
- Keep both windows open
- Add multiple players
- Watch the host screen update automatically
- Start the game
- Submit content from players
- See submission counts update in real-time

## Troubleshooting

### "Publishable key not valid"
- You need to complete Step 2 (Clerk setup)
- Make sure you copied the keys correctly
- Restart dev server after adding keys

### "Invalid supabaseUrl"
- You need to complete Step 1 (Supabase setup)
- Make sure URL starts with `https://` and ends with `.supabase.co`
- Restart dev server after adding URL

### Page not loading
- Make sure dev server is running (`npm run dev`)
- Check terminal for error messages
- Try clearing browser cache

### Database errors
- Make sure you ran the complete `database-schema.sql` script
- Check Supabase dashboard → Logs for errors

## Next Steps

Once you have the basic flow working:

1. Test with multiple devices on same WiFi
2. Try different game modes
3. Test all features
4. Deploy to Vercel when ready!

## Need Help?

Check the detailed guides:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup with screenshots
- [README.md](README.md) - Project overview
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Full documentation

---

Happy Thanksgiving! 🦃
