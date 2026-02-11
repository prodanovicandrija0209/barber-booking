import { Link, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentUser, logout } from '../auth/auth'

function AppLayout() {
  const [user, setUser] = useState(getCurrentUser())

  useEffect(() => {
    const syncUser = () => {
      setUser(getCurrentUser())
    }

    window.addEventListener('auth-change', syncUser)
    window.addEventListener('storage', syncUser)

    return () => {
      window.removeEventListener('auth-change', syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/my-reservations">My Reservations</Link>
          <Link to="/admin">Admin</Link>
          {!user && <Link to="/login">Login</Link>}
        </nav>
        <div className="auth-bar">
          {user ? (
            <>
              <span>{user.email} ({user.role})</span>
              <button type="button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <span>Not logged in</span>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
