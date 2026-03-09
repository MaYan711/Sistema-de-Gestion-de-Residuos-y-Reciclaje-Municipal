<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoMaterial extends Model
{
    protected $table = 'tipo_material';
    protected $primaryKey = 'id_tipo';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'unidad_medida',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function contenedores(): HasMany
    {
        return $this->hasMany(Contenedor::class, 'id_tipo_material', 'id_tipo');
    }
}