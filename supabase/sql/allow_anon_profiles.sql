-- Make `profiles` readable by the anon (public) role for development/testing.
-- WARNING: This policy opens the table to anyone with your anon key.
-- Use only for local/dev data or switch to a safer policy afterwards.

-- Enable RLS (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Minimal: allow anon to SELECT any row
CREATE POLICY IF NOT EXISTS "Allow anon to select profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Safer alternative (if `is_public` boolean exists):
-- CREATE POLICY IF NOT EXISTS "Allow anon to select public profiles"
--   ON public.profiles
--   FOR SELECT
--   USING (coalesce(is_public, false) = true);
