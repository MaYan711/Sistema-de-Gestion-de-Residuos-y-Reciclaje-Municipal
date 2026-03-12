<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UsuarioStoreRequest;
use App\Http\Requests\UsuarioUpdateRequest;
use App\Services\UsuarioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function __construct(
        private UsuarioService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $idRol = $request->query('id_rol');

        return response()->json(
            $this->service->listar($idRol ? (int) $idRol : null)
        );
    }

    public function roles(): JsonResponse
    {
        return response()->json(
            $this->service->roles()
        );
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(
            $this->service->obtener($id)
        );
    }

    public function store(UsuarioStoreRequest $request): JsonResponse
    {
        return response()->json([
            'message' => 'Usuario creado correctamente',
            'data' => $this->service->crear($request->validated())
        ], 201);
    }

    public function update(UsuarioUpdateRequest $request, int $id): JsonResponse
    {
        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'data' => $this->service->actualizar($id, $request->validated())
        ]);
    }

    public function toggleActivo(int $id): JsonResponse
    {
        return response()->json([
            'message' => 'Estado del usuario actualizado correctamente',
            'data' => $this->service->toggleActivo($id)
        ]);
    }
}