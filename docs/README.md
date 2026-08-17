# 📚 GOALS — REPOSITORIO MAESTRO DE INVESTIGACIÓN, ARQUITECTURA Y DOCUMENTACIÓN PEDAGÓGICA

Bienvenido a la biblioteca central de documentación, especificaciones de arquitectura, tratados neuroeducativos y planes curriculares de **GOALS** (Generative Open Adaptive Learning System).

> [!NOTE]
> **Carácter Vivo y Rigor Científico:**  
> Este repositorio constituye la **Single Source of Truth (SSOT)** del proyecto. Es una guía viva de consulta, investigación empírica y fundamentación técnica para el diseño de software y transposición didáctica de 6 a 15 años. **Cero Mocks, Cero Suposiciones: Datos reales, APIs abiertas, modelos validados y doble formato (Markdown + Web Interactiva).**

---

## 🧭 MAPA MAESTRO DEL ECOSISTEMA (10 DIMENSIONES)

```
docs/
├── README.md                      # 📄 Este Índice Maestro Global
│
├── 🏛️ architecture/               # Arquitectura Global del Motor Adaptativo, Tipos, Firestore y Actualizaciones OTA
├── 🌌 cosmos/                     # Cosmos 3D: Astronomía, Mecánica Kepleriana y Astrofísica Relativista
├── 🗣️ languages/                  # Languages: SLA Natural, Tutor Conversacional de Voz y Matriz CEFR A1-C2
├── ⚖️ criterio/                   # Criterio: Pensamiento Crítico, Lógica Formal, Sesgos y Verificación Forense
├── 🤖 ai-lab/                     # AI Lab: Ciencias de la Computación, Algoritmia, Modelos Neuronales y Robótica
├── 📐 school/                     # School: Tutor Socrático LOMLOE / UK National Curriculum (CPA y Matemáticas)
│
├── 🎮 gamificacion/               # Gamificación Ética: Octalysis, Psicología 3 Franjas y Pactos Familiares
├── 🔐 login/                      # Login & Safety: Autenticación Parental, Picture PINs, COPPA, RGPD y Firebase Auth
├── 📢 marketing/                  # Marketing & Naming: Estrategia de Marca, Ecosistema de Nombres y Copywriting
└── 📱 seguimiento_y_control/      # Seguimiento & Control: Conexión LMS Escolar y Bot de Padres (WhatsApp/Telegram)
```

---

## 🗂️ DESGLOSE DETALLADO DE SUBDIRECTORIOS

### 1. 🏛️ [Arquitectura Global y Sistema Adaptativo](./architecture/README.md)
Núcleo del motor educativo adaptable por edad y nivel (6–15 años).
- **[`01_GLOBAL_ARCHITECTURE.md`](./architecture/01_GLOBAL_ARCHITECTURE.md):** Diagrama de flujo unificado del motor adaptativo y router dinámico.
- **[`02_ADAPTIVE_ENGINE_IRT.md`](./architecture/02_ADAPTIVE_ENGINE_IRT.md):** Principios rectores de 4 capas y modelo de datos `LearnerProfile` / `StudentLearningState`.
- **[`03_CURRICULAR_SPEC_AGE_LEVEL_UI.md`](./architecture/03_CURRICULAR_SPEC_AGE_LEVEL_UI.md):** Especificación técnica completa de 20 puntos sobre edad, nivel e interfaz.
- **[`04_OTA_UPDATES_AND_DEPLOYMENT.md`](./architecture/04_OTA_UPDATES_AND_DEPLOYMENT.md):** Sistema de auto-actualizaciones silently verificadas en Firebase Hosting/Firestore para APKs Capacitor.
- **[`spec_curriculum_viewer.html`](./architecture/spec_curriculum_viewer.html):** Visor web interactivo (Dark Glassmorphism) de la especificación curricular adaptativa.
- **[`audits/`](./architecture/audits/):** Auditorías históricas (`DEVELOPMENT_AUDIT.md`, `GOALS_GLOBAL_AUDIT.md`, `ADAPTIVE_ARCHITECTURE_AUDIT.md`, `GOALS_MIGRATION_STATUS.md`).
- **[`deep_dives/`](./architecture/deep_dives/):** Especificaciones técnicas (`COSMOS_ADAPTIVE_IMPLEMENTATION.md`, `COSMOS_ADAPTIVE_TEST_PLAN.md`, `ASTRO_REFERENCE_ANALYSIS.md`, `GOALS_LANGUAGES_MASTER_PLAN.md`).

### 2. 🌌 [Cosmos (Astronomía & Física 3D)](./cosmos/)
Piloto insignia de GOALS. Exploración del universo en 8 escalas de magnitud con Three.js a escala real.
- **12 Tratados Maestros (`00_MASTER_PLAN_CURRICULAR.md` a `11_ARQUITECTURA_OFFLINE_L1_L4_CAPACITOR.md`)**.
- **Laboratorios:** 10 Fichas de experimentación casera y conexión a telescopios robóticos reales (MicroObservatory, LCO).
- **Vanguardia 2026:** Misiones Artemis II/III, Telescopio Espacial James Webb, observatorio Vera Rubin y Euclid.

### 3. 🗣️ [Languages (Idiomas & SLA Natural)](./languages/)
Profesor particular de idiomas multimodal, conversacional y adaptativo por competencias CEFR (A1–C2).
- **Playbook de 26 Bloques:** `00_MASTER_PLAN.md`, `GOALS_LANGUAGES_26_BLOCKS_PLAYBOOK.md` y especificaciones `01` a `26`.
- **12 Tratados Maestros:** Fonética bioacústica, interferencias L1-L2, roleplays prácticos y motor de voz MVP.
- **`index.html`:** Visor interactivo del plan maestro de idiomas.

### 4. ⚖️ [Criterio (Pensamiento Crítico & Falacias)](./criterio/)
Entrenamiento en detección de desinformación, falacias lógicas, sesgos cognitivos y debate socrático (*Elenchus*).
- **Tratados Especializados:** Catálogo de 20 sesgos y 20 falacias, 10 laboratorios de debate forense.
- **Herramientas Reales:** Argdown, modelos Toulmin, metadatos C2PA y análisis solar con SunCalc.
- **`criterio_interactive_showcase.html`:** Showcase web interactivo.

### 5. 🤖 [AI Lab (IA, Algoritmia & Programación)](./ai-lab/)
Formación desde pensamiento computacional tangible hasta redes neuronales y agentes inteligentes.
- **Tratados Especializados:** Homologación CSTA/ACM/UNESCO/LOMLOE, 10 laboratorios de código, APIs reales (Hugging Face, TensorFlow.js).
- **Auto-Actualización:** `12_SISTEMA_INTELIGENTE_AUTO_ACTUALIZACION_CURRICULAR.md` (filtrado anti-hype PTI $\ge 0.72$ y evolución DAG).
- **`ai_lab_interactive_showcase.html`:** Visor web interactivo de AI Lab.

### 6. 📐 [School (Tutor Socrático LOMLOE / Curricular)](./school/)
Apoyo curricular formal en Matemáticas y Ciencias mediante el enfoque Concreto-Pictórico-Abstracto (CPA de Bruner/Singapur).
- **Tratados Especializados:** Didáctica CPA, misconceptions en ciencias y matemáticas, laboratorios prácticos.
- **Herramientas Reales:** GeoGebra Math Engine, SymPy WebAssembly y balanceador de ecuaciones químicas.
- **Ingesta Contextual:** `12_INGESTA_CONTEXTUAL_HUB_APRENDIZAJE.md` (OCR matemático y grounding estricto).

### 7. 🎮 [Gamificación (Meta-Progresión & Pactos Familiares)](./gamificacion/README.md)
Diseño motivacional ético y sin ansiedad (White Hat Gamification según Yu-kai Chou).
- **`01_BENCHMARK_EDTECH_OCTALYSIS_ETICO.md`:** Auditoría de dinámicas adictivas vs formativas.
- **`02_PSICOLOGIA_DESARROLLO_3_FRANJAS_EDAD.md`:** Psicología evolutiva para 6–8, 9–11 y 12–15 años.
- **`03_ARQUITECTURA_META_NIVEL_AVATAR_SINERGIAS.md`:** Meta-progresión unificada, árbol de habilidades y avatares.
- **`04_PACTOS_FAMILIARES_RECOMPENSAS_MUNDO_REAL.md`:** Contratos familiares inteligentes y recompensas tangibles.

### 8. 🔐 [Login & Seguridad Parental](./login/README.md)
Onboarding seguro y protección integral de menores.
- **`01_NORMATIVA_LEGAL_COPPA_RGPD_KIDS.md`:** Cumplimiento legal estricto para menores de 13/14/16 años.
- **`02_BENCHMARK_SMARTICK_EDTECH_GLOBAL.md`:** Comparativa de flujos de acceso infantil y parental.
- **`03_ARQUITECTURA_BASE_DATOS_RLS_SEGURIDAD.md`:** Modelo Firestore con RBAC y reglas estrictas `isOwner()`.
- **`04_UX_UI_ONBOARDING_PARENTAL_GATES.md`:** Picture PINs infantiles y Parental Gates matemáticos.

### 9. 📢 [Marketing, Naming & Posicionamiento](./marketing/README.md)
Estrategia de marca, narrativa y propuesta de valor para familias y colegios.
- **`00_MASTER_BRAND_STRATEGY.md`:** Posicionamiento "Anti-Brainrot" y propuesta de valor única.
- **`01_COMPETITIVE_LANDSCAPE_AUDIT.md`:** Benchmark frente a Duolingo, Khan Academy, Brilliant y Smartick.
- **`02_MINIAPPS_NAMING_ECOSYSTEM.md`:** Arquitectura de nomenclatura de las 5 miniapps.
- **`03_COPYWRITING_POSITIONING_PITCH.md`:** Guiones de venta, landing copy y argumentarios por audiencia.
- **`04_INTENT_DRIVEN_COMPOUND_NAMING.md`:** Nomenclatura orientada a la intención de aprendizaje.

### 10. 📱 [Seguimiento & Control (LMS y Bots Familiares)](./seguimiento_y_control/README.md)
Puente entre la experiencia del menor y la supervisión transparente de familias y docentes.
- **`01_INTEGRACION_LMS_PLATAFORMAS_ESCOLARES.md`:** Conexión con Google Classroom, Canvas y Moodle vía LTI 1.3 / OneRoster.
- **`02_ARQUITECTURA_BOT_WHATSAPP_TELEGRAM.md`:** Bot bidireccional para resúmenes semanales y pactos familiares.
- **`03_MOTOR_REGLAS_ALERTAS_TEMPRANAS.md`:** Detección de fatiga, bloqueos conceptuales y altas capacidades.
- **`04_NLP_INFORMES_HUMANIZADOS_CONVERSACION.md`:** Generación de informes en lenguaje natural y sugerencias de diálogo.
- **`05_BASE_DATOS_SEGURIDAD_FERPA_LOPD.md`:** Cifrado de extremo a extremo y privacidad absoluta de datos de menores.

---

## 🎯 MATRIZ ESTÁNDAR DE LOS 12 TRATADOS POR MINI-APP

Todas las mini-apps educativas de GOALS (`cosmos`, `languages`, `criterio`, `ai-lab`, `school`) siguen la estructura homogénea de 12 tratados maestros:

| Tratado | Archivo Maestro | Enfoque Pedagógico y Técnico |
|---|---|---|
| **00** | `00_MASTER_PLAN_CURRICULAR.md` | Currículo en espiral, unidades didácticas y competencias por tramo. |
| **01** | `01_RESEARCH_COMPENDIUM_2026.md` | Estado del arte científico y compendio de investigación. |
| **02** | `02_NEUROEDUCACION_*.md` | Carga cognitiva (Sweller), tiempos atencionales y memoria de trabajo. |
| **03** | `03_DIDACTICA_MISCONCEPTIONS_*.md` | Catálogo de errores conceptuales arraigados y protocolos socráticos. |
| **04** | `04_HOMOLOGACION_*.md` | Mapeo cruzado LOMLOE, NGSS/CCSS, UK National Curriculum e IB. |
| **05** | `05_LABORATORIOS_*.md` | 10 Fichas de prácticas reales cuantitativas (cero materiales peligrosos). |
| **06** | `06_HERRAMIENTAS_APIS_*.md` | Integración de librerías y APIs reales de código abierto en cliente (Cero Mocks). |
| **07** | `07_CIENCIA_VANGUARDIA_2026.md` | Factualidad científica y avances tecnológicos verificados a 2026. |
| **08** | `08_PSICOMETRIA_IRT_ELO_*.md` | Modelo IRT 2PL, ELO adaptativo, curva de Ebbinghaus y carrera de 25 niveles. |
| **09** | `09_ACCESIBILIDAD_DUA_*.md` | WCAG 2.2 AAA, adaptaciones TDAH/TEA/Dislexia y paleta Okabe-Ito. |
| **10** | `10_PORTAL_DOCENTE_FAMILIAR_*.md` | Radar 6D, detección de talento/bloqueos y actividades offline. |
| **11** | `11_ARQUITECTURA_OFFLINE_*.md` | Jerarquía de caché L1–L4, sincronización CRDT y Capacitor Android. |

---

## ⚡ LOS 5 TRAMOS DE EDAD Y ARQUETIPOS COGNITIVOS

| Tramo | Edad | Etapa LOMLOE | Arquetipo Cognitivo | Profundidad Textual | Persona IA |
|---|---|---|---|---|---|
| **6-7** | 6 y 7 años | 1º y 2º Primaria | Inicial / Sensorial | Concisa (`<15` palabras/frase) | `cosmic_pet` (Mascota juguetona) |
| **8-9** | 8 y 9 años | 3º y 4º Primaria | Explorador Concreto | Concisa con retos empíricos | `friendly_tutor` (Guía explorador) |
| **10-11** | 10 y 11 años | 5º y 6º Primaria | Avanzado Causal | Estándar con datos y relaciones | `socratic_mentor` (Mentor socrático) |
| **12-13** | 12 y 13 años | 1º y 2º ESO | Científico Junior | Profunda con física y formulación | `socratic_mentor` (Profesor riguroso) |
| **14-15** | 14 y 15 años | 3º y 4º ESO | Investigador Pre-Uni | Analítica $\LaTeX$ y formalismo | `science_colleague` (Colega investigador) |
