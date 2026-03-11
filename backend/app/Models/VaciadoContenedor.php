<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VaciadoContenedor extends Model
{
    protected $table = 'vaciado_contenedor';
    protected $primaryKey = 'id_vaciado';
    public $timestamps = false;

    protected $fillable = [
        'id_contenedor',
        'id_usuario',
        'fecha_prog',
        'fecha_realizado',
        'estado',
        'observaciones'
    ];
}