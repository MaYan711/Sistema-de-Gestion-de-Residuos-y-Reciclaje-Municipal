<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Camion extends Model
{
    protected $table = 'camion';
    protected $primaryKey = 'id_camion';
    public $timestamps = false;

    protected $fillable = [
        'id_conductor',
        'placa',
        'capacidad',
        'estado',
        'marca',
        'modelo',
        'anio',
    ];

    protected $casts = [
        'capacidad' => 'float',
        'anio' => 'integer',
        'id_conductor' => 'integer',
    ];

    public function conductor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_conductor', 'id_usuario');
    }

    public function asignaciones(): HasMany
    {
        return $this->hasMany(AsignacionRuta::class, 'id_camion', 'id_camion');
    }
}