<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ReportesRecoleccionService
{
    public function recoleccionPorDia(): array
    {
        return DB::table('recoleccion as r')
            ->join('asignacion_ruta as ar', 'ar.id_asignacion', '=', 'r.id_asignacion')
            ->select(
                'ar.fecha_asig as fecha',
                DB::raw('SUM(r.basura_ton) as total_ton')
            )
            ->groupBy('ar.fecha_asig')
            ->orderBy('ar.fecha_asig')
            ->get()
            ->map(fn ($row) => [
                'fecha' => $row->fecha,
                'total_ton' => (float) $row->total_ton
            ])
            ->toArray();
    }

    public function recoleccionPorRuta(): array
    {
        return DB::table('recoleccion as r')
            ->join('asignacion_ruta as ar', 'ar.id_asignacion', '=', 'r.id_asignacion')
            ->join('ruta as ru', 'ru.id_ruta', '=', 'ar.id_ruta')
            ->select(
                'ru.nombre as ruta',
                DB::raw('SUM(r.basura_ton) as total_ton')
            )
            ->groupBy('ru.nombre')
            ->orderByDesc('total_ton')
            ->get()
            ->map(fn ($row) => [
                'ruta' => $row->ruta,
                'total_ton' => (float) $row->total_ton
            ])
            ->toArray();
    }

    public function recoleccionPorZona(): array
    {
        return DB::table('recoleccion as r')
            ->join('asignacion_ruta as ar', 'ar.id_asignacion', '=', 'r.id_asignacion')
            ->join('ruta as ru', 'ru.id_ruta', '=', 'ar.id_ruta')
            ->join('zona as z', 'z.id_zona', '=', 'ru.id_zona')
            ->select(
                'z.nombre as zona',
                DB::raw('SUM(r.basura_ton) as total_ton')
            )
            ->groupBy('z.nombre')
            ->orderByDesc('total_ton')
            ->get()
            ->map(fn ($row) => [
                'zona' => $row->zona,
                'total_ton' => (float) $row->total_ton
            ])
            ->toArray();
    }
}