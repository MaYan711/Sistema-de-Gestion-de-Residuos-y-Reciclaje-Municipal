DROP TABLE IF EXISTS notificacion             CASCADE;
DROP TABLE IF EXISTS seguimiento_denuncia     CASCADE;
DROP TABLE IF EXISTS foto_denuncia            CASCADE;
DROP TABLE IF EXISTS denuncia                 CASCADE;
DROP TABLE IF EXISTS cuadrilla_limpieza       CASCADE;
DROP TABLE IF EXISTS vaciado_contenedor       CASCADE;
DROP TABLE IF EXISTS entrega_material         CASCADE;
DROP TABLE IF EXISTS contenedor               CASCADE;
DROP TABLE IF EXISTS tipo_material            CASCADE;
DROP TABLE IF EXISTS punto_verde              CASCADE;
DROP TABLE IF EXISTS incidencia_ruta          CASCADE;
DROP TABLE IF EXISTS punto_recoleccion        CASCADE;
DROP TABLE IF EXISTS recoleccion              CASCADE;
DROP TABLE IF EXISTS asignacion_ruta          CASCADE;
DROP TABLE IF EXISTS camion                   CASCADE;
DROP TABLE IF EXISTS ruta                     CASCADE;
DROP TABLE IF EXISTS zona                     CASCADE;
DROP TABLE IF EXISTS ciudadano                CASCADE;
DROP TABLE IF EXISTS usuario                  CASCADE;
DROP TABLE IF EXISTS rol                      CASCADE;

-- Eliminar tipos ENUM si existen
DROP TYPE IF EXISTS tipo_zona_enum            CASCADE;
DROP TYPE IF EXISTS tipo_residuo_enum         CASCADE;
DROP TYPE IF EXISTS estado_camion_enum        CASCADE;
DROP TYPE IF EXISTS estado_recoleccion_enum   CASCADE;
DROP TYPE IF EXISTS estado_contenedor_enum    CASCADE;
DROP TYPE IF EXISTS estado_denuncia_enum      CASCADE;
DROP TYPE IF EXISTS tamano_denuncia_enum      CASCADE;
DROP TYPE IF EXISTS tipo_foto_enum            CASCADE;
DROP TYPE IF EXISTS tipo_notif_enum           CASCADE;
DROP TYPE IF EXISTS estado_vaciado_enum       CASCADE;

-- ============================================================
-- TIPOS ENUM
-- ============================================================

CREATE TYPE tipo_zona_enum          AS ENUM ('residencial', 'comercial', 'industrial');
CREATE TYPE tipo_residuo_enum       AS ENUM ('organico', 'inorganico', 'mixto');
CREATE TYPE estado_camion_enum      AS ENUM ('operativo', 'mantenimiento', 'fuera_servicio');
CREATE TYPE estado_recoleccion_enum AS ENUM ('programada', 'en_proceso', 'completada', 'incompleta');
CREATE TYPE estado_contenedor_enum  AS ENUM ('disponible', 'lleno', 'en_vaciado');
CREATE TYPE estado_denuncia_enum    AS ENUM ('recibida', 'en_revision', 'asignada', 'en_atencion', 'atendida', 'cerrada');
CREATE TYPE tamano_denuncia_enum    AS ENUM ('pequeno', 'mediano', 'grande');
CREATE TYPE tipo_foto_enum          AS ENUM ('denuncia', 'antes', 'despues');
CREATE TYPE tipo_notif_enum         AS ENUM ('denuncia', 'contenedor', 'ruta', 'sistema');
CREATE TYPE estado_vaciado_enum     AS ENUM ('programado', 'completado', 'cancelado');

-- ============================================================
-- MÓDULO: SEGURIDAD
-- ============================================================

-- Tabla: rol
-- Catálogo de roles del sistema
CREATE TABLE rol (
    id_rol      SERIAL          PRIMARY KEY,
    nombre      VARCHAR(50)     NOT NULL UNIQUE,
    descripcion VARCHAR(200)
);

-- Tabla: usuario
-- Todos los usuarios del sistema (incluye conductores y operadores)
CREATE TABLE usuario (
    id_usuario  SERIAL          PRIMARY KEY,
    id_rol      INTEGER         NOT NULL REFERENCES rol(id_rol),
    nombre      VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    telefono    VARCHAR(50),
    activo      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsqueda por email (login)
CREATE INDEX idx_usuario_email ON usuario(email);

-- ============================================================
-- MÓDULO: PERSONAS
-- ============================================================

-- Tabla: ciudadano
-- Ciudadanos que interactúan sin necesidad de cuenta de usuario
CREATE TABLE ciudadano (
    id_ciudadano    SERIAL          PRIMARY KEY,
    id_usuario      INTEGER         REFERENCES usuario(id_usuario),  -- NULL si es anónimo
    nombre          VARCHAR(100)    NOT NULL,
    telefono        VARCHAR(50),
    email           VARCHAR(150)
);

-- ============================================================
-- MÓDULO: RUTAS DE RECOLECCIÓN
-- ============================================================

-- Tabla: zona
-- Zonas o colonias del municipio
CREATE TABLE zona (
    id_zona             SERIAL              PRIMARY KEY,
    nombre              VARCHAR(100)        NOT NULL,
    tipo                tipo_zona_enum      NOT NULL,
    densidad_pobla      FLOAT               NOT NULL,
    activo              BOOLEAN             NOT NULL DEFAULT TRUE
);

-- Tabla: ruta
-- Rutas de recolección trazadas en el mapa
CREATE TABLE ruta (
    id_ruta         SERIAL              PRIMARY KEY,
    id_zona         INTEGER             NOT NULL REFERENCES zona(id_zona),
    nombre          VARCHAR(100)        NOT NULL,
    coor_ini        JSONB               NOT NULL,  -- {"lat": x, "lng": y}
    coor_fin        JSONB               NOT NULL,  -- {"lat": x, "lng": y}
    puntos_inter    JSONB,                         -- array de coordenadas intermedias
    distancia       FLOAT               NOT NULL,  -- en kilómetros
    dias_recole     VARCHAR(100)        NOT NULL,  -- "Lunes,Miercoles,Viernes"
    horario         VARCHAR(50)         NOT NULL,  -- "06:00-12:00"
    tipo_residuo    tipo_residuo_enum   NOT NULL,
    activo          BOOLEAN             NOT NULL DEFAULT TRUE
);

-- Tabla: camion
-- Vehículos recolectores disponibles
CREATE TABLE camion (
    id_camion       SERIAL              PRIMARY KEY,
    id_conductor    INTEGER             REFERENCES usuario(id_usuario),
    placa           VARCHAR(20)         NOT NULL UNIQUE,
    capacidad       FLOAT               NOT NULL CHECK (capacidad > 0),
    estado          estado_camion_enum  NOT NULL DEFAULT 'operativo',
    marca           VARCHAR(50),
    modelo          VARCHAR(50),
    anio            INTEGER
);

-- Tabla: asignacion_ruta
-- Asignación de un camión a una ruta en una fecha específica
CREATE TABLE asignacion_ruta (
    id_asignacion   SERIAL      PRIMARY KEY,
    id_ruta         INTEGER     NOT NULL REFERENCES ruta(id_ruta),
    id_camion       INTEGER     NOT NULL REFERENCES camion(id_camion),
    fecha_asig      DATE        NOT NULL,
    peso_estimado   FLOAT       NOT NULL DEFAULT 0,  -- kg, generado automáticamente
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: recoleccion
-- Ejecución real de una asignación de ruta
CREATE TABLE recoleccion (
    id_recoleccion  SERIAL                  PRIMARY KEY,
    id_asignacion   INTEGER                 NOT NULL REFERENCES asignacion_ruta(id_asignacion),
    horario_ini     VARCHAR(50),
    horario_fin     VARCHAR(50),
    estado          estado_recoleccion_enum NOT NULL DEFAULT 'programada',
    basura_ton      FLOAT,                             -- basura recolectada en toneladas
    observaciones   TEXT,
    updated_at      TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: punto_recoleccion
-- Puntos generados automáticamente al crear una asignación (15-30 puntos)
CREATE TABLE punto_recoleccion (
    id_punto            SERIAL      PRIMARY KEY,
    id_asignacion       INTEGER     NOT NULL REFERENCES asignacion_ruta(id_asignacion),
    latitud             DECIMAL(10,8) NOT NULL,
    longitud            DECIMAL(11,8) NOT NULL,
    volumen_estimado    FLOAT       NOT NULL CHECK (volumen_estimado BETWEEN 50 AND 500),
    orden               INTEGER     NOT NULL,
    recolectado         BOOLEAN     NOT NULL DEFAULT FALSE,
    hora_recoleccion    VARCHAR(20)
);

-- Tabla: incidencia_ruta
-- Incidencias registradas durante una recolección
CREATE TABLE incidencia_ruta (
    id_incidencia   SERIAL          PRIMARY KEY,
    id_recoleccion  INTEGER         NOT NULL REFERENCES recoleccion(id_recoleccion),
    tipo            VARCHAR(50)     NOT NULL,
    descripcion     TEXT            NOT NULL,
    latitud         DECIMAL(10,8),
    longitud        DECIMAL(11,8),
    fecha           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MÓDULO: PUNTOS VERDES (RECICLAJE)
-- ============================================================

-- Tabla: tipo_material
-- Catálogo de materiales reciclables aceptados
CREATE TABLE tipo_material (
    id_tipo         SERIAL          PRIMARY KEY,
    nombre          VARCHAR(50)     NOT NULL UNIQUE,
    descripcion     VARCHAR(200),
    unidad_medida   VARCHAR(20)     NOT NULL DEFAULT 'kg'
);

-- Tabla: punto_verde
-- Ubicaciones físicas de los puntos de reciclaje
CREATE TABLE punto_verde (
    id_punto_verde  SERIAL          PRIMARY KEY,
    id_encargado    INTEGER         NOT NULL REFERENCES usuario(id_usuario),
    nombre          VARCHAR(100)    NOT NULL,
    direccion       VARCHAR(200)    NOT NULL,
    latitud         DECIMAL(10,8)   NOT NULL,
    longitud        DECIMAL(11,8)   NOT NULL,
    capacidad       FLOAT           NOT NULL CHECK (capacidad > 0),
    horario         VARCHAR(50)     NOT NULL,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE
);

-- Tabla: contenedor
-- Contenedor por tipo de material dentro de un punto verde
CREATE TABLE contenedor (
    id_contenedor       SERIAL                  PRIMARY KEY,
    id_punto_verde      INTEGER                 NOT NULL REFERENCES punto_verde(id_punto_verde),
    id_tipo_material    INTEGER                 NOT NULL REFERENCES tipo_material(id_tipo),
    capacidad_kg        FLOAT                   NOT NULL CHECK (capacidad_kg > 0),
    nivel_llenado       FLOAT                   NOT NULL DEFAULT 0
                                                CHECK (nivel_llenado BETWEEN 0 AND 100),
    estado              estado_contenedor_enum  NOT NULL DEFAULT 'disponible',
    ultimo_vaciado      TIMESTAMP
);

-- Índice para alertas de nivel de llenado
CREATE INDEX idx_contenedor_nivel ON contenedor(nivel_llenado);

-- Tabla: entrega_material
-- Registro de cada entrega de reciclaje por un ciudadano
CREATE TABLE entrega_material (
    id_entrega      SERIAL      PRIMARY KEY,
    id_contenedor   INTEGER     NOT NULL REFERENCES contenedor(id_contenedor),
    id_ciudadano    INTEGER     REFERENCES ciudadano(id_ciudadano),  -- NULL si es anónima
    cantidad_kg     FLOAT       NOT NULL CHECK (cantidad_kg > 0),
    fecha_entrega   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: vaciado_contenedor
-- Programación y registro del vaciado de contenedores
CREATE TABLE vaciado_contenedor (
    id_vaciado      SERIAL              PRIMARY KEY,
    id_contenedor   INTEGER             NOT NULL REFERENCES contenedor(id_contenedor),
    id_usuario      INTEGER             NOT NULL REFERENCES usuario(id_usuario),
    fecha_prog      DATE                NOT NULL,
    fecha_realizado DATE,
    estado          estado_vaciado_enum NOT NULL DEFAULT 'programado',
    observaciones   TEXT
);

-- ============================================================
-- MÓDULO: DENUNCIAS CIUDADANAS
-- ============================================================

-- Tabla: cuadrilla_limpieza
-- Equipos de trabajadores para atender basureros clandestinos
CREATE TABLE cuadrilla_limpieza (
    id_cuadrilla    SERIAL          PRIMARY KEY,
    id_responsable  INTEGER         NOT NULL REFERENCES usuario(id_usuario),
    nombre          VARCHAR(100)    NOT NULL,
    disponible      BOOLEAN         NOT NULL DEFAULT TRUE,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE
);

-- Tabla: denuncia
-- Denuncias ciudadanas de basureros clandestinos
CREATE TABLE denuncia (
    id_denuncia     SERIAL                  PRIMARY KEY,
    id_ciudadano    INTEGER                 NOT NULL REFERENCES ciudadano(id_ciudadano),
    id_zona         INTEGER                 REFERENCES zona(id_zona),       
    id_cuadrilla    INTEGER                 REFERENCES cuadrilla_limpieza(id_cuadrilla), 
    direccion       VARCHAR(200)            NOT NULL,
    latitud         DECIMAL(10,8),
    longitud        DECIMAL(11,8),
    descripcion     TEXT                    NOT NULL,
    tamano          tamano_denuncia_enum    NOT NULL,
    estado          estado_denuncia_enum    NOT NULL DEFAULT 'recibida',
    codigo_segui    VARCHAR(50)             NOT NULL UNIQUE,
    fecha           TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índice para consulta ciudadana por código de seguimiento
CREATE INDEX idx_denuncia_codigo ON denuncia(codigo_segui);

-- Tabla: foto_denuncia
-- Fotos asociadas a una denuncia (al registrar, antes y después)
CREATE TABLE foto_denuncia (
    id_foto         SERIAL          PRIMARY KEY,
    id_denuncia     INTEGER         NOT NULL REFERENCES denuncia(id_denuncia),
    url_foto        VARCHAR(255)    NOT NULL,
    tipo_foto       tipo_foto_enum  NOT NULL DEFAULT 'denuncia',
    fecha_subida    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: seguimiento_denuncia
-- Historial de cambios de estado de cada denuncia
CREATE TABLE seguimiento_denuncia (
    id_seguimiento  SERIAL                  PRIMARY KEY,
    id_denuncia     INTEGER                 NOT NULL REFERENCES denuncia(id_denuncia),
    id_usuario      INTEGER                 NOT NULL REFERENCES usuario(id_usuario),
    estado_anterior estado_denuncia_enum,
    estado_nuevo    estado_denuncia_enum    NOT NULL,
    observaciones   TEXT,
    fecha           TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MÓDULO: SISTEMA (NOTIFICACIONES)
-- ============================================================

-- Tabla: notificacion
-- Registro de notificaciones enviadas por el sistema
CREATE TABLE notificacion (
    id_notificacion SERIAL          PRIMARY KEY,
    id_usuario      INTEGER         REFERENCES usuario(id_usuario),  -- NULL si solo es por email
    tipo            tipo_notif_enum NOT NULL,
    mensaje         TEXT            NOT NULL,
    email_destino   VARCHAR(150),
    leida           BOOLEAN         NOT NULL DEFAULT FALSE,
    fecha           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================

-- Mostrar todas las tablas creadas
SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_name = t.table_name
     AND table_schema = 'public') AS num_columnas
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
