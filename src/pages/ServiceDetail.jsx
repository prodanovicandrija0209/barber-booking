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
    return <p className="alert alert-loading">Ucitavanje...</p>
  }

  if (error) {
    return <p className="alert alert-error">Greska</p>
  }

  if (notFound || !service) {
    return <p className="alert alert-error">Nije pronadjeno</p>
  }

  return (
    <div className="page-card">
      <h1>Detalji usluge</h1>
      <div className="section-stack">
        <div className="list-card">
          <h2>{service.name}</h2>
          <p>Cena: {service.price} RSD</p>
          <p>Trajanje: {service.duration} min</p>
          <p>{service.description}</p>
        </div>
        <div>
          <Link to={`/services/${id}/book`}>
            <button className="btn btn-primary" type="button">{'Rezervi\u0161i termin'}</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail
