-- Kreiva-X-Alfaaz Ticket Booking System Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Admins table
CREATE TABLE IF NOT EXISTS public."Admins" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);

-- Create Guests table (tickets)
CREATE TABLE IF NOT EXISTS public."Guests" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alias TEXT NOT NULL DEFAULT '',
    "altEmail" TEXT NOT NULL DEFAULT '',
    auth_id TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    "isVeg" BOOLEAN DEFAULT NULL,
    locked BOOLEAN NOT NULL DEFAULT false,
    role TEXT NOT NULL DEFAULT '',
    scanned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_uids view
CREATE OR REPLACE VIEW public.admin_uids AS
SELECT id AS admin_uid
FROM public."Admins";

-- Enable Row Level Security
ALTER TABLE public."Admins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Guests" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read admins" ON public."Admins";
DROP POLICY IF EXISTS "Service role full access to admins" ON public."Admins";
DROP POLICY IF EXISTS "Users can read their own tickets" ON public."Guests";
DROP POLICY IF EXISTS "Users can insert their own tickets" ON public."Guests";
DROP POLICY IF EXISTS "Admins can update any ticket" ON public."Guests";
DROP POLICY IF EXISTS "Service role full access to guests" ON public."Guests";
DROP POLICY IF EXISTS "Allow authenticated to insert tickets" ON public."Guests";
DROP POLICY IF EXISTS "Allow authenticated to read tickets" ON public."Guests";
DROP POLICY IF EXISTS "Allow admins full access" ON public."Guests";

-- RLS Policies for Admins table
-- Allow authenticated users to read admins
CREATE POLICY "Allow authenticated users to read admins"
ON public."Admins"
FOR SELECT
TO authenticated
USING (true);

-- Allow service role full access to admins
CREATE POLICY "Service role full access to admins"
ON public."Admins"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS Policies for Guests table
-- Allow authenticated users to read tickets (their own or if they're admin)
CREATE POLICY "Allow authenticated to read tickets"
ON public."Guests"
FOR SELECT
TO authenticated
USING (
    auth.uid()::text = auth_id
    OR auth.uid()::text IN (SELECT admin_uid::text FROM admin_uids)
    OR auth_id = ''
);

-- Allow authenticated users to insert tickets
CREATE POLICY "Allow authenticated to insert tickets"
ON public."Guests"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admins and ticket owners to update tickets
CREATE POLICY "Admins can update any ticket"
ON public."Guests"
FOR UPDATE
TO authenticated
USING (
    auth.uid()::text IN (SELECT admin_uid::text FROM admin_uids)
    OR auth.uid()::text = auth_id
);

-- Allow service role full access to guests
CREATE POLICY "Service role full access to guests"
ON public."Guests"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_email ON public."Guests"(email);
CREATE INDEX IF NOT EXISTS idx_guests_auth_id ON public."Guests"(auth_id);
CREATE INDEX IF NOT EXISTS idx_guests_scanned ON public."Guests"(scanned);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public."Admins" TO anon, authenticated, service_role;
GRANT ALL ON public."Guests" TO anon, authenticated, service_role;
GRANT SELECT ON public.admin_uids TO anon, authenticated, service_role;
