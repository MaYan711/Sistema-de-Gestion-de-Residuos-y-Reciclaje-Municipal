<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ContenedorAlertaService
{
    public function procesarAlertas(int $idContenedor, float $nivelAnterior, float $nivelNuevo): void
    {
        $contenedor = DB::table('contenedor as c')
            ->join('punto_verde as pv', 'pv.id_punto_verde', '=', 'c.id_punto_verde')
            ->join('tipo_material as tm', 'tm.id_tipo', '=', 'c.id_tipo_material')
            ->leftJoin('usuario as u', 'u.id_usuario', '=', 'pv.id_encargado')
            ->select([
                'c.id_contenedor',
                'c.codigo',
                'c.nivel_llenado',
                'c.estado',
                'pv.id_punto_verde',
                'pv.nombre as punto_verde_nombre',
                'pv.id_encargado',
                'tm.nombre as tipo_material_nombre',
                'u.email as email_encargado',
            ])
            ->where('c.id_contenedor', $idContenedor)
            ->first();

        if (!$contenedor) {
            return;
        }

        if ($nivelAnterior < 75 && $nivelNuevo >= 75 && $nivelNuevo < 90) {
            $mensaje = "ALERTA TEMPRANA: Contenedor {$contenedor->codigo} de {$contenedor->tipo_material_nombre} en {$contenedor->punto_verde_nombre} al " . round($nivelNuevo, 2) . "%. Revisar programación de vaciado.";
            $this->crearNotificacion($contenedor->id_encargado, $mensaje, $contenedor->email_encargado);
        }

        if ($nivelAnterior < 90 && $nivelNuevo >= 90 && $nivelNuevo < 100) {
            $mensaje = "ALERTA URGENTE: Contenedor {$contenedor->codigo} de {$contenedor->tipo_material_nombre} en {$contenedor->punto_verde_nombre} al " . round($nivelNuevo, 2) . "%. Requiere vaciado urgente.";
            $this->crearNotificacion($contenedor->id_encargado, $mensaje, $contenedor->email_encargado);
            $this->crearVaciadoAutomatico($contenedor->id_contenedor, $contenedor->id_encargado, "Contenedor al " . round($nivelNuevo, 2) . "%, vaciado urgente solicitado automáticamente.");
        }

        if ($nivelAnterior < 100 && $nivelNuevo >= 100) {
            $mensaje = "ALERTA CRÍTICA: Contenedor {$contenedor->codigo} de {$contenedor->tipo_material_nombre} en {$contenedor->punto_verde_nombre} al 100%. Contenedor lleno, requiere atención inmediata.";
            $this->crearNotificacion($contenedor->id_encargado, $mensaje, $contenedor->email_encargado);
            $this->crearVaciadoAutomatico($contenedor->id_contenedor, $contenedor->id_encargado, "Contenedor lleno al 100%, vaciado inmediato solicitado automáticamente.");
        }
    }

    private function crearNotificacion(?int $idUsuario, string $mensaje, ?string $emailDestino): void
    {
        DB::table('notificacion')->insert([
            'id_usuario' => $idUsuario,
            'tipo' => 'contenedor',
            'mensaje' => $mensaje,
            'email_destino' => $emailDestino,
            'leida' => false,
            'fecha' => now(),
        ]);
    }

    private function crearVaciadoAutomatico(int $idContenedor, ?int $idUsuario, string $observaciones): void
    {
        $pendiente = DB::table('vaciado_contenedor')
            ->where('id_contenedor', $idContenedor)
            ->where('estado', 'programado')
            ->exists();

        if ($pendiente) {
            return;
        }

        if (!$idUsuario) {
            return;
        }

        DB::table('vaciado_contenedor')->insert([
            'id_contenedor' => $idContenedor,
            'id_usuario' => $idUsuario,
            'fecha_prog' => now()->toDateString(),
            'fecha_realizado' => null,
            'estado' => 'programado',
            'observaciones' => $observaciones,
        ]);
    }
}