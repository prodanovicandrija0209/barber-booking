const USER_STORAGE_KEY = 'auth_user'

export function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const role = normalizedEmail === 'admin@barber.com' ? 'admin' : 'user'

  const user = {
    email: normalizedEmail,
    role,
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('auth-change'))

  return user
}

export function logout() {
  localStorage.removeItem(USER_STORAGE_KEY)
  window.dispatchEvent(new Event('auth-change'))
}

export function getCurrentUser() {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}
