import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  createEntregaMaterial,
  getEntregaCatalogos,
  getEntregasMaterial,
} from "../api/entrega-material.service";
import {
  completarVaciado,
  getVaciados,
  programarVaciado,
} from "../api/vaciados.service";
import EntregaMaterialForm from "../components/entregas/EntregaMaterialForm";
import EntregaMaterialTable from "../components/entregas/EntregaMaterialTable";
import VaciadoProgramarForm from "../components/vaciados/VaciadoProgramarForm";
import VaciadoTable from "../components/vaciados/VaciadoTable";

function OperacionReciclaje() {
  const { user } = useAuth();

  const [contenedores, setContenedores] = useState([]);
  const [ciudadanos, setCiudadanos] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [vaciados, setVaciados] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarTodo = async () => {
    setLoading(true);
    try {
      const [catalogos, entregasData, vaciadosData] = await Promise.all([
        getEntregaCatalogos(),
        getEntregasMaterial(),
        getVaciados(),
      ]);

      setContenedores(Array.isArray(catalogos?.contenedores) ? catalogos.contenedores : []);
      setCiudadanos(Array.isArray(catalogos?.ciudadanos) ? catalogos.ciudadanos : []);
      setEntregas(Array.isArray(entregasData) ? entregasData : []);
      setVaciados(Array.isArray(vaciadosData) ? vaciadosData : []);
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar la información del módulo 2");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const alertas = useMemo(() => {
    const tempranas = contenedores.filter(
      (c) => Number(c.nivel_llenado) >= 75 && Number(c.nivel_llenado) < 90
    );
    const urgentes = contenedores.filter(
      (c) => Number(c.nivel_llenado) >= 90 && Number(c.nivel_llenado) < 100
    );
    const llenos = contenedores.filter(
      (c) => Number(c.nivel_llenado) >= 100
    );

    return { tempranas, urgentes, llenos };
  }, [contenedores]);

  const contenedoresParaVaciado = useMemo(() => {
    return contenedores.filter((c) => Number(c.nivel_llenado) >= 75);
  }, [contenedores]);

  const handleRegistrarEntrega = async (payload) => {
    setLoading(true);
    try {
      const response = await createEntregaMaterial(payload);
      const alerta = response?.data?.alerta?.mensaje;

      await cargarTodo();

      if (alerta) {
        alert(`Entrega registrada correctamente. ${alerta}`);
      } else {
        alert("Entrega registrada correctamente");
      }
    } catch (error) {
      console.error(error);
      const mensaje =
        error?.response?.data?.errors?.id_contenedor?.[0] ||
        error?.response?.data?.errors?.cantidad_kg?.[0] ||
        error?.response?.data?.message ||
        "No se pudo registrar la entrega";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleProgramarVaciado = async (payload) => {
    setLoading(true);
    try {
      await programarVaciado(payload);
      await cargarTodo();
      alert("Vaciado programado correctamente");
    } catch (error) {
      console.error(error);
      const mensaje =
        error?.response?.data?.errors?.id_contenedor?.[0] ||
        error?.response?.data?.errors?.fecha_prog?.[0] ||
        error?.response?.data?.message ||
        "No se pudo programar el vaciado";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletarVaciado = async (id) => {
    const confirmado = window.confirm("¿Deseas completar este vaciado?");
    if (!confirmado) return;

    setLoading(true);
    try {
      await completarVaciado(id);
      await cargarTodo();
      alert("Vaciado completado correctamente");
    } catch (error) {
      console.error(error);
      const mensaje =
        error?.response?.data?.errors?.id_vaciado?.[0] ||
        error?.response?.data?.message ||
        "No se pudo completar el vaciado";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Operación de reciclaje</h2>
        <p className="text-muted mb-0">
          Registro de entregas, alertas de llenado y control de vaciados
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-warning shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-warning">Alertas tempranas</h6>
              <h3>{alertas.tempranas.length}</h3>
              <div>Contenedores entre 75% y 89.99%</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-danger shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-danger">Alertas urgentes</h6>
              <h3>{alertas.urgentes.length}</h3>
              <div>Contenedores entre 90% y 99.99%</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-dark shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-dark">Contenedores llenos</h6>
              <h3>{alertas.llenos.length}</h3>
              <div>Contenedores al 100%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <EntregaMaterialForm
            contenedores={contenedores}
            ciudadanos={ciudadanos}
            onSubmit={handleRegistrarEntrega}
            loading={loading}
          />
        </div>

        <div className="col-lg-6">
          <VaciadoProgramarForm
            contenedores={contenedoresParaVaciado}
            usuario={user}
            onSubmit={handleProgramarVaciado}
            loading={loading}
          />
        </div>
      </div>

      <EntregaMaterialTable entregas={entregas} />

      <VaciadoTable
        vaciados={vaciados}
        onCompletar={handleCompletarVaciado}
        loading={loading}
      />
    </div>
  );
}

export default OperacionReciclaje;