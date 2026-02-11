import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createService,
  getServices,
  getServiceById,
  getReservationsByUser,
} from './http'

describe('http API client', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('getServices returns parsed json on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('[{"id":1,"name":"Sisanje"}]'),
    })
    vi.stubGlobal('fetch', fetchMock)

    const data = await getServices()

    expect(data).toEqual([{ id: 1, name: 'Sisanje' }])
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3002/services', {})
  })

  it('createService sends POST payload and returns created item', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('{"id":9,"name":"Test"}'),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await createService({
      name: 'Test',
      price: '1000',
      duration: '30',
      description: 'Desc',
    })

    expect(result).toEqual({ id: 9, name: 'Test' })
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3002/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        price: 1000,
        duration: 30,
        description: 'Desc',
      }),
    })
  })

  it('throws with status on non-ok response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: vi.fn().mockResolvedValue(''),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(getServiceById(999)).rejects.toMatchObject({ status: 404 })
  })

  it('propagates fetch rejection', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network failed'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getReservationsByUser('user@test.com')).rejects.toThrow('Network failed')
  })
})
