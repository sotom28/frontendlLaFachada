import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './menuAgente.css'

interface Propiedad {
  id: string
  nombre: string
  direccion: string
  precio: number
  tipo: string
  vendedor: string
  requiereAgente: boolean
  pagoPendiente: boolean
  agenteAsignado?: string
  fechaCreacion: string
}

interface Visita {
  id: string
  propiedadId: string
  propiedadNombre: string
  cliente: string
  email: string
  telefono: string
  fecha: string
  hora: string
  estado: 'pendiente' | 'confirmada' | 'realizada'
}

export function MenuAgente() {
  const navigate = useNavigate()
  const [agente, setAgente] = useState<any>(null)
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [seccionActiva, setSeccionActiva] = useState('propiedades')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const agenteGuardado = localStorage.getItem('clienteActual')
    if (!agenteGuardado) {
      navigate('/iniciar-sesion')
      return
    }

    const datosAgente = JSON.parse(agenteGuardado)
    if (datosAgente.role !== 'agent') {
      navigate('/cliente-menu')
      return
    }

    setAgente(datosAgente)

    // Cargar propiedades sin agente
    const propiedadesGuardadas = localStorage.getItem('propiedadesAgregadas')
    const props = propiedadesGuardadas ? JSON.parse(propiedadesGuardadas) : []
    setPropiedades(props.filter((p: any) => !p.agenteAsignado || p.requiereAgente))

    // Cargar visitas
    const visitasGuardadas = localStorage.getItem('visitas')
    const vis = visitasGuardadas ? JSON.parse(visitasGuardadas) : []
    setVisitas(vis)

    setLoading(false)
  }, [navigate])

  const asignarPropiedad = (propiedadId: string) => {
    const propiedadesGuardadas = localStorage.getItem('propiedadesAgregadas')
    const props = propiedadesGuardadas ? JSON.parse(propiedadesGuardadas) : []
    
    const idx = props.findIndex((p: any) => p.id === propiedadId)
    if (idx !== -1) {
      props[idx].agenteAsignado = agente.email
      props[idx].requiereAgente = false
      localStorage.setItem('propiedadesAgregadas', JSON.stringify(props))
      
      setPropiedades(props.filter((p: any) => !p.agenteAsignado || p.requiereAgente))
      alert('✓ Propiedad asignada correctamente')
    }
  }

  const crearVisita = (propiedadId: string, propiedadNombre: string) => {
    const cliente = prompt('Nombre del cliente:')
    const email = prompt('Email del cliente:')
    const telefono = prompt('Teléfono del cliente:')
    const fecha = prompt('Fecha (YYYY-MM-DD):')
    const hora = prompt('Hora (HH:MM):')

    if (cliente && email && telefono && fecha && hora) {
      const visita: Visita = {
        id: Date.now().toString(),
        propiedadId,
        propiedadNombre,
        cliente,
        email,
        telefono,
        fecha,
        hora,
        estado: 'pendiente'
      }

      const visitasGuardadas = localStorage.getItem('visitas')
      const vis = visitasGuardadas ? JSON.parse(visitasGuardadas) : []
      vis.push(visita)
      localStorage.setItem('visitas', JSON.stringify(vis))
      setVisitas(vis)
      alert('✓ Visita agendada')
    }
  }

  const confirmarVisita = (visitaId: string) => {
    const visitasGuardadas = localStorage.getItem('visitas')
    const vis = visitasGuardadas ? JSON.parse(visitasGuardadas) : []
    
    const idx = vis.findIndex((v: any) => v.id === visitaId)
    if (idx !== -1) {
      vis[idx].estado = 'confirmada'
      localStorage.setItem('visitas', JSON.stringify(vis))
      setVisitas(vis)
      alert('✓ Visita confirmada')
    }
  }

  const registrarPago = (propiedadId: string) => {
    const monto = prompt('Monto pagado (CLP):')
    const referencia = prompt('Referencia de pago:')

    if (monto && referencia) {
      const propiedadesGuardadas = localStorage.getItem('propiedadesAgregadas')
      const props = propiedadesGuardadas ? JSON.parse(propiedadesGuardadas) : []
      
      const idx = props.findIndex((p: any) => p.id === propiedadId)
      if (idx !== -1) {
        props[idx].pagoPendiente = false
        props[idx].pagoRegistrado = {
          monto: parseFloat(monto),
          referencia,
          fecha: new Date().toISOString().split('T')[0]
        }
        localStorage.setItem('propiedadesAgregadas', JSON.stringify(props))
        setPropiedades(props.filter((p: any) => !p.agenteAsignado || p.requiereAgente))
        alert('✓ Pago registrado correctamente')
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('clienteActual')
    navigate('/iniciar-sesion')
  }

  if (loading) {
    return <div className="agente-loading">Cargando...</div>
  }

  if (!agente) {
    return <div className="agente-error">No autorizado</div>
  }

  return (
    <div className="agente-container">
      <header className="agente-header">
        <div className="agente-header-content">
          <h1>Panel del Agente</h1>
          <button 
            className="menu-toggle"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>
        </div>
      </header>

      <div className="agente-body">
        <nav className={`agente-sidebar ${menuAbierto ? 'abierto' : ''}`}>
          <div className="agente-info">
            <div className="agente-avatar">
              {agente.nombre?.charAt(0)}{agente.apellido?.charAt(0)}
            </div>
            <h3>{agente.nombre} {agente.apellido}</h3>
            <p className="agente-email">{agente.email}</p>
          </div>

          <ul className="agente-menu">
            <li>
              <button
                className={`menu-item ${seccionActiva === 'propiedades' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('propiedades')
                  setMenuAbierto(false)
                }}
              >
                🏠 Propiedades Asignadas
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${seccionActiva === 'disponibles' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('disponibles')
                  setMenuAbierto(false)
                }}
              >
                📋 Propiedades Disponibles
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${seccionActiva === 'visitas' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('visitas')
                  setMenuAbierto(false)
                }}
              >
                📅 Visitas Agendadas
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${seccionActiva === 'pagos' ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActiva('pagos')
                  setMenuAbierto(false)
                }}
              >
                💰 Pagos Pendientes
              </button>
            </li>
          </ul>

          <button className="btn-logout" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </nav>

        <main className="agente-contenido">
          {/* Propiedades Asignadas */}
          {seccionActiva === 'propiedades' && (
            <section className="seccion-propiedades">
              <h2>Mis Propiedades</h2>
              <div className="propiedades-grid">
                {propiedades
                  .filter(p => p.agenteAsignado === agente.email)
                  .map(propiedad => (
                    <div key={propiedad.id} className="propiedad-card">
                      <h3>{propiedad.nombre}</h3>
                      <p className="precio">CLP ${propiedad.precio.toLocaleString()}</p>
                      <p className="direccion">{propiedad.direccion}</p>
                      <p className="tipo">{propiedad.tipo}</p>
                      <div className="card-acciones">
                        <button 
                          className="btn-secundario"
                          onClick={() => crearVisita(propiedad.id, propiedad.nombre)}
                        >
                          📅 Agendar Visita
                        </button>
                        <button 
                          className="btn-primario"
                          onClick={() => registrarPago(propiedad.id)}
                        >
                          💰 Registrar Pago
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              {propiedades.filter(p => p.agenteAsignado === agente.email).length === 0 && (
                <p className="sin-datos">No tienes propiedades asignadas aún</p>
              )}
            </section>
          )}

          {/* Propiedades Disponibles */}
          {seccionActiva === 'disponibles' && (
            <section className="seccion-disponibles">
              <h2>Propiedades Disponibles para Asignar</h2>
              <div className="propiedades-grid">
                {propiedades
                  .filter(p => !p.agenteAsignado || p.requiereAgente)
                  .map(propiedad => (
                    <div key={propiedad.id} className="propiedad-card">
                      <h3>{propiedad.nombre}</h3>
                      <p className="precio">CLP ${propiedad.precio.toLocaleString()}</p>
                      <p className="direccion">{propiedad.direccion}</p>
                      <p className="tipo">{propiedad.tipo}</p>
                      <p className="vendedor">Vendedor: {propiedad.vendedor}</p>
                      <button 
                        className="btn-asignar"
                        onClick={() => asignarPropiedad(propiedad.id)}
                      >
                        ✓ Asignarme esta Propiedad
                      </button>
                    </div>
                  ))}
              </div>
              {propiedades.filter(p => !p.agenteAsignado || p.requiereAgente).length === 0 && (
                <p className="sin-datos">No hay propiedades disponibles</p>
              )}
            </section>
          )}

          {/* Visitas Agendadas */}
          {seccionActiva === 'visitas' && (
            <section className="seccion-visitas">
              <h2>Visitas Agendadas</h2>
              <div className="visitas-list">
                {visitas.map(visita => (
                  <div key={visita.id} className="visita-item">
                    <div className="visita-info">
                      <h4>{visita.propiedadNombre}</h4>
                      <p><strong>Cliente:</strong> {visita.cliente}</p>
                      <p><strong>Email:</strong> {visita.email}</p>
                      <p><strong>Teléfono:</strong> {visita.telefono}</p>
                      <p><strong>Fecha:</strong> {visita.fecha} a las {visita.hora}</p>
                      <p className={`estado ${visita.estado}`}>
                        Estado: <strong>{visita.estado}</strong>
                      </p>
                    </div>
                    {visita.estado === 'pendiente' && (
                      <button 
                        className="btn-confirmar"
                        onClick={() => confirmarVisita(visita.id)}
                      >
                        Confirmar
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {visitas.length === 0 && (
                <p className="sin-datos">No hay visitas agendadas</p>
              )}
            </section>
          )}

          {/* Pagos Pendientes */}
          {seccionActiva === 'pagos' && (
            <section className="seccion-pagos">
              <h2>Pagos Pendientes</h2>
              <div className="pagos-list">
                {propiedades
                  .filter(p => p.pagoPendiente && p.agenteAsignado === agente.email)
                  .map(propiedad => (
                    <div key={propiedad.id} className="pago-item">
                      <div className="pago-info">
                        <h4>{propiedad.nombre}</h4>
                        <p className="precio">CLP ${propiedad.precio.toLocaleString()}</p>
                        <p className="estado-pago">⚠️ Pago Pendiente</p>
                      </div>
                      <button 
                        className="btn-registrar"
                        onClick={() => registrarPago(propiedad.id)}
                      >
                        Registrar Pago
                      </button>
                    </div>
                  ))}
              </div>
              {propiedades.filter(p => p.pagoPendiente && p.agenteAsignado === agente.email).length === 0 && (
                <p className="sin-datos">No hay pagos pendientes</p>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
