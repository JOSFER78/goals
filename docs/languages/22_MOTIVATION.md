# BLOQUE 22 — MOTIVATION ENGINE & LEARNER ARCHETYPES

> **Fase:** 6 — Motivación y Entorno  
> **Dependencias:** Bloques 01, 04, 06, 21  
> **Responsabilidad:** Motor de adaptación psicológica del tono pedagógico según los 5 arquetipos de motivación del estudiante.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Alinear la personalidad del Teacher Agent y los incentivos de la plataforma con la estructura motivacional de cada estudiante. Cada alumno responde a estímulos diferentes; el motor clasifica al estudiante en uno de los 5 arquetipos:
1. **Explorer (Explorador):** Motivado por el descubrimiento, datos curiosos de ciencia, mapas y artefactos multimodales.
2. **Storyteller (Narrador):** Motivado por cuentos, historias fantásticas, elecciones dramáticas y redacción creativa.
3. **Achiever (Orientado a Logros):** Motivado por métricas claras, dominio CEFR, retos de precisión y medallas.
4. **Competitor (Competitivo):** Motivado por superar sus propios récords de fluidez, velocidad y desafíos contra reloj.
5. **Social (Conversador Empático):** Motivado por charlar sobre emociones, hobbies, amigos y roleplay cooperativo.

---

## 2. ARQUETIPOS Y DIRECTIVAS DE PROMPT

```typescript
export type LearnerArchetype = 'explorer' | 'storyteller' | 'achiever' | 'competitor' | 'social';

export interface MotivationProfile {
  primaryArchetype: LearnerArchetype;
  confidenceScore: number;
  preferredRewardType: 'badge' | 'lore' | 'stats' | 'story_unlock';
  pacingPreference: 'fast_paced' | 'reflective' | 'story_driven';
}
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 22 — MOTIVATION ENGINE]
Actúa como Psicólogo Educativo y Diseñador de Prompts en GOALS.
Tu tarea es implementar el Motor de Motivación Adaptativa en `src/experiences/languages/services/motivationEngine.ts`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `motivationEngine.ts`:
   - Deduce el arquetipo predominante analizando las elecciones de actividades del alumno en `MemoryService.getEpisodicMemories()`.
   - Genera una directiva de personalidad inyectable para el `TeacherAgent`:
     * Para *Explorer*: "Incorpora datos curiosos y fascinantes sobre el mundo y la ciencia."
     * Para *Storyteller*: "Usa metáforas narrativas y pregunta qué pasaría en una historia."
     * Para *Achiever*: "Enfatiza el progreso medible y los porcentajes de dominio lingüístico alcanzados."
     * Para *Social*: "Sé extraordinariamente cálido, pregunta por sus sentimientos y experiencias personales."
2. Ajusta los títulos de las misiones y las frases de celebración de victoria según el arquetipo activo.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Diferenciación Sutil y Respetuosa:** La adaptación del tono se siente natural y nunca invasiva o caricaturesca.
- [x] **Ajuste Dinámico:** El arquetipo evoluciona a medida que el alumno interactúa con diferentes modalidades.
- [x] **Cero Etiquetado Negativo:** Ningún arquetipo es superior a otro; todos potencian el aprendizaje.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El prompt del profesor incluye la directiva motivacional calibrada?
- [ ] ¿Las frases de felicitación al terminar una lección concuerdan con el arquetipo?
- [ ] ¿El arquetipo se almacena en el perfil del usuario de forma transparente?
- [ ] ¿Se garantiza una experiencia empática y adaptativa en todas las edades?
