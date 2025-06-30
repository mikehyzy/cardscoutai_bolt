import { serve } from "https://deno.land/std@0.181.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Initialize Supabase client with service role for database access
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
)

interface Deal {
  user_id: string
  card_name: string
  player_name: string
  asking_price: number
  market_value: number
  profit_potential: number
  platform: string
  url: string
  status: string
}

interface MarketplaceListing {
  title: string
  price: number
  url: string
  seller_rating: number
  condition: string
  grade?: string
}

/**
 * Mock eBay API scanner - simulates finding deals
 * In production, this would integrate with eBay's Finding API
 */
async function scanEbay(playerName: string): Promise<MarketplaceListing[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Mock listings with realistic data
  const mockListings: MarketplaceListing[] = [
    {
      title: `${playerName} 2021 Topps Chrome RC PSA 10`,
      price: Math.floor(Math.random() * 500) + 100,
      url: `https://ebay.com/item/${Math.floor(Math.random() * 1000000)}`,
      seller_rating: 4.8,
      condition: "Graded",
      grade: "PSA 10"
    },
    {
      title: `${playerName} 2020 Bowman Chrome Auto BGS 9.5`,
      price: Math.floor(Math.random() * 800) + 200,
      url: `https://ebay.com/item/${Math.floor(Math.random() * 1000000)}`,
      seller_rating: 4.9,
      condition: "Graded",
      grade: "BGS 9.5"
    }
  ]
  
  return mockListings
}

/**
 * Mock COMC API scanner - simulates finding deals
 * In production, this would integrate with COMC's API
 */
async function scanCOMC(playerName: string): Promise<MarketplaceListing[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150))
  
  const mockListings: MarketplaceListing[] = [
    {
      title: `${playerName} 2019 Topps Chrome RC`,
      price: Math.floor(Math.random() * 300) + 50,
      url: `https://comc.com/card/${Math.floor(Math.random() * 1000000)}`,
      seller_rating: 5.0,
      condition: "Near Mint",
    }
  ]
  
  return mockListings
}

/**
 * Mock StockX API scanner - simulates finding deals
 */
async function scanStockX(playerName: string): Promise<MarketplaceListing[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 120))
  
  const mockListings: MarketplaceListing[] = [
    {
      title: `${playerName} 2022 Topps Chrome RC PSA 10`,
      price: Math.floor(Math.random() * 400) + 80,
      url: `https://stockx.com/card/${Math.floor(Math.random() * 1000000)}`,
      seller_rating: 4.7,
      condition: "Graded",
      grade: "PSA 10"
    }
  ]
  
  return mockListings
}

/**
 * Estimates market value based on player name and card details
 * In production, this would use historical sales data and ML models
 */
function estimateMarketValue(playerName: string, cardTitle: string): number {
  // Simple mock estimation based on player popularity and card type
  const baseValue = Math.floor(Math.random() * 200) + 150
  
  // Adjust based on card characteristics
  let multiplier = 1.0
  
  if (cardTitle.includes('PSA 10')) multiplier += 0.4
  if (cardTitle.includes('BGS 9.5')) multiplier += 0.3
  if (cardTitle.includes('Auto')) multiplier += 0.5
  if (cardTitle.includes('RC')) multiplier += 0.2
  if (cardTitle.includes('Chrome')) multiplier += 0.1
  
  // Popular players get higher values
  const popularPlayers = ['Ronald Acuña Jr.', 'Juan Soto', 'Vladimir Guerrero Jr.', 'Fernando Tatis Jr.']
  if (popularPlayers.some(player => playerName.includes(player))) {
    multiplier += 0.3
  }
  
  return Math.floor(baseValue * multiplier)
}

/**
 * Scans all marketplaces for deals on a specific player
 * @param playerName - Player name to search for
 * @returns Array of potential deals found
 */
async function findDeals(playerName: string, userId: string): Promise<Deal[]> {
  console.log(`Scanning marketplaces for ${playerName}...`)
  
  try {
    // Scan all marketplaces in parallel
    const [ebayListings, comcListings, stockxListings] = await Promise.all([
      scanEbay(playerName),
      scanCOMC(playerName),
      scanStockX(playerName)
    ])
    
    const allListings = [
      ...ebayListings.map(l => ({ ...l, platform: 'eBay' })),
      ...comcListings.map(l => ({ ...l, platform: 'COMC' })),
      ...stockxListings.map(l => ({ ...l, platform: 'StockX' }))
    ]
    
    const deals: Deal[] = []
    
    for (const listing of allListings) {
      const marketValue = estimateMarketValue(playerName, listing.title)
      const profitPotential = marketValue - listing.price
      const profitPercentage = (profitPotential / listing.price) * 100
      
      // Only consider it a deal if profit potential is > 15% and > $25
      if (profitPercentage > 15 && profitPotential > 25) {
        deals.push({
          user_id: userId,
          card_name: listing.title,
          player_name: playerName,
          asking_price: listing.price,
          market_value: marketValue,
          profit_potential: profitPotential,
          platform: listing.platform,
          url: listing.url,
          status: 'pending'
        })
      }
    }
    
    console.log(`Found ${deals.length} potential deals for ${playerName}`)
    return deals
    
  } catch (error) {
    console.error(`Error scanning for ${playerName}:`, error)
    return []
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting market scan...')
    
    // 1. Fetch all users to scan for (in production, you might want to limit this)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
    
    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`)
    }
    
    if (!users || users.length === 0) {
      console.log('No users found to scan for')
      return new Response(
        JSON.stringify({ success: true, deals_found: 0, message: 'No users to scan for' }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      )
    }
    
    // 2. For each user, fetch their watchlist
    const allDeals: Deal[] = []
    
    for (const user of users) {
      console.log(`Scanning for user: ${user.email}`)
      
      const { data: watchlist, error: fetchError } = await supabase
        .from("watchlist")
        .select("player_name")
        .eq("user_id", user.id)
      
      if (fetchError) {
        console.error(`Failed to fetch watchlist for user ${user.id}:`, fetchError.message)
        continue
      }
      
      if (!watchlist || watchlist.length === 0) {
        console.log(`No watchlist items for user ${user.email}`)
        continue
      }
      
      // 3. Scan marketplaces for each player in their watchlist
      for (const { player_name } of watchlist) {
        const deals = await findDeals(player_name, user.id)
        allDeals.push(...deals)
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
    
    console.log(`Total deals found across all users: ${allDeals.length}`)
    
    // 4. Insert new deals into database (avoiding duplicates)
    let insertedCount = 0
    if (allDeals.length > 0) {
      // Insert deals one by one to handle conflicts gracefully
      for (const deal of allDeals) {
        try {
          // Check if similar deal already exists (same card, similar price, same platform)
          const { data: existingDeal } = await supabase
            .from("deals")
            .select("id")
            .eq("card_name", deal.card_name)
            .eq("platform", deal.platform)
            .eq("user_id", deal.user_id)
            .gte("asking_price", deal.asking_price - 10)
            .lte("asking_price", deal.asking_price + 10)
            .single()
          
          if (!existingDeal) {
            const { error: insertError } = await supabase
              .from("deals")
              .insert(deal)
            
            if (!insertError) {
              insertedCount++
            } else {
              console.error('Insert error:', insertError.message)
            }
          }
        } catch (error) {
          console.error('Error processing deal:', error)
        }
      }
    }
    
    console.log(`Market scan complete. Inserted ${insertedCount} new deals.`)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        deals_found: allDeals.length,
        deals_inserted: insertedCount,
        users_scanned: users.length,
        scan_timestamp: new Date().toISOString()
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    )
    
  } catch (error) {
    console.error('Market scanner error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Market scan failed'
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    )
  }
})