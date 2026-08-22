# BLOQUE 07 — MEMORY SERVICE (LEXICAL, ERRORS & EPISODIC)

> **Fase:** 2 — El Profesor y su Memoria  
> **Dependencias:** Bloques 01, 03, 04, 06  
> **Responsabilidad:** Gestión de la memoria léxica de 6 estados, catálogo de errores recurrentes y memoria episódica de sesiones previas.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Dotar al profesor de una memoria persistente a corto, medio y largo plazo. El profesor recuerda qué temas se trataron ayer, qué verbos le cuestan al alumno, qué palabras ha dominado y cuáles ha dejado de usar (curva del olvido), generando un sentido de continuidad pedagógica humana.

---

## 2. LOS TRES NIVELES DE MEMORIA

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           MEMORY SERVICE                                │
├─────────────────────────┬─────────────────────────┬─────────────────────┤
│   1. MEMORIA LÉXICA     │   2. PATRÓN DE ERRORES  │ 3. MEMORIA EPISÓDICA│
│  - new                  │  - irregular_past       │ - Fecha y duración  │
│  - recognized           │  - prepositions         │ - Temas abordados   │
│  - active               │  - false_friends        │ - Fortalezas clave  │
│  - mastered             │  - syntax               │ - Puntos a reforzar │
│  - forgotten            │  - Frecuencia y estado  │ - Contexto anterior │
└─────────────────────────┴─────────────────────────┴─────────────────────┘
```

---

## 3. CONTRATOS DE DATOS

```typescript
export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  status: 'new' | 'recognized' | 'active' | 'mastered' | 'forgotten';
  confidence: number; // 0.0 - 1.0
  lastUsed: string;
  category?: string;
  exampleSentence?: string;
}

export interface ErrorPattern {
  id: string;
  incorrect: string;
  correction: string;
  category: 'irregular_past' | 'prepositions' | 'false_friends' | 'syntax' | 'phonetics' | 'general';
  frequency: number;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'recurring' | 'resolved';
  lastSeen: string;
  pedagogicalNote?: string;
}

export interface EpisodicMemory {
  id: string;
  timestamp: number;
  dateStr: string;
  summary: string;
  activityType: 'conversation' | 'roleplay' | 'practice' | 'story' | 'writing' | 'translation';
  topicsCovered: string[];
  keyStrengths: string[];
  areasToReinforce: string[];
}
```

---

## 4. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 07 — MEMORY SERVICE]
Actúa como Ingeniero de Memoria Pedagógica y Persistencia en GOALS.
Tu tarea es implementar y expandir `src/experiences/languages/services/memoryService.ts` y sus componentes visuales en `src/experiences/languages/components/memory/`.

REGLAS DE IMPLEMENTACIÓN:
1. Implementa los métodos completos en `MemoryService`:
   - `getVocabulary()`, `addOrUpdateVocabulary()`, `promoteVocabularyStatus()`
   - `getErrorPatterns()`, `recordError()`, `resolveError()`
   - `getEpisodicMemories()`, `addEpisodicMemory()`
   - `getPedagogicalContextSummary()`: genera un extracto condensado para el prompt de IA.
2. Crea los componentes de visualización:
   - `VocabularyDeck.tsx`: Listado de tarjetas de vocabulario filtrables por estado (Activo, Dominado, Repasar).
   - `ErrorPatternsCard.tsx`: Resumen de los 3 errores más frecuentes con su explicación pedagógica y botón "Practicar este error".
   - `RecentSessionsTimeline.tsx`: Línea temporal de sesiones anteriores con fortalezas y áreas a reforzar.
3. Asegura persistencia automática en LocalStorage / Firestore.
```

---

## 5. CRITERIOS DE ACEPTACIÓN

- [x] **Clasificación Léxica Dinámica:** El vocabulario avanza de estado (`recognized` -> `active` -> `mastered`) según su uso.
- [x] **Detección de Recurrencia:** Un error cometido más de 2 veces pasa automáticamente a estado `recurring`.
- [x] **Resumen Pedagógico Inyectable:** `getPedagogicalContextSummary()` produce un texto limpio y conciso de menos de 150 tokens para no sobrecargar la ventana de contexto.

---

## 6. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El catálogo de vocabulario permite filtrar por categoría y estado?
- [ ] ¿Los errores se pueden marcar como resueltos manualmente o tras un ejercicio exitoso?
- [ ] ¿La memoria episódica registra automáticamente un resumen al cerrar una sesión?
- [ ] ¿Los datos se recuperan fielmente tras refrescar el navegador?
