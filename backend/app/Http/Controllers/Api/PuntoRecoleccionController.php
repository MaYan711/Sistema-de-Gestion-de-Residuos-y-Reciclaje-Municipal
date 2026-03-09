<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PuntoRecoleccionService;
use Illuminate\Http\JsonResponse;

class PuntoRecoleccionController extends Controller
{
    public function __construct(private PuntoRecoleccionService $puntoRecoleccionService)
    {
    }

    public function marcarRecolectado(int $id): JsonResponse
    {
        $punto = $this->puntoRecoleccionService->marcarRecolectado($id);

        return response()->json([
            'message' => 'Punto marcado como recolectado correctamente',
            'punto' => $punto,
        ]);
    }

    public function desmarcarRecolectado(int $id): JsonResponse
    {
        $punto = $this->puntoRecoleccionService->desmarcarRecolectado($id);

        return response()->json([
            'message' => 'Punto marcado como pendiente correctamente',
            'punto' => $punto,
        ]);
    }
}