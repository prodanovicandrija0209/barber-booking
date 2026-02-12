import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getServiceById } from '../api/http'

function ServiceDetail() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadService = async () => {
      setLoading(true)
      setError('')
      setNotFound(false)

      try {
        const data = await getServiceById(id)
        if (isMounted) {
          setService(data)
        }
      } catch (requestError) {
        if (isMounted) {
          if (requestError.status === 404) {
            setService(null)
            setNotFound(true)
          } else {
            setError('Greska')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadService()

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return <p>Ucitavanje...</p>
  }

  if (error) {
    return <p>Greska</p>
  }

  if (notFound || !service) {
    return <p>Nije pronadjeno</p>
  }

  return (
    <div>
      <h1>Detalji usluge</h1>
      <h2>{service.name}</h2>
      <p>Cena: {service.price} RSD</p>
      <p>Trajanje: {service.duration} min</p>
      <p>{service.description}</p>
      <Link to={`/services/${id}/book`}>
        <button type="button">{'Rezervi\u0161i termin'}</button>
      </Link>
    </div>
  )
}

export default ServiceDetail
