# Grateful & Roasted - Thanksgiving Family Game Platform

A comprehensive Next.js web application for families to play interactive gratitude and roasting games during Thanksgiving. Features anonymous submissions, real-time reveals, multiple game modes, and is optimized for both mobile input and TV/large screen display.

## Features

- **Landing Page**: Beautiful, conversion-optimized landing page with clear CTAs
- **Game Creation**: Easy game setup with customizable modes (Gratitude, Roast, or Both)
- **QR Code Join**: Players scan QR codes to join instantly - no app download needed
- **Anonymous Submissions**: Players submit gratitudes or roasts completely anonymously
- **Real-time Updates**: Live player counts and submission tracking using Supabase Realtime
- **Dual-Screen Experience**:
  - TV/Large screen for game display and reveals
  - Mobile phones for player input and voting
- **Multiple Game Modes**:
  - Gratitude Only: Share what you're thankful for
  - Roast Only: Playfully roast family members
  - Both: Mix heartfelt moments with playful fun

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Real-time**: Supabase Realtime subscriptions
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **QR Codes**: react-qr-code
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier is fine)
- Clerk account (free tier is fine)

### 1. Clone and Install

```bash
cd thanksgiving-game
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your keys
3. Go to SQL Editor and run the SQL script in `database-schema.sql`

### 3. Set Up Clerk

1. Create a new application at [clerk.com](https://clerk.com)
2. Go to API Keys to get your keys
3. Enable Email/Password authentication (or your preferred method)

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── games/          # Game creation and management API routes
│   ├── dashboard/          # Host dashboard for managing games
│   ├── game/
│   │   └── [gameId]/
│   │       ├── page.tsx    # Host game screen (TV display)
│   │       └── play/
│   │           └── page.tsx # Player game screen (mobile)
│   ├── join/
│   │   ├── page.tsx        # Game code entry
│   │   └── [code]/
│   │       └── page.tsx    # Join specific game
│   ├── layout.tsx          # Root layout with Clerk provider
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── game/               # Game-specific components
├── lib/
│   ├── supabase.ts         # Supabase client configuration
│   └── utils.ts            # Utility functions
├── types/
│   └── database.ts         # TypeScript types for database
├── database-schema.sql     # Database schema and setup
├── middleware.ts           # Clerk authentication middleware
└── .env.example            # Environment variables template
```

## User Flow

### For Hosts:

1. Visit homepage and click "Create Game"
2. Sign in with Clerk (optional, but recommended for game management)
3. Fill in game details and select mode
4. Share QR code or game code with players
5. Wait for players to join
6. Start the game when ready
7. Control game flow through dashboard

### For Players:

1. Scan QR code or visit join page and enter game code
2. Enter your name (no account required)
3. Wait for host to start the game
4. Submit gratitudes/roasts anonymously
5. Watch the big screen for reveals
6. Vote on who wrote what
7. See final results

## Database Schema

The app uses 5 main tables:

- **games**: Store game sessions
- **players**: Track players in each game
- **submissions**: Store gratitudes and roasts
- **votes**: Record player guesses
- **reactions**: Emoji reactions to submissions

See `database-schema.sql` for complete schema with indexes and Row Level Security policies.

## Features Completed

✅ Landing page with hero section and CTAs
✅ User authentication with Clerk
✅ Game creation flow
✅ Host dashboard
✅ QR code generation for easy joining
✅ Player join experience
✅ Anonymous submission interface
✅ Real-time player updates
✅ Dual-screen optimization (TV + Mobile)
✅ Multiple game modes

## Features In Progress / TODO

⏳ Reveal screen with animations (using Framer Motion)
⏳ Voting mechanics and UI
⏳ Guessing game functionality
⏳ Scoring and leaderboard
⏳ Game results and statistics
⏳ Reaction system
⏳ Game history and replay
⏳ Advanced game settings
⏳ Social sharing features

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXT_PUBLIC_APP_URL` to your production URL
5. Deploy!

### Post-Deployment

1. Update Clerk allowed origins to include your production URL
2. Update Supabase URL redirects if needed
3. Test the full flow with multiple devices

## Development Tips

- Use the React DevTools to debug component state
- Check Supabase dashboard for real-time database activity
- Monitor Clerk dashboard for authentication issues
- Test with multiple browser windows/devices for the full multiplayer experience

## Contributing

This is a personal/family project, but suggestions and bug reports are welcome!

## License

MIT License - feel free to use this for your own family gatherings!

## Support

For questions or issues, please open an issue on GitHub.

---

Made with ❤️ for families everywhere. Happy Thanksgiving! 🦃
