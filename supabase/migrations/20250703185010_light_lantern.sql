/*
  # Drop and Recreate Prospects Table

  1. Changes
    - Drop existing prospects table and all dependent objects
    - Recreate simplified prospects table for ranking data
    - Remove complex schema dependencies

  2. Warning
    - This will permanently delete all data in prospects and related tables
    - All foreign key relationships will be removed
    - Dependent views and constraints will be dropped
*/

-- Drop the existing prospects table with all dependencies
DROP TABLE IF EXISTS public.prospects CASCADE;

-- Drop related tables that had foreign key dependencies
DROP TABLE IF EXISTS public.prospect_assignments CASCADE;
DROP TABLE IF EXISTS public.scouting_reports CASCADE;
DROP TABLE IF EXISTS public.performance_stats CASCADE;

-- Drop any remaining views that might depend on prospects
DROP VIEW IF EXISTS public.prospects_with_age CASCADE;

-- Recreate the prospects table with aligned columns
CREATE TABLE public.prospects (
    rank            INTEGER      PRIMARY KEY,
    player          TEXT         NOT NULL,
    team            TEXT,
    age             INTEGER,
    highest_level   TEXT,
    position        TEXT,
    eta             INTEGER,
    fv              NUMERIC,
    ingested_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

-- Add public read access policy
CREATE POLICY "Public read access" ON public.prospects
  FOR SELECT USING (true);