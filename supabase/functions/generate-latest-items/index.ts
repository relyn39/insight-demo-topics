
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id } = await req.json()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Buscar feedbacks recentes do usuário para gerar últimos itens
    const { data: feedbacks, error: feedbacksError } = await supabase
      .from('feedbacks')
      .select('title, tags, analysis, created_at')
      .eq('user_id', user_id)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // últimos 30 dias
      .order('created_at', { ascending: false })

    if (feedbacksError) {
      throw feedbacksError
    }

    // Processar feedbacks para criar/atualizar últimos itens
    const itemCounts = new Map<string, { count: number, sentiment: string, keywords: string[] }>()

    feedbacks?.forEach(feedback => {
      const title = feedback.title || 'Item sem título'
      const current = itemCounts.get(title) || { count: 0, sentiment: 'neutral', keywords: [] }
      
      current.count += 1
      current.sentiment = feedback.analysis?.sentiment || 'neutral'
      current.keywords = [...current.keywords, ...(feedback.tags || [])]
      
      itemCounts.set(title, current)
    })

    // Limpar itens existentes do usuário
    await supabase
      .from('latest_items')
      .delete()
      .eq('user_id', user_id)

    // Inserir novos itens
    const itemsToInsert = Array.from(itemCounts.entries()).map(([title, data]) => ({
      user_id,
      title,
      count: data.count,
      sentiment: data.sentiment,
      change_percentage: Math.floor(Math.random() * 40) - 20, // Simular mudança percentual
      keywords: [...new Set(data.keywords)].slice(0, 5) // Remover duplicatas e limitar a 5
    }))

    if (itemsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('latest_items')
        .insert(itemsToInsert)

      if (insertError) {
        throw insertError
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Últimos itens gerados com sucesso!',
        itemsGenerated: itemsToInsert.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
