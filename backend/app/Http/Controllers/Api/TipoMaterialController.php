<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TipoMaterialStoreRequest;
use App\Http\Requests\TipoMaterialUpdateRequest;
use App\Services\TipoMaterialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TipoMaterialController extends Controller
{
    public function __construct(
        private TipoMaterialService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tipos = $this->service->listar($request->only([
            'buscar',
            'activo',
        ]));

        return response()->json($tipos);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(TipoMaterialStoreRequest $request): JsonResponse
    {
        $tipo = $this->service->crear($request->validated());

        return response()->json([
            'message' => 'Tipo de material creado correctamente',
            'tipo_material' => $tipo,
        ], 201);
    }

    public function update(TipoMaterialUpdateRequest $request, int $id): JsonResponse
    {
        $tipo = $this->service->actualizar($id, $request->validated());

        return response()->json([
            'message' => 'Tipo de material actualizado correctamente',
            'tipo_material' => $tipo,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->desactivar($id);

        return response()->json([
            'message' => 'Tipo de material desactivado correctamente',
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $this->service->reactivar($id);

        return response()->json([
            'message' => 'Tipo de material reactivado correctamente',
        ]);
    }
}