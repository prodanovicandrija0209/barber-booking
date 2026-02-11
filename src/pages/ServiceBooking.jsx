import { Link, useParams } from 'react-router-dom'

function ServiceBooking() {
  const { id } = useParams()

  return (
    <div>
      <h1>Booking for service {id}</h1>
      <Link to={`/services/${id}`}>Back to service detail</Link>
    </div>
  )
}

export default ServiceBooking
