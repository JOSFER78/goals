# GOALS — Arquitectura del Motor Educativo Adaptativo 6–15
**Documento Maestro de Arquitectura y Flujo Unificado**

---

## 🏛️ 1. Diagrama de Flujo Unificado del Motor

```
                  ┌─────────────────────────────────────┐
                  │        KNOWLEDGE BASE (SSOT)        │
                  │       (content/knowledge/*.md)      │
                  └──────────────────┬──────────────────┘
                                     │ (Referencias de Hechos)
                                     ▼
                  ┌─────────────────────────────────────┐
                  │          CURRÍCULO MAESTRO          │
                  │      (content/curriculum/*.md)      │
                  └──────────┬──────────────────────┬───┘
                             │                      │
                  (Tramo inicial / Competencias)    │ (Banco de Ítems)
                             ▼                      ▼
┌──────────────────┐   ┌───────────────┐      ┌─────────────────────────┐
│  CHILD PROFILE   │──>│ DIAGNOSTIC    │<────>│ DIAGNOSTIC ENGINE       │
│  (Edad / Curso)  │   │ SESSION       │      │ (Búsqueda Adaptativa)   │
└──────────────────┘   └───────┬───────┘      └─────────────────────────┘
                               │
                       (Mastery Inicial)
                               ▼
                  ┌───────────────────────────────┐
                  │    STUDENT LEARNING STATE     │
                  │   (Posición / Mastery / Gap)  │
                  └────────────┬──────────────────┘
                               │
                               ▼
                  ┌───────────────────────────────┐
                  │     LEARNING PATH ENGINE      │
                  │ (Mi Camino: Actual, Sig, Rep) │
                  └────────────┬──────────────────┘
                               │
                               ▼
                  ┌───────────────────────────────┐
                  │        DYNAMIC ROUTER         │
                  │ (Perfil -> Diag -> Camino)    │
                  └────────────┬──────────────────┘
                               │
                               ▼
                  ┌───────────────────────────────┐
                  │  ADAPTIVE PRESENTATION ENGINE │
                  │ (Profundidad, Densidad, 3D)   │
                  └────────────┬──────────────────┘
                               │
                               ▼
                  ┌───────────────────────────────┐
                  │     ADAPTIVE LESSON VIEW      │
                  │    (Teoría + 3D + Quiz + IA)  │
                  └────────────┬──────────────────┘
                               │
                       (Resultado / Mastery)
                               ▼
                  ┌───────────────────────────────┐
                  │   PROGRESS & MASTERY UPDATE   │
                  │     (Firestore / Offline)     │
                  └───────────────────────────────┘
```

---

## 📦 2. Definición de Entidades de Datos

1. **`CurriculumUnit`**: Unidad canónica que contiene metadatos, tramo de edad recomendado (`AgeTranche`: `6-7` | `8-9` | `10-11` | `12-13` | `14-15`), competencias LOMLOE, prerrequisitos, referencias a `knowledgeSlugs`, pasos interactivos (`CurriculumStep`) y test vinculado (`CurriculumTest`).
2. **`StudentLearningState`**: Expediente individual del alumno para una disciplina (`userId`, `disciplineId`, `age`, `diagnosticStatus`, `recommendedStartUnitId`, `currentUnitId`, `completedUnitIds`, `masteredConcepts`, `weakConcepts`, `sessionHistory`).
3. **`LearningPath`**: Estructura procesada en memoria para la interfaz del alumno:
   - `currentUnit`: Unidad actual a cursar.
   - `upcomingUnits`: 2 a 3 unidades próximas visibles en la ruta.
   - `completedUnits`: Unidades previamente aprobadas.
   - `reinforcementUnit`: Unidad o micro-actividad de refuerzo si se detecta un concepto débil.
   - `optionalChallenge`: Desafío avanzado opcional para alumnos con alto dominio.
4. **`PresentationProfile`**: Perfil visual y cognitivo derivado de `age + mastery + state`:
   - `textDepth`: `'concise'` | `'standard'` | `'in_depth'`
   - `visualDensity`: `'spacious'` | `'balanced'` | `'dense'`
   - `interactionMode`: `'playful_guided'` | `'tactile_interactive'` | `'analytical_formal'`
   - `quizFormat`: `'binary_emoji'` | `'multiple_choice_3'` | `'standard_4'` | `'analytical_calc'`
   - `aiPromptStyle`: Tono y reglas para el tutor de IA.

---

## 🗺️ 3. Investigaciones y Especificaciones de Módulos

- **[[COSMOS_CURRICULUM_RESEARCH_COMPENDIUM_2026]]**: Compendio Maestro de Investigación y Validación de los 10 Subagentes Especializados (Neuroeducación, Misconceptions, Homologación Internacional, 10 Fichas de Laboratorio Casero, Telescopios Robóticos, Astrofísica 2026, Psicometría IRT/ELO, Accesibilidad DUA/WCAG AAA, Portal Docente/Familiar y Arquitectura Offline-First).
- **[[PLAN_CURRICULAR_COSMOS_6_15_ANOS]]**: Plan Curricular Integral de Cosmos (6 a 15 años), teoría actualizada a 2026, catálogo práctico, diagnóstico BBP y carrera espacial (25 niveles).
- **[Visor Web Interactivo](file:///c:/Obsidian/proyectos/webs/10_goals/docs/cosmos_curriculum_master_plan.html)**: Interfaz Dark Glassmorphism para explorar el currículo, simulación física y alternancia con Markdown.
