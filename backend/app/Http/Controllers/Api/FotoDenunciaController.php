<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FotoDenunciaService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FotoDenunciaController extends Controller
{
    public function __construct(
        private FotoDenunciaService $service
    ) {}

    public function index($id)
    {
        return response()->json([
            'data' => $this->service->list((int)$id)
        ]);
    }

    public function store(Request $request, $id)
    {
        $data = $request->validate([
            'tipo' => ['required', Rule::in(['lugar', 'antes', 'despues'])],
            'foto' => ['required', 'image', 'max:4096'],
        ]);

        return response()->json([
            'data' => $this->service->upload((int)$id, $data['tipo'], $request->file('foto'))
        ], 201);
    }
}