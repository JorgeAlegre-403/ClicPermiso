# Configuración de Supabase para ClicPermiso

## Tablas Necesarias

### Tabla: `auth.users`
Gestionada automáticamente por Supabase Auth

### Tabla: `perfiles`
```sql
CREATE TABLE perfiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  dni VARCHAR(20) UNIQUE,
  rol VARCHAR(20) NOT NULL DEFAULT 'docente', -- 'docente' o 'directivo'
  rel_juridica VARCHAR(100),
  anios_servicio INTEGER DEFAULT 0,
  hace_sustitucion BOOLEAN DEFAULT FALSE,
  consentimiento_rgpd BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_perfiles_email ON perfiles(email);
CREATE INDEX idx_perfiles_rol ON perfiles(rol);
```

### Tabla: `solicitudes`
```sql
CREATE TABLE solicitudes (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dia_solicitado DATE NOT NULL,
  telefono VARCHAR(20),
  turno VARCHAR(20) NOT NULL, -- 'Diurno' o 'Vespertino'
  jornada VARCHAR(20) NOT NULL, -- 'Completa' o 'Parcial'
  num_horas INTEGER NOT NULL,
  num_dias INTEGER NOT NULL,
  permiso_no_retribuido BOOLEAN DEFAULT FALSE,
  motivo TEXT NOT NULL,
  archivo_adjunto VARCHAR(500),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'aprobada', 'rechazada'
  motivo_rechazo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_solicitudes_usuario_id ON solicitudes(usuario_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX idx_solicitudes_dia_solicitado ON solicitudes(dia_solicitado);
```

## Storage Buckets

### Bucket: `documentos`
```sql
-- Crear bucket (via UI de Supabase o con SQL si es posible)
-- Políticas de seguridad: los usuarios solo pueden ver sus propios archivos
```

## Row Level Security (RLS)

### Política para tabla `perfiles`
```sql
-- Los usuarios pueden ver su propio perfil y admin ve todo
CREATE POLICY "Users can view own profile" 
ON perfiles 
FOR SELECT 
USING (id::text IN (
  SELECT user_id FROM (SELECT id as user_id FROM auth.users WHERE auth.uid() = id) t
));

CREATE POLICY "Users can update own profile" 
ON perfiles 
FOR UPDATE 
USING (id::text IN (
  SELECT user_id FROM (SELECT id as user_id FROM auth.users WHERE auth.uid() = id) t
));
```

### Política para tabla `solicitudes`
```sql
-- Los usuarios ven sus propias solicitudes, directivos ven todas
CREATE POLICY "Users can view own requests" 
ON solicitudes 
FOR SELECT 
USING (usuario_id = auth.uid() OR (
  SELECT rol FROM perfiles WHERE id = auth.uid()
) = 'directivo');

CREATE POLICY "Users can insert own requests" 
ON solicitudes 
FOR INSERT 
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Directivos can update requests" 
ON solicitudes 
FOR UPDATE 
USING ((
  SELECT rol FROM perfiles WHERE id = auth.uid()
) = 'directivo');
```

## Realtime Subscriptions

Habilitar Realtime para las tablas `solicitudes` para notificaciones en tiempo real.

## Pasos de Configuración

1. Crear proyecto en Supabase
2. Ejecutar los scripts SQL anteriores
3. Crear bucket 'documentos' en Storage
4. Configurar RLS policies
5. Habilitar Realtime en solicitudes
6. Obtener URL y anon key de Supabase
7. Configurar en `src/supabaseClient.ts`
