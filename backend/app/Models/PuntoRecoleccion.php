<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PuntoRecoleccion extends Model
{
    protected $table = 'punto_recoleccion';
    protected $primaryKey = 'id_punto';
    public $timestamps = false;

    protected $fillable = [
        'id_asignacion',
        'latitud',
        'longitud',
        'volumen_estimado',
        'orden',
        'recolectado',
        'hora_recoleccion',
    ];

    protected $casts = [
        'id_asignacion' => 'integer',
        'latitud' => 'float',
        'longitud' => 'float',
        'volumen_estimado' => 'float',
        'orden' => 'integer',
        'recolectado' => 'boolean',
    ];

    public function asignacion(): BelongsTo
    {
        return $this->belongsTo(AsignacionRuta::class, 'id_asignacion', 'id_asignacion');
    }
}