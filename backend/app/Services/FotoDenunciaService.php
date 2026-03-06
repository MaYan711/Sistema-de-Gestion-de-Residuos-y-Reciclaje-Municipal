<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class FotoDenunciaService
{
    public function list(int $idDenuncia): array
    {
        return DB::table('foto_denuncia')
            ->select(['id_foto as id', 'id_denuncia', 'ruta', 'tipo', 'fecha'])
            ->where('id_denuncia', $idDenuncia)
            ->orderBy('fecha', 'asc')
            ->get()
            ->toArray();
    }

    public function upload(int $idDenuncia, string $tipo, $file): array
    {
        $path = $file->store('denuncias', 'public');
        $url = Storage::disk('public')->url($path);

        $id = DB::table('foto_denuncia')->insertGetId([
            'id_denuncia' => $idDenuncia,
            'ruta' => $url,
            'tipo' => $tipo,
            'fecha' => now(),
        ], 'id_foto');

        $row = DB::table('foto_denuncia')
            ->select(['id_foto as id', 'id_denuncia', 'ruta', 'tipo', 'fecha'])
            ->where('id_foto', $id)
            ->first();

        return (array)$row;
    }
}