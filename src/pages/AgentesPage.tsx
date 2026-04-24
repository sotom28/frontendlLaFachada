const pipeline = [
  { stage: 'Nuevos leads', count: 18 },
  { stage: 'Visitas agendadas', count: 11 },
  { stage: 'Oferta enviada', count: 5 },
  { stage: 'Cierre esta semana', count: 2 },
]

export function AgentesPage() {
  return (
    <main className="page-shell dashboard-page">
      <section className="dashboard-hero">
        <p className="eyebrow">Portal Agentes</p>
        <h1>Gestion de leads y propiedades activas.</h1>
        <p>
          Organiza oportunidades por etapa, registra seguimiento y acelera cierres comerciales.
        </p>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h2>Embudo comercial</h2>
          <div className="stack-list">
            {pipeline.map((item) => (
              <div key={item.stage} className="stack-item">
                <strong>{item.stage}</strong>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card">
          <h2>Tareas prioritarias</h2>
          <ul className="task-list">
            <li>Confirmar 3 visitas para manana.</li>
            <li>Actualizar fotos de 2 inmuebles nuevos.</li>
            <li>Responder cotizacion de cliente empresa.</li>
            <li>Subir contrato firmado al expediente.</li>
          </ul>
        </article>
      </section>
    </main>
  )
}
