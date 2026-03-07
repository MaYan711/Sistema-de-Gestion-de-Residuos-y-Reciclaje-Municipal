<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AsignacionRuta extends Model
{
    protected $table = 'asignacion_ruta';
    protected $primaryKey = 'id_asignacion';
    public $timestamps = false;

    protected $fillable = [
        'id_ruta',
        'id_camion',
        'fecha_asig',
        'peso_estimado',
        'created_at',
    ];

    protected $casts = [
        'id_ruta' => 'integer',
        'id_camion' => 'integer',
        'peso_estimado' => 'float',
        'fecha_asig' => 'date:Y-m-d',
        'created_at' => 'datetime',
    ];

    public function ruta(): BelongsTo
    {
        return $this->belongsTo(Ruta::class, 'id_ruta', 'id_ruta');
    }

    public function camion(): BelongsTo
    {
        return $this->belongsTo(Camion::class, 'id_camion', 'id_camion');
    }

    public function recolecciones(): HasMany
    {
        return $this->hasMany(Recoleccion::class, 'id_asignacion', 'id_asignacion');
    }

    public function puntosRecoleccion(): HasMany
    {
        return $this->hasMany(PuntoRecoleccion::class, 'id_asignacion', 'id_asignacion');
    }
}