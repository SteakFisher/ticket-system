# Migration Guide: Supabase to Drizzle + PostgreSQL

This project has been migrated from Supabase to Drizzle ORM with PostgreSQL and NextAuth.

## What Changed

- ❌ **Removed**: Supabase (auth, database, RLS)
- ✅ **Added**: Drizzle ORM for database
- ✅ **Added**: NextAuth v5 for authentication
- ✅ **Added**: Server Actions for mutations
- ✅ **Added**: Server Components for data fetching

## Prerequisites

1. **PostgreSQL Database** - You can use:
   - Local PostgreSQL installation
   - [Neon](https://neon.tech) (recommended, free tier available)
   - [Supabase](https://supabase.com) (just use the PostgreSQL connection, not their SDK)
   - [Railway](https://railway.app)
   - Any other PostgreSQL provider

2. **Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or use existing
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (add production URL later)

## Setup Steps

### 1. Install Dependencies

Already done if you pulled the code. If not:

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database - Get this from your PostgreSQL provider
DATABASE_URL=postgresql://user:password@host:5432/database_name

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run-this-command-openssl-rand-base64-32

# Google OAuth - Get from Google Cloud Console
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# App URL
NEXT_PUBLIC_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Push Database Schema

This will create all tables in your PostgreSQL database:

```bash
npm run db:push
```

This creates:
- `user` - NextAuth users
- `account` - OAuth accounts
- `session` - User sessions
- `verificationToken` - Email verification
- `admins` - Admin users
- `guests` - Tickets

### 4. Add Yourself as Admin

After running the app once and logging in, you need to manually add yourself as an admin:

**Option 1: Using Drizzle Studio (easiest)**
```bash
npm run db:studio
```
This opens a GUI at `http://localhost:4983`. 
1. Go to the `user` table and copy your user ID
2. Go to the `admins` table
3. Click "Add Row"
4. Paste your user ID in the `id` field
5. Save

**Option 2: Using SQL**
```sql
-- First, get your user ID
SELECT id, email FROM "user";

-- Then insert into admins table (replace 'your-user-id' with actual ID)
INSERT INTO admins (id) VALUES ('your-user-id');
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

### Tables

#### `user` (NextAuth)
- `id` - User ID (text, primary key)
- `name` - User name
- `email` - User email
- `emailVerified` - Email verification timestamp
- `image` - Profile image URL

#### `admins`
- `id` - References user.id
- `created_at` - When admin was added

#### `guests` (Tickets)
- `id` - Ticket ID (UUID)
- `alias` - Guest name
- `alt_email` - Alternative email
- `auth_id` - User who created the ticket
- `email` - Primary email
- `is_veg` - Vegetarian preference
- `locked` - Whether ticket is finalized
- `role` - Guest role/designation
- `scanned` - Whether ticket was scanned at entry
- `created_at` - Creation timestamp

## Key Differences from Supabase Version

### Authentication
- **Before**: Supabase Auth with `supabase.auth.signInWithOAuth()`
- **After**: NextAuth with `signIn("google")`

### Data Fetching
- **Before**: Supabase client in components `supabase.from("Guests").select()`
- **After**: Server components with Drizzle queries `db.query.guests.findMany()`

### Mutations
- **Before**: Direct Supabase client calls
- **After**: Server actions in `src/actions/tickets.ts`

### Authorization
- **Before**: Row Level Security (RLS) policies
- **After**: Programmatic checks in server actions/components

## Production Deployment

### Environment Variables

Add these to your production environment (Vercel/Railway/etc):

```env
DATABASE_URL=your-production-postgresql-url
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_URL=https://yourdomain.com
```

### Google OAuth Callback

Add your production callback URL to Google Cloud Console:
```
https://yourdomain.com/api/auth/callback/google
```

## Troubleshooting

### "DATABASE_URL is not set"
- Make sure `.env.local` exists with valid `DATABASE_URL`
- Restart your dev server

### "Invalid connection string"
- Check your PostgreSQL connection string format
- Should be: `postgresql://user:password@host:port/database`

### Can't create tickets / See admin pages
- Make sure you added your user ID to the `admins` table
- Check browser console for errors

### Google OAuth not working
- Verify redirect URI in Google Cloud Console matches exactly
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure `NEXTAUTH_URL` matches your current URL

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:generate  # Generate migrations
```

## Need Help?

Check these files:
- `src/db/schema.ts` - Database schema
- `src/actions/tickets.ts` - Server actions
- `src/auth.ts` - NextAuth configuration
- `drizzle.config.ts` - Drizzle configuration