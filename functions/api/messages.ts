// POST /api/messages - Public contact form; appends one message server-side

import { json, type Env } from '../_lib/http'

type Context = EventContext<Env, string, Record<string, unknown>>

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  timestamp: number
  read: boolean
}

const MESSAGES_KEY = 'contact-messages'
const MAX_MESSAGES = 500
const RATE_LIMIT_SECONDS = 60 // KV's minimum expirationTtl
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const readField = (
  body: Record<string, unknown>,
  field: string,
  maxLength: number
): string | null => {
  const value = body[field]
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null
}

export const onRequestPost = async (context: Context): Promise<Response> => {
  const { request, env } = context

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const name = readField(body, 'name', 100)
  const email = readField(body, 'email', 254)
  const message = readField(body, 'message', 5000)
  if (!name || !email || !message || !EMAIL_PATTERN.test(email)) {
    return json({ error: 'Please provide a name, a valid email and a message' }, 400)
  }

  const ip = request.headers.get('CF-Connecting-IP')
  const rateLimitKey = ip ? `ratelimit:messages:${ip}` : null
  if (rateLimitKey && (await env.SITE_KV.get(rateLimitKey)) !== null) {
    return json({ error: 'Please wait a minute before sending another message' }, 429)
  }

  try {
    const stored = await env.SITE_KV.get(MESSAGES_KEY)
    const messages = stored ? (JSON.parse(stored) as ContactMessage[]) : []
    const newMessage: ContactMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      message,
      timestamp: Date.now(),
      read: false,
    }

    await env.SITE_KV.put(
      MESSAGES_KEY,
      JSON.stringify([...messages, newMessage].slice(-MAX_MESSAGES))
    )
    if (rateLimitKey) {
      await env.SITE_KV.put(rateLimitKey, '1', { expirationTtl: RATE_LIMIT_SECONDS })
    }

    return json({ success: true }, 201)
  } catch {
    return json({ error: 'Failed to save message' }, 500)
  }
}
