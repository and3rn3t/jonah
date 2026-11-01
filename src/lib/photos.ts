import { authHeaders } from '@/lib/adminToken'

const MAX_DIMENSION = 1600
const QUALITY = 0.85
const STORED_PREFIX = '/api/photos/'

export const isStoredPhoto = (url: string): boolean => url.startsWith(STORED_PREFIX)
export const isLegacyPhoto = (url: string): boolean => url.startsWith('data:')

/** Decodes a base64 `data:` URL locally; fetch() of data: URLs is blocked by the CSP connect-src. */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, payload = ''] = dataUrl.split(',', 2)
  const mimeType = /^data:([^;,]+)/.exec(header)?.[1] ?? 'application/octet-stream'
  if (!header.includes(';base64')) {
    return new Blob([decodeURIComponent(payload)], { type: mimeType })
  }
  const binary = atob(payload)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mimeType })
}

export const newPhotoId = (): string => crypto.randomUUID()

const canvasToBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY))

/** Downscales to MAX_DIMENSION and re-encodes as WebP (JPEG where WebP encoding is unsupported). */
export async function compressImage(source: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas not supported')
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const webp = await canvasToBlob(canvas, 'image/webp')
  if (webp?.type === 'image/webp') return webp

  const jpeg = await canvasToBlob(canvas, 'image/jpeg')
  if (!jpeg) throw new Error('Could not encode image')
  return jpeg
}

/** Compresses and uploads an image to R2, returning its public URL. */
export async function uploadPhoto(id: string, source: Blob): Promise<string> {
  const image = await compressImage(source)
  const response = await fetch(`${STORED_PREFIX}${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': image.type, ...authHeaders() },
    body: image,
  })
  if (!response.ok) throw new Error(`Upload failed (${response.status})`)
  const { url } = (await response.json()) as { url: string }
  return url
}

export async function deleteStoredPhoto(url: string): Promise<void> {
  if (!isStoredPhoto(url)) return
  await fetch(url, { method: 'DELETE', headers: authHeaders() })
}
