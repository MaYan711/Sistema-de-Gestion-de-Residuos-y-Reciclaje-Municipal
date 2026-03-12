<?php

namespace App\Services;

use App\Models\FotoDenuncia;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class FotoDenunciaService
{
    public function listarPorDenuncia(int $idDenuncia): array
    {
        return FotoDenuncia::query()
            ->where('id_denuncia', $idDenuncia)
            ->orderBy('fecha_subida', 'asc')
            ->get()
            ->map(fn ($foto) => [
                'id_foto' => $foto->id_foto,
                'id_denuncia' => $foto->id_denuncia,
                'url_foto' => $this->resolverUrl($foto->url_foto),
                'tipo_foto' => $foto->tipo_foto,
                'fecha_subida' => $foto->fecha_subida,
            ])
            ->toArray();
    }

    public function subir(int $idDenuncia, string $tipoFoto, UploadedFile $archivo): array
    {
        $tiposPermitidos = ['denuncia', 'antes', 'despues'];

        if (!in_array($tipoFoto, $tiposPermitidos, true)) {
            throw ValidationException::withMessages([
                'tipo_foto' => ['Tipo de foto no válido.'],
            ]);
        }

        $ruta = $archivo->store('denuncias', 'public');

        $foto = FotoDenuncia::query()->create([
            'id_denuncia' => $idDenuncia,
            'url_foto' => $ruta,
            'tipo_foto' => $tipoFoto,
        ]);

        return [
            'id_foto' => $foto->id_foto,
            'id_denuncia' => $foto->id_denuncia,
            'url_foto' => $this->resolverUrl($foto->url_foto),
            'tipo_foto' => $foto->tipo_foto,
            'fecha_subida' => $foto->fecha_subida,
        ];
    }

    private function resolverUrl(string $ruta): string
    {
        if (str_starts_with($ruta, 'http://') || str_starts_with($ruta, 'https://')) {
            return $ruta;
        }

        return asset('storage/' . ltrim($ruta, '/'));
    }
}