import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

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
  }
}