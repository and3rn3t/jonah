// Shared helpers for Pages Functions. Files without onRequest* exports don't create routes.

export interface Env {
  SITE_KV: KVNamespace
  ADMIN_TOKEN?: string
}

export const json = (body: unknown, status = 200, headers: HeadersInit = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', ...headers },
  })

const sha256 = async (text: string): Promise<ArrayBuffer> =>
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))

/** Constant-time check of `Authorization: Bearer <ADMIN_TOKEN>`. Fails closed when unset. */
export const isAdmin = async (request: Request, env: Env): Promise<boolean> => {
  if (!env.ADMIN_TOKEN) return false

  const header = request.headers.get('Authorization') ?? ''
  if (!header.startsWith('Bearer ')) return false

  const [given, expected] = await Promise.all([sha256(header.slice(7)), sha256(env.ADMIN_TOKEN)])
  return crypto.subtle.timingSafeEqual(given, expected)
}
