import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

const XIMILAR_KEY    = Deno.env.get("XIMILAR_API_KEY")!;
const CARDHEDGE_KEY  = Deno.env.get("CARDHEDGE_API_KEY")!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface XimilarResponse {
  data: Array<{
    card_id: string
    name: string
    set_name: string
    rarity: string
    grade?: string
    confidence: number
  }>
}

interface CardHedgeResponse {
  price_usd: number
  last_updated: string
  market_trend: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    console.log('Processing card scan request...')

    // 1 ▸ receive image blob as multipart/form-data
    const form = await req.formData();
    const file = form.get("image") as File;
    
    if (!file) {
      throw new Error('No image file provided')
    }

    const buffer = await file.arrayBuffer();
    console.log(`Processing image file: ${file.name}, size: ${buffer.byteLength} bytes`)

    // 2 ▸ send to Ximilar for ID & metadata
    console.log('Sending image to Ximilar for card identification...')
    
    // For demo purposes, we'll simulate the Ximilar API response
    // In production, uncomment the actual API call below:
    /*
    const ximilarRes = await fetch("https://api.ximilar.com/card-id/v2/detect", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${XIMILAR_KEY}`,
        "Content-Type": "application/octet-stream"
      },
      body: buffer
    });
    const ximilarJson = await ximilarRes.json() as XimilarResponse;
    */

    // Mock Ximilar response for demo
    const ximilarJson: XimilarResponse = {
      data: [
        {
          card_id: "2019-topps-chrome-ronald-acuna-jr-rc-psa-10",
          name: "Ronald Acuña Jr.",
          set_name: "2019 Topps Chrome",
          rarity: "Rookie Card",
          grade: "PSA 10",
          confidence: 0.94
        }
      ]
    };

    const card = ximilarJson.data?.[0];
    if (!card?.card_id) {
      return new Response(
        JSON.stringify({ success: false, error: "No card detected in image" }), 
        { 
          status: 422,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Card identified: ${card.name} - ${card.set_name} (${card.confidence * 100}% confidence)`)

    // 3 ▸ fetch price from Card Hedge API
    console.log('Fetching current market price from Card Hedge...')
    
    // For demo purposes, we'll simulate the Card Hedge API response
    // In production, uncomment the actual API call below:
    /*
    const hedgeRes = await fetch(
      `https://api.cardhedger.com/cards/${encodeURIComponent(card.card_id)}/price`,
      { 
        headers: { 
          "Authorization": `Bearer ${CARDHEDGE_KEY}`,
          "Content-Type": "application/json"
        } 
      }
    );
    const hedgeJson = await hedgeRes.json() as CardHedgeResponse;
    */

    // Mock Card Hedge response for demo
    const hedgeJson: CardHedgeResponse = {
      price_usd: 625.00,
      last_updated: new Date().toISOString(),
      market_trend: "stable"
    };

    const priceUsd = hedgeJson.price_usd ?? null;
    console.log(`Current market price: $${priceUsd}`)

    // 4 ▸ upload image to Supabase Storage
    console.log('Uploading image to Supabase Storage...')
    const fileName = `scanned-cards/${crypto.randomUUID()}.jpg`;
    
    const { error: uploadError } = await supabase.storage
      .from("cards")
      .upload(fileName, new Uint8Array(buffer), { 
        contentType: file.type || 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Continue without image URL if upload fails
    }

    const { data: { publicUrl } } = supabase.storage
      .from("cards")
      .getPublicUrl(fileName);

    console.log('Image uploaded successfully')

    // 5 ▸ prepare card data for inventory insertion
    const cardData = {
      card_name: `${card.set_name} ${card.name}`,
      player_name: card.name,
      year: parseInt(card.set_name.match(/\d{4}/)?.[0] || '2023'),
      set_name: card.set_name,
      card_number: '1', // Default, would be extracted from Ximilar in production
      grade_company: card.grade?.split(' ')[0] || 'Raw',
      grade: parseFloat(card.grade?.split(' ')[1] || '0'),
      purchase_price: 0, // Will be updated by user
      current_value: priceUsd || 0,
      purchase_date: new Date().toISOString().split('T')[0],
      platform: 'Scanned',
      status: 'owned'
    };

    // Store scan result in raw_scans table for tracking
    const scanResult = {
      image_url: uploadError ? null : publicUrl,
      scan_result: {
        ximilar_response: ximilarJson,
        card_hedge_response: hedgeJson,
        identified_card: card,
        processing_timestamp: new Date().toISOString()
      },
      confidence_score: card.confidence,
      processed: true
    };

    console.log('Storing scan results...')

    // Get authenticated user for proper data association
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authentication required')
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication token')
    }

    // Insert scan record
    const { error: scanError } = await supabase
      .from("raw_scans")
      .insert({
        user_id: user.id,
        ...scanResult
      });

    if (scanError) {
      console.error('Error storing scan result:', scanError)
    }

    console.log('Card scan processing complete!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        card_details: {
          player_name: card.name,
          year: cardData.year,
          set_name: card.set_name,
          card_number: cardData.card_number,
          grade_company: cardData.grade_company,
          grade: cardData.grade,
          estimated_value: priceUsd || 0,
          confidence: card.confidence
        },
        price_data: {
          current_price: priceUsd,
          market_trend: hedgeJson.market_trend,
          last_updated: hedgeJson.last_updated
        },
        image_url: uploadError ? null : publicUrl,
        scan_id: crypto.randomUUID() // For tracking purposes
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Card scan error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process card scan'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});