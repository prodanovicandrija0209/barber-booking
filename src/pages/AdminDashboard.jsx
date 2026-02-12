import { useEffect, useState } from 'react'
import { createService, deleteService, getServices } from '../api/http'

function AdminDashboard() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
  })

  useEffect(() => {
    let canceled = false

    const loadServices = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getServices()
        if (!canceled) {
          setServices(data)
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

    loadServices()

    return () => {
      canceled = true
    }
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddService = async (event) => {
    event.preventDefault()
    setActionError('')
    setSubmitting(true)

    try {
      const created = await createService(formData)
      setServices((prev) => [...prev, created])
      setFormData({
        name: '',
        price: '',
        duration: '',
        description: '',
      })
    } catch {
      setActionError('Greska')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteService = async (serviceId) => {
    setActionError('')
    setDeletingId(serviceId)

    try {
      await deleteService(serviceId)
      setServices((prev) => prev.filter((service) => service.id !== serviceId))
    } catch {
      setActionError('Greska')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p>Ucitavanje...</p>
  }

  if (error) {
    return <p>Greska</p>
  }

  return (
    <div>
      <h1>Administratorski panel</h1>

      <h2>Usluge</h2>
      {services.length === 0 ? (
        <p>Nema usluga.</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.id}>
              {service.name} - {service.price} RSD - {service.duration} min{' '}
              <button
                type="button"
                onClick={() => handleDeleteService(service.id)}
                disabled={deletingId === service.id}
              >
                {deletingId === service.id ? 'Brisanje...' : 'Obrisi'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Dodaj uslugu</h2>
      <form onSubmit={handleAddService}>
        <div>
          <label>
            Naziv
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Cena
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Trajanje
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Opis
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Cuvanje...' : 'Dodaj uslugu'}
        </button>
      </form>

      {actionError && <p>{actionError}</p>}
    </div>
  )
}

export default AdminDashboard
