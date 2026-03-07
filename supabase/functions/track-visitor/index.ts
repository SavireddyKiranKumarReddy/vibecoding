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
const VISITOR_HASH_SALT = (Deno.env.get('VISITOR_HASH_SALT') ?? '').trim()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 30
const requestLog = new Map<string, number[]>()
const INDIA_TIMEZONE = 'Asia/Kolkata'
const VISITOR_BASE_COUNT = Number.parseInt(Deno.env.get('VISITOR_BASE_COUNT') ?? '147', 10) || 147
let didWarnAboutSaltFallback = false

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...(!ALLOW_ALL_ORIGINS ? { Vary: 'Origin' } : {}),
  }
}

function normalizeClientAddress(value: string) {
  let candidate = value.trim().replace(/^"+|"+$/g, '')
  if (!candidate) return ''

  // Keep the first forwarded value only.
  if (candidate.includes(',')) {
    candidate = candidate.split(',')[0].trim()
  }

  // [IPv6]:port
  if (candidate.startsWith('[') && candidate.includes(']')) {
    candidate = candidate.slice(1, candidate.indexOf(']'))
  }

  // IPv4:port
  if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(candidate)) {
    candidate = candidate.split(':')[0]
  }

  // IPv4-mapped IPv6
  if (candidate.startsWith('::ffff:')) {
    candidate = candidate.slice('::ffff:'.length)
  }

  // IPv6 zone index
  if (candidate.includes('%')) {
    candidate = candidate.split('%')[0]
  }

  return candidate.trim()
}

function getClientAddress(req: Request) {
  const candidates = [
    req.headers.get('cf-connecting-ip'),
    req.headers.get('x-real-ip'),
    req.headers.get('x-forwarded-for'),
  ]

  for (const raw of candidates) {
    if (!raw) continue
    const normalized = normalizeClientAddress(raw)
    if (normalized) return normalized
  }

  // Last-resort fingerprint to avoid freezing the counter when proxy headers are absent.
  const userAgent = (req.headers.get('user-agent') ?? '').trim()
  const acceptLanguage = (req.headers.get('accept-language') ?? '').trim()
  const fallback = `${userAgent}|${acceptLanguage}`.trim()
  return fallback || 'unknown-client'
}

function getVisitorHashSalt() {
  if (VISITOR_HASH_SALT) {
    return VISITOR_HASH_SALT
  }

  const projectScopedFallback = (Deno.env.get('SUPABASE_URL') ?? '').trim() || 'default'
  if (!didWarnAboutSaltFallback) {
    didWarnAboutSaltFallback = true
    console.warn('VISITOR_HASH_SALT is missing. Using project-scoped fallback salt.')
  }
  return `fallback:${projectScopedFallback}`
}

async function sha256(value: string) {
  const encoded = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function isRateLimited(key: string) {
  const now = Date.now()
  const previous = requestLog.get(key) ?? []
  const inWindow = previous.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)
  if (inWindow.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, inWindow)
    return true
  }
  inWindow.push(now)
  requestLog.set(key, inWindow)
  return false
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

  if (req.method !== 'POST') {
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
    const clientAddress = getClientAddress(req)
    const hashSalt = getVisitorHashSalt()
    const ipHash = await sha256(`${hashSalt}:${clientAddress}`)
    if (isRateLimited(ipHash)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const indiaDay = getIndiaDateString()

    const { error: upsertError } = await supabase
      .from('visitors')
      .upsert(
        { ip_hash: ipHash },
        { onConflict: 'ip_hash', ignoreDuplicates: true },
      )
    if (upsertError) {
      throw upsertError
    }

    const { error: ensureDailyRowError } = await supabase
      .from('daily_visitors')
      .upsert(
        { day: indiaDay },
        { onConflict: 'day', ignoreDuplicates: true },
      )
    if (ensureDailyRowError) {
      throw ensureDailyRowError
    }

    const { error: dailyHitsError } = await supabase.rpc('increment_daily_total_hits', {
      target_day: indiaDay,
    })
    if (dailyHitsError) {
      throw dailyHitsError
    }

    const { data: newDailyVisitorRows, error: dailyUniqueError } = await supabase
      .from('daily_visitor_hashes')
      .upsert(
        { day: indiaDay, ip_hash: ipHash },
        { onConflict: 'day,ip_hash', ignoreDuplicates: true },
      )
      .select('day')
    if (dailyUniqueError) {
      throw dailyUniqueError
    }

    if ((newDailyVisitorRows?.length ?? 0) > 0) {
      const { error: incrementUniqueError } = await supabase.rpc('increment_daily_unique_visitors', {
        target_day: indiaDay,
      })
      if (incrementUniqueError) {
        throw incrementUniqueError
      }
    }

    const { data: dailyStats, error: dailyStatsError } = await supabase
      .from('daily_visitors')
      .select('unique_visitors,total_hits')
      .eq('day', indiaDay)
      .single()
    if (dailyStatsError) {
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
    console.error('track-visitor failed', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
