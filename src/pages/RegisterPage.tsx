import { Link } from 'react-router-dom'

export function RegisterPage() {
  return (
    <main className="auth-shell auth-shell-register">
      <section className="auth-card">
        <h1>Crear Cuenta</h1>
        <p>Unete a La Fachada y encuentra tu hogar ideal</p>
        <form className="auth-form">
          <label>
            Nombre Completo
            <input type="text" placeholder="Tu nombre" />
          </label>
          <label>
            Correo Electronico
            <input type="email" placeholder="tu@email.com" />
          </label>
          <label>
            Telefono
            <input type="tel" placeholder="+1 (555) 123-4567" />
          </label>
          <label>
            Contrasena
            <input type="password" placeholder="******" />
          </label>
          <label>
            Confirmar Contrasena
            <input type="password" placeholder="******" />
          </label>
          <button type="submit" className="button button-primary btn-full">
            Crear Cuenta
          </button>
        </form>
        <p className="auth-link-row">
          Ya tienes una cuenta? <Link to="/iniciar-sesion">Inicia Sesion</Link>
        </p>
      </section>
    </main>
  )
}
