<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsuarioStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_rol' => ['required', 'integer', 'exists:rol,id_rol'],
            'nombre' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', 'unique:usuario,email'],
            'password' => ['required', 'string', 'min:8', 'max:100'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'activo' => ['nullable', 'boolean'],
        ];
    }
}