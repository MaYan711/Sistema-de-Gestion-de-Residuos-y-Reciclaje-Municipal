<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportesReciclajeService;
use Illuminate\Http\JsonResponse;

class ReportesReciclajeController extends Controller
{
    public function __construct(
        private ReportesReciclajeService $service
    ) {}

    public function reciclajePorTipo(): JsonResponse
    {
        return response()->json(
            $this->service->reciclajePorTipo()
        );
    }

    public function puntosVerdesMasActivos(): JsonResponse
    {
        return response()->json(
            $this->service->puntosVerdesMasActivos()
        );
    }

    public function tendenciaReciclaje(): JsonResponse
    {
        return response()->json(
            $this->service->tendenciaReciclaje()
        );
    }
}