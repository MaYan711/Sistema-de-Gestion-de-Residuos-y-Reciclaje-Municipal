<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CuadrillaService;

class CuadrillaController extends Controller
{
    public function __construct(
        private CuadrillaService $service
    ) {}

    public function index()
    {
        return response()->json([
            'data' => $this->service->list()
        ]);
    }
}