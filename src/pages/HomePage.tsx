import { Link } from 'react-router-dom'
import { properties } from '../data/properties'

const featured = properties.slice(0, 3)

export function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Encuentra Tu Hogar Perfecto</h1>
          <p>Mas de 1,000 propiedades exclusivas a tu alcance</p>
          <div className="search-strip">
            <input type="text" placeholder="Buscar por ubicacion o tipo de propiedad" />
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
            <p>Encuentra la propiedad perfecta con nuestra amplia seleccion.</p>
          </article>
          <article className="service-card">
            <h3>Venta</h3>
            <p>Maximiza el valor de tu propiedad con nuestros expertos.</p>
          </article>
          <article className="service-card">
            <h3>Asesoria</h3>
            <p>Orientacion profesional en cada paso del proceso.</p>
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
        <div className="property-grid-cards">
          {featured.map((property) => (
            <article key={property.id} className="property-card-modern">
              <div className={`property-image ${property.tone}`}>
                <span className="property-price">{property.price}</span>
              </div>
              <div className="property-body">
                <h3>{property.title}</h3>
                <p>{property.location}</p>
                <div className="property-meta">
                  <span>{property.beds} hab</span>
                  <span>{property.baths} banos</span>
                  <span>{property.area} m2</span>
                </div>
                <button type="button" className="button button-primary btn-full">
                  Ver Detalles
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <h2>Listo para Encontrar tu Hogar?</h2>
        <p>Nuestro equipo de expertos esta aqui para ayudarte en cada paso</p>
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
            <p>Tu socio de confianza en bienes raices.</p>
          </div>
          <div>
            <h4>Enlaces Rapidos</h4>
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
