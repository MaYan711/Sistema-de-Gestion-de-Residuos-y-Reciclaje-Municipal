import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import { api } from "../../api/axios.js";
import { hasRole } from "../../utils/roleUtils.js";
import { useState } from "react";

export default function Navbar() {
  const { isAuthed, logout, user } = useAuth();
  const nav = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      console.log("Logout error:", e?.response?.data || e.message);
    } finally {
      logout();
      nav("/login");
    }
  };

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const closeMenus = () => {
    setOpenMenu(null);
  };

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="brand-area">
          <NavLink to={isAuthed ? "/dashboard" : "/portal-rutas"} className="brand-link" onClick={closeMenus}>
            <span className="brand-badge">RM</span>
            <span>ResiduosMuni</span>
          </NavLink>
        </div>

        <nav className="nav-main">
          <NavLink to="/portal-rutas" className="nav-item" onClick={closeMenus}>
            Portal Rutas
          </NavLink>

          {isAuthed && (
            <>
              {hasRole(user, ["administrador", "coordinador"]) && (
                <>
                  <NavLink to="/dashboard" className="nav-item" onClick={closeMenus}>
                    Dashboard
                  </NavLink>

                  <div className="nav-dropdown">
                    <button
                      type="button"
                      className={`nav-item nav-button ${openMenu === "operaciones" ? "active" : ""}`}
                      onClick={() => toggleMenu("operaciones")}
                    >
                      Operaciones
                    </button>

                    {openMenu === "operaciones" && (
                      <div className="dropdown-panel">
                        <NavLink to="/mapa" className="dropdown-link" onClick={closeMenus}>
                          Mapa general
                        </NavLink>
                        <NavLink to="/zonas" className="dropdown-link" onClick={closeMenus}>
                          Zonas
                        </NavLink>
                        <NavLink to="/rutas" className="dropdown-link" onClick={closeMenus}>
                          Rutas
                        </NavLink>
                        <NavLink to="/camiones" className="dropdown-link" onClick={closeMenus}>
                          Camiones
                        </NavLink>
                        <NavLink to="/asignaciones-ruta" className="dropdown-link" onClick={closeMenus}>
                          Asignaciones
                        </NavLink>
                        <NavLink to="/recolecciones" className="dropdown-link" onClick={closeMenus}>
                          Recolecciones
                        </NavLink>
                        <NavLink to="/monitoreo-asignaciones" className="dropdown-link" onClick={closeMenus}>
                          Monitoreo
                        </NavLink>
                      </div>
                    )}
                  </div>
                </>
              )}

              {hasRole(user, ["administrador", "operador"]) && (
                <div className="nav-dropdown">
                  <button
                    type="button"
                    className={`nav-item nav-button ${openMenu === "reciclaje" ? "active" : ""}`}
                    onClick={() => toggleMenu("reciclaje")}
                  >
                    Reciclaje
                  </button>

                  {openMenu === "reciclaje" && (
                    <div className="dropdown-panel">
                      <NavLink to="/tipos-material" className="dropdown-link" onClick={closeMenus}>
                        Tipos de material
                      </NavLink>
                      <NavLink to="/contenedores" className="dropdown-link" onClick={closeMenus}>
                        Contenedores
                      </NavLink>
                      <NavLink to="/operacion-reciclaje" className="dropdown-link" onClick={closeMenus}>
                        Operación reciclaje
                      </NavLink>
                    </div>
                  )}
                </div>
              )}

              {hasRole(user, ["administrador", "coordinador", "ciudadano"]) && (
                <div className="nav-dropdown">
                  <button
                    type="button"
                    className={`nav-item nav-button ${openMenu === "denuncias" ? "active" : ""}`}
                    onClick={() => toggleMenu("denuncias")}
                  >
                    Denuncias
                  </button>

                  {openMenu === "denuncias" && (
                    <div className="dropdown-panel">
                      <NavLink to="/denuncias" className="dropdown-link" onClick={closeMenus}>
                        Gestión de denuncias
                      </NavLink>
                      <NavLink to="/seguimiento" className="dropdown-link" onClick={closeMenus}>
                        Seguimiento
                      </NavLink>
                    </div>
                  )}
                </div>
              )}

              {hasRole(user, ["administrador", "coordinador", "auditor"]) && (
                <NavLink to="/reportes" className="nav-item" onClick={closeMenus}>
                  Reportes
                </NavLink>
              )}

              {hasRole(user, ["administrador"]) && (
                <NavLink to="/usuarios" className="nav-item" onClick={closeMenus}>
                  Usuarios
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="topbar-actions">
          {isAuthed ? (
            <button className="btn btn-danger-soft" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <Link className="btn btn-primary-soft topbar-login-btn" to="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}