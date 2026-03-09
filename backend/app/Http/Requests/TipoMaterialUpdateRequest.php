<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TipoMaterialUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $idTipo = $this->route('id');

        return [
            'nombre' => ['required', 'string', 'max:50', Rule::unique('tipo_material', 'nombre')->ignore($idTipo, 'id_tipo')],
            'descripcion' => ['nullable', 'string', 'max:200'],
            'unidad_medida' => ['required', 'string', 'max:20'],
            'activo' => ['nullable', 'boolean'],
        ];
    }
}