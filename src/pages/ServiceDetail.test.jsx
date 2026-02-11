import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ServiceDetail from './ServiceDetail'
import { getServiceById } from '../api/http'

vi.mock('../api/http', () => ({
  getServiceById: vi.fn(),
}))

describe('ServiceDetail', () => {
  beforeEach(() => {
    getServiceById.mockResolvedValue({
      id: 5,
      name: 'Pranje + Fen',
      price: 800,
      duration: 25,
      description: 'Test description',
    })
  })

  it('renders service details for route id', async () => {
    render(
      <MemoryRouter initialEntries={['/services/5']}>
        <Routes>
          <Route path="/services/:id" element={<ServiceDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Pranje + Fen')).toBeInTheDocument()
    expect(screen.getByText('Price: 800 RSD')).toBeInTheDocument()
    expect(screen.getByText('Duration: 25 min')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(getServiceById).toHaveBeenCalledWith('5')
  })
})
