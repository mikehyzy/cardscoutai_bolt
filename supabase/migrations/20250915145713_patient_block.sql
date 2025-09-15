/*
  # Create minor league stats table

  1. New Tables
    - `minor_league_stats`
      - `id` (uuid, primary key)
      - `player_id` (uuid, foreign key to minor_league_players)
      - `season` (integer)
      - `level` (text)
      - `team` (text)
      - `games` (integer)
      - `at_bats` (integer)
      - `hits` (integer)
      - `doubles` (integer)
      - `triples` (integer)
      - `home_runs` (integer)
      - `rbis` (integer)
      - `runs` (integer)
      - `walks` (integer)
      - `strikeouts` (integer)
      - `stolen_bases` (integer)
      - `batting_average` (numeric)
      - `on_base_percentage` (numeric)
      - `slugging_percentage` (numeric)
      - `ops` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `minor_league_stats` table
    - Add policies for authenticated users to manage stats for their own players

  3. Constraints
    - Unique constraint on player_id, season, level to prevent duplicate stats
*/

CREATE TABLE IF NOT EXISTS minor_league_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES minor_league_players(id) ON DELETE CASCADE,
  season integer NOT NULL,
  level text NOT NULL,
  team text NOT NULL,
  games integer DEFAULT 0,
  at_bats integer DEFAULT 0,
  hits integer DEFAULT 0,
  doubles integer DEFAULT 0,
  triples integer DEFAULT 0,
  home_runs integer DEFAULT 0,
  rbis integer DEFAULT 0,
  runs integer DEFAULT 0,
  walks integer DEFAULT 0,
  strikeouts integer DEFAULT 0,
  stolen_bases integer DEFAULT 0,
  batting_average numeric DEFAULT 0,
  on_base_percentage numeric DEFAULT 0,
  slugging_percentage numeric DEFAULT 0,
  ops numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(player_id, season, level)
);

-- Enable RLS
ALTER TABLE minor_league_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read stats for own players"
  ON minor_league_stats
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM minor_league_players 
      WHERE minor_league_players.id = minor_league_stats.player_id 
      AND minor_league_players.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert stats for own players"
  ON minor_league_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM minor_league_players 
      WHERE minor_league_players.id = minor_league_stats.player_id 
      AND minor_league_players.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update stats for own players"
  ON minor_league_stats
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM minor_league_players 
      WHERE minor_league_players.id = minor_league_stats.player_id 
      AND minor_league_players.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM minor_league_players 
      WHERE minor_league_players.id = minor_league_stats.player_id 
      AND minor_league_players.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete stats for own players"
  ON minor_league_stats
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM minor_league_players 
      WHERE minor_league_players.id = minor_league_stats.player_id 
      AND minor_league_players.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_minor_league_stats_player_id ON minor_league_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_minor_league_stats_season ON minor_league_stats(season);