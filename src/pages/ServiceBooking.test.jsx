import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ServiceBooking from './ServiceBooking'
import { getCurrentUser } from '../auth/auth'
import {
  createReservation,
  getAvailableTimeSlots,
  markTimeSlotUnavailable,
} from '../api/http'
import { getHolidays } from '../api/holidays'

vi.mock('../auth/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('../api/http', () => ({
  createReservation: vi.fn(),
  getAvailableTimeSlots: vi.fn(),
  markTimeSlotUnavailable: vi.fn(),
}))

vi.mock('../api/holidays', () => ({
  getHolidays: vi.fn(),
}))

describe('ServiceBooking', () => {
  beforeEach(() => {
    getCurrentUser.mockReturnValue({ email: 'user@test.com', role: 'user' })
    getAvailableTimeSlots.mockResolvedValue([
      {
        id: 10,
        date: '2026-02-13',
        startTime: '10:30',
        endTime: '11:30',
      },
      {
        id: 11,
        date: '2026-02-14',
        startTime: '11:00',
        endTime: '11:30',
      },
    ])
    getHolidays.mockResolvedValue([{ date: '2026-02-13' }])
    createReservation.mockResolvedValue({ id: 1 })
    markTimeSlotUnavailable.mockResolvedValue({ id: 10, available: false })
  })

  it('renders slots, shows holiday badge, and updates selected text', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/services/1/book']}>
        <Routes>
          <Route path="/services/:id/book" element={<ServiceBooking />} />
        </Routes>
      </MemoryRouter>,
    )

    const firstSlotButton = await screen.findByRole('button', {
      name: /2026-02-13\s+10:30.*11:30/i,
    })
    expect(firstSlotButton).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /2026-02-14\s+11:00.*11:30/i }),
    ).toBeInTheDocument()
    expect(await screen.findByText('Holiday')).toBeInTheDocument()

    await user.click(firstSlotButton)

    expect(
      screen.getByText(/Selected slot: 2026-02-13 10:30.*11:30/i),
    ).toBeInTheDocument()
  })
})
