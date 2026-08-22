# BLOQUE 10 — SPEECH ANALYSIS & ACOUSTIC COACH

> **Fase:** 3 — Voz y Análisis Acústico  
> **Dependencias:** Bloques 01, 02, 05, 09  
> **Responsabilidad:** Visualizador de ondas en tiempo real con Web Audio API, análisis de formantes, pausas y evaluación fonética.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Proporcionar al alumno un entrenador de pronunciación y acústica visual. Mediante la Web Audio API (`AudioContext` y `AnalyserNode`), el sistema analiza la señal del micrófono, renderiza la onda fonética en un `<canvas>` o barras SVG y calcula indicadores de claridad fonética, ritmo y pausas naturales sin convertir cada charla en un examen estresante.

---

## 2. COMPONENTES VISUALES & ARQUITECTURA

Ubicación: `src/experiences/languages/components/speech/`

```text
speech/
├── PhoneticCoachView.tsx        # Vista principal del laboratorio fonético
├── LiveWaveformCanvas.tsx       # Canvas 60 FPS con osciloscopio de audio
├── PronunciationDrillCard.tsx   # Tarjeta de práctica de fonemas difíciles
└── AcousticMetricsRadar.tsx     # Desglose de entonación, pausas y claridad
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 10 — SPEECH ANALYSIS]
Actúa como Ingeniero de Procesamiento de Señales de Audio y Frontend en GOALS.
Tu tarea es implementar el Entrenador Fonético y Análisis de Ondas en `src/experiences/languages/components/speech/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `LiveWaveformCanvas.tsx`:
   - Conecta con `navigator.mediaDevices.getUserMedia({ audio: true })` usando `AudioContext` y `AnalyserNode`.
   - Dibuja en un elemento `<canvas>` la forma de onda en tiempo real con gradiente cian (`#06b6d4` a `#38bdf8`) y efecto glow difuso.
   - Limpia correctamente los flujos de audio (`track.stop()`, `audioContext.close()`) al desmontar el componente.
2. Desarrolla `PronunciationDrillCard.tsx`:
   - Muestra palabras con fonemas complejos según el idioma (ej. "comfortable", "thoroughly", "squirrel").
   - Permite escuchar la pronunciación modelo a 0.75x y 1.0x.
   - Graba el intento del alumno y evalúa la similitud fonética mostrando una puntuación de precisión (ej. `94% - Nativo`).
3. Actualiza el mastery de `pronunciation` y `fluency` en `MemoryService`.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Renderizado Acústico en Tiempo Real:** El canvas reacciona fielmente a los picos de voz del usuario a 60 FPS.
- [x] **Limpieza de Recursos:** Cierre impecable de `AudioContext` para evitar fugas de memoria o micrófonos encendidos.
- [x] **Práctica Guiada de Fonemas:** Botón para escuchar el audio de referencia a velocidad lenta.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El canvas dibuja ondas suaves y elegantes acordes a la estética Glassmorphism?
- [ ] ¿El analizador se desactiva cuando el usuario abandona la pestaña o cierra la vista?
- [ ] ¿Se ofrece retroalimentación visual inmediata tras repetir una palabra modelo?
- [ ] ¿No se producen bloqueos en navegadores móviles que requieran interacción previa para iniciar AudioContext?
