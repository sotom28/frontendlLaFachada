import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <main className="auth-shell auth-shell-login">
      <section className="auth-card">
        <h1>Iniciar Sesion</h1>
        <p>Accede a tu cuenta de La Fachada</p>
        <form className="auth-form">
          <label>
            Correo Electronico
            <input type="email" placeholder="tu@email.com" />
          </label>
          <label>
            Contrasena
            <input type="password" placeholder="******" />
          </label>
          <button type="submit" className="button button-primary btn-full">
            Iniciar Sesion
          </button>
        </form>
        <p className="auth-link-row">
          No tienes una cuenta? <Link to="/registrarse">Registrate</Link>
        </p>
      </section>
    </main>
  )
}
