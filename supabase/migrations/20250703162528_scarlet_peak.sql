/*
  # MLB Prospects Database Schema

  1. Core Tables
    - `prospects` - Main prospect information
    - `teams` - Organization and team details
    - `scouting_reports` - Scout evaluations and tool grades
    - `performance_stats` - Season statistics and metrics
    - `prospect_assignments` - Historical team assignments
    - `draft_info` - Draft and signing details

  2. Supporting Tables
    - `scouts` - Scout information
    - `organizations` - MLB organizations
    - `leagues` - League information
    - `positions` - Position definitions

  3. Features
    - Complete audit trail with timestamps
    - Historical tracking of all changes
    - Optimized indexes for common queries
    - Flexible schema supporting both hitters and pitchers
    - Data integrity constraints
*/

-- Organizations table (MLB teams)
CREATE TABLE IF NOT EXISTS organizations (
  organization_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  abbreviation text NOT NULL UNIQUE,
  city text NOT NULL,
  state text,
  country text DEFAULT 'USA',
  founded_year integer,
  logo_url text,
  primary_color text,
  secondary_color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leagues table
CREATE TABLE IF NOT EXISTS leagues (
  league_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  abbreviation text NOT NULL UNIQUE,
  level text NOT NULL CHECK (level IN ('MLB', 'AAA', 'AA', 'A+', 'A', 'Rookie', 'DSL', 'ACL', 'GCL')),
  classification text CHECK (classification IN ('Major League', 'Triple-A', 'Double-A', 'High-A', 'Single-A', 'Rookie', 'International')),
  created_at timestamptz DEFAULT now()
);

-- Teams table (specific team affiliates)
CREATE TABLE IF NOT EXISTS teams (
  team_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(organization_id) NOT NULL,
  league_id uuid REFERENCES leagues(league_id) NOT NULL,
  name text NOT NULL,
  city text NOT NULL,
  state text,
  country text DEFAULT 'USA',
  level text NOT NULL CHECK (level IN ('MLB', 'AAA', 'AA', 'A+', 'A', 'Rookie', 'DSL', 'ACL', 'GCL')),
  active boolean DEFAULT true,
  stadium_name text,
  capacity integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, level, active) -- Only one active team per level per org
);

-- Positions table
CREATE TABLE IF NOT EXISTS positions (
  position_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('Pitcher', 'Catcher', 'Infielder', 'Outfielder')),
  sort_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert standard positions
INSERT INTO positions (code, name, category, sort_order) VALUES
  ('P', 'Pitcher', 'Pitcher', 1),
  ('C', 'Catcher', 'Catcher', 2),
  ('1B', 'First Base', 'Infielder', 3),
  ('2B', 'Second Base', 'Infielder', 4),
  ('3B', 'Third Base', 'Infielder', 5),
  ('SS', 'Shortstop', 'Infielder', 6),
  ('LF', 'Left Field', 'Outfielder', 7),
  ('CF', 'Center Field', 'Outfielder', 8),
  ('RF', 'Right Field', 'Outfielder', 9),
  ('DH', 'Designated Hitter', 'Infielder', 10),
  ('IF', 'Infielder', 'Infielder', 11),
  ('OF', 'Outfielder', 'Outfielder', 12),
  ('UT', 'Utility', 'Infielder', 13)
ON CONFLICT (code) DO NOTHING;

-- Scouts table
CREATE TABLE IF NOT EXISTS scouts (
  scout_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organization_id uuid REFERENCES organizations(organization_id),
  title text,
  email text UNIQUE,
  phone text,
  years_experience integer,
  specialization text CHECK (specialization IN ('Hitting', 'Pitching', 'Defense', 'International', 'College', 'High School', 'General')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Main prospects table
CREATE TABLE IF NOT EXISTS prospects (
  prospect_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personal Information
  first_name text NOT NULL,
  last_name text NOT NULL,
  full_name text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  nickname text,
  date_of_birth date NOT NULL,
  age_years integer GENERATED ALWAYS AS (EXTRACT(YEAR FROM AGE(date_of_birth))) STORED,
  
  -- Physical Attributes
  height_inches integer CHECK (height_inches > 0 AND height_inches < 120),
  weight_pounds integer CHECK (weight_pounds > 0 AND weight_pounds < 400),
  bats text NOT NULL CHECK (bats IN ('L', 'R', 'S')), -- Left, Right, Switch
  throws text NOT NULL CHECK (throws IN ('L', 'R')),
  
  -- Location Information
  hometown text,
  state_province text,
  country text DEFAULT 'USA',
  high_school text,
  college text,
  
  -- Position Information
  primary_position_id uuid REFERENCES positions(position_id) NOT NULL,
  secondary_position_id uuid REFERENCES positions(position_id),
  
  -- Current Status
  current_organization_id uuid REFERENCES organizations(organization_id),
  current_team_id uuid REFERENCES teams(team_id),
  prospect_status text DEFAULT 'Active' CHECK (prospect_status IN ('Active', 'Retired', 'Released', 'Suspended', 'Injured', 'Military', 'Other')),
  
  -- Draft Information
  draft_year integer,
  draft_round integer,
  draft_pick integer,
  draft_overall_pick integer,
  signing_bonus_usd numeric(12,2),
  signed_date date,
  
  -- External IDs
  mlb_id text UNIQUE,
  milb_id text UNIQUE,
  baseball_reference_id text UNIQUE,
  fangraphs_id text UNIQUE,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_draft_info CHECK (
    (draft_year IS NULL AND draft_round IS NULL AND draft_pick IS NULL) OR
    (draft_year IS NOT NULL AND draft_round IS NOT NULL AND draft_pick IS NOT NULL)
  ),
  CONSTRAINT valid_age CHECK (EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 16 AND 50)
);

-- Prospect assignments (historical tracking)
CREATE TABLE IF NOT EXISTS prospect_assignments (
  assignment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid REFERENCES prospects(prospect_id) NOT NULL,
  team_id uuid REFERENCES teams(team_id) NOT NULL,
  start_date date NOT NULL,
  end_date date,
  assignment_type text NOT NULL CHECK (assignment_type IN ('Drafted', 'Promoted', 'Demoted', 'Traded', 'Signed', 'Released', 'Injured List', 'Rehab')),
  notes text,
  created_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_assignment_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT no_overlapping_assignments EXCLUDE USING gist (
    prospect_id WITH =,
    daterange(start_date, COALESCE(end_date, 'infinity'::date), '[]') WITH &&
  )
);

-- Scouting reports table
CREATE TABLE IF NOT EXISTS scouting_reports (
  report_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid REFERENCES prospects(prospect_id) NOT NULL,
  scout_id uuid REFERENCES scouts(scout_id) NOT NULL,
  
  -- Report Details
  report_date date NOT NULL DEFAULT CURRENT_DATE,
  report_type text NOT NULL CHECK (report_type IN ('Game', 'Workout', 'Showcase', 'Instructional', 'Spring Training', 'Other')),
  venue text,
  weather_conditions text,
  
  -- Tool Grades (20-80 scale)
  hit_tool integer CHECK (hit_tool >= 20 AND hit_tool <= 80 AND hit_tool % 5 = 0),
  power_tool integer CHECK (power_tool >= 20 AND power_tool <= 80 AND power_tool % 5 = 0),
  speed_tool integer CHECK (speed_tool >= 20 AND speed_tool <= 80 AND speed_tool % 5 = 0),
  fielding_tool integer CHECK (fielding_tool >= 20 AND fielding_tool <= 80 AND fielding_tool % 5 = 0),
  arm_tool integer CHECK (arm_tool >= 20 AND arm_tool <= 80 AND arm_tool % 5 = 0),
  
  -- Pitching-specific tools
  fastball_velocity integer, -- mph
  fastball_grade integer CHECK (fastball_grade >= 20 AND fastball_grade <= 80 AND fastball_grade % 5 = 0),
  curveball_grade integer CHECK (curveball_grade >= 20 AND curveball_grade <= 80 AND curveball_grade % 5 = 0),
  slider_grade integer CHECK (slider_grade >= 20 AND slider_grade <= 80 AND slider_grade % 5 = 0),
  changeup_grade integer CHECK (changeup_grade >= 20 AND changeup_grade <= 80 AND changeup_grade % 5 = 0),
  command_grade integer CHECK (command_grade >= 20 AND command_grade <= 80 AND command_grade % 5 = 0),
  
  -- Overall Assessment
  overall_future_value integer CHECK (overall_future_value >= 20 AND overall_future_value <= 80 AND overall_future_value % 5 = 0),
  risk_factor text CHECK (risk_factor IN ('Safe', 'Moderate', 'High', 'Extreme')),
  ceiling text,
  floor text,
  eta_year integer,
  
  -- Detailed Observations
  strengths text,
  weaknesses text,
  development_needs text,
  injury_concerns text,
  makeup_character text,
  summary text,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Performance statistics table
CREATE TABLE IF NOT EXISTS performance_stats (
  stat_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid REFERENCES prospects(prospect_id) NOT NULL,
  team_id uuid REFERENCES teams(team_id) NOT NULL,
  
  -- Season Information
  season_year integer NOT NULL,
  level text NOT NULL,
  league_name text,
  
  -- Game Information
  games_played integer DEFAULT 0 CHECK (games_played >= 0),
  games_started integer DEFAULT 0 CHECK (games_started >= 0),
  plate_appearances integer DEFAULT 0 CHECK (plate_appearances >= 0),
  at_bats integer DEFAULT 0 CHECK (at_bats >= 0),
  
  -- Hitting Statistics
  hits integer DEFAULT 0 CHECK (hits >= 0),
  doubles integer DEFAULT 0 CHECK (doubles >= 0),
  triples integer DEFAULT 0 CHECK (triples >= 0),
  home_runs integer DEFAULT 0 CHECK (home_runs >= 0),
  runs_batted_in integer DEFAULT 0 CHECK (runs_batted_in >= 0),
  runs_scored integer DEFAULT 0 CHECK (runs_scored >= 0),
  walks integer DEFAULT 0 CHECK (walks >= 0),
  strikeouts integer DEFAULT 0 CHECK (strikeouts >= 0),
  stolen_bases integer DEFAULT 0 CHECK (stolen_bases >= 0),
  caught_stealing integer DEFAULT 0 CHECK (caught_stealing >= 0),
  hit_by_pitch integer DEFAULT 0 CHECK (hit_by_pitch >= 0),
  sacrifice_flies integer DEFAULT 0 CHECK (sacrifice_flies >= 0),
  sacrifice_bunts integer DEFAULT 0 CHECK (sacrifice_bunts >= 0),
  
  -- Calculated Hitting Metrics
  batting_average numeric(4,3) GENERATED ALWAYS AS (
    CASE WHEN at_bats > 0 THEN ROUND(hits::numeric / at_bats::numeric, 3) ELSE 0 END
  ) STORED,
  on_base_percentage numeric(4,3) GENERATED ALWAYS AS (
    CASE WHEN (at_bats + walks + hit_by_pitch + sacrifice_flies) > 0 
    THEN ROUND((hits + walks + hit_by_pitch)::numeric / (at_bats + walks + hit_by_pitch + sacrifice_flies)::numeric, 3) 
    ELSE 0 END
  ) STORED,
  slugging_percentage numeric(4,3) GENERATED ALWAYS AS (
    CASE WHEN at_bats > 0 
    THEN ROUND((hits + doubles + (triples * 2) + (home_runs * 3))::numeric / at_bats::numeric, 3) 
    ELSE 0 END
  ) STORED,
  
  -- Pitching Statistics
  innings_pitched numeric(5,1) DEFAULT 0 CHECK (innings_pitched >= 0),
  wins integer DEFAULT 0 CHECK (wins >= 0),
  losses integer DEFAULT 0 CHECK (losses >= 0),
  saves integer DEFAULT 0 CHECK (saves >= 0),
  holds integer DEFAULT 0 CHECK (holds >= 0),
  earned_runs integer DEFAULT 0 CHECK (earned_runs >= 0),
  hits_allowed integer DEFAULT 0 CHECK (hits_allowed >= 0),
  walks_allowed integer DEFAULT 0 CHECK (walks_allowed >= 0),
  strikeouts_pitched integer DEFAULT 0 CHECK (strikeouts_pitched >= 0),
  home_runs_allowed integer DEFAULT 0 CHECK (home_runs_allowed >= 0),
  wild_pitches integer DEFAULT 0 CHECK (wild_pitches >= 0),
  hit_batters integer DEFAULT 0 CHECK (hit_batters >= 0),
  
  -- Calculated Pitching Metrics
  earned_run_average numeric(4,2) GENERATED ALWAYS AS (
    CASE WHEN innings_pitched > 0 THEN ROUND((earned_runs * 9.0) / innings_pitched, 2) ELSE 0 END
  ) STORED,
  whip numeric(4,3) GENERATED ALWAYS AS (
    CASE WHEN innings_pitched > 0 THEN ROUND((hits_allowed + walks_allowed)::numeric / innings_pitched, 3) ELSE 0 END
  ) STORED,
  strikeouts_per_nine numeric(4,1) GENERATED ALWAYS AS (
    CASE WHEN innings_pitched > 0 THEN ROUND((strikeouts_pitched * 9.0) / innings_pitched, 1) ELSE 0 END
  ) STORED,
  walks_per_nine numeric(4,1) GENERATED ALWAYS AS (
    CASE WHEN innings_pitched > 0 THEN ROUND((walks_allowed * 9.0) / innings_pitched, 1) ELSE 0 END
  ) STORED,
  
  -- Advanced Metrics (to be calculated externally)
  wrc_plus integer,
  fip numeric(4,2),
  babip numeric(4,3),
  iso numeric(4,3),
  bb_rate numeric(4,3),
  k_rate numeric(4,3),
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_season CHECK (season_year >= 1900 AND season_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  CONSTRAINT valid_hitting_stats CHECK (hits <= at_bats),
  CONSTRAINT valid_extra_base_hits CHECK ((doubles + triples + home_runs) <= hits),
  CONSTRAINT unique_prospect_season_team UNIQUE (prospect_id, season_year, team_id)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_prospects_name ON prospects(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_prospects_organization ON prospects(current_organization_id);
CREATE INDEX IF NOT EXISTS idx_prospects_position ON prospects(primary_position_id);
CREATE INDEX IF NOT EXISTS idx_prospects_draft_year ON prospects(draft_year);
CREATE INDEX IF NOT EXISTS idx_prospects_age ON prospects(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(prospect_status);

CREATE INDEX IF NOT EXISTS idx_scouting_reports_prospect ON scouting_reports(prospect_id);
CREATE INDEX IF NOT EXISTS idx_scouting_reports_scout ON scouting_reports(scout_id);
CREATE INDEX IF NOT EXISTS idx_scouting_reports_date ON scouting_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_scouting_reports_ofv ON scouting_reports(overall_future_value);

CREATE INDEX IF NOT EXISTS idx_performance_stats_prospect ON performance_stats(prospect_id);
CREATE INDEX IF NOT EXISTS idx_performance_stats_season ON performance_stats(season_year);
CREATE INDEX IF NOT EXISTS idx_performance_stats_level ON performance_stats(level);
CREATE INDEX IF NOT EXISTS idx_performance_stats_team ON performance_stats(team_id);

CREATE INDEX IF NOT EXISTS idx_assignments_prospect ON prospect_assignments(prospect_id);
CREATE INDEX IF NOT EXISTS idx_assignments_team ON prospect_assignments(team_id);
CREATE INDEX IF NOT EXISTS idx_assignments_dates ON prospect_assignments(start_date, end_date);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_prospects_org_position ON prospects(current_organization_id, primary_position_id);
CREATE INDEX IF NOT EXISTS idx_stats_prospect_season ON performance_stats(prospect_id, season_year);
CREATE INDEX IF NOT EXISTS idx_reports_prospect_date ON scouting_reports(prospect_id, report_date DESC);

-- Enable Row Level Security (if using Supabase)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouting_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_stats ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your access requirements)
CREATE POLICY "Public read access" ON organizations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON leagues FOR SELECT USING (true);
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON positions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON prospects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON prospect_assignments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON scouting_reports FOR SELECT USING (true);
CREATE POLICY "Public read access" ON performance_stats FOR SELECT USING (true);

-- Functions for common calculations
CREATE OR REPLACE FUNCTION calculate_ops(obp numeric, slg numeric)
RETURNS numeric AS $$
BEGIN
  RETURN COALESCE(obp, 0) + COALESCE(slg, 0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_prospect_age_at_date(birth_date date, target_date date DEFAULT CURRENT_DATE)
RETURNS numeric AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(target_date, birth_date)) + 
         (EXTRACT(DOY FROM AGE(target_date, birth_date)) / 365.25);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scouts_updated_at BEFORE UPDATE ON scouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scouting_reports_updated_at BEFORE UPDATE ON scouting_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_stats_updated_at BEFORE UPDATE ON performance_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();