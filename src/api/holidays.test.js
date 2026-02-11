import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('holidays API', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('returns holidays and caches by year', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([{ date: '2026-01-01' }]),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { getHolidays } = await import('./holidays')

    const first = await getHolidays('2026')
    const second = await getHolidays('2026')

    expect(first).toEqual([{ date: '2026-01-01' }])
    expect(second).toEqual([{ date: '2026-01-01' }])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws on non-ok response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })
    vi.stubGlobal('fetch', fetchMock)

    const { getHolidays } = await import('./holidays')

    await expect(getHolidays('2026')).rejects.toThrow('Holidays request failed: 500')
  })
})
