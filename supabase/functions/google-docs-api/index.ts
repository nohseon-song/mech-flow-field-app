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

    // Get API keys from Supabase secrets
    const GOOGLE_DOCS_API_KEY = Deno.env.get('GOOGLE_DOCS_API_KEY')
    const GOOGLE_DRIVE_API_KEY = Deno.env.get('GOOGLE_DRIVE_API_KEY')

    if (!GOOGLE_DOCS_API_KEY || !GOOGLE_DRIVE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Google API keys not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    switch (action) {
      case 'create_document':
        const createResponse = await fetch(`https://docs.googleapis.com/v1/documents?key=${GOOGLE_DOCS_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: data.title || '새 보고서',
          }),
        })

        if (!createResponse.ok) {
          throw new Error(`Google Docs API error: ${createResponse.statusText}`)
        }

        const document = await createResponse.json()

        // Add content to the document
        if (data.content) {
          const updateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${document.documentId}:batchUpdate?key=${GOOGLE_DOCS_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requests: [
                {
                  insertText: {
                    location: {
                      index: 1,
                    },
                    text: data.content,
                  },
                },
              ],
            }),
          })

          if (!updateResponse.ok) {
            throw new Error(`Google Docs update error: ${updateResponse.statusText}`)
          }
        }

        // Save report to Supabase
        const { error: dbError } = await supabaseClient
          .from('reports')
          .insert({
            user_id: user.id,
            title: data.title || '새 보고서',
            content: data.content || '',
            google_doc_id: document.documentId,
          })

        if (dbError) {
          console.error('Database error:', dbError)
        }

        return new Response(JSON.stringify({
          success: true,
          documentId: document.documentId,
          documentUrl: `https://docs.google.com/document/d/${document.documentId}/edit`,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_document':
        const getResponse = await fetch(`https://docs.googleapis.com/v1/documents/${data.documentId}?key=${GOOGLE_DOCS_API_KEY}`)
        
        if (!getResponse.ok) {
          throw new Error(`Google Docs API error: ${getResponse.statusText}`)
        }

        const documentData = await getResponse.json()
        
        return new Response(JSON.stringify({
          success: true,
          document: documentData,
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