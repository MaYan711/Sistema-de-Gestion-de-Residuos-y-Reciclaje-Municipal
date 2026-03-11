<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportesRecoleccionService;
use Illuminate\Http\JsonResponse;

class ReportesRecoleccionController extends Controller
{
    public function __construct(
        private ReportesRecoleccionService $service
    ) {}

    public function recoleccionPorDia(): JsonResponse
    {
        return response()->json(
            $this->service->recoleccionPorDia()
        );
    }

    public function recoleccionPorRuta(): JsonResponse
    {
        return response()->json(
            $this->service->recoleccionPorRuta()
        );
    }

    public function recoleccionPorZona(): JsonResponse
    {
        return response()->json(
            $this->service->recoleccionPorZona()
        );
    }
}