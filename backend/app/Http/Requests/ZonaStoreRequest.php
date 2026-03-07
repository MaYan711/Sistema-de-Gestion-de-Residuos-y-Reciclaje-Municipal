<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ZonaStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:100', 'unique:zona,nombre'],
            'tipo' => ['required', Rule::in(['residencial', 'comercial', 'industrial'])],
            'densidad_pobla' => ['required', 'numeric', 'min:0'],
            'activo' => ['nullable', 'boolean'],
            'latitud_centro' => ['nullable', 'numeric', 'between:-90,90'],
            'longitud_centro' => ['nullable', 'numeric', 'between:-180,180'],
            'limites' => ['nullable', 'array'],
            'limites.*.lat' => ['required_with:limites', 'numeric', 'between:-90,90'],
            'limites.*.lng' => ['required_with:limites', 'numeric', 'between:-180,180'],
        ];
    }
}