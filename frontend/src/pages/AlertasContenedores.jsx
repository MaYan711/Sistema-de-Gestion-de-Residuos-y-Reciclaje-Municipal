import { useEffect, useState } from "react";
import NotificacionesContenedorTable from "../components/notificaciones/NotificacionesContenedorTable";
import {
  getNotificacionesContenedores,
  marcarNotificacionLeida,
} from "../api/notificaciones.service";

function AlertasContenedores() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarNotificaciones = async () => {
    setLoading(true);
    try {
      const data = await getNotificacionesContenedores();
      setNotificaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar las alertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const handleMarcarLeida = async (id) => {
    try {
      await marcarNotificacionLeida(id);
      await cargarNotificaciones();
    } catch (error) {
      console.error(error);
      alert("No se pudo marcar la notificación como leída");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Alertas de contenedores</h2>
          <p className="text-muted mb-0">
            Monitoreo automático de contenedores por porcentaje de llenado
          </p>
        </div>
      </div>

      <NotificacionesContenedorTable
        notificaciones={notificaciones}
        onMarcarLeida={handleMarcarLeida}
        loading={loading}
      />
    </div>
  );
}

export default AlertasContenedores;