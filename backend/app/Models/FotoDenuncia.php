<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FotoDenuncia extends Model
{
    protected $table = 'foto_denuncia';
    protected $primaryKey = 'id_foto';
    public $timestamps = false;

    protected $fillable = [
        'id_denuncia',
        'url_foto',
        'tipo_foto',
    ];
}