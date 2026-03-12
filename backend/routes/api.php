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
use App\Http\Controllers\Api\RecoleccionController;
use App\Http\Controllers\Api\PortalRutaPublicController;
use App\Http\Controllers\Api\PuntoRecoleccionController;
use App\Http\Controllers\Api\TipoMaterialController;
use App\Http\Controllers\Api\ContenedorController;
use App\Http\Controllers\Api\EntregaMaterialController;
use App\Http\Controllers\Api\VaciadoContenedorController;
use App\Http\Controllers\Api\NotificacionController;
use App\Http\Controllers\Api\ReportesReciclajeController;
use App\Http\Controllers\Api\ReportesDenunciasController;
use App\Http\Controllers\Api\ReportesRecoleccionController;
use App\Http\Controllers\Api\UsuarioController;

Route::get('/portal-rutas/zonas', [PortalRutaPublicController::class, 'zonas']);
Route::get('/portal-rutas', [PortalRutaPublicController::class, 'rutas']);
Route::get('/portal-rutas/{id}', [PortalRutaPublicController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-ciudadano', [AuthController::class, 'registerCiudadano']);
Route::get('/denuncias/seguimiento/{codigo}', [DenunciaController::class, 'seguimientoPublico']);

Route::middleware('auth:sanctum')->group(function () {

  Route::get('/me', [AuthController::class, 'me']);
  Route::post('/logout', [AuthController::class, 'logout']);

  Route::middleware('role:administrador')->group(function () {
    Route::get('/usuarios/roles', [UsuarioController::class, 'roles']);
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
    Route::patch('/usuarios/{id}/toggle-activo', [UsuarioController::class, 'toggleActivo']);

    Route::post('/puntos-verdes', [PuntoVerdeController::class, 'store']);
    Route::put('/puntos-verdes/{id}', [PuntoVerdeController::class, 'update']);
    Route::delete('/puntos-verdes/{id}', [PuntoVerdeController::class, 'destroy']);
    Route::patch('/puntos-verdes/{id}/deactivate', [PuntoVerdeController::class, 'deactivate']);

    Route::post('/zonas', [ZonaController::class, 'store']);
    Route::put('/zonas/{id}', [ZonaController::class, 'update']);
    Route::delete('/zonas/{id}', [ZonaController::class, 'destroy']);
    Route::patch('/zonas/{id}/restore', [ZonaController::class, 'restore']);

    Route::post('/rutas', [RutaController::class, 'store']);
    Route::put('/rutas/{id}', [RutaController::class, 'update']);
    Route::delete('/rutas/{id}', [RutaController::class, 'destroy']);
    Route::patch('/rutas/{id}/restore', [RutaController::class, 'restore']);

    Route::post('/camiones', [CamionController::class, 'store']);
    Route::put('/camiones/{id}', [CamionController::class, 'update']);
    Route::delete('/camiones/{id}', [CamionController::class, 'destroy']);

    Route::post('/asignaciones-ruta', [AsignacionRutaController::class, 'store']);
    Route::put('/asignaciones-ruta/{id}', [AsignacionRutaController::class, 'update']);
    Route::delete('/asignaciones-ruta/{id}', [AsignacionRutaController::class, 'destroy']);

    Route::post('/tipos-material', [TipoMaterialController::class, 'store']);
    Route::put('/tipos-material/{id}', [TipoMaterialController::class, 'update']);
    Route::delete('/tipos-material/{id}', [TipoMaterialController::class, 'destroy']);
    Route::patch('/tipos-material/{id}/restore', [TipoMaterialController::class, 'restore']);

    Route::post('/contenedores', [ContenedorController::class, 'store']);
    Route::put('/contenedores/{id}', [ContenedorController::class, 'update']);
    Route::delete('/contenedores/{id}', [ContenedorController::class, 'destroy']);
    Route::patch('/contenedores/{id}/restore', [ContenedorController::class, 'restore']);
  });

  Route::middleware('role:administrador,coordinador')->group(function () {
    Route::get('/dashboard/kpis', [DashboardController::class, 'kpis']);

    Route::get('/zonas', [ZonaController::class, 'index']);
    Route::get('/zonas/{id}', [ZonaController::class, 'show']);

    Route::get('/rutas', [RutaController::class, 'index']);
    Route::get('/rutas/{id}', [RutaController::class, 'show']);

    Route::get('/camiones', [CamionController::class, 'index']);
    Route::get('/camiones/conductores', [CamionController::class, 'conductores']);
    Route::get('/camiones/{id}', [CamionController::class, 'show']);

    Route::get('/asignaciones-ruta', [AsignacionRutaController::class, 'index']);
    Route::get('/asignaciones-ruta/rutas-disponibles', [AsignacionRutaController::class, 'rutasDisponibles']);
    Route::get('/asignaciones-ruta/camiones-disponibles', [AsignacionRutaController::class, 'camionesDisponibles']);
    Route::get('/asignaciones-ruta/{id}', [AsignacionRutaController::class, 'show']);

    Route::get('/recolecciones', [RecoleccionController::class, 'index']);
    Route::get('/recolecciones/asignaciones-disponibles', [RecoleccionController::class, 'asignacionesDisponibles']);
    Route::get('/recolecciones/{id}', [RecoleccionController::class, 'show']);
    Route::post('/recolecciones', [RecoleccionController::class, 'store']);
    Route::put('/recolecciones/{id}', [RecoleccionController::class, 'update']);
    Route::delete('/recolecciones/{id}', [RecoleccionController::class, 'destroy']);

    Route::patch('/puntos-recoleccion/{id}/recolectado', [PuntoRecoleccionController::class, 'marcarRecolectado']);
    Route::patch('/puntos-recoleccion/{id}/pendiente', [PuntoRecoleccionController::class, 'desmarcarRecolectado']);
  });

  Route::middleware('role:administrador,operador,coordinador')->group(function () {
    Route::get('/puntos-verdes', [PuntoVerdeController::class, 'index']);
    Route::get('/tipos-material', [TipoMaterialController::class, 'index']);
    Route::get('/tipos-material/{id}', [TipoMaterialController::class, 'show']);

    Route::get('/contenedores', [ContenedorController::class, 'index']);
    Route::get('/contenedores/{id}', [ContenedorController::class, 'show']);

    Route::get('/notificaciones/contenedores', [NotificacionController::class, 'indexContenedores']);
    Route::patch('/notificaciones/{id}/leida', [NotificacionController::class, 'marcarLeida']);

    Route::get('/entregas-material/catalogos', [EntregaMaterialController::class, 'catalogos']);
    Route::get('/entregas-material', [EntregaMaterialController::class, 'index']);
    Route::post('/entregas-material', [EntregaMaterialController::class, 'store']);

    Route::get('/vaciados', [VaciadoContenedorController::class, 'index']);
    Route::post('/vaciados/programar', [VaciadoContenedorController::class, 'programar']);
    Route::patch('/vaciados/{id}/completar', [VaciadoContenedorController::class, 'completar']);
  });

  Route::middleware('role:administrador,coordinador,ciudadano')->group(function () {
    Route::get('/denuncias', [DenunciaController::class, 'index']);
    Route::post('/denuncias', [DenunciaController::class, 'store']);
    Route::put('/denuncias/{id}', [DenunciaController::class, 'update']);
    Route::delete('/denuncias/{id}', [DenunciaController::class, 'destroy']);
    Route::patch('/denuncias/{id}/estado', [DenunciaController::class, 'changeEstado']);
    Route::patch('/denuncias/{id}/asignar', [DenunciaController::class, 'assign']);

    Route::get('/denuncias/{id}/fotos', [FotoDenunciaController::class, 'index']);
    Route::post('/denuncias/{id}/fotos', [FotoDenunciaController::class, 'store']);

    Route::get('/cuadrillas', [CuadrillaController::class, 'index']);
  });

  Route::middleware('role:administrador,coordinador,auditor')->group(function () {
    Route::get('/reportes/reciclaje/tipo', [ReportesReciclajeController::class, 'reciclajePorTipo']);
    Route::get('/reportes/reciclaje/puntos-verdes', [ReportesReciclajeController::class, 'puntosVerdesMasActivos']);
    Route::get('/reportes/reciclaje/tendencia', [ReportesReciclajeController::class, 'tendenciaReciclaje']);

    Route::get('/reportes/denuncias/estado', [ReportesDenunciasController::class, 'denunciasPorEstado']);
    Route::get('/reportes/denuncias/tiempo-promedio', [ReportesDenunciasController::class, 'tiempoPromedioAtencion']);
    Route::get('/reportes/denuncias/zonas', [ReportesDenunciasController::class, 'zonasConMasDenuncias']);

    Route::get('/reportes/recoleccion/dia', [ReportesRecoleccionController::class, 'recoleccionPorDia']);
    Route::get('/reportes/recoleccion/ruta', [ReportesRecoleccionController::class, 'recoleccionPorRuta']);
    Route::get('/reportes/recoleccion/zona', [ReportesRecoleccionController::class, 'recoleccionPorZona']);
  });

});