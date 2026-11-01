// Cloudflare Pages Function for KV storage operations
// GET /api/kv/[key] - Retrieve a value (public keys, or admin)
// PUT /api/kv/[key] - Store a value (admin only)

import { isAdmin, json, type Env } from '../../_lib/http'

type Context = EventContext<Env, 'key', Record<string, unknown>>

const PUBLIC_READ_KEYS = new Set(['site-content', 'swimming-goals', 'gallery-photos'])
const ADMIN_KEYS = new Set([...PUBLIC_READ_KEYS, 'contact-messages'])

// KV's own value limit is 25 MiB; gallery-photos still holds base64 images until they move to R2.
const MAX_BODY_BYTES = 20 * 1024 * 1024

export const onRequestGet = async (context: Context): Promise<Response> => {
  const key = context.params.key as string

  if (!ADMIN_KEYS.has(key)) return json({ error: 'Not found' }, 404)

  const isPublic = PUBLIC_READ_KEYS.has(key)
  if (!isPublic && !(await isAdmin(context.request, context.env))) {
    return json({ error: 'Unauthorized' }, 401)
  }

  try {
    const value = await context.env.SITE_KV.get(key)
    const headers: HeadersInit = isPublic ? {} : { 'Cache-Control': 'no-store' }
    return json({ value: value === null ? null : JSON.parse(value) }, 200, headers)
  } catch {
    return json({ error: 'Failed to retrieve value' }, 500)
  }
}

export const onRequestPut = async (context: Context): Promise<Response> => {
  const key = context.params.key as string

  if (!ADMIN_KEYS.has(key)) return json({ error: 'Not found' }, 404)
  if (!(await isAdmin(context.request, context.env))) return json({ error: 'Unauthorized' }, 401)

  const contentLength = Number(context.request.headers.get('Content-Length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'Payload too large' }, 413)

  try {
    const body = (await context.request.json()) as { value?: unknown }
    if (body.value === undefined) return json({ error: 'Missing value' }, 400)

    await context.env.SITE_KV.put(key, JSON.stringify(body.value))
    return json({ success: true })
  } catch {
    return json({ error: 'Failed to store value' }, 500)
  }
}
