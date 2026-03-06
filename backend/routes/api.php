<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PuntoVerdeController;
use App\Http\Controllers\Api\DenunciaController;
use App\Http\Controllers\Api\DenunciaPublicController;
use App\Http\Controllers\Api\FotoDenunciaController;
use App\Http\Controllers\Api\CuadrillaController;

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
    
});