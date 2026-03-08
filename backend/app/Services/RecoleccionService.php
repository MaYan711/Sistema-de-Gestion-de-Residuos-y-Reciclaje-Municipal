<?php

namespace App\Services;

use App\Models\AsignacionRuta;
use App\Models\IncidenciaRuta;
use App\Models\Recoleccion;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecoleccionService
{
    public function listar(array $filters = [])
    {
        $query = Recoleccion::with([
            'asignacion.ruta.zona',
            'asignacion.camion.conductor',
            'incidencias',
        ]);

        if (!empty($filters['estado'])) {
            $query->where('estado', $filters['estado']);
        }

        if (!empty($filters['id_asignacion'])) {
            $query->where('id_asignacion', $filters['id_asignacion']);
        }

        return $query->orderByDesc('id_recoleccion')->get();
    }

    public function obtener(int $id): Recoleccion
    {
        return Recoleccion::with([
            'asignacion.ruta.zona',
            'asignacion.camion.conductor',
            'incidencias',
        ])->findOrFail($id);
    }

    public function crear(array $data): Recoleccion
    {
        return DB::transaction(function () use ($data) {
            $this->validarDatos($data);

            $recoleccion = Recoleccion::create([
                'id_asignacion' => $data['id_asignacion'],
                'estado' => $data['estado'],
                'horario_ini' => $data['hora_inicio'] ?? null,
                'horario_fin' => $data['hora_fin'] ?? null,
                'basura_ton' => $data['peso_real'] ?? null,
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            $this->guardarIncidencias($recoleccion, $data['incidencias'] ?? []);

            return $recoleccion->load([
                'asignacion.ruta.zona',
                'asignacion.camion.conductor',
                'incidencias',
            ]);
        });
    }

    public function actualizar(int $id, array $data): Recoleccion
    {
        return DB::transaction(function () use ($id, $data) {
            $recoleccion = Recoleccion::findOrFail($id);

            $this->validarDatos($data);

            $recoleccion->update([
                'id_asignacion' => $data['id_asignacion'],
                'estado' => $data['estado'],
                'horario_ini' => $data['hora_inicio'] ?? null,
                'horario_fin' => $data['hora_fin'] ?? null,
                'basura_ton' => $data['peso_real'] ?? null,
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            IncidenciaRuta::where('id_recoleccion', $recoleccion->id_recoleccion)->delete();
            $this->guardarIncidencias($recoleccion, $data['incidencias'] ?? []);

            return $recoleccion->fresh()->load([
                'asignacion.ruta.zona',
                'asignacion.camion.conductor',
                'incidencias',
            ]);
        });
    }

    public function eliminar(int $id): void
    {
        $recoleccion = Recoleccion::findOrFail($id);
        IncidenciaRuta::where('id_recoleccion', $recoleccion->id_recoleccion)->delete();
        $recoleccion->delete();
    }

    public function asignacionesDisponibles()
    {
        return AsignacionRuta::with([
            'ruta.zona',
            'camion.conductor',
        ])->orderByDesc('id_asignacion')->get();
    }

    private function validarDatos(array $data): void
    {
        if (!empty($data['hora_inicio']) && !empty($data['hora_fin'])) {
            if (strtotime($data['hora_fin']) < strtotime($data['hora_inicio'])) {
                throw ValidationException::withMessages([
                    'hora_fin' => ['La hora final no puede ser menor que la hora de inicio.'],
                ]);
            }
        }

        if (($data['estado'] ?? null) === 'completada' && empty($data['peso_real'])) {
            throw ValidationException::withMessages([
                'peso_real' => ['Debes ingresar la basura recolectada cuando la recolección está completada.'],
            ]);
        }

        if (($data['estado'] ?? null) === 'en_proceso' && empty($data['hora_inicio'])) {
            throw ValidationException::withMessages([
                'hora_inicio' => ['Debes registrar la hora de inicio cuando la recolección está en proceso.'],
            ]);
        }

        if (in_array(($data['estado'] ?? null), ['completada', 'incompleta']) && empty($data['hora_fin'])) {
            throw ValidationException::withMessages([
                'hora_fin' => ['Debes registrar la hora final cuando la recolección termina.'],
            ]);
        }
    }

    private function guardarIncidencias(Recoleccion $recoleccion, array $incidencias): void
    {
        foreach ($incidencias as $incidencia) {
            IncidenciaRuta::create([
                'id_recoleccion' => $recoleccion->id_recoleccion,
                'tipo' => $incidencia['tipo'],
                'descripcion' => $incidencia['descripcion'],
                'latitud' => $incidencia['latitud'] ?? null,
                'longitud' => $incidencia['longitud'] ?? null,
                'fecha' => $incidencia['fecha_hora'] ?? now(),
            ]);
        }
    }
}