import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          bankroll: number
          risk_tolerance: number
        }
        Insert: {
          id: string
          email: string
          bankroll?: number
          risk_tolerance?: number
        }
        Update: {
          email?: string
          bankroll?: number
          risk_tolerance?: number
        }
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          player_name: string
          team: string
          position: string
          prospect_rank: number
          alert_price: number
          created_at: string
        }
        Insert: {
          user_id: string
          player_name: string
          team: string
          position: string
          prospect_rank: number
          alert_price: number
        }
        Update: {
          player_name?: string
          team?: string
          position?: string
          prospect_rank?: number
          alert_price?: number
        }
      }
      inventory: {
        Row: {
          id: string
          user_id: string
          card_name: string
          player_name: string
          year: number
          set_name: string
          card_number: string
          grade_company: string
          grade: number
          purchase_price: number
          current_value: number
          purchase_date: string
          platform: string
          status: 'owned' | 'listed' | 'sold'
          created_at: string
        }
        Insert: {
          user_id: string
          card_name: string
          player_name: string
          year: number
          set_name: string
          card_number: string
          grade_company: string
          grade: number
          purchase_price: number
          current_value: number
          purchase_date: string
          platform: string
          status?: 'owned' | 'listed' | 'sold'
        }
        Update: {
          card_name?: string
          player_name?: string
          year?: number
          set_name?: string
          card_number?: string
          grade_company?: string
          grade?: number
          purchase_price?: number
          current_value?: number
          purchase_date?: string
          platform?: string
          status?: 'owned' | 'listed' | 'sold'
        }
      }
      deals: {
        Row: {
          id: string
          user_id: string
          card_name: string
          player_name: string
          asking_price: number
          market_value: number
          profit_potential: number
          platform: string
          url: string
          status: 'pending' | 'purchased' | 'rejected'
          discovered_at: string
        }
        Insert: {
          user_id: string
          card_name: string
          player_name: string
          asking_price: number
          market_value: number
          profit_potential: number
          platform: string
          url: string
          status?: 'pending' | 'purchased' | 'rejected'
        }
        Update: {
          status?: 'pending' | 'purchased' | 'rejected'
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          card_id: string
          type: 'buy' | 'sell'
          amount: number
          platform: string
          transaction_date: string
          created_at: string
        }
        Insert: {
          user_id: string
          card_id: string
          type: 'buy' | 'sell'
          amount: number
          platform: string
          transaction_date: string
        }
        Update: {
          amount?: number
        }
      }
    }
    minor_league_players: {
      Row: {
        id: string
        user_id: string
        player_name: string
        team: string
        position: string
        level: string
        age: number
        bats: string
        throws: string
        acquisition_date: string
        acquisition_cost: number
        current_value: number
        status: 'active' | 'traded' | 'released' | 'promoted'
        notes: string
        created_at: string
      }
      Insert: {
        user_id: string
        player_name: string
        team: string
        position: string
        level: string
        age: number
        bats: string
        throws: string
        acquisition_date: string
        acquisition_cost: number
        current_value: number
        status?: 'active' | 'traded' | 'released' | 'promoted'
        notes?: string
      }
      Update: {
        player_name?: string
        team?: string
        position?: string
        level?: string
        age?: number
        bats?: string
        throws?: string
        acquisition_date?: string
        acquisition_cost?: number
        current_value?: number
        status?: 'active' | 'traded' | 'released' | 'promoted'
        notes?: string
      }
    }
    minor_league_stats: {
      Row: {
        id: string
        player_id: string
        season: number
        level: string
        team: string
        games: number
        at_bats: number
        hits: number
        doubles: number
        triples: number
        home_runs: number
        rbis: number
        runs: number
        walks: number
        strikeouts: number
        stolen_bases: number
        batting_average: number
        on_base_percentage: number
        slugging_percentage: number
        ops: number
        created_at: string
      }
      Insert: {
        player_id: string
        season: number
        level: string
        team: string
        games?: number
        at_bats?: number
        hits?: number
        doubles?: number
        triples?: number
        home_runs?: number
        rbis?: number
        runs?: number
        walks?: number
        strikeouts?: number
        stolen_bases?: number
        batting_average?: number
        on_base_percentage?: number
        slugging_percentage?: number
        ops?: number
      }
      Update: {
        season?: number
        level?: string
        team?: string
        games?: number
        at_bats?: number
        hits?: number
        doubles?: number
        triples?: number
        home_runs?: number
        rbis?: number
        runs?: number
        walks?: number
        strikeouts?: number
        stolen_bases?: number
        batting_average?: number
        on_base_percentage?: number
        slugging_percentage?: number
        ops?: number
      }
    }
  }
}