<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncidenciaRuta extends Model
{
    protected $table = 'incidencia_ruta';
    protected $primaryKey = 'id_incidencia';
    public $timestamps = false;

    protected $fillable = [
        'id_recoleccion',
        'tipo',
        'descripcion',
        'latitud',
        'longitud',
        'fecha',
    ];

    protected $casts = [
        'id_recoleccion' => 'integer',
        'latitud' => 'float',
        'longitud' => 'float',
        'fecha' => 'datetime',
    ];

    public function recoleccion(): BelongsTo
    {
        return $this->belongsTo(Recoleccion::class, 'id_recoleccion', 'id_recoleccion');
    }
}