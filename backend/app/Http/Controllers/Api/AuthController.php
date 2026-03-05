<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = Usuario::with('rol')->where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        if (isset($user->activo) && !$user->activo) {
            return response()->json(['message' => 'Usuario inactivo'], 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('react-spa')->plainTextToken;

        return response()->json([
            'token' => $token,
            'usuario' => [
                'id' => $user->id_usuario,
                'email' => $user->email,
                'nombre' => $user->nombre ?? null,
                'id_rol' => $user->id_rol ?? null,
                'rol' => $user->rol?->nombre,
                'activo' => $user->activo ?? true,
            ],
        ]);
    }

    public function me(Request $request)
    {
        $u = $request->user()->load('rol');

        return response()->json([
            'usuario' => [
                'id' => $u->id_usuario,
                'email' => $u->email,
                'nombre' => $u->nombre ?? null,
                'id_rol' => $u->id_rol ?? null,
                'rol' => $u->rol?->nombre,
                'activo' => $u->activo ?? true,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['ok' => true]);
    }
}