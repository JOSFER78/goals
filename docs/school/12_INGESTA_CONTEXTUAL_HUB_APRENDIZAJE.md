# 📸 INGESTA CONTEXTUAL DE AULA Y HUB DE APRENDIZAJE PERSONALIZADO
## De la "Resolución de Deberes" al Ecosistema Dinámico de Aprendizaje: Detección Automática de Tema, Generación de Tests Interactivos, Explicaciones Visuales y Técnicas de Estudio

**Principio Rector:** *"Las fotos del cuaderno, libro de texto o fichas no existen para que una IA 'resuelva ejercicios' de forma pasiva, sino como sensor de contexto de aula: permiten que el tutor inteligente sepa con exactitud milimétrica qué está aprendiendo el alumno hoy en su colegio y despliegue un Hub Interactivo de Aprendizaje a medida."*

---

### ÍNDICE GENERAL
1. **El Cambio de Paradigma: Del 'Homework Solver' al 'Context-Aware Learning Hub'**.
2. **Pipeline de Extracción y Mapeo Curricular del Material de Aula**.
3. **Los 4 Modos Generativos del Hub de Aprendizaje Personalizado**:
   - 3.1. *Test Interactivo Adaptativo (Active Retrieval Quiz)*.
   - 3.2. *Explicador Conceptual Visual y Analógico (Método CPA + Analogías)*.
   - 3.3. *Entrenador de Técnicas de Estudio y Feynman (Workout Mnemotécnico)*.
   - 3.4. *Arena de Desafíos y Misiones Gamificadas Progresivas (Quests)*.
4. **Detección de Metodología y Notación del Docente del Colegio**.
5. **Arquitectura Técnica Web, Contratos TypeScript y Flujo de Interacción UI/UX**.

---

## 1. EL CAMBIO DE PARADIGMA: DEL 'HOMEWORK SOLVER' AL 'LEARNING HUB'

En el mercado proliferan aplicaciones que actúan como meros "solucionadores mecánicos" (Photomath, bots de respuestas). Este modelo es pedagógicamente nocivo porque fomenta la pasividad, la trampa y la atrofia del pensamiento crítico.

GOALS School propone una **revolución copernicana**:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        COMPARATIVA DE PARADIGMAS: SOLUCIONADOR VS HUB DE APRENDIZAJE                  │
├────────────────────────────────────────┬───────────────────────────────────────────────────────────────┤
│ ❌ APP TRADICIONAL ("Homework Solver") │ 🌟 GOALS SCHOOL ("Context-Aware Learning Hub")               │
├────────────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ • El alumno sube foto de una ecuación. │ • El alumno sube foto de una página de su libro o cuaderno.   │
│ • La app escupe el número final $x = 4$.│ • El sistema identifica el tema: *"Ecuaciones con paréntesis,│
│ • El alumno copia la respuesta sin     │   Tema 5 de 2.º ESO, método de transposición de términos"*.    │
│   entender el procedimiento.           │ • **NO da la solución directamente.** Despliega un HUB con:  │
│ • Cero aprendizaje, cero retención.    │   1. Test interactivo rápido para diagnosticar su comprensión.│
│                                        │   2. Explicador visual interactivo con balanza manipulativa.  │
│                                        │   3. Tarjetas de repaso activo y reto Feynman de 60 segundos. │
│                                        │   4. Retos progresivos para dominar el tema antes del examen. │
└────────────────────────────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## 2. PIPELINE DE EXTRACCIÓN Y MAPEO CURRICULAR

Cuando el estudiante toma una fotografía de su cuaderno, libro de texto o ficha:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            PIPELINE DE EXTRACCIÓN Y GROUNDING CURRICULAR                               │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. CAPTURA MULTIMODAL                                                                                  │
│    Foto de página de libro (Santillana, Anaya, Oxford, Pearson), cuaderno manuscrito o ficha escolar. │
│                                  │                                                                     │
│                                  ▼                                                                     │
│ 2. ANÁLISIS DE ESTRUCTURA DOCUMENTAL (DocLayNet + LayoutLMv3)                                          │
│    Aísla: Título de la Unidad, Cuadros de Teoría, Ejemplos Resueltos y Ejercicios Propuestos.         │
│                                  │                                                                     │
│                                  ▼                                                                     │
│ 3. GROUNDING EN EL KNOWLEDGE GRAPH CURRICULAR (LOMLOE & UK NC)                                         │
│    Mapea el contenido al nodo exacto del currículo oficial:                                            │
│    `node_id: "MAT_ESO2_ALG_EQ_PARENTS" | subject: "Matemáticas" | grade: "2.º ESO" | term: "2.º Trim"` │
│                                  │                                                                     │
│                                  ▼                                                                     │
│ 4. GENERACIÓN INSTANTÁNEA DEL HUB INTERACTIVO DE 4 MODOS                                               │
│    Despliegue de la interfaz personalizada en < 800 ms adaptada a la edad e intereses del alumno.      │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. LOS 4 MODOS GENERATIVOS DEL HUB DE APRENDIZAJE PERSONALIZADO

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              LOS 4 MODOS GENERATIVOS DEL HUB DE APRENDIZAJE                            │
├──────────────────────────────┬───────────────────────────────┬─────────────────────────────────────────┤
│ 🎯 MODO 1: TEST ACTIVO       │ 💡 MODO 2: EXPLICADOR VISUAL  │ 🧠 MODO 3: WORKOUT FEYNMAN & MEMORIA    │
│ Diagnostic & Active Recall   │ Comprensión profunda con CPA  │ Repaso espaciado, flashcards y voz      │
├──────────────────────────────┴───────────────────────────────┴─────────────────────────────────────────┤
│ 🚀 MODO 4: ARENA DE DESAFÍOS Y MISIONES GAMIFICADAS (Nivel 1 a 5 con casos de la vida real)            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1. Modo 1: Test Interactivo Adaptativo (Active Retrieval Quiz)
- **Objetivo:** Determinar en 3 minutos el nivel de comprensión real del alumno sobre lo que acaba de ver en clase.
- **Mecánica:**
  - 3 a 5 micro-preguntas interactivas generadas dinámicamente con distractores basados en las *misconceptions* típicas del tema.
  - Tipologías variadas: selección única, emparejamiento conceptual, ordenar pasos lógicos de resolución y deslizadores de magnitudes.
  - **Feedback Inmediato Socrático:** Si falla, no muestra "Mal", sino que destaca la pista visual y formula una pregunta puente.

### 3.2. Modo 2: Explicador Conceptual Visual y Analógico (Método CPA)
- **Objetivo:** Proporcionar la intuición física y geométrica detrás de las fórmulas abstractas que el profesor explicó en la pizarra.
- **Mecánica:**
  - **Fase Concreta/Manipulativa Virtual:** Simuladores interactivos (balanzas, regletas, líneas numéricas, circuitos, prismas de luz).
  - **Analogías Calibradas por Interés:** Si al alumno le gusta el fútbol, la física de la fuerza centrípeta se explica mediante el efecto del tiro con rosca; si le gusta Minecraft, los volúmenes se explican con bloques cúbicos.
  - **Desglose Desvanecido (Faded Worked Examples):** Demostración de un ejercicio modelo donde el tutor resuelve el 70% y el alumno completa el 30% final.

### 3.3. Modo 3: Entrenador de Técnicas de Estudio y Feynman (Workout Mnemotécnico)
- **Objetivo:** Consolidar el tema en la memoria a largo plazo mediante técnicas con evidencia científica.
- **Mecánica:**
  - **Reto Feynman de Voz (Audio-Prompt):** *"Tienes 45 segundos para explicarle a tu mascota qué es la fotosíntesis sin usar la palabra 'cloroplasto'"*. El motor STT transcribe y analiza si la explicación es causal y clara.
  - **Flashcards Inteligentes FSRS:** Tarjetas de evocación activa programadas para repasar a los 2, 5 y 12 días según la dificultad percibida.
  - **Acrónimos y Mnemotecnias:** Generador de reglas mnemotécnicas divertidas para recordar listas o secuencias (ej. clasificación biológica, tabla periódica, reyes godos).

### 3.4. Modo 4: Arena de Desafíos y Misiones Gamificadas Progresivas (Quests)
- **Objetivo:** Transferencia del aprendizaje a situaciones novedosas y estimulantes.
- **Mecánica:**
  - **Nivel 1 (Aprendiz):** Aplicación directa guiada.
  - **Nivel 2 (Detective):** Encontrar el error oculto en un procedimiento ya resuelto.
  - **Nivel 3 (Ingeniero / Científico):** Resolver un problema real del mundo (diseñar el soporte de un puente, calcular la comida de una expedición).
  - **Nivel 4 (Master / Contrafáctico):** *"¿Qué pasaría si la gravedad en la Tierra fuera el doble?"*.

---

## 4. DETECCIÓN DE METODOLOGÍA Y NOTACIÓN DEL DOCENTE

Cada colegio y cada profesor tiene manías y convenciones formales específicas (ej. usar coma decimal vs punto, exigir recuadrar la solución en rojo, usar el método de cajas en multiplicación o exigir escribir *"Datos - Planteamiento - Operaciones - Solución"*).

El motor de visión de GOALS analiza las notas manuscritas del cuaderno y detecta:
1. **Plantilla de Resolución Requerida por el Maestro:** Si el cuaderno muestra que el profesor exige la estructura `Datos | Operación | Solución`, el tutor adapta su interfaz para guiar al alumno exactamente bajo esa misma estructura.
2. **Notación y Nomenclatura:** Detección de si el profesor usa $x$ o $\cdot$ para multiplicar, si usa corchetes o paréntesis dobles, y si los enunciados se redactan en castellano o en inglés en colegios bilingües.

---

## 5. ESPECIFICACIÓN TÉCNICA Y CONTRATOS TYPESCRIPT

```typescript
// Contrato del Hub de Aprendizaje Contextualizado
export interface ClassroomIngestionResult {
  scanId: string;
  timestamp: string;
  sourceType: 'textbook_page' | 'notebook_handwriting' | 'worksheet' | 'exam_correction';
  
  // Grounding Curricular Extraído
  detectedCurriculum: {
    curriculumSystem: 'LOMLOE' | 'UK_NC' | 'COMMON_CORE';
    grade: string; // ej. "5.º Primaria" / "Year 6"
    subject: 'Mathematics' | 'Science' | 'SpanishLanguage' | 'English' | 'SocialSciences';
    unitTitle: string; // ej. "Unidad 4: Las Fracciones y sus Operaciones"
    coreConcepts: string[]; // ["Fracción propia", "Fracción impropia", "Fracciones equivalentes"]
    teacherMethodologyNotes?: string[]; // ["Exige simplificar a fracción irreducible", "Usa modelo de barras"]
  };

  // Los 4 Módulos del Learning Hub Generados Dinámicamente
  learningHub: {
    // Modo 1: Test Interactivo
    activeQuiz: {
      quizId: string;
      estimatedMinutes: number;
      questions: Array<{
        id: string;
        type: 'single_choice' | 'step_reorder' | 'visual_drag' | 'slider';
        prompt: string;
        options?: string[];
        correctAnswer: any;
        socraticHint: string;
        misconceptionAlert?: string;
      }>;
    };

    // Modo 2: Explicador Visual & Manipulativo
    visualExplainer: {
      headlineSummary: string;
      analogyContext: string; // Adaptado a fútbol, videojuegos o astronomía
      cpaPhases: {
        concreteInteractiveWidget: 'fraction_bars' | 'balance_scale' | 'vector_line' | 'cell_viewer';
        pictorialModelDescription: string;
        abstractFormulaLatex: string;
      };
      fadedWorkedExample: {
        stepsGiven: string[];
        finalStepPrompt: string;
      };
    };

    // Modo 3: Workout de Memoria & Feynman
    memoryWorkout: {
      feynmanPrompt: string; // Reto de explicación sencilla
      keyTermsToAvoidInFeynman: string[];
      fsrsFlashcards: Array<{
        frontPrompt: string;
        backExplanation: string;
        visualIcon: string;
      }>;
      mnemonicHook?: string;
    };

    // Modo 4: Arena de Retos Progresivos
    progressiveArena: Array<{
      level: 1 | 2 | 3 | 4 | 5;
      title: string;
      scenario: string;
      questChallenge: string;
      rewardXP: number;
    }>;
  };
}
```
