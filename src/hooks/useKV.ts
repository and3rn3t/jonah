import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { authHeaders, clearAdminToken } from '@/lib/adminToken'

interface UseKVOptions {
  /**
   * Admin-only key: skips the localStorage cache (keeps private data off shared devices)
   * and only fetches while `enabled` is true.
   */
  requiresAuth?: boolean
  enabled?: boolean
}

/**
 * Custom useKV hook for Cloudflare KV storage
 * Falls back to localStorage when KV API is unavailable
 */
export function useKV<T>(
  key: string,
  defaultValue: T,
  { requiresAuth = false, enabled = true }: UseKVOptions = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const useCache = !requiresAuth

  const [value, setValue] = useState<T>(() => {
    // Try to load from localStorage first for immediate hydration
    if (!useCache || typeof window === 'undefined') return defaultValue
    try {
      const stored = localStorage.getItem(`kv:${key}`)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch {
      // Ignore parse errors
    }
    return defaultValue
  })

  const pendingUpdate = useRef<T | null>(null)
  const isUpdating = useRef(false)

  // Fetch from Cloudflare KV on mount
  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    const fetchValue = async () => {
      try {
        const response = await fetch(`/api/kv/${encodeURIComponent(key)}`, {
          headers: requiresAuth ? authHeaders() : {},
        })
        if (!response.ok) return
        const data = (await response.json()) as { value: T | null }
        if (cancelled || data.value === null) return
        setValue(data.value)
        if (useCache) localStorage.setItem(`kv:${key}`, JSON.stringify(data.value))
      } catch {
        // Fall back to localStorage (already loaded in initial state)
        console.warn(`Failed to fetch KV value for ${key}, using localStorage fallback`)
      }
    }

    fetchValue()

    return () => {
      cancelled = true
    }
  }, [key, enabled, requiresAuth, useCache])

  // Persist to Cloudflare KV
  const persistToKV = useCallback(
    async (newValue: T) => {
      if (useCache) localStorage.setItem(`kv:${key}`, JSON.stringify(newValue))

      // Queue the update if already updating
      if (isUpdating.current) {
        pendingUpdate.current = newValue
        return
      }

      isUpdating.current = true

      try {
        const response = await fetch(`/api/kv/${encodeURIComponent(key)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ value: newValue }),
        })
        if (response.status === 401) {
          clearAdminToken()
          toast.error('Admin session expired. Unlock the admin panel again to save.')
        } else if (!response.ok) {
          toast.error(`Couldn't save ${key} (error ${response.status})`)
        }
      } catch {
        console.warn(`Failed to persist KV value for ${key}`)
      } finally {
        isUpdating.current = false

        // Process any pending updates
        if (pendingUpdate.current !== null) {
          const pending = pendingUpdate.current
          pendingUpdate.current = null
          persistToKV(pending)
        }
      }
    },
    [key, useCache]
  )

  // Setter function compatible with useState setter
  const setKVValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue

        // Persist async
        persistToKV(resolved)

        return resolved
      })
    },
    [persistToKV]
  )

  return [value, setKVValue]
}
