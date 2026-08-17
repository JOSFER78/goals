# BLOQUE 04 — LEARNER PROFILE & ADAPTIVE ONBOARDING

> **Fase:** 1 — Perfil y Estado de Aprendizaje  
> **Dependencias:** Bloques 01, 02, 03  
> **Responsabilidad:** Captura y edición del perfil del estudiante, personalización por franja etaria (6-10 vs 11-15+), intereses y estilo pedagógico.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Construir el módulo de perfil y onboarding adaptativo para Goals Languages. El sistema debe capturar la edad, idioma materno, idioma objetivo, nivel autodeclarado o diagnosticado (A1-C2), intereses temáticos (ej. Minecraft, Astronomía, Fútbol) y preferencias de corrección (inmediata, contextual, diferida). El perfil condicionará el tono, la dificultad y los ejemplos utilizados por el Teacher Agent.

---

## 2. CONTRATOS DE DATOS & COMPONENTES

Ubicación: `src/experiences/languages/components/profile/`

```typescript
export interface StudentLanguageProfile {
  id: string;
  name: string;
  age: number;
  nativeLanguage: string;
  targetLanguage: string;
  overallLevel: CEFRLevel;
  interests: string[];
  learningStyle: 'visual' | 'auditivo' | 'practico' | 'conversacional';
  correctionPreference: 'inmediata' | 'contextual' | 'diferida';
  dailyGoalMinutes: number;
}
```

### Componentes a Crear:
1. `LearnerProfileCard.tsx`: Resumen visual del perfil en la cabecera/sidebar.
2. `LearnerOnboardingModal.tsx`: Asistente paso a paso para nuevos alumnos o reconfiguración de metas.
3. `InterestTagPicker.tsx`: Selector interactivo de etiquetas de interés temático.
4. `CorrectionModeSelector.tsx`: Selector visual de sensibilidad de corrección pedagógica.

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 04 — LEARNER PROFILE]
Actúa como Especialista en UX Educativa y Frontend en GOALS.
Tu tarea es implementar el módulo de Perfil del Estudiante y Onboarding Adaptativo en `src/experiences/languages/components/profile/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `LearnerProfileModal.tsx` que permita configurar:
   - Nombre y Edad (con adaptación de UI según franja: <11 años o >=11 años).
   - Idioma Objetivo e Idioma Materno.
   - Nivel CEFR estimado (A1 a C2) con descripciones claras y amigables.
   - Selector dinámico de intereses (mínimo 15 opciones con emojis, ej. 🚀 Espacio, 🎮 Videojuegos, ⚽ Fútbol, 🧪 Ciencia, 🎨 Arte).
   - Preferencia de corrección pedagógica: Inmediata (interrumpir con cariño), Contextual (integrar en la respuesta) o Diferida (guardar para el final).
2. Conecta las modificaciones con `MemoryService.updateProfile()`.
3. Integra el disparador del perfil en la cabecera de `LanguagesView.tsx` mediante un avatar interactivo y badge de nivel.
4. Asegura validación de formularios reactiva y cierre fluido del modal.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Persistencia Inmediata:** Los cambios en el perfil se guardan al instante y actualizan el contexto del profesor.
- [x] **Diferenciación por Edad:** Textos y recomendaciones adaptadas para público infantil o adolescente/adulto.
- [x] **Selector Dinámico de Intereses:** Posibilidad de añadir y remover tags de interés con chips interactivos.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El modal de perfil se abre y cierra limpiamente sin bloquear el fondo?
- [ ] ¿Al cambiar el nivel CEFR o los intereses se actualiza el resumen del MemoryService?
- [ ] ¿El formulario valida que la edad y el nombre sean válidos antes de guardar?
- [ ] ¿Se emite el evento `goals_languages_profile_updated`?
