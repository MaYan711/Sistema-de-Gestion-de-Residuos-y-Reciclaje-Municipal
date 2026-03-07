<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ruta extends Model
{
    protected $table = 'ruta';
    protected $primaryKey = 'id_ruta';
    public $timestamps = false;

    protected $fillable = [
        'id_zona',
        'nombre',
        'coor_ini',
        'coor_fin',
        'puntos_inter',
        'distancia',
        'dias_recole',
        'horario',
        'tipo_residuo',
        'activo',
    ];

    protected $casts = [
        'coor_ini' => 'array',
        'coor_fin' => 'array',
        'puntos_inter' => 'array',
        'distancia' => 'float',
        'activo' => 'boolean',
    ];

    public function zona(): BelongsTo
    {
        return $this->belongsTo(Zona::class, 'id_zona', 'id_zona');
    }

    public function asignaciones(): HasMany
    {
        return $this->hasMany(AsignacionRuta::class, 'id_ruta', 'id_ruta');
    }

    public function puntosRecoleccion(): HasMany
    {
        return $this->hasMany(PuntoRecoleccion::class, 'id_ruta', 'id_ruta');
    }

    public function recolecciones(): HasMany
    {
        return $this->hasMany(Recoleccion::class, 'id_ruta', 'id_ruta');
    }
}