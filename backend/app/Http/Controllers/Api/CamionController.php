<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CamionStoreRequest;
use App\Http\Requests\CamionUpdateRequest;
use App\Services\CamionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CamionController extends Controller
{
    public function __construct(private CamionService $camionService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $camiones = $this->camionService->listar($request->only([
            'buscar',
            'estado',
        ]));

        return response()->json($camiones);
    }

    public function show(int $id): JsonResponse
    {
        $camion = $this->camionService->obtener($id);

        return response()->json($camion);
    }

    public function store(CamionStoreRequest $request): JsonResponse
    {
        $camion = $this->camionService->crear($request->validated());

        return response()->json([
            'message' => 'Camión registrado correctamente',
            'camion' => $camion,
        ], 201);
    }

    public function update(CamionUpdateRequest $request, int $id): JsonResponse
    {
        $camion = $this->camionService->actualizar($id, $request->validated());

        return response()->json([
            'message' => 'Camión actualizado correctamente',
            'camion' => $camion,
        ]);
    }

    public function destroy(int $id): JsonResponse
{
    $camion = $this->camionService->eliminar($id);

    return response()->json([
        'message' => 'Camión inactivado correctamente',
        'camion' => $camion,
    ]);
}

    public function conductores(): JsonResponse
    {
        $conductores = $this->camionService->listarConductores();

        return response()->json($conductores);
    }
}