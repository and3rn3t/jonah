// Admin token lives in sessionStorage so it is cleared when the tab closes.
const STORAGE_KEY = 'admin-token'

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, token)
  } catch {
    // Storage unavailable (private mode); the session just won't survive a reload
  }
}

export function clearAdminToken(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}

export function authHeaders(token: string | null = getAdminToken()): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/** Checks a token against the server by reading an admin-only key. */
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/kv/contact-messages', { headers: authHeaders(token) })
    return response.ok
  } catch {
    return false
  }
}
