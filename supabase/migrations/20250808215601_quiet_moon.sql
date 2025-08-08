/*
  # Add Minor League Players Table

  1. New Tables
    - `minor_league_players`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
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
      - `status` (text)
      - `created_at` (timestamp)

    - `minor_league_stats`
      - `id` (uuid, primary key)
      - `player_id` (uuid, foreign key)
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
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create minor league players table
CREATE TABLE IF NOT EXISTS minor_league_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  player_name text NOT NULL,
  team text NOT NULL,
  position text NOT NULL,
  level text NOT NULL CHECK (level IN ('Rookie', 'A', 'A+', 'AA', 'AAA')),
  age integer CHECK (age >= 16 AND age <= 35),
  bats text CHECK (bats IN ('L', 'R', 'S')),
  throws text CHECK (throws IN ('L', 'R')),
  acquisition_date date NOT NULL,
  acquisition_cost numeric NOT NULL DEFAULT 0,
  current_value numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'traded', 'released', 'promoted')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create minor league stats table
CREATE TABLE IF NOT EXISTS minor_league_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES minor_league_players(id) ON DELETE CASCADE NOT NULL,
  season integer NOT NULL,
  level text NOT NULL,
  team text NOT NULL,
  games integer DEFAULT 0 CHECK (games >= 0),
  at_bats integer DEFAULT 0 CHECK (at_bats >= 0),
  hits integer DEFAULT 0 CHECK (hits >= 0),
  doubles integer DEFAULT 0 CHECK (doubles >= 0),
  triples integer DEFAULT 0 CHECK (triples >= 0),
  home_runs integer DEFAULT 0 CHECK (home_runs >= 0),
  rbis integer DEFAULT 0 CHECK (rbis >= 0),
  runs integer DEFAULT 0 CHECK (runs >= 0),
  walks integer DEFAULT 0 CHECK (walks >= 0),
  strikeouts integer DEFAULT 0 CHECK (strikeouts >= 0),
  stolen_bases integer DEFAULT 0 CHECK (stolen_bases >= 0),
  batting_average numeric(4,3) DEFAULT 0,
  on_base_percentage numeric(4,3) DEFAULT 0,
  slugging_percentage numeric(4,3) DEFAULT 0,
  ops numeric(4,3) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(player_id, season, level)
);

-- Enable Row Level Security
ALTER TABLE minor_league_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE minor_league_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own minor league players" ON minor_league_players
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own minor league stats" ON minor_league_stats
  FOR ALL TO authenticated
  USING (auth.uid() = (SELECT user_id FROM minor_league_players WHERE id = player_id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_minor_league_players_user_id ON minor_league_players(user_id);
CREATE INDEX IF NOT EXISTS idx_minor_league_players_status ON minor_league_players(status);
CREATE INDEX IF NOT EXISTS idx_minor_league_players_level ON minor_league_players(level);
CREATE INDEX IF NOT EXISTS idx_minor_league_stats_player_id ON minor_league_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_minor_league_stats_season ON minor_league_stats(season);

-- Insert sample data
INSERT INTO minor_league_players (user_id, player_name, team, position, level, age, bats, throws, acquisition_date, acquisition_cost, current_value, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Miguel Santos', 'Tampa Bay Rays', 'SS', 'AA', 22, 'R', 'R', '2024-01-10', 500, 750, 'active'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Jake Thompson', 'Los Angeles Dodgers', 'OF', 'A+', 20, 'L', 'L', '2024-02-15', 300, 450, 'active'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Carlos Rodriguez', 'Atlanta Braves', '3B', 'AAA', 24, 'R', 'R', '2023-12-20', 800, 650, 'active'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Tommy Wilson', 'San Diego Padres', 'C', 'A', 19, 'S', 'R', '2024-03-01', 200, 350, 'active'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Alex Martinez', 'Houston Astros', 'P', 'AA', 23, 'L', 'L', '2024-01-25', 600, 800, 'active')
ON CONFLICT DO NOTHING;

-- Insert sample stats
INSERT INTO minor_league_stats (player_id, season, level, team, games, at_bats, hits, doubles, triples, home_runs, rbis, runs, walks, strikeouts, stolen_bases, batting_average, on_base_percentage, slugging_percentage, ops) VALUES
  ((SELECT id FROM minor_league_players WHERE player_name = 'Miguel Santos' LIMIT 1), 2024, 'AA', 'Montgomery Biscuits', 85, 320, 92, 18, 3, 12, 48, 55, 35, 78, 15, 0.288, 0.356, 0.469, 0.825),
  ((SELECT id FROM minor_league_players WHERE player_name = 'Jake Thompson' LIMIT 1), 2024, 'A+', 'Great Lakes Loons', 95, 380, 108, 22, 5, 8, 52, 68, 42, 85, 25, 0.284, 0.358, 0.421, 0.779),
  ((SELECT id FROM minor_league_players WHERE player_name = 'Carlos Rodriguez' LIMIT 1), 2024, 'AAA', 'Gwinnett Stripers', 78, 295, 78, 15, 2, 15, 45, 42, 28, 72, 8, 0.264, 0.328, 0.458, 0.786),
  ((SELECT id FROM minor_league_players WHERE player_name = 'Tommy Wilson' LIMIT 1), 2024, 'A', 'Lake Elsinore Storm', 65, 245, 68, 12, 1, 6, 32, 35, 25, 58, 12, 0.278, 0.342, 0.396, 0.738),
  ((SELECT id FROM minor_league_players WHERE player_name = 'Alex Martinez' LIMIT 1), 2024, 'AA', 'Corpus Christi Hooks', 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.000, 0.000, 0.000, 0.000)
ON CONFLICT DO NOTHING;

-- Add pitching stats for Alex Martinez (pitcher)
INSERT INTO minor_league_stats (player_id, season, level, team, games, at_bats, hits, doubles, triples, home_runs, rbis, runs, walks, strikeouts, stolen_bases, batting_average, on_base_percentage, slugging_percentage, ops) VALUES
  ((SELECT id FROM minor_league_players WHERE player_name = 'Alex Martinez' LIMIT 1), 2024, 'AA', 'Corpus Christi Hooks', 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.000, 0.000, 0.000, 0.000)
ON CONFLICT (player_id, season, level) DO NOTHING;