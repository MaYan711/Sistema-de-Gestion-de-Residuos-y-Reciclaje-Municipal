<?php

namespace App\Services;

use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UsuarioService
{
    public function listar(?int $idRol = null): array
    {
        $query = Usuario::query()
            ->with('rol')
            ->orderBy('id_usuario', 'desc');

        if ($idRol) {
            $query->where('id_rol', $idRol);
        }

        return $query->get()
            ->map(fn (Usuario $usuario) => $this->mapUsuario($usuario))
            ->toArray();
    }

    public function roles(): array
    {
        return Rol::query()
            ->orderBy('id_rol')
            ->get()
            ->map(fn (Rol $rol) => [
                'id_rol' => $rol->id_rol,
                'nombre' => $rol->nombre,
                'descripcion' => $rol->descripcion,
            ])
            ->toArray();
    }

    public function obtener(int $id): array
    {
        $usuario = Usuario::query()
            ->with('rol')
            ->findOrFail($id);

        return $this->mapUsuario($usuario);
    }

    public function crear(array $data): array
    {
        $this->validarRolInterno($data['id_rol']);

        $usuario = Usuario::query()->create([
            'id_rol' => $data['id_rol'],
            'nombre' => $data['nombre'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'telefono' => $data['telefono'] ?? null,
            'activo' => $data['activo'] ?? true,
            'created_at' => now(),
        ]);

        $usuario->load('rol');

        return $this->mapUsuario($usuario);
    }

    public function actualizar(int $id, array $data): array
    {
        $this->validarRolInterno($data['id_rol']);

        $usuario = Usuario::query()->findOrFail($id);

        $payload = [
            'id_rol' => $data['id_rol'],
            'nombre' => $data['nombre'],
            'email' => $data['email'],
            'telefono' => $data['telefono'] ?? null,
            'activo' => $data['activo'],
        ];

        if (!empty($data['password'])) {
            $payload['password'] = Hash::make($data['password']);
        }

        $usuario->update($payload);
        $usuario->load('rol');

        return $this->mapUsuario($usuario);
    }

    public function toggleActivo(int $id): array
    {
        $usuario = Usuario::query()->findOrFail($id);

        $usuario->activo = !$usuario->activo;
        $usuario->save();

        $usuario->load('rol');

        return $this->mapUsuario($usuario);
    }

    private function validarRolInterno(int $idRol): void
    {
        $rol = Rol::query()->findOrFail($idRol);

        if (mb_strtolower($rol->nombre) === 'ciudadano') {
            throw ValidationException::withMessages([
                'id_rol' => ['El rol ciudadano solo puede crearse desde el registro público.'],
            ]);
        }
    }

    private function mapUsuario(Usuario $usuario): array
    {
        return [
            'id_usuario' => $usuario->id_usuario,
            'id_rol' => $usuario->id_rol,
            'rol_nombre' => $usuario->rol?->nombre,
            'nombre' => $usuario->nombre,
            'email' => $usuario->email,
            'telefono' => $usuario->telefono,
            'activo' => (bool) $usuario->activo,
            'created_at' => optional($usuario->created_at)?->format('Y-m-d H:i:s'),
        ];
    }
}