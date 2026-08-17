# GOALS — Auditoría Global del Sistema
**Versión 2.0 — Fase 0 del Motor Educativo Adaptativo 6–15**

---

## 🔍 1. Resumen Ejecutivo del Estado del Código

| Dimensión | Estado Actual | Diagnóstico | Acción Requerida |
| :--- | :--- | :--- | :--- |
| **Fuentes Maestras (Git)** | `content/knowledge/`, `content/curriculum/`, `content/research/` | Estructuras en Markdown de alta fidelidad científica con hechos verificados. | Mantener como Single Source of Truth (SSOT). |
| **Capa de Tipos (`src/core/types/`)** | Separados en `curriculum.ts`, `knowledge.ts`, `childProfile.ts`, `rag.ts`, `index.ts`. | Buen desacoplamiento conceptual, pero falta unificar los contratos del motor adaptativo (`CurriculumUnit`, `StudentLearningState`, `DiagnosticSession`, `LearningPath`, `PresentationProfile`). | Crear `adaptiveCurriculum.ts` y exportar sin romper interfaces heredadas. |
| **Persistencia (`ProgressContext`)** | Almacena `xp`, `streak`, `lessons: Record<number, LessonProgress>`. | Acoplamiento a IDs numéricos (1–12) en Astro/Cosmos. | Extender `userData` para soportar `studentLearningStates: Record<string, StudentLearningState>` manteniendo compatibilidad con `lessons`. |
| **Capa de Servicios (`src/core/services/`)** | `CurriculumService`, `KnowledgeService`, `RAGSearchEngine`. | Implementa caché de 4 niveles (RAM -> LocalStorage -> Fallback -> Firestore) y grounding estricto. | Añadir `DiagnosticEngine.ts`, `LearningPathEngine.ts` y `PresentationEngine.ts`. |
| **Pipeline de Compilación (`scripts/`)** | `compileCurriculum.ts`, `pipelineKnowledge.ts`. | Compila Markdown con frontmatter YAML hacia Firestore. | Asegurar sincronización idempotente de unidades con tramos 6–15 y tags de conceptos. |
| **Experiencia Astro/Cosmos** | `AstroExperience.tsx`, `CosmicLearningPath.tsx`, `LessonTheoryView.tsx`, `LessonTestView.tsx`. | 12 lecciones estáticas integradas con WebGL Three.js. | Adaptar para consumir la ruta dinámica *"Mi Camino"* del `LearningPathEngine`, manteniendo fallback a las 12 lecciones. |
| **Otras Miniapps (`languages`, `school`, `verify`, `ai-lab`)** | Operan con vistas independientes y perfiles comunes. | Listas para consumir el motor educativo una vez validado en Cosmos. | No tocar en la primera etapa; conectar secuencialmente tras el hito de Cosmos. |

---

## 🔎 2. Análisis de Acoplamientos y Dependencias Hardcoded

1. **Dependencia de IDs 1–12:**
   - En `src/experiences/astro/data/lessonsData.ts` y `lessonsIndex.ts`, las lecciones están indexadas del 1 al 12.
   - En `ProgressContext.tsx`, `lessonProg(id: number)`, `isLessonUnlocked(id: number)` asumen claves numéricas.
   - *Solución:* Crear una capa adaptadora (`LegacyCurriculumAdapter`) para mapear lecciones numéricas al nuevo identificador canónico `astro_u{N}` sin romper usuarios existentes.
2. **Dependencia de Edad vs Nivel:**
   - En `ProfileModal.tsx` y `childProfile.ts`, la edad y curso se capturan como datos estáticos pero no disparaban un árbol de diagnóstico ni calculaban el punto de entrada.
   - *Solución:* Añadir `StudentLearningState` que evalúe el mastery real y ajuste el `recommendedStartUnitId`.

---

## 🛡️ 3. Reglas de No Regresión y Seguridad de Datos

1. **No destrucción de Firestore:** Ninguna colección será eliminada. Se añadirán colecciones/documentos nuevos (`users/{uid}/learningStates/{disciplineId}`) de forma no destructiva.
2. **Offline-First:** Mantener el funcionamiento en LocalStorage si Firestore no tiene conexión o no está autenticado.
3. **Cero regresiones en Three.js:** El visor 3D espacial (`Cosmos3DCanvas`, shaders, texturas y controles orbitales) permanecerá intacto y se invocará modularmente desde las unidades correspondientes.
