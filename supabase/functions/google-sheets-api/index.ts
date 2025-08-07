import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { action, data } = await req.json()

    // Get API key from Supabase secrets
    const GOOGLE_SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY')

    if (!GOOGLE_SHEETS_API_KEY) {
      return new Response(JSON.stringify({ error: 'Google Sheets API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    switch (action) {
      case 'create_spreadsheet':
        const createResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets?key=${GOOGLE_SHEETS_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: {
              title: data.title || '새 스프레드시트',
            },
          }),
        })

        if (!createResponse.ok) {
          throw new Error(`Google Sheets API error: ${createResponse.statusText}`)
        }

        const spreadsheet = await createResponse.json()

        return new Response(JSON.stringify({
          success: true,
          spreadsheetId: spreadsheet.spreadsheetId,
          spreadsheetUrl: spreadsheet.spreadsheetUrl,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'update_values':
        const updateResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${data.spreadsheetId}/values/${data.range}?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              values: data.values,
            }),
          }
        )

        if (!updateResponse.ok) {
          throw new Error(`Google Sheets update error: ${updateResponse.statusText}`)
        }

        const updateResult = await updateResponse.json()

        return new Response(JSON.stringify({
          success: true,
          result: updateResult,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_values':
        const getResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${data.spreadsheetId}/values/${data.range}?key=${GOOGLE_SHEETS_API_KEY}`
        )
        
        if (!getResponse.ok) {
          throw new Error(`Google Sheets API error: ${getResponse.statusText}`)
        }

        const valuesData = await getResponse.json()
        
        return new Response(JSON.stringify({
          success: true,
          values: valuesData.values || [],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})