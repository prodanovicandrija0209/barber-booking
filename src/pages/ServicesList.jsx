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
          setError('Greska')
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
    return <p className="alert alert-loading">Ucitavanje...</p>
  }

  if (error) {
    return <p className="alert alert-error">Greska</p>
  }

  return (
    <div className="page-card">
      <h1>Usluge</h1>
      <ul className="list">
        {services.map((service) => (
          <li key={service.id} className="list-item list-card row">
            <Link to={`/services/${service.id}`}>{service.name}</Link> - {service.price} RSD - {service.duration} min
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServicesList
