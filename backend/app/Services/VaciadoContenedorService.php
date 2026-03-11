<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VaciadoContenedorService
{
    public function listar(): array
    {
        return DB::table('vaciado_contenedor as v')
            ->join('contenedor as c', 'c.id_contenedor', '=', 'v.id_contenedor')
            ->join('usuario as u', 'u.id_usuario', '=', 'v.id_usuario')
            ->join('punto_verde as pv', 'pv.id_punto_verde', '=', 'c.id_punto_verde')
            ->join('tipo_material as tm', 'tm.id_tipo', '=', 'c.id_tipo_material')
            ->select([
                'v.id_vaciado',
                'v.id_contenedor',
                'v.id_usuario',
                'v.fecha_prog',
                'v.fecha_realizado',
                'v.estado',
                'v.observaciones',
                'c.codigo as contenedor_codigo',
                'c.nivel_llenado as contenedor_nivel_llenado',
                'c.estado as contenedor_estado',
                'u.nombre as usuario_nombre',
                'pv.nombre as punto_verde_nombre',
                'tm.nombre as tipo_material_nombre',
            ])
            ->orderByRaw("
                CASE
                    WHEN v.estado = 'programado' THEN 0
                    WHEN v.estado = 'completado' THEN 1
                    ELSE 2
                END
            ")
            ->orderBy('v.fecha_prog')
            ->orderByDesc('v.id_vaciado')
            ->get()
            ->map(fn ($row) => $this->mapRow($row))
            ->toArray();
    }

    public function programar(array $data): array
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

            $vaciadoPendiente = DB::table('vaciado_contenedor')
                ->where('id_contenedor', $data['id_contenedor'])
                ->where('estado', 'programado')
                ->exists();

            if ($vaciadoPendiente) {
                throw ValidationException::withMessages([
                    'id_contenedor' => 'Ya existe un vaciado programado para este contenedor'
                ]);
            }

            $id = DB::table('vaciado_contenedor')
                ->insertGetId([
                    'id_contenedor' => $data['id_contenedor'],
                    'id_usuario' => $data['id_usuario'],
                    'fecha_prog' => $data['fecha_prog'],
                    'estado' => 'programado',
                    'observaciones' => $data['observaciones'] ?? null
                ], 'id_vaciado');

            DB::table('contenedor')
                ->where('id_contenedor', $data['id_contenedor'])
                ->update([
                    'estado' => 'en_vaciado'
                ]);

            return $this->obtener($id);
        });
    }

    public function completar(int $id): void
    {
        DB::transaction(function () use ($id) {
            $vaciado = DB::table('vaciado_contenedor')
                ->where('id_vaciado', $id)
                ->lockForUpdate()
                ->first();

            if (!$vaciado) {
                abort(404, 'Vaciado no encontrado');
            }

            if ($vaciado->estado === 'completado') {
                throw ValidationException::withMessages([
                    'id_vaciado' => 'El vaciado ya fue completado'
                ]);
            }

            DB::table('vaciado_contenedor')
                ->where('id_vaciado', $id)
                ->update([
                    'estado' => 'completado',
                    'fecha_realizado' => now()->toDateString()
                ]);

            DB::table('contenedor')
                ->where('id_contenedor', $vaciado->id_contenedor)
                ->update([
                    'nivel_llenado' => 0,
                    'estado' => 'disponible',
                    'ultimo_vaciado' => now()
                ]);
        });
    }

    private function obtener(int $id): array
    {
        $row = DB::table('vaciado_contenedor as v')
            ->join('contenedor as c', 'c.id_contenedor', '=', 'v.id_contenedor')
            ->join('usuario as u', 'u.id_usuario', '=', 'v.id_usuario')
            ->join('punto_verde as pv', 'pv.id_punto_verde', '=', 'c.id_punto_verde')
            ->join('tipo_material as tm', 'tm.id_tipo', '=', 'c.id_tipo_material')
            ->select([
                'v.id_vaciado',
                'v.id_contenedor',
                'v.id_usuario',
                'v.fecha_prog',
                'v.fecha_realizado',
                'v.estado',
                'v.observaciones',
                'c.codigo as contenedor_codigo',
                'c.nivel_llenado as contenedor_nivel_llenado',
                'c.estado as contenedor_estado',
                'u.nombre as usuario_nombre',
                'pv.nombre as punto_verde_nombre',
                'tm.nombre as tipo_material_nombre',
            ])
            ->where('v.id_vaciado', $id)
            ->first();

        if (!$row) {
            abort(404, 'Vaciado no encontrado');
        }

        return $this->mapRow($row);
    }

    private function mapRow(object $row): array
    {
        return [
            'id_vaciado' => $row->id_vaciado,
            'id_contenedor' => $row->id_contenedor,
            'id_usuario' => $row->id_usuario,
            'fecha_prog' => $row->fecha_prog,
            'fecha_realizado' => $row->fecha_realizado,
            'estado' => $row->estado,
            'observaciones' => $row->observaciones,
            'contenedor_codigo' => $row->contenedor_codigo,
            'contenedor_nivel_llenado' => (float) $row->contenedor_nivel_llenado,
            'contenedor_estado' => $row->contenedor_estado,
            'usuario_nombre' => $row->usuario_nombre,
            'punto_verde_nombre' => $row->punto_verde_nombre,
            'tipo_material_nombre' => $row->tipo_material_nombre,
        ];
    }
}