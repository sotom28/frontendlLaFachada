const summaryCards = [
  { title: 'Propiedades publicadas', value: '240' },
  { title: 'Agentes activos', value: '18' },
  { title: 'Conversion mensual', value: '22%' },
  { title: 'Tickets pendientes', value: '07' },
]

export function AdminPage() {
  return (
    <main className="page-shell dashboard-page">
      <section className="dashboard-hero">
        <p className="eyebrow">Panel Administrador</p>
        <h1>Control central de la operacion inmobiliaria.</h1>
        <p>
          Supervisa rendimiento, permisos de usuarios y estado del catalogo en una vista ejecutiva.
        </p>
      </section>

      <section className="stats-grid">
        {summaryCards.map((item) => (
          <article key={item.title} className="stat-tile">
            <p>{item.title}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h2>Alertas del sistema</h2>
          <ul className="task-list">
            <li>5 propiedades sin actualizar desde hace 15 dias.</li>
            <li>2 usuarios pendientes de validacion de correo.</li>
            <li>1 agente requiere renovacion de permisos.</li>
          </ul>
        </article>

        <article className="dashboard-card">
          <h2>Reportes rapidos</h2>
          <ul className="task-list">
            <li>Descargar informe semanal de conversion.</li>
            <li>Exportar base de clientes segmentada.</li>
            <li>Revisar rendimiento por comuna y tipo.</li>
          </ul>
        </article>
      </section>
    </main>
  )
}
