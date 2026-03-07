<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RutaStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_zona' => ['required', 'integer', 'exists:zona,id_zona'],
            'nombre' => ['required', 'string', 'max:100', 'unique:ruta,nombre'],
            'coor_ini' => ['required', 'array'],
            'coor_ini.lat' => ['required', 'numeric', 'between:-90,90'],
            'coor_ini.lng' => ['required', 'numeric', 'between:-180,180'],
            'coor_fin' => ['required', 'array'],
            'coor_fin.lat' => ['required', 'numeric', 'between:-90,90'],
            'coor_fin.lng' => ['required', 'numeric', 'between:-180,180'],
            'puntos_inter' => ['nullable', 'array'],
            'puntos_inter.*.lat' => ['required_with:puntos_inter', 'numeric', 'between:-90,90'],
            'puntos_inter.*.lng' => ['required_with:puntos_inter', 'numeric', 'between:-180,180'],
            'distancia' => ['required', 'numeric', 'min:0'],
            'dias_recole' => ['required', 'string', 'max:100'],
            'horario' => ['required', 'string', 'max:100'],
            'tipo_residuo' => ['required', Rule::in(['organico', 'inorganico', 'mixto'])],
            'activo' => ['nullable', 'boolean'],
        ];
    }
}