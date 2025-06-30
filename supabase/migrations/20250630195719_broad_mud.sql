/*
  # Seed Sample Data for CardScout AI

  1. Sample Data
    - Insert sample user data
    - Insert sample watchlist entries
    - Insert sample inventory items
    - Insert sample deals
    - Insert sample transactions

  2. Purpose
    - Provide realistic demo data for the application
    - Enable immediate testing and development
    - Show the full functionality of the platform
*/

-- Insert sample user (this will be replaced with actual authenticated users)
INSERT INTO users (id, email, bankroll, risk_tolerance) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'demo@cardscout.ai', 25000, 15)
ON CONFLICT (id) DO NOTHING;

-- Insert sample watchlist entries
INSERT INTO watchlist (user_id, player_name, team, position, prospect_rank, alert_price) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Termarr Johnson', 'Pittsburgh Pirates', '2B', 15, 150),
  ('550e8400-e29b-41d4-a716-446655440000', 'Druw Jones', 'Arizona Diamondbacks', 'OF', 8, 200),
  ('550e8400-e29b-41d4-a716-446655440000', 'Jackson Holliday', 'Baltimore Orioles', 'SS', 3, 400),
  ('550e8400-e29b-41d4-a716-446655440000', 'Wyatt Langford', 'Texas Rangers', 'OF', 12, 120),
  ('550e8400-e29b-41d4-a716-446655440000', 'Colton Cowser', 'Baltimore Orioles', 'OF', 25, 80)
ON CONFLICT DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory (user_id, card_name, player_name, year, set_name, card_number, grade_company, grade, purchase_price, current_value, purchase_date, platform, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '2019 Topps Chrome Ronald Acuña Jr. RC', 'Ronald Acuña Jr.', 2019, 'Topps Chrome', '1', 'PSA', 10, 450, 625, '2024-01-15', 'eBay', 'owned'),
  ('550e8400-e29b-41d4-a716-446655440000', '2018 Bowman Chrome Juan Soto Auto', 'Juan Soto', 2018, 'Bowman Chrome', 'CPA-JS', 'BGS', 9.5, 1200, 1850, '2023-12-08', 'COMC', 'listed'),
  ('550e8400-e29b-41d4-a716-446655440000', '2020 Topps Chrome Vladimir Guerrero Jr.', 'Vladimir Guerrero Jr.', 2020, 'Topps Chrome', '100', 'PSA', 9, 285, 340, '2024-02-20', 'Alt', 'owned'),
  ('550e8400-e29b-41d4-a716-446655440000', '2021 Bowman Chrome Wander Franco RC', 'Wander Franco', 2021, 'Bowman Chrome', 'BCP-150', 'PSA', 10, 180, 95, '2024-01-30', 'StockX', 'owned'),
  ('550e8400-e29b-41d4-a716-446655440000', '2019 Topps Chrome Pete Alonso RC', 'Pete Alonso', 2019, 'Topps Chrome', '204', 'BGS', 9, 125, 180, '2024-03-05', 'eBay', 'owned'),
  ('550e8400-e29b-41d4-a716-446655440000', '2020 Bowman Chrome Jasson Dominguez', 'Jasson Dominguez', 2020, 'Bowman Chrome', 'BCP-100', 'PSA', 10, 320, 425, '2024-02-12', 'COMC', 'listed')
ON CONFLICT DO NOTHING;

-- Insert sample deals
INSERT INTO deals (user_id, card_name, player_name, asking_price, market_value, profit_potential, platform, url, status, discovered_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '2021 Topps Chrome Julio Rodriguez RC PSA 10', 'Julio Rodriguez', 385, 520, 135, 'eBay', 'https://ebay.com/item/12345', 'pending', '2024-01-15 14:30:00'),
  ('550e8400-e29b-41d4-a716-446655440000', '2020 Bowman Chrome Spencer Torkelson Auto BGS 9.5', 'Spencer Torkelson', 240, 350, 110, 'COMC', 'https://comc.com/card/67890', 'pending', '2024-01-15 13:45:00'),
  ('550e8400-e29b-41d4-a716-446655440000', '2019 Bowman Chrome Wander Franco Auto PSA 9', 'Wander Franco', 180, 220, 40, 'Alt', 'https://alt.com/card/54321', 'pending', '2024-01-15 12:15:00'),
  ('550e8400-e29b-41d4-a716-446655440000', '2022 Topps Chrome Bobby Witt Jr. RC PSA 10', 'Bobby Witt Jr.', 95, 135, 40, 'StockX', 'https://stockx.com/card/98765', 'purchased', '2024-01-15 11:20:00'),
  ('550e8400-e29b-41d4-a716-446655440000', '2021 Bowman Chrome Marcelo Mayer Auto BGS 9', 'Marcelo Mayer', 320, 280, -40, 'eBay', 'https://ebay.com/item/11111', 'rejected', '2024-01-15 10:00:00')
ON CONFLICT DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (user_id, card_id, type, amount, platform, transaction_date) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM inventory WHERE card_name = '2019 Topps Chrome Ronald Acuña Jr. RC' LIMIT 1), 'buy', 450, 'eBay', '2024-01-15 10:30:00'),
  ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM inventory WHERE card_name = '2018 Bowman Chrome Juan Soto Auto' LIMIT 1), 'buy', 1200, 'COMC', '2023-12-08 15:45:00'),
  ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM inventory WHERE card_name = '2020 Topps Chrome Vladimir Guerrero Jr.' LIMIT 1), 'buy', 285, 'Alt', '2024-02-20 12:20:00'),
  ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM inventory WHERE card_name = '2021 Bowman Chrome Wander Franco RC' LIMIT 1), 'buy', 180, 'StockX', '2024-01-30 14:10:00'),
  ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM inventory WHERE card_name = '2019 Topps Chrome Pete Alonso RC' LIMIT 1), 'buy', 125, 'eBay', '2024-03-05 16:30:00'),
  ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM inventory WHERE card_name = '2020 Bowman Chrome Jasson Dominguez' LIMIT 1), 'buy', 320, 'COMC', '2024-02-12 11:15:00')
ON CONFLICT DO NOTHING;