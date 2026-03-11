<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EntregaMaterialStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_contenedor' => ['required','integer','exists:contenedor,id_contenedor'],
            'id_ciudadano' => ['required','integer','exists:ciudadano,id_ciudadano'],
            'cantidad_kg' => ['required','numeric','gt:0']
        ];
    }
}