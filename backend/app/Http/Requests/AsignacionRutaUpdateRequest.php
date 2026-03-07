<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AsignacionRutaUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_ruta' => ['required', 'integer', 'exists:ruta,id_ruta'],
            'id_camion' => ['required', 'integer', 'exists:camion,id_camion'],
            'fecha_asig' => ['required', 'date'],
            'peso_estimado' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}