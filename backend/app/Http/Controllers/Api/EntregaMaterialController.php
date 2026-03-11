<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EntregaMaterialStoreRequest;
use App\Services\EntregaMaterialService;
use Illuminate\Http\JsonResponse;

class EntregaMaterialController extends Controller
{
    public function __construct(
        private EntregaMaterialService $service
    ) {}

    public function index(): JsonResponse
    {
        return response()->json(
            $this->service->listar()
        );
    }

    public function catalogos(): JsonResponse
    {
        return response()->json(
            $this->service->catalogos()
        );
    }

    public function store(EntregaMaterialStoreRequest $request): JsonResponse
    {
        return response()->json([
            'message' => 'Entrega registrada correctamente',
            'data' => $this->service->crear($request->validated())
        ], 201);
    }
}