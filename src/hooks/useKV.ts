import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom useKV hook for Cloudflare KV storage
 * Compatible API with @github/spark/hooks useKV
 * Falls back to localStorage when KV API is unavailable
 */
export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    // Try to load from localStorage first for immediate hydration
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`kv:${key}`)
        if (stored !== null) {
          return JSON.parse(stored) as T
        }
      } catch {
        // Ignore parse errors
      }
    }
    return defaultValue
  })

  const [isLoaded, setIsLoaded] = useState(false)
  const pendingUpdate = useRef<T | null>(null)
  const isUpdating = useRef(false)

  // Fetch from Cloudflare KV on mount
  useEffect(() => {
    let cancelled = false

    const fetchValue = async () => {
      try {
        const response = await fetch(`/api/kv/${encodeURIComponent(key)}`)
        if (response.ok) {
          const data = await response.json() as { value: T | null }
          if (!cancelled && data.value !== null) {
            setValue(data.value)
            // Sync to localStorage
            localStorage.setItem(`kv:${key}`, JSON.stringify(data.value))
          }
        }
      } catch {
        // Fall back to localStorage (already loaded in initial state)
        console.warn(`Failed to fetch KV value for ${key}, using localStorage fallback`)
      } finally {
        if (!cancelled) {
          setIsLoaded(true)
        }
      }
    }

    fetchValue()

    return () => {
      cancelled = true
    }
  }, [key])

  // Persist to Cloudflare KV
  const persistToKV = useCallback(async (newValue: T) => {
    // Always save to localStorage immediately
    localStorage.setItem(`kv:${key}`, JSON.stringify(newValue))

    // Queue the update if already updating
    if (isUpdating.current) {
      pendingUpdate.current = newValue
      return
    }

    isUpdating.current = true

    try {
      await fetch(`/api/kv/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue })
      })
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
  }, [key])

  // Setter function compatible with useState setter
  const setKVValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue

      // Persist async
      persistToKV(resolved)

      return resolved
    })
  }, [persistToKV])

  return [value, setKVValue]
}

/**
 * Alternative hook that returns loading state
 */
export function useKVWithLoading<T>(key: string, defaultValue: T): {
  value: T
  setValue: (value: T | ((prev: T) => T)) => void
  isLoading: boolean
} {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)
  const pendingUpdate = useRef<T | null>(null)
  const isUpdating = useRef(false)

  useEffect(() => {
    let cancelled = false

    const fetchValue = async () => {
      // Try localStorage first
      try {
        const stored = localStorage.getItem(`kv:${key}`)
        if (stored !== null) {
          setValue(JSON.parse(stored) as T)
        }
      } catch {
        // Ignore
      }

      try {
        const response = await fetch(`/api/kv/${encodeURIComponent(key)}`)
        if (response.ok) {
          const data = await response.json() as { value: T | null }
          if (!cancelled && data.value !== null) {
            setValue(data.value)
            localStorage.setItem(`kv:${key}`, JSON.stringify(data.value))
          }
        }
      } catch {
        console.warn(`Failed to fetch KV value for ${key}`)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchValue()
    return () => { cancelled = true }
  }, [key])

  const persistToKV = useCallback(async (newValue: T) => {
    localStorage.setItem(`kv:${key}`, JSON.stringify(newValue))

    if (isUpdating.current) {
      pendingUpdate.current = newValue
      return
    }

    isUpdating.current = true

    try {
      await fetch(`/api/kv/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue })
      })
    } catch {
      console.warn(`Failed to persist KV value for ${key}`)
    } finally {
      isUpdating.current = false
      if (pendingUpdate.current !== null) {
        const pending = pendingUpdate.current
        pendingUpdate.current = null
        persistToKV(pending)
      }
    }
  }, [key])

  const setKVValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue
      persistToKV(resolved)
      return resolved
    })
  }, [persistToKV])

  return { value, setValue: setKVValue, isLoading }
}
