<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FotoDenunciaService;
use Illuminate\Http\Request;

class FotoDenunciaController extends Controller
{
    public function __construct(private FotoDenunciaService $service)
    {
    }

    public function index(int $id)
    {
        return response()->json([
            'data' => $this->service->listarPorDenuncia($id),
        ]);
    }

    public function store(Request $request, int $id)
    {
        $data = $request->validate([
            'tipo_foto' => ['required', 'in:denuncia,antes,despues'],
            'foto' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $foto = $this->service->subir($id, $data['tipo_foto'], $request->file('foto'));

        return response()->json([
            'message' => 'Foto subida correctamente',
            'data' => $foto,
        ], 201);
    }
}