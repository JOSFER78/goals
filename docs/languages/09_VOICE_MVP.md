# BLOQUE 09 — VOICE MVP & BIDIRECTIONAL SPEECH

> **Fase:** 3 — Voz y Análisis Acústico  
> **Dependencias:** Bloques 01, 02, 06, 08  
> **Responsabilidad:** Motor de reconocimiento de voz (STT) y síntesis de voz (TTS) en tiempo real con Web Speech API y manejo de interrupciones.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Hacer que la experiencia de Goals Languages se sienta como una llamada telefónica o clase particular real. El motor debe escuchar continuamente la voz del alumno mediante `SpeechRecognition`, transcribir resultados intermedios y finales, enviar el texto al Teacher Agent y reproducir la respuesta mediante `SpeechSynthesis` con la voz neuronal más natural disponible en el dispositivo del usuario.

---

## 2. ARQUITECTURA DE VOZ

```text
Micrófono del Alumno
       │
       ▼
[Web Speech Recognition (STT)]  ──>  Transcripción en tiempo real
       │
       ▼
[Teacher Agent (LLM)]           ──>  Respuesta pedagógica en JSON
       │
       ▼
[Speech Synthesis (TTS)]        ──>  Voz neuronal nativa (Google / Microsoft Natural)
       │
       ▼
Altavoces / Auriculares
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 09 — VOICE MVP]
Actúa como Ingeniero de Audio y Voz en GOALS.
Tu tarea es implementar y robustecer el motor de voz en `src/experiences/languages/services/voiceEngine.ts` y su interfaz `VoiceStudioModal.tsx`.

REGLAS DE IMPLEMENTACIÓN:
1. Implementa en `VoiceEngine.ts`:
   - `startListening(targetLanguage, onTranscript, onError, onEnd)` con soporte para Web Speech API (`webkitSpeechRecognition`).
   - `speakText(text, targetLanguage, rate, onStart, onEnd)` con selección prioritaria de voces "Natural / Neural / Google / Online".
   - `stopListening()` y `stopSpeaking()` para corte instantáneo e interrupciones del alumno.
2. Desarrolla `VoiceStudioModal.tsx`:
   - Modal a pantalla completa / tarjeta inmersiva con botón de micrófono central de gran tamaño.
   - Estados visuales claros: `Escuchando...` (resplandor cian pulsante), `Pensando...` (spinner) y `Hablando...` (ondas de audio activas).
   - Subtítulos en tiempo real en la parte inferior para confirmar lo que el sistema ha entendido.
   - Botón de interrupción ("Hablar encima") que cancela el audio del profesor y reanuda el micrófono.
3. Asegura compatibilidad con móviles (Android / iOS / Desktop Chrome, Edge y Safari).
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Latencia Reducida:** Inicio inmediato de la captura de audio y transcripción en vivo.
- [x] **Voces Neuronales:** Selección automática de voces nativas en inglés, francés, alemán, japonés, italiano y portugués.
- [x] **Manejo de Permisos:** Mensajes amigables y claros si el usuario deniega el permiso del micrófono.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El reconocimiento de voz transcribe correctamente frases en el idioma objetivo?
- [ ] ¿La síntesis de voz pronuncia con entonación natural y velocidad ajustable (0.8x a 1.1x)?
- [ ] ¿Al tocar el botón de colgar o cerrar se detiene inmediatamente el audio y el micrófono?
- [ ] ¿Funciona sin errores en navegadores Chromium y Safari?
