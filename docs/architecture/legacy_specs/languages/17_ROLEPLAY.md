# BLOQUE 17 — ROLEPLAY ENGINE & REAL-LIFE SIMULATIONS

> **Fase:** 4 — Generadores de Contenido y Modalidades  
> **Dependencias:** Bloques 01, 02, 06, 08, 09  
> **Responsabilidad:** Motor generativo de escenarios inmersivos (vida real, profesionales, académicos y fantásticos) con rúbricas de evaluación final.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Uno de los pilares más potentes del producto. En lugar de seguir diálogos enlatados o guiones rígidos, el motor genera escenarios dinámicos donde el profesor adopta un rol creíble (empleado de aduanas, entrevistador exigente, recepcionista de hotel, colega de trabajo en Silicon Valley) y reacciona de forma viva a las intervenciones del alumno. Al concluir la simulación, se genera una rúbrica cuantitativa de 5 dimensiones.

---

## 2. CONTRATOS DE DATOS & ESCENARIOS

```typescript
export interface RoleplayScenarioDef {
  id: string;
  title: string;
  icon: string;
  category: 'travel' | 'work' | 'academic' | 'social' | 'fantasy';
  studentRole: string;
  teacherRole: string;
  goal: string;
  targetVocabulary: string[];
  targetGrammar: string;
  difficulty: CEFRLevel;
  initialTeacherMessage: string;
  rubrics: string[];
}

export interface RoleplayEvaluation {
  scenarioId: string;
  completed: boolean;
  score: number; // 0 - 100
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  clarityScore: number;
  pronunciationScore: number;
  feedback: string;
  strengths: string[];
  areasToImprove: string[];
}
```

### Catálogo de Escenarios Iniciales:
1. ✈️ **Aeropuerto:** Localizar la puerta de embarque y resolver un retraso de equipaje.
2. ☕ **Cafetería:** Pedir café y comida con especificaciones dietéticas complejas.
3. 🏨 **Hotel:** Check-in, pedir toallas extra y solicitar un cambio de habitación.
4. 💼 **Entrevista Laboral:** Presentar experiencia previa, fortalezas y responder a preguntas técnicas.
5. 👥 **Reunión de Negocios:** Defender una propuesta y rebatir educadamente una objeción del jefe de proyecto.
6. 🚀 **Misión a Marte:** Comunicarse por radio con el centro de control en una tormenta de arena.

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 17 — ROLEPLAY ENGINE]
Actúa como Diseñador de Simulaciones Inmersivas y Frontend en GOALS.
Tu tarea es implementar el Motor de Roleplay en `src/experiences/languages/components/roleplay/` y su servicio `roleplayService.ts`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `RoleplayCatalogView.tsx` con tarjetas visuales de los escenarios clasificados por categoría (Viajes, Trabajo, Social, Académico, Fantasía).
2. Desarrolla `RoleplaySessionView.tsx`:
   - Muestra el rol asignado al alumno y el rol del profesor con un badge de objetivo (ej. "Meta: Conseguir tu tarjeta de embarque y preguntar por la puerta de salida").
   - Indicador en vivo de palabras clave objetivo utilizadas (`targetVocabulary`).
   - Botón de audio / voz para conversar por voz o por texto.
3. Al finalizar la simulación ("Finalizar Misión"), invoca la evaluación de IA y muestra `RoleplayScoreModal.tsx`:
   - Puntuación desglosada en 5 dimensiones (Fluidez, Gramática, Vocabulario, Claridad, Pronunciación).
   - 2 puntos fuertes destacados y 2 recomendaciones concretas de mejora.
   - Otorga +60 XP y guarda la sesión en `MemoryService.addEpisodicMemory()`.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Diálogo No Guionizado:** El profesor improvisa y reacciona con naturalidad según lo que responda el alumno.
- [x] **Seguimiento de Objetivos en Tiempo Real:** Detección automática del uso del vocabulario meta.
- [x] **Rúbrica de Evaluación Completa:** Evaluación formativa con métricas y feedback constructivo.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El profesor mantiene su personaje a lo largo de toda la conversación?
- [ ] ¿Los objetivos del escenario se marcan como cumplidos al avanzar el diálogo?
- [ ] ¿La rúbrica final otorga notas numéricas y consejos pedagógicos reales?
- [ ] ¿La simulación queda registrada en el historial episódico del alumno?
