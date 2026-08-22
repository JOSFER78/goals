# BLOQUE 14 — WRITING LAB (4-LAYER CORRECTION)

> **Fase:** 4 — Generadores de Contenido y Modalidades  
> **Dependencias:** Bloques 01, 03, 05, 06, 07  
> **Responsabilidad:** Taller de redacción guiada (emails, ensayos, historias, mensajes) con corrección pedagógica estructurada en 4 capas.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Proporcionar un espacio de redacción interactivo donde el alumno pueda escribir composiciones cortas (un email de trabajo o informal, una descripción de un fin de semana, una opinión sobre ciencia). La IA no se limita a marcar errores en rojo: desglosa la corrección en **4 capas pedagógicas**:
1. **Capa 1 — Corrección:** Qué está mal exactamente.
2. **Capa 2 — Explicación:** Por qué está mal y cuál es la regla gramatical o pragmática.
3. **Capa 3 — Alternativa Natural:** Cómo lo expresaría un hablante nativo con estilo idiomático.
4. **Capa 4 — Mini Práctica:** Un ejercicio inmediato para afianzar el punto débil detectado.

---

## 2. CONTRATOS DE DATOS

```typescript
export interface WritingAnalysisResult {
  studentText: string;
  corrections: Array<{
    wrong: string;
    right: string;
    reason: string;
  }>;
  explanation: string;
  naturalVersion: string;
  suggestedPractice: string;
  grammarPoints: string[];
  overallScore: number; // 0 - 100
}
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 14 — WRITING LAB]
Actúa como Profesor de Redacción y Expresión Escrita en GOALS.
Tu tarea es implementar el Laboratorio de Escritura en `src/experiences/languages/components/writing/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `WritingLabView.tsx` que permita:
   - Elegir el tipo de redacción: Email Formal / Informal, Diario Personal, Opinión Científica, Mensaje Breve.
   - Editor de texto enriquecido con contador de palabras y sugerencias de conectores lógicos según el nivel CEFR.
2. Al enviar el texto a evaluación, invoca la API de IA para devolver un objeto JSON estricto con la estructura `WritingAnalysisResult`.
3. Presenta los resultados en 4 tarjetas visuales ordenadas:
   - 🔴 Errores y Correcciones exactas.
   - 💡 Explicación pedagógica clara en español.
   - 🌟 Versión nativa natural y elegante.
   - 🎯 Ejercicio práctico inmediato para resolver.
4. Permite guardar la composición en el historial y suma XP de Writing en `MemoryService.updateSkillMastery('writing', +4)`.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **4 Capas Estructuradas:** El desglose no es un bloque de texto amorfo, sino tarjetas pedagógicas accionables.
- [x] **Calibración de Nivel:** Las exigencias de estilo y léxico se ajustan al nivel actual del alumno.
- [x] **Generación de Práctica Derivada:** Propuesta de un reto directo basado en el fallo cometido.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El editor de texto es cómodo tanto en teclado de ordenador como en dispositivos móviles?
- [ ] ¿El análisis resalta las diferencias entre la versión del alumno y la versión nativa?
- [ ] ¿Los errores se registran automáticamente en el `MemoryService`?
- [ ] ¿Se ofrece la opción de reescribir el texto aplicando las sugerencias?
