<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UsuarioUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $idUsuario = $this->route('id');

        return [
            'id_rol' => ['required', 'integer', 'exists:rol,id_rol'],
            'nombre' => ['required', 'string', 'max:150'],
            'email' => [
                'required',
                'email',
                'max:150',
                Rule::unique('usuario', 'email')->ignore($idUsuario, 'id_usuario')
            ],
            'password' => ['nullable', 'string', 'min:8', 'max:100'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'activo' => ['required', 'boolean'],
        ];
    }
}