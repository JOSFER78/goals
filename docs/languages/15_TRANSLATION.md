# BLOQUE 15 — PEDAGOGICAL TRANSLATION BENCH

> **Fase:** 4 — Generadores de Contenido y Modalidades  
> **Dependencias:** Bloques 01, 03, 05, 06  
> **Responsabilidad:** Módulo de traducción pedagógica contextualizada con análisis de matices, falsos amigos y expresiones idiomáticas.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Evitar la traducción automática literal o descontextualizada. El banco de traducción pedagógica plantea retos de traducción directa e inversa basados en situaciones reales y analiza la respuesta del estudiante distinguiendo entre:
- Precisión gramatical
- Elección léxica adecuada
- Naturalidad idiomática
- Alertas de "falsos amigos" (false friends)

---

## 2. CONTRATOS DE DATOS

```typescript
export interface TranslationChallenge {
  id: string;
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  contextNote: string;
  difficulty: CEFRLevel;
  referenceTranslation: string;
  alternativeTranslations: string[];
  falseFriendsWarning?: string[];
  keyGrammarFocus: string;
}

export interface TranslationEvaluation {
  studentInput: string;
  score: number; // 0 - 100
  isExactOrAlternative: boolean;
  critique: string;
  betterPhrasing: string;
  highlightedGrammar: string;
  vocabularyNotes: Array<{ term: string; explanation: string }>;
}
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 15 — PEDAGOGICAL TRANSLATION]
Actúa como Especialista en Lingüística Comparada y Frontend en GOALS.
Tu tarea es implementar el Banco de Traducción Pedagógica en `src/experiences/languages/components/translation/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `TranslationBenchView.tsx`:
   - Selector de nivel de dificultad (A1 a C2) y dirección de traducción (Español -> Idioma Objetivo o viceversa).
   - Genera retos de traducción con notas contextuales (ej. "¿Cómo dirías esto educadamente en una cafetería?").
   - Campo de entrada con teclado interactivo de caracteres especiales si aplica (acentos, diéresis, hiragana/katakana).
2. Evalúa la respuesta mediante la IA comparándola contra la semántica real y devolviendo `TranslationEvaluation`:
   - Indica si la frase es gramaticalmente correcta pero poco natural ("Grammar OK, but sound more native like this...").
   - Resalta falsos amigos detectados (ej. *actually* vs *actualmente*, *sensible* vs *sensible*).
3. Otorga +20 XP y actualiza el mastery de vocabulario y gramática.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Enfoque Pragmático:** Se evalúa la naturalidad del mensaje, no únicamente la concordancia palabra por palabra.
- [x] **Detección de Falsos Amigos:** Alertas automáticas ante interferencias lingüísticas comunes entre español y la lengua meta.
- [x] **Audio de la Versión Nativa:** Botón para escuchar la locución perfecta de la frase traducida.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El banco de traducción ofrece retos variados tanto cotidianos como profesionales?
- [ ] ¿La evaluación destaca las diferencias de registro (formal vs coloquial)?
- [ ] ¿Se puede escuchar la pronunciación de la solución nativa recomendada?
- [ ] ¿Se premia el uso de estructuras idiomáticas complejas con bonificación de XP?
