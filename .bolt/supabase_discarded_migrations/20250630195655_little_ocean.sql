/*
  # CardScout AI Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `bankroll` (numeric, default 10000)
      - `risk_tolerance` (numeric, default 10)

    - `watchlist`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `player_name` (text)
      - `team` (text)
      - `position` (text)
      - `prospect_rank` (integer)
      - `alert_price` (numeric)
      - `created_at` (timestamp)

    - `inventory`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `card_name` (text)
      - `player_name` (text)
      - `year` (integer)
      - `set_name` (text)
      - `card_number` (text)
      - `grade_company` (text)
      - `grade` (numeric)
      - `purchase_price` (numeric)
      - `current_value` (numeric)
      - `purchase_date` (date)
      - `platform` (text)
      - `status` (text, default 'owned')
      - `created_at` (timestamp)

    - `deals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `card_name` (text)
      - `player_name` (text)
      - `asking_price` (numeric)
      - `market_value` (numeric)
      - `profit_potential` (numeric)
      - `platform` (text)
      - `url` (text)
      - `status` (text, default 'pending')
      - `discovered_at` (timestamp)

    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `card_id` (uuid, foreign key)
      - `type` (text)
      - `amount` (numeric)
      - `platform` (text)
      - `transaction_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  bankroll numeric DEFAULT 10000,
  risk_tolerance numeric DEFAULT 10
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  player_name text NOT NULL,
  team text NOT NULL,
  position text NOT NULL,
  prospect_rank integer NOT NULL,
  alert_price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  card_name text NOT NULL,
  player_name text NOT NULL,
  year integer NOT NULL,
  set_name text NOT NULL,
  card_number text NOT NULL,
  grade_company text NOT NULL,
  grade numeric NOT NULL,
  purchase_price numeric NOT NULL,
  current_value numeric NOT NULL,
  purchase_date date NOT NULL,
  platform text NOT NULL,
  status text DEFAULT 'owned' CHECK (status IN ('owned', 'listed', 'sold')),
  created_at timestamptz DEFAULT now()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  card_name text NOT NULL,
  player_name text NOT NULL,
  asking_price numeric NOT NULL,
  market_value numeric NOT NULL,
  profit_potential numeric NOT NULL,
  platform text NOT NULL,
  url text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'purchased', 'rejected')),
  discovered_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  card_id uuid REFERENCES inventory(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('buy', 'sell')),
  amount numeric NOT NULL,
  platform text NOT NULL,
  transaction_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own watchlist" ON watchlist
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own watchlist" ON watchlist
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own inventory" ON inventory
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own inventory" ON inventory
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own deals" ON deals
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own deals" ON deals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own transactions" ON transactions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON deals(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);