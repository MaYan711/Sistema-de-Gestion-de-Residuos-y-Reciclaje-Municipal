<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VaciadoProgramarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_contenedor' => ['required','integer','exists:contenedor,id_contenedor'],
            'id_usuario' => ['required','integer','exists:usuario,id_usuario'],
            'fecha_prog' => ['required','date'],
            'observaciones' => ['nullable','string','max:255']
        ];
    }
}