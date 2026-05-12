import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Successful login: data.usuario contains {idUsuario, nombre, email}, data.token contains JWT
        await login(data.usuario, data.token)
        navigate('/') // Redirect to home
      } else {
        setError(data.message || 'Credenciales incorrectas')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell auth-shell-login">
      <section className="auth-card">
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta de La Fachada</p>

        {error && (
          <div className="message-banner error">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Correo Electrónico
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              name="password"
              placeholder="******"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <button 
            type="submit" 
            className="button button-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="auth-link-row">
          <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
        </p>
        <p className="auth-link-row">
          ¿No tienes una cuenta? <Link to="/registrarse">Regístrate</Link>
        </p>
      </section>
    </main>
  )
}
