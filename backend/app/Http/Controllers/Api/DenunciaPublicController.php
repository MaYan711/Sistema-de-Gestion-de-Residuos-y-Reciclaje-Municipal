<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DenunciaService;

class DenunciaPublicController extends Controller
{
    public function __construct(
        private DenunciaService $service
    ) {}

    public function byCodigo(string $codigo)
    {
        $data = $this->service->getPublicByCodigo($codigo);

        if (!$data) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        return response()->json(['data' => $data]);
    }

    public function getPublicByCodigo(string $codigo): ?array
{
    $d = DB::table('denuncia as d')
        ->join('ciudadano as c', 'c.id_ciudadano', '=', 'd.id_ciudadano')
        ->leftJoin('zona as z', 'z.id_zona', '=', 'd.id_zona')
        ->leftJoin('cuadrilla_limpieza as cl', 'cl.id_cuadrilla', '=', 'd.id_cuadrilla')
        ->select([
            'd.id_denuncia as id',
            'd.codigo_segui',
            'd.estado',
            'd.fecha',
            'd.direccion',
            'd.latitud',
            'd.longitud',
            'd.descripcion',
            'd.tamano',
            'z.nombre as zona_nombre',
            'cl.nombre as cuadrilla_nombre',
            'c.nombre as denunciante_nombre',
            'c.telefono as denunciante_telefono',
            'c.email as denunciante_email',
        ])
        ->where('d.codigo_segui', $codigo)
        ->first();

    if (!$d) return null;

    $hist = DB::table('seguimiento_denuncia as s')
        ->join('usuario as u', 'u.id_usuario', '=', 's.id_usuario')
        ->select([
            's.estado_anterior',
            's.estado_nuevo',
            's.observaciones',
            's.fecha',
            'u.nombre as usuario_nombre',
        ])
        ->where('s.id_denuncia', $d->id)
        ->orderBy('s.fecha', 'asc')
        ->get()
        ->toArray();

    $fotos = DB::table('foto_denuncia')
        ->select(['id_foto as id', 'ruta', 'tipo', 'fecha'])
        ->where('id_denuncia', $d->id)
        ->orderBy('fecha', 'asc')
        ->get()
        ->toArray();

    return [
        'denuncia' => (array)$d,
        'historial' => $hist,
        'fotos' => $fotos,
    ];
}
}