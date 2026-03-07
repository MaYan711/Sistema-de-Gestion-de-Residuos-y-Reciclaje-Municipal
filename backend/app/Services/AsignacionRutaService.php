<?php

namespace App\Services;

use App\Models\AsignacionRuta;
use App\Models\Camion;
use App\Models\PuntoRecoleccion;
use App\Models\Ruta;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AsignacionRutaService
{
    public function listar(array $filters = [])
    {
        $query = AsignacionRuta::with([
            'ruta.zona',
            'camion.conductor',
            'puntosRecoleccion',
        ]);
        if (!empty($filters['id_ruta'])) {
            $query->where('id_ruta', $filters['id_ruta']);
        }

        if (!empty($filters['id_camion'])) {
            $query->where('id_camion', $filters['id_camion']);
        }

        if (!empty($filters['fecha_asig'])) {
            $query->whereDate('fecha_asig', $filters['fecha_asig']);
        }

        return $query->orderByDesc('id_asignacion')->get();
    }

    public function obtener(int $id): AsignacionRuta
    {
        return AsignacionRuta::with([
            'ruta.zona',
            'camion.conductor',
            'puntosRecoleccion',
        ])->findOrFail($id);
    }

    public function crear(array $data): AsignacionRuta
    {
        return DB::transaction(function () use ($data) {
            $ruta = Ruta::with('zona')->findOrFail($data['id_ruta']);
            $camion = Camion::findOrFail($data['id_camion']);
            $fecha = Carbon::parse($data['fecha_asig']);

            if (!$ruta->activo) {
                throw ValidationException::withMessages([
                    'id_ruta' => ['La ruta seleccionada no está activa.'],
                ]);
            }

            if ($camion->estado !== 'operativo') {
                throw ValidationException::withMessages([
                    'id_camion' => ['El camión debe estar en estado operativo para asignarse.'],
                ]);
            }

            $pesoEstimado = array_key_exists('peso_estimado', $data) && $data['peso_estimado'] !== null
                ? (float) $data['peso_estimado']
                : $this->calcularPesoEstimado($ruta, $fecha);

            $capacidadKg = $camion->capacidad * 1000;

            if ($pesoEstimado > $capacidadKg) {
                throw ValidationException::withMessages([
                    'peso_estimado' => ['La capacidad del camión no es suficiente para el peso estimado de la ruta.'],
                ]);
            }

            $yaExiste = AsignacionRuta::query()
                ->where('id_camion', $data['id_camion'])
                ->whereDate('fecha_asig', $data['fecha_asig'])
                ->exists();

            if ($yaExiste) {
                throw ValidationException::withMessages([
                    'id_camion' => ['Ese camión ya tiene una asignación para esa fecha.'],
                ]);
            }

            $asignacion = AsignacionRuta::create([
                'id_ruta' => $data['id_ruta'],
                'id_camion' => $data['id_camion'],
                'fecha_asig' => $data['fecha_asig'],
                'peso_estimado' => $pesoEstimado,
            ]);

            $this->generarPuntosRecoleccion($asignacion, $ruta, $fecha);

            return $asignacion->load([
                'ruta.zona',
                'camion.conductor',
                'puntosRecoleccion',
            ]);
        });
    }

    public function actualizar(int $id, array $data): AsignacionRuta
    {
        return DB::transaction(function () use ($id, $data) {
            $asignacion = AsignacionRuta::findOrFail($id);
            $ruta = Ruta::with('zona')->findOrFail($data['id_ruta']);
            $camion = Camion::findOrFail($data['id_camion']);
            $fecha = Carbon::parse($data['fecha_asig']);

            if (!$ruta->activo) {
                throw ValidationException::withMessages([
                    'id_ruta' => ['La ruta seleccionada no está activa.'],
                ]);
            }

            if ($camion->estado !== 'operativo') {
                throw ValidationException::withMessages([
                    'id_camion' => ['El camión debe estar en estado operativo para asignarse.'],
                ]);
            }

            $pesoEstimado = array_key_exists('peso_estimado', $data) && $data['peso_estimado'] !== null
                ? (float) $data['peso_estimado']
                : $this->calcularPesoEstimado($ruta, $fecha);

            $capacidadKg = $camion->capacidad * 1000;

            if ($pesoEstimado > $capacidadKg) {
                throw ValidationException::withMessages([
                    'peso_estimado' => ['La capacidad del camión no es suficiente para el peso estimado de la ruta.'],
                ]);
            }

            $yaExiste = AsignacionRuta::query()
                ->where('id_camion', $data['id_camion'])
                ->whereDate('fecha_asig', $data['fecha_asig'])
                ->where('id_asignacion', '!=', $id)
                ->exists();

            if ($yaExiste) {
                throw ValidationException::withMessages([
                    'id_camion' => ['Ese camión ya tiene una asignación para esa fecha.'],
                ]);
            }

            $asignacion->update([
                'id_ruta' => $data['id_ruta'],
                'id_camion' => $data['id_camion'],
                'fecha_asig' => $data['fecha_asig'],
                'peso_estimado' => $pesoEstimado,
            ]);

            PuntoRecoleccion::where('id_asignacion', $asignacion->id_asignacion)->delete();

            $this->generarPuntosRecoleccion($asignacion, $ruta, $fecha);

            return $asignacion->fresh()->load([
                'ruta.zona',
                'camion.conductor',
                'puntosRecoleccion',
            ]);
        });
    }

    public function eliminar(int $id): void
    {
        $asignacion = AsignacionRuta::findOrFail($id);
        PuntoRecoleccion::where('id_asignacion', $asignacion->id_asignacion)->delete();
        $asignacion->delete();
    }

    public function rutasDisponibles()
    {
        return Ruta::with('zona')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();
    }

    public function camionesDisponibles()
    {
        return Camion::with('conductor')
            ->where('estado', 'operativo')
            ->orderBy('placa')
            ->get();
    }

    private function calcularPesoEstimado(Ruta $ruta, Carbon $fecha): float
    {
        $densidad = (float) ($ruta->zona->densidad_pobla ?? 7000);
        $tipoZona = $ruta->zona->tipo ?? 'residencial';

        $base = 2500;

        if ($tipoZona === 'comercial') {
            $base += 1000;
        }

        if ($tipoZona === 'industrial') {
            $base += 1500;
        }

        if ($densidad >= 10000) {
            $base += 1200;
        } elseif ($densidad >= 8000) {
            $base += 700;
        } else {
            $base += 300;
        }

        $diaNumero = (int) $fecha->dayOfWeek;
        if ($diaNumero === 0 || $diaNumero === 6) {
            $base += 500;
        }

        $historialPromedio = AsignacionRuta::query()
            ->where('id_ruta', $ruta->id_ruta)
            ->avg('peso_estimado');

        if ($historialPromedio) {
            $base = ($base * 0.6) + ($historialPromedio * 0.4);
        }

        return round($base, 2);
    }

    private function generarPuntosRecoleccion(AsignacionRuta $asignacion, Ruta $ruta, Carbon $fecha): void
    {
        $puntosRuta = $this->obtenerPuntosRuta($ruta);

        if (count($puntosRuta) < 2) {
            return;
        }

        $cantidadPuntos = random_int(15, 30);

        $tipoZona = $ruta->zona->tipo ?? 'residencial';
        $densidad = (float) ($ruta->zona->densidad_pobla ?? 7000);
        $diaNumero = (int) $fecha->dayOfWeek;

        for ($i = 1; $i <= $cantidadPuntos; $i++) {
            $posicion = $this->interpolarPuntoEnRuta($puntosRuta, $i / ($cantidadPuntos + 1));
            $volumen = $this->generarVolumenEstimado($tipoZona, $densidad, $diaNumero);

            PuntoRecoleccion::create([
                'id_asignacion' => $asignacion->id_asignacion,
                'latitud' => $posicion['lat'],
                'longitud' => $posicion['lng'],
                'volumen_estimado' => $volumen,
                'orden' => $i,
                'recolectado' => false,
                'hora_recoleccion' => null,
            ]);
        }
    }

    private function obtenerPuntosRuta(Ruta $ruta): array
    {
        $puntos = [];

        if (is_array($ruta->coor_ini) && isset($ruta->coor_ini['lat'], $ruta->coor_ini['lng'])) {
            $puntos[] = [
                'lat' => (float) $ruta->coor_ini['lat'],
                'lng' => (float) $ruta->coor_ini['lng'],
            ];
        }

        if (is_array($ruta->puntos_inter)) {
            foreach ($ruta->puntos_inter as $punto) {
                if (isset($punto['lat'], $punto['lng'])) {
                    $puntos[] = [
                        'lat' => (float) $punto['lat'],
                        'lng' => (float) $punto['lng'],
                    ];
                }
            }
        }

        if (is_array($ruta->coor_fin) && isset($ruta->coor_fin['lat'], $ruta->coor_fin['lng'])) {
            $puntos[] = [
                'lat' => (float) $ruta->coor_fin['lat'],
                'lng' => (float) $ruta->coor_fin['lng'],
            ];
        }

        return $puntos;
    }

    private function interpolarPuntoEnRuta(array $puntos, float $fraccion): array
    {
        $segmentos = [];
        $distanciaTotal = 0.0;

        for ($i = 0; $i < count($puntos) - 1; $i++) {
            $a = $puntos[$i];
            $b = $puntos[$i + 1];
            $dist = $this->distanciaEntrePuntos($a, $b);

            $segmentos[] = [
                'inicio' => $a,
                'fin' => $b,
                'distancia' => $dist,
            ];

            $distanciaTotal += $dist;
        }

        if ($distanciaTotal <= 0) {
            return $puntos[0];
        }

        $objetivo = $distanciaTotal * $fraccion;
        $acumulado = 0.0;

        foreach ($segmentos as $segmento) {
            $nuevoAcumulado = $acumulado + $segmento['distancia'];

            if ($objetivo <= $nuevoAcumulado) {
                $distSegmento = $segmento['distancia'];
                $proporcion = $distSegmento > 0 ? ($objetivo - $acumulado) / $distSegmento : 0;

                return [
                    'lat' => round(
                        $segmento['inicio']['lat'] + (($segmento['fin']['lat'] - $segmento['inicio']['lat']) * $proporcion),
                        6
                    ),
                    'lng' => round(
                        $segmento['inicio']['lng'] + (($segmento['fin']['lng'] - $segmento['inicio']['lng']) * $proporcion),
                        6
                    ),
                ];
            }

            $acumulado = $nuevoAcumulado;
        }

        return end($puntos);
    }

    private function distanciaEntrePuntos(array $a, array $b): float
    {
        $latDiff = $b['lat'] - $a['lat'];
        $lngDiff = $b['lng'] - $a['lng'];

        return sqrt(($latDiff * $latDiff) + ($lngDiff * $lngDiff));
    }

    private function generarVolumenEstimado(string $tipoZona, float $densidad, int $diaNumero): float
    {
        $min = 50;
        $max = 500;

        if ($tipoZona === 'comercial') {
            $min += 40;
            $max += 80;
        }

        if ($tipoZona === 'industrial') {
            $min += 70;
            $max += 120;
        }

        if ($densidad >= 10000) {
            $min += 40;
            $max += 60;
        } elseif ($densidad >= 8000) {
            $min += 20;
            $max += 30;
        }

        if ($diaNumero === 0 || $diaNumero === 6) {
            $min += 20;
            $max += 40;
        }

        $min = min($min, 500);
        $max = min($max, 500);

        if ($min > $max) {
            $min = $max;
        }

        return (float) random_int((int) $min, (int) $max);
    }
}