<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CamionStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_conductor' => ['nullable', 'integer', 'exists:usuario,id_usuario'],
            'placa' => ['required', 'string', 'max:20', 'unique:camion,placa'],
            'capacidad' => ['required', 'numeric', 'gt:0'],
            'estado' => ['required', Rule::in(['operativo', 'mantenimiento', 'fuera_servicio'])],
            'marca' => ['nullable', 'string', 'max:50'],
            'modelo' => ['nullable', 'string', 'max:50'],
            'anio' => ['nullable', 'integer', 'min:1990', 'max:2100'],
        ];
    }
}