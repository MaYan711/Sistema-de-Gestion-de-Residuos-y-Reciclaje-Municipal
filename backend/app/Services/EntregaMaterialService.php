<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EntregaMaterialService
{
    public function listar(): array
    {
        return DB::table('entrega_material as e')
            ->join('contenedor as c', 'c.id_contenedor', '=', 'e.id_contenedor')
            ->leftJoin('ciudadano as ci', 'ci.id_ciudadano', '=', 'e.id_ciudadano')
            ->join('punto_verde as pv', 'pv.id_punto_verde', '=', 'c.id_punto_verde')
            ->join('tipo_material as tm', 'tm.id_tipo', '=', 'c.id_tipo_material')
            ->select([
                'e.id_entrega',
                'e.id_contenedor',
                'e.id_ciudadano',
                'e.cantidad_kg',
                'e.fecha_entrega',
                'c.codigo as contenedor_codigo',
                'c.nivel_llenado as contenedor_nivel_llenado',
                'c.capacidad_kg as contenedor_capacidad_kg',
                'c.estado as contenedor_estado',
                'pv.nombre as punto_verde_nombre',
                'tm.nombre as tipo_material_nombre',
                'ci.nombre as ciudadano_nombre',
                'ci.email as ciudadano_email',
            ])
            ->orderByDesc('e.id_entrega')
            ->get()
            ->map(fn ($row) => [
                'id_entrega' => $row->id_entrega,
                'id_contenedor' => $row->id_contenedor,
                'id_ciudadano' => $row->id_ciudadano,
                'cantidad_kg' => (float) $row->cantidad_kg,
                'fecha_entrega' => $row->fecha_entrega,
                'contenedor_codigo' => $row->contenedor_codigo,
                'contenedor_nivel_llenado' => (float) $row->contenedor_nivel_llenado,
                'contenedor_capacidad_kg' => (float) $row->contenedor_capacidad_kg,
                'contenedor_estado' => $row->contenedor_estado,
                'punto_verde_nombre' => $row->punto_verde_nombre,
                'tipo_material_nombre' => $row->tipo_material_nombre,
                'ciudadano_nombre' => $row->ciudadano_nombre,
                'ciudadano_email' => $row->ciudadano_email,
                'alerta' => $this->resolverAlerta((float) $row->contenedor_nivel_llenado),
            ])
            ->toArray();
    }

    public function catalogos(): array
    {
        $contenedores = DB::table('contenedor as c')
            ->join('punto_verde as pv', 'pv.id_punto_verde', '=', 'c.id_punto_verde')
            ->join('tipo_material as tm', 'tm.id_tipo', '=', 'c.id_tipo_material')
            ->select([
                'c.id_contenedor',
                'c.codigo',
                'c.capacidad_kg',
                'c.nivel_llenado',
                'c.estado',
                'c.activo',
                'pv.nombre as punto_verde_nombre',
                'tm.nombre as tipo_material_nombre',
            ])
            ->where('c.activo', true)
            ->orderBy('pv.nombre')
            ->orderBy('c.codigo')
            ->get()
            ->map(fn ($row) => [
                'id_contenedor' => $row->id_contenedor,
                'codigo' => $row->codigo,
                'capacidad_kg' => (float) $row->capacidad_kg,
                'nivel_llenado' => (float) $row->nivel_llenado,
                'estado' => $row->estado,
                'activo' => (bool) $row->activo,
                'punto_verde_nombre' => $row->punto_verde_nombre,
                'tipo_material_nombre' => $row->tipo_material_nombre,
                'alerta' => $this->resolverAlerta((float) $row->nivel_llenado),
            ])
            ->toArray();

        $ciudadanos = DB::table('ciudadano')
            ->select([
                'id_ciudadano',
                'nombre',
                'telefono',
                'email',
            ])
            ->orderBy('nombre')
            ->get()
            ->map(fn ($row) => [
                'id_ciudadano' => $row->id_ciudadano,
                'nombre' => $row->nombre,
                'telefono' => $row->telefono,
                'email' => $row->email,
            ])
            ->toArray();

        return [
            'contenedores' => $contenedores,
            'ciudadanos' => $ciudadanos,
        ];
    }

    public function crear(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $contenedor = DB::table('contenedor')
                ->where('id_contenedor', $data['id_contenedor'])
                ->lockForUpdate()
                ->first();

            if (!$contenedor) {
                throw ValidationException::withMessages([
                    'id_contenedor' => 'Contenedor no encontrado'
                ]);
            }

            if (!$contenedor->activo) {
                throw ValidationException::withMessages([
                    'id_contenedor' => 'El contenedor está inactivo'
                ]);
            }

            if ($contenedor->estado === 'en_vaciado') {
                throw ValidationException::withMessages([
                    'id_contenedor' => 'El contenedor está en proceso de vaciado'
                ]);
            }

            if ((float) $contenedor->nivel_llenado >= 100) {
                throw ValidationException::withMessages([
                    'id_contenedor' => 'El contenedor ya está lleno'
                ]);
            }

            $incremento = ((float) $data['cantidad_kg'] / (float) $contenedor->capacidad_kg) * 100;
            $nuevoNivel = min(100, (float) $contenedor->nivel_llenado + $incremento);
            $nuevoEstado = $this->resolverEstadoContenedor($nuevoNivel);
            $alerta = $this->resolverAlerta($nuevoNivel);

            $idEntrega = DB::table('entrega_material')
                ->insertGetId([
                    'id_contenedor' => $data['id_contenedor'],
                    'id_ciudadano' => $data['id_ciudadano'],
                    'cantidad_kg' => $data['cantidad_kg'],
                    'fecha_entrega' => now()
                ], 'id_entrega');

            DB::table('contenedor')
                ->where('id_contenedor', $data['id_contenedor'])
                ->update([
                    'nivel_llenado' => $nuevoNivel,
                    'estado' => $nuevoEstado
                ]);

            $entrega = DB::table('entrega_material as e')
                ->join('contenedor as c', 'c.id_contenedor', '=', 'e.id_contenedor')
                ->leftJoin('ciudadano as ci', 'ci.id_ciudadano', '=', 'e.id_ciudadano')
                ->join('punto_verde as pv', 'pv.id_punto_verde', '=', 'c.id_punto_verde')
                ->join('tipo_material as tm', 'tm.id_tipo', '=', 'c.id_tipo_material')
                ->select([
                    'e.id_entrega',
                    'e.id_contenedor',
                    'e.id_ciudadano',
                    'e.cantidad_kg',
                    'e.fecha_entrega',
                    'c.codigo as contenedor_codigo',
                    'c.nivel_llenado as contenedor_nivel_llenado',
                    'c.capacidad_kg as contenedor_capacidad_kg',
                    'c.estado as contenedor_estado',
                    'pv.nombre as punto_verde_nombre',
                    'tm.nombre as tipo_material_nombre',
                    'ci.nombre as ciudadano_nombre',
                ])
                ->where('e.id_entrega', $idEntrega)
                ->first();

            return [
                'id_entrega' => $entrega->id_entrega,
                'id_contenedor' => $entrega->id_contenedor,
                'id_ciudadano' => $entrega->id_ciudadano,
                'cantidad_kg' => (float) $entrega->cantidad_kg,
                'fecha_entrega' => $entrega->fecha_entrega,
                'ciudadano_nombre' => $entrega->ciudadano_nombre,
                'punto_verde_nombre' => $entrega->punto_verde_nombre,
                'tipo_material_nombre' => $entrega->tipo_material_nombre,
                'contenedor' => [
                    'id_contenedor' => $entrega->id_contenedor,
                    'codigo' => $entrega->contenedor_codigo,
                    'nivel_llenado' => (float) $entrega->contenedor_nivel_llenado,
                    'capacidad_kg' => (float) $entrega->contenedor_capacidad_kg,
                    'estado' => $entrega->contenedor_estado,
                ],
                'alerta' => $alerta,
            ];
        });
    }

    private function resolverEstadoContenedor(float $nivel): string
    {
        if ($nivel >= 100) {
            return 'lleno';
        }

        return 'disponible';
    }

    private function resolverAlerta(float $nivel): ?array
    {
        if ($nivel >= 100) {
            return [
                'nivel' => 'critica',
                'mensaje' => 'Contenedor lleno, requiere atención inmediata'
            ];
        }

        if ($nivel >= 90) {
            return [
                'nivel' => 'urgente',
                'mensaje' => 'Contenedor en nivel urgente de vaciado'
            ];
        }

        if ($nivel >= 75) {
            return [
                'nivel' => 'temprana',
                'mensaje' => 'Contenedor con alerta temprana de llenado'
            ];
        }

        return null;
    }
}