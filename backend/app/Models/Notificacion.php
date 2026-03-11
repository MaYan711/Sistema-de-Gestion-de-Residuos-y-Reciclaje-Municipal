<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    protected $table = 'notificacion';
    protected $primaryKey = 'id_notificacion';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'tipo',
        'mensaje',
        'email_destino',
        'leida',
        'fecha',
    ];

    protected $casts = [
        'leida' => 'boolean',
        'fecha' => 'datetime',
    ];
}