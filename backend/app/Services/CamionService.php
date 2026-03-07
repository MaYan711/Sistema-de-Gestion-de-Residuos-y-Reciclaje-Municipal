<?php

namespace App\Services;

use App\Models\Camion;
use App\Models\Usuario;

class CamionService
{
    public function listar(array $filters = [])
    {
        $query = Camion::with('conductor');

        if (!empty($filters['buscar'])) {
            $buscar = trim($filters['buscar']);

            $query->where(function ($q) use ($buscar) {
                $q->where('placa', 'ilike', "%{$buscar}%")
                    ->orWhere('marca', 'ilike', "%{$buscar}%")
                    ->orWhere('modelo', 'ilike', "%{$buscar}%");
            });
        }

        if (!empty($filters['estado'])) {
            $query->where('estado', $filters['estado']);
        }

        return $query->orderByDesc('id_camion')->get();
    }

    public function obtener(int $id): Camion
    {
        return Camion::with('conductor')->findOrFail($id);
    }

    public function crear(array $data): Camion
    {
        return Camion::create([
            'id_conductor' => $data['id_conductor'] ?? null,
            'placa' => strtoupper(trim($data['placa'])),
            'capacidad' => $data['capacidad'],
            'estado' => $data['estado'],
            'marca' => $data['marca'] ?? null,
            'modelo' => $data['modelo'] ?? null,
            'anio' => $data['anio'] ?? null,
        ])->load('conductor');
    }

    public function actualizar(int $id, array $data): Camion
    {
        $camion = Camion::findOrFail($id);

        $camion->update([
            'id_conductor' => $data['id_conductor'] ?? null,
            'placa' => strtoupper(trim($data['placa'])),
            'capacidad' => $data['capacidad'],
            'estado' => $data['estado'],
            'marca' => $data['marca'] ?? null,
            'modelo' => $data['modelo'] ?? null,
            'anio' => $data['anio'] ?? null,
        ]);

        return $camion->fresh()->load('conductor');
    }

    public function eliminar(int $id): Camion
{
    $camion = Camion::findOrFail($id);

    $camion->estado = 'fuera_servicio';
    $camion->save();

    return $camion->fresh()->load('conductor');
}

    public function listarConductores()
    {
        return Usuario::query()
            ->where('activo', true)
            ->orderBy('nombre')
            ->get(['id_usuario', 'nombre', 'email']);
    }
}