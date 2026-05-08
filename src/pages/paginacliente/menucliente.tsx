import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './menucliente.css'

interface ClienteData {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  propiedades: number
  activo: boolean
  fecha_registro: string
  role?: string
  sellerApproved?: boolean
  pendingSeller?: boolean
}

interface Propiedad {
  id: string
  nombre: string
  direccion: string
  precio: number
  estado: 'disponible' | 'alquilada' | 'vendida'
  tipo: string
  fecha_creacion: string
  imagenUrl: string
}

export function MenuCliente() {
  const navigate = useNavigate()
  const [cliente, setCliente] = useState<ClienteData | null>(null)
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [seccionActiva, setSeccionActiva] = useState('dashboard')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulación de carga de datos del cliente
    const clienteGuardado = localStorage.getItem('clienteActual')
    if (!clienteGuardado) {
      navigate('/iniciar-sesion')
      return
    }

    try {
      const datosCliente = JSON.parse(clienteGuardado)
      setCliente(datosCliente)
      
      // Simular carga de propiedades
      const propiedadesSimuladas: Propiedad[] = [
        {
          id: '1',
          nombre: 'Apartamento Moderno Centro',
          direccion: 'Calle Principal 123, Piso 5',
          precio: 450000,
          estado: 'disponible',
          tipo: 'Apartamento',
          fecha_creacion: '2024-01-15',
          imagenUrl: 'https://via.placeholder.com/300x200?text=Apartamento+1'
        },
        {
          id: '2',
          nombre: 'Casa Familiar con Jardín',
          direccion: 'Avenida Los Andes 456',
          precio: 650000,
          estado: 'alquilada',
          tipo: 'Casa',
          fecha_creacion: '2024-02-20',
          imagenUrl: 'https://via.placeholder.com/300x200?text=Casa+1'
        },
        {
          id: '3',
          nombre: 'Local Comercial Esquinero',
          direccion: 'Paseo Comercial 789',
          precio: 320000,
          estado: 'vendida',
          tipo: 'Local',
          fecha_creacion: '2024-03-10',
          imagenUrl: 'https://via.placeholder.com/300x200?text=Local+1'
        }
      ]
      setPropiedades(propiedadesSimuladas)
      setLoading(false)
    } catch (error) {
      console.error('Error cargando datos del cliente:', error)
      navigate('/iniciar-sesion')
    }
  }, [navigate])

  const requestSellerPermission = () => {
    const clienteGuardado = localStorage.getItem('clienteActual')
    if (!clienteGuardado) return
    const session = JSON.parse(clienteGuardado)

    // actualizar users
    const usersRaw = localStorage.getItem('users')
    const users = usersRaw ? JSON.parse(usersRaw) : []
    const userIndex = users.findIndex((u: any) => u.email === session.email)
    if (userIndex !== -1) {
      users[userIndex].pendingSeller = true
      localStorage.setItem('users', JSON.stringify(users))
      // actualizar session
      const newSession = { ...session, pendingSeller: true }
      localStorage.setItem('clienteActual', JSON.stringify(newSession))
      setCliente(newSession)
      alert('Solicitud enviada. Un administrador revisará tu petición.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('clienteActual')
    navigate('/iniciar-sesion')
  }

  const handleVerDetalles = (propiedadId: string) => {
    alert(`Ver detalles de la propiedad ${propiedadId}`)
  }

  const handleEditarPropiedad = (propiedadId: string) => {
    alert(`Editar propiedad ${propiedadId}`)
  }

  const handleContactarAgente = () => {
    alert('Redirigiendo a contacto con agente...')
  }

  if (loading) {
    return <div className="cliente-loading">Cargando datos...</div>
  }

  if (!cliente) {
    return <div className="cliente-error">Error: Cliente no encontrado</div>
  }

  return (
    <div className="cliente-container">
      {/* Header */}
      <header className="cliente-header">
        <div className="cliente-header-content">
          <h1>La Fachada - Portal del Cliente</h1>
          <button 
            className="menu-toggle"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>
        </div>
      </header>

      <div className="cliente-body">
        {/* Sidebar */}
        <nav className={`cliente-sidebar ${menuAbierto ? 'abierto' : ''}`}>
          <div className="cliente-info-lateral">
            <div className="cliente-avatar">
              {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
            </div>
            <h3>{cliente.nombre} {cliente.apellido}</h3>
            <p className="cliente-email">{cliente.email}</p>
          </div>

          <ul className="cliente-menu">
            <li>
              <button
                className={`menu-item ${seccionActiva === 'dashboard' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('dashboard')
                  setMenuAbierto(false)
                }}
              >
                📊 Dashboard
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${seccionActiva === 'propiedades' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('propiedades')
                  setMenuAbierto(false)
                }}
              >
                🏠 Mis Propiedades
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${seccionActiva === 'ofertas' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('ofertas')
                  setMenuAbierto(false)
                }}
              >
                💰 Ofertas Recibidas
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${seccionActiva === 'perfil' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('perfil')
                  setMenuAbierto(false)
                }}
              >
                👤 Mi Perfil
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${seccionActiva === 'mensajes' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('mensajes')
                  setMenuAbierto(false)
                }}
              >
                💬 Mensajes
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${seccionActiva === 'soporte' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('soporte')
                  setMenuAbierto(false)
                }}
              >
                ❓ Soporte
              </button>
            </li>
            {cliente.role === 'admin' && (
              <li>
                <button
                  className={`menu-item`}
                  onClick={() => window.location.assign('/admin')}
                >
                  ⚙️ Panel Admin
                </button>
              </li>
            )}
          </ul>

          <button className="btn-logout" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </nav>

        {/* Contenido Principal */}
        <main className="cliente-contenido">
          {/* Dashboard */}
          {seccionActiva === 'dashboard' && (
            <section className="seccion-dashboard">
              <h2>Bienvenido, {cliente.nombre}!</h2>
              
              <div className="estadisticas">
                <div className="estadistica-card">
                  <h3>Propiedades Activas</h3>
                  <p className="numero">{propiedades.length}</p>
                </div>
                <div className="estadistica-card">
                  <h3>Disponibles</h3>
                  <p className="numero">{propiedades.filter(p => p.estado === 'disponible').length}</p>
                </div>
                <div className="estadistica-card">
                  <h3>Alquiladas</h3>
                  <p className="numero">{propiedades.filter(p => p.estado === 'alquilada').length}</p>
                </div>
                <div className="estadistica-card">
                  <h3>Vendidas</h3>
                  <p className="numero">{propiedades.filter(p => p.estado === 'vendida').length}</p>
                </div>
              </div>

              <div className="acciones-rapidas">
                <h3>Acciones Rápidas</h3>
                <div className="botones-accion">
                  {cliente.sellerApproved || cliente.role === 'seller' ? (
                    <button className="btn-accion" onClick={() => navigate('/agregar-propiedad')}>
                      ➕ Agregar Propiedad
                    </button>
                  ) : (
                    cliente.pendingSeller ? (
                      <button className="btn-accion" disabled>
                        ⏳ Solicitud enviada
                      </button>
                    ) : (
                      <button className="btn-accion" onClick={requestSellerPermission}>
                        📝 Solicitar permiso para vender
                      </button>
                    )
                  )}
                  <button className="btn-accion" onClick={handleContactarAgente}>
                    📞 Contactar Agente
                  </button>
                  <button className="btn-accion" onClick={() => setSeccionActiva('mensajes')}>
                    📬 Ver Mensajes
                  </button>
                </div>
              </div>

              <div className="resumen-propiedades">
                <h3>Últimas Propiedades</h3>
                <div className="propiedades-grid">
                  {propiedades.slice(0, 2).map(propiedad => (
                    <div key={propiedad.id} className="propiedad-card">
                      <img src={propiedad.imagenUrl} alt={propiedad.nombre} />
                      <h4>{propiedad.nombre}</h4>
                      <p className="tipo">{propiedad.tipo}</p>
                      <p className="precio">${propiedad.precio.toLocaleString()}</p>
                      <p className={`estado estado-${propiedad.estado}`}>
                        {propiedad.estado.toUpperCase()}
                      </p>
                      <button 
                        className="btn-pequeño"
                        onClick={() => handleVerDetalles(propiedad.id)}
                      >
                        Ver Detalles
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Mis Propiedades */}
          {seccionActiva === 'propiedades' && (
            <section className="seccion-propiedades">
              <div className="seccion-header">
                <h2>Mis Propiedades</h2>
                <button className="btn-agregar-propiedad" onClick={() => navigate('/agregar-propiedad')}>
                  ➕ Agregar Nueva
                </button>
              </div>
              <div className="filtros">
                <select className="filtro-select">
                  <option>Todos los estados</option>
                  <option>Disponible</option>
                  <option>Alquilada</option>
                  <option>Vendida</option>
                </select>
              </div>
              
              <div className="propiedades-grid">
                {propiedades.map(propiedad => (
                  <div key={propiedad.id} className="propiedad-card-grande">
                    <img src={propiedad.imagenUrl} alt={propiedad.nombre} />
                    <div className="propiedad-info">
                      <h3>{propiedad.nombre}</h3>
                      <p className="direccion">📍 {propiedad.direccion}</p>
                      <p className="tipo">Tipo: {propiedad.tipo}</p>
                      <p className="precio">${propiedad.precio.toLocaleString()}</p>
                      <p className={`estado estado-${propiedad.estado}`}>
                        {propiedad.estado.toUpperCase()}
                      </p>
                      <div className="botones-propiedad">
                        <button className="btn-secundario" onClick={() => handleVerDetalles(propiedad.id)}>
                          Ver Detalles
                        </button>
                        <button className="btn-secundario">Editar</button>
                        <button className="btn-peligro">Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ofertas */}
          {seccionActiva === 'ofertas' && (
            <section className="seccion-ofertas">
              <h2>Ofertas Recibidas</h2>
              <div className="ofertas-list">
                <div className="oferta-item">
                  <h3>Oferta por Apartamento Moderno Centro</h3>
                  <p>💰 Monto: $400,000</p>
                  <p>📅 Recibida: 2024-12-15</p>
                  <p>👤 Oferente: Juan García</p>
                  <button className="btn-pequeno">Ver Detalles</button>
                </div>
                <div className="oferta-item">
                  <h3>Oferta por Casa Familiar con Jardín</h3>
                  <p>💰 Monto: $600,000</p>
                  <p>📅 Recibida: 2024-12-10</p>
                  <p>👤 Oferente: María López</p>
                  <button className="btn-pequeno">Ver Detalles</button>
                </div>
              </div>
            </section>
          )}

          {/* Perfil */}
          {seccionActiva === 'perfil' && (
            <section className="seccion-perfil">
              <h2>Mi Perfil</h2>
              <div className="perfil-contenedor">
                <div className="avatar-grande">
                  {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                </div>
                <form className="perfil-form">
                  <div className="form-grupo">
                    <label>Nombre</label>
                    <input type="text" defaultValue={cliente.nombre} />
                  </div>
                  <div className="form-grupo">
                    <label>Apellido</label>
                    <input type="text" defaultValue={cliente.apellido} />
                  </div>
                  <div className="form-grupo">
                    <label>Email</label>
                    <input type="email" defaultValue={cliente.email} />
                  </div>
                  <div className="form-grupo">
                    <label>Teléfono</label>
                    <input type="tel" defaultValue={cliente.telefono} />
                  </div>
                  <div className="form-grupo">
                    <label>Dirección</label>
                    <input type="text" defaultValue={cliente.direccion} />
                  </div>
                  <div className="form-grupo">
                    <label>Ciudad</label>
                    <input type="text" defaultValue={cliente.ciudad} />
                  </div>
                  <button type="button" className="btn-primary" onClick={() => alert('Perfil actualizado')}>
                    Guardar Cambios
                  </button>
                </form>
                <div style={{ marginTop: 16 }}>
                  {cliente.role === 'seller' || cliente.sellerApproved ? (
                    <div style={{ color: '#2e7d32', fontWeight: 600 }}>Eres vendedor aprobado ✅</div>
                  ) : cliente.pendingSeller ? (
                    <div style={{ color: '#b58900', fontWeight: 600 }}>Solicitud de vendedor pendiente ⏳</div>
                  ) : (
                    <button className="btn-accion" onClick={requestSellerPermission}>
                      📝 Solicitar permiso para vender
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Mensajes */}
          {seccionActiva === 'mensajes' && (
            <section className="seccion-mensajes">
              <h2>Mensajes</h2>
              <div className="mensajes-list">
                <div className="mensaje-item">
                  <h4>Pregunta sobre Apartamento Moderno</h4>
                  <p>De: agent@lafachada.com</p>
                  <p>Contenido: ¿El apartamento incluye parqueadero?</p>
                  <p className="fecha">12/15/2024 - 2:30 PM</p>
                  <button className="btn-pequeno">Responder</button>
                </div>
                <div className="mensaje-item">
                  <h4>Notificación de Contrato Listo</h4>
                  <p>De: legal@lafachada.com</p>
                  <p>Contenido: El contrato para la casa ha sido preparado.</p>
                  <p className="fecha">12/14/2024 - 10:15 AM</p>
                  <button className="btn-pequeno">Ver Contrato</button>
                </div>
              </div>
            </section>
          )}

          {/* Soporte */}
          {seccionActiva === 'soporte' && (
            <section className="seccion-soporte">
              <h2>Centro de Soporte</h2>
              <div className="soporte-contenedor">
                <div className="soporte-card">
                  <h3>📞 Contactar por Teléfono</h3>
                  <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  <p>Teléfono: +56 2 2222 2222</p>
                  <button className="btn-primary">Agendar Llamada</button>
                </div>
                <div className="soporte-card">
                  <h3>📧 Enviar Email</h3>
                  <p>Respuesta en máximo 24 horas</p>
                  <p>support@lafachada.com</p>
                  <button className="btn-primary">Enviar Email</button>
                </div>
                <div className="soporte-card">
                  <h3>💬 Chat en Vivo</h3>
                  <p>Disponible de 10:00 AM - 8:00 PM</p>
                  <p>Habla con nuestros agentes</p>
                  <button className="btn-primary">Abrir Chat</button>
                </div>
              </div>
              <div className="preguntas-frecuentes">
                <h3>Preguntas Frecuentes</h3>
                <div className="faq-item">
                  <h4>¿Cómo agrego una nueva propiedad?</h4>
                  <p>Ve a la sección "Mis Propiedades" y haz clic en "Agregar Propiedad"</p>
                </div>
                <div className="faq-item">
                  <h4>¿Cómo cambio mi contraseña?</h4>
                  <p>Ve a tu perfil y busca la opción "Cambiar Contraseña"</p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
