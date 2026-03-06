<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DenunciaService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DenunciaController extends Controller
{
    public function __construct(
        private DenunciaService $service
    ) {}

    public function index(Request $request)
    {
        $estado = $request->query('estado');
        $q = $request->query('q');

        return response()->json([
            'data' => $this->service->list($estado, $q)
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'direccion' => ['required', 'string', 'max:200'],
            'descripcion' => ['required', 'string'],
            'tamano' => ['required', Rule::in(['pequeno', 'mediano', 'grande'])],
            'latitud' => ['nullable', 'numeric'],
            'longitud' => ['nullable', 'numeric'],
            'id_zona' => ['nullable', 'integer'],
            'id_cuadrilla' => ['nullable', 'integer'],
        ]);

        $userId = $request->user()->id_usuario ?? $request->user()->id;

        return response()->json([
            'data' => $this->service->create($data, (int)$userId)
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'direccion' => ['required', 'string', 'max:200'],
            'descripcion' => ['required', 'string'],
            'tamano' => ['required', Rule::in(['pequeno', 'mediano', 'grande'])],
            'latitud' => ['nullable', 'numeric'],
            'longitud' => ['nullable', 'numeric'],
            'id_zona' => ['nullable', 'integer'],
            'id_cuadrilla' => ['nullable', 'integer'],
        ]);

        return response()->json([
            'data' => $this->service->update((int)$id, $data)
        ]);
    }

    public function destroy($id)
    {
        $this->service->delete((int)$id);

        return response()->json([
            'ok' => true
        ]);
    }

    public function changeEstado(Request $request, $id)
    {
        $data = $request->validate([
            'estado' => ['required', Rule::in(['recibida', 'en_revision', 'asignada', 'en_atencion', 'atendida', 'cerrada'])],
            'observaciones' => ['nullable', 'string'],
        ]);

        $userId = $request->user()->id_usuario ?? $request->user()->id;

        return response()->json([
            'data' => $this->service->changeEstado((int)$id, $data['estado'], (int)$userId, $data['observaciones'] ?? null)
        ]);
    }

    public function assign(Request $request, $id)
{
    $data = $request->validate([
        'id_cuadrilla' => ['required', 'integer'],
        'fecha_programada' => ['required', 'date'],
        'recursos' => ['nullable', 'string'],
    ]);

    $userId = $request->user()->id_usuario ?? $request->user()->id;

    return response()->json([
        'data' => $this->service->assign(
            (int) $id,
            (int) $data['id_cuadrilla'],
            $data['fecha_programada'],
            (int) $userId,
            $data['recursos'] ?? null
        )
    ]);
}

public function seguimientoPublico($codigo)
{
    return response()->json([
        'data' => $this->service->getSeguimientoPublico($codigo)
    ]);
}
}