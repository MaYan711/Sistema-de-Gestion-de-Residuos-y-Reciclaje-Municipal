<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getKpis(): array
    {
        // ===== KPIs de conteo (según tus tablas reales) =====
        $totalZonas         = (int) DB::table('zona')->count();
        $totalRutas         = (int) DB::table('ruta')->count();
        $totalCamiones      = (int) DB::table('camion')->count();
        $totalAsignaciones  = (int) DB::table('asignacion_ruta')->count();

        $totalPuntosVerdes  = (int) DB::table('punto_verde')->count();
        $totalContenedores  = (int) DB::table('contenedor')->count();

        $totalCiudadanos    = (int) DB::table('ciudadano')->count();
        $totalUsuarios      = (int) DB::table('usuario')->count();

        $totalDenuncias     = (int) DB::table('denuncia')->count();
        $totalRecolecciones = (int) DB::table('recoleccion')->count();
        $totalEntregas      = (int) DB::table('entrega_material')->count();

        // ===== Denuncias por estado (tu columna se llama 'estado') =====
        $denunciasPorEstado = DB::table('denuncia')
            ->select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->orderBy('estado')
            ->get()
            ->pluck('total', 'estado')
            ->toArray();

        // ===== Contenedores por nivel (tu columna se llama 'nivel_llenado') =====
        // Umbrales del enunciado: 75 / 90 / 100
        $contenedoresNivel = [
            '>=75'  => (int) DB::table('contenedor')->where('nivel_llenado', '>=', 75)->count(),
            '>=90'  => (int) DB::table('contenedor')->where('nivel_llenado', '>=', 90)->count(),
            '=100'  => (int) DB::table('contenedor')->where('nivel_llenado', '=', 100)->count(),
        ];

        // ===== Camiones por estado (tu tabla camion tiene 'estado') =====
        $camionesPorEstado = DB::table('camion')
            ->select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->orderBy('estado')
            ->get()
            ->pluck('total', 'estado')
            ->toArray();

        return [
            'cards' => [
                'zonas' => $totalZonas,
                'rutas' => $totalRutas,
                'camiones' => $totalCamiones,
                'asignaciones_ruta' => $totalAsignaciones,

                'puntos_verdes' => $totalPuntosVerdes,
                'contenedores' => $totalContenedores,

                'ciudadanos' => $totalCiudadanos,
                'usuarios' => $totalUsuarios,

                'denuncias' => $totalDenuncias,
                'recolecciones' => $totalRecolecciones,
                'entregas_material' => $totalEntregas,
            ],
            'charts' => [
                'denuncias_por_estado' => $denunciasPorEstado,
                'contenedores_por_nivel' => $contenedoresNivel,
                'camiones_por_estado' => $camionesPorEstado,
            ],
        ];
    }
}