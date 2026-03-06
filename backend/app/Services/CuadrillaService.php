<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class CuadrillaService
{
    public function list(): array
    {
        return DB::table('cuadrilla_limpieza')
            ->select([
                'id_cuadrilla as id',
                'nombre'
            ])
            ->orderBy('id_cuadrilla')
            ->get()
            ->toArray();
    }
}