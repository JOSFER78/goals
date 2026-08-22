# BLOQUE 20 — ADAPTIVE PLANNING (NEXT BEST ACTION ENGINE)

> **Fase:** 5 — Currículo y Adaptabilidad  
> **Dependencias:** Bloques 01, 05, 07, 19  
> **Responsabilidad:** Motor algorítmico y heurístico que prescribe la siguiente actividad pedagógica óptima para cada estudiante.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

El cerebro directivo de la experiencia. En lugar de obligar al alumno a adivinar qué hacer en un menú confuso o perderse en un feed interminable, el motor *Next Best Action (NBA)* evalúa en milisegundos las 4 prioridades pedagógicas:
1. **Errores Recurrentes:** Si hay un error activo cometido más de 2 veces, prescribe un micro-ejercicio específico.
2. **Vocabulario en Riesgo de Olvido:** Si hay términos con baja confianza o no usados en varios días, prescribe su repaso.
3. **Brecha de Dominio:** Si una competencia (ej. *Writing* o *Pronunciation*) está significativamente rezagada respecto a las demás, prescribe una actividad de nivelación.
4. **Intereses y Mantenimiento:** Diálogo estimulante basado en las pasiones personales del estudiante.

---

## 2. LOS 17 ESTADOS DE ACCIÓN PEDAGÓGICA

```typescript
export type NextActionType =
  | 'CONTINUE_CONVERSATION'
  | 'ASK_QUESTION'
  | 'CORRECT'
  | 'EXPLAIN'
  | 'SHOW_VISUAL'
  | 'GENERATE_EXERCISE'
  | 'GENERATE_STORY'
  | 'START_ROLEPLAY'
  | 'START_TRANSLATION'
  | 'READING_PRACTICE'
  | 'WRITING_PRACTICE'
  | 'LISTENING_PRACTICE'
  | 'PRONUNCIATION_PRACTICE'
  | 'REVIEW_VOCABULARY'
  | 'REVIEW_ERROR'
  | 'CHANGE_DIFFICULTY'
  | 'END_SESSION';

export interface NextBestActionRecommendation {
  action: NextActionType;
  title: string;
  reason: string;
  targetSkill: keyof SkillMastery;
  suggestedPrompt?: string;
}
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 20 — ADAPTIVE PLANNING]
Actúa como Ingeniero de Algoritmos Adaptativos y Frontend en GOALS.
Tu tarea es implementar y perfeccionar el motor `NextBestActionEngine.ts` en `src/experiences/languages/services/nextBestAction.ts` y su tarjeta interactiva `NextActionBanner.tsx`.

REGLAS DE IMPLEMENTACIÓN:
1. Implementa el algoritmo determinista en `NextBestActionEngine.calculateNextAction()`:
   - Prioridad 1: Detección de errores recurrentes (`ErrorPattern.status === 'recurring'`).
   - Prioridad 2: Reactivación de vocabulario olvidado (`VocabularyItem.status === 'forgotten' || confidence < 0.5`).
   - Prioridad 3: Refuerzo de la habilidad más baja en `SkillMastery`.
   - Prioridad 4: Continuidad conversacional basada en los intereses de `StudentLanguageProfile`.
2. Desarrolla `NextActionBanner.tsx` en la pantalla principal:
   - Tarjeta destacada con icono de destello cian/esmeralda, título de la acción, razón pedagógica comprensible y botón de acción directa "Comenzar Ahora".
3. Al pulsar el botón, enruta de forma transparente a la vista correspondiente (Roleplay, Ejercicio, Cuento o Conversación) precargando el contexto.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Cálculo Instantáneo y Determinista:** Respuesta en menos de 5 ms sin depender de llamadas de red pesadas para la decisión heurística.
- [x] **Justificación Pedagógica Transparente:** La tarjeta explica claramente *por qué* se recomienda esa actividad concreta.
- [x] **Acción en 1 Clic:** Transición inmediata a la práctica recomendada.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El motor prescribe un ejercicio de refuerzo si se simula un error recurrente?
- [ ] ¿El banner se actualiza de forma reactiva tras completar una sesión?
- [ ] ¿El botón "Comenzar Ahora" navega a la actividad adecuada con los datos cargados?
- [ ] ¿La justificación pedagógica está redactada con tono motivador y constructivo?
