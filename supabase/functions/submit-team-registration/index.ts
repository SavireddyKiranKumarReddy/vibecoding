import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOW_ALL_ORIGINS = true

type RegistrationPayload = {
  teamName?: string
  member1Name?: string
  member1Email?: string
  member1Contact?: string
  member1College?: string
  member1Year?: string
  member1Department?: string
  member1Linkedin?: string
  member1Github?: string
  member1PostLink?: string
  member2Name?: string
  member2Email?: string
  member2Contact?: string
  member2College?: string
  member2Year?: string
  member2Department?: string
  member2Linkedin?: string
  member2Github?: string
  member2PostLink?: string
}

const REQUIRED_FIELDS: Array<keyof RegistrationPayload> = [
  'teamName',
  'member1Name',
  'member1Email',
  'member1Contact',
  'member1PostLink',
  'member2Name',
  'member2Email',
  'member2Contact',
  'member2PostLink',
]

function isAllowedOrigin(origin: string | null) {
  if (ALLOW_ALL_ORIGINS) return true
  return Boolean(origin)
}

function getCorsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)
  const originAllowed = isAllowedOrigin(origin)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: originAllowed ? 204 : 403, headers: corsHeaders })
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
    const payload = (await req.json()) as RegistrationPayload
    const normalize = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
    const missing = REQUIRED_FIELDS.find((field) => !normalize(payload[field]))
    if (missing) {
      return new Response(JSON.stringify({ error: `${missing} is required` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const baseTeamName = normalize(payload.teamName) || `Team-${Date.now()}`

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const teamName = attempt === 0 ? baseTeamName : `${baseTeamName}-${attempt + 1}`
      const { error: insertError } = await supabase.from('team_registrations').insert({
        team_name: teamName,
        member1_name: normalize(payload.member1Name),
        member1_email: normalize(payload.member1Email),
        member1_contact: normalize(payload.member1Contact),
        member1_college: normalize(payload.member1College),
        member1_year: normalize(payload.member1Year),
        member1_department: normalize(payload.member1Department),
        member1_linkedin: normalize(payload.member1Linkedin),
        member1_github: normalize(payload.member1Github),
        member1_post_link: normalize(payload.member1PostLink),
        member2_name: normalize(payload.member2Name),
        member2_email: normalize(payload.member2Email),
        member2_contact: normalize(payload.member2Contact),
        member2_college: normalize(payload.member2College),
        member2_year: normalize(payload.member2Year),
        member2_department: normalize(payload.member2Department),
        member2_linkedin: normalize(payload.member2Linkedin),
        member2_github: normalize(payload.member2Github),
        member2_post_link: normalize(payload.member2PostLink),
        contact_number: null,
        organization: null,
        skills: null,
      })
      if (!insertError) {
        return new Response(JSON.stringify({ success: true, teamName }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      if (insertError.code !== '23505') {
        throw insertError
      }
    }

    return new Response(JSON.stringify({ error: 'Could not generate unique team name, please retry' }), {
      status: 409,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('submit-team-registration failed', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
