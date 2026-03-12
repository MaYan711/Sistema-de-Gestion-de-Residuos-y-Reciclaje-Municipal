<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        if (!$user->activo) {
            return response()->json(['message' => 'Usuario inactivo'], 403);
        }

        $rol = optional($user->rol)->nombre;

        if (!$rol) {
            return response()->json(['message' => 'Usuario sin rol'], 403);
        }

        $rol = strtolower($rol);
        $roles = array_map(fn($r) => strtolower($r), $roles);

        if (!in_array($rol, $roles)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return $next($request);
    }
}