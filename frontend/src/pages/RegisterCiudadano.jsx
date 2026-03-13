import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCiudadano } from "../api/auth.service";
import { useAuth } from "../auth/AuthContext";
import { getDefaultRouteByRole } from "../utils/roleUtils";

export default function RegisterCiudadano() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerCiudadano({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      login(data.token, data.usuario);
      nav(getDefaultRouteByRole(data.usuario), { replace: true });
    } catch (err) {
      const mensaje =
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.errors?.password?.[0] ||
        err?.response?.data?.errors?.nombre?.[0] ||
        err?.response?.data?.message ||
        "No se pudo crear la cuenta";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="container auth-layout single-column">
        <div className="auth-card auth-card-register">
          <div className="auth-card-header">
            <div className="auth-card-badge">Registro ciudadano</div>
            <h2 className="auth-card-title">Crear cuenta ciudadana</h2>
            <p className="auth-card-text">
              Regístrate para reportar denuncias, consultar seguimiento y participar en el sistema municipal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                className="auth-input"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="auth-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Teléfono</label>
              <input
                type="text"
                name="telefono"
                className="auth-input"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="auth-input"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirmar contraseña</label>
              <input
                type="password"
                name="password_confirmation"
                className="auth-input"
                value={form.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-actions">
              <button className="btn btn-primary-soft auth-main-btn" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>

              <button
                type="button"
                className="btn auth-secondary-btn"
                onClick={() => nav("/login")}
                disabled={loading}
              >
                Volver al login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}