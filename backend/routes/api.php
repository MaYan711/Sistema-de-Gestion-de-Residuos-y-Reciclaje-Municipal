<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PuntoVerdeController;
use App\Http\Controllers\Api\DenunciaController;
use App\Http\Controllers\Api\DenunciaPublicController;
use App\Http\Controllers\Api\FotoDenunciaController;
use App\Http\Controllers\Api\CuadrillaController;
use App\Http\Controllers\Api\ZonaController;
use App\Http\Controllers\Api\RutaController;
use App\Http\Controllers\Api\CamionController;
use App\Http\Controllers\Api\AsignacionRutaController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/denuncias/seguimiento/{codigo}', [DenunciaController::class, 'seguimientoPublico']);

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/me', [AuthController::class, 'me']);
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/dashboard/kpis', [DashboardController::class, 'kpis']);

  Route::get('/puntos-verdes', [PuntoVerdeController::class, 'index']);
  Route::post('/puntos-verdes', [PuntoVerdeController::class, 'store']);
  Route::put('/puntos-verdes/{id}', [PuntoVerdeController::class, 'update']);
  Route::delete('/puntos-verdes/{id}', [PuntoVerdeController::class, 'destroy']);
  Route::patch('/puntos-verdes/{id}/deactivate', [PuntoVerdeController::class, 'deactivate']);

    Route::get('/denuncias', [DenunciaController::class, 'index']);
    Route::post('/denuncias', [DenunciaController::class, 'store']);
    Route::put('/denuncias/{id}', [DenunciaController::class, 'update']);
    Route::delete('/denuncias/{id}', [DenunciaController::class, 'destroy']);
    Route::patch('/denuncias/{id}/estado', [DenunciaController::class, 'changeEstado']);

    //Route::get('/denuncias/seguimiento/{codigo}', [DenunciaPublicController::class, 'byCodigo']);

    Route::get('/denuncias/{id}/fotos', [FotoDenunciaController::class, 'index']);
    Route::post('/denuncias/{id}/fotos', [FotoDenunciaController::class, 'store']);

    Route::patch('/denuncias/{id}/asignar', [DenunciaController::class, 'assign']);
    //Route::get('/denuncias/seguimiento/{codigo}', [DenunciaController::class, 'seguimientoPublico'])->withoutMiddleware(['auth:sanctum']);

    Route::get('/cuadrillas', [CuadrillaController::class, 'index']);

     Route::get('/zonas', [ZonaController::class, 'index']);
    Route::get('/zonas/{id}', [ZonaController::class, 'show']);
    Route::post('/zonas', [ZonaController::class, 'store']);
    Route::put('/zonas/{id}', [ZonaController::class, 'update']);
    Route::delete('/zonas/{id}', [ZonaController::class, 'destroy']);
    Route::patch('/zonas/{id}/restore', [ZonaController::class, 'restore']);

    Route::get('/rutas', [RutaController::class, 'index']);
    Route::get('/rutas/{id}', [RutaController::class, 'show']);
    Route::post('/rutas', [RutaController::class, 'store']);
    Route::put('/rutas/{id}', [RutaController::class, 'update']);
    Route::delete('/rutas/{id}', [RutaController::class, 'destroy']);
    Route::patch('/rutas/{id}/restore', [RutaController::class, 'restore']);
    
    Route::get('/camiones', [CamionController::class, 'index']);
    Route::get('/camiones/conductores', [CamionController::class, 'conductores']);
    Route::get('/camiones/{id}', [CamionController::class, 'show']);
    Route::post('/camiones', [CamionController::class, 'store']);
    Route::put('/camiones/{id}', [CamionController::class, 'update']);
    Route::delete('/camiones/{id}', [CamionController::class, 'destroy']);

     Route::get('/asignaciones-ruta', [AsignacionRutaController::class, 'index']);
    Route::get('/asignaciones-ruta/rutas-disponibles', [AsignacionRutaController::class, 'rutasDisponibles']);
    Route::get('/asignaciones-ruta/camiones-disponibles', [AsignacionRutaController::class, 'camionesDisponibles']);
    Route::get('/asignaciones-ruta/{id}', [AsignacionRutaController::class, 'show']);
    Route::post('/asignaciones-ruta', [AsignacionRutaController::class, 'store']);
    Route::put('/asignaciones-ruta/{id}', [AsignacionRutaController::class, 'update']);
    Route::delete('/asignaciones-ruta/{id}', [AsignacionRutaController::class, 'destroy']);
});