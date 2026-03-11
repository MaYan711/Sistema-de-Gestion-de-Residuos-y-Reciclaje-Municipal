<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntregaMaterial extends Model
{
    protected $table = 'entrega_material';
    protected $primaryKey = 'id_entrega';
    public $timestamps = false;

    protected $fillable = [
        'id_contenedor',
        'id_ciudadano',
        'cantidad_kg',
        'fecha_entrega'
    ];

    protected $casts = [
        'cantidad_kg' => 'float',
        'fecha_entrega' => 'datetime'
    ];
}