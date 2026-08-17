# 🎓 INTEGRACIÓN CON PLATAFORMAS ESCOLARES, LMS Y AGENDA DIGITAL (GOALS)

> **Módulo:** Seguimiento y Control • Capa 1: Ingesta Escolar  
> **Estado:** Tratado de Ingeniería de Producción (Cero Mocks / 100% APIs Reales)  
> **Ámbito:** Google Classroom, Microsoft Graph Education, Canvas, Moodle, Plataformas Españolas (Alexia, Educamos, Clickedu, iPasen, Raíces) y Fallback OCR Inteligente.

---

## 🏛️ 1. VISIÓN GENERAL DE LA INGESTA OMNICANAL

El objetivo del sistema es sincronizar a GOALS con el día a día escolar del estudiante de forma bidireccional y sin fricción, ingiriendo deberes, tareas, proyectos y exámenes desde cualquier plataforma escolar (global o local española) y normalizándolos en un **Esquema Canónico Universal**.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ARQUITECTURA DE INGESTA ESCOLAR GOALS                                  │
├────────────────────────────────┬──────────────────────────────────────┬────────────────────────────────┤
│ 🌍 LMS GLOBALES (K-12 / EDU)    │ 🇪🇸 PLATAFORMAS ESCOLARES ESPAÑA      │ 📸 FALLBACK INTELIGENTE (OCR)   │
│ • Google Classroom API v1      │ • Alexia (Educaria)                  │ • Foto de Agenda Escolar Física│
│ • MS Graph Education API v1.0  │ • Educamos (SM / Microsoft 365)      │ • Captura de Pantalla Portal   │
│ • Canvas LMS REST & LTI 1.3    │ • Clickedu (Sanoma Learning)         │ • Ficha o Cuaderno de Aula     │
│ • Moodle Web Services REST     │ • TokApp School                      │                                │
│                                │ • Raíces / Roble (Comunidad Madrid)  │   (Gemini Vision Struct OCR)   │
│                                │ • iPasen (Junta de Andalucía)        │                                │
├────────────────────────────────┴──────────────────────────────────────┴────────────────────────────────┤
│                                  │                                  │                                  │
│                                  ▼                                  ▼                                  ▼
│             ┌───────────────────────────────────────────────────────────────────────┐                  │
│             │        ADAPTADORES DE PROTOCOLO / CONECTORES DE INTEGRACIÓN           │                  │
│             │  • OAuth 2.0 PKCE / MSAL Client      • RFC 5545 iCal/CalDAV Ingestion │                  │
│             │  • Cloud Pub/Sub & Webhooks Push     • Multimodal Struct Parser       │                  │
│             └──────────────────────────────────┬────────────────────────────────────┘                  │
│                                                │                                                       │
│                                                ▼                                                       │
│             ┌───────────────────────────────────────────────────────────────────────┐                  │
│             │                  CANONICAL DATA NORMALIZER & PIPELINE                 │                  │
│             │     `CourseSubject` | `HomeworkItem` | `ExamItem` | `SubmissionStatus`│                  │
│             └──────────────────────────────────┬────────────────────────────────────┘                  │
│                                                │                                                       │
│                                                ▼                                                       │
│             ┌───────────────────────────────────────────────────────────────────────┐                  │
│             │            CURRICULAR GROUNDING (LOMLOE & KNOWLEDGE GRAPH)            │                  │
│             │  Mapeo de tema escolar a nodo educativo → Despliegue del Hub 4 Modos  │                  │
│             │  (1. Test Activo | 2. Explicador CPA | 3. Feynman | 4. Arena Quests)  │                  │
│             └───────────────────────────────────────────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 2. INTEGRACIÓN OFICIAL CON LMS GLOBALES (K-12)

### 2.1. Google Classroom API (v1)

#### A. Scopes Escolares Oficiales (OAuth 2.0)
Para un estudiante o cuenta familiar en GOALS:
- `https://www.googleapis.com/auth/classroom.courses.readonly`: Lectura de los cursos matriculados del alumno.
- `https://www.googleapis.com/auth/classroom.coursework.me.readonly`: Lectura de deberes, enunciados, fechas límite y materiales asignados al alumno.
- `https://www.googleapis.com/auth/classroom.student-submissions.me.readonly`: Lectura del estado de entrega y calificaciones de sus tareas.
- `https://www.googleapis.com/auth/classroom.announcements.readonly`: Lectura de avisos y recordatorios del profesor en el tablón.
- `https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly` (Opcional para cuentas de padres): Verificación de tutores legales.

#### B. Flujo de Autenticación
1. **Frontend / Mobile (Capacitor)**: En Android nativo se solicita el token con `@capacitor-firebase/authentication` o biblioteca OAuth con PKCE con `access_type=offline` y `prompt=consent` para obtener el `refresh_token`.
2. **Backend (Node.js / Supabase Edge Functions)**: Intercambia el código de autorización por `tokens` de acceso y refresco cifrados con **Envelope Encryption** (AES-256-GCM) en base de datos.

#### C. Endpoints REST Clave
- **Listar Cursos Activos:**
  ```http
  GET https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&studentId=me HTTP/1.1
  Authorization: Bearer {ACCESS_TOKEN}
  ```
- **Listar Tareas y Deberes Publicados:**
  ```http
  GET https://classroom.googleapis.com/v1/courses/{courseId}/courseWork?courseWorkStates=PUBLISHED HTTP/1.1
  Authorization: Bearer {ACCESS_TOKEN}
  ```
- **Obtener Estado de Entrega del Estudiante:**
  ```http
  GET https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/me HTTP/1.1
  Authorization: Bearer {ACCESS_TOKEN}
  ```

#### D. Notificaciones en Tiempo Real (Google Cloud Pub/Sub Webhooks)
Para evitar el polling continuo, se registran notificaciones push en Google Cloud Pub/Sub:
1. **Registrar Feed de Cambios:**
   ```http
   POST https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/registrations HTTP/1.1
   Authorization: Bearer {ACCESS_TOKEN}
   Content-Type: application/json

   {
     "feed": {
       "feedType": "COURSE_WORK_CHANGES",
       "courseWorkChangesInfo": {
         "courseId": "104928401928"
       }
     },
     "cloudPubsubTopic": {
       "topicName": "projects/goals-school-app/topics/classroom-coursework-feed"
     }
   }
   ```
2. **Cloud Function Push Endpoint**: Recibe el mensaje de Pub/Sub (`base64`), obtiene el `courseId` afectado, consulta los cambios y actualiza la base de datos en tiempo real.

---

### 2.2. Microsoft Graph Education API (v1.0)

#### A. Scopes y Autenticación MSAL
- **Scopes Delegados:**
  - `EduRoster.ReadBasic`: Información básica de clases y profesores.
  - `EduAssignments.ReadBasic`: Lectura básica de tareas y fechas límite.
  - `EduAssignments.Read`: Lectura completa de instrucciones, rúbricas y adjuntos.
  - `User.Read`: Perfil escolar del estudiante.
- **Tenant:** Endpoint multitenant `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` (compatible con cuentas Office 365 Educación de colegios y universidades).

#### B. Endpoints REST Clave
- **Listar Clases del Estudiante Conectado:**
  ```http
  GET https://graph.microsoft.com/v1.0/education/me/classes HTTP/1.1
  Authorization: Bearer {ACCESS_TOKEN}
  ```
- **Listar Tareas Publicadas de una Clase:**
  ```http
  GET https://graph.microsoft.com/v1.0/education/classes/{classId}/assignments?$filter=status eq 'published'&$orderby=dueDateTime asc HTTP/1.1
  Authorization: Bearer {ACCESS_TOKEN}
  ```
- **Obtener Entregas del Estudiante:**
  ```http
  GET https://graph.microsoft.com/v1.0/education/classes/{classId}/assignments/{assignmentId}/submissions HTTP/1.1
  Authorization: Bearer {ACCESS_TOKEN}
  ```

#### C. Change Notifications (Webhooks)
```http
POST https://graph.microsoft.com/v1.0/subscriptions HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json

{
  "changeType": "created,updated",
  "notificationUrl": "https://api.goals.education/webhooks/ms-teams/assignments",
  "resource": "/education/classes/{classId}/assignments",
  "expirationDateTime": "2026-08-20T18:23:45.000Z",
  "clientState": "goalsSecretStateValidationToken123"
}
```

---

### 2.3. Canvas LMS & Moodle

#### A. Canvas LMS (Instructure)
- **Autenticación:** OAuth 2.0 Bearer Token o Developer Key de institución:
  `GET https://{canvasDomain}/login/oauth2/auth?client_id={ID}&response_type=code&scope=url:GET|/api/v1/courses url:GET|/api/v1/users/self/upcoming_events`
- **Endpoints REST Principales:**
  - **Próximas Tareas y Eventos:**
    ```http
    GET https://{canvasDomain}/api/v1/users/self/upcoming_events HTTP/1.1
    Authorization: Bearer {ACCESS_TOKEN}
    ```
  - **Lista de Tareas de un Curso:**
    ```http
    GET https://{canvasDomain}/api/v1/courses/{courseId}/assignments?include[]=submission HTTP/1.1
    Authorization: Bearer {ACCESS_TOKEN}
    ```

#### B. Moodle Web Services REST
- **Protocolo:** Moodle Web Services REST API con token de usuario / Web Service Token.
- **Endpoint Universal Moodle:**
  ```http
  POST https://{moodleDomain}/webservice/rest/server.php HTTP/1.1
  Content-Type: application/x-www-form-urlencoded

  wstoken={USER_TOKEN}&wsfunction=core_calendar_get_action_events_by_timesort&moodlewsrestformat=json&timesortfrom=1786960000&limitnum=20
  ```
- **Funciones Web Services Esenciales:**
  1. `core_enrol_get_users_courses`: Asignaturas matriculadas.
  2. `core_calendar_get_action_events_by_timesort`: Timeline cronológico de tareas y exámenes.
  3. `mod_assign_get_assignments`: Metadatos completos de tareas.
  4. `mod_assign_get_submission_status`: Estado exacto de la entrega (`submitted`, `draft`, `graded`).

---

## 🇪🇸 3. MAPEO Y CONEXIÓN CON PLATAFORMAS ESCOLARES ESPAÑOLAS

Los centros escolares españoles (públicos, concertados y privados) utilizan plataformas de gestión de aula especializadas:

| Plataforma | Empresa / Entidad | Ámbito Principal | Mecanismo de Conexión Primario | Mecanismo Secundario |
| :--- | :--- | :--- | :--- | :--- |
| **Alexia** | Educaria | Concertados / Privados (FERE, Maristas, La Salle, etc.) | **Suscripción iCal/CalDAV Familiar** (`/agenda/export_ical.ics`) | API REST Familias (`/api/v2/students/{id}/agenda`) |
| **Educamos** | Fundación SM / Microsoft | Concertados / Religiosos en toda España | **SSO Microsoft 365 / MS Graph** (Teams & Calendar) | Feed iCal y API SM Educamos Familias |
| **Clickedu** | Sanoma Learning | Cataluña, Madrid, Comunidad Valenciana | **Feed iCalendar Escolar** (`/agenda/export_ical.php`) | Web Services REST (`/ws/v1/agenda`) |
| **TokApp School** | TokApp | Colegios públicos y concertados | **Webhook de Comunicados / iCal** | Exportación de citas de exámenes |
| **Raíces / Roble** | Comunidad de Madrid | 100% Colegios e IES Públicos y Concertados CAM | **Exportación `.ics` de Avisos y Exámenes** | Sincronización Web Roble Familias |
| **iPasen** | Junta de Andalucía | 100% Colegios e IES de Andalucía (>1.5M alumnos) | **Feed de Agenda iCal del Alumno** | API Móvil iPasen (Consulta de Controles y Tareas) |

---

### 3.1. Motor Universal de Ingesta iCal / CalDAV (RFC 5545)

Dado que prácticamente el 100% de las plataformas españolas ofrecen una URL de suscripción iCal (`webcal://` o `https://.../calendar.ics?token=...`), GOALS implementa un **Parser Cron Idempotente**:

```
           ┌──────────────────────────────────────────────┐
           │      Feed URL iCal (.ics) Privado Familia    │
           └──────────────────────┬───────────────────────┘
                                  │
                                  ▼
           ┌──────────────────────────────────────────────┐
           │     Cron Job en Backend (cada 30 min)        │
           │        `node-ical` / RFC 5545 Parser         │
           └──────────────────────┬───────────────────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   ▼                             ▼
        [ `VEVENT`: SUMMARY ]          [ `VEVENT`: DTSTART/DTEND ]
                   │                             │
                   ▼                             ▼
    ┌─────────────────────────────┐  ┌────────────────────────────┐
    │ Clasificador Heurístico / IA │  │ Fechas límite y Duraciones │
    │   ¿Es Deberes o Examen?     │  └─────────────┬──────────────┘
    └──────────────┬──────────────┘                │
                   │                               │
                   ▼                               ▼
    ┌─────────────────────────────────────────────────────────────┐
    │ Mapeo Canónico: `HomeworkItem` | `ExamItem` en Base de Datos│
    └─────────────────────────────────────────────────────────────┘
```

#### Reglas de Clasificación de Eventos iCal:
- **Examen / Control:** Si el `SUMMARY` contiene palabras clave como `examen`, `control`, `evaluación`, `prueba`, `test`, `global`, `recuperación`, `eval` → Se instancia un `ExamItem`.
- **Deberes / Tareas:** Si contiene `deberes`, `tarea`, `ejercicios`, `actividades`, `pág`, `entrega`, `worksheet`, `project` → Se instancia un `HomeworkItem`.
- **ID Idempotente:** `hash(provider + externalUID + startTimestamp)` para evitar duplicación entre sincronizaciones sucesivas.

---

### 3.2. Fallback Inteligente Asistido por OCR Multimodal (IA Socrática)

Cuando el colegio usa agenda física de papel, fichas impresas o una app sin exportación abierta:
1. **Captura Rápida (1-tap):** El alumno o padre toma una foto de la agenda escolar, de la pizarra del aula o una captura de pantalla del móvil.
2. **Procesamiento Multimodal (Gemini 1.5 Flash / Pro Vision):**
   - Extrae con precisión: Asignatura, Tipo (Deberes vs Examen), Fecha límite / Día de entrega, Ejercicios específicos (ej. *"pág 74 ej 2, 3 y 5"*), Requisitos del profesor.
3. **Respuesta JSON Estructurada:**

```json
{
  "sourceType": "physical_agenda_photo",
  "confidenceScore": 0.96,
  "detectedItems": [
    {
      "type": "homework",
      "subject": "Matemáticas",
      "normalizedSubjectId": "school_math_eso_2",
      "title": "Ejercicios de Ecuaciones con Paréntesis",
      "description": "Página 112, ejercicios 4, 5 y 6. El profesor pide simplificar el resultado.",
      "dueDate": "2026-08-19T08:30:00.000Z",
      "estimatedMinutes": 35,
      "pageRange": "112",
      "exerciseNumbers": [4, 5, 6],
      "requiresTeacherNotation": "Datos | Operación | Solución recuadrada"
    },
    {
      "type": "exam",
      "subject": "Física y Química",
      "normalizedSubjectId": "school_physics_eso_2",
      "title": "Control Tema 3: Movimiento y Fuerzas",
      "description": "Examen trimestral. Entra cinemática MRU, MRUA y Leyes de Newton.",
      "examDate": "2026-08-22T10:00:00.000Z",
      "syllabusTopics": ["MRU", "MRUA", "Leyes de Newton", "Cálculo de Fuerzas"]
    }
  ]
}
```

---

## 📐 4. MODELO UNIFICADO DE DATOS (CONTRATOS TYPESCRIPT)

```typescript
/**
 * GOALS School LMS & School Platforms Integration Contracts
 * File: src/core/types/schoolIntegration.ts
 */

export type SchoolLmsProvider =
  | 'google_classroom'
  | 'ms_teams'
  | 'canvas'
  | 'moodle'
  | 'alexia'
  | 'educamos'
  | 'clickedu'
  | 'tokapp'
  | 'raices_roble'
  | 'ipasen'
  | 'ical_feed'
  | 'ocr_agenda'
  | 'manual';

export type SubmissionStatus =
  | 'pending'       // Tarea pendiente de realizar
  | 'in_progress'   // En resolución dentro de GOALS o en cuaderno
  | 'completed'     // Completada por el estudiante
  | 'submitted'     // Entregada formalmente en el LMS del colegio
  | 'graded'        // Calificada por el profesor
  | 'late'          // Fuera de plazo
  | 'excused';      // Eximido / no aplica

export interface CourseSubject {
  id: string;                      // ID único GOALS (ej: "subj_math_2eso_alexia")
  studentId: string;              // UID del alumno
  provider: SchoolLmsProvider;
  externalCourseId: string;       // ID original en Google Classroom, Teams, Alexia, etc.
  name: string;                   // Nombre oficial (ej: "Matemáticas Académicas 2º ESO B")
  code?: string;                  // Código asignatura (ej: "MAT2B")
  normalizedDisciplineId: string; // Vínculo con el Knowledge Base de GOALS (ej: "school_math_eso_2")
  teacherName?: string;
  teacherEmail?: string;
  colorHex: string;               // Color para la UI
  icon: string;                   // Lucide icon name
  academicYear: string;           // "2025-2026"
  createdAt: number;
  updatedAt: number;
}

export interface HomeworkItem {
  id: string;                     // ID canónico GOALS
  studentId: string;
  courseSubjectId: string;        // Ref a CourseSubject
  provider: SchoolLmsProvider;
  externalId: string;             // ID único de la tarea en el LMS origen
  title: string;                  // Título de la tarea
  description?: string;           // Enunciado / instrucciones del profesor
  assignedAt: number;             // Timestamp ms de publicación
  dueDate: number;                // Timestamp ms de fecha límite
  estimatedMinutes: number;       // Tiempo estimado de resolución
  status: SubmissionStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Metadatos de Aula Extraídos
  pageRange?: string;             // ej: "págs. 44-45"
  exerciseList?: string[];        // ej: ["1", "2", "4a", "5"]
  
  // Vínculos con el Hub de Aprendizaje de GOALS
  linkedKnowledgeNodeIds?: string[]; // ej: ["MAT_ESO2_ALG_EQ_PARENTS"]
  activeQuizId?: string;             // Test diagnóstico autogenerado
  cpaExplainerId?: string;           // Explicador visual CPA vinculado
  
  // Auditoría y sincronización
  lastSyncedAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface ExamItem {
  id: string;                     // ID canónico GOALS
  studentId: string;
  courseSubjectId: string;        // Ref a CourseSubject
  provider: SchoolLmsProvider;
  externalId?: string;
  title: string;                  // ej: "Control Tema 4: Fracciones y Decimales"
  description?: string;
  examDate: number;               // Timestamp ms del examen
  weightPercentage?: number;      // Ponderación en el trimestre (ej: 40%)
  syllabusTopics: string[];       // Temas incluidos
  
  // Plan de Estudio y Simulación en GOALS
  studyPlan: {
    targetDaysBeforeExam: number;
    recommendedDailyMinutes: number;
    milestoneCheckpoints: Array<{
      date: string;
      topic: string;
      isCompleted: boolean;
    }>;
    mockExamTestId?: string;      // Examen de simulación previo
  };

  obtainedGrade?: number;         // Nota final del examen (0-10)
  lastSyncedAt: number;
  createdAt: number;
  updatedAt: number;
}
```

---

## ⚡ 5. VINCULACIÓN DIRECTA CON EL HUB DE APRENDIZAJE DE GOALS

Una vez que una tarea o examen es ingerido desde Google Classroom, Teams, Alexia o la foto de la agenda:

```
[ Ingesta de Tarea: "Ecuaciones de 2º Grado pág 82" ]
                         │
                         ▼
[ Curricular Grounding Engine ] ──► Detecta nodo: `MAT_ESO2_ALG_CUADRATICA`
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              ACTIVACIÓN AUTOMÁTICA DEL HUB EN 4 MODOS                   │
├────────────────────────────────┬────────────────────────────────────────┤
│ 🎯 1. Test Diagnóstico (3 min) │ Comprueba si el alumno sabe calcular   │
│                                │ el discriminante $\Delta = b^2 - 4ac$. │
├────────────────────────────────┼────────────────────────────────────────┤
│ 💡 2. Explicador Visual CPA    │ Simula la parábola y el corte con el   │
│                                │ eje X de forma interactiva.            │
├────────────────────────────────┼────────────────────────────────────────┤
│ 🧠 3. Workout Feynman & Memoria│ Flashcard de la fórmula general y reto │
│                                │ de audio de 45 segundos.               │
├────────────────────────────────┼────────────────────────────────────────┤
│ 🚀 4. Arena de Misiones        │ Resuelve un caso real de tiro          │
│                                │ parabólico en baloncesto.              │
└────────────────────────────────┴────────────────────────────────────────┘
```
