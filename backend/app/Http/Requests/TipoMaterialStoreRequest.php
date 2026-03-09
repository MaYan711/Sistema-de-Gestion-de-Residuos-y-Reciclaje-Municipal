<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TipoMaterialStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:50', 'unique:tipo_material,nombre'],
            'descripcion' => ['nullable', 'string', 'max:200'],
            'unidad_medida' => ['required', 'string', 'max:20'],
            'activo' => ['nullable', 'boolean'],
        ];
    }
}