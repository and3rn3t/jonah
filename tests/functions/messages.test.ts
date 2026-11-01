import { describe, expect, it } from 'vitest'
import { onRequestPost } from '../../functions/api/messages'
import { createContext, createEnv } from '../support/cloudflare'

type Context = Parameters<typeof onRequestPost>[0]

const post = (
  env: ReturnType<typeof createEnv>['env'],
  body: unknown,
  headers: Record<string, string> = {}
) =>
  onRequestPost(
    createContext<Context>(
      env,
      new Request('https://example.test/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      })
    )
  )

const validMessage = { name: 'Sam', email: 'sam@example.com', message: 'Hi Jonah!' }

const storedMessages = (kv: ReturnType<typeof createEnv>['kv']) =>
  JSON.parse(kv.store.get('contact-messages') ?? '[]') as Array<Record<string, unknown>>

describe('POST /api/messages', () => {
  it('appends a trimmed, unread message server-side', async () => {
    const { kv, env } = createEnv()
    await kv.put('contact-messages', JSON.stringify([{ id: 'old' }]))

    const response = await post(env, { ...validMessage, name: '  Sam  ' })

    expect(response.status).toBe(201)
    const messages = storedMessages(kv)
    expect(messages).toHaveLength(2)
    expect(messages[1]).toMatchObject({ name: 'Sam', email: validMessage.email, read: false })
    expect(typeof messages[1].id).toBe('string')
  })

  it.each([
    ['missing name', { ...validMessage, name: '' }],
    ['blank message', { ...validMessage, message: '   ' }],
    ['invalid email', { ...validMessage, email: 'not-an-email' }],
    ['non-string field', { ...validMessage, name: 42 }],
    ['oversized message', { ...validMessage, message: 'x'.repeat(5001) }],
  ])('rejects %s', async (_label, body) => {
    const { kv, env } = createEnv()
    expect((await post(env, body)).status).toBe(400)
    expect(kv.store.has('contact-messages')).toBe(false)
  })

  it('rejects invalid JSON', async () => {
    const { env } = createEnv()
    expect((await post(env, '{not json')).status).toBe(400)
  })

  it('rate-limits repeat messages from the same IP', async () => {
    const { kv, env } = createEnv()
    const ip = { 'CF-Connecting-IP': '203.0.113.7' }

    expect((await post(env, validMessage, ip)).status).toBe(201)
    expect(kv.ttls.get('ratelimit:messages:203.0.113.7')).toBe(60)
    expect((await post(env, validMessage, ip)).status).toBe(429)
    expect((await post(env, validMessage, { 'CF-Connecting-IP': '203.0.113.8' })).status).toBe(201)
    expect(storedMessages(kv)).toHaveLength(2)
  })

  it('keeps only the most recent 500 messages', async () => {
    const { kv, env } = createEnv()
    const existing = Array.from({ length: 500 }, (_, i) => ({ id: String(i) }))
    await kv.put('contact-messages', JSON.stringify(existing))

    await post(env, validMessage)

    const messages = storedMessages(kv)
    expect(messages).toHaveLength(500)
    expect(messages[0].id).toBe('1')
    expect(messages[499].name).toBe('Sam')
  })
})
