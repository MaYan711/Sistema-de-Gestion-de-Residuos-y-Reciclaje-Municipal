<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ruta;
use App\Models\Zona;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortalRutaPublicController extends Controller
{
    public function zonas(): JsonResponse
    {
        $zonas = Zona::query()
            ->where('activo', true)
            ->orderBy('nombre')
            ->get([
                'id_zona',
                'nombre',
                'tipo',
                'latitud_centro',
                'longitud_centro',
            ]);

        return response()->json($zonas);
    }

    public function rutas(Request $request): JsonResponse
    {
        $query = Ruta::with('zona')
            ->where('activo', true);

        if ($request->filled('id_zona')) {
            $query->where('id_zona', $request->id_zona);
        }

        if ($request->filled('buscar')) {
            $buscar = trim($request->buscar);

            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'ilike', "%{$buscar}%")
                    ->orWhere('dias_recole', 'ilike', "%{$buscar}%")
                    ->orWhere('horario', 'ilike', "%{$buscar}%")
                    ->orWhere('tipo_residuo', 'ilike', "%{$buscar}%");
            });
        }

        $rutas = $query
            ->orderBy('nombre')
            ->get([
                'id_ruta',
                'id_zona',
                'nombre',
                'coor_ini',
                'coor_fin',
                'puntos_inter',
                'distancia',
                'dias_recole',
                'horario',
                'tipo_residuo',
                'activo',
            ]);

        return response()->json($rutas);
    }

    public function show(int $id): JsonResponse
    {
        $ruta = Ruta::with('zona')
            ->where('activo', true)
            ->findOrFail($id, [
                'id_ruta',
                'id_zona',
                'nombre',
                'coor_ini',
                'coor_fin',
                'puntos_inter',
                'distancia',
                'dias_recole',
                'horario',
                'tipo_residuo',
                'activo',
            ]);

        return response()->json($ruta);
    }
}