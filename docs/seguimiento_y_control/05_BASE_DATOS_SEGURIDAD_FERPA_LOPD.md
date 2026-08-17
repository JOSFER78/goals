# 🗄️ BASE DE DATOS RELACIONAL, CRIPTOGRAFÍA Y SEGURIDAD FERPA / LOPD-GDD (GOALS)

> **Módulo:** Seguimiento y Control • Capa 5: Persistencia, Criptografía y Privacidad  
> **Estado:** Tratado de Ingeniería y DDL SQL Ejecutable (Cero Mocks / 100% Producción Real)  
> **Estándares:** PostgreSQL 16+, Supabase RLS, Envelope Encryption (AES-256-GCM + Cloud KMS FIPS 140-3 Nivel 3), FERPA 34 CFR Part 99, LOPDGDD 3/2018 Art. 7/84 y Zero-PII Messaging.

---

## 1. 🗄️ DDL SQL POSTGRESQL COMPLETO (7 TABLAS PRINCIPALES + EXTENSIONES)

```sql
-- ============================================================================
-- GOALS SCHOOL AGENDA & FAMILY BOT - ESQUEMA RELACIONAL POSTGRESQL (PRODUCCIÓN)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TIPOS ENUMERADOS
CREATE TYPE lms_provider_type AS ENUM (
    'google_classroom', 'moodle', 'canvas', 'microsoft_teams', 'ical_feed', 'educamos', 'alexia'
);

CREATE TYPE assignment_status_type AS ENUM (
    'pending', 'in_progress', 'completed', 'submitted_external', 'graded', 'overdue'
);

CREATE TYPE bot_channel_type AS ENUM (
    'whatsapp', 'telegram', 'sms', 'email', 'push_notification'
);

CREATE TYPE alert_queue_status_type AS ENUM (
    'queued', 'processing', 'sent', 'delivered', 'read', 'failed', 'cancelled'
);

-- 1. TABLA: family_units
CREATE TABLE IF NOT EXISTS public.family_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_name VARCHAR(120) NOT NULL,
    country_code VARCHAR(2) NOT NULL DEFAULT 'ES',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Europe/Madrid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA: family_members
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family_units(id) ON DELETE CASCADE,
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('primary_parent', 'secondary_parent', 'guardian', 'student')),
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA: oauth_school_envelopes (Envelope Encryption con AES-256-GCM)
CREATE TABLE IF NOT EXISTS public.oauth_school_envelopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family_units(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    provider lms_provider_type NOT NULL,
    encrypted_dek_base64 TEXT NOT NULL,
    encrypted_payload_base64 TEXT NOT NULL,
    iv_hex VARCHAR(32) NOT NULL,
    auth_tag_hex VARCHAR(32) NOT NULL,
    aad_binding TEXT NOT NULL,
    key_version VARCHAR(50) NOT NULL,
    algorithm VARCHAR(30) NOT NULL DEFAULT 'AES-256-GCM',
    scopes_authorized TEXT[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_provider_envelope UNIQUE (student_id, provider)
);

-- 4. TABLA: school_courses
CREATE TABLE IF NOT EXISTS public.school_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family_units(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    external_course_id VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    subject_code VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL DEFAULT '#10B981',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA: school_assignments (Deberes y Tareas)
CREATE TABLE IF NOT EXISTS public.school_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family_units(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.school_courses(id) ON DELETE CASCADE,
    external_assignment_id VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    estimated_duration_minutes INT NOT NULL DEFAULT 30,
    status assignment_status_type NOT NULL DEFAULT 'pending',
    local_completed_at TIMESTAMPTZ,
    xp_reward INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLA: school_exams (Exámenes y ERI)
CREATE TABLE IF NOT EXISTS public.school_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family_units(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.school_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    exam_date TIMESTAMPTZ NOT NULL,
    readiness_index_eri NUMERIC(5,2) NOT NULL DEFAULT 50.00 CHECK (readiness_index_eri >= 0 AND readiness_index_eri <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABLA: parent_bot_subscriptions (WhatsApp / Telegram)
CREATE TABLE IF NOT EXISTS public.parent_bot_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family_units(id) ON DELETE CASCADE,
    parent_member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    channel bot_channel_type NOT NULL,
    phone_e164 VARCHAR(20),
    telegram_chat_id BIGINT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.family_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_school_envelopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_bot_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_auth_family_id()
RETURNS UUID AS $$
    SELECT family_id FROM public.family_members WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE POLICY "family_isolation_assignments" ON public.school_assignments
    FOR ALL USING (family_id = public.get_auth_family_id());

CREATE POLICY "family_isolation_exams" ON public.school_exams
    FOR ALL USING (family_id = public.get_auth_family_id());

CREATE POLICY "family_isolation_envelopes" ON public.oauth_school_envelopes
    FOR ALL USING (family_id = public.get_auth_family_id());
```

---

## 2. 🔐 ENVELOPE ENCRYPTION CON AES-256-GCM (`EnvelopeEncryptionService.ts`)

```typescript
import * as crypto from 'crypto';

export class EnvelopeEncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';

  public static async encryptOAuthTokens(
    tokens: Record<string, any>,
    parentId: string,
    childId: string,
    kmsClient: { encryptKey: (k: Buffer) => Promise<{ encryptedKey: Buffer; keyVersion: string }> }
  ) {
    const aadBinding = `parent:${parentId}|child:${childId}|provider:${tokens.provider}|v1`;
    const dekPlaintext = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);

    try {
      const cipher = crypto.createCipheriv(this.ALGORITHM, dekPlaintext, iv, { authTagLength: 16 });
      cipher.setAAD(Buffer.from(aadBinding, 'utf8'));

      const encryptedPayload = Buffer.concat([
        cipher.update(JSON.stringify(tokens), 'utf8'),
        cipher.final()
      ]);
      const authTag = cipher.getAuthTag();

      const { encryptedKey: encryptedDek, keyVersion } = await kmsClient.encryptKey(dekPlaintext);

      return {
        encryptedDekBase64: encryptedDek.toString('base64'),
        encryptedPayloadBase64: encryptedPayload.toString('base64'),
        ivHex: iv.toString('hex'),
        authTagHex: authTag.toString('hex'),
        aadBinding,
        keyVersion
      };
    } finally {
      dekPlaintext.fill(0); // Higiene de memoria estricta
    }
  }
}
```

---

## 3. 🛡️ MATRIZ ZERO-PII Y VALIDACIÓN CRIPTOGRÁFICA DE WEBHOOKS

### 3.1. Zero-PII Messaging Rule
- **Prohibición:** NUNCA enviar nombres completos, DNI, dirección física de la escuela ni notas oficiales en los payloads de WhatsApp o Telegram.
- **Sanitización:** Utilizar el nombre de pila o avatar del alumno (ej. "Álex"), el tema curricular y enlaces seguros HTTPS protegidos por PIN parental.

### 3.2. Validación HMAC-SHA256 en Tiempo Constante
```typescript
export class WebhookSecurityMiddleware {
  public static verifyMetaSignature(
    rawPayloadBuffer: Buffer,
    headerSignature: string | undefined,
    appSecret: string
  ): boolean {
    if (!headerSignature?.startsWith('sha256=')) return false;

    const signatureHex = headerSignature.slice(7);
    const expectedDigest = crypto.createHmac('sha256', appSecret).update(rawPayloadBuffer).digest('hex');

    const expectedBuffer = Buffer.from(expectedDigest, 'hex');
    const signatureBuffer = Buffer.from(signatureHex, 'hex');

    if (expectedBuffer.length !== signatureBuffer.length) return false;
    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  }
}
```
