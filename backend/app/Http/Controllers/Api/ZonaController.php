<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ZonaStoreRequest;
use App\Http\Requests\ZonaUpdateRequest;
use App\Models\Zona;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ZonaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Zona::query();

        if ($request->filled('activo')) {
            $query->where('activo', filter_var($request->activo, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->filled('buscar')) {
            $buscar = trim($request->buscar);
            $query->where('nombre', 'ilike', "%{$buscar}%");
        }

        $zonas = $query->orderBy('id_zona', 'desc')->get();

        return response()->json($zonas);
    }

    public function show(int $id): JsonResponse
    {
        $zona = Zona::findOrFail($id);

        return response()->json($zona);
    }

    public function store(ZonaStoreRequest $request): JsonResponse
    {
        $zona = Zona::create([
            'nombre' => $request->nombre,
            'tipo' => $request->tipo,
            'densidad_pobla' => $request->densidad_pobla,
            'activo' => $request->boolean('activo', true),
            'latitud_centro' => $request->latitud_centro,
            'longitud_centro' => $request->longitud_centro,
            'limites' => $request->limites,
        ]);

        return response()->json([
            'message' => 'Zona creada correctamente',
            'zona' => $zona
        ], 201);
    }

    public function update(ZonaUpdateRequest $request, int $id): JsonResponse
    {
        $zona = Zona::findOrFail($id);

        $zona->update([
            'nombre' => $request->nombre,
            'tipo' => $request->tipo,
            'densidad_pobla' => $request->densidad_pobla,
            'activo' => $request->boolean('activo', true),
            'latitud_centro' => $request->latitud_centro,
            'longitud_centro' => $request->longitud_centro,
            'limites' => $request->limites,
        ]);

        return response()->json([
            'message' => 'Zona actualizada correctamente',
            'zona' => $zona->fresh()
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $zona = Zona::findOrFail($id);
        $zona->activo = false;
        $zona->save();

        return response()->json([
            'message' => 'Zona desactivada correctamente'
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $zona = Zona::findOrFail($id);
        $zona->activo = true;
        $zona->save();

        return response()->json([
            'message' => 'Zona reactivada correctamente'
        ]);
    }
}