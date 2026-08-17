# BLOQUE 06 — TEACHER TEXT (PEDAGOGICAL BRAIN)

> **Fase:** 2 — El Profesor y su Memoria  
> **Dependencias:** Bloques 01, 03, 04, 05  
> **Responsabilidad:** Agente inteligente conversacional con IA real, respuesta estructurada en JSON, corrección empática y preguntas socráticas.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Implementar el cerebro conversacional del Teacher Agent. El profesor no es un chatbot pasivo: analiza el input del alumno, inyecta su expediente pedagógico (nivel, errores frecuentes, intereses, estilo de corrección), detecta desviaciones sintácticas o léxicas, responde con calidez en el idioma objetivo y formula preguntas socráticas para mantener activo el turno de conversación.

---

## 2. CONTRATOS DE DATOS & INTERACCIÓN

Ubicación: `src/experiences/languages/services/teacherAgent.ts`

```typescript
export interface TeacherInteractionResult {
  teacherReply: string;
  pedagogicalTip?: string;
  detectedError?: {
    incorrect: string;
    correction: string;
    category: string;
    explanation: string;
  };
  newVocabulary?: Array<{ term: string; translation: string }>;
  suggestedFollowUp?: string;
  detectedSkillImprovement?: string;
  xpGranted: number;
}
```

---

## 3. PROMPT DEL SISTEMA PARA EL TEACHER AGENT

```text
Eres el "Teacher Agent" de GOALS Languages, un profesor particular de ${targetLanguage} empático, altamente pedagógico y conversacional.

EXPEDIENTE DEL ESTUDIANTE:
${pedagogicalContextSummary}

DIRECTIVAS PEDAGÓGICAS VITALES:
1. TONO Y NIVEL: Adáptate estrictamente al nivel ${overallLevel} y a la edad de ${age} años. Habla en ${targetLanguage} usando vocabulario comprensible pero enriquecedor.
2. CONVERSACIÓN FLUIDA: Responde con naturalidad, calidez y brevedad (máximo 2 a 3 frases conversacionales).
3. CORRECCIÓN ADAPTATIVA:
   - Si el estudiante comete un error gramatical o léxico relevante (ej. verbos irregulares o preposiciones), corrígelo con amabilidad e intégralo constructivamente en tu frase.
4. PREGUNTA DE CIERRE: Termina siempre tu respuesta con una pregunta socrática corta para mantener activo el turno de diálogo.
5. CONEXIÓN DE INTERESES: Cuando sea oportuno, vincula ejemplos a sus intereses (${interests.join(', ')}).

FORMATO OBLIGATORIO: JSON estrictamente válido según la interfaz TeacherInteractionResult.
```

---

## 4. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 06 — TEACHER TEXT]
Actúa como Especialista en Inteligencia Artificial Educativa y Backend en GOALS.
Tu tarea es implementar y perfeccionar el servicio `TeacherAgent.ts` en `src/experiences/languages/services/teacherAgent.ts`.

REGLAS DE IMPLEMENTACIÓN:
1. Utiliza `askAI()` conectado a la API real de IA configurada en GOALS.
2. Construye el prompt inyectando de forma dinámica `MemoryService.getPedagogicalContextSummary()`.
3. Maneja respuestas en JSON estructurado de forma robusta con fallback automático a texto plano en caso de fallo de formato.
4. Si la IA detecta un error o vocabulario nuevo:
   - Registra el error automáticamente en `MemoryService.recordError()`.
   - Añade el vocabulario a `MemoryService.addOrUpdateVocabulary()`.
   - Otorga XP educativo mediante `ProgressContext.addXP()`.
5. Asegura un tiempo de respuesta de IA inferior a 2.5 segundos con manejo de errores de red resiliente.
```

---

## 5. CRITERIOS DE ACEPTACIÓN

- [x] **IA 100% Real:** Conexión funcional sin respuestas simuladas o mocks estáticos.
- [x] **Tolerancia a Fallos:** Parseo JSON con recuperación automática ante strings con markdown.
- [x] **Actualización Automática de Memoria:** Los errores detectados por el modelo se reflejan inmediatamente en la memoria persistente.

---

## 6. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El Teacher Agent responde respetando la edad y nivel CEFR del alumno?
- [ ] ¿Los errores gramaticales devueltos contienen explicación constructiva en español?
- [ ] ¿Se otorga XP al completar un turno conversacional exitoso?
- [ ] ¿El fallback de error muestra un mensaje pedagógico de aliento si falla la red?
