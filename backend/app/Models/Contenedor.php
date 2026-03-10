<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contenedor extends Model
{
    protected $table = 'contenedor';
    protected $primaryKey = 'id_contenedor';
    public $timestamps = false;

    protected $fillable = [
        'id_punto_verde',
        'id_tipo_material',
        'capacidad_kg',
        'nivel_llenado',
        'estado',
        'ultimo_vaciado',
        'codigo',
        'activo',
    ];

    protected $casts = [
        'capacidad_kg' => 'float',
        'nivel_llenado' => 'float',
        'activo' => 'boolean',
        'ultimo_vaciado' => 'datetime',
    ];
}