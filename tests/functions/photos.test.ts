import { describe, expect, it } from 'vitest'
import { onRequestDelete, onRequestGet, onRequestPut } from '../../functions/api/photos/[id]'
import { adminHeaders, createContext, createEnv } from '../support/cloudflare'

type Context = Parameters<typeof onRequestGet>[0]
type Env = ReturnType<typeof createEnv>['env']

const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3])

const request = (id: string, init: RequestInit = {}): Context =>
  createContext<Context>({} as Env, new Request(`https://example.test/api/photos/${id}`, init), {
    id,
  })

const withEnv = (env: Env, context: Context): Context => ({ ...context, env }) as Context

const upload = (
  env: Env,
  id: string,
  headers: Record<string, string>,
  body: BodyInit = PNG_BYTES
) => onRequestPut(withEnv(env, request(id, { method: 'PUT', headers, body })))

describe('/api/photos/:id', () => {
  it('uploads for admins and serves the image with immutable caching', async () => {
    const { r2, env } = createEnv()

    const putResponse = await upload(env, 'abc-123', {
      ...adminHeaders(),
      'Content-Type': 'image/png',
    })
    expect(putResponse.status).toBe(201)
    expect(await putResponse.json()).toEqual({ url: '/api/photos/abc-123' })
    expect(r2.store.get('abc-123')?.contentType).toBe('image/png')

    const getResponse = await onRequestGet(withEnv(env, request('abc-123')))
    expect(getResponse.status).toBe(200)
    expect(getResponse.headers.get('Content-Type')).toBe('image/png')
    expect(getResponse.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable')
    expect(getResponse.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(new Uint8Array(await getResponse.arrayBuffer())).toEqual(PNG_BYTES)
  })

  it('rejects uploads without a token', async () => {
    const { r2, env } = createEnv()
    expect((await upload(env, 'abc', { 'Content-Type': 'image/png' })).status).toBe(401)
    expect(r2.store.size).toBe(0)
  })

  it.each([
    ['SVG', 'image/svg+xml'],
    ['non-image', 'text/html'],
  ])('rejects %s uploads', async (_label, contentType) => {
    const { env } = createEnv()
    const response = await upload(env, 'abc', { ...adminHeaders(), 'Content-Type': contentType })
    expect(response.status).toBe(415)
  })

  it('rejects empty and oversized uploads', async () => {
    const { env } = createEnv()
    const headers = { ...adminHeaders(), 'Content-Type': 'image/png' }

    expect((await upload(env, 'abc', headers, new Uint8Array(0))).status).toBe(400)
    expect((await upload(env, 'abc', headers, new Uint8Array(10 * 1024 * 1024 + 1))).status).toBe(
      413
    )
  })

  it('rejects ids outside the allowed pattern', async () => {
    const { env } = createEnv()
    const headers = { ...adminHeaders(), 'Content-Type': 'image/png' }

    expect((await upload(env, '..%2Fsecret', headers)).status).toBe(400)
    expect((await onRequestGet(withEnv(env, request('a.b')))).status).toBe(404)
  })

  it('404s unknown photos', async () => {
    const { env } = createEnv()
    expect((await onRequestGet(withEnv(env, request('missing')))).status).toBe(404)
  })

  it('deletes only for admins', async () => {
    const { r2, env } = createEnv()
    await upload(env, 'abc', { ...adminHeaders(), 'Content-Type': 'image/png' })

    expect((await onRequestDelete(withEnv(env, request('abc', { method: 'DELETE' })))).status).toBe(
      401
    )
    expect(r2.store.has('abc')).toBe(true)

    const response = await onRequestDelete(
      withEnv(env, request('abc', { method: 'DELETE', headers: adminHeaders() }))
    )
    expect(response.status).toBe(200)
    expect(r2.store.has('abc')).toBe(false)
  })
})
