<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AsignacionRutaStoreRequest;
use App\Http\Requests\AsignacionRutaUpdateRequest;
use App\Services\AsignacionRutaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AsignacionRutaController extends Controller
{
    public function __construct(private AsignacionRutaService $asignacionRutaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $asignaciones = $this->asignacionRutaService->listar($request->only([
            'id_ruta',
            'id_camion',
            'fecha_asig',
        ]));

        return response()->json($asignaciones);
    }

    public function show(int $id): JsonResponse
    {
        $asignacion = $this->asignacionRutaService->obtener($id);

        return response()->json($asignacion);
    }

    public function store(AsignacionRutaStoreRequest $request): JsonResponse
    {
        $asignacion = $this->asignacionRutaService->crear($request->validated());

        return response()->json([
            'message' => 'Asignación registrada correctamente',
            'asignacion' => $asignacion,
        ], 201);
    }

    public function update(AsignacionRutaUpdateRequest $request, int $id): JsonResponse
    {
        $asignacion = $this->asignacionRutaService->actualizar($id, $request->validated());

        return response()->json([
            'message' => 'Asignación actualizada correctamente',
            'asignacion' => $asignacion,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->asignacionRutaService->eliminar($id);

        return response()->json([
            'message' => 'Asignación eliminada correctamente',
        ]);
    }

    public function rutasDisponibles(): JsonResponse
    {
        return response()->json($this->asignacionRutaService->rutasDisponibles());
    }

    public function camionesDisponibles(): JsonResponse
    {
        return response()->json($this->asignacionRutaService->camionesDisponibles());
    }
}