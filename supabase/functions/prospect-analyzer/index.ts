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

// Define comprehensive prospect data interfaces
interface FanGraphsProspect {
  PlayerId: number
  PlayerName: string
  Team: string
  Level: string
  Rank: number
  wRCPlus: number
  Age: number
  Position: string
}

interface MLBPipelineProspect {
  id: number
  name: string
  team: string
  position: string
  rank: number
  eta: string
  grade: number
}

interface BaseballProspectusRanking {
  player_id: number
  name: string
  team: string
  rank: number
  ceiling: number
  floor: number
  risk: string
}

interface MiLBStats {
  player_id: number
  ops: number
  k_percent: number
  bb_percent: number
  iso: number
  babip: number
  wrc_plus: number
  games_played: number
}

interface MLScoredProspect {
  mlb_id: number
  player_name: string
  team: string
  position: string
  level: string
  prospect_rank: number
  ml_score: number
  ceiling_score: number
  floor_score: number
  risk_level: string
  eta: string
  ops: number
  k_percent: number
  bb_percent: number
  age: number
  composite_rank: number
}

/**
 * Mock FanGraphs Top 100 API call
 * In production: Replace with actual FanGraphs API integration
 */
async function fetchFanGraphsProspects(): Promise<FanGraphsProspect[]> {
  console.log('Fetching FanGraphs Top 100...')
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock comprehensive prospect data
  const mockProspects: FanGraphsProspect[] = [
    {
      PlayerId: 1001,
      PlayerName: "Termarr Johnson",
      Team: "Pittsburgh Pirates",
      Level: "A+",
      Rank: 15,
      wRCPlus: 145,
      Age: 20,
      Position: "2B"
    },
    {
      PlayerId: 1002,
      PlayerName: "Druw Jones",
      Team: "Arizona Diamondbacks",
      Level: "AA",
      Rank: 8,
      wRCPlus: 132,
      Age: 21,
      Position: "OF"
    },
    {
      PlayerId: 1003,
      PlayerName: "Jackson Holliday",
      Team: "Baltimore Orioles",
      Level: "AAA",
      Rank: 3,
      wRCPlus: 158,
      Age: 20,
      Position: "SS"
    },
    {
      PlayerId: 1004,
      PlayerName: "Wyatt Langford",
      Team: "Texas Rangers",
      Level: "AA",
      Rank: 12,
      wRCPlus: 128,
      Age: 22,
      Position: "OF"
    },
    {
      PlayerId: 1005,
      PlayerName: "Colton Cowser",
      Team: "Baltimore Orioles",
      Level: "AAA",
      Rank: 25,
      wRCPlus: 118,
      Age: 23,
      Position: "OF"
    },
    {
      PlayerId: 1006,
      PlayerName: "Evan Carter",
      Team: "Texas Rangers",
      Level: "MLB",
      Rank: 18,
      wRCPlus: 142,
      Age: 21,
      Position: "OF"
    },
    {
      PlayerId: 1007,
      PlayerName: "Jordan Walker",
      Team: "St. Louis Cardinals",
      Level: "MLB",
      Rank: 22,
      wRCPlus: 125,
      Age: 22,
      Position: "OF"
    },
    {
      PlayerId: 1008,
      PlayerName: "Grayson Rodriguez",
      Team: "Baltimore Orioles",
      Level: "MLB",
      Rank: 35,
      wRCPlus: 115,
      Age: 24,
      Position: "P"
    },
    {
      PlayerId: 1009,
      PlayerName: "Spencer Torkelson",
      Team: "Detroit Tigers",
      Level: "MLB",
      Rank: 28,
      wRCPlus: 108,
      Age: 24,
      Position: "1B"
    },
    {
      PlayerId: 1010,
      PlayerName: "Bobby Miller",
      Team: "Los Angeles Dodgers",
      Level: "MLB",
      Rank: 42,
      wRCPlus: 122,
      Age: 25,
      Position: "P"
    },
    {
      PlayerId: 1011,
      PlayerName: "Paul Skenes",
      Team: "Pittsburgh Pirates",
      Level: "AAA",
      Rank: 5,
      wRCPlus: 0, // Pitcher
      Age: 22,
      Position: "P"
    },
    {
      PlayerId: 1012,
      PlayerName: "Dylan Crews",
      Team: "Washington Nationals",
      Level: "AA",
      Rank: 7,
      wRCPlus: 135,
      Age: 22,
      Position: "OF"
    },
    {
      PlayerId: 1013,
      PlayerName: "Marcelo Mayer",
      Team: "Boston Red Sox",
      Level: "AA",
      Rank: 11,
      wRCPlus: 140,
      Age: 21,
      Position: "SS"
    },
    {
      PlayerId: 1014,
      PlayerName: "Junior Caminero",
      Team: "Tampa Bay Rays",
      Level: "A+",
      Rank: 14,
      wRCPlus: 138,
      Age: 20,
      Position: "3B"
    },
    {
      PlayerId: 1015,
      PlayerName: "Jasson Dominguez",
      Team: "New York Yankees",
      Level: "AA",
      Rank: 19,
      wRCPlus: 125,
      Age: 21,
      Position: "OF"
    }
  ]
  
  console.log(`Fetched ${mockProspects.length} prospects from FanGraphs`)
  return mockProspects
}

/**
 * Mock MLB Pipeline API call
 * In production: Replace with actual MLB Pipeline API integration
 */
async function fetchMLBPipelineProspects(): Promise<MLBPipelineProspect[]> {
  console.log('Fetching MLB Pipeline rankings...')
  
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const mockPipeline: MLBPipelineProspect[] = [
    { id: 1001, name: "Termarr Johnson", team: "Pittsburgh Pirates", position: "2B", rank: 12, eta: "2025", grade: 55 },
    { id: 1002, name: "Druw Jones", team: "Arizona Diamondbacks", position: "OF", rank: 6, eta: "2025", grade: 60 },
    { id: 1003, name: "Jackson Holliday", team: "Baltimore Orioles", position: "SS", rank: 2, eta: "2024", grade: 65 },
    { id: 1004, name: "Wyatt Langford", team: "Texas Rangers", position: "OF", rank: 15, eta: "2025", grade: 55 },
    { id: 1005, name: "Colton Cowser", team: "Baltimore Orioles", position: "OF", rank: 28, eta: "2024", grade: 50 },
    { id: 1011, name: "Paul Skenes", team: "Pittsburgh Pirates", position: "P", rank: 3, eta: "2024", grade: 70 },
    { id: 1012, name: "Dylan Crews", team: "Washington Nationals", position: "OF", rank: 5, eta: "2025", grade: 60 },
    { id: 1013, name: "Marcelo Mayer", team: "Boston Red Sox", position: "SS", rank: 9, eta: "2025", grade: 55 },
    { id: 1014, name: "Junior Caminero", team: "Tampa Bay Rays", position: "3B", rank: 13, eta: "2025", grade: 55 },
    { id: 1015, name: "Jasson Dominguez", team: "New York Yankees", position: "OF", rank: 18, eta: "2024", grade: 55 }
  ]
  
  console.log(`Fetched ${mockPipeline.length} prospects from MLB Pipeline`)
  return mockPipeline
}

/**
 * Mock Baseball Prospectus rankings
 * In production: Replace with actual BP API integration
 */
async function fetchBaseballProspectusRankings(): Promise<BaseballProspectusRanking[]> {
  console.log('Fetching Baseball Prospectus rankings...')
  
  await new Promise(resolve => setTimeout(resolve, 350))
  
  const mockBP: BaseballProspectusRanking[] = [
    { player_id: 1001, name: "Termarr Johnson", team: "Pittsburgh Pirates", rank: 18, ceiling: 70, floor: 40, risk: "Medium" },
    { player_id: 1002, name: "Druw Jones", team: "Arizona Diamondbacks", rank: 10, ceiling: 75, floor: 45, risk: "Medium" },
    { player_id: 1003, name: "Jackson Holliday", team: "Baltimore Orioles", rank: 4, ceiling: 80, floor: 55, risk: "Low" },
    { player_id: 1004, name: "Wyatt Langford", team: "Texas Rangers", rank: 14, ceiling: 65, floor: 45, risk: "Medium" },
    { player_id: 1005, name: "Colton Cowser", team: "Baltimore Orioles", rank: 32, ceiling: 55, floor: 40, risk: "Low" },
    { player_id: 1011, name: "Paul Skenes", team: "Pittsburgh Pirates", rank: 7, ceiling: 80, floor: 50, risk: "Medium" },
    { player_id: 1012, name: "Dylan Crews", team: "Washington Nationals", rank: 8, ceiling: 70, floor: 50, risk: "Low" },
    { player_id: 1013, name: "Marcelo Mayer", team: "Boston Red Sox", rank: 12, ceiling: 70, floor: 45, risk: "Medium" },
    { player_id: 1014, name: "Junior Caminero", team: "Tampa Bay Rays", rank: 16, ceiling: 75, floor: 40, risk: "High" },
    { player_id: 1015, name: "Jasson Dominguez", team: "New York Yankees", rank: 22, ceiling: 70, floor: 35, risk: "High" }
  ]
  
  console.log(`Fetched ${mockBP.length} prospects from Baseball Prospectus`)
  return mockBP
}

/**
 * Mock MiLB stats API call
 * In production: Replace with actual MLB Stats API integration
 */
async function fetchMiLBStats(playerIds: number[]): Promise<MiLBStats[]> {
  console.log('Fetching live MiLB statistics...')
  
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const mockStats: MiLBStats[] = playerIds.map(id => ({
    player_id: id,
    ops: 0.750 + (Math.random() * 0.400), // 0.750 - 1.150
    k_percent: 15 + (Math.random() * 20), // 15% - 35%
    bb_percent: 5 + (Math.random() * 15), // 5% - 20%
    iso: 0.100 + (Math.random() * 0.200), // 0.100 - 0.300
    babip: 0.280 + (Math.random() * 0.120), // 0.280 - 0.400
    wrc_plus: 80 + (Math.random() * 80), // 80 - 160
    games_played: Math.floor(50 + (Math.random() * 80)) // 50 - 130 games
  }))
  
  console.log(`Fetched stats for ${mockStats.length} players`)
  return mockStats
}

/**
 * Advanced ML-based prospect scoring algorithm
 * Combines multiple data sources with weighted factors
 */
function calculateMLScore(
  fgProspect: FanGraphsProspect,
  mlbPipeline?: MLBPipelineProspect,
  bpRanking?: BaseballProspectusRanking,
  stats?: MiLBStats
): { ml_score: number; ceiling_score: number; floor_score: number; risk_level: string } {
  
  // Base scoring components
  let performanceScore = 0
  let rankingScore = 0
  let ageAdjustment = 0
  let levelAdjustment = 0
  
  // 1. Performance metrics (40% weight)
  if (stats) {
    const opsScore = Math.min(100, (stats.ops - 0.600) * 200) // Normalize OPS
    const plateDiscScore = Math.max(0, 100 - (stats.k_percent - stats.bb_percent) * 2) // K-BB%
    const powerScore = Math.min(100, stats.iso * 500) // ISO power
    
    performanceScore = (opsScore * 0.5 + plateDiscScore * 0.3 + powerScore * 0.2)
  } else {
    // Fallback to wRC+ if available
    performanceScore = Math.min(100, Math.max(0, (fgProspect.wRCPlus - 80) * 1.25))
  }
  
  // 2. Composite ranking score (35% weight)
  const fgRankScore = Math.max(0, 100 - fgProspect.Rank)
  const mlbRankScore = mlbPipeline ? Math.max(0, 100 - mlbPipeline.rank) : fgRankScore
  const bpRankScore = bpRanking ? Math.max(0, 100 - bpRanking.rank) : fgRankScore
  
  rankingScore = (fgRankScore * 0.4 + mlbRankScore * 0.35 + bpRankScore * 0.25)
  
  // 3. Age vs Level adjustment (15% weight)
  const levelValues = { 'A': 1, 'A+': 2, 'AA': 3, 'AAA': 4, 'MLB': 5 }
  const currentLevel = levelValues[fgProspect.Level as keyof typeof levelValues] || 1
  
  // Younger players at higher levels get bonus
  const expectedLevel = Math.max(1, fgProspect.Age - 18)
  ageAdjustment = Math.min(25, Math.max(-25, (currentLevel - expectedLevel) * 8))
  
  // 4. Level progression bonus (10% weight)
  levelAdjustment = currentLevel * 5 // Higher levels get bonus
  
  // Calculate final ML score
  const rawScore = (
    performanceScore * 0.40 +
    rankingScore * 0.35 +
    ageAdjustment * 0.15 +
    levelAdjustment * 0.10
  )
  
  const ml_score = Math.min(100, Math.max(0, rawScore))
  
  // Calculate ceiling and floor scores
  const ceiling_score = bpRanking ? bpRanking.ceiling : Math.min(100, ml_score + 20)
  const floor_score = bpRanking ? bpRanking.floor : Math.max(0, ml_score - 25)
  
  // Determine risk level
  let risk_level = "Medium"
  if (bpRanking) {
    risk_level = bpRanking.risk
  } else {
    const variance = ceiling_score - floor_score
    if (variance > 40) risk_level = "High"
    else if (variance < 20) risk_level = "Low"
  }
  
  return { ml_score, ceiling_score, floor_score, risk_level }
}

/**
 * Calculate composite ranking from multiple sources
 */
function calculateCompositeRank(
  fgRank: number,
  mlbRank?: number,
  bpRank?: number
): number {
  const ranks = [fgRank]
  if (mlbRank) ranks.push(mlbRank)
  if (bpRank) ranks.push(bpRank)
  
  // Weighted average with FanGraphs getting highest weight
  if (ranks.length === 1) return fgRank
  if (ranks.length === 2) return Math.round(fgRank * 0.6 + ranks[1] * 0.4)
  
  return Math.round(fgRank * 0.5 + ranks[1] * 0.3 + ranks[2] * 0.2)
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting comprehensive prospect analysis...')
    
    // 1. Fetch data from all sources in parallel
    const [fgProspects, mlbPipeline, bpRankings] = await Promise.all([
      fetchFanGraphsProspects(),
      fetchMLBPipelineProspects(),
      fetchBaseballProspectusRankings()
    ])
    
    // 2. Get live stats for all prospects
    const playerIds = fgProspects.map(p => p.PlayerId)
    const liveStats = await fetchMiLBStats(playerIds)
    
    console.log('Data aggregation complete. Processing ML scores...')
    
    // 3. Create comprehensive prospect analysis
    const mlScoredProspects: MLScoredProspect[] = fgProspects.map(fgProspect => {
      // Find corresponding data from other sources
      const mlbData = mlbPipeline.find(p => p.id === fgProspect.PlayerId)
      const bpData = bpRankings.find(p => p.player_id === fgProspect.PlayerId)
      const statsData = liveStats.find(s => s.player_id === fgProspect.PlayerId)
      
      // Calculate ML scores
      const { ml_score, ceiling_score, floor_score, risk_level } = calculateMLScore(
        fgProspect, mlbData, bpData, statsData
      )
      
      // Calculate composite ranking
      const composite_rank = calculateCompositeRank(
        fgProspect.Rank,
        mlbData?.rank,
        bpData?.rank
      )
      
      return {
        mlb_id: fgProspect.PlayerId,
        player_name: fgProspect.PlayerName,
        team: fgProspect.Team,
        position: fgProspect.Position,
        level: fgProspect.Level,
        prospect_rank: fgProspect.Rank,
        ml_score: Math.round(ml_score * 100) / 100,
        ceiling_score,
        floor_score,
        risk_level,
        eta: mlbData?.eta || "2025",
        ops: statsData?.ops || 0,
        k_percent: statsData?.k_percent || 0,
        bb_percent: statsData?.bb_percent || 0,
        age: fgProspect.Age,
        composite_rank
      }
    })
    
    // 4. Sort by ML score and take top 150
    const top150Prospects = mlScoredProspects
      .sort((a, b) => b.ml_score - a.ml_score)
      .slice(0, 150)
    
    console.log(`Processed ${top150Prospects.length} prospects with ML scoring`)
    
    // 5. Update watchlist table with enhanced prospect data
    let updatedCount = 0
    let insertedCount = 0
    
    for (const prospect of top150Prospects) {
      try {
        // Check if prospect exists in watchlist
        const { data: existing } = await supabase
          .from('watchlist')
          .select('id, user_id')
          .eq('player_name', prospect.player_name)
          .maybeSingle()
        
        if (existing) {
          // Update existing record with new ML analysis
          const { error: updateError } = await supabase
            .from('watchlist')
            .update({
              team: prospect.team,
              position: prospect.position,
              prospect_rank: prospect.composite_rank
            })
            .eq('id', existing.id)
          
          if (!updateError) {
            updatedCount++
          }
        } else {
          // For demo purposes, insert new prospects for existing users
          const { data: users } = await supabase
            .from('users')
            .select('id')
            .limit(1)
          
          if (users && users.length > 0) {
            // Insert as new watchlist item with estimated alert price
            const estimatedPrice = Math.floor(50 + (prospect.ml_score * 5))
            
            const { error: insertError } = await supabase
              .from('watchlist')
              .insert({
                user_id: users[0].id,
                player_name: prospect.player_name,
                team: prospect.team,
                position: prospect.position,
                prospect_rank: prospect.composite_rank,
                alert_price: estimatedPrice
              })
            
            if (!insertError) {
              insertedCount++
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${prospect.player_name}:`, error)
      }
    }
    
    console.log(`Analysis complete. Updated: ${updatedCount}, Inserted: ${insertedCount}`)
    
    return new Response(
      JSON.stringify({
        success: true,
        processed: top150Prospects.length,
        updated: updatedCount,
        inserted: insertedCount,
        data_sources: {
          fangraphs: fgProspects.length,
          mlb_pipeline: mlbPipeline.length,
          baseball_prospectus: bpRankings.length,
          live_stats: liveStats.length
        },
        top_prospects: top150Prospects.slice(0, 10), // Return top 10 for preview
        analysis_timestamp: new Date().toISOString()
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
    console.error('Comprehensive prospect analysis error:', error)
    
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