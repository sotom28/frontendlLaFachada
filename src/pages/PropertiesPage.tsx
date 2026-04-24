import { useMemo, useState } from 'react'
import { properties } from '../data/properties'

export function PropertiesPage() {
  const [term, setTerm] = useState('')

  const filtered = useMemo(() => {
    const q = term.toLowerCase().trim()
    if (!q) {
      return properties
    }
    return properties.filter(
      (item) => item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q),
    )
  }, [term])

  return (
    <main className="page-shell page-light">
      <section className="section-header">
        <h1>Nuestras Propiedades</h1>
        <p>Explora {filtered.length} propiedades disponibles</p>
      </section>

      <section className="search-toolbar">
        <input
          type="text"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar por titulo o ubicacion..."
        />
        <button type="button" className="button button-ghost">
          Filtros
        </button>
      </section>

      <p className="results-text">Mostrando {filtered.length} propiedades</p>

      <section className="property-grid-cards">
        {filtered.map((property) => (
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
      </section>
    </main>
  )
}
