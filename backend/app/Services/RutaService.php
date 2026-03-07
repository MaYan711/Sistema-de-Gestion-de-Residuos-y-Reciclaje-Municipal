<?php

namespace App\Services;

use App\Models\Ruta;

class RutaService
{
    public function listar(array $filters = [])
    {
        $query = Ruta::with('zona');

        if (array_key_exists('activo', $filters) && $filters['activo'] !== null && $filters['activo'] !== '') {
            $activo = filter_var($filters['activo'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($activo !== null) {
                $query->where('activo', $activo);
            }
        }

        if (!empty($filters['id_zona'])) {
            $query->where('id_zona', $filters['id_zona']);
        }

        if (!empty($filters['tipo_residuo'])) {
            $query->where('tipo_residuo', $filters['tipo_residuo']);
        }

        if (!empty($filters['buscar'])) {
            $buscar = trim($filters['buscar']);
            $query->where('nombre', 'ilike', "%{$buscar}%");
        }

        return $query->orderByDesc('id_ruta')->get();
    }

    public function obtener(int $id): Ruta
    {
        return Ruta::with('zona')->findOrFail($id);
    }

    public function crear(array $data): Ruta
    {
        return Ruta::create([
            'id_zona' => $data['id_zona'],
            'nombre' => $data['nombre'],
            'coor_ini' => $data['coor_ini'],
            'coor_fin' => $data['coor_fin'],
            'puntos_inter' => $data['puntos_inter'] ?? [],
            'distancia' => $data['distancia'],
            'dias_recole' => $data['dias_recole'],
            'horario' => $data['horario'],
            'tipo_residuo' => $data['tipo_residuo'],
            'activo' => $data['activo'] ?? true,
        ]);
    }

    public function actualizar(int $id, array $data): Ruta
    {
        $ruta = Ruta::findOrFail($id);

        $ruta->update([
            'id_zona' => $data['id_zona'],
            'nombre' => $data['nombre'],
            'coor_ini' => $data['coor_ini'],
            'coor_fin' => $data['coor_fin'],
            'puntos_inter' => $data['puntos_inter'] ?? [],
            'distancia' => $data['distancia'],
            'dias_recole' => $data['dias_recole'],
            'horario' => $data['horario'],
            'tipo_residuo' => $data['tipo_residuo'],
            'activo' => $data['activo'] ?? true,
        ]);

        return $ruta->fresh(['zona']);
    }

    public function desactivar(int $id): void
    {
        $ruta = Ruta::findOrFail($id);
        $ruta->activo = false;
        $ruta->save();
    }

    public function reactivar(int $id): void
    {
        $ruta = Ruta::findOrFail($id);
        $ruta->activo = true;
        $ruta->save();
    }
}