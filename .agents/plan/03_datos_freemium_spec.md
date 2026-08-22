# 🏛️ ESPECIFICACIÓN TÉCNICA: MODELO DE DATOS UNIFICADO, SEGURIDAD RLS Y ESTRATEGIA FREEMIUM (GOALS 6–15 AÑOS)

**Documento:** `03_datos_freemium_spec.md`  
**Ecosistema:** GOALS Platform (`GOALS FutureSkills™` / `GOALS FutureMind™`)  
**Alcance:** Arquitectura de Datos Firestore, Reglas de Seguridad RLS, Cumplimiento Legal (COPPA, RGPD-K, UK ICO, Apple 1.3, Google Families), Naming Oficial, Estrategia Freemium/Monetización y Contratos TypeScript Unificados.  
**Fecha:** Agosto 2026 • **Estado:** Especificación Canónica de Ingeniería (SSOT).

---

## 📋 ÍNDICE GENERAL

1. [Visión General y Principios Rectores](#1-visión-general-y-principios-rectores)
2. [Modelo de Datos Firestore y Reglas de Seguridad (RLS)](#2-modelo-de-datos-firestore-y-reglas-de-seguridad-rls)
   - 2.1. Topología Jerárquica de Colecciones Firestore
   - 2.2. Esquema Detallado de Documentos
   - 2.3. Reglas de Seguridad en Tiempo Real (`firestore.rules`)
3. [Cumplimiento Normativo Infantil: COPPA, RGPD-K y Paywall](#3-cumplimiento-normativo-infantil-coppa-rgpd-k-y-paywall)
   - 3.1. Matriz Comparativa de Jurisdicciones y Estándares
   - 3.2. Principio Rector: Cero PII por Diseño (*Zero-PII by Default*)
   - 3.3. Puertas Parentales Infranqueables (*Parental Gates* en 3 Niveles)
4. [Naming Oficial de las Mini-Apps y Estrategia Freemium](#4-naming-oficial-de-las-mini-apps-y-estrategia-freemium)
   - 4.1. Marca Paraguas y Naming de las 5 Mini-Apps (Canónico vs. Intent-First)
   - 4.2. Estrategia Freemium: Reclamo (*Lead Magnet*) vs. Núcleo de Conversión
   - 4.3. Entitlements y Paquetes de Suscripción Familiar
5. [Mapeo Evolutivo: Edad → Curso Escolar → Contenido → UI/UX](#5-mapeo-evolutivo-edad--curso-escolar--contenido--uiux)
   - 5.1. Matriz de Adaptación por 3 Franjas de Edad (6–8, 9–11, 12–15 años)
   - 5.2. Correspondencia Curricular (LOMLOE & UK National Curriculum)
   - 5.3. Modulación de la Interfaz, la IA Socrática y la Gamificación
6. [Contratos TypeScript del Esquema de Perfil Unificado](#6-contratos-typescript-del-esquema-de-perfil-unificado)
7. [Plan de Integración y Compatibilidad con el Código Actual](#7-plan-de-integración-y-compatibilidad-con-el-código-actual)

---

## 1. VISIÓN GENERAL Y PRINCIPIOS RECTORES

La plataforma **GOALS** articula las 5 inteligencias humanas del futuro (Rendimiento Escolar Socrático, Astrofísica 3D, Programación e IA Real, Adquisición Natural de Idiomas por Voz y Pensamiento Crítico/Fact-Checking) en un **único expediente continuo e indivisible** para estudiantes de 6 a 15 años.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                ECOSISTEMA GOALS PLATFORM                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 👨‍👩‍👧 CUENTA PARENTAL (Titular Legal, Facturación, Entitlements, Bot WhatsApp/Telegram)   │
│   │                                                                                    │
│   ├── 👦 HIJO 1 (6-9a, Picture PIN 4 Iconos) ──► Experiencias + Learning State         │
│   └── 👧 HIJO 2 (10-15a, PIN Numérico 4d)   ──► Experiencias + Learning State         │
│                                                                                        │
│   [ 📐 FORGE / StudyCraft ] ─── Núcleo Académico Diario (15-20 min obligatorios)       │
│              │                                                                         │
│              ▼ (Master Key Activada: 2.0x XP + Acceso a Mazmorras)                     │
│   [ 🪐 COSMOS ]   [ 🤖 CÓRTEX ]   [ 🗣️ VOX ]   [ 🧭 CRITERIO ] ── Sandbox Gamificado   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Principios Fundamentales:
1. **Un Solo Cerebro, Un Solo Perfil (No-Silos):** El esfuerzo en matemáticas, la curiosidad cósmica y la precisión en idiomas alimentan un único nivel universal de maestría ($\mathcal{U}_{XP}$).
2. **Titularidad Legal Exclusiva del Adulto:** Los menores nunca crean cuentas legales directas; operan como sub-perfiles sin correo electrónico gestionados por sus padres.
3. **Cero Mocks y Datos Reales:** Telemetría espacial de NASA/ESA, código Python en cliente (Pyodide), espectrogramas de formantes de voz reales y fuentes educativas oficiales (LOMLOE / UK NC).
4. **Monetización Ética Familiar:** Sin anuncios, sin cajas de recompensas adictivas, sin micropagos directos al menor y con un muro de pago 100% blindado por puertas parentales.

---

## 2. MODELO DE DATOS FIRESTORE Y REGLAS DE SEGURIDAD (RLS)

### 2.1. Topología Jerárquica de Colecciones Firestore

El modelo de Firestore separa estrictamente la **entidad legal y de facturación** (padre/tutor) de los **perfiles de aprendizaje infantil** y los **catálogos globales inmutables**:

```
/users/{parentId}                                 [Doc Padre: Cuenta, Billing, PIN]
  │
  ├── /children/{childId}                         [Doc Hijo: Alias, Avatar, Edad, XP]
  │     │
  │     ├── /learningStates/{disciplineId}        [Doc Disciplina: Unidades, Mastery]
  │     ├── /evolutions/{evolutionId}             [Docs Logros: Hitos y XP ganado]
  │     └── /diagnosticSessions/{sessionId}       [Docs Diagnóstico: Micro-retos BKT]
  │
  └── /familyDevices/{deviceId}                   [Docs Dispositivos: Tablets vinculadas]

/curriculums/{disciplineId}/units/{unitId}       [Catálogo Global de Unidades (Read-only)]
/knowledge/{knowledgeId}/chunks/{chunkId}        [Base de Hechos SSOT (Read-only)]
/system/config                                   [Configuración Global y Versiones]
```

---

### 2.2. Esquema Detallado de Documentos

#### A. Documento Padre: `/users/{parentId}`
```json
{
  "uid": "usr_parent_9f8a7c2b",
  "email": "padre.ejemplo@gmail.com",
  "displayName": "Carlos Fernández",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "role": "parent",
  "authProvider": "google.com",
  "hashedParentPin": "$2a$12$e8x... (Bcrypt / PBKDF2)",
  "subscription": {
    "plan": "family_annual",
    "status": "active",
    "currentPeriodEnd": 1798761600000,
    "cancelAtPeriodEnd": false,
    "maxChildren": 4,
    "features": {
      "unlimitedSocraticOCR": true,
      "liveVoiceTutor": true,
      "fullAILab": true,
      "familyBotDigest": true,
      "multiChildSync": true
    }
  },
  "familyBot": {
    "whatsappNumber": "+34600112233",
    "whatsappEnabled": true,
    "telegramChatId": "123456789",
    "telegramEnabled": true,
    "quietHoursStart": "21:30",
    "quietHoursEnd": "08:00",
    "dailyDigestHour": "19:30"
  },
  "createdAt": 1724300000000,
  "updatedAt": 1724300000000
}
```

#### B. Documento Hijo: `/users/{parentId}/children/{childId}`
```json
{
  "id": "ch_7a8b9c",
  "parentId": "usr_parent_9f8a7c2b",
  "nickname": "Leo Cósmico",
  "avatarId": "astro_pilot_03",
  "birthYear": 2017,
  "age": 9,
  "grade": "4º de Primaria",
  "educationalStage": "primaria_2_ciclo",
  "ageTranche": "8-9",
  "authMethod": "picture_pin",
  "credentials": {
    "hashedSecret": "c8f9... (PBKDF2-HMAC-SHA256)",
    "salt": "a7b3... (32 bytes hex)",
    "pinLength": 4,
    "failedAttempts": 0,
    "lockedUntil": null
  },
  "dailyTimeLimitMinutes": 60,
  "gamification": {
    "universalXp": 12450,
    "cosmicTier": 1,
    "cosmicLevel": 8,
    "currentStreak": 5,
    "lastActiveDate": "2026-08-22",
    "weeklyActivity": [true, true, true, true, true, false, false],
    "crystals": {
      "silicon": 120,
      "plasma": 45,
      "radiantMatter": 10
    },
    "modularAvatar": {
      "helmet": "neural_visor_lvl2",
      "thruster": "orbital_jetpack_lvl1",
      "communicator": "vox_mic_lvl1",
      "shield": "criterio_aegis_lvl1",
      "drone": "sprocket_01"
    },
    "masterKeyActive": true,
    "masterKeyExpiresAt": 1724367600000
  },
  "preferences": {
    "favoriteSubjects": ["Ciencias Naturales", "Inglés"],
    "weakSubjects": ["Matemáticas"],
    "interests": ["Espacio y Astronomía 🚀", "Minecraft 🎮", "Robots 🤖"],
    "learningStyle": "visual"
  },
  "allowedExperiences": ["school", "astro", "languages", "criterio", "ai-lab"],
  "isActive": true,
  "createdAt": 1724300000000,
  "updatedAt": 1724300000000
}
```

#### C. Expediente de Aprendizaje: `/users/{parentId}/children/{childId}/learningStates/{disciplineId}`
```json
{
  "disciplineId": "astro",
  "experienceId": "astro",
  "diagnosticStatus": "completed",
  "diagnosticScore": 88,
  "diagnosticDate": 1724305000000,
  "estimatedAgeLevel": 9,
  "recommendedStartUnitId": "astro_u04_mars_geology",
  "currentUnitId": "astro_u05_jupiter_moons",
  "completedUnitIds": [
    "astro_u01_earth_atmosphere",
    "astro_u02_moon_phases",
    "astro_u03_sun_dynamics",
    "astro_u04_mars_geology"
  ],
  "conceptMastery": {
    "rotacion_terrestre": {
      "conceptKey": "rotacion_terrestre",
      "scorePercent": 95,
      "totalAttempts": 4,
      "lastPracticedAt": 1724305000000,
      "status": "mastered"
    },
    "inclinacion_eje_estaciones": {
      "conceptKey": "inclinacion_eje_estaciones",
      "scorePercent": 60,
      "totalAttempts": 2,
      "lastPracticedAt": 1724308000000,
      "status": "needs_reinforcement"
    }
  },
  "weakConcepts": ["inclinacion_eje_estaciones"],
  "strengths": ["rotacion_terrestre", "gravedad_planetaria"],
  "sessionHistory": [
    {
      "unitId": "astro_u04_mars_geology",
      "completedAt": 1724308000000,
      "scorePercent": 100,
      "xpEarned": 75,
      "attempts": 1,
      "durationSeconds": 620
    }
  ],
  "disciplineXp": 3450,
  "updatedAt": 1724308000000
}
```

---

### 2.3. Reglas de Seguridad en Tiempo Real (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Funciones auxiliares de autenticación y roles
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isParent(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isSuperAdmin() {
      return isAuthenticated() && 
        (request.auth.token.email == 'josferestudio@gmail.com' || request.auth.token.admin == true);
    }

    function isChildSession(parentId, childId) {
      return isAuthenticated() && (
        request.auth.uid == parentId || 
        request.auth.token.childId == childId
      );
    }

    // 1. Colección de Padres y Cuentas Familiares
    match /users/{parentId} {
      allow read, write: if isParent(parentId) || isSuperAdmin();

      // 1.1. Perfiles de Hijos (Gestión por Padre y lectura por el Alumno)
      match /children/{childId} {
        allow read: if isChildSession(parentId, childId) || isSuperAdmin();
        allow write: if isParent(parentId) || isSuperAdmin();

        // 1.2. Estados de Aprendizaje por Mini-App
        match /learningStates/{disciplineId} {
          allow read: if isChildSession(parentId, childId) || isSuperAdmin();
          allow write: if isChildSession(parentId, childId) || isSuperAdmin();
        }

        // 1.3. Registro de Logros y Evoluciones
        match /evolutions/{evolutionId} {
          allow read: if isChildSession(parentId, childId) || isSuperAdmin();
          allow create: if isChildSession(parentId, childId) || isSuperAdmin();
          allow update, delete: if isParent(parentId) || isSuperAdmin();
        }

        // 1.4. Sesiones Diagnósticas Adaptativas
        match /diagnosticSessions/{sessionId} {
          allow read, write: if isChildSession(parentId, childId) || isSuperAdmin();
        }
      }

      // 1.5. Dispositivos Familiares Autorizados
      match /familyDevices/{deviceId} {
        allow read, write: if isParent(parentId) || isSuperAdmin();
      }
    }

    // 2. Colecciones Globales Curriculares y de Conocimiento (Solo Lectura Pública)
    match /curriculums/{disciplineId}/units/{unitId} {
      allow read: if true;
      allow write: if isSuperAdmin();
    }

    match /knowledge/{knowledgeId} {
      allow read: if true;
      allow write: if isSuperAdmin();
      
      match /chunks/{chunkId} {
        allow read: if true;
        allow write: if isSuperAdmin();
      }
    }

    // 3. Configuración del Sistema
    match /system/{configDoc} {
      allow read: if true;
      allow write: if isSuperAdmin();
    }
  }
}
```

---

## 3. CUMPLIMIENTO NORMATIVO INFANTIL: COPPA, RGPD-K Y PAYWALL

### 3.1. Matriz Comparativa de Jurisdicciones y Estándares

| Parámetro | COPPA (EE.UU.) | RGPD-K / LOPDGDD (España/UE) | UK Children's Code (ICO) | Apple Kids (1.3 & 5.1.4) | Google Play Families |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Edad Umbral** | $< 13$ años | $< 14$ años (España) / $< 16$ (UE) | $< 18$ años (graduado) | $< 11$ / $< 13$ años | Declarada en consola |
| **Titular de Cuenta** | Adulto (VPC Verificado) | Padre / Tutor Legal | Adulto / Joven con DPIA | Adulto con Parental Gate | Adulto (Neutral Age Screen) |
| **Recogida de PII** | **Prohibición Total** | **Minimización Extrema** | **Cero Uso Perjudicial** | **Prohibido solicitar PII** | **Cero PII no esencial** |
| **Identificadores** | Prohibido rastreo cruzado | Prohibido perfilado comercial | Perfilado OFF por defecto | **IDFA Prohibido (No ATT)** | **AAID Puesto a Cero** |
| **Puerta Parental** | Obligatoria en transacciones | Exigida en consentimiento | Obligatoria en configuraciones | **Infranqueable (Guideline 1.3)** | **Obligatoria en IAP** |
| **Sanción Máxima** | $50.120 / infracción / día | 20M€ o 4% facturación global | 17.5M£ o 4% facturación | **Expulsión de App Store** | **Cancelación de Cuenta** |

---

### 3.2. Principio Rector: Cero PII por Diseño (*Zero-PII by Default*)

1. **Sin Identidad Real Infantil:** En ningún formulario de la app se solicita nombre real, apellidos, colegio real, dirección física ni teléfono del menor.
2. **Pseudónimos y Avatares Ilustrados:** La personalización se basa en alias (*AstroExplorer42*) y personajes ilustrados de la suite (sin fotos de cámara de la cara del niño).
3. **Imágenes de Cuadernos (OCR):** Las capturas del sensor escolar se procesan en memoria volátil de cliente/servidor para extraer únicamente el texto de los enunciados y se purgan de inmediato sin almacenar fotos del cuaderno.
4. **Derecho al Olvido Instantáneo (Art. 17 RGPD):** El panel parental incluye un botón de purga síncrona que elimina irreversiblemente el perfil infantil y su historial en menos de 5 segundos.

---

### 3.3. Puertas Parentales Infranqueables (*Parental Gates* en 3 Niveles)

Conforme a la directriz **1.3 de Apple App Store** y las políticas de **Google Play Families**, cualquier intento de abandonar la zona infantil o ejecutar acciones comerciales activa una Puerta Parental adaptativa:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     ALGORITMOS DE PUERTA PARENTAL                      │
├────────────────────────────────────────────────────────────────────────┤
│ • NIVEL 1 (Aritmética Dinámica de 2 Dígitos):                          │
│   Genera en tiempo real operaciones complejas para niños:              │
│   Ejemplo: "Para continuar, resuelve: 8 × 7 = [ 56 ]"                   │
│                                                                        │
│ • NIVEL 2 (Transcripción Numérica en Texto en Español):                │
│   Genera números de 4 cifras en letras:                                │
│   Ejemplo: "Escribe en cifras: MIL NOVECIENTOS NOVENTA Y DOS" ──► 1992 │
│                                                                        │
│ • NIVEL 3 (PIN Maestro Parental Cifrado):                              │
│   Requerido obligatoriamente para Pagos, Suscripciones y Borrado.      │
│   Entrada de 4 dígitos con Rate Limiting (Bloqueo tras 3 fallos).      │
└────────────────────────────────────────────────────────────────────────┘
```

**Disparadores Obligatorios de Parental Gate:**
- Acceso a pantalla de precios, paywall o selección de plan premium.
- Cambio de perfil infantil a configuración de cuenta parental.
- Enlaces externos (política de privacidad, web institucional, redes sociales).
- Modificación de límites de tiempo de pantalla o borrado de cuenta.

---

## 4. NAMING OFICIAL DE LAS MINI-APPS Y ESTRATEGIA FREEMIUM

### 4.1. Marca Paraguas y Naming de las 5 Mini-Apps

Para erradicar la confusión con apps deportivas o agendas genéricas, la marca paraguas adopta descriptores de alta intención: **GOALS FutureSkills™** / **GOALS FutureMind™**.

El ecosistema cuenta con dos líneas de denominación armonizadas: el **Quinteto Canónico de Impacto (Power Words)** y el **Naming Basado en Intención (*Intent-First Naming*)**:

| Mini-App / Dominio | Naming Canónico (Power Words) | Naming Basado en Intención (*Intent-First*) | Color Identitario | Promesa Nuclear de Aprendizaje |
| :--- | :--- | :--- | :--- | :--- |
| **1. Escuela Socrática** | **GOALS FORGE™** | **GOALS StudyCraft™** | 🟢 Emerald (`#10B981`) | Tutor Socrático Curricular (LOMLOE/UK NC) & Sensor OCR de Cuadernos. |
| **2. Astrofísica 3D** | **GOALS COSMOS™** | **GOALS SpaceExplorer 3D™** | 🔵 Indigo (`#4F46E5`) | Simulación Orbital 3D NASA/ESA, 8 Escalas y Telemetría en Vivo. |
| **3. IA & Código** | **GOALS CÓRTEX™** | **GOALS CodeCraft AI™** | 🟣 Purple (`#7C3AED`) | Python real en navegador (Wasm), Redes Neuronales & Transformers. |
| **4. Idiomas & Voz** | **GOALS VOX™** | **GOALS SpeakFlow™** | 🔷 Cyan (`#0284C7`) | Adquisición Natural por Voz en Vivo, Fonética y Fluidez sin Miedo. |
| **5. Pensamiento Crítico** | **GOALS CRITERIO™** | **GOALS MindShield™** | 🟠 Amber (`#D97706`) | Sala de Rigor, Detección de Falacias, Fake News & Fact-Checking. |

---

### 4.2. Estrategia Freemium: Reclamo (*Lead Magnet*) vs. Núcleo de Conversión

```
┌────────────────────────────────────────────────────────────────────────┐
│                     ESTRATEGIA FREEMIUM GOALS                          │
├────────────────────────────────────────────────────────────────────────┤
│ 🧲 LEAD MAGNET GRATUITO (Atracción & Asombro):                         │
│ • GOALS COSMOS™ / SpaceExplorer 3D™ (12 Lecciones base + 3D Canvas)   │
│ • Micro-Diagnóstico Inicial Adaptativo en 3 minutos.                   │
│ • 1 Desafío diario gratuito en cada mini-app.                          │
│                                                                        │
│ 🔒 PAYWALL & CONVERSIÓN ("The Reactor Core"):                          │
│ • GOALS FORGE / StudyCraft: Acompañamiento escolar diario ilimitado.   │
│ • La Llave Maestra (Master Key): Desbloqueo de mazmorras y 2.0x XP.   │
│ • Asistente Familiar Omnicanal: Bot WhatsApp / Telegram para Padres.   │
│ • Inmersión en Voz en Vivo en Idiomas y Laboratorio de IA sin límites. │
└────────────────────────────────────────────────────────────────────────┘
```

#### Mecánica de Conversión Freemium:
1. **Paso 1 (Descubrimiento Gratuito):** El estudiante y la familia entran fascinados por el simulador 3D de **Cosmos** y completan el test diagnóstico.
2. **Paso 2 (Detección del Punto de Dolor Real):** La familia descubre que la verdadera angustia cotidiana son los deberes de la tarde, los exámenes atascados y el tiempo de pantalla improductivo.
3. **Paso 3 (Activación de la Llave Maestra):** La app propone el pacto familiar: 15 minutos diarios de estudio curricular socrático en **Forge/StudyCraft** desbloquean el hiperimpulso gamificado en Cosmos, Córtex, Vox y Criterio.
4. **Paso 4 (Conversión Parental con Paz Mental):** El padre desbloquea el plan familiar para recibir los resúmenes diarios por WhatsApp (*Daily Digest* a las 19:30), las alertas tempranas de lagunas (BKT) y las preguntas curiosas para la cena (*Dinner Connection*).

---

### 4.3. Entitlements y Paquetes de Suscripción Familiar

```
│ Nivel / Plan          │ Precio Estimado  │ Perfiles │ Entitlements Incluidos                                   │
├───────────────────────┼──────────────────┼──────────┼──────────────────────────────────────────────────────────┤
│ 🆓 GOALS Free Cadet   │ 0 € / Siempre    │ 1 Hijo   │ Cosmos 3D básico, 1 reto diario/app, diagnóstico inicial.│
│ ⭐ GOALS Family Pro   │ 9,99 € / mes     │ 2 Hijos  │ Tutor OCR ilimitado, Voz en vivo, WhatsApp Bot diario.   │
│ 🚀 GOALS Family Pass  │ 79,99 € / año    │ 4 Hijos  │ Ecosistema completo, Master Key, Telegram + WA, Soporte. │
```

---

## 5. MAPEO EVOLUTIVO: EDAD → CURSO ESCOLAR → CONTENIDO → UI/UX

### 5.1. Matriz de Adaptación por 3 Franjas de Edad

```
                                  MAPEO EVOLUTIVO GOALS
 ┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
 │ FRANJA 1: 6 a 8 Años      │ FRANJA 2: 9 a 11 Años     │ FRANJA 3: 12 a 15 Años    │
 │ "El Explorador Curioso"   │ "Constructor de Maestría" │ "El Estratega Autónomo"   │
 ├───────────────────────────┼───────────────────────────┼───────────────────────────┤
 │ • 1.º a 3.º de Primaria   │ • 4.º a 6.º de Primaria   │ • 1.º a 4.º de ESO        │
 │ • Key Stage 1 / KS2 prep  │ • Key Stage 2 pleno       │ • Key Stage 3 / KS4       │
 │ • Sesiones: 5 - 10 min    │ • Sesiones: 15 - 25 min   │ • Sesiones: 30 - 45 min   │
 │ • UI: 1 foco, botones 72px│ • UI: Bento cards modulares│ • UI: Dark Glassmorphism  │
 │ • Login: Picture PIN (4)  │ • Login: Picture / PIN 4d │ • Login: PIN Numérico 4d  │
 │ • Zero-Penalty absoluto   │ • Refactorización socrática│ • Auditoría de hipótesis │
 └───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

---

### 5.2. Correspondencia Curricular (LOMLOE & UK National Curriculum)

| Tramo Edad | Ciclo LOMLOE (España) | UK National Curriculum | Competencias Clave & Foco Pedagógico |
| :--- | :--- | :--- | :--- |
| **6–7 años** | 1.º Ciclo Primaria (1.º-2.º) | Key Stage 1 (Year 1–2) | Observación sensorial directa, conceptos espaciales básicos, fonética inicial, vocabulario de exploración. |
| **8–9 años** | 2.º Ciclo Primaria (3.º-4.º) | Key Stage 2 Lower (Year 3–4) | Relaciones causa-efecto, método CPA Singapur, comprensión lectora, dinámicas planetarias elementales. |
| **10–11 años**| 3.º Ciclo Primaria (5.º-6.º) | Key Stage 2 Upper (Year 5–6) | Clasificación formal, proporcionalidad, gramática funcional por voz, pensamiento algorítmico básico. |
| **12–13 años**| 1.º Ciclo ESO (1.º-2.º) | Key Stage 3 Lower (Year 7–8) | Formulación cuantitativa inicial, cinemática, debate socrático guiado, detección de sesgos y falacias. |
| **14–15 años**| 2.º Ciclo ESO (3.º-4.º) | Key Stage 4 / GCSE (Year 9–10)| Modelado matemático estricto, astrofísica orbital (Kepler/RK4), código Python Wasm, fact-checking OSINT. |

---

### 5.3. Modulación de la Interfaz, la IA Socrática y la Gamificación

```
┌──────────────────┬─────────────────────────────┬─────────────────────────────┬─────────────────────────────┐
│ Dimensión        │ 6–8 Años (Pequeños)         │ 9–11 Años (Intermedios)     │ 12–15 Años (Jóvenes)        │
├──────────────────┼─────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ **Profundidad**  │ 1-2 frases + analogía visual│ Párrafos claros con datos   │ Texto académico + fórmulas  │
│ **Interacción**  │ Arrastrar y soltar gigante  │ Sliders y capas de datos    │ Parámetros físicos reales   │
│ **Evaluación**   │ 2 opciones con emojis (0 pen)│ 3-4 opciones estructuradas │ Preguntas de cálculo/desarrollo│
│ **Tono de IA**   │ Mascota cálida (*Pet*)      │ Mentor amigable socrático   │ Colega científico riguroso  │
│ **Recompensas**  │ Criaturas que despiertan    │ Cristales y árboles talento │ Rangos de ingeniería y telemetría│
│ **Audio Sint.**  │ Pentatónica Do Mayor (WebAudio)│ Arpegios armónicos          │ Notificaciones de cabina JPL│
└──────────────────┴─────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

---

## 6. CONTRATOS TYPESCRIPT DEL ESQUEMA DE PERFIL UNIFICADO

A continuación se presenta la especificación canónica completa de tipos TypeScript que unifica cuenta, perfil infantil, estado curricular, gamificación y suscripción premium:

```typescript
/**
 * src/core/types/unifiedGoalsContracts.ts
 * Contratos Canónicos del Ecosistema GOALS (Parent, Child, Gamification, Entitlements)
 */

export type ExperienceId = 'school' | 'astro' | 'languages' | 'criterio' | 'ai-lab';
export type AgeTranche = '6-7' | '8-9' | '10-11' | '12-13' | '14-15';
export type AgeGroupBand = '6-8' | '9-11' | '12-15';

export type EducationalStage = 
  | 'primaria_1_ciclo' // 1º y 2º Primaria (6-7 años)
  | 'primaria_2_ciclo' // 3º y 4º Primaria (8-9 años)
  | 'primaria_3_ciclo' // 5º y 6º Primaria (10-11 años)
  | 'eso_1_ciclo'      // 1º y 2º ESO (12-13 años)
  | 'eso_2_ciclo';     // 3º y 4º ESO (14-15 años)

export type SubscriptionPlanType = 'free_cadet' | 'family_monthly' | 'family_annual' | 'school_license';
export type SubscriptionStatusType = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';

// ============================================================================
// 1. ENTITLEMENTS Y PLAN FAMILIAR
// ============================================================================
export interface PlanEntitlements {
  maxChildrenProfiles: number;
  unlimitedSocraticOCR: boolean;
  liveVoiceTutorMinutesPerDay: number; // 0 = demo 5m, -1 = ilimitado
  fullAILabPythonExecution: boolean;
  familyBotWhatsAppDigest: boolean;
  familyBotTelegramAccess: boolean;
  examReadinessAlerts: boolean;
  offlineEncryptedStorage: boolean;
}

export interface FamilySubscriptionState {
  plan: SubscriptionPlanType;
  status: SubscriptionStatusType;
  entitlements: PlanEntitlements;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  paymentProvider?: 'stripe' | 'apple_iap' | 'google_play' | 'promo';
  stripeCustomerId?: string;
  subscriptionId?: string;
}

// ============================================================================
// 2. CUENTA PARENTAL (TITULAR LEGAL)
// ============================================================================
export interface FamilyBotSettings {
  whatsappNumber?: string;
  whatsappEnabled: boolean;
  telegramChatId?: string;
  telegramEnabled: boolean;
  quietHoursStart: string; // "21:30"
  quietHoursEnd: string;   // "08:00"
  dailyDigestHour: string; // "19:30"
  notifyExamRisk: boolean;
  notifyHomeworkGap: boolean;
}

export interface ParentAccountProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: 'parent' | 'admin' | 'educator';
  authProvider: 'google.com' | 'apple.com' | 'password';
  hashedParentPin?: string; // PIN Maestro de 4 dígitos para Parental Gate
  subscription: FamilySubscriptionState;
  familyBot: FamilyBotSettings;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// 3. GAMIFICACIÓN ÉTICA Y META-PROGRESIÓN
// ============================================================================
export interface ModularAvatarRig {
  helmet: string;       // Evoluciona con Córtex (IA)
  thruster: string;     // Evoluciona con Cosmos (Astronomía)
  communicator: string; // Evoluciona con Vox (Idiomas)
  shield: string;       // Evoluciona con Criterio (Pensamiento Crítico)
  drone: string;        // Evoluciona con School (Rendimiento Académico)
}

export interface ChildGamificationState {
  universalXp: number;
  cosmicTier: number;   // 1 a 10 (Cadete Planetario -> Almirante Supremo)
  cosmicLevel: number;  // 1 a 100
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  weeklyActivity: boolean[]; // [Lun, Mar, Mie, Jue, Vie, Sab, Dom]
  
  // Economía Virtual de Esfuerzo (Sin micropagos)
  crystals: {
    silicon: number;        // Córtex
    plasma: number;         // Cosmos
    radiantMatter: number;  // Criterio
    harmonyFlow: number;    // Vox
    stellarAmber: number;   // School (Master Key)
  };
  
  modularAvatar: ModularAvatarRig;
  masterKeyActive: boolean;
  masterKeyExpiresAt?: number;
  unlockedBadges: string[];
}

// ============================================================================
// 4. CREDENCIALES Y AUTENTICACIÓN INFANTIL (ZERO-PII)
// ============================================================================
export type ChildAuthMethod = 'picture_pin' | 'numeric_pin';

export interface ChildCredentialsData {
  authMethod: ChildAuthMethod;
  hashedSecret: string; // PBKDF2-HMAC-SHA256
  salt: string;
  pinLength: number;    // 4 iconos o 4 dígitos
  failedAttempts: number;
  lockedUntil: number | null;
  lastLoginAt?: number;
}

// ============================================================================
// 5. PERFIL EDUCATIVO UNIFICADO DEL NIÑO (ChildLearnerProfile)
// ============================================================================
export interface ChildLearnerProfile {
  id: string;              // UUID único del menor
  parentId: string;        // UID del padre titular
  nickname: string;        // Alias cósmico (Zero-PII, ej: "Leo Cósmico")
  avatarId: string;        // ID del avatar ilustrado (sin fotos reales)
  
  // Demografía Educativa
  birthYear: number;
  age: number;             // 6 a 15
  grade: string;           // ej. '4º de Primaria', '2º de ESO'
  educationalStage: EducationalStage;
  ageTranche: AgeTranche;
  ageGroupBand: AgeGroupBand; // '6-8' | '9-11' | '12-15'
  
  // Seguridad y Credenciales
  credentials: ChildCredentialsData;
  dailyTimeLimitMinutes: number;
  allowedExperiences: ExperienceId[];
  isActive: boolean;
  
  // Preferencias y Estilos de Aprendizaje
  preferences: {
    interests: string[];
    favoriteSubjects: string[];
    weakSubjects: string[];
    learningStyle: 'visual' | 'auditivo' | 'practico' | 'general';
  };
  
  // Gamificación y Meta-Nivel
  gamification: ChildGamificationState;
  
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// 6. EXPEDIENTE DE APRENDIZAJE POR MINIAPP (StudentLearningState)
// ============================================================================
export type ConceptMasteryStatus = 'needs_reinforcement' | 'in_progress' | 'mastered' | 'advanced';

export interface ConceptMasteryItem {
  conceptKey: string;
  scorePercent: number;    // 0 - 100
  totalAttempts: number;
  lastPracticedAt: number;
  status: ConceptMasteryStatus;
}

export interface SessionHistoryLog {
  unitId: string;
  completedAt: number;
  scorePercent: number;
  xpEarned: number;
  attempts: number;
  durationSeconds: number;
}

export interface DisciplineLearningState {
  disciplineId: ExperienceId;
  diagnosticStatus: 'not_started' | 'pending' | 'in_progress' | 'completed' | 'skipped';
  diagnosticScore?: number;
  diagnosticDate?: number;
  estimatedAgeLevel?: number;
  
  recommendedStartUnitId?: string;
  currentUnitId: string;
  completedUnitIds: string[];
  
  conceptMastery: Record<string, ConceptMasteryItem>;
  weakConcepts: string[];
  strengths: string[];
  
  sessionHistory: SessionHistoryLog[];
  disciplineXp: number;
  updatedAt: number;
}
```

---

## 7. PLAN DE INTEGRACIÓN Y COMPATIBILIDAD CON EL CÓDIGO ACTUAL

Para garantizar una transición fluida sin romper el código en producción:

1. **Adaptadores de Compatibilidad (`LegacyProfileAdapter.ts` & `LegacyProgressAdapter.ts`):**
   - El sistema actual lee `childProfile` y `learnerProfile` en `src/core/services/LearnerProfileService.ts`.
   - Se mantiene la sincronización bidireccional entre la estructura plana histórica y el nuevo modelo jerárquico `ChildLearnerProfile`.
2. **Actualización de Reglas de Firestore:**
   - Desplegar las reglas descritas en la sección 2.3 en `firestore.rules` reemplazando la regla de desarrollo abierta `{ allow read, write: if true; }`.
3. **Persistencia Híbrida L1-L2-L4:**
   - Mantener el patrón **Cache-First** (L1 RAM $	o$ L2 LocalStorage/IndexedDB $	o$ L4 Firestore) para permitir navegación instantánea offline en tablets familiares y sincronización en segundo plano al recuperar conexión.

---

### ✅ Conclusión
Este informe define formalmente el estándar de datos, seguridad legal infantil y modelo de negocio freemium para la plataforma GOALS, blindando la privacidad del estudiante, asegurando la paz mental familiar y maximizando la conversión ética del producto.
