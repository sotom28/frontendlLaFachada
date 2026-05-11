import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Resena {
  id: number
  contenido: string
  calificacion: number
  nombreCliente: string
}

interface DetallePublicacion {
  idPublicacion: number
  titulo: string
  descripcion: string
  precio: number
  fechaPublicacion: string
  nombreVendedor: string
  propiedad: {
    id: number
    direccion: string
    ciudad: string
    habitaciones: number
    banos: number
    metraje: number
    tipo: string
  }
  resenas: Resena[]
}

const tones = ['tone-a', 'tone-b', 'tone-c', 'tone-d', 'tone-e', 'tone-f']

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<DetallePublicacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const { token, user, isAuthenticated } = useAuth()
  const [newReview, setNewReview] = useState({ comentario: '', calificacion: 5 })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' })

  const fetchDetalle = async () => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`http://localhost:3000/api/v1/views/publicacion-detalle/${id}`, {
        headers
      })
      
      if (response.status === 404) {
        const text = await response.text()
        setErrorMsg(text || 'Publicación no encontrada')
        return
      }

      if (!response.ok) {
        throw new Error('Error al obtener el detalle')
      }

      const json = await response.json()
      setData(json)
    } catch (error) {
      setErrorMsg('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchDetalle()
  }, [id, token])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmittingReview(true)
    setReviewMessage({ type: '', text: '' })

    const payload = {
      comentario: newReview.comentario,
      calificacion: newReview.calificacion,
      publicacionId: Number(id),
      usuarioId: user.idUsuario
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/resenas/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setReviewMessage({ type: 'success', text: '¡Reseña publicada con éxito!' })
        setNewReview({ comentario: '', calificacion: 5 })
        fetchDetalle() // Refresh reviews
      } else {
        const data = await response.json()
        setReviewMessage({ type: 'error', text: data.message || 'Error al publicar la reseña' })
      }
    } catch (error) {
      setReviewMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <main className="page-shell page-light">
        <p style={{ textAlign: 'center', padding: '100px' }}>Cargando detalles de la propiedad...</p>
      </main>
    )
  }

  if (errorMsg || !data) {
    return (
      <main className="page-shell page-light">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <h2>Lo sentimos</h2>
          <p style={{ color: '#64748b', marginTop: '10px' }}>{errorMsg}</p>
          <Link to="/propiedades" className="button button-primary" style={{ marginTop: '20px' }}>
            Volver a Propiedades
          </Link>
        </div>
      </main>
    )
  }

  const randomTone = tones[data.idPublicacion % tones.length]

  return (
    <main className="page-shell page-light">
      <div className="property-detail-layout">
        {/* Header Section */}
        <section className="detail-header">
          <div className={`detail-hero-image ${randomTone}`}>
            <div className="detail-hero-overlay">
              <span className="detail-price-tag">
                {new Intl.NumberFormat('es-CO', { 
                  style: 'currency', 
                  currency: 'COP',
                  maximumFractionDigits: 0 
                }).format(data.precio)}
              </span>
            </div>
          </div>
          <div className="detail-main-info">
            <h1>{data.titulo}</h1>
            <p className="detail-location">{data.propiedad.direccion}, {data.propiedad.ciudad}</p>
            <div className="detail-meta-strip">
              <div className="meta-item">
                <span className="meta-value">{data.propiedad.habitaciones}</span>
                <span className="meta-label">Habitaciones</span>
              </div>
              <div className="meta-item">
                <span className="meta-value">{data.propiedad.banos}</span>
                <span className="meta-label">Baños</span>
              </div>
              <div className="meta-item">
                <span className="meta-value">{data.propiedad.metraje} m²</span>
                <span className="meta-label">Superficie</span>
              </div>
              <div className="meta-item">
                <span className="meta-value">{data.propiedad.tipo}</span>
                <span className="meta-label">Tipo</span>
              </div>
            </div>
          </div>
        </section>

        <div className="detail-content-grid">
          {/* Left Column: Description */}
          <section className="detail-description">
            <h2>Descripción</h2>
            <p>{data.descripcion}</p>
            
            <div className="detail-info-block">
              <h3>Detalles adicionales</h3>
              <ul>
                <li><strong>Publicado el:</strong> {new Date(data.fechaPublicacion).toLocaleDateString()}</li>
                <li><strong>Ciudad:</strong> {data.propiedad.ciudad}</li>
                <li><strong>Dirección:</strong> {data.propiedad.direccion}</li>
              </ul>
            </div>

            {/* Write a Review Section */}
            <section className="write-review-section">
              <h2>Dejar una Reseña</h2>
              {isAuthenticated ? (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  {reviewMessage.text && (
                    <div className={`message-banner ${reviewMessage.type}`}>
                      {reviewMessage.text}
                    </div>
                  )}
                  <div className="star-rating-selector">
                    <p>Calificación:</p>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${newReview.calificacion >= star ? 'active' : ''}`}
                          onClick={() => setNewReview({ ...newReview, calificacion: star })}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Escribe tu comentario sobre esta propiedad..."
                    required
                    value={newReview.comentario}
                    onChange={(e) => setNewReview({ ...newReview, comentario: e.target.value })}
                  />
                  <button 
                    type="submit" 
                    className="button button-primary"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Publicando...' : 'Publicar Reseña'}
                  </button>
                </form>
              ) : (
                <div className="login-prompt">
                  <p>Debes iniciar sesión para dejar una reseña.</p>
                  <Link to="/iniciar-sesion" className="button button-ghost">
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </section>

            {/* Reviews Section */}
            <section className="detail-reviews">
              <h2>Reseñas de la Propiedad</h2>
              {data.resenas && data.resenas.length > 0 ? (
                <div className="reviews-list">
                  {data.resenas.map((res) => (
                    <div key={res.id} className="review-card">
                      <div className="review-header">
                        <span className="review-user">{res.nombreCliente}</span>
                        <span className="review-rating">
                          {'★'.repeat(res.calificacion)}{'☆'.repeat(5 - res.calificacion)}
                        </span>
                      </div>
                      <p>{res.contenido}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-reviews">El vendedor aún no tiene reseñas.</p>
              )}
            </section>
          </section>

          {/* Right Column: Contact/Seller Info */}
          <aside className="detail-sidebar">
            <div className="seller-card">
              <h3>Información del Vendedor</h3>
              <div className="seller-info">
                <div className="seller-avatar">
                  {data.nombreVendedor.charAt(0)}
                </div>
                <div>
                  <p className="seller-name">{data.nombreVendedor}</p>
                  <p className="seller-status">Vendedor Verificado</p>
                </div>
              </div>
              <button className="button button-primary btn-full" style={{ marginTop: '20px' }}>
                Contactar Vendedor
              </button>
            </div>

            <div className="safety-card">
              <h4>Consejos de seguridad</h4>
              <ul>
                <li>No pagues por adelantado sin ver la propiedad.</li>
                <li>Verifica la identidad del vendedor.</li>
                <li>Realiza los trámites en lugares seguros.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
