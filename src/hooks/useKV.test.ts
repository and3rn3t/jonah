// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { useKV } from '@/hooks/useKV'
import { getAdminToken, setAdminToken } from '@/lib/adminToken'

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

let fetchMock: ReturnType<typeof vi.fn>

const requests = (method: string) =>
  fetchMock.mock.calls.filter(
    ([, init]) => ((init as RequestInit | undefined)?.method ?? 'GET') === method
  )

const sentValue = (call: unknown[]): unknown =>
  JSON.parse((call[1] as RequestInit).body as string).value

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  fetchMock = vi.fn().mockResolvedValue(jsonResponse({ value: null }))
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.mocked(toast.error).mockClear()
})

describe('useKV', () => {
  it('hydrates from the localStorage cache, then from the server', async () => {
    localStorage.setItem('kv:site-content', JSON.stringify({ name: 'cached' }))
    fetchMock.mockResolvedValueOnce(jsonResponse({ value: { name: 'server' } }))

    const { result } = renderHook(() => useKV('site-content', { name: 'default' }))

    expect(result.current[0]).toEqual({ name: 'cached' })
    await waitFor(() => expect(result.current[0]).toEqual({ name: 'server' }))
    expect(localStorage.getItem('kv:site-content')).toBe('{"name":"server"}')
  })

  it('keeps the default when the server has no value', async () => {
    const { result } = renderHook(() => useKV('swimming-goals', ['default']))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(result.current[0]).toEqual(['default'])
  })

  it('falls back to the cache when the request fails', async () => {
    localStorage.setItem('kv:site-content', JSON.stringify('cached'))
    fetchMock.mockRejectedValueOnce(new Error('offline'))

    const { result } = renderHook(() => useKV('site-content', 'default'))

    await waitFor(() => expect(console.warn).toHaveBeenCalled())
    expect(result.current[0]).toBe('cached')
  })

  it('persists updates with the admin token and supports functional updates', async () => {
    setAdminToken('secret')
    fetchMock.mockResolvedValue(jsonResponse({ success: true }))
    const { result } = renderHook(() => useKV('swimming-goals', [1]))

    act(() => result.current[1]((previous) => [...previous, 2]))

    expect(result.current[0]).toEqual([1, 2])
    expect(localStorage.getItem('kv:swimming-goals')).toBe('[1,2]')
    await waitFor(() => expect(requests('PUT')).toHaveLength(1))
    const [url, init] = requests('PUT')[0] as [string, RequestInit]
    expect(url).toBe('/api/kv/swimming-goals')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer secret')
    expect(sentValue(requests('PUT')[0])).toEqual([1, 2])
  })

  it('sends only the latest value while a save is in flight', async () => {
    let finishFirstSave: (response: Response) => void = () => {}
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'PUT' && requests('PUT').length === 1
        ? new Promise<Response>((resolve) => (finishFirstSave = resolve))
        : Promise.resolve(jsonResponse({ value: null }))
    )
    const { result } = renderHook(() => useKV('site-content', 0))
    await waitFor(() => expect(requests('GET')).toHaveLength(1))

    act(() => result.current[1](1))
    act(() => result.current[1](2))
    act(() => result.current[1](3))
    expect(requests('PUT')).toHaveLength(1)

    await act(async () => finishFirstSave(jsonResponse({ success: true })))

    await waitFor(() => expect(requests('PUT')).toHaveLength(2))
    expect(requests('PUT').map(sentValue)).toEqual([1, 3])
  })

  it('clears the admin token and warns when a save is unauthorized', async () => {
    setAdminToken('expired')
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      Promise.resolve(
        init?.method === 'PUT'
          ? jsonResponse({ error: 'Unauthorized' }, 401)
          : jsonResponse({ value: null })
      )
    )
    const { result } = renderHook(() => useKV('site-content', 'a'))

    act(() => result.current[1]('b'))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/expired/i)))
    expect(getAdminToken()).toBeNull()
  })

  it('reports other save errors', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      Promise.resolve(
        init?.method === 'PUT' ? jsonResponse({}, 500) : jsonResponse({ value: null })
      )
    )
    const { result } = renderHook(() => useKV('site-content', 'a'))

    act(() => result.current[1]('b'))

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Couldn't save site-content (error 500)")
    )
  })

  describe('requiresAuth keys', () => {
    it('does not fetch until enabled, then sends the token', async () => {
      setAdminToken('secret')
      fetchMock.mockResolvedValue(jsonResponse({ value: [{ id: '1' }] }))

      const { result, rerender } = renderHook(
        ({ enabled }) =>
          useKV('contact-messages', [] as Array<{ id: string }>, { requiresAuth: true, enabled }),
        { initialProps: { enabled: false } }
      )
      expect(fetchMock).not.toHaveBeenCalled()

      rerender({ enabled: true })

      await waitFor(() => expect(result.current[0]).toEqual([{ id: '1' }]))
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect((init.headers as Record<string, string>).Authorization).toBe('Bearer secret')
    })

    it('never caches private data in localStorage', async () => {
      localStorage.setItem('kv:contact-messages', JSON.stringify(['stale']))
      setAdminToken('secret')
      fetchMock.mockResolvedValue(jsonResponse({ value: ['fresh'] }))

      const { result } = renderHook(() =>
        useKV('contact-messages', [] as string[], { requiresAuth: true })
      )

      expect(result.current[0]).toEqual([])
      await waitFor(() => expect(result.current[0]).toEqual(['fresh']))
      act(() => result.current[1](['updated']))
      expect(localStorage.getItem('kv:contact-messages')).toBe('["stale"]')
    })
  })
})
