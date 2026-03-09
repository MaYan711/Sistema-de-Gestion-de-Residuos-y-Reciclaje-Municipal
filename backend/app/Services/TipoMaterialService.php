<?php

namespace App\Services;

use App\Models\TipoMaterial;

class TipoMaterialService
{
    public function listar(array $filters = [])
    {
        $query = TipoMaterial::query();

        if (array_key_exists('activo', $filters) && $filters['activo'] !== null && $filters['activo'] !== '') {
            $activo = filter_var($filters['activo'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($activo !== null) {
                $query->where('activo', $activo);
            }
        }

        if (!empty($filters['buscar'])) {
            $buscar = trim($filters['buscar']);
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'ilike', "%{$buscar}%")
                  ->orWhere('descripcion', 'ilike', "%{$buscar}%")
                  ->orWhere('unidad_medida', 'ilike', "%{$buscar}%");
            });
        }

        return $query->orderByDesc('id_tipo')->get();
    }

    public function obtener(int $id): TipoMaterial
    {
        return TipoMaterial::findOrFail($id);
    }

    public function crear(array $data): TipoMaterial
    {
        return TipoMaterial::create([
            'nombre' => trim($data['nombre']),
            'descripcion' => $data['descripcion'] ?? null,
            'unidad_medida' => trim($data['unidad_medida']),
            'activo' => $data['activo'] ?? true,
        ]);
    }

    public function actualizar(int $id, array $data): TipoMaterial
    {
        $tipoMaterial = TipoMaterial::findOrFail($id);

        $tipoMaterial->update([
            'nombre' => trim($data['nombre']),
            'descripcion' => $data['descripcion'] ?? null,
            'unidad_medida' => trim($data['unidad_medida']),
            'activo' => $data['activo'] ?? true,
        ]);

        return $tipoMaterial->fresh();
    }

    public function desactivar(int $id): void
    {
        $tipoMaterial = TipoMaterial::findOrFail($id);
        $tipoMaterial->activo = false;
        $tipoMaterial->save();
    }

    public function reactivar(int $id): void
    {
        $tipoMaterial = TipoMaterial::findOrFail($id);
        $tipoMaterial->activo = true;
        $tipoMaterial->save();
    }
}