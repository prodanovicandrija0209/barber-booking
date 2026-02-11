import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getServiceById } from '../api/http'

function ServiceDetail() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadService = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getServiceById(id)
        if (isMounted) {
          setService(data)
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

  if (!service) {
    return <p>Error</p>
  }

  return (
    <div>
      <h1>Service Detail</h1>
      <h2>{service.name}</h2>
      <p>Price: {service.price} RSD</p>
      <p>Duration: {service.duration} min</p>
      <p>{service.description}</p>
    </div>
  )
}

export default ServiceDetail
