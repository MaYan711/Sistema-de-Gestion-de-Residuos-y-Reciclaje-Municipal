<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ciudadano extends Model
{
    protected $table = 'ciudadano';
    protected $primaryKey = 'id_ciudadano';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'nombre',
        'telefono',
        'email',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}