import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../auth/auth'
import { buildIcsForReservation } from '../utils/ics'
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
          setError('Greska')
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
      setCancelError('Greska')
    } finally {
      setCancelingId(null)
    }
  }

  const handleAddToCalendar = (reservation) => {
    const hasDateTime =
      Boolean(reservation?.slot?.date || reservation?.date) &&
      Boolean(reservation?.slot?.startTime || reservation?.startTime) &&
      Boolean(reservation?.slot?.endTime || reservation?.endTime)

    if (!hasDateTime) {
      return
    }

    const icsContent = buildIcsForReservation(reservation)

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
        <p>Morate biti prijavljeni da biste videli rezervacije.</p>
        <Link to="/login">Idi na prijavu</Link>
      </div>
    )
  }

  if (loading) {
    return <p>Ucitavanje...</p>
  }

  if (error) {
    return <p>Greska</p>
  }

  return (
    <div>
      <h1>Moje rezervacije</h1>
      {reservations.length === 0 ? (
        <p>Nema rezervacija.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => {
            const hasDateTime =
              Boolean(reservation?.slot?.date || reservation?.date) &&
              Boolean(reservation?.slot?.startTime || reservation?.startTime) &&
              Boolean(reservation?.slot?.endTime || reservation?.endTime)

            return (
              <li key={reservation.id}>
                Usluga ID: {reservation.serviceId}
                {reservation.slot ? (
                  <>
                    {' - '}
                    {reservation.slot.date} {reservation.slot.startTime}
                    {'\u2013'}
                    {reservation.slot.endTime}
                  </>
                ) : (
                  ' - Termin nije dostupan'
                )}
                {' '}
                <button
                  type="button"
                  onClick={() =>
                    handleCancel(reservation.id, reservation.timeSlotId)
                  }
                  disabled={cancelingId === reservation.id}
                >
                  {cancelingId === reservation.id ? 'Otkazivanje...' : 'Otka\u017ei'}
                </button>
                {' '}
                <button
                  type="button"
                  onClick={() => handleAddToCalendar(reservation)}
                  disabled={!hasDateTime}
                >
                  Dodaj u kalendar
                </button>
                {!hasDateTime && <span> Nedostaju datum/vreme</span>}
              </li>
            )
          })}
        </ul>
      )}
      {cancelError && <p>{cancelError}</p>}
    </div>
  )
}

export default MyReservations
