<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PuntoVerdeController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/me', [AuthController::class, 'me']);
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/dashboard/kpis', [DashboardController::class, 'kpis']);

  Route::get('/puntos-verdes', [PuntoVerdeController::class, 'index']);
  Route::post('/puntos-verdes', [PuntoVerdeController::class, 'store']);
  Route::put('/puntos-verdes/{id}', [PuntoVerdeController::class, 'update']);
  Route::delete('/puntos-verdes/{id}', [PuntoVerdeController::class, 'destroy']);
  Route::patch('/puntos-verdes/{id}/deactivate', [PuntoVerdeController::class, 'deactivate']);
});