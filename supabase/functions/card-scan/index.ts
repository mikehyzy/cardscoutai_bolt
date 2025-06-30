import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface XimilarResponse {
  records: Array<{
    _label: string
    _score: number
    player?: string
    year?: string
    set?: string
    card_number?: string
    grade?: string
    estimated_value?: number
  }>
}

interface CardDetails {
  player_name: string
  year: number
  set_name: string
  card_number: string
  grade_company: string
  grade: number
  estimated_value: number
  confidence: number
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

    // Get the uploaded image
    const formData = await req.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      throw new Error('No image file provided')
    }

    // Convert to base64 for Ximilar API
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // Mock Ximilar API response for demo purposes
    // In production, you would call the actual Ximilar API
    const mockResponse: XimilarResponse = {
      records: [
        {
          _label: "2019 Topps Chrome Ronald Acuña Jr. RC PSA 10",
          _score: 0.92,
          player: "Ronald Acuña Jr.",
          year: "2019",
          set: "Topps Chrome",
          card_number: "1",
          grade: "PSA 10",
          estimated_value: 625
        }
      ]
    }

    // Process the mock response
    if (mockResponse.records && mockResponse.records.length > 0) {
      const record = mockResponse.records[0]
      
      // Extract grade company and numeric grade
      const gradeMatch = record.grade?.match(/^(PSA|BGS|SGC)\s*(\d+(?:\.\d+)?)/) || ['', 'Raw', '0']
      const gradeCompany = gradeMatch[1] || 'Raw'
      const gradeValue = parseFloat(gradeMatch[2] || '0')

      const cardDetails: CardDetails = {
        player_name: record.player || 'Unknown Player',
        year: parseInt(record.year || '2023'),
        set_name: record.set || 'Unknown Set',
        card_number: record.card_number || '1',
        grade_company: gradeCompany,
        grade: gradeValue,
        estimated_value: record.estimated_value || 0,
        confidence: record._score || 0
      }

      // Store raw scan data (optional)
      // You could store the image and scan results in Supabase Storage here

      return new Response(
        JSON.stringify({
          success: true,
          card_details: cardDetails,
          confidence: record._score
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      throw new Error('No card detected in image')
    }

  } catch (error) {
    console.error('Card scan error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process image'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})