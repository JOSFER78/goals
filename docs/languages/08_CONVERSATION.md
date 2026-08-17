# BLOQUE 08 — CONVERSATION ENGINE (FREE & DIRECTED)

> **Fase:** 2 — El Profesor y su Memoria  
> **Dependencias:** Bloques 01, 02, 06, 07  
> **Responsabilidad:** Sala de conversación dinámica, alternancia entre diálogo libre y dirigido, sugerencias socráticas y control de turnos.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Proveer una experiencia de conversación en tiempo real donde el alumno pueda charlar libremente sobre sus temas favoritos (ciencia, deportes, videojuegos, viajes) o seguir un hilo pedagógico guiado por el profesor. El motor debe gestionar el historial de turnos, sugerir opciones de respuesta rápida para desbloquear al estudiante y presentar el feedback pedagógico de forma fluida.

---

## 2. COMPONENTES VISUALES & ARQUITECTURA

Ubicación: `src/experiences/languages/components/conversation/`

```text
conversation/
├── ConversationView.tsx         # Contenedor del chat con burbujas y estado
├── ChatBubble.tsx               # Burbuja de mensaje estilizada con audio y tips
├── TopicSuggestionsBar.tsx      # Chips con sugerencias de temas basadas en intereses
├── PedagogicalFeedbackModal.tsx # Desglose de correcciones al tocar una sugerencia
└── ConversationInputBar.tsx     # Barra de entrada con botón de micrófono y envío
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 08 — CONVERSATION ENGINE]
Actúa como Especialista en Interfaces Conversacionales y Frontend en GOALS.
Tu tarea es implementar el módulo de Conversación Libre y Guiada en `src/experiences/languages/components/conversation/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `ConversationView.tsx` integrando:
   - Historial de mensajes interactivo con desplazamiento automático al último turno.
   - Botón de reproducción de audio TTS integrado en cada mensaje del profesor.
   - Tarjeta de feedback pedagógico expandible con correcciones detectadas y vocabulario nuevo.
   - Selector de modalidad: "Conversación Libre" vs "Conversación Guiada".
2. Incluye `TopicSuggestionsBar.tsx` con chips de temas dinámicos según los intereses del estudiante guardados en `MemoryService.getProfile()`.
3. Al enviar un mensaje, invoca `TeacherAgent.interact()` pasando los últimos 6 turnos para mantener coherencia temporal.
4. Muestra un estado de "El profesor está pensando..." con animación de pulsación cian mientras se procesa la llamada a la IA.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Turn-Taking Fluido:** Visualización clara de los turnos del alumno y del profesor.
- [x] **Sugerencias de Desbloqueo:** Chips de respuesta rápida (`suggestedFollowUp`) para cuando el alumno no sabe qué responder.
- [x] **Audio Inmediato:** Botón de altavoz en cada mensaje del profesor para escuchar la pronunciación nativa.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El chat mantiene el foco y hace scroll automático al recibir un nuevo mensaje?
- [ ] ¿Los mensajes del profesor muestran el badge de nivel CEFR y vocabulario clave?
- [ ] ¿El botón de audio reproduce la síntesis de voz con la velocidad configurada?
- [ ] ¿Se guardan los turnos en la memoria episódica al concluir la conversación?
