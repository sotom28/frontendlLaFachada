import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Inicializa una lista de usuarios en localStorage si no existe
  ;(function ensureUsers() {
    const existing = localStorage.getItem('users')
    if (!existing) {
      const seed = [
        {
          id: 'u-admin',
          nombre: 'Admin',
          apellido: 'LaFachada',
          email: 'admin@lafachada.com',
          password: 'Admin123',
          telefono: '',
          direccion: '',
          ciudad: '',
          role: 'admin',
          sellerApproved: true,
          pendingSeller: false,
        },
        {
          id: 'u-cliente',
          nombre: 'Juan',
          apellido: 'García',
          email: 'cliente@lafachada.com',
          password: 'Prueba123',
          telefono: '+56 9 8765 4321',
          direccion: 'Calle Principal 123',
          ciudad: 'Santiago',
          role: 'user',
          sellerApproved: false,
          pendingSeller: false,
        },
        {
          id: 'u-agente',
          nombre: 'Carlos',
          apellido: 'Acevedo',
          email: 'agente@lafachada.com',
          password: 'Agente123',
          telefono: '+56 9 9876 5432',
          direccion: 'Calle Agente 789',
          ciudad: 'Santiago',
          role: 'agent',
          sellerApproved: false,
          pendingSeller: false,
        },
        {
          id: 'u-test',
          nombre: 'María',
          apellido: 'López',
          email: 'test@lafachada.com',
          password: 'Test123',
          telefono: '+56 9 8765 4322',
          direccion: 'Avenida Los Andes 456',
          ciudad: 'Santiago',
          role: 'user',
          sellerApproved: false,
          pendingSeller: false,
        },
      ]
      localStorage.setItem('users', JSON.stringify(seed))
    }
  })()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validación simple
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    // Buscar usuario en localStorage
    const usuariosStored = localStorage.getItem('users')
    const usuarios = usuariosStored ? JSON.parse(usuariosStored) : []
    const usuarioEncontrado = usuarios.find((u: any) => u.email === email && u.password === password)

    if (usuarioEncontrado) {
      // Guardar sesión con información de role
      const session = {
        id: usuarioEncontrado.id || Math.random().toString(),
        nombre: usuarioEncontrado.nombre,
        apellido: usuarioEncontrado.apellido,
        email: usuarioEncontrado.email,
        telefono: usuarioEncontrado.telefono,
        direccion: usuarioEncontrado.direccion,
        ciudad: usuarioEncontrado.ciudad,
        propiedades: 3,
        activo: true,
        fecha_registro: '2024-01-01',
        role: usuarioEncontrado.role || 'user',
        sellerApproved: !!usuarioEncontrado.sellerApproved,
        pendingSeller: !!usuarioEncontrado.pendingSeller,
      }

      localStorage.setItem('clienteActual', JSON.stringify(session))

      if (session.role === 'admin') {
        navigate('/admin')
      } else if (session.role === 'agent') {
        navigate('/agent-menu')
      } else {
        navigate('/cliente-menu')
      }
    } else {
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <main className="auth-shell auth-shell-login">
      <section className="auth-card">
        <h1>Iniciar Sesion</h1>
        <p>Accede a tu cuenta de La Fachada</p>
        
        {error && <div className="error-message">{error}</div>}

        <div className="credenciales-prueba">
          <p><strong>📧 Credenciales de Prueba:</strong></p>
          <p>Cliente — Email: <code>cliente@lafachada.com</code> / Contraseña: <code>Prueba123</code></p>
          <p>Agente — Email: <code>agente@lafachada.com</code> / Contraseña: <code>Agente123</code></p>
          <p>Admin — Email: <code>admin@lafachada.com</code> / Contraseña: <code>Admin123</code></p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Correo Electronico
            <input 
              type="email" 
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Contrasena
            <input 
              type="password" 
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="button button-primary btn-full">
            Iniciar Sesion
          </button>
        </form>
        <p className="auth-link-row">
          <Link to="/recuperar-contrasena">Olvidaste tu contrasena?</Link>
        </p>
        <p className="auth-link-row">
          No tienes una cuenta? <Link to="/registrarse">Registrate</Link>
        </p>
      </section>
    </main>
  )
}
