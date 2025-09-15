/*
  # Create minor league players table

  1. New Tables
    - `minor_league_players`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `player_name` (text)
      - `team` (text)
      - `position` (text)
      - `level` (text)
      - `age` (integer)
      - `bats` (text)
      - `throws` (text)
      - `acquisition_date` (date)
      - `acquisition_cost` (numeric)
      - `current_value` (numeric)
      - `status` (text with check constraint)
      - `notes` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `minor_league_players` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS minor_league_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  team text NOT NULL,
  position text NOT NULL,
  level text NOT NULL,
  age integer NOT NULL,
  bats text NOT NULL,
  throws text NOT NULL,
  acquisition_date date NOT NULL,
  acquisition_cost numeric NOT NULL,
  current_value numeric NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'traded', 'released', 'promoted')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE minor_league_players ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own minor league players"
  ON minor_league_players
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own minor league players"
  ON minor_league_players
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own minor league players"
  ON minor_league_players
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own minor league players"
  ON minor_league_players
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_minor_league_players_user_id ON minor_league_players(user_id);