export function ContactPage() {
  return (
    <main className="page-shell page-light">
      <section className="section-header">
        <h1>Contactanos</h1>
        <p>Estamos aqui para ayudarte. Envianos un mensaje y te responderemos pronto.</p>
      </section>

      <section className="contact-layout">
        <aside className="info-panel">
          <h2>Informacion de Contacto</h2>
          <p>Direccion</p>
          <span>Av. Principal 123, Ciudad, Pais</span>
          <p>Telefono</p>
          <span>+1 (555) 123-4567</span>
          <p>Email</p>
          <span>info@lafachada.com</span>
          <p>Horario</p>
          <span>Lunes a Viernes: 9:00 AM - 6:00 PM</span>
        </aside>

        <form className="form-panel">
          <h2>Envianos un Mensaje</h2>
          <div className="form-grid">
            <label>
              Nombre Completo
              <input type="text" placeholder="Tu nombre" />
            </label>
            <label>
              Email
              <input type="email" placeholder="tu@email.com" />
            </label>
            <label>
              Telefono
              <input type="tel" placeholder="+1 (555) 123-4567" />
            </label>
            <label>
              Asunto
              <select defaultValue="consulta">
                <option value="consulta">Consulta general</option>
                <option value="compra">Compra</option>
                <option value="venta">Venta</option>
              </select>
            </label>
            <label className="full-width">
              Mensaje
              <textarea rows={5} placeholder="Cuentanos como podemos ayudarte" />
            </label>
          </div>
          <button type="submit" className="button button-primary btn-full">
            Enviar Mensaje
          </button>
        </form>
      </section>
    </main>
  )
}
