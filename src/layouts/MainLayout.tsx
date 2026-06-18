import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logoLaFachada from "../assets/logolafachada.webp";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Propiedades", to: "/propiedades" },
];

export function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  return (
    <div className="app-layout">
      <header className="site-header">
        <div className="site-header-inner">
          <NavLink className="brand" to="/">
            <img
              src={logoLaFachada}
              alt="Logo La Fachada"
              className="brand-logo"
            />
            <span>La Fachada</span>
          </NavLink>
          <nav className="route-nav" aria-label="Navegacion principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  isActive ? "route-link route-link-active" : "route-link"
                }
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated && user?.idRol === 1 && (
              <NavLink
                to="/crear-propiedad"
                className={({ isActive }) =>
                  isActive ? "route-link route-link-active" : "route-link"
                }
              >
                Crear Publicación
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to="/agendas"
                className={({ isActive }) =>
                  isActive ? "route-link route-link-active" : "route-link"
                }
              >
                Mis Agendas
              </NavLink>
            )}

            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/iniciar-sesion"
                  className="route-link route-link-ghost"
                >
                  Iniciar Sesión
                </NavLink>
                <NavLink
                  to="/registrarse"
                  className="route-link route-link-cta"
                >
                  Registrarse
                </NavLink>
              </>
            ) : (
              <div className="user-nav">
                <span className="user-name">Hola, {user?.nombre}</span>
                <button
                  onClick={handleLogout}
                  className="route-link route-link-ghost"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
