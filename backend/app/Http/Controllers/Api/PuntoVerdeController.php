<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PuntoVerdeService;
use Illuminate\Http\Request;

class PuntoVerdeController extends Controller
{
    public function __construct(
        private PuntoVerdeService $service
    ) {}

    public function index()
    {
        return response()->json([
            'data' => $this->service->list()
        ]);
    }

     public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'direccion' => ['required', 'string', 'max:200'],
            'latitud' => ['required', 'numeric'],
            'longitud' => ['required', 'numeric'],
            'capacidad' => ['nullable', 'integer'],
            'horario' => ['nullable', 'string', 'max:50'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $data['id_encargado'] = $request->user()->id_usuario ?? $request->user()->id;

        return response()->json([
            'data' => $this->service->create($data)
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'direccion' => ['required', 'string', 'max:200'],
            'latitud' => ['required', 'numeric'],
            'longitud' => ['required', 'numeric'],
            'capacidad' => ['nullable', 'integer'],
            'horario' => ['nullable', 'string', 'max:50'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $data['id_encargado'] = $request->user()->id_usuario ?? $request->user()->id;

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

        public function deactivate($id)
{
    $this->service->deactivate((int)$id);
    return response()->json(['ok' => true]);
}
}
