const BASE_URL = 'http://localhost:3002'

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options)

  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status}`)
    error.status = response.status
    throw error
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export function getServices() {
  return request('/services')
}

export function getServiceById(id) {
  return request(`/services/${id}`)
}

export async function getTimeSlotsByService(serviceId) {
  const slots = await request(`/timeSlots?serviceId=${serviceId}`)
  return slots.filter((slot) => slot.available === true)
}

export function getAvailableTimeSlots(serviceId) {
  return request(`/timeSlots?serviceId=${serviceId}&available=true`)
}

export function createReservation({ userEmail, serviceId, timeSlotId }) {
  return request('/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userEmail,
      serviceId: Number(serviceId),
      timeSlotId: Number(timeSlotId),
    }),
  })
}

export function markTimeSlotUnavailable(timeSlotId) {
  return request(`/timeSlots/${timeSlotId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ available: false }),
  })
}

export function markTimeSlotAvailable(timeSlotId) {
  return request(`/timeSlots/${timeSlotId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ available: true }),
  })
}

export function getReservationsByUser(userEmail) {
  return request(`/reservations?userEmail=${encodeURIComponent(userEmail)}`)
}

export function deleteReservation(reservationId) {
  return request(`/reservations/${reservationId}`, {
    method: 'DELETE',
  })
}

export function getTimeSlotById(timeSlotId) {
  return request(`/timeSlots/${timeSlotId}`)
}
