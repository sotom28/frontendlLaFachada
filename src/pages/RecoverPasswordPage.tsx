import { Link } from 'react-router-dom'

export function RecoverPasswordPage() {
  return (
    <main className="auth-shell auth-shell-login">
      <section className="auth-card">
        <h1>Recuperar Contrasena</h1>
        <p>Te enviaremos un enlace para restaurar el acceso a tu cuenta.</p>
        <form className="auth-form">
          <label>
            Correo Electronico
            <input type="email" placeholder="tu@email.com" />
          </label>
          <button type="submit" className="button button-primary btn-full">
            Enviar enlace
          </button>
        </form>
        <p className="auth-link-row">
          <Link to="/iniciar-sesion">Volver a iniciar sesion</Link>
        </p>
      </section>
    </main>
  )
}
