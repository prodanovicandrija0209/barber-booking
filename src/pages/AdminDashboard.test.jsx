import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminDashboard from './AdminDashboard'
import { createService, deleteService, getServices } from '../api/http'

vi.mock('../api/http', () => ({
  createService: vi.fn(),
  deleteService: vi.fn(),
  getServices: vi.fn(),
}))

describe('AdminDashboard', () => {
  beforeEach(() => {
    getServices.mockResolvedValue([
      { id: 1, name: 'Sisanje', price: 1200, duration: 30 },
      { id: 2, name: 'Brada', price: 900, duration: 20 },
    ])
    createService.mockResolvedValue({
      id: 3,
      name: 'Farbanje',
      price: 2600,
      duration: 60,
      description: 'Test',
    })
    deleteService.mockResolvedValue(null)
  })

  it('renders list, adds a service, and deletes a service', async () => {
    const user = userEvent.setup()

    render(<AdminDashboard />)

    expect(await screen.findByText(/Sisanje - 1200 RSD - 30 min/i)).toBeInTheDocument()
    expect(screen.getByText(/Brada - 900 RSD - 20 min/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/name/i), 'Farbanje')
    await user.type(screen.getByLabelText(/price/i), '2600')
    await user.type(screen.getByLabelText(/duration/i), '60')
    await user.type(screen.getByLabelText(/description/i), 'Test')
    await user.click(screen.getByRole('button', { name: /add service/i }))

    expect(await screen.findByText(/Farbanje - 2600 RSD - 60 min/i)).toBeInTheDocument()
    expect(createService).toHaveBeenCalledTimes(1)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(deleteService).toHaveBeenCalledWith(1)
    })
    await waitFor(() => {
      expect(screen.queryByText(/Sisanje - 1200 RSD - 30 min/i)).not.toBeInTheDocument()
    })
  })
})
