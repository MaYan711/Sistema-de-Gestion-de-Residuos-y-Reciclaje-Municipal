<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RutaStoreRequest;
use App\Http\Requests\RutaUpdateRequest;
use App\Services\RutaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RutaController extends Controller
{
    public function __construct(private RutaService $rutaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $rutas = $this->rutaService->listar($request->only([
            'activo',
            'id_zona',
            'tipo_residuo',
            'buscar',
        ]));

        return response()->json($rutas);
    }

    public function show(int $id): JsonResponse
    {
        $ruta = $this->rutaService->obtener($id);

        return response()->json($ruta);
    }

    public function store(RutaStoreRequest $request): JsonResponse
    {
        $ruta = $this->rutaService->crear($request->validated());

        return response()->json([
            'message' => 'Ruta creada correctamente',
            'ruta' => $ruta->load('zona'),
        ], 201);
    }

    public function update(RutaUpdateRequest $request, int $id): JsonResponse
    {
        $ruta = $this->rutaService->actualizar($id, $request->validated());

        return response()->json([
            'message' => 'Ruta actualizada correctamente',
            'ruta' => $ruta,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->rutaService->desactivar($id);

        return response()->json([
            'message' => 'Ruta desactivada correctamente',
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $this->rutaService->reactivar($id);

        return response()->json([
            'message' => 'Ruta reactivada correctamente',
        ]);
    }
}