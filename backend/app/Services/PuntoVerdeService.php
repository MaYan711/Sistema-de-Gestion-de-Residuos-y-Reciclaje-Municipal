<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class PuntoVerdeService
{
    public function list(): array
    {
        return DB::table('punto_verde')
            ->select([
                'id_punto_verde as id',
                'id_encargado',
                'nombre',
                'direccion',
                'latitud',
                'longitud',
                'capacidad',
                'horario',
                'activo'
            ])
            ->orderBy('id_punto_verde')
            ->get()
            ->toArray();
    }

    public function create(array $data): array
    {
        $idEncargado = $data['id_encargado'] ?? null;
        if ($idEncargado === null) {
            throw new \InvalidArgumentException('id_encargado requerido');
        }

        $id = DB::table('punto_verde')->insertGetId([
            'id_encargado' => $idEncargado,
            'nombre' => $data['nombre'],
            'direccion' => $data['direccion'],
            'latitud' => $data['latitud'],
            'longitud' => $data['longitud'],
            'capacidad' => $data['capacidad'] ?? 0,
            'horario' => $data['horario'] ?? null,
            'activo' => $data['activo'] ?? true,
        ], 'id_punto_verde');

        return $this->findById($id);
    }

    public function update(int $id, array $data): array
    {
        $update = [
            'nombre' => $data['nombre'],
            'direccion' => $data['direccion'],
            'latitud' => $data['latitud'],
            'longitud' => $data['longitud'],
            'capacidad' => $data['capacidad'] ?? 0,
            'horario' => $data['horario'] ?? null,
            'activo' => $data['activo'] ?? true,
        ];

        if (isset($data['id_encargado']) && $data['id_encargado'] !== null) {
            $update['id_encargado'] = $data['id_encargado'];
        }

        DB::table('punto_verde')
            ->where('id_punto_verde', $id)
            ->update($update);

        return $this->findById($id);
    }

    private function findById(int $id): array
    {
        $row = DB::table('punto_verde')
            ->select([
                'id_punto_verde as id',
                'id_encargado',
                'nombre',
                'direccion',
                'latitud',
                'longitud',
                'capacidad',
                'horario',
                'activo'
            ])
            ->where('id_punto_verde', $id)
            ->first();

        return (array) $row;
    }

    public function delete(int $id): void
{
    DB::table('punto_verde')
        ->where('id_punto_verde', $id)
        ->delete();
}

public function deactivate(int $id): void
{
    DB::table('punto_verde')
        ->where('id_punto_verde', $id)
        ->update(['activo' => false]);
}
}