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
    <div className="container py-4" style={{ maxWidth: 520 }}>
      <h2 className="mb-3">Crear cuenta ciudadana</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Correo</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                name="telefono"
                className="form-control"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                name="password_confirmation"
                className="form-control"
                value={form.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="col-12">
                <div className="alert alert-danger mb-0">{error}</div>
              </div>
            )}

            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
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