import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PropertyCard } from '../components/PropertyCard'

interface Publicacion {
  idPublicacion: number
  titulo: string
  precio: number
  ciudad: string
  habitaciones: number
  banos: number
  metraje: number
  estado?: string
  fotos?: { url: string; nombre: string }[]
}

// Tones for styling the empty images, same as defined in App.css
// const tones = ['tone-a', 'tone-b', 'tone-c', 'tone-d', 'tone-e', 'tone-f']

export function HomePage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const { token } = useAuth()

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }

        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch('http://localhost:3000/api/v1/views/publicaciones-containers', {
          headers
        })

        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          if (Array.isArray(data)) {
            // Normalize and Filter out sold properties and take only the first 3
            const activePublicaciones = data
              .map((pub: any) => ({
                ...pub,
                idPublicacion: pub.idPublicacion ?? pub.idpublicacion,
                fotos: pub.fotos || [],
                estado: pub.estado?.toLowerCase()
              }))
              .filter((pub: any) => pub.estado !== 'vendido')

            setPublicaciones(activePublicaciones.slice(0, 3))
          } else {
            setErrorMsg('No hay publicaciones disponibles')
          }
        } else {
          const text = await response.text()
          setErrorMsg(text || 'No hay publicaciones disponibles')
        }
      } catch (error) {
        setErrorMsg('No hay publicaciones disponibles')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicaciones()
  }, [])

  return (
    <main className="page-shell">
      <section className="hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Encuentra Tu Hogar Perfecto</h1>
          <p>Más de 1,000 propiedades exclusivas a tu alcance</p>
          <div className="search-strip">
            <input type="text" placeholder="Buscar por ubicación o tipo de propiedad" />
            <button type="button" className="button button-primary">
              Buscar
            </button>
          </div>
        </div>
      </section>

      <section className="section-block section-services">
        <div className="section-title-center">
          <h2>Nuestros Servicios</h2>
          <p>Ofrecemos soluciones completas para todas tus necesidades inmobiliarias</p>
        </div>
        <div className="services-grid">
          <article className="service-card">
            <h3>Compra</h3>
            <p>Encuentra la propiedad perfecta con nuestra amplia selección.</p>
          </article>
          <article className="service-card">
            <h3>Venta</h3>
            <p>Maximiza el valor de tu propiedad con nuestros expertos.</p>
          </article>
          <article className="service-card">
            <h3>Asesoría</h3>
            <p>Orientación profesional en cada paso del proceso.</p>
          </article>
        </div>
      </section>

      <section className="section-block section-light">
        <div className="section-title-row">
          <h2>Propiedades Destacadas</h2>
          <Link to="/propiedades" className="simple-link">
            Ver todas
          </Link>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Cargando publicaciones...</p>
        ) : errorMsg || publicaciones.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
            {errorMsg || 'No hay publicaciones disponibles'}
          </p>
        ) : (
          <div className="property-grid-cards">
            {publicaciones.map((pub, index) => (
              <PropertyCard key={pub.idPublicacion} pub={pub} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="cta-band">
        <h2>¿Listo para Encontrar tu Hogar?</h2>
        <p>Nuestro equipo de expertos está aquí para ayudarte en cada paso</p>
        <div className="cta-actions">
          <Link to="/propiedades" className="button button-light">
            Ver Propiedades
          </Link>
          <Link to="/contacto" className="button button-outline-light">
            Contactar Ahora
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h3>La Fachada</h3>
            <p>Tu socio de confianza en bienes raíces.</p>
          </div>
          <div>
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/propiedades">Propiedades</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>Av. Principal 123, Ciudad</p>
            <p>+1 (555) 123-4567</p>
            <p>info@lafachada.com</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
