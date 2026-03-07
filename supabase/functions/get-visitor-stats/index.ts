import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:8081',
]
const CONFIGURED_ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? '').trim()
const ALLOWED_ORIGINS = (CONFIGURED_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const ALLOW_ALL_ORIGINS = !CONFIGURED_ALLOWED_ORIGINS || ALLOWED_ORIGINS.includes('*')
const INDIA_TIMEZONE = 'Asia/Kolkata'
const VISITOR_BASE_COUNT = Number.parseInt(Deno.env.get('VISITOR_BASE_COUNT') ?? '147', 10) || 147

function isAllowedOrigin(origin: string | null) {
  if (ALLOW_ALL_ORIGINS) return true
  if (!origin) return false
  if (ALLOWED_ORIGINS.includes(origin)) return true

  try {
    const parsed = new URL(origin)
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return true
    if ((parsed.hostname.startsWith('192.168.') || parsed.hostname.startsWith('10.')) && (parsed.port === '8080' || parsed.port === '8081')) {
      return true
    }
  } catch {
    return false
  }

  return false
}

function getCorsHeaders(origin: string | null) {
  const isAllowed = isAllowedOrigin(origin)
  return {
    ...(ALLOW_ALL_ORIGINS ? { 'Access-Control-Allow-Origin': '*' } : {}),
    ...(!ALLOW_ALL_ORIGINS && isAllowed && origin ? { 'Access-Control-Allow-Origin': origin } : {}),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    ...(!ALLOW_ALL_ORIGINS ? { Vary: 'Origin' } : {}),
  }
}

function getIndiaDateString() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: INDIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const originAllowed = isAllowedOrigin(origin)
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    if (!originAllowed) {
      return new Response('forbidden', { status: 403, headers: corsHeaders })
    }
    return new Response('ok', { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!originAllowed) {
    return new Response(JSON.stringify({ error: 'Forbidden origin' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const indiaDay = getIndiaDateString()

    const { data: dailyStats, error: dailyStatsError } = await supabase
      .from('daily_visitors')
      .select('unique_visitors,total_hits')
      .eq('day', indiaDay)
      .single()
    if (dailyStatsError && dailyStatsError.code !== 'PGRST116') {
      throw dailyStatsError
    }

    const { count, error: countError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
    if (countError) {
      throw countError
    }

    const totalCount = VISITOR_BASE_COUNT + (count || 0)
    return new Response(JSON.stringify({
      count: totalCount,
      dailyUniqueCount: dailyStats?.unique_visitors ?? 0,
      dailyTotalHits: dailyStats?.total_hits ?? 0,
      day: indiaDay,
      timezone: INDIA_TIMEZONE,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('get-visitor-stats failed', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
