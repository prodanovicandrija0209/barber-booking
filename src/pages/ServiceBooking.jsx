import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCurrentUser } from '../auth/auth'
import { getHolidays } from '../api/holidays'
import {
  createReservation,
  getAvailableTimeSlots,
  markTimeSlotUnavailable,
} from '../api/http'

function ServiceBooking() {
  const { id: serviceId } = useParams()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const userEmail = user?.email ?? ''
  const [slots, setSlots] = useState([])
  const [holidayDates, setHolidayDates] = useState(new Set())
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let canceled = false

    const loadSlots = async () => {
      setLoading(true)
      setError('')

      try {
        if (!userEmail) {
          if (!canceled) {
            setSlots([])
            setSelectedSlotId(null)
          }
          return
        }

        const data = await getAvailableTimeSlots(serviceId)
        if (!canceled) {
          setSlots(data)
          setSelectedSlotId(null)
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

    loadSlots()

    return () => {
      canceled = true
    }
  }, [serviceId, userEmail])

  useEffect(() => {
    let canceled = false

    const loadHolidays = async () => {
      if (slots.length === 0) {
        setHolidayDates(new Set())
        return
      }

      const years = [...new Set(slots.map((slot) => slot.date.slice(0, 4)))]

      try {
        const responses = await Promise.all(years.map((year) => getHolidays(year)))
        if (!canceled) {
          const dates = responses
            .flat()
            .map((holiday) => String(holiday.date).slice(0, 10))
          setHolidayDates(new Set(dates))
        }
      } catch {
        // Ignore holiday API errors; booking must continue to work.
        if (!canceled) {
          setHolidayDates(new Set())
        }
      }
    }

    loadHolidays()

    return () => {
      canceled = true
    }
  }, [slots])

  const selectedSlot =
    slots.find((slot) => slot.id === selectedSlotId) || null

  if (!user) {
    return (
      <div className="page-card">
        <p className="alert alert-error">Morate biti prijavljeni da biste rezervisali termin.</p>
        <Link to="/login">Idi na prijavu</Link>
      </div>
    )
  }

  if (loading) {
    return <p className="alert alert-loading">Ucitavanje...</p>
  }

  if (error) {
    return <p className="alert alert-error">Greska</p>
  }

  const handleConfirmReservation = async () => {
    if (!selectedSlotId) {
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      await createReservation({
        userEmail: user.email,
        serviceId: Number(serviceId),
        timeSlotId: Number(selectedSlotId),
      })
      await markTimeSlotUnavailable(selectedSlotId)
      navigate('/my-reservations')
    } catch {
      setSubmitError('Greska')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-card">
      <h1>Rezervacija za uslugu {serviceId}</h1>
      {slots.length === 0 ? (
        <p>Nema dostupnih termina.</p>
      ) : (
        <div className="row">
          {slots.map((slot) => (
            <button
              className={`btn btn-secondary${selectedSlotId === slot.id ? ' btn-slot-active' : ''}`}
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlotId(slot.id)}
            >
              {slot.date} {slot.startTime}
              {'\u2013'}
              {slot.endTime}
              {holidayDates.has(String(slot.date).slice(0, 10)) && (
                <span className="badge">Praznik</span>
              )}
            </button>
          ))}
        </div>
      )}
      {selectedSlot && (
        <p className="list-card">
          Izabrani termin: {selectedSlot.date} {selectedSlot.startTime}
          {'\u2013'}
          {selectedSlot.endTime}
        </p>
      )}
      <button
        className="btn btn-primary"
        type="button"
        onClick={handleConfirmReservation}
        disabled={!selectedSlotId || submitting}
      >
        {submitting ? 'Cuvanje...' : 'Potvrdi rezervaciju'}
      </button>
      {submitError && <p className="alert alert-error">{submitError}</p>}
      <p>
        <Link to={`/services/${serviceId}`}>Nazad na detalje usluge</Link>
      </p>
    </div>
  )
}

export default ServiceBooking
