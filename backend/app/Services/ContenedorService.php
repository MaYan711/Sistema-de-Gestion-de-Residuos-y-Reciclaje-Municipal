<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ContenedorService
{
    public function listar(array $filters = []): array
    {
        $query = DB::table('contenedor as c')
            ->join('punto_verde as pv', 'pv.id_punto_verde', '=', 'c.id_punto_verde')
            ->join('tipo_material as tm', 'tm.id_tipo', '=', 'c.id_tipo_material')
            ->select([
                'c.id_contenedor',
                'c.id_punto_verde',
                'c.id_tipo_material',
                'c.capacidad_kg',
                'c.nivel_llenado',
                'c.estado',
                'c.ultimo_vaciado',
                'c.codigo',
                'c.activo',
                'pv.nombre as punto_verde_nombre',
                'tm.nombre as tipo_material_nombre',
                'tm.unidad_medida as tipo_material_unidad_medida',
            ]);

        if (array_key_exists('activo', $filters) && $filters['activo'] !== null && $filters['activo'] !== '') {
            $activo = filter_var($filters['activo'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($activo !== null) {
                $query->where('c.activo', $activo);
            }
        }

        if (!empty($filters['buscar'])) {
            $buscar = trim($filters['buscar']);
            $query->where('c.codigo', 'ilike', "%{$buscar}%");
        }

        if (!empty($filters['id_punto_verde'])) {
            $query->where('c.id_punto_verde', $filters['id_punto_verde']);
        }

        if (!empty($filters['id_tipo_material'])) {
            $query->where('c.id_tipo_material', $filters['id_tipo_material']);
        }

        if (!empty($filters['estado'])) {
            $query->where('c.estado', $filters['estado']);
        }

        return $query
            ->orderByDesc('c.id_contenedor')
            ->get()
            ->map(fn ($row) => $this->mapRow($row))
            ->toArray();
    }

    public function obtener(int $id): array
    {
        $row = DB::table('contenedor as c')
            ->join('punto_verde as pv', 'pv.id_punto_verde', '=', 'c.id_punto_verde')
            ->join('tipo_material as tm', 'tm.id_tipo', '=', 'c.id_tipo_material')
            ->select([
                'c.id_contenedor',
                'c.id_punto_verde',
                'c.id_tipo_material',
                'c.capacidad_kg',
                'c.nivel_llenado',
                'c.estado',
                'c.ultimo_vaciado',
                'c.codigo',
                'c.activo',
                'pv.nombre as punto_verde_nombre',
                'tm.nombre as tipo_material_nombre',
                'tm.unidad_medida as tipo_material_unidad_medida',
            ])
            ->where('c.id_contenedor', $id)
            ->first();

        if (!$row) {
            abort(404, 'Contenedor no encontrado');
        }

        return $this->mapRow($row);
    }

    public function crear(array $data): array
    {
        $this->validarNivel($data['nivel_llenado'], $data['capacidad_kg']);

        $id = DB::table('contenedor')->insertGetId([
            'id_punto_verde' => $data['id_punto_verde'],
            'id_tipo_material' => $data['id_tipo_material'],
            'capacidad_kg' => $data['capacidad_kg'],
            'nivel_llenado' => $data['nivel_llenado'],
            'estado' => $data['estado'],
            'ultimo_vaciado' => $data['ultimo_vaciado'] ?? null,
            'codigo' => trim($data['codigo']),
            'activo' => $data['activo'] ?? true,
        ], 'id_contenedor');

        return $this->obtener($id);
    }

    public function actualizar(int $id, array $data): array
    {
        $this->validarNivel($data['nivel_llenado'], $data['capacidad_kg']);

        DB::table('contenedor')
            ->where('id_contenedor', $id)
            ->update([
                'id_punto_verde' => $data['id_punto_verde'],
                'id_tipo_material' => $data['id_tipo_material'],
                'capacidad_kg' => $data['capacidad_kg'],
                'nivel_llenado' => $data['nivel_llenado'],
                'estado' => $data['estado'],
                'ultimo_vaciado' => $data['ultimo_vaciado'] ?? null,
                'codigo' => trim($data['codigo']),
                'activo' => $data['activo'] ?? true,
            ]);

        return $this->obtener($id);
    }

    public function desactivar(int $id): void
    {
        DB::table('contenedor')
            ->where('id_contenedor', $id)
            ->update(['activo' => false]);
    }

    public function reactivar(int $id): void
    {
        DB::table('contenedor')
            ->where('id_contenedor', $id)
            ->update(['activo' => true]);
    }

    private function validarNivel(float $nivel, float $capacidad): void
    {
        if ($nivel < 0) {
            throw ValidationException::withMessages([
                'nivel_llenado' => 'El nivel de llenado no puede ser negativo.',
            ]);
        }

        if ($nivel > 100) {
            throw ValidationException::withMessages([
                'nivel_llenado' => 'El nivel de llenado no puede ser mayor que 100.',
            ]);
        }

        if ($capacidad <= 0) {
            throw ValidationException::withMessages([
                'capacidad_kg' => 'La capacidad debe ser mayor que 0.',
            ]);
        }
    }

    private function mapRow(object $row): array
    {
        return [
            'id_contenedor' => $row->id_contenedor,
            'id_punto_verde' => $row->id_punto_verde,
            'id_tipo_material' => $row->id_tipo_material,
            'capacidad_kg' => (float) $row->capacidad_kg,
            'nivel_llenado' => (float) $row->nivel_llenado,
            'estado' => $row->estado,
            'ultimo_vaciado' => $row->ultimo_vaciado,
            'codigo' => $row->codigo,
            'activo' => (bool) $row->activo,
            'punto_verde' => [
                'id_punto_verde' => $row->id_punto_verde,
                'nombre' => $row->punto_verde_nombre,
            ],
            'tipo_material' => [
                'id_tipo' => $row->id_tipo_material,
                'nombre' => $row->tipo_material_nombre,
                'unidad_medida' => $row->tipo_material_unidad_medida,
            ],
        ];
    }
}