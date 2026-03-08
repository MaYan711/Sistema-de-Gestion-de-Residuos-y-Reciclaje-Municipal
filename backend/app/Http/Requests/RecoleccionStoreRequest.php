<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecoleccionStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_asignacion' => ['required', 'integer', 'exists:asignacion_ruta,id_asignacion'],
            'estado' => ['required', Rule::in(['programada', 'en_proceso', 'completada', 'incompleta'])],
            'hora_inicio' => ['nullable', 'date'],
            'hora_fin' => ['nullable', 'date'],
            'peso_real' => ['nullable', 'numeric', 'min:0'],
            'observaciones' => ['nullable', 'string'],
            'incidencias' => ['nullable', 'array'],
            'incidencias.*.tipo' => ['required_with:incidencias', 'string', 'max:50'],
            'incidencias.*.descripcion' => ['required_with:incidencias', 'string'],
            'incidencias.*.fecha_hora' => ['nullable', 'date'],
        ];
    }
}