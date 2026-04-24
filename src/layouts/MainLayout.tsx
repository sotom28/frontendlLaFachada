import { NavLink, Outlet } from 'react-router-dom'
import logoLaFachada from '../assets/logolafachada.webp'

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Propiedades', to: '/propiedades' },
  { label: 'Contacto', to: '/contacto' },
]

export function MainLayout() {
  return (
    <div className="app-layout">
      <header className="site-header">
        <div className="site-header-inner">
          <NavLink className="brand" to="/">
            <img src={logoLaFachada} alt="Logo La Fachada" className="brand-logo" />
            <span>La Fachada</span>
          </NavLink>
          <nav className="route-nav" aria-label="Navegacion principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'route-link route-link-active' : 'route-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/iniciar-sesion" className="route-link route-link-ghost">
              Iniciar Sesion
            </NavLink>
            <NavLink to="/registrarse" className="route-link route-link-cta">
              Registrarse
            </NavLink>
          </nav>
        </div>
      </header>

      <Outlet />
    </div>
  )
}
