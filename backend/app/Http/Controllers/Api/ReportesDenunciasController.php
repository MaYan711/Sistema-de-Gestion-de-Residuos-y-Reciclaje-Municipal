<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportesDenunciasService;
use Illuminate\Http\JsonResponse;

class ReportesDenunciasController extends Controller
{
    public function __construct(
        private ReportesDenunciasService $service
    ) {}

    public function denunciasPorEstado(): JsonResponse
    {
        return response()->json(
            $this->service->denunciasPorEstado()
        );
    }

    public function tiempoPromedioAtencion(): JsonResponse
    {
        return response()->json(
            $this->service->tiempoPromedioAtencion()
        );
    }

    public function zonasConMasDenuncias(): JsonResponse
    {
        return response()->json(
            $this->service->zonasConMasDenuncias()
        );
    }
}