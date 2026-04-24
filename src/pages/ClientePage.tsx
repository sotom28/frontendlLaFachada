const quickFilters = [
  'Departamento',
  'Casa',
  'Oficina',
  'Hasta UF 6.000',
  '2 o mas dormitorios',
  'Pet friendly',
]

const highlighted = [
  {
    title: 'Vista Parque Central',
    subtitle: 'Santiago Centro',
    price: 'UF 4.850',
  },
  {
    title: 'Terrazas del Valle',
    subtitle: 'La Florida',
    price: 'UF 6.200',
  },
  {
    title: 'Casa Alto La Dehesa',
    subtitle: 'Lo Barnechea',
    price: 'UF 13.900',
  },
]

export function ClientePage() {
  return (
    <main className="page-shell dashboard-page">
      <section className="dashboard-hero">
        <p className="eyebrow">Portal Cliente</p>
        <h1>Busca propiedades y agenda tu visita.</h1>
        <p>
          Filtra en segundos, compara opciones y contacta al agente sin salir de la plataforma.
        </p>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h2>Filtros rapidos</h2>
          <div className="chip-grid">
            {quickFilters.map((filter) => (
              <span key={filter} className="chip">
                {filter}
              </span>
            ))}
          </div>
        </article>

        <article className="dashboard-card">
          <h2>Propiedades destacadas</h2>
          <div className="stack-list">
            {highlighted.map((property) => (
              <div key={property.title} className="stack-item">
                <div>
                  <strong>{property.title}</strong>
                  <p>{property.subtitle}</p>
                </div>
                <span>{property.price}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}
