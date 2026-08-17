# GOALS — ARQUITECTURA ADAPTATIVA MULTIDIMENSIONAL

## 1. Visión y Principios Rectores
La plataforma educativa **GOALS** implementa un modelo de aprendizaje adaptativo centrado en el alumno, donde **la edad, la etapa evolutiva LOMLOE y el diagnóstico conceptual determinan de forma estricta y dinámica qué contenidos, lenguaje, densidad visual y formatos de evaluación recibe cada estudiante**.

### Principios Fundamentales
1. **Separación Estricta de Cuatro Capas**:
   - **Base de Conocimiento Factual (SSOT)**: Repositorio agnóstico de rigor científico (Markdown / NASA / ESA / LOMLOE).
   - **Currículo Pedagógico Modular**: Unidades didácticas (`CurriculumUnit`) graduadas por 5 tramos de edad (`6-7`, `8-9`, `10-11`, `12-13`, `14-15`).
   - **Estado y Rendimiento del Alumno (`LearnerProfile` & `StudentLearningState`)**: Expediente global y desglosado por cada MiniApp.
   - **Capa de Presentación e IA (`PresentationProfile` & `PresentationEngine`)**: Modulación en tiempo de ejecución de la profundidad textual, densidad visual, personalidad de la mascota y directivas de IA.
2. **Cero Mocks y Datos 100% Reales**:
   - Todos los cálculos, rutas y evaluaciones se ejecutan sobre datos reales sincronizados en Firebase Firestore y validados con suites de tests automáticas.

---

## 2. Los 5 Tramos de Edad y Etapas LOMLOE

| Tramo | Edad | Etapa LOMLOE | Arquetipo Cognitivo | Profundidad Textual | Formato Quiz | IA Persona |
|---|---|---|---|---|---|---|
| **6-7** | 6 y 7 años | 1º y 2º Primaria | Inicial / Sensorial | Concisa (`<15` palabras/frase) | Emoji / Binario 3 opciones | `cosmic_pet` (Mascota juguetona) |
| **8-9** | 8 y 9 años | 3º y 4º Primaria | Explorador Concreto | Concisa con retos | Selección 3 opciones | `friendly_tutor` (Guía explorador) |
| **10-11** | 10 y 11 años | 5º y 6º Primaria | Avanzado Causal | Estándar con datos | Estándar 4 opciones | `socratic_mentor` (Mentor socrático) |
| **12-13** | 12 y 13 años | 1º y 2º ESO | Científico Junior | Profunda con física | Estándar 4 + Deducción | `socratic_mentor` (Profesor riguroso) |
| **14-15** | 14 y 15 años | 3º y 4º ESO | Astrofísico Pre-Uni | Analítica $\LaTeX$ | Cuantitativo y Formal | `science_colleague` (Colega investigador) |

---

## 3. Modelo de Datos y Persistencia

### A. Perfil Educativo Global (`LearnerProfile`)
Ruta Firestore: `/users/{userId}` (campo `learnerProfile`)
```typescript
interface LearnerProfile {
  userId: string;
  identity: { name: string; avatar: string };
  education: {
    age: number;
    grade: string;
    educationalStage: EducationalStage;
    ageTranche: AgeTranche;
  };
  preferences: { interests: string[]; favoriteSubjects: string[] };
  onboarding: { globalCompleted: boolean; completedAt?: number };
}
```

### B. Estado por MiniApp (`StudentLearningState`)
Ruta Firestore: `/users/{userId}/learningStates/{experienceId}`
```typescript
interface StudentLearningState {
  userId: string;
  disciplineId: 'astro' | 'school' | 'languages' | 'verify' | 'ai-lab';
  diagnosticStatus: 'not_started' | 'pending' | 'completed' | 'skipped';
  ageTranche: AgeTranche;
  currentUnitId: string;
  completedUnitIds: string[];
  conceptMastery: Record<string, { scorePercent: number; status: 'mastered' | 'needs_reinforcement' }>;
  weakConcepts: string[];
  strengths: string[];
}
```

---

## 4. Flujo de Entrada de Usuario
1. **Primera Entrada Global a GOALS**:
   - `InitialOnboardingGate.tsx` solicita Nombre, Edad (6-15), Curso LOMLOE e Intereses.
   - Guarda `LearnerProfile` y desbloquea el ecosistema global.
2. **Primera Entrada a una MiniApp (Piloto Cosmos)**:
   - Se consulta `StudentLearningState`. Si `diagnosticStatus === 'not_started'`, se ofrece un micro-diagnóstico conceptual (3-4 preguntas).
   - Al completarse, se recomienda la unidad inicial dentro de su tramo.
3. **Entradas Posteriores**:
   - Acceso instantáneo a **"Mi Camino"** (`CosmicLearningPath.tsx`), visualizando su progreso, unidad activa y estrellas obtenidas.
