# 🏫 SEGUIMIENTO Y CONTROL: ARQUITECTURA DE CONEXIÓN ESCOLAR Y BOT FAMILIAR (GOALS)

> **Módulo:** Seguimiento y Control Académico Familiar  
> **Estado:** Tratado de Ingeniería y Especificación Canónica (Cero Mocks / 100% Producción Real)  
> **Público Objetivo:** Estudiantes de 6 a 15 años (LOMLOE / UK National Curriculum) y sus Familias  
> **Objetivo Central:** Conectar el día a día del colegio con GOALS sin fricción y brindar **paz mental y control proactivo a los padres** a través de WhatsApp y Telegram sin estrés ni lenguaje punitivo.

---

## 🏛️ 1. VISIÓN GENERAL DEL ECOSISTEMA

El módulo **Seguimiento y Control** resuelve la brecha entre la vida escolar del alumno y la tranquilidad del hogar mediante 4 pilares tecnológicos:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ECOSISTEMA DE SEGUIMIENTO Y CONTROL                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. INGESTA ESCOLAR OMNICANAL                                                                     │
│    • Conexión oficial API: Google Classroom v1, Microsoft Graph Education v1.0, Canvas, Moodle. │
│    • Plataformas españolas: Alexia, Educamos, Clickedu, iPasen, Raíces vía feeds iCal/CalDAV.    │
│    • Fallback inteligente: Escaneo OCR multimodal de agenda física o captura de pantalla.        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. MOTOR PSICOMÉTRICO Y DETECCIÓN TEMPRANA (BKT + ERI)                                           │
│    • Bayesian Knowledge Tracing $P(L_t)$ en tiempo real y decaimiento de memoria FSRS/Ebbinghaus.│
│    • Traversal DAG de prerrequisitos: detecta la causa raíz de los tropiezos (ej. fracciones).   │
│    • Índice de Preparación de Examen (Exam Readiness Index - ERI $\in [0, 100]\%$).              │
│    • 5 Reglas automáticas: Deberes hoy a las 18:30, Examen $\le 48\text{h}$, Lagunas, Inactividad.│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. ASISTENTE FAMILIAR OMNICANAL (WHATSAPP CLOUD & TELEGRAM BOT)                                  │
│    • Plantillas interactivas aprobadas por Meta (`UTILITY`) con botones de acción directa.       │
│    • Bot de Telegram ultra-reactivo (<10ms) con grammY, Deep Linking y Mini App 3D embebida.    │
│    • Router de notificaciones con control de horas de silencio (*Quiet Hours* 21:30 a 08:00).   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. REPORTERO FAMILIAR NLP & DINNER CONNECTION                                                    │
│    • Traducción de telemetría dura a lenguaje cálido y reconfortante (*Parental Peace of Mind*). │
│    • *Daily Evening Digest* (19:30) y Resumen Semanal de Semáforos 🟢 🟡 🔴.                     │
│    • *Dinner Connection Engine*: Preguntas curiosas STEM para la cena con chuleta para padres.   │
│    • Comandos bidireccionales: *"¿Cómo va hoy?"*, *"¿Qué exámenes tiene?"*, *"Ponle 20m inglés"*.│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 5. SEGURIDAD, ENVELOPE ENCRYPTION Y COMPLIANCE (FERPA / LOPD-GDD)                                │
│    • Envelope Encryption (AES-256-GCM + Cloud KMS FIPS 140-3 Nivel 3) para tokens OAuth.         │
│    • Matriz Zero-PII: Prohibición de enviar nombres completos, colegios o notas oficiales en chat.│
│    • Desuscripción instantánea síncrona (<500ms) ante palabras clave (`STOP`, `BAJA`).          │
│    • Validación criptográfica HMAC-SHA256 en tiempo constante de webhooks de Meta y Telegram.    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ 2. MAPA DE LA DOCUMENTACIÓN TÉCNICA

Los tratados maestros que componen esta investigación se estructuran en los siguientes documentos exhaustivos:

| Archivo | Título del Tratado | Contenido Fundamental |
| :--- | :--- | :--- |
| [`01_INTEGRACION_LMS_PLATAFORMAS_ESCOLARES.md`](./01_INTEGRACION_LMS_PLATAFORMAS_ESCOLARES.md) | **Integración con Plataformas Escolares y LMS** | Google Classroom API, MS Graph Education, Canvas, Moodle, ecosistemas españoles (Alexia, Educamos, Clickedu, iPasen, Raíces), sincronización RFC 5545 iCal/CalDAV y fallback OCR asistido por IA. |
| [`02_ARQUITECTURA_BOT_WHATSAPP_TELEGRAM.md`](./02_ARQUITECTURA_BOT_WHATSAPP_TELEGRAM.md) | **Arquitectura de Mensajería Proactiva para Familias** | WhatsApp Business Cloud API (Meta Graph v20.0, plantillas aprobadas, botones interactivos), Telegram Bot API (grammY, Deep Linking, WebApps), Router Multicanal y Quiet Hours. |
| [`03_MOTOR_REGLAS_ALERTAS_TEMPRANAS.md`](./03_MOTOR_REGLAS_ALERTAS_TEMPRANAS.md) | **Motor de Reglas y Detección de Riesgo Académico** | Modelado matemático BKT $O(1)$, decaimiento FSRS, cálculo determinista de ERI, traversal DAG de prerrequisitos, 5 reglas maestras y filtrado anti-saturación parental. |
| [`04_NLP_INFORMES_HUMANIZADOS_CONVERSACION.md`](./04_NLP_INFORMES_HUMANIZADOS_CONVERSACION.md) | **NLP Conversacional, Informes y Conexión Familiar** | Traductor semántico de telemetría a lenguaje humano, plantillas de Daily Briefing, banco de preguntas curiosas para la cena con chuleta y árbol de diálogo bidireccional del bot. |
| [`05_BASE_DATOS_SEGURIDAD_FERPA_LOPD.md`](./05_BASE_DATOS_SEGURIDAD_FERPA_LOPD.md) | **Base de Datos Relacional, Criptografía y Privacidad** | DDL SQL PostgreSQL completo (9 tablas), políticas RLS, Envelope Encryption AES-256-GCM, Zero-PII sanitization, validación HMAC-SHA256 y checklist de auditoría. |

---

## 🎯 3. FILOSOFÍA PEDAGÓGICA Y PARENTAL

1. **Cero Estrés, Máxima Claridad:** Los padres no quieren dashboards complicados ni informes llenos de tecnicismos; quieren saber en **20 segundos** cómo le ha ido a su hijo, si tiene tareas pendientes y cómo pueden conectar con él durante la cena.
2. **Diagnóstico de Causa Raíz vs. Castigo:** Si un alumno tropieza en un tema, GOALS no emite alertas alarmistas; identifica si la dificultad proviene de un concepto previo (prerrequisito BKT) y despliega automáticamente una micro-actividad interactiva de 10 minutos para desbloquearlo.
3. **Control Parental sin Invasión:** Los deberes del colegio quedan sincronizados y verificados. Si a las 18:30 hay tareas para mañana sin hacer, el padre recibe un recordatorio sereno con las soluciones ya preparadas en la app del estudiante.
