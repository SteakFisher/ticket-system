# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Clone & Install
```bash
git clone <your-repo>
cd ticket-system
npm install
```

### 2. Set Up Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
# Get PostgreSQL URL from Neon.tech (free tier)
DATABASE_URL=postgresql://user:password@host:5432/database

# Generate this: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-here

# Get from Google Cloud Console
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Local dev URL
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. Get PostgreSQL Database (Choose One)

**Option A: Neon.tech (Recommended - Free)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string
4. Paste into `DATABASE_URL` in `.env.local`

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL, then:
DATABASE_URL=postgresql://postgres:password@localhost:5432/ticket_system
```

### 4. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

### 5. Push Database Schema

```bash
npm run db:push
```

This creates all required tables in your database.

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Make Yourself Admin

**First, sign in with Google once, then:**

```bash
npm run db:studio
```

This opens Drizzle Studio at `http://localhost:4983`

1. Click on the `user` table
2. Copy your `id` (you'll see your email there)
3. Click on the `admins` table
4. Click "Add Row"
5. Paste your user ID in the `id` field
6. Save

**That's it! You're now an admin.**

---

## 📋 Features Overview

### Regular Users Can:
- ✅ Sign in with Google
- ✅ Create one ticket
- ✅ View their ticket with QR code
- ✅ Share ticket via link

### Admins Can:
- ✅ Create multiple tickets for guests
- ✅ View all tickets created
- ✅ Scan QR codes at entry
- ✅ See scan status in real-time

---

## 🛠️ Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run db:push      # Push schema changes to database
npm run db:studio    # Open database GUI
```

---

## 🚨 Troubleshooting

### "DATABASE_URL is not set"
- Check `.env.local` exists and has valid `DATABASE_URL`
- Restart dev server

### Can't sign in with Google
- Verify redirect URI in Google Console matches exactly
- Check `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are set
- Try in incognito mode

### Can't create tickets / See admin pages
- Make sure you added your user ID to `admins` table
- Sign out and sign in again

### Database connection error
- Verify PostgreSQL is running
- Check connection string format
- Test connection with `npm run db:studio`

---

## 📚 Next Steps

- Read `SETUP.md` for detailed migration info
- Check `src/actions/tickets.ts` for server actions
- Explore `src/db/schema.ts` for database structure
- Deploy to Vercel (see SETUP.md for production config)

---

## 🎯 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Auth**: NextAuth v5
- **UI**: Tailwind CSS + Radix UI
- **Forms**: React Hook Form + Zod

**No more RLS headaches. Just clean server actions and components.**