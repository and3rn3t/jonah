import { describe, expect, it } from 'vitest'
import { onRequestGet, onRequestPut } from '../../functions/api/kv/[key]'
import { adminHeaders, createContext, createEnv } from '../support/cloudflare'

type Context = Parameters<typeof onRequestGet>[0]

const url = (key: string): string => `https://example.test/api/kv/${key}`

const get = (env: ReturnType<typeof createEnv>['env'], key: string, headers = {}) =>
  onRequestGet(createContext<Context>(env, new Request(url(key), { headers }), { key }))

const put = (
  env: ReturnType<typeof createEnv>['env'],
  key: string,
  body: unknown,
  headers: Record<string, string> = {}
) =>
  onRequestPut(
    createContext<Context>(
      env,
      new Request(url(key), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      }),
      { key }
    )
  )

describe('GET /api/kv/:key', () => {
  it('serves public keys without auth', async () => {
    const { kv, env } = createEnv()
    await kv.put('site-content', JSON.stringify({ profile: { name: 'Jonah' } }))

    const response = await get(env, 'site-content')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ value: { profile: { name: 'Jonah' } } })
  })

  it('returns null for a public key with no stored value', async () => {
    const { env } = createEnv()
    const response = await get(env, 'swimming-goals')
    expect(await response.json()).toEqual({ value: null })
  })

  it('404s keys outside the allowlist, even for admins', async () => {
    const { kv, env } = createEnv()
    await kv.put('admin-password', JSON.stringify('admin123'))

    expect((await get(env, 'admin-password')).status).toBe(404)
    expect((await get(env, 'admin-password', adminHeaders())).status).toBe(404)
  })

  it('requires the admin token for contact-messages', async () => {
    const { kv, env } = createEnv()
    await kv.put('contact-messages', JSON.stringify([{ id: '1' }]))

    expect((await get(env, 'contact-messages')).status).toBe(401)
    expect((await get(env, 'contact-messages', adminHeaders('wrong'))).status).toBe(401)

    const response = await get(env, 'contact-messages', adminHeaders())
    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(await response.json()).toEqual({ value: [{ id: '1' }] })
  })

  it('fails closed when ADMIN_TOKEN is not configured', async () => {
    const { env } = createEnv({ adminToken: '' })
    expect((await get(env, 'contact-messages', adminHeaders(''))).status).toBe(401)
  })
})

describe('PUT /api/kv/:key', () => {
  it('rejects writes without a valid token', async () => {
    const { kv, env } = createEnv()

    expect((await put(env, 'site-content', { value: { x: 1 } })).status).toBe(401)
    expect((await put(env, 'site-content', { value: { x: 1 } }, adminHeaders('nope'))).status).toBe(
      401
    )
    expect(kv.store.has('site-content')).toBe(false)
  })

  it('stores the value for admins', async () => {
    const { kv, env } = createEnv()

    const response = await put(env, 'site-content', { value: { x: 1 } }, adminHeaders())

    expect(response.status).toBe(200)
    expect(kv.store.get('site-content')).toBe('{"x":1}')
  })

  it('404s keys outside the allowlist', async () => {
    const { kv, env } = createEnv()
    expect((await put(env, 'admin-password', { value: 'x' }, adminHeaders())).status).toBe(404)
    expect(kv.store.size).toBe(0)
  })

  it('rejects a body without a value', async () => {
    const { env } = createEnv()
    expect((await put(env, 'site-content', {}, adminHeaders())).status).toBe(400)
  })

  it('rejects oversized bodies by Content-Length', async () => {
    const { env } = createEnv()
    const response = await put(
      env,
      'site-content',
      { value: 1 },
      {
        ...adminHeaders(),
        'Content-Length': String(21 * 1024 * 1024),
      }
    )
    expect(response.status).toBe(413)
  })
})
