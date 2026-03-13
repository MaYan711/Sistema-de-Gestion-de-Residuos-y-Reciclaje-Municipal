import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { getDefaultRouteByRole } from "../utils/roleUtils.js";

export default function Login() {
  const [email, setEmail] = useState("admin@muni.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/login", { email, password });
      login(data.token, data.usuario);
      nav(getDefaultRouteByRole(data.usuario), { replace: true });
    } catch (err) {
      const mensaje = err?.response?.data?.message || "No se pudo iniciar sesión";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="container auth-layout">
        <div className="auth-hero">
          <div className="section-pill">Sistema municipal</div>
          <h1 className="auth-title">Gestión de Residuos y Reciclaje Municipal</h1>
          <p className="auth-text">
            Administra rutas, recolecciones, denuncias ciudadanas, puntos verdes y reportes del sistema desde una sola plataforma.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <div className="auth-feature-title">Control operativo</div>
              <div className="auth-feature-text">Rutas, camiones, asignaciones y monitoreo en un solo panel.</div>
            </div>

            <div className="auth-feature-card">
              <div className="auth-feature-title">Reciclaje ciudadano</div>
              <div className="auth-feature-text">Registro de materiales, contenedores y operación de puntos verdes.</div>
            </div>

            <div className="auth-feature-card">
              <div className="auth-feature-title">Atención de denuncias</div>
              <div className="auth-feature-text">Seguimiento de casos con ubicación, fotos y control de cuadrillas.</div>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-badge">Acceso al sistema</div>
            <h2 className="auth-card-title">Iniciar sesión</h2>
            <p className="auth-card-text">Ingresa con tu cuenta para acceder según tu rol dentro del sistema.</p>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Correo electrónico</label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@municipalidad.gt"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Contraseña</label>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-actions">
              <button className="btn btn-primary-soft auth-main-btn" type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Entrar al sistema"}
              </button>

              <Link className="btn auth-secondary-btn" to="/register-ciudadano">
                Crear cuenta ciudadana
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}