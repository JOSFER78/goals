# BLOQUE 16 — LISTENING DECK & AUDIO COMPREHENSION

> **Fase:** 4 — Generadores de Contenido y Modalidades  
> **Dependencias:** Bloques 01, 02, 09, 11  
> **Responsabilidad:** Módulo de entrenamiento auditivo con generación dinámica de audio, dictados interactivos y tests de comprensión.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Desarrollar la competencia de comprensión auditiva (*Listening*). El sistema genera audios sintéticos con entonaciones realistas y variadas (velocidad graduable: 0.7x, 0.9x, 1.0x, 1.2x) y propone 4 tipos de retos de escucha:
1. **Escucha y Responde:** Preguntas de comprensión tras oír una conversación o noticia breve.
2. **Dictado Activo:** Escribir exactamente la frase o palabras escuchadas.
3. **Identificación de Palabras Clave:** Seleccionar qué términos aparecieron en el audio.
4. **Completar el Diálogo:** Rellenar las palabras omitidas en la transcripción mientras se reproduce el sonido.

---

## 2. CONTRATOS DE DATOS & COMPONENTES

Ubicación: `src/experiences/languages/components/listening/`

```typescript
export interface ListeningExercise {
  id: string;
  audioText: string;
  audioLang: string;
  playbackRate: number;
  difficulty: CEFRLevel;
  type: 'comprehension' | 'dictation' | 'fill_missing' | 'keyword_hunt';
  transcriptMasked?: string;
  questions?: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  expectedKeywords?: string[];
}
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 16 — LISTENING DECK]
Actúa como Especialista en Entrenamiento Auditivo y Desarrollador Frontend en GOALS.
Tu tarea es implementar el Deck de Listening y Comprensión en `src/experiences/languages/components/listening/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `ListeningDeckView.tsx`:
   - Reproductor de audio visual con barra de progreso, ecualizador animado y selector de velocidad (0.75x a 1.0x).
   - Botón de "Repetir fragmento" y "Ocultar / Mostrar transcripción".
2. Implementa las 4 actividades de escucha con validación en tiempo real:
   - `DictationCard.tsx`: compara el texto transcrito por el alumno con la locución real, admitiendo pequeñas diferencias de puntuación.
   - `ListeningQuizCard.tsx`: preguntas de opción múltiple basadas en el contenido escuchado.
   - `MaskedTranscriptCard.tsx`: huecos en el texto para rellenar mientras se escucha.
3. Otorga XP educativo e incrementa el mastery de `listening` en `MemoryService.updateSkillMastery('listening', +3)`.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Reproducción Estable:** Control total de reproducción mediante `VoiceEngine.speakText()` sin cortes indeseados.
- [x] **Ajuste de Velocidad:** Posibilidad de ralentizar el audio para principiantes sin distorsionar el tono.
- [x] **Tolerancia Inteligente en Dictados:** Acepta variaciones menores de puntuación sin penalizar al alumno.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El reproductor muestra claramente el estado de reproducción y tiempo?
- [ ] ¿Los dictados comparan la transcripción de manera pedagógica y constructiva?
- [ ] ¿La transcripción completa solo se revela si el usuario lo solicita explícitamente?
- [ ] ¿Se guardan las estadísticas de acierto auditivo en el perfil del alumno?
