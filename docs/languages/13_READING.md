# BLOQUE 13 — READING DECK & COMPREHENSION

> **Fase:** 4 — Generadores de Contenido y Modalidades  
> **Dependencias:** Bloques 01, 05, 12  
> **Responsabilidad:** Módulo de lectura guiada, interactiva e independiente con tres niveles de asistencia pedagógica.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Estructurar la competencia de lectura en tres modalidades progresivas:
1. **Guided Reading (Lectura Guiada):** Textos breves con apoyo constante del profesor, lectura frase a frase y preguntas socráticas.
2. **Interactive Reading (Lectura Interactiva):** Historias con toma de decisiones ramificadas tipo "Elige tu propia aventura".
3. **Independent Reading (Lectura Autónoma):** Textos graduados con preguntas de inferencia, vocabulario en contexto y prueba de velocidad lectora (palabras por minuto).

---

## 2. COMPONENTES VISUALES & ARQUITECTURA

Ubicación: `src/experiences/languages/components/reading/`

```text
reading/
├── ReadingLabView.tsx           # Selector de modalidad y biblioteca de lecturas
├── GuidedReadingDeck.tsx        # Modo guiado frase a frase con asistencia de audio
├── InteractiveStoryBranch.tsx   # Modo interactivo con decisiones que alteran la trama
└── ReadingComprehensionQuiz.tsx # Cuestionario de ideas principales e inferencias
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 13 — READING DECK]
Actúa como Especialista en Comprensión Lectora y Frontend en GOALS.
Tu tarea es implementar el Laboratorio de Lectura en `src/experiences/languages/components/reading/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `ReadingLabView.tsx` permitiendo alternar entre:
   - Lectura Guiada (acompañamiento paso a paso con audio).
   - Lectura Interactiva (opciones de decisión que bifurcan la historia).
   - Lectura Autónoma (artículos científicos y culturales breves graduados por nivel CEFR).
2. Agrega funciones interactivas:
   - Selección de velocidad de lectura (0.8x a 1.2x).
   - Contador de palabras y tiempo estimado de lectura.
   - Resaltador visual de la frase que se está reproduciendo por audio.
3. Evalúa la comprensión con un quiz de 3 preguntas de inferencia y vocabulario contextual.
4. Incrementa el dominio de `reading` en `MemoryService.updateSkillMastery('reading', +3)`.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Tres Modalidades Claras:** Experiencia adaptada tanto a principiantes que necesitan guía como a lectores autónomos.
- [x] **Seguimiento Visual de Audio:** Resaltado de texto sincronizado con la reproducción de voz.
- [x] **Métricas de Rendimiento:** Registro de tiempo de lectura y porcentaje de comprensión.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El texto es perfectamente legible con espaciado entre líneas amplio y tipografía adecuada?
- [ ] ¿Las bifurcaciones en el modo interactivo generan una continuación coherente?
- [ ] ¿El quiz de lectura evalúa comprensión profunda y no solo memorización superficial?
- [ ] ¿Se otorga XP al completar la lectura y responder el cuestionario?
