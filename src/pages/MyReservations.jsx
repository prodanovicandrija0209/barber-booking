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

  const formatIcsDateTime = (date, time) =>
    `${date.replaceAll('-', '')}T${time.replace(':', '')}00`

  const formatUtcStamp = (value) =>
    value.replaceAll('-', '').replaceAll(':', '').split('.')[0] + 'Z'

  const handleAddToCalendar = (reservation) => {
    if (!reservation.slot) {
      return
    }

    const start = formatIcsDateTime(
      reservation.slot.date,
      reservation.slot.startTime,
    )
    const end = formatIcsDateTime(
      reservation.slot.date,
      reservation.slot.endTime,
    )
    const nowStamp = formatUtcStamp(new Date().toISOString())

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//barber-booking//EN',
      'BEGIN:VEVENT',
      `UID:reservation-${reservation.id}@barber-booking`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:Barber Reservation (Service ${reservation.serviceId})`,
      'DESCRIPTION:Reservation created from barber-booking app.',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n')

    const file = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    })
    const fileUrl = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = `reservation-${reservation.id}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(fileUrl)
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
                {cancelingId === reservation.id ? 'Cancelling...' : 'Otka\u017ei'}
              </button>
              {' '}
              <button
                type="button"
                onClick={() => handleAddToCalendar(reservation)}
                disabled={!reservation.slot}
              >
                Add to calendar (.ics)
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
