# BLOQUE 12 — STORY ENGINE (PERSONALIZED NARRATIVES)

> **Fase:** 4 — Generadores de Contenido y Modalidades  
> **Dependencias:** Bloques 01, 04, 06, 09  
> **Responsabilidad:** Generación de relatos ilustrados e interactivos personalizados según nivel CEFR, edad e intereses.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Transformar el aprendizaje en una aventura literaria inmersiva. El estudiante puede solicitar un cuento sobre un tema de su agrado (ej. *“Un astronauta explorando una cueva en Marte”* o *“Un torneo de fútbol mágico”*) o dejar que la IA cree una historia adaptada a su nivel. La historia resalta palabras clave, ofrece narración auditiva completa y se acompaña de preguntas de comprensión.

---

## 2. CONTRATOS DE DATOS

```typescript
export interface StoryChapter {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  vocabularyHighlights: Array<{ term: string; translation: string }>;
  comprehensionQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  decisionPrompt?: {
    question: string;
    choices: Array<{ text: string; nextPlotLead: string }>;
  };
}
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 12 — STORY ENGINE]
Actúa como Diseñador de Narrativas Pedagógicas y Desarrollador Frontend en GOALS.
Tu tarea es implementar el Motor de Cuentos Personalizados en `src/experiences/languages/components/stories/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `StoryReaderView.tsx`:
   - Lector de cuentos con tipografía cuidada, márgenes cómodos y fondo Dark Glassmorphism.
   - Resalta visualmente las palabras de `vocabularyHighlights` con tooltips táctiles interactivos que muestran su traducción.
   - Integra un reproductor de audio TTS para escuchar el cuento narrado con voz nativa fluida.
2. Desarrolla `StoryPromptModal.tsx`:
   - Permite al alumno escribir una idea o elegir presets temáticos (🚀 Aventura Espacial, 🐉 Fantasía Medieval, 🕵️ Misterio, ⚽ Deportes).
   - Genera la historia mediante la API de IA en JSON respetando la interfaz `StoryChapter`.
3. Integra una sección final de "Pregunta de Comprensión" que evalúa la lectura antes de otorgar +40 XP.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Adaptación al Nivel:** Complejidad sintáctica calibrada para el nivel del estudiante (A1 a C2).
- [x] **Vocabulario Interactivo:** Glosario contextual al tocar cualquier término resaltado.
- [x] **Narración en Audio:** Lectura en voz alta sincronizada con botón de pausa y ajuste de velocidad.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El cuento se genera de forma coherente con la temática e intereses del alumno?
- [ ] ¿Al tocar una palabra destacada se abre el tooltip con traducción inmediata?
- [ ] ¿El botón de audio narra el párrafo completo con entonación natural?
- [ ] ¿La pregunta de comprensión final valida y premia con XP el entendimiento lector?
