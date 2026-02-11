import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ServicesList from './ServicesList'
import { getServices } from '../api/http'

vi.mock('../api/http', () => ({
  getServices: vi.fn(),
}))

describe('ServicesList', () => {
  beforeEach(() => {
    getServices.mockResolvedValue([
      { id: 1, name: 'Sisanje', price: 1200, duration: 30 },
      { id: 2, name: 'Brada', price: 900, duration: 20 },
    ])
  })

  it('renders services list from mocked API', async () => {
    render(
      <MemoryRouter>
        <ServicesList />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Sisanje')).toBeInTheDocument()
    expect(screen.getByText('Brada')).toBeInTheDocument()
    expect(getServices).toHaveBeenCalledTimes(1)
  })
})
