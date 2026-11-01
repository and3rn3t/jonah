import { timingSafeEqual } from 'node:crypto'

// Workers-only extension used by functions/_lib/http.ts isAdmin(); Node's SubtleCrypto lacks it
const subtle = crypto.subtle as SubtleCrypto & {
  timingSafeEqual?: (a: ArrayBuffer | ArrayBufferView, b: ArrayBuffer | ArrayBufferView) => boolean
}
if (!subtle.timingSafeEqual) {
  const toBytes = (value: ArrayBuffer | ArrayBufferView): Uint8Array =>
    ArrayBuffer.isView(value)
      ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
      : new Uint8Array(value)
  subtle.timingSafeEqual = (a, b) => timingSafeEqual(toBytes(a), toBytes(b))
}
