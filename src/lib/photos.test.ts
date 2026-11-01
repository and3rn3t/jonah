import { describe, expect, it } from 'vitest'
import { dataUrlToBlob, isLegacyPhoto, isStoredPhoto } from '@/lib/photos'

describe('dataUrlToBlob', () => {
  it('decodes base64 data URLs byte-for-byte', async () => {
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 1, 255])
    const base64 = btoa(String.fromCharCode(...bytes))

    const blob = dataUrlToBlob(`data:image/png;base64,${base64}`)

    expect(blob.type).toBe('image/png')
    expect(new Uint8Array(await blob.arrayBuffer())).toEqual(bytes)
  })

  it('decodes percent-encoded data URLs', async () => {
    const blob = dataUrlToBlob('data:text/plain,hello%20world')
    expect(blob.type).toBe('text/plain')
    expect(await blob.text()).toBe('hello world')
  })
})

describe('photo URL helpers', () => {
  it('tells legacy base64 photos from R2-stored ones', () => {
    expect(isLegacyPhoto('data:image/png;base64,AAAA')).toBe(true)
    expect(isLegacyPhoto('/api/photos/abc')).toBe(false)
    expect(isStoredPhoto('/api/photos/abc')).toBe(true)
    expect(isStoredPhoto('https://example.com/a.png')).toBe(false)
  })
})
