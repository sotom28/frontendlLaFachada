import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    id_rol: 2, // Default to USER (2)
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'id_rol' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    const payload = {
      ...formData,
      id_termino: 1, // Default as requested
    }

    try {
      // 1. Register the user
      const registerResponse = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const registerData = await registerResponse.json()

      if (registerResponse.ok) {
        // 2. Automatically log in after successful registration
        const loginResponse = await fetch('http://localhost:3000/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        const loginData = await loginResponse.json()

        if (loginResponse.ok) {
          login(loginData.usuario, loginData.token)
          navigate('/') // Redirect to home
        } else {
          setMessage({ type: 'success', text: 'Registro exitoso. Por favor inicia sesión.' })
          setTimeout(() => navigate('/iniciar-sesion'), 2000)
        }
      } else {
        setMessage({ type: 'error', text: registerData.message || 'Error al registrar usuario' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell auth-shell-register">
      <section className="auth-card">
        <h1>Crear Cuenta</h1>
        <p>Únete a La Fachada y encuentra tu hogar ideal</p>
        
        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Nombre Completo
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
          </label>
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
            Rol
            <select
              name="id_rol"
              required
              value={formData.id_rol}
              onChange={handleChange}
            >
              <option value={1}>ADMIN</option>
              <option value={2}>USER</option>
            </select>
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
          <label>
            Confirmar Contraseña
            <input
              type="password"
              name="confirmPassword"
              placeholder="******"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <label className="auth-checkbox">
            <input type="checkbox" required defaultChecked />
            <span>
              Acepto los{' '}
              <Link to="/terminos-y-condiciones">términos y condiciones</Link> y la política de privacidad.
            </span>
          </label>
          <button 
            type="submit" 
            className="button button-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        <p className="auth-link-row">
          ¿Ya tienes una cuenta? <Link to="/iniciar-sesion">Inicia Sesión</Link>
        </p>
      </section>
    </main>
  )
}
