<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RecoleccionStoreRequest;
use App\Http\Requests\RecoleccionUpdateRequest;
use App\Services\RecoleccionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecoleccionController extends Controller
{
    public function __construct(private RecoleccionService $recoleccionService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $recolecciones = $this->recoleccionService->listar($request->only([
            'estado',
            'id_asignacion',
        ]));

        return response()->json($recolecciones);
    }

    public function show(int $id): JsonResponse
    {
        $recoleccion = $this->recoleccionService->obtener($id);

        return response()->json($recoleccion);
    }

    public function store(RecoleccionStoreRequest $request): JsonResponse
    {
        $recoleccion = $this->recoleccionService->crear($request->validated());

        return response()->json([
            'message' => 'Recolección registrada correctamente',
            'recoleccion' => $recoleccion,
        ], 201);
    }

    public function update(RecoleccionUpdateRequest $request, int $id): JsonResponse
    {
        $recoleccion = $this->recoleccionService->actualizar($id, $request->validated());

        return response()->json([
            'message' => 'Recolección actualizada correctamente',
            'recoleccion' => $recoleccion,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->recoleccionService->eliminar($id);

        return response()->json([
            'message' => 'Recolección eliminada correctamente',
        ]);
    }

    public function asignacionesDisponibles(): JsonResponse
    {
        return response()->json($this->recoleccionService->asignacionesDisponibles());
    }
}