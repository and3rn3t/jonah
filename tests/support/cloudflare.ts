// Minimal in-memory stand-ins for the Pages Functions runtime, covering only what functions/ uses.
import type { Env } from '../../functions/_lib/http'

export const ADMIN_TOKEN = 'test-admin-token'

export class MemoryKV {
  readonly store = new Map<string, string>()
  readonly ttls = new Map<string, number>()

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null
  }

  async put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
    this.store.set(key, value)
    if (options?.expirationTtl) this.ttls.set(key, options.expirationTtl)
  }
}

interface StoredObject {
  body: ArrayBuffer
  contentType?: string
}

export class MemoryR2 {
  readonly store = new Map<string, StoredObject>()

  async get(key: string) {
    const object = this.store.get(key)
    if (!object) return null
    return {
      body: object.body,
      httpEtag: `"${key}-etag"`,
      writeHttpMetadata: (headers: Headers) => {
        if (object.contentType) headers.set('Content-Type', object.contentType)
      },
    }
  }

  async put(
    key: string,
    body: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } }
  ): Promise<void> {
    this.store.set(key, { body, contentType: options?.httpMetadata?.contentType })
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }
}

export interface TestEnv {
  kv: MemoryKV
  r2: MemoryR2
  env: Env
}

export function createEnv({ adminToken = ADMIN_TOKEN }: { adminToken?: string } = {}): TestEnv {
  const kv = new MemoryKV()
  const r2 = new MemoryR2()
  const env = {
    SITE_KV: kv,
    PHOTOS: r2,
    ADMIN_TOKEN: adminToken || undefined,
  } as unknown as Env
  return { kv, r2, env }
}

/** Builds the slice of EventContext the handlers read: request, env and params. */
export function createContext<C>(
  env: Env,
  request: Request,
  params: Record<string, string> = {}
): C {
  return { request, env, params } as unknown as C
}

export const adminHeaders = (token = ADMIN_TOKEN): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
})
