<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContenedorUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $idContenedor = $this->route('id');

        return [
            'id_punto_verde' => ['required', 'integer', 'exists:punto_verde,id_punto_verde'],
            'id_tipo_material' => ['required', 'integer', 'exists:tipo_material,id_tipo'],
            'capacidad_kg' => ['required', 'numeric', 'gt:0'],
            'nivel_llenado' => ['required', 'numeric', 'min:0', 'max:100'],
            'estado' => ['required', Rule::in(['disponible', 'lleno', 'mantenimiento'])],
            'ultimo_vaciado' => ['nullable', 'date'],
            'codigo' => ['required', 'string', 'max:30', Rule::unique('contenedor', 'codigo')->ignore($idContenedor, 'id_contenedor')],
            'activo' => ['nullable', 'boolean'],
        ];
    }
}