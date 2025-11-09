# 🎉 Almost Done! Final Setup Steps

Your environment variables are configured! Now let's set up the database and start the app.

## Step 1: Set Up Database (2 minutes)

You need to run the database schema in Supabase:

### Option A: Using Supabase Dashboard (Recommended)

1. **Open this URL in your browser**:
   ```
   https://ribfikwmgagrxrfxdevo.supabase.co/project/ribfikwmgagrxrfxdevo/sql/new
   ```

2. **Copy the entire contents** of the file `database-schema.sql` in this project

3. **Paste it into the SQL Editor** in your browser

4. **Click the "Run" button** (or press Cmd/Ctrl + Enter)

5. **You should see**: "Success. No rows returned" ✅

6. **Verify tables were created**:
   - Go to Table Editor (left sidebar)
   - You should see 5 tables: `games`, `players`, `submissions`, `votes`, `reactions`

### Option B: Quick verification

If you want to verify tables exist before running the schema:

```bash
node setup-database.js
```

This will show you the direct link to paste the SQL.

## Step 2: Enable Real-time (1 minute)

1. In Supabase dashboard, go to **Database** → **Replication** (left sidebar)

2. Find these tables and toggle them ON:
   - ✅ `games`
   - ✅ `players`
   - ✅ `submissions`
   - ✅ `votes`

3. Click "Enable replication" for each one

## Step 3: Start the App

```bash
npm run dev
```

## Step 4: Test It Out!

1. **Open**: http://localhost:3000
   - You should see the beautiful landing page! 🦃

2. **Click "Create Game - Free"**
   - You'll be redirected to Clerk sign-in
   - Sign up with your email
   - Verify your email

3. **Create Your First Game**:
   - Fill in game name: "Test Thanksgiving 2024"
   - Choose mode: "Both"
   - Click "Create Game"

4. **You'll see**:
   - A QR code
   - A 6-character game code
   - Real-time player list

5. **Test Player Join** (open in incognito/another browser):
   - Go to: http://localhost:3000/join
   - Enter the game code
   - Enter a player name
   - Join the game!

6. **Watch the Magic**:
   - The player appears in the host screen automatically! ✨
   - Add more players
   - Click "Start Game" when ready
   - Players can submit gratitudes/roasts
   - Watch submission counts update in real-time

## Troubleshooting

### "Table already exists" error
- That's fine! It means tables were created successfully before

### Tables not showing in Table Editor
- Make sure you clicked "Run" in the SQL editor
- Check for any red error messages
- Try refreshing the page

### Player join not working
- Make sure real-time is enabled (Step 2)
- Check browser console for errors (F12)
- Verify both windows are open (host + player)

### Authentication issues
- Clear browser cache
- Try incognito mode
- Check that environment variables are correct in `.env.local`

## Next Steps

Once everything is working:

1. **Test the full flow** with multiple players
2. **Try different game modes** (Gratitude, Roast, Both)
3. **Test on mobile** devices on the same WiFi
4. **Deploy to Vercel** when ready for family!

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Check if tables exist (optional)
node setup-database.js

# Build for production
npm run build
```

---

**You're all set! Happy Thanksgiving!** 🦃🎉

Need help? Check the other documentation files:
- [README.md](README.md)
- [SETUP_GUIDE.md](SETUP_GUIDE.md)
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
