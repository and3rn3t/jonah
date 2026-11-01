// Cloudflare Pages Function for gallery images in R2
// GET    /api/photos/[id] - Serve an image (public, immutable)
// PUT    /api/photos/[id] - Upload an image body (admin only)
// DELETE /api/photos/[id] - Remove an image (admin only)

import { isAdmin, json, type Env } from '../../_lib/http'

type Context = EventContext<Env, 'id', Record<string, unknown>>

const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

const readId = (context: Context): string | null => {
  const id = context.params.id as string
  return ID_PATTERN.test(id) ? id : null
}

export const onRequestGet = async (context: Context): Promise<Response> => {
  const id = readId(context)
  if (!id) return json({ error: 'Not found' }, 404)

  const object = await context.env.PHOTOS.get(id)
  if (!object) return json({ error: 'Not found' }, 404)

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('ETag', object.httpEtag)
  // Ids are never reused: a new upload always gets a new id
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.set('X-Content-Type-Options', 'nosniff')

  return new Response(object.body, { headers })
}

export const onRequestPut = async (context: Context): Promise<Response> => {
  const id = readId(context)
  if (!id) return json({ error: 'Invalid id' }, 400)
  if (!(await isAdmin(context.request, context.env))) return json({ error: 'Unauthorized' }, 401)

  const contentType = context.request.headers.get('Content-Type') ?? ''
  if (!contentType.startsWith('image/') || contentType.includes('svg')) {
    return json({ error: 'Only raster images are allowed' }, 415)
  }

  const body = await context.request.arrayBuffer()
  if (body.byteLength === 0) return json({ error: 'Empty body' }, 400)
  if (body.byteLength > MAX_IMAGE_BYTES) return json({ error: 'Image too large' }, 413)

  await context.env.PHOTOS.put(id, body, { httpMetadata: { contentType } })
  return json({ url: `/api/photos/${id}` }, 201)
}

export const onRequestDelete = async (context: Context): Promise<Response> => {
  const id = readId(context)
  if (!id) return json({ error: 'Invalid id' }, 400)
  if (!(await isAdmin(context.request, context.env))) return json({ error: 'Unauthorized' }, 401)

  await context.env.PHOTOS.delete(id)
  return json({ success: true })
}
