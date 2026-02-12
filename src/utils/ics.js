function toIcsLocalDateTime(date, time) {
  const compactDate = String(date).replaceAll('-', '')
  const compactTime = String(time).replace(':', '')
  return `${compactDate}T${compactTime}00`
}

export function buildIcsForReservation(reservation) {
  const slot = reservation?.slot || {}
  const date = slot.date || reservation?.date
  const startTime = slot.startTime || reservation?.startTime
  const endTime = slot.endTime || reservation?.endTime
  const serviceName =
    reservation?.serviceName || `Service ${reservation?.serviceId ?? 'N/A'}`

  if (!date || !startTime || !endTime) {
    throw new Error('Missing reservation date/time')
  }

  const dtStart = toIcsLocalDateTime(date, startTime)
  const dtEnd = toIcsLocalDateTime(date, endTime)
  const uid = `reservation-${reservation?.id ?? 'unknown'}@barber-booking`
  const dtStamp = toIcsLocalDateTime(
    new Date().toISOString().slice(0, 10),
    new Date().toTimeString().slice(0, 5),
  )

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//barber-booking//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'SUMMARY:Barber appointment',
    `DESCRIPTION:Service: ${serviceName}`,
    'LOCATION:Barber shop',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}
