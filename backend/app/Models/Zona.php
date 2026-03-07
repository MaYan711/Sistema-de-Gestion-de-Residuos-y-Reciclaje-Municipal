<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Zona extends Model
{
    protected $table = 'zona';
    protected $primaryKey = 'id_zona';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'tipo',
        'densidad_pobla',
        'activo',
        'latitud_centro',
        'longitud_centro',
        'limites',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'densidad_pobla' => 'float',
        'latitud_centro' => 'float',
        'longitud_centro' => 'float',
        'limites' => 'array',
    ];

    public function rutas(): HasMany
    {
        return $this->hasMany(Ruta::class, 'id_zona', 'id_zona');
    }
}