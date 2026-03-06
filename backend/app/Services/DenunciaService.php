<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

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

    $items = $qb->get()->map(function ($row) {
        $ultimaAsignacion = DB::table('seguimiento_denuncia')
            ->select(['observaciones'])
            ->where('id_denuncia', $row->id)
            ->where('estado_nuevo', 'asignada')
            ->orderByDesc('id_seguimiento')
            ->first();

        $fechaProgramada = null;
        $recursos = null;

        if ($ultimaAsignacion && $ultimaAsignacion->observaciones) {
            $obs = json_decode($ultimaAsignacion->observaciones, true);
            if (is_array($obs)) {
                $fechaProgramada = $obs['fecha_programada'] ?? null;
                $recursos = $obs['recursos'] ?? null;
            }
        }

        return [
            'id' => $row->id,
            'direccion' => $row->direccion,
            'latitud' => $row->latitud,
            'longitud' => $row->longitud,
            'descripcion' => $row->descripcion,
            'tamano' => $row->tamano,
            'estado' => $row->estado,
            'codigo_segui' => $row->codigo_segui,
            'fecha' => $row->fecha,
            'id_zona' => $row->id_zona,
            'id_cuadrilla' => $row->id_cuadrilla,
            'id_ciudadano' => $row->id_ciudadano,
            'ciudadano_nombre' => $row->ciudadano_nombre,
            'ciudadano_telefono' => $row->ciudadano_telefono,
            'ciudadano_email' => $row->ciudadano_email,
            'zona_nombre' => $row->zona_nombre,
            'cuadrilla_nombre' => $row->cuadrilla_nombre,
            'fecha_programada' => $fechaProgramada,
            'recursos' => $recursos,
        ];
    });

    return $items->toArray();
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

        $denuncia = $this->findById($id);
            $this->sendEstadoEmail($denuncia, $estadoNuevo);

            return $denuncia;
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

    $ultimaAsignacion = DB::table('seguimiento_denuncia')
        ->select(['observaciones'])
        ->where('id_denuncia', $id)
        ->where('estado_nuevo', 'asignada')
        ->orderByDesc('id_seguimiento')
        ->first();

    $fechaProgramada = null;
    $recursos = null;

    if ($ultimaAsignacion && $ultimaAsignacion->observaciones) {
        $obs = json_decode($ultimaAsignacion->observaciones, true);
        if (is_array($obs)) {
            $fechaProgramada = $obs['fecha_programada'] ?? null;
            $recursos = $obs['recursos'] ?? null;
        }
    }

    return [
        'id' => $row->id,
        'direccion' => $row->direccion,
        'latitud' => $row->latitud,
        'longitud' => $row->longitud,
        'descripcion' => $row->descripcion,
        'tamano' => $row->tamano,
        'estado' => $row->estado,
        'codigo_segui' => $row->codigo_segui,
        'fecha' => $row->fecha,
        'id_zona' => $row->id_zona,
        'id_cuadrilla' => $row->id_cuadrilla,
        'id_ciudadano' => $row->id_ciudadano,
        'ciudadano_nombre' => $row->ciudadano_nombre,
        'ciudadano_telefono' => $row->ciudadano_telefono,
        'ciudadano_email' => $row->ciudadano_email,
        'zona_nombre' => $row->zona_nombre,
        'cuadrilla_nombre' => $row->cuadrilla_nombre,
        'fecha_programada' => $fechaProgramada,
        'recursos' => $recursos,
    ];
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

public function assign(int $idDenuncia, int $idCuadrilla, string $fechaProgramada, int $userId, ?string $recursos): array
{
    $actual = DB::table('denuncia')
        ->select(['estado'])
        ->where('id_denuncia', $idDenuncia)
        ->first();

    $estadoAnterior = $actual?->estado;

    DB::table('denuncia')
        ->where('id_denuncia', $idDenuncia)
        ->update([
            'id_cuadrilla' => $idCuadrilla,
            'estado' => 'asignada',
        ]);

    $observaciones = json_encode([
        'fecha_programada' => $fechaProgramada,
        'recursos' => $recursos,
    ], JSON_UNESCAPED_UNICODE);

    DB::table('seguimiento_denuncia')->insert([
        'id_denuncia' => $idDenuncia,
        'id_usuario' => $userId,
        'estado_anterior' => $estadoAnterior,
        'estado_nuevo' => 'asignada',
        'observaciones' => $observaciones,
        'fecha' => now(),
    ]);

    $denuncia = $this->findById($idDenuncia);
    $this->sendEstadoEmail($denuncia, 'asignada');

    return $denuncia;
}

public function getSeguimientoPublico(string $codigo): array
{
    $denuncia = DB::table('denuncia as d')
        ->join('ciudadano as c', 'c.id_ciudadano', '=', 'd.id_ciudadano')
        ->leftJoin('zona as z', 'z.id_zona', '=', 'd.id_zona')
        ->leftJoin('cuadrilla_limpieza as cl', 'cl.id_cuadrilla', '=', 'd.id_cuadrilla')
        ->select([
            'd.id_denuncia as id',
            'd.codigo_segui',
            'd.direccion',
            'd.descripcion',
            'd.tamano',
            'd.estado',
            'd.fecha',
            'd.latitud',
            'd.longitud',
            'c.nombre as ciudadano_nombre',
            'c.telefono as ciudadano_telefono',
            'c.email as ciudadano_email',
            'z.nombre as zona_nombre',
            'cl.nombre as cuadrilla_nombre',
        ])
        ->where('d.codigo_segui', $codigo)
        ->first();

    if (!$denuncia) {
        abort(404, 'Código de seguimiento no encontrado');
    }

    $historial = DB::table('seguimiento_denuncia as s')
        ->leftJoin('usuario as u', 'u.id_usuario', '=', 's.id_usuario')
        ->select([
            's.id_seguimiento',
            's.estado_anterior',
            's.estado_nuevo',
            's.observaciones',
            's.fecha',
            'u.nombre as usuario_nombre',
        ])
        ->where('s.id_denuncia', $denuncia->id)
        ->orderBy('s.fecha')
        ->get()
        ->map(function ($row) {
            $obs = $row->observaciones;
            $decoded = null;

            if ($obs) {
                $decoded = json_decode($obs, true);
            }

            return [
                'id_seguimiento' => $row->id_seguimiento,
                'estado_anterior' => $row->estado_anterior,
                'estado_nuevo' => $row->estado_nuevo,
                'observaciones' => $row->observaciones,
                'observaciones_json' => $decoded,
                'fecha' => $row->fecha,
                'usuario_nombre' => $row->usuario_nombre,
            ];
        })
        ->toArray();

    return [
        'denuncia' => (array) $denuncia,
        'historial' => $historial,
    ];
}

private function sendEstadoEmail(array $denuncia, string $estadoNuevo): void
{
    $email = $denuncia['ciudadano_email'] ?? null;
    if (!$email) {
        return;
    }

    $codigo = $denuncia['codigo_segui'] ?? '';
    $direccion = $denuncia['direccion'] ?? '';

    $mensaje = "Tu denuncia con código {$codigo} cambió al estado {$estadoNuevo}. Dirección: {$direccion}.";

    Mail::raw($mensaje, function ($mail) use ($email, $codigo, $estadoNuevo) {
        $mail->to($email)
            ->subject("Actualización de denuncia {$codigo}: {$estadoNuevo}");
    });
}
}