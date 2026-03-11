<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\VaciadoProgramarRequest;
use App\Services\VaciadoContenedorService;
use Illuminate\Http\JsonResponse;

class VaciadoContenedorController extends Controller
{

    public function __construct(
        private VaciadoContenedorService $service
    ){}

    public function index(): JsonResponse
    {
        return response()->json(
            $this->service->listar()
        );
    }


    public function programar(VaciadoProgramarRequest $request): JsonResponse
    {
        return response()->json([
            'message'=>'Vaciado programado',
            'data'=>$this->service->programar($request->validated())
        ],201);
    }


    public function completar(int $id): JsonResponse
    {
        $this->service->completar($id);

        return response()->json([
            'message'=>'Vaciado completado'
        ]);
    }

}