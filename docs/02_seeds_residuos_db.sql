SET client_encoding = 'UTF8';

-- ============================================================
-- 1. ROLES
-- ============================================================

INSERT INTO rol (nombre, descripcion) VALUES
('administrador', 'Acceso total al sistema. Gestion de usuarios, configuracion y reportes estrategicos.'),
('coordinador',   'Planificacion de rutas, asignacion de camiones y monitoreo de recoleccion.'),
('operador',      'Registro de entregas en puntos verdes y control de contenedores.'),
('ciudadano',     'Consulta de rutas, reporte de basureros y seguimiento de denuncias.'),
('auditor',       'Consulta de reportes y validacion de informacion. Sin permisos de modificacion.');



INSERT INTO usuario (id_rol, nombre, email, password, telefono) VALUES
-- Administradores (rol 1)
(1, 'Carlos Mendoza Lopez',    'carlos.mendoza@municipalidad.gt',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55001100'),
(1, 'Ana Lucia Perez Garcia',  'ana.perez@municipalidad.gt',         '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55001101'),
(1, 'Roberto Juarez Cifuentes','roberto.juarez@municipalidad.gt',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55001102'),

-- Coordinadores de rutas (rol 2)
(2, 'Miguel Angel Gramajo',    'miguel.gramajo@municipalidad.gt',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55002200'),
(2, 'Sandra Veronica Solis',   'sandra.solis@municipalidad.gt',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55002201'),
(2, 'Jorge Alberto Cifuentes', 'jorge.cifuentes@municipalidad.gt',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55002202'),
(2, 'Maria Fernanda Orozco',   'maria.orozco@municipalidad.gt',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55002203'),

-- Operadores de punto verde (rol 3) - tambien sirven como conductores
(3, 'Luis Fernando Aju',       'luis.aju@municipalidad.gt',          '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55003300'),
(3, 'Carmen Lucia Batz',       'carmen.batz@municipalidad.gt',       '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55003301'),
(3, 'Pedro Jose Coc',          'pedro.coc@municipalidad.gt',         '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55003302'),
(3, 'Hector Manuel Tzul',      'hector.tzul@municipalidad.gt',       '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55003303'),
(3, 'Rosa Maria Ixim',         'rosa.ixim@municipalidad.gt',         '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55003304'),

-- Ciudadanos con cuenta (rol 4)
(4, 'Juan Pablo Revolorio',    'juan.revolorio@gmail.com',           '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '44001111'),
(4, 'Sofia Alejandra Mendez',  'sofia.mendez@gmail.com',             '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '44002222'),
(4, 'Diego Armando Lemus',     'diego.lemus@gmail.com',              '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '44003333'),
(4, 'Valeria Monzon Garcia',   'valeria.monzon@gmail.com',           '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '44004444'),

-- Auditores (rol 5)
(5, 'Enrique Sandoval Ruiz',   'enrique.sandoval@municipalidad.gt',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55005500'),
(5, 'Patricia Lima de Barrios','patricia.lima@municipalidad.gt',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55005501'),
(5, 'Augusto Bernal Estrada',  'augusto.bernal@municipalidad.gt',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '55005502');

-- ============================================================
-- 3. CIUDADANOS
-- ============================================================

INSERT INTO ciudadano (id_usuario, nombre, telefono, email) VALUES
-- Ciudadanos con cuenta de usuario (id_usuario 14-17)
(14, 'Juan Pablo Revolorio',   '44001111', 'juan.revolorio@gmail.com'),
(15, 'Sofia Alejandra Mendez', '44002222', 'sofia.mendez@gmail.com'),
(16, 'Diego Armando Lemus',    '44003333', 'diego.lemus@gmail.com'),
(17, 'Valeria Monzon Garcia',  '44004444', 'valeria.monzon@gmail.com'),
-- Ciudadanos anonimos (sin cuenta)
(NULL, 'Francisco Cardenas',   '33001100', 'francisco.cardenas@hotmail.com'),
(NULL, 'Marta Elena Perez',    '33002200', 'marta.perez@yahoo.com'),
(NULL, 'Alejandro Chavez',     '33003300', NULL),
(NULL, 'Gloria Esperanza Toj', '33004400', 'gloria.toj@gmail.com'),
(NULL, 'Rene Antonio Aju',     '33005500', 'rene.aju@gmail.com'),
(NULL, 'Luisa Fernanda Coy',   '33006600', NULL);

-- ============================================================
-- 4. ZONAS / COLONIAS (5 zonas de Guatemala)
-- ============================================================

INSERT INTO zona (nombre, tipo, densidad_pobla) VALUES
('Zona 1 - Centro Historico',     'comercial',   8500.0),
('Zona 6 - Colonia El Gallito',   'residencial', 12000.0),
('Zona 11 - Roosevelt',           'residencial', 9800.0),
('Zona 12 - Colonia Nimajuyu',    'residencial', 7200.0),
('Zona 18 - Colonia El Limon',    'residencial', 11500.0);

-- ============================================================
-- 5. RUTAS DE RECOLECCION (10 rutas)
-- ============================================================

INSERT INTO ruta (id_zona, nombre, coor_ini, coor_fin, puntos_inter, distancia, dias_recole, horario, tipo_residuo) VALUES
(1, 'Ruta Centro-Norte',
    '{"lat": 14.6450, "lng": -90.5130}',
    '{"lat": 14.6510, "lng": -90.5080}',
    '[{"lat":14.6460,"lng":-90.5120},{"lat":14.6480,"lng":-90.5100}]',
    4.2, 'Lunes,Miercoles,Viernes', '06:00-12:00', 'mixto'),

(1, 'Ruta Centro-Sur',
    '{"lat": 14.6420, "lng": -90.5150}',
    '{"lat": 14.6380, "lng": -90.5100}',
    '[{"lat":14.6400,"lng":-90.5130},{"lat":14.6390,"lng":-90.5110}]',
    3.8, 'Martes,Jueves,Sabado', '06:00-12:00', 'organico'),

(2, 'Ruta Gallito Sector A',
    '{"lat": 14.6550, "lng": -90.5020}',
    '{"lat": 14.6600, "lng": -90.4980}',
    '[{"lat":14.6570,"lng":-90.5000},{"lat":14.6580,"lng":-90.4990}]',
    5.1, 'Lunes,Miercoles,Viernes', '07:00-13:00', 'mixto'),

(2, 'Ruta Gallito Sector B',
    '{"lat": 14.6610, "lng": -90.4970}',
    '{"lat": 14.6650, "lng": -90.4940}',
    '[{"lat":14.6620,"lng":-90.4960},{"lat":14.6640,"lng":-90.4950}]',
    4.7, 'Martes,Jueves', '07:00-13:00', 'inorganico'),

(3, 'Ruta Roosevelt Principal',
    '{"lat": 14.6300, "lng": -90.5300}',
    '{"lat": 14.6250, "lng": -90.5200}',
    '[{"lat":14.6280,"lng":-90.5270},{"lat":14.6260,"lng":-90.5230}]',
    6.3, 'Lunes,Miercoles,Viernes', '05:30-11:30', 'organico'),

(3, 'Ruta Roosevelt Secundaria',
    '{"lat": 14.6320, "lng": -90.5350}',
    '{"lat": 14.6280, "lng": -90.5250}',
    '[{"lat":14.6310,"lng":-90.5320},{"lat":14.6290,"lng":-90.5280}]',
    4.5, 'Martes,Sabado', '06:00-12:00', 'mixto'),

(4, 'Ruta Nimajuyu Norte',
    '{"lat": 14.5980, "lng": -90.5450}',
    '{"lat": 14.6030, "lng": -90.5400}',
    '[{"lat":14.5990,"lng":-90.5440},{"lat":14.6010,"lng":-90.5420}]',
    3.9, 'Lunes,Jueves', '06:00-12:00', 'organico'),

(4, 'Ruta Nimajuyu Sur',
    '{"lat": 14.5950, "lng": -90.5480}',
    '{"lat": 14.5900, "lng": -90.5430}',
    '[{"lat":14.5930,"lng":-90.5460},{"lat":14.5910,"lng":-90.5440}]',
    3.4, 'Miercoles,Sabado', '07:00-13:00', 'inorganico'),

(5, 'Ruta El Limon Sector A',
    '{"lat": 14.6700, "lng": -90.4800}',
    '{"lat": 14.6760, "lng": -90.4750}',
    '[{"lat":14.6720,"lng":-90.4780},{"lat":14.6740,"lng":-90.4760}]',
    5.8, 'Lunes,Miercoles,Viernes', '06:00-12:00', 'mixto'),

(5, 'Ruta El Limon Sector B',
    '{"lat": 14.6770, "lng": -90.4740}',
    '{"lat": 14.6820, "lng": -90.4700}',
    '[{"lat":14.6790,"lng":-90.4720},{"lat":14.6810,"lng":-90.4710}]',
    4.6, 'Martes,Jueves,Sabado', '06:30-12:30', 'organico');

-- ============================================================
-- 6. CAMIONES (5 camiones)
-- Conductores: usuarios 8-12 (operadores que tambien conducen)
-- ============================================================

INSERT INTO camion (id_conductor, placa, capacidad, estado, marca, modelo, anio) VALUES
(8,  'P-123-ABC', 8.5,  'operativo',     'Mercedes-Benz', 'Econic 1828', 2020),
(9,  'P-456-DEF', 6.0,  'operativo',     'Volkswagen',    'Constellation', 2019),
(10, 'P-789-GHI', 10.0, 'operativo',     'Scania',        'P 340', 2021),
(11, 'P-321-JKL', 6.0,  'mantenimiento', 'Ford',          'Cargo 1722', 2018),
(12, 'P-654-MNO', 8.5,  'operativo',     'Mercedes-Benz', 'Atego 1725', 2022);

-- ============================================================
-- 7. ASIGNACIONES DE RUTAS
-- ============================================================

INSERT INTO asignacion_ruta (id_ruta, id_camion, fecha_asig, peso_estimado) VALUES
(1,  1, '2026-03-02', 4250.0),
(2,  2, '2026-03-03', 3800.0),
(3,  3, '2026-03-02', 5100.0),
(5,  5, '2026-03-02', 6300.0),
(7,  1, '2026-03-05', 3900.0),
(9,  3, '2026-03-02', 5800.0),
(4,  2, '2026-03-04', 4700.0),
(6,  5, '2026-03-07', 4500.0);

-- ============================================================
-- 8. RECOLECCIONES
-- ============================================================

INSERT INTO recoleccion (id_asignacion, horario_ini, horario_fin, estado, basura_ton, observaciones) VALUES
(1, '06:05', '11:45', 'completada', 8.3,  'Recoleccion completada sin incidencias.'),
(2, '06:10', '11:50', 'completada', 5.9,  'Lluvia leve al inicio, sin mayor impacto.'),
(3, '07:00', '12:30', 'completada', 9.8,  'Alta carga en sector mercado.'),
(4, '06:00', NULL,    'en_proceso', NULL, NULL),
(5, '06:15', '11:30', 'completada', 7.2,  'Ruta completada. Un punto inaccesible por vehiculo estacionado.'),
(6, '06:00', NULL,    'programada', NULL, NULL),
(7, '07:10', '12:00', 'completada', 6.1,  'Completada sin inconvenientes.'),
(8, '06:05', '10:30', 'incompleta', 3.2,  'Camion presento falla mecanica. Se cubrio el 70% de la ruta.');

-- ============================================================
-- 9. PUNTOS DE RECOLECCION 
-- ============================================================

INSERT INTO punto_recoleccion (id_asignacion, latitud, longitud, volumen_estimado, orden, recolectado, hora_recoleccion) VALUES
(1, 14.64520, -90.51280, 320.0, 1,  TRUE,  '06:15'),
(1, 14.64550, -90.51250, 180.0, 2,  TRUE,  '06:28'),
(1, 14.64580, -90.51220, 450.0, 3,  TRUE,  '06:40'),
(1, 14.64610, -90.51190, 120.0, 4,  TRUE,  '06:52'),
(1, 14.64640, -90.51160, 280.0, 5,  TRUE,  '07:05'),
(1, 14.64670, -90.51130, 390.0, 6,  TRUE,  '07:18'),
(1, 14.64700, -90.51100, 210.0, 7,  TRUE,  '07:30'),
(1, 14.64730, -90.51070, 160.0, 8,  TRUE,  '07:42'),
(1, 14.64760, -90.51040, 430.0, 9,  TRUE,  '07:55'),
(1, 14.64790, -90.51010, 95.0,  10, TRUE,  '08:07'),
(1, 14.64820, -90.50980, 340.0, 11, TRUE,  '08:20'),
(1, 14.64850, -90.50950, 270.0, 12, TRUE,  '08:33'),
(1, 14.64880, -90.50920, 190.0, 13, TRUE,  '08:45'),
(1, 14.64910, -90.50890, 410.0, 14, TRUE,  '08:58'),
(1, 14.64940, -90.50860, 155.0, 15, TRUE,  '09:10'),
(1, 14.64970, -90.50830, 285.0, 16, TRUE,  '09:23'),
(1, 14.65000, -90.50800, 365.0, 17, TRUE,  '09:36'),
(1, 14.65030, -90.50770, 120.0, 18, TRUE,  '09:48'),
(1, 14.65060, -90.50740, 480.0, 19, TRUE,  '10:01'),
(1, 14.65090, -90.50710, 220.0, 20, TRUE,  '10:14');

-- ============================================================
-- 10. INCIDENCIAS EN RUTA
-- ============================================================

INSERT INTO incidencia_ruta (id_recoleccion, tipo, descripcion, latitud, longitud) VALUES
(2, 'calle_bloqueada', 'Vehiculo mal estacionado bloqueando el paso del camion en calle 5ta.', 14.6395, -90.5125),
(5, 'punto_inaccesible', 'Punto de recoleccion #8 inaccesible por obras en la calle.', 14.6025, -90.5415),
(8, 'averia_mecanica', 'Falla en sistema hidraulico del camion. Se reporto a taller.', 14.6785, -90.4730);

-- ============================================================
-- 11. TIPOS DE MATERIAL
-- ============================================================

INSERT INTO tipo_material (nombre, descripcion, unidad_medida) VALUES
('Papel y Carton', 'Periodicos, revistas, cajas, carton corrugado. Debe estar limpio y seco.', 'kg'),
('Plastico PET',   'Botellas plasticas, envases PET. Aplastar antes de depositar.', 'kg'),
('Vidrio',         'Botellas y frascos de vidrio. Sin tapas metalicas.', 'kg'),
('Metal',          'Latas de aluminio, hierro, cobre. Limpios y sin residuos de comida.', 'kg'),
('Organico',       'Restos de comida, cascaras de frutas y verduras, para compostaje.', 'kg'),
('Electronicos',   'Celulares, cables, baterias, computadoras y componentes electronicos.', 'unidad');

-- ============================================================
-- 12. PUNTOS VERDES (7 puntos)
-- Encargados: usuarios 8-12 (operadores)
-- ============================================================

INSERT INTO punto_verde (id_encargado, nombre, direccion, latitud, longitud, capacidad, horario) VALUES
(8,  'Punto Verde Zona 1',       '6a Avenida y 18 Calle, Zona 1, Guatemala',           14.6445, -90.5128, 50.0, '08:00-17:00'),
(9,  'Punto Verde El Gallito',   '15 Avenida 30-45, Colonia El Gallito, Zona 6',       14.6572, -90.5005, 40.0, '08:00-17:00'),
(10, 'Punto Verde Roosevelt',    'Calzada Roosevelt 20-15, Zona 11, Guatemala',         14.6298, -90.5265, 60.0, '07:00-18:00'),
(11, 'Punto Verde Nimajuyu',     '9a Calle 5-30, Colonia Nimajuyu, Zona 12',           14.5965, -90.5455, 35.0, '08:00-16:00'),
(12, 'Punto Verde El Limon',     'Colonia El Limon, Zona 18, Boulevard Principal',     14.6735, -90.4770, 45.0, '08:00-17:00'),
(8,  'Punto Verde Mercado Norte','Mercado La Terminal, Zona 4, Guatemala',              14.6388, -90.5178, 55.0, '06:00-18:00'),
(9,  'Punto Verde Ciudad Nueva', '3ra Avenida 7-45, Ciudad Nueva, Zona 2, Guatemala',  14.6490, -90.5095, 38.0, '08:00-17:00');

-- ============================================================
-- 13. CONTENEDORES (uno por tipo de material por punto verde)
-- ============================================================

-- Punto Verde Zona 1 (id 1) - 4 contenedores
INSERT INTO contenedor (id_punto_verde, id_tipo_material, capacidad_kg, nivel_llenado, estado, ultimo_vaciado) VALUES
(1, 1, 500.0, 45.0, 'disponible', '2026-02-20 10:00:00'),
(1, 2, 300.0, 78.0, 'disponible', '2026-02-18 09:00:00'),
(1, 3, 400.0, 30.0, 'disponible', '2026-02-22 11:00:00'),
(1, 4, 250.0, 92.0, 'disponible', '2026-02-15 08:00:00'),

-- Punto Verde El Gallito (id 2) - 4 contenedores
(2, 1, 400.0, 55.0, 'disponible', '2026-02-21 09:30:00'),
(2, 2, 300.0, 88.0, 'disponible', '2026-02-17 10:00:00'),
(2, 5, 500.0, 40.0, 'disponible', '2026-02-23 08:30:00'),
(2, 4, 200.0, 100.0,'lleno',      '2026-02-10 07:00:00'),

-- Punto Verde Roosevelt (id 3) - 4 contenedores
(3, 1, 600.0, 35.0, 'disponible', '2026-02-22 09:00:00'),
(3, 2, 400.0, 65.0, 'disponible', '2026-02-19 10:30:00'),
(3, 3, 500.0, 20.0, 'disponible', '2026-02-24 08:00:00'),
(3, 5, 700.0, 72.0, 'disponible', '2026-02-20 07:30:00'),

-- Punto Verde Nimajuyu (id 4) - 3 contenedores
(4, 1, 350.0, 60.0, 'disponible', '2026-02-21 10:00:00'),
(4, 2, 250.0, 45.0, 'disponible', '2026-02-23 09:00:00'),
(4, 5, 400.0, 80.0, 'disponible', '2026-02-18 08:00:00'),

-- Punto Verde El Limon (id 5) - 3 contenedores
(5, 1, 450.0, 25.0, 'disponible', '2026-02-24 09:00:00'),
(5, 2, 300.0, 70.0, 'disponible', '2026-02-20 10:00:00'),
(5, 3, 350.0, 50.0, 'disponible', '2026-02-22 08:30:00'),

-- Punto Verde Mercado Norte (id 6) - 3 contenedores
(6, 5, 800.0, 95.0, 'disponible', '2026-02-14 07:00:00'),
(6, 1, 500.0, 55.0, 'disponible', '2026-02-21 08:00:00'),
(6, 4, 300.0, 40.0, 'disponible', '2026-02-23 09:30:00'),

-- Punto Verde Ciudad Nueva (id 7) - 3 contenedores
(7, 2, 280.0, 60.0, 'disponible', '2026-02-20 10:00:00'),
(7, 6, 150.0, 35.0, 'disponible', '2026-02-22 11:00:00'),
(7, 3, 320.0, 15.0, 'disponible', '2026-02-24 09:00:00');

-- ============================================================
-- 14. ENTREGAS DE MATERIAL
-- ============================================================

INSERT INTO entrega_material (id_contenedor, id_ciudadano, cantidad_kg, fecha_entrega) VALUES
(1,  1, 12.5, '2026-02-20 09:15:00'),
(2,  2, 8.0,  '2026-02-20 10:30:00'),
(3,  3, 15.0, '2026-02-21 08:45:00'),
(5,  4, 20.0, '2026-02-21 11:00:00'),
(7,  1, 30.0, '2026-02-22 09:20:00'),
(9,  2, 18.0, '2026-02-22 10:45:00'),
(12, 3, 25.0, '2026-02-23 08:30:00'),
(14, 4, 10.0, '2026-02-23 11:15:00'),
(17, 5, 22.0, '2026-02-24 09:00:00'),
(20, 6, 45.0, '2026-02-24 10:20:00'),
(2,  7, 6.5,  '2026-02-24 11:30:00'),
(6,  8, 14.0, '2026-02-25 08:45:00');

-- ============================================================
-- 15. VACIADOS DE CONTENEDOR
-- ============================================================

INSERT INTO vaciado_contenedor (id_contenedor, id_usuario, fecha_prog, fecha_realizado, estado, observaciones) VALUES
(4,  8,  '2026-03-02', NULL,         'programado',  'Contenedor al 92%, vaciado urgente solicitado.'),
(8,  9,  '2026-03-01', '2026-03-01', 'completado',  'Vaciado completado. Contenedor habilitado nuevamente.'),
(19, 10, '2026-03-02', NULL,         'programado',  'Contenedor al 95%, mercado genera alto volumen organico.'),
(2,  8,  '2026-03-03', NULL,         'programado',  'Contenedor de PET al 78%, vaciado preventivo.');

-- ============================================================
-- 16. CUADRILLAS DE LIMPIEZA (3 cuadrillas)
-- ============================================================

INSERT INTO cuadrilla_limpieza (id_responsable, nombre, disponible) VALUES
(4, 'Cuadrilla Alpha', TRUE),
(5, 'Cuadrilla Beta',  FALSE),
(6, 'Cuadrilla Gamma', TRUE);

-- ============================================================
-- 17. DENUNCIAS (18 denuncias)
-- ============================================================

INSERT INTO denuncia (id_ciudadano, id_zona, id_cuadrilla, direccion, latitud, longitud, descripcion, tamano, estado, codigo_segui, fecha) VALUES
-- Denuncias cerradas/atendidas
(1, 1, 1, '8va Avenida y 12 Calle, Zona 1',           14.6430, -90.5140, 'Basurero clandestino acumulado en esquina. Lleva mas de 2 semanas.', 'grande',  'cerrada',     'DEN-2026-001', '2026-02-01 08:30:00'),
(2, 2, 2, 'Colonia El Gallito, 22 Calle 15-30',        14.6565, -90.5010, 'Basura domiciliar en lote baldio. Malos olores.', 'mediano', 'atendida',    'DEN-2026-002', '2026-02-03 10:15:00'),
(3, 3, 1, 'Calzada Roosevelt frente a hospital',        14.6305, -90.5255, 'Escombros y basura mezclada. Bloquea parte de la acera.', 'grande',  'atendida',    'DEN-2026-003', '2026-02-05 09:00:00'),

-- Denuncias en proceso
(4, 4, 2, '5ta Calle Nimajuyu, frente a cancha',       14.5972, -90.5442, 'Basura tirada en area deportiva. Residuos plasticos.', 'mediano', 'en_atencion', 'DEN-2026-004', '2026-02-10 14:20:00'),
(5, 5, 3, 'Zona 18, Colonia El Limon, callejon 3',     14.6715, -90.4785, 'Deposito ilegal de basura industrial. Olores fuertes.', 'grande',  'en_atencion', 'DEN-2026-005', '2026-02-12 11:30:00'),
(6, 1, 1, 'Centro Historico, Calle del Mercado',        14.6440, -90.5135, 'Basura mezclada con desechos de mercado. Alto riesgo.', 'grande',  'asignada',    'DEN-2026-006', '2026-02-14 08:45:00'),

-- Denuncias asignadas pendientes
(7, 2, 3, 'El Gallito, 18 Calle y 14 Avenida',         14.6580, -90.4995, 'Bolsas de basura sin recolectar por 4 dias.', 'pequeno', 'asignada',    'DEN-2026-007', '2026-02-15 16:00:00'),
(8, 3, NULL,'Zona 11, Colonia Santa Fe, Lote 25',       14.6285, -90.5280, 'Basurero en lote baldio con ratas visibles.', 'grande',  'en_revision', 'DEN-2026-008', '2026-02-16 09:30:00'),
(9, 1, NULL,'1ra Avenida 9-50, Zona 1',                 14.6455, -90.5125, 'Desechos tirados en barranco cercano.', 'mediano', 'en_revision', 'DEN-2026-009', '2026-02-17 12:00:00'),

-- Denuncias recibidas recientes
(10, 4, NULL,'Nimajuyu, 3ra Calle 2-15',               14.5988, -90.5438, 'Escombros de construccion abandonados.', 'mediano', 'recibida',    'DEN-2026-010', '2026-02-18 08:00:00'),
(1,  5, NULL,'Zona 18, frente a escuela EOUM',          14.6742, -90.4762, 'Basura mezclada con desechos peligrosos.', 'grande',  'recibida',    'DEN-2026-011', '2026-02-19 10:30:00'),
(2,  2, NULL,'El Gallito, Callejon La Paz',             14.6592, -90.4985, 'Desechos organicos en descomposicion.', 'pequeno', 'recibida',    'DEN-2026-012', '2026-02-20 07:45:00'),
(3,  3, NULL,'Roosevelt, frente a gasolinera Shell',    14.6312, -90.5242, 'Bolsas plasticas acumuladas en cuneta.', 'pequeno', 'recibida',    'DEN-2026-013', '2026-02-21 09:15:00'),
(4,  1, NULL,'Zona 1, 10ma Calle y 6ta Avenida',        14.6438, -90.5132, 'Basura comercial tirada fuera de horario.', 'mediano', 'recibida',    'DEN-2026-014', '2026-02-22 11:00:00'),
(5,  4, NULL,'Nimajuyu, sector D, calle principal',     14.5995, -90.5425, 'Acumulacion progresiva de basura.', 'grande',  'recibida',    'DEN-2026-015', '2026-02-23 08:30:00'),
(6,  5, NULL,'El Limon, 5ta Calle 10-20',              14.6728, -90.4778, 'Basura domestica sin recolectar.', 'pequeno', 'recibida',    'DEN-2026-016', '2026-02-23 14:00:00'),
(7,  2, NULL,'El Gallito, Av. Petapa 32-50',           14.6560, -90.5020, 'Desechos industriales en area residencial.', 'grande',  'recibida',    'DEN-2026-017', '2026-02-24 09:00:00'),
(8,  3, NULL,'Roosevelt, Calle Mariscal 15-30',         14.6275, -90.5295, 'Muebles y electrodomesticos abandonados.', 'grande',  'recibida',    'DEN-2026-018', '2026-02-25 10:45:00');

-- ============================================================
-- 18. FOTOS DE DENUNCIAS
-- ============================================================

INSERT INTO foto_denuncia (id_denuncia, url_foto, tipo_foto) VALUES
(1, 'uploads/denuncias/DEN-2026-001_denuncia.jpg',  'denuncia'),
(1, 'uploads/denuncias/DEN-2026-001_antes.jpg',     'antes'),
(1, 'uploads/denuncias/DEN-2026-001_despues.jpg',   'despues'),
(2, 'uploads/denuncias/DEN-2026-002_denuncia.jpg',  'denuncia'),
(2, 'uploads/denuncias/DEN-2026-002_antes.jpg',     'antes'),
(2, 'uploads/denuncias/DEN-2026-002_despues.jpg',   'despues'),
(3, 'uploads/denuncias/DEN-2026-003_denuncia.jpg',  'denuncia'),
(3, 'uploads/denuncias/DEN-2026-003_antes.jpg',     'antes'),
(4, 'uploads/denuncias/DEN-2026-004_denuncia.jpg',  'denuncia'),
(4, 'uploads/denuncias/DEN-2026-004_antes.jpg',     'antes'),
(5, 'uploads/denuncias/DEN-2026-005_denuncia.jpg',  'denuncia'),
(6, 'uploads/denuncias/DEN-2026-006_denuncia.jpg',  'denuncia'),
(7, 'uploads/denuncias/DEN-2026-007_denuncia.jpg',  'denuncia'),
(8, 'uploads/denuncias/DEN-2026-008_denuncia.jpg',  'denuncia');

-- ============================================================
-- 19. SEGUIMIENTO DE DENUNCIAS
-- ============================================================

INSERT INTO seguimiento_denuncia (id_denuncia, id_usuario, estado_anterior, estado_nuevo, observaciones) VALUES
-- Denuncia 1 (cerrada - historial completo)
(1, 4, 'recibida',    'en_revision',  'Coordinador evaluo la zona. Se confirma basurero de gran tamano.'),
(1, 4, 'en_revision', 'asignada',     'Se asigna Cuadrilla Alpha para intervencion el dia 05/02.'),
(1, 5, 'asignada',    'en_atencion',  'Cuadrilla en sitio. Se inicio limpieza a las 7:00 AM.'),
(1, 4, 'en_atencion', 'atendida',     'Limpieza completada. Se retiraron 3.5 toneladas de basura.'),
(1, 1, 'atendida',    'cerrada',      'Caso verificado y cerrado. Zona habilitada correctamente.'),

-- Denuncia 2 (atendida)
(2, 5, 'recibida',    'en_revision',  'Se coordina con cuadrilla disponible.'),
(2, 5, 'en_revision', 'asignada',     'Cuadrilla Beta asignada.'),
(2, 6, 'asignada',    'en_atencion',  'Trabajo de limpieza iniciado.'),
(2, 5, 'en_atencion', 'atendida',     'Lote limpiado. Se notifico al propietario.'),

-- Denuncia 4 (en atencion)
(4, 4, 'recibida',    'en_revision',  'Revision en progreso.'),
(4, 4, 'en_revision', 'asignada',     'Cuadrilla Beta asignada para el area deportiva.'),
(4, 6, 'asignada',    'en_atencion',  'Trabajo iniciado en cancha de Nimajuyu.'),

-- Denuncia 6 (asignada)
(6, 5, 'recibida',    'en_revision',  'Alto riesgo sanitario, prioridad alta.'),
(6, 5, 'en_revision', 'asignada',     'Cuadrilla Alpha asignada con urgencia.');

-- ============================================================
-- 20. NOTIFICACIONES
-- ============================================================

INSERT INTO notificacion (id_usuario, tipo, mensaje, email_destino, leida) VALUES
-- Notificaciones de denuncia a ciudadanos
(13, 'denuncia', 'Su denuncia DEN-2026-001 ha cambiado a estado: En Revision.',        'juan.revolorio@gmail.com',  TRUE),
(13, 'denuncia', 'Su denuncia DEN-2026-001 ha sido asignada a una cuadrilla de limpieza.', 'juan.revolorio@gmail.com', TRUE),
(13, 'denuncia', 'Su denuncia DEN-2026-001 ha sido atendida y cerrada exitosamente.',   'juan.revolorio@gmail.com',  TRUE),
(14, 'denuncia', 'Su denuncia DEN-2026-002 ha cambiado a estado: Atendida.',            'sofia.mendez@gmail.com',    TRUE),
(15, 'denuncia', 'Su denuncia DEN-2026-004 esta siendo atendida por una cuadrilla.',    'diego.lemus@gmail.com',     FALSE),
-- Alertas de contenedores
(8,  'contenedor', 'ALERTA: Contenedor de Metal en Punto Verde Zona 1 al 92%. Requiere vaciado urgente.',     'luis.aju@municipalidad.gt',  FALSE),
(9,  'contenedor', 'ALERTA: Contenedor de Metal en Punto Verde El Gallito al 100%. Lleno, accion inmediata.', 'carmen.batz@municipalidad.gt', FALSE),
(10, 'contenedor', 'ALERTA: Contenedor Organico en Punto Verde Mercado Norte al 95%. Vaciado urgente.',       'pedro.coc@municipalidad.gt',  FALSE),
-- Notificaciones del sistema
(4,  'sistema', 'Nueva denuncia DEN-2026-018 registrada en Zona 11. Requiere revision.',  'miguel.gramajo@municipalidad.gt', FALSE),
(5,  'sistema', 'Nueva denuncia DEN-2026-017 registrada en Zona 6. Requiere revision.',   'sandra.solis@municipalidad.gt',   FALSE);

-- ============================================================
-- VERIFICACION FINAL DE DATOS
-- ============================================================

SELECT 'rol'                   AS tabla, COUNT(*) AS registros FROM rol
UNION ALL
SELECT 'usuario',                         COUNT(*) FROM usuario
UNION ALL
SELECT 'ciudadano',                        COUNT(*) FROM ciudadano
UNION ALL
SELECT 'zona',                             COUNT(*) FROM zona
UNION ALL
SELECT 'ruta',                             COUNT(*) FROM ruta
UNION ALL
SELECT 'camion',                           COUNT(*) FROM camion
UNION ALL
SELECT 'asignacion_ruta',                  COUNT(*) FROM asignacion_ruta
UNION ALL
SELECT 'recoleccion',                      COUNT(*) FROM recoleccion
UNION ALL
SELECT 'punto_recoleccion',                COUNT(*) FROM punto_recoleccion
UNION ALL
SELECT 'incidencia_ruta',                  COUNT(*) FROM incidencia_ruta
UNION ALL
SELECT 'tipo_material',                    COUNT(*) FROM tipo_material
UNION ALL
SELECT 'punto_verde',                      COUNT(*) FROM punto_verde
UNION ALL
SELECT 'contenedor',                       COUNT(*) FROM contenedor
UNION ALL
SELECT 'entrega_material',                 COUNT(*) FROM entrega_material
UNION ALL
SELECT 'vaciado_contenedor',               COUNT(*) FROM vaciado_contenedor
UNION ALL
SELECT 'cuadrilla_limpieza',               COUNT(*) FROM cuadrilla_limpieza
UNION ALL
SELECT 'denuncia',                         COUNT(*) FROM denuncia
UNION ALL
SELECT 'foto_denuncia',                    COUNT(*) FROM foto_denuncia
UNION ALL
SELECT 'seguimiento_denuncia',             COUNT(*) FROM seguimiento_denuncia
UNION ALL
SELECT 'notificacion',                     COUNT(*) FROM notificacion
ORDER BY tabla;
