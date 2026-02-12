import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Login flow', () => {
  it('sets current user and shows email in navbar', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/lozinka/i), 'secret')
    await user.click(screen.getByRole('button', { name: /prijavi se/i }))

    expect(await screen.findByText(/user@test.com/i)).toBeInTheDocument()

    const stored = JSON.parse(localStorage.getItem('auth_user'))
    expect(stored.email).toBe('user@test.com')
    expect(stored.role).toBe('user')
  })
})
