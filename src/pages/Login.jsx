import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth/auth'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    login(email, password)
    navigate('/')
  }

  return (
    <div className="page-card">
      <h1>Prijava</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email adresa
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Lozinka
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="btn btn-primary" type="submit">Prijavi se</button>
      </form>
    </div>
  )
}

export default Login
