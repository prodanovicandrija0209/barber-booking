import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import { getCurrentUser } from '../auth/auth'

vi.mock('../auth/auth', () => ({
  getCurrentUser: vi.fn(),
}))

describe('Route guards', () => {
  it('ProtectedRoute redirects unauthenticated user to /login', async () => {
    getCurrentUser.mockReturnValue(null)

    render(
      <MemoryRouter initialEntries={['/my-reservations']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/my-reservations" element={<div>Private page</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Login page')).toBeInTheDocument()
  })

  it('ProtectedRoute renders children when authenticated', () => {
    getCurrentUser.mockReturnValue({ email: 'user@test.com', role: 'user' })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Private content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText('Private content')).toBeInTheDocument()
  })

  it('AdminRoute redirects unauthenticated user to /login', async () => {
    getCurrentUser.mockReturnValue(null)

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin page</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Login page')).toBeInTheDocument()
  })

  it('AdminRoute redirects non-admin user to /', async () => {
    getCurrentUser.mockReturnValue({ email: 'user@test.com', role: 'user' })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home page</div>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Home page')).toBeInTheDocument()
  })

  it('AdminRoute renders children for admin user', () => {
    getCurrentUser.mockReturnValue({ email: 'admin@barber.com', role: 'admin' })

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Admin content</div>
        </AdminRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText('Admin content')).toBeInTheDocument()
  })
})
