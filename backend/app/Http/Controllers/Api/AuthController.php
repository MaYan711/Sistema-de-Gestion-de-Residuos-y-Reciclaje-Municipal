<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CiudadanoRegisterRequest;
use App\Models\Ciudadano;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                'id_usuario' => $user->id_usuario,
                'email' => $user->email,
                'nombre' => $user->nombre ?? null,
                'id_rol' => $user->id_rol ?? null,
                'rol_nombre' => $user->rol?->nombre,
                'activo' => $user->activo ?? true,
            ],
        ]);
    }

    public function registerCiudadano(CiudadanoRegisterRequest $request)
    {
        $data = $request->validated();

        $rolCiudadano = Rol::query()
            ->whereRaw('LOWER(nombre) = ?', ['ciudadano'])
            ->first();

        if (!$rolCiudadano) {
            return response()->json([
                'message' => 'No existe el rol ciudadano configurado en la base de datos'
            ], 500);
        }

        $usuario = DB::transaction(function () use ($data, $rolCiudadano) {
            $usuario = Usuario::query()->create([
                'id_rol' => $rolCiudadano->id_rol,
                'nombre' => $data['nombre'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'telefono' => $data['telefono'] ?? null,
                'activo' => true,
                'created_at' => now(),
            ]);

            Ciudadano::query()->create([
                'id_usuario' => $usuario->id_usuario,
                'nombre' => $data['nombre'],
                'telefono' => $data['telefono'] ?? null,
                'email' => $data['email'],
            ]);

            return $usuario->load('rol');
        });

        $usuario->tokens()->delete();
        $token = $usuario->createToken('react-spa')->plainTextToken;

        return response()->json([
            'message' => 'Cuenta creada correctamente',
            'token' => $token,
            'usuario' => [
                'id_usuario' => $usuario->id_usuario,
                'email' => $usuario->email,
                'nombre' => $usuario->nombre ?? null,
                'id_rol' => $usuario->id_rol ?? null,
                'rol_nombre' => $usuario->rol?->nombre,
                'activo' => $usuario->activo ?? true,
            ],
        ], 201);
    }

    public function me(Request $request)
    {
        $u = $request->user()->load('rol');

        return response()->json([
            'usuario' => [
                'id_usuario' => $u->id_usuario,
                'email' => $u->email,
                'nombre' => $u->nombre ?? null,
                'id_rol' => $u->id_rol ?? null,
                'rol_nombre' => $u->rol?->nombre,
                'activo' => $u->activo ?? true,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}