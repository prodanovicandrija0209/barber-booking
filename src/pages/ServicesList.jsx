import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../api/http'

function ServicesList() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadServices = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getServices()
        if (isMounted) {
          setServices(data)
        }
      } catch {
        if (isMounted) {
          setError('Error')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadServices()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error</p>
  }

  return (
    <div>
      <h1>Services</h1>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <Link to={`/services/${service.id}`}>{service.name}</Link> - {service.price} RSD - {service.duration} min
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServicesList
