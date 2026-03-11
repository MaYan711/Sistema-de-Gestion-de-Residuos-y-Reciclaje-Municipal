<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ReportesReciclajeService
{
    public function reciclajePorTipo(): array
    {
        return DB::table('entrega_material as e')
            ->join('contenedor as c', 'c.id_contenedor', '=', 'e.id_contenedor')
            ->join('tipo_material as tm', 'tm.id_tipo', '=', 'c.id_tipo_material')
            ->select(
                'tm.nombre as tipo_material',
                DB::raw('SUM(e.cantidad_kg) as total_kg')
            )
            ->groupBy('tm.nombre')
            ->orderByDesc('total_kg')
            ->get()
            ->map(fn ($row) => [
                'tipo_material' => $row->tipo_material,
                'total_kg' => (float) $row->total_kg
            ])
            ->toArray();
    }

    public function puntosVerdesMasActivos(): array
    {
        return DB::table('entrega_material as e')
            ->join('contenedor as c', 'c.id_contenedor', '=', 'e.id_contenedor')
            ->join('punto_verde as pv', 'pv.id_punto_verde', '=', 'c.id_punto_verde')
            ->select(
                'pv.nombre as punto_verde',
                DB::raw('SUM(e.cantidad_kg) as total_reciclado')
            )
            ->groupBy('pv.nombre')
            ->orderByDesc('total_reciclado')
            ->get()
            ->map(fn ($row) => [
                'punto_verde' => $row->punto_verde,
                'total_reciclado' => (float) $row->total_reciclado
            ])
            ->toArray();
    }

    public function tendenciaReciclaje(): array
    {
        return DB::table('entrega_material')
            ->select(
                DB::raw('DATE(fecha_entrega) as fecha'),
                DB::raw('SUM(cantidad_kg) as total_kg')
            )
            ->groupBy(DB::raw('DATE(fecha_entrega)'))
            ->orderBy('fecha')
            ->get()
            ->map(fn ($row) => [
                'fecha' => $row->fecha,
                'total_kg' => (float) $row->total_kg
            ])
            ->toArray();
    }
}