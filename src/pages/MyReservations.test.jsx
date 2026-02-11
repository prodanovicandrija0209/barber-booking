import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MyReservations from './MyReservations'
import {
  deleteReservation,
  getReservationsByUser,
  getTimeSlotById,
  markTimeSlotAvailable,
} from '../api/http'

vi.mock('../api/http', () => ({
  deleteReservation: vi.fn(),
  getReservationsByUser: vi.fn(),
  getTimeSlotById: vi.fn(),
  markTimeSlotAvailable: vi.fn(),
}))

describe('MyReservations', () => {
  beforeEach(() => {
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: 'user@test.com', role: 'user' }),
    )

    getReservationsByUser.mockResolvedValue([
      { id: 101, userEmail: 'user@test.com', serviceId: 2, timeSlotId: 10 },
    ])
    getTimeSlotById.mockResolvedValue({
      id: 10,
      date: '2026-02-13',
      startTime: '10:30',
      endTime: '11:30',
    })
    deleteReservation.mockResolvedValue(null)
    markTimeSlotAvailable.mockResolvedValue({ id: 10, available: true })
  })

  it('renders reservations and removes item on cancel', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <MyReservations />
      </MemoryRouter>,
    )

    expect(await screen.findByText(/Service ID: 2/i)).toBeInTheDocument()

    const cancelButton = screen.getByRole('button')
    await user.click(cancelButton)

    await waitFor(() => {
      expect(deleteReservation).toHaveBeenCalledWith(101)
      expect(markTimeSlotAvailable).toHaveBeenCalledWith(10)
    })

    await waitFor(() => {
      expect(screen.queryByText(/Service ID: 2/i)).not.toBeInTheDocument()
    })
  })
})
