<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DenunciaService
{
    public function list(?string $estado, ?string $q): array
    {
        $qb = DB::table('denuncia as d')
            ->join('ciudadano as c', 'c.id_ciudadano', '=', 'd.id_ciudadano')
            ->leftJoin('zona as z', 'z.id_zona', '=', 'd.id_zona')
            ->leftJoin('cuadrilla_limpieza as cl', 'cl.id_cuadrilla', '=', 'd.id_cuadrilla')
            ->select([
                'd.id_denuncia as id',
                'd.direccion',
                'd.latitud',
                'd.longitud',
                'd.descripcion',
                'd.tamano',
                'd.estado',
                'd.codigo_segui',
                'd.fecha',
                'd.id_zona',
                'd.id_cuadrilla',
                'c.id_ciudadano',
                'c.nombre as ciudadano_nombre',
                'c.telefono as ciudadano_telefono',
                'c.email as ciudadano_email',
                'z.nombre as zona_nombre',
                'cl.nombre as cuadrilla_nombre',
            ])
            ->orderByDesc('d.id_denuncia');

        if ($estado) {
            $qb->where('d.estado', $estado);
        }

        if ($q && trim($q) !== '') {
            $qq = '%' . trim($q) . '%';
            $qb->where(function ($w) use ($qq) {
                $w->where('d.direccion', 'ilike', $qq)
                  ->orWhere('d.descripcion', 'ilike', $qq)
                  ->orWhere('c.nombre', 'ilike', $qq)
                  ->orWhere('d.codigo_segui', 'ilike', $qq);
            });
        }

        return $qb->get()->toArray();
    }

    public function create(array $data, int $userId): array
    {
        $idCiudadano = $this->ensureCiudadanoForUser($userId);

        $codigo = $this->generateCodigoSeguimiento();

        $id = DB::table('denuncia')->insertGetId([
            'id_ciudadano' => $idCiudadano,
            'id_zona' => $data['id_zona'] ?? null,
            'id_cuadrilla' => $data['id_cuadrilla'] ?? null,
            'direccion' => $data['direccion'],
            'latitud' => $data['latitud'] ?? null,
            'longitud' => $data['longitud'] ?? null,
            'descripcion' => $data['descripcion'],
            'tamano' => $data['tamano'],
            'estado' => 'recibida',
            'codigo_segui' => $codigo,
            'fecha' => now(),
        ], 'id_denuncia');

        DB::table('seguimiento_denuncia')->insert([
            'id_denuncia' => $id,
            'id_usuario' => $userId,
            'estado_anterior' => null,
            'estado_nuevo' => 'recibida',
            'observaciones' => null,
            'fecha' => now(),
        ]);

        return $this->findById($id);
    }

    public function update(int $id, array $data): array
    {
        DB::table('denuncia')
            ->where('id_denuncia', $id)
            ->update([
                'id_zona' => $data['id_zona'] ?? null,
                'id_cuadrilla' => $data['id_cuadrilla'] ?? null,
                'direccion' => $data['direccion'],
                'latitud' => $data['latitud'] ?? null,
                'longitud' => $data['longitud'] ?? null,
                'descripcion' => $data['descripcion'],
                'tamano' => $data['tamano'],
            ]);

        return $this->findById($id);
    }

    public function delete(int $id): void
    {
        DB::table('seguimiento_denuncia')->where('id_denuncia', $id)->delete();
        DB::table('foto_denuncia')->where('id_denuncia', $id)->delete();
        DB::table('denuncia')->where('id_denuncia', $id)->delete();
    }

    public function changeEstado(int $id, string $estadoNuevo, int $userId, ?string $observaciones): array
    {
        $actual = DB::table('denuncia')
            ->select(['estado'])
            ->where('id_denuncia', $id)
            ->first();

        $estadoAnterior = $actual?->estado;

        DB::table('denuncia')
            ->where('id_denuncia', $id)
            ->update([
                'estado' => $estadoNuevo
            ]);

        DB::table('seguimiento_denuncia')->insert([
            'id_denuncia' => $id,
            'id_usuario' => $userId,
            'estado_anterior' => $estadoAnterior,
            'estado_nuevo' => $estadoNuevo,
            'observaciones' => $observaciones,
            'fecha' => now(),
        ]);

        $this->notifyEstado($id, $estadoNuevo);

        return $this->findById($id);
    }

    private function findById(int $id): array
    {
        $row = DB::table('denuncia as d')
            ->join('ciudadano as c', 'c.id_ciudadano', '=', 'd.id_ciudadano')
            ->leftJoin('zona as z', 'z.id_zona', '=', 'd.id_zona')
            ->leftJoin('cuadrilla_limpieza as cl', 'cl.id_cuadrilla', '=', 'd.id_cuadrilla')
            ->select([
                'd.id_denuncia as id',
                'd.direccion',
                'd.latitud',
                'd.longitud',
                'd.descripcion',
                'd.tamano',
                'd.estado',
                'd.codigo_segui',
                'd.fecha',
                'd.id_zona',
                'd.id_cuadrilla',
                'c.id_ciudadano',
                'c.nombre as ciudadano_nombre',
                'c.telefono as ciudadano_telefono',
                'c.email as ciudadano_email',
                'z.nombre as zona_nombre',
                'cl.nombre as cuadrilla_nombre',
            ])
            ->where('d.id_denuncia', $id)
            ->first();

        return (array) $row;
    }

    private function ensureCiudadanoForUser(int $userId): int
    {
        $ciudadano = DB::table('ciudadano')
            ->select(['id_ciudadano'])
            ->where('id_usuario', $userId)
            ->first();

        if ($ciudadano) {
            return (int)$ciudadano->id_ciudadano;
        }

        $u = DB::table('usuario')
            ->select(['nombre', 'email', 'telefono'])
            ->where('id_usuario', $userId)
            ->first();

        $id = DB::table('ciudadano')->insertGetId([
            'id_usuario' => $userId,
            'nombre' => $u?->nombre ?? 'Ciudadano',
            'telefono' => $u?->telefono ?? null,
            'email' => $u?->email ?? null,
        ], 'id_ciudadano');

        return (int)$id;
    }

    private function generateCodigoSeguimiento(): string
    {
        return 'DN-' . strtoupper(Str::random(10));
    }

    private function notifyEstado(int $idDenuncia, string $estadoNuevo): void
{
    $row = DB::table('denuncia as d')
        ->join('ciudadano as c', 'c.id_ciudadano', '=', 'd.id_ciudadano')
        ->select(['d.codigo_segui', 'd.direccion', 'c.email', 'c.nombre'])
        ->where('d.id_denuncia', $idDenuncia)
        ->first();

    if (!$row || !$row->email) return;

    $subject = "Actualización de denuncia " . $row->codigo_segui;
    $body = "Hola " . ($row->nombre ?? "Ciudadano") . ".\n\n"
        . "Tu denuncia con código " . $row->codigo_segui . " cambió a estado: " . $estadoNuevo . ".\n"
        . "Dirección: " . $row->direccion . "\n\n"
        . "Gracias.";

    try {
        \Illuminate\Support\Facades\Mail::raw($body, function ($m) use ($row, $subject) {
            $m->to($row->email)->subject($subject);
        });
    } catch (\Throwable $e) {
    }
}
}