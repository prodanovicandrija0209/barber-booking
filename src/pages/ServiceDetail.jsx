import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
          if (requestError.message.includes('404')) {
            setService(null)
            setNotFound(true)
          } else {
            setError('Error')
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
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error</p>
  }

  if (notFound || !service) {
    return <p>Not found</p>
  }

  return (
    <div>
      <h1>Service Detail</h1>
      <h2>{service.name}</h2>
      <p>Price: {service.price} RSD</p>
      <p>Duration: {service.duration} min</p>
      <p>{service.description}</p>
      <button type="button">Rezerviši termin</button>
    </div>
  )
}

export default ServiceDetail
