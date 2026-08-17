# BLOQUE 11 — PRACTICE GENERATOR (6 EXERCISE TYPES)

> **Fase:** 4 — Generadores de Contenido y Modalidades  
> **Dependencias:** Bloques 01, 03, 05, 06, 07  
> **Responsabilidad:** Generador bajo demanda de ejercicios interactivos adaptados a los errores y nivel del estudiante mediante IA real.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Permitir al estudiante o al profesor generar prácticas instantáneas orientadas a consolidar habilidades concretas. El generador soporta 6 modalidades pedagógicas:
1. **Fill in the blank** (`fill_blank`): Rellenar huecos con la forma verbal o preposición correcta.
2. **Order words** (`order_words`): Reordenar fichas sintácticas para estructurar oraciones válidas.
3. **Multiple choice** (`multiple_choice`): Elegir la opción correcta entre distractores inteligentes.
4. **Error correction** (`error_correction`): Detectar la incorrección y escribir la versión adecuada.
5. **Creative sentence creation** (`create_sentences`): Formular frases propias usando una palabra clave.
6. **Pedagogical translation** (`translate`): Traducir expresiones idiomáticas con contexto.

---

## 2. CONTRATOS DE DATOS

```typescript
export type ExerciseType = 'fill_blank' | 'order_words' | 'multiple_choice' | 'error_correction' | 'translate' | 'create_sentences';

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  question: string;
  instruction: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  targetSkill: string;
  difficulty: CEFRLevel;
}
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 11 — PRACTICE GENERATOR]
Actúa como Especialista en Pedagogía Interactiva y Desarrollador Frontend en GOALS.
Tu tarea es implementar el Generador de Prácticas Adaptativas en `src/experiences/languages/components/practice/` y su servicio `practiceGenerator.ts`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `practiceGenerator.ts` con el método:
   - `generateExerciseBatch(type, targetLanguage, topicOrError)`: invoca la API real de IA para generar 3 ejercicios estructurados en JSON.
2. Construye `PracticeDeckView.tsx` y los componentes de interacción:
   - `FillBlankCard.tsx`: campo de texto inline con validación instantánea.
   - `OrderWordsCard.tsx`: fichas interactivas arrastrables o tocables que construyen la oración.
   - `MultipleChoiceCard.tsx`: tarjetas de opciones con animación verde (acierto) o ámbar (error).
   - `ErrorCorrectionCard.tsx`: texto con la palabra errónea editable.
3. Al acertar, reproduce un sonido sutil de confirmación, suma +25 XP en `ProgressContext` y actualiza la confianza del vocabulario en `MemoryService`.
4. Muestra una tarjeta explicativa tras responder, razonando el porqué gramatical de la respuesta correcta.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Variedad de Formatos:** Interfaz especializada para cada uno de los 6 tipos de ejercicios.
- [x] **Generación Dinámica con IA:** Creación de ejercicios contextualizados en segundos sobre cualquier tema solicitado.
- [x] **Explicación Pedagógica Inmediata:** Desglose del error para aprender de cada fallo.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿Los ejercicios de ordenar palabras permiten tocar o pulsar para armar la frase?
- [ ] ¿La corrección de mayúsculas/minúsculas y espacios finales es flexible y justa?
- [ ] ¿Se muestra la explicación gramatical al comprobar la respuesta?
- [ ] ¿Los ejercicios completados suman XP y actualizan el Mastery de la habilidad?
