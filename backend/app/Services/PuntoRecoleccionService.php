<?php

namespace App\Services;

use App\Models\PuntoRecoleccion;
use Illuminate\Validation\ValidationException;

class PuntoRecoleccionService
{
    public function marcarRecolectado(int $id): PuntoRecoleccion
    {
        $punto = PuntoRecoleccion::findOrFail($id);

        if ($punto->recolectado) {
            throw ValidationException::withMessages([
                'id_punto' => ['Este punto ya fue marcado como recolectado.'],
            ]);
        }

        $punto->recolectado = true;
        $punto->hora_recoleccion = now();
        $punto->save();

        return $punto->fresh();
    }

    public function desmarcarRecolectado(int $id): PuntoRecoleccion
    {
        $punto = PuntoRecoleccion::findOrFail($id);

        $punto->recolectado = false;
        $punto->hora_recoleccion = null;
        $punto->save();

        return $punto->fresh();
    }
}