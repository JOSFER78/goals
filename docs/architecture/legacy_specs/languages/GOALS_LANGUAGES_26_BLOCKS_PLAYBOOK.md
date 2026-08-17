# GOALS LANGUAGES: PLAYBOOK MAESTRO DE LOS 26 BLOQUES DE INGENIERÍA
**Guía de Ejecución Incremental para AGY / Antigravity**

---

## 🧭 ÍNDICE GENERAL DE BLOQUES

| # | Bloque | Fase | Archivo | Responsabilidad Principal |
|---|---|---|---|---|
| **01** | Architecture & Modular Structure | 0. Fundaciones | [01_ARCHITECTURE.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/01_ARCHITECTURE.md) | Estructura de carpetas modular (<250 líneas) y contratos base. |
| **02** | Design System & Visual Harmony | 0. Fundaciones | [02_DESIGN_SYSTEM.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/02_DESIGN_SYSTEM.md) | Tokens HSL, Dark Glassmorphism, animaciones de ondas de audio. |
| **03** | Firebase & Data Model | 0. Fundaciones | [03_FIREBASE_DATA_MODEL.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/03_FIREBASE_DATA_MODEL.md) | Esquemas Firestore y persistencia híbrida offline-first en LocalStorage. |
| **04** | Learner Profile & Adaptive Onboarding | 1. Perfil & Estado | [04_LEARNER_PROFILE.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/04_LEARNER_PROFILE.md) | Onboarding por edades (6-10 / 11-15+), intereses y sensibilidad de corrección. |
| **05** | Learning State & CEFR Mastery | 1. Perfil & Estado | [05_LEARNING_STATE.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/05_LEARNING_STATE.md) | Radar de 8 competencias CEFR y cálculo ponderado de dominio (0-100%). |
| **06** | Teacher Text Brain (Socratic AI) | 2. Profesor & Memoria | [06_TEACHER_TEXT.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/06_TEACHER_TEXT.md) | Agente socrático con IA real, respuesta en JSON estructurado y corrección empática. |
| **07** | Memory Service (Lexical, Errors & Episodic) | 2. Profesor & Memoria | [07_MEMORY.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/07_MEMORY.md) | Vocabulario en 6 estados, catálogo de errores recurrentes y memoria de sesiones. |
| **08** | Conversation Engine (Free & Directed) | 2. Profesor & Memoria | [08_CONVERSATION.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/08_CONVERSATION.md) | Diálogo dinámico continuo, control de turnos y sugerencias socráticas. |
| **09** | Voice MVP & Bidirectional Speech | 3. Voz & Acústica | [09_VOICE_MVP.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/09_VOICE_MVP.md) | Reconocimiento STT y síntesis TTS neuronal con manejo de interrupciones. |
| **10** | Speech Analysis & Acoustic Waveforms | 3. Voz & Acústica | [10_SPEECH_ANALYSIS.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/10_SPEECH_ANALYSIS.md) | Canvas osciloscopio en tiempo real, análisis de formantes y fonemas difíciles. |
| **11** | Practice Generator (6 Exercise Types) | 4. Contenido & Práctica | [11_PRACTICE_GENERATOR.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/11_PRACTICE_GENERATOR.md) | Generación bajo demanda de 6 tipos de ejercicios adaptativos con explicación. |
| **12** | Story Engine (Personalized Narratives) | 4. Contenido & Práctica | [12_STORIES.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/12_STORIES.md) | Cuentos ilustrados adaptados al nivel del alumno con audio y vocabulario interactivo. |
| **13** | Reading Deck & Comprehension | 4. Contenido & Práctica | [13_READING.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/13_READING.md) | Lectura guiada, interactiva y autónoma con seguimiento de audio y cuestionarios. |
| **14** | Writing Lab (4-Layer Correction) | 4. Contenido & Práctica | [14_WRITING.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/14_WRITING.md) | Taller de redacción con corrección en 4 capas: Error, Razón, Versión Nativa y Práctica. |
| **15** | Pedagogical Translation Bench | 4. Contenido & Práctica | [15_TRANSLATION.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/15_TRANSLATION.md) | Traducción pragmática con detección de falsos amigos y audio nativo. |
| **16** | Listening Deck & Audio Comprehension | 4. Contenido & Práctica | [16_LISTENING.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/16_LISTENING.md) | Retos auditivos con velocidad graduable, dictados y tests de comprensión. |
| **17** | Roleplay Engine & Real-Life Simulations | 4. Contenido & Práctica | [17_ROLEPLAY.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/17_ROLEPLAY.md) | Escenarios generativos no guionizados (aeropuerto, reuniones, entrevistas) con rúbricas. |
| **18** | Multimodal Artifacts & Infographics | 4. Contenido & Práctica | [18_MULTIMODAL_ARTIFACTS.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/18_MULTIMODAL_ARTIFACTS.md) | Infografías vectoriales SVG y tarjetas visuales interactivas con puntos calientes de audio. |
| **19** | Curriculum CEFR (A1 to C2 Matrix) | 5. Currículo & Adapt. | [19_CURRICULUM.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/19_CURRICULUM.md) | Matriz oficial de competencias, micro-habilidades y árbol de progresión. |
| **20** | Adaptive Planner (Next Best Action Engine) | 5. Currículo & Adapt. | [20_ADAPTIVE_PLANNING.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/20_ADAPTIVE_PLANNING.md) | Algoritmo heurístico que prescribe la mejor siguiente actividad formativa. |
| **21** | Pedagogical Gamification (No-Anxiety) | 6. Motivación & Entorno | [21_GAMIFICATION.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/21_GAMIFICATION.md) | XP vinculado al aprendizaje, misiones formativas y rachas empáticas sin castigos. |
| **22** | Motivation Engine & Learner Archetypes | 6. Motivación & Entorno | [22_MOTIVATION.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/22_MOTIVATION.md) | Calibración del tono pedagógico según los 5 arquetipos motivacionales. |
| **23** | Cosmos (Parent & Educator Portal) | 6. Motivación & Entorno | [23_COSMOS.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/23_COSMOS.md) | Panel de progreso para familias con métricas agregadas y protección de privacidad. |
| **24** | Safety & Privacy Audit (COPPA / GDPR-K) | 7. Seguridad & Release | [24_PRIVACY.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/24_PRIVACY.md) | Minimización de datos, supresión atómica con un clic y protección de voz infantil. |
| **25** | Pedagogical QA & Benchmarking Suite | 7. Seguridad & Release | [25_QA.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/25_QA.md) | 20 casos de prueba pedagógicos automatizados para garantizar cero alucinaciones. |
| **26** | Beta Launcher & Multi-Language Suite | 7. Seguridad & Release | [26_BETA.md](file:///c:/Obsidian/proyectos/webs/10_goals/docs/languages/26_BETA.md) | Despliegue en producción con catálogo para 6 idiomas globales y verificación en build. |

---

## 🛠️ INSTRUCCIONES DE USO PARA AGY

1. Selecciona el bloque que deseas implementar o perfeccionar.
2. Abre el archivo de documentación correspondiente (ej. `06_TEACHER_TEXT.md`).
3. Copia el **PROMPT EJECUTABLE PARA AGY** y ejecútalo como una unidad de trabajo aislada.
4. Verifica que se cumplan todos los puntos del **Checklist de Verificación (Definition of Done)** antes de pasar al siguiente bloque.
5. Usa el visualizador web interactivo en `docs/languages/index.html` para auditar el estado global en cualquier momento.
