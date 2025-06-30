import { serve } from "https://deno.land/std@0.181.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Initialize Supabase client with environment variables
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
)

// Define types for prospect data
interface Prospect {
  PlayerId: number
  PlayerName: string
  Team: string
  Level: string
  Rank: number
  wRCPlus: number
}

interface ScoredProspect {
  mlb_id: number
  player_name: string
  team: string
  level: string
  prospect_rank: number
  percentile_score: number
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting prospect analysis...')

    // Mock FanGraphs API response for demo purposes
    // In production, you would call the actual FanGraphs API
    const mockProspects: Prospect[] = [
      {
        PlayerId: 1001,
        PlayerName: "Termarr Johnson",
        Team: "Pittsburgh Pirates",
        Level: "A+",
        Rank: 15,
        wRCPlus: 145
      },
      {
        PlayerId: 1002,
        PlayerName: "Druw Jones",
        Team: "Arizona Diamondbacks",
        Level: "AA",
        Rank: 8,
        wRCPlus: 132
      },
      {
        PlayerId: 1003,
        PlayerName: "Jackson Holliday",
        Team: "Baltimore Orioles",
        Level: "AAA",
        Rank: 3,
        wRCPlus: 158
      },
      {
        PlayerId: 1004,
        PlayerName: "Wyatt Langford",
        Team: "Texas Rangers",
        Level: "AA",
        Rank: 12,
        wRCPlus: 128
      },
      {
        PlayerId: 1005,
        PlayerName: "Colton Cowser",
        Team: "Baltimore Orioles",
        Level: "AAA",
        Rank: 25,
        wRCPlus: 118
      },
      {
        PlayerId: 1006,
        PlayerName: "Evan Carter",
        Team: "Texas Rangers",
        Level: "MLB",
        Rank: 18,
        wRCPlus: 142
      },
      {
        PlayerId: 1007,
        PlayerName: "Jordan Walker",
        Team: "St. Louis Cardinals",
        Level: "MLB",
        Rank: 22,
        wRCPlus: 125
      },
      {
        PlayerId: 1008,
        PlayerName: "Grayson Rodriguez",
        Team: "Baltimore Orioles",
        Level: "MLB",
        Rank: 35,
        wRCPlus: 115
      },
      {
        PlayerId: 1009,
        PlayerName: "Spencer Torkelson",
        Team: "Detroit Tigers",
        Level: "MLB",
        Rank: 28,
        wRCPlus: 108
      },
      {
        PlayerId: 1010,
        PlayerName: "Bobby Miller",
        Team: "Los Angeles Dodgers",
        Level: "MLB",
        Rank: 42,
        wRCPlus: 122
      }
    ]

    console.log(`Processing ${mockProspects.length} prospects...`)

    // Process prospects and calculate scores
    const scoredProspects: ScoredProspect[] = mockProspects.map((prospect) => {
      // Calculate percentile score based on wRC+ and rank
      const wrcPlusScore = (prospect.wRCPlus - 100) * 0.4
      const rankScore = (55 - prospect.Rank) * 0.2
      const percentileScore = Math.max(0, Math.min(100, wrcPlusScore + rankScore))

      return {
        mlb_id: prospect.PlayerId,
        player_name: prospect.PlayerName,
        team: prospect.Team,
        level: prospect.Level,
        prospect_rank: prospect.Rank,
        percentile_score: Math.round(percentileScore * 100) / 100
      }
    })

    console.log('Scored prospects:', scoredProspects.length)

    // For demo purposes, we'll update the existing watchlist with enhanced data
    // In production, you might want to create a separate prospects table
    const updates = []
    
    for (const prospect of scoredProspects) {
      // Check if prospect exists in watchlist
      const { data: existing } = await supabase
        .from('watchlist')
        .select('id')
        .eq('player_name', prospect.player_name)
        .single()

      if (existing) {
        // Update existing record with new analysis data
        const { error: updateError } = await supabase
          .from('watchlist')
          .update({
            team: prospect.team,
            prospect_rank: prospect.prospect_rank
          })
          .eq('id', existing.id)

        if (updateError) {
          console.error('Update error:', updateError)
        } else {
          updates.push(`Updated ${prospect.player_name}`)
        }
      }
    }

    console.log('Analysis complete. Updates:', updates.length)

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: scoredProspects.length,
        updated: updates.length,
        prospects: scoredProspects,
        updates: updates
      }),
      {
        status: 200,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
      }
    )
  } catch (error) {
    console.error('Prospect analysis error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to analyze prospects'
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
      }
    )
  }
})