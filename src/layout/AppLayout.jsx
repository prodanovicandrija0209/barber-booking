import { NavLink, Outlet } from 'react-router-dom'
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
    <div className="app-shell">
      <div className="container">
        <header className="app-header">
          <nav className="navbar">
            <NavLink end to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Pocetna</NavLink>
            <NavLink to="/services" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Usluge</NavLink>
            <NavLink to="/my-reservations" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Moje rezervacije</NavLink>
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Administracija</NavLink>
            {!user && (
              <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Prijava
              </NavLink>
            )}
          </nav>
          <div className="auth-bar">
            {user ? (
              <>
                <span>{user.email} ({user.role})</span>
                <button className="btn btn-secondary" type="button" onClick={handleLogout}>Odjava</button>
              </>
            ) : (
              <span>Niste prijavljeni</span>
            )}
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
