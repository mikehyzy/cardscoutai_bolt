/*
  # Add raw_scans table for card scanning feature

  1. New Tables
    - `raw_scans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `image_url` (text)
      - `scan_result` (jsonb)
      - `confidence_score` (numeric)
      - `processed` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `raw_scans` table
    - Add policy for authenticated users to manage their own scans
*/

CREATE TABLE IF NOT EXISTS raw_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  image_url text,
  scan_result jsonb,
  confidence_score numeric,
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE raw_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scans" ON raw_scans
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_raw_scans_user_id ON raw_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_raw_scans_processed ON raw_scans(processed);