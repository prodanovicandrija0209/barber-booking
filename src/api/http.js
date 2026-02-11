const BASE_URL = 'http://localhost:3002'

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

export function getServices() {
  return request('/services')
}

export function getServiceById(id) {
  return request(`/services/${id}`)
}
