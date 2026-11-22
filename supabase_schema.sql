-- ==============================================================================
-- KARGON: Esquema Relacional SQL Completo + Datos Semilla (Seed Data)
-- Proyecto KARGON: Logística & Cadena de Suministro B2B
-- Compatible con Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Limpieza preventiva si se desea reiniciar el esquema (opcional)
-- DROP TABLE IF EXISTS despachos CASCADE;
-- DROP TABLE IF EXISTS inventario_depositado CASCADE;
-- DROP TABLE IF EXISTS almacenes CASCADE;
-- DROP TABLE IF EXISTS usuarios CASCADE;

-- ==============================================================================
-- 2. Creación de Tablas
-- ==============================================================================

-- 2.1. Tabla de Usuarios y Roles (Proveedor, Dueño de Galpón, Transportista)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL,
  empresa TEXT,
  rol TEXT CHECK (rol IN ('dueno_galpon', 'proveedor', 'transportista')) NOT NULL,
  ciudad TEXT NOT NULL,
  telefono TEXT,
  verificado BOOLEAN DEFAULT FALSE,
  calificacion NUMERIC(2,1) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2. Tabla de Almacenes y Capacidad Ociosa Fraccional
CREATE TABLE IF NOT EXISTS almacenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dueno_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre_galpon TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  zona_industrial TEXT NOT NULL,
  direccion TEXT,
  m2_totales NUMERIC DEFAULT 1000,
  m2_disponibles NUMERIC NOT NULL,
  porcentaje_ocioso INT DEFAULT 45,
  tarifa_diaria_paleta NUMERIC NOT NULL,
  categoria_aceptada TEXT CHECK (categoria_aceptada IN (
    'carga_seca', 
    'alimentos_empacados', 
    'repuestos_ferreteria', 
    'refrigerado'
  )) NOT NULL,
  control_temperatura TEXT,
  imagen_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3. Tabla de Inventario Depositado (Lotes y Depósito Anti-Abandono)
CREATE TABLE IF NOT EXISTS inventario_depositado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  almacen_id UUID REFERENCES almacenes(id) ON DELETE CASCADE,
  proveedor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  sku_producto TEXT NOT NULL,
  lote_codigo TEXT,
  cantidad_paletas INT NOT NULL DEFAULT 10,
  cantidad_cajas INT NOT NULL,
  categoria TEXT DEFAULT 'repuestos_ferreteria',
  dias_contratados INT NOT NULL,
  dias_restantes INT DEFAULT 15,
  deposito_garantia_usd NUMERIC NOT NULL DEFAULT 30.00,
  guia_sada TEXT,
  foto_url TEXT,
  hash_criptografico TEXT,
  estado TEXT CHECK (estado IN ('almacenado', 'en_despacho', 'vence_pronto', 'retorno_automatico')) DEFAULT 'almacenado',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4. Tabla de Despachos, Cadena de Custodia Double-QR y Fideicomiso Escrow
CREATE TABLE IF NOT EXISTS despachos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_despacho TEXT NOT NULL UNIQUE,
  inventario_id UUID REFERENCES inventario_depositado(id),
  transportista_id UUID REFERENCES usuarios(id),
  destino_nombre TEXT NOT NULL,
  destino_direccion TEXT NOT NULL,
  destino_ciudad TEXT NOT NULL,
  costo_almacenaje_usd NUMERIC NOT NULL,
  costo_flete_usd NUMERIC NOT NULL,
  comision_app_usd NUMERIC NOT NULL,
  monto_total_escrow_usd NUMERIC NOT NULL,
  qr_hash_retiro TEXT UNIQUE NOT NULL,
  qr_hash_entrega TEXT UNIQUE NOT NULL,
  qr_retiro_escaneado BOOLEAN DEFAULT FALSE,
  qr_entrega_escaneado BOOLEAN DEFAULT FALSE,
  fecha_retiro_timestamp TEXT,
  fecha_entrega_timestamp TEXT,
  estado_escrow TEXT CHECK (estado_escrow IN ('fondos_retenidos', 'liberado_a_partes')) DEFAULT 'fondos_retenidos',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. Índices de Búsqueda y Desempeño
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_almacenes_ciudad_zona ON almacenes(ciudad, zona_industrial);
CREATE INDEX IF NOT EXISTS idx_inventario_estado ON inventario_depositado(estado);
CREATE INDEX IF NOT EXISTS idx_despachos_numero ON despachos(numero_despacho);

-- ==============================================================================
-- 4. Habilitación de Row Level Security (RLS) Permisivo para Demo
-- ==============================================================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_depositado ENABLE ROW LEVEL SECURITY;
ALTER TABLE despachos ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura y escritura anónima para visualización pública de la demo
CREATE POLICY "Lectura pública usuarios" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Escritura pública usuarios" ON usuarios FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura pública almacenes" ON almacenes FOR SELECT USING (true);
CREATE POLICY "Escritura pública almacenes" ON almacenes FOR ALL USING (true);

CREATE POLICY "Lectura pública inventario" ON inventario_depositado FOR SELECT USING (true);
CREATE POLICY "Escritura pública inventario" ON inventario_depositado FOR ALL USING (true);

CREATE POLICY "Lectura pública despachos" ON despachos FOR SELECT USING (true);
CREATE POLICY "Escritura pública despachos" ON despachos FOR ALL USING (true);

-- ==============================================================================
-- 5. Datos Semilla Iniciales (Seed Data con UUIDs fijos)
-- ==============================================================================

-- 5.1. Usuarios
INSERT INTO usuarios (id, nombre_completo, empresa, rol, ciudad, telefono, verificado, calificacion)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'Sofía Rojas', 'TecnoParts C.A.', 'proveedor', 'Valencia', '+58 414-4281900', true, 5.0),
  ('a2222222-2222-2222-2222-222222222222', 'Manuel Mendoza', 'Logística Castillito C.A.', 'dueno_galpon', 'Valencia', '+58 414-4328901', true, 4.9),
  ('a3333333-3333-3333-3333-333333333333', 'Pedro Alvarado', 'Trans-Carabobo Express S.R.L.', 'transportista', 'Valencia', '+58 412-5558912', true, 5.0)
ON CONFLICT (id) DO NOTHING;

-- 5.2. Almacenes en Zonas Industriales Reales
INSERT INTO almacenes (id, dueno_id, nombre_galpon, ciudad, zona_industrial, direccion, m2_totales, m2_disponibles, porcentaje_ocioso, tarifa_diaria_paleta, categoria_aceptada, imagen_url)
VALUES 
  ('b1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'Galpón Modular Castillito Norte', 'Valencia', 'Z.I. Castillito', 'Av. Este-Oeste 3, Galpón B-12', 800, 320, 40, 1.50, 'repuestos_ferreteria', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'),
  ('b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Centro Logístico Big Low Park', 'San Diego', 'San Diego - ARC', 'Intercomunal San Diego frente Terminal', 1200, 520, 65, 1.25, 'carga_seca', 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80'),
  ('b3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'Almacenes Frigoríficos La Ensenada', 'Puerto Cabello', 'Puerto Cabello - Muelle', 'Carretera Nacional Morón Km 4', 600, 180, 25, 1.80, 'refrigerado', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- 5.3. Inventario Depositado
INSERT INTO inventario_depositado (id, almacen_id, proveedor_id, sku_producto, lote_codigo, cantidad_paletas, cantidad_cajas, categoria, dias_contratados, dias_restantes, deposito_garantia_usd, guia_sada, hash_criptografico, estado)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'SKU-8841', 'Lote Ind: Elec-09', 14, 140, 'repuestos_ferreteria', 15, 2, 30.00, 'SADA-VE-99214', '0x9f4a...41bc', 'vence_pronto'),
  ('c2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'SKU-9204', 'Lote Ind: Alim-44', 28, 320, 'alimentos_empacados', 30, 18, 30.00, 'SICA-VE-88412', '0x3c71...88ab', 'almacenado')
ON CONFLICT (id) DO NOTHING;

-- 5.4. Despacho Activo #NX-8492
INSERT INTO despachos (id, numero_despacho, inventario_id, transportista_id, destino_nombre, destino_direccion, destino_ciudad, costo_almacenaje_usd, costo_flete_usd, comision_app_usd, monto_total_escrow_usd, qr_hash_retiro, qr_hash_entrega, qr_retiro_escaneado, qr_entrega_escaneado, estado_escrow)
VALUES
  ('d1111111-1111-1111-1111-111111111111', '#NX-8492', 'c1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'Ferretería El Tornillo C.A.', 'Av. Universidad, C.C. Naguanagua Plaza', 'Naguanagua, Edo. Carabobo', 45.00, 85.00, 14.50, 145.00, '8f4a2c27091e4bca12ef9038ba9812cc9120deba19e481bfd84920199182d91e', 'f4b18c092a194918e2bc99812aa319087bcdaef189421098efab4910287123bc', false, false, 'fondos_retenidos')
ON CONFLICT (id) DO NOTHING;
