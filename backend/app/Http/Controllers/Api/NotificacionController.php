<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class NotificacionController extends Controller
{
    public function indexContenedores(): JsonResponse
    {
        $notificaciones = DB::table('notificacion')
            ->where('tipo', 'contenedor')
            ->orderByDesc('id_notificacion')
            ->get();

        return response()->json($notificaciones);
    }

    public function marcarLeida(int $id): JsonResponse
    {
        DB::table('notificacion')
            ->where('id_notificacion', $id)
            ->update([
                'leida' => true,
            ]);

        return response()->json([
            'message' => 'Notificación marcada como leída',
        ]);
    }
}