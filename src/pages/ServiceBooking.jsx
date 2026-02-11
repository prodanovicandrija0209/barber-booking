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
  const [holidaysLoadedCount, setHolidaysLoadedCount] = useState(0)
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
          setError('Error')
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
        setHolidaysLoadedCount(0)
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
          setHolidaysLoadedCount(dates.length)
        }
      } catch {
        // Ignore holiday API errors; booking must continue to work.
        if (!canceled) {
          setHolidayDates(new Set())
          setHolidaysLoadedCount(0)
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
      <div>
        <p>You must be logged in to book a term.</p>
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
      setSubmitError('Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Booking for service {serviceId}</h1>
      <p>Holidays loaded: {holidaysLoadedCount}</p>
      {slots.length === 0 ? (
        <p>No available terms.</p>
      ) : (
        <div>
          {slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlotId(slot.id)}
              style={{
                marginRight: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: selectedSlotId === slot.id ? '700' : '400',
              }}
            >
              {slot.date} {slot.startTime}
              {'\u2013'}
              {slot.endTime}
              {holidayDates.has(String(slot.date).slice(0, 10)) && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.75rem',
                    padding: '0.1rem 0.35rem',
                    border: '1px solid #999',
                    borderRadius: '10px',
                  }}
                >
                  Holiday
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {selectedSlot && (
        <p>
          Selected slot: {selectedSlot.date} {selectedSlot.startTime}
          {'\u2013'}
          {selectedSlot.endTime}
        </p>
      )}
      <button
        type="button"
        onClick={handleConfirmReservation}
        disabled={!selectedSlotId || submitting}
      >
        {submitting ? 'Saving...' : 'Potvrdi rezervaciju'}
      </button>
      {submitError && <p>{submitError}</p>}
      <Link to={`/services/${serviceId}`}>Back to service detail</Link>
    </div>
  )
}

export default ServiceBooking
