# 🗄️ ARQUITECTURA TÉCNICA Y ESQUEMA DE BASE DE DATOS: LOGIN PADRE-HIJOS
## Esquema Relacional PostgreSQL (DDL SQL 6 Tablas), Políticas RLS, Criptografía de Picture PIN (PBKDF2/Argon2id) y Tokens Delegados (Supabase/Firebase)

**Ecosistema:** GOALS Platform (6 a 15 Años)  
**Stack de Seguridad:** PostgreSQL 15+, Supabase Auth / Firebase Custom Claims, Web Crypto API nativa, AES-256-GCM y Row Level Security (RLS).  
**Fecha:** Agosto 2026 • Estado: Documento Canónico de Arquitectura Técnica (SSOT).

---

### ÍNDICE GENERAL
1. **Modelo de Datos Relacional (DDL SQL 6 Tablas)**: `parents`, `child_profiles`, `child_credentials`, `family_devices`, `device_child_tokens`, `child_progress`.
2. **Políticas de Seguridad a Nivel de Fila (PostgreSQL RLS)**.
3. **Mecanismo Criptográfico para Picture PIN (4 Iconos)**.
4. **Función de Base de Datos `verify_and_mint_child_session` (RPC SECURITY DEFINER)**.
5. **Persistencia Cifrada Offline (AES-256-GCM en IndexedDB / Capacitor)**.
6. **Contratos de Tipos TypeScript (`familyAuthContracts.ts`)**.

---

## 1. MODELO DE DATOS RELACIONAL EN POSTGRESQL (DDL SQL)

```sql
-- ============================================================================
-- GOALS FAMILY AUTHENTICATION & MULTI-PROFILE SCHEMA
-- Database: PostgreSQL 15+ (Compatible con Supabase & Firebase Custom Tokens)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA: parents (Extensión del usuario auth.users)
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_parent_pin VARCHAR(255) NULL, -- PIN de 4 dígitos para Parental Gate
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'email',
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'free',
    max_children INT NOT NULL DEFAULT 4 CHECK (max_children > 0 AND max_children <= 10),
    family_name VARCHAR(100) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABLA: child_profiles (Perfiles de los hijos)
CREATE TABLE IF NOT EXISTS public.child_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
    nickname VARCHAR(50) NOT NULL,
    avatar_id VARCHAR(100) NOT NULL DEFAULT 'astro_cadet_01',
    birth_year INT NOT NULL CHECK (birth_year >= 2000 AND birth_year <= 2030),
    grade_level VARCHAR(50) NOT NULL DEFAULT '3º de Primaria',
    daily_time_limit_minutes INT NOT NULL DEFAULT 60 CHECK (daily_time_limit_minutes >= 5 AND daily_time_limit_minutes <= 480),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    current_level INT NOT NULL DEFAULT 1 CHECK (current_level >= 1),
    total_xp BIGINT NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
    current_streak INT NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    allowed_experiences TEXT[] NOT NULL DEFAULT ARRAY['school', 'cosmos', 'cortex', 'vox', 'criterio'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_parent_child_nickname UNIQUE (parent_id, nickname)
);

-- 3. TABLA: child_credentials (Secretos de acceso infantil)
CREATE TABLE IF NOT EXISTS public.child_credentials (
    child_id UUID PRIMARY KEY REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    auth_method VARCHAR(50) NOT NULL DEFAULT 'picture_pin', -- 'picture_pin' | 'numeric_pin'
    hashed_secret VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    pin_length INT NOT NULL DEFAULT 4,
    failed_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ NULL,
    last_login_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA: family_devices (Dispositivos familiares autorizados)
CREATE TABLE IF NOT EXISTS public.family_devices (
    device_id VARCHAR(128) PRIMARY KEY,
    parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
    device_name VARCHAR(100) NOT NULL DEFAULT 'Tablet Familiar',
    platform VARCHAR(50) NOT NULL DEFAULT 'android',
    is_trusted BOOLEAN NOT NULL DEFAULT TRUE,
    last_active_child_id UUID NULL REFERENCES public.child_profiles(id) ON DELETE SET NULL,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABLA: device_child_tokens (Tokens delegados de sesión infantil)
CREATE TABLE IF NOT EXISTS public.device_child_tokens (
    token_hash VARCHAR(64) PRIMARY KEY,
    device_id VARCHAR(128) NOT NULL REFERENCES public.family_devices(device_id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
    scope TEXT[] NOT NULL DEFAULT ARRAY['school', 'cosmos', 'cortex', 'vox', 'criterio'],
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ NULL
);

-- 6. TABLA: child_progress (Progreso curricular del alumno)
CREATE TABLE IF NOT EXISTS public.child_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    experience_id VARCHAR(50) NOT NULL,
    lesson_id VARCHAR(100) NOT NULL,
    stars INT NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
    score INT NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    xp_earned INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_child_lesson UNIQUE (child_id, experience_id, lesson_id)
);
```

---

## 2. POLÍTICAS DE SEGURIDAD A NIVEL DE FILA (POSTGRESQL RLS)

```sql
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_progress ENABLE ROW LEVEL SECURITY;

-- 1. Los padres gestionan sus perfiles infantiles
CREATE POLICY "Parents manage their children"
    ON public.child_profiles FOR ALL
    USING (parent_id = auth.uid())
    WITH CHECK (parent_id = auth.uid());

-- 2. Los niños solo leen su propio perfil
CREATE POLICY "Children read own profile"
    ON public.child_profiles FOR SELECT
    USING (id = (auth.jwt() ->> 'child_id')::UUID);

-- 3. Los niños solo leen y escriben en su propio progreso escolar
CREATE POLICY "Children insert and read own progress"
    ON public.child_progress FOR ALL
    USING (child_id = (auth.jwt() ->> 'child_id')::UUID)
    WITH CHECK (child_id = (auth.jwt() ->> 'child_id')::UUID);

-- 4. Los padres pueden ver el progreso de todos sus hijos
CREATE POLICY "Parents view all children progress"
    ON public.child_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.child_profiles
            WHERE child_profiles.id = child_progress.child_id
            AND child_profiles.parent_id = auth.uid()
        )
    );
```

---

## 3. CRIPTOGRAFÍA DE PICTURE PIN (16 ICONOS / 4 RANURAS)

- **Combinaciones:** $16^4 = 65.536$ permutaciones visuales.
- **Diccionario Canónico de 16 Glifos:** `ROCKET` (🚀), `CAT` (🐱), `PIZZA` (🍕), `SOCCER` (⚽), `GUITAR` (🎸), `CROWN` (👑), `DINO` (🦖), `ICE_CREAM` (🍦), `LIGHTNING` (⚡), `DIAMOND` (💎), `CAR` (🚗), `PALETTE` (🎨), `RAINBOW` (🌈), `ROBOT` (🤖), `LION` (🦁), `GAMEPAD` (🎮).
- **Derivación de Clave:** PBKDF2-HMAC-SHA256 con **600.000 iteraciones** y Salt aleatorio de 32 bytes por usuario.
- **Comparación en Tiempo Constante (*Constant-Time*):** Prevención de *timing attacks*.
- **Rate Limiting:** Bloqueo automático de 15 minutos tras 5 intentos fallidos consecutivos.

---

## 4. PERSISTENCIA CIFRADA OFFLINE (AES-256-GCM)

En tablets con almacenamiento local (Capacitor/IndexedDB), el progreso del alumno y los datos de sesión se cifran mediante **AES-256-GCM** utilizando una clave derivada localmente del `device_pairing_secret` con 100.000 iteraciones de PBKDF2. Al recuperar la conexión a internet, los paquetes acumulados se sincronizan de forma síncrona sin bloquear la UI.
