import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../auth/auth'
import {
  deleteReservation,
  getReservationsByUser,
  getTimeSlotById,
  markTimeSlotAvailable,
} from '../api/http'

function MyReservations() {
  const user = getCurrentUser()
  const userEmail = user?.email ?? ''
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelError, setCancelError] = useState('')
  const [cancelingId, setCancelingId] = useState(null)

  useEffect(() => {
    let canceled = false

    const loadReservations = async () => {
      setLoading(true)
      setError('')

      try {
        if (!userEmail) {
          if (!canceled) {
            setReservations([])
          }
          return
        }

        const data = await getReservationsByUser(userEmail)
        const withSlots = await Promise.all(
          data.map(async (reservation) => {
            try {
              const slot = await getTimeSlotById(reservation.timeSlotId)
              return { ...reservation, slot }
            } catch {
              return { ...reservation, slot: null }
            }
          }),
        )

        if (!canceled) {
          setReservations(withSlots)
        }
      } catch {
        if (!canceled) {
          setError('Error')
        }
      } finally {
        if (!canceled) {
          setLoading(false)
        }
      }
    }

    loadReservations()

    return () => {
      canceled = true
    }
  }, [userEmail])

  const handleCancel = async (reservationId, timeSlotId) => {
    setCancelingId(reservationId)
    setCancelError('')

    try {
      await deleteReservation(reservationId)
      await markTimeSlotAvailable(timeSlotId)
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== reservationId),
      )
    } catch {
      setCancelError('Error')
    } finally {
      setCancelingId(null)
    }
  }

  if (!user) {
    return (
      <div>
        <p>You must be logged in to view reservations.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    )
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error</p>
  }

  return (
    <div>
      <h1>My Reservations</h1>
      {reservations.length === 0 ? (
        <p>No reservations.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              Service ID: {reservation.serviceId}
              {reservation.slot ? (
                <>
                  {' - '}
                  {reservation.slot.date} {reservation.slot.startTime}
                  {'\u2013'}
                  {reservation.slot.endTime}
                </>
              ) : (
                ' - Time slot unavailable'
              )}
              {' '}
              <button
                type="button"
                onClick={() =>
                  handleCancel(reservation.id, reservation.timeSlotId)
                }
                disabled={cancelingId === reservation.id}
              >
                {cancelingId === reservation.id ? 'Cancelling...' : 'Otkaži'}
              </button>
            </li>
          ))}
        </ul>
      )}
      {cancelError && <p>{cancelError}</p>}
    </div>
  )
}

export default MyReservations
