import { Link } from 'react-router-dom'

const terms = [
  'La Fachada utiliza esta plataforma para mostrar propiedades, coordinar visitas y gestionar contactos.',
  'El usuario debe proporcionar informacion real, actual y verificable al crear su cuenta.',
  'Las credenciales son personales y no deben compartirse con terceros.',
  'La disponibilidad, precio y condiciones de cada propiedad pueden cambiar sin previo aviso.',
  'Al continuar, el usuario acepta el tratamiento de sus datos para fines comerciales y de contacto.',
]

export function TermsPage() {
  return (
    <main className="page-shell page-light">
      <section className="section-header">
        <h1>Terminos y Condiciones</h1>
        <p>Lee y acepta las condiciones de uso de La Fachada antes de continuar.</p>
      </section>

      <section className="terms-card">
        <h2>Condiciones principales</h2>
        <ul>
          {terms.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
        <div className="terms-actions">
          <Link to="/iniciar-sesion" className="button button-primary">
            Aceptar y volver al inicio de sesion
          </Link>
          <Link to="/registrarse" className="button button-ghost">
            Ir a registrarme
          </Link>
        </div>
      </section>
    </main>
  )
}
