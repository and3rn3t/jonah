// Cloudflare Pages Function for KV storage operations
// GET /api/kv/[key] - Retrieve a value
// PUT /api/kv/[key] - Store a value

// Types provided by @cloudflare/workers-types
interface Env {
  SITE_KV: KVNamespace
}

type Context = EventContext<Env, 'key', Record<string, unknown>>

export const onRequestGet = async (context: Context): Promise<Response> => {
  const key = context.params.key as string

  if (!key) {
    return new Response(JSON.stringify({ error: 'Key is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const value = await context.env.SITE_KV.get(key)

    if (value === null) {
      return new Response(JSON.stringify({ value: null }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    return new Response(JSON.stringify({ value: JSON.parse(value) }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to retrieve value' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const onRequestPut = async (context: Context): Promise<Response> => {
  const key = context.params.key as string

  if (!key) {
    return new Response(JSON.stringify({ error: 'Key is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await context.request.json() as { value: unknown }
    await context.env.SITE_KV.put(key, JSON.stringify(body.value))

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to store value' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
