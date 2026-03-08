<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recoleccion extends Model
{
    protected $table = 'recoleccion';
    protected $primaryKey = 'id_recoleccion';
    public $timestamps = false;

    protected $fillable = [
        'id_asignacion',
        'estado',
        'horario_ini',
        'horario_fin',
        'basura_ton',
        'observaciones',
        'updated_at',
    ];

    protected $casts = [
        'id_asignacion' => 'integer',
        'basura_ton' => 'float',
        'updated_at' => 'datetime',
    ];

    public function asignacion(): BelongsTo
    {
        return $this->belongsTo(AsignacionRuta::class, 'id_asignacion', 'id_asignacion');
    }

    public function incidencias(): HasMany
    {
        return $this->hasMany(IncidenciaRuta::class, 'id_recoleccion', 'id_recoleccion');
    }
}