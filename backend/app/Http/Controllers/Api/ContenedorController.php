<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContenedorStoreRequest;
use App\Http\Requests\ContenedorUpdateRequest;
use App\Services\ContenedorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContenedorController extends Controller
{
    public function __construct(
        private ContenedorService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $this->service->listar($request->only([
                'buscar',
                'activo',
                'id_punto_verde',
                'id_tipo_material',
                'estado',
            ]))
        );
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(ContenedorStoreRequest $request): JsonResponse
    {
        return response()->json([
            'message' => 'Contenedor creado correctamente',
            'contenedor' => $this->service->crear($request->validated()),
        ], 201);
    }

    public function update(ContenedorUpdateRequest $request, int $id): JsonResponse
    {
        return response()->json([
            'message' => 'Contenedor actualizado correctamente',
            'contenedor' => $this->service->actualizar($id, $request->validated()),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->desactivar($id);

        return response()->json([
            'message' => 'Contenedor desactivado correctamente',
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $this->service->reactivar($id);

        return response()->json([
            'message' => 'Contenedor reactivado correctamente',
        ]);
    }
}