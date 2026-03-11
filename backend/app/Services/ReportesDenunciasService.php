<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ReportesDenunciasService
{
    public function denunciasPorEstado(): array
    {
        return DB::table('denuncia')
            ->select(
                'estado',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('estado')
            ->orderBy('estado')
            ->get()
            ->map(fn ($row) => [
                'estado' => $row->estado,
                'total' => (int) $row->total
            ])
            ->toArray();
    }

    public function tiempoPromedioAtencion(): array
    {
        $promedio = DB::table('denuncia as d')
            ->join('seguimiento_denuncia as s', 's.id_denuncia', '=', 'd.id_denuncia')
            ->where('s.estado_nuevo', 'atendida')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (s.fecha - d.fecha)) / 86400) as promedio_dias')
            ->first();

        return [
            'tiempo_promedio_dias' => round((float) ($promedio->promedio_dias ?? 0), 2)
        ];
    }

    public function zonasConMasDenuncias(): array
    {
        return DB::table('denuncia as d')
            ->join('zona as z', 'z.id_zona', '=', 'd.id_zona')
            ->select(
                'z.nombre as zona',
                DB::raw('COUNT(*) as total_denuncias')
            )
            ->groupBy('z.nombre')
            ->orderByDesc('total_denuncias')
            ->get()
            ->map(fn ($row) => [
                'zona' => $row->zona,
                'total_denuncias' => (int) $row->total_denuncias
            ])
            ->toArray();
    }
}