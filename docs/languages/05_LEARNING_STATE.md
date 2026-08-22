# BLOQUE 05 — LEARNING STATE & CEFR MASTERY

> **Fase:** 1 — Perfil y Estado de Aprendizaje  
> **Dependencias:** Bloques 01, 03, 04  
> **Responsabilidad:** Motor de cálculo y visualización del dominio en 8 competencias lingüísticas CEFR.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Implementar el estado pedagógico multidimensional del estudiante. En lugar de una métrica simplista basada solo en XP, Goals Languages calcula y representa el dominio porcentual (0-100%) en 8 competencias:
1. **Speaking** (Expresión Oral)
2. **Listening** (Comprensión Auditiva)
3. **Reading** (Comprensión Lectora)
4. **Writing** (Expresión Escrita)
5. **Grammar** (Estructura y Sintaxis)
6. **Vocabulary** (Amplitud y Precisión Léxica)
7. **Pronunciation** (Claridad Fonética)
8. **Fluency** (Cadencia y Ritmo Conversacional)

---

## 2. CONTRATOS DE DATOS & COMPONENTES

Ubicación: `src/experiences/languages/components/mastery/`

```typescript
export interface SkillMastery {
  speaking: number;       // 0 - 100
  listening: number;      // 0 - 100
  reading: number;        // 0 - 100
  writing: number;        // 0 - 100
  grammar: number;        // 0 - 100
  vocabulary: number;     // 0 - 100
  pronunciation: number;  // 0 - 100
  fluency: number;        // 0 - 100
}
```

### Componentes a Crear:
1. `MasteryRadarChart.tsx`: Gráfico de radar SVG reactivo que dibuja el polígono de 8 vértices.
2. `SkillProgressBar.tsx`: Barra de progreso individual con color codificado por nivel de dominio.
3. `CEFRMatrixCard.tsx`: Indicador global del nivel CEFR estimado con fortalezas y áreas prioritarias.

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 05 — LEARNING STATE]
Actúa como Ingeniero de Datos Pedagógicos y Desarrollador Frontend en GOALS.
Tu tarea es implementar el motor de cálculo y visualización de Mastery en `src/experiences/languages/components/mastery/`.

REGLAS DE IMPLEMENTACIÓN:
1. Construye `MasteryRadarChart.tsx` utilizando SVG puro (sin librerías pesadas externas):
   - Renderiza un polígono de 8 lados con radios proporcionales a las 8 habilidades de `SkillMastery`.
   - Aplica un degradado cian-esmeralda traslúcido y puntos interactivos con tooltip del valor porcentual.
2. Construye el componente `MasteryBreakdownList.tsx` mostrando las 8 barras de progreso con badges (ej. `B2 · 78%`).
3. Implementa en `MemoryService.updateSkillMastery(skill, delta)` la ponderación adecuada tras cada actividad completada.
4. Conecta el estado para que se actualice en tiempo real tras interactuar con el profesor o completar ejercicios.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Renderizado SVG Matemático:** Gráfico de radar responsivo y perfectamente centrado.
- [x] **Actualización Reactiva:** Las 8 barras reflejan de inmediato cualquier incremento de puntos ganado en ejercicios o diálogo.
- [x] **Cálculo Coherente:** El nivel CEFR global concuerda con la media ponderada de las competencias.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El gráfico de radar SVG se dibuja sin deformaciones en pantallas pequeñas?
- [ ] ¿Los tooltips muestran el nombre de la competencia y su porcentaje exacto?
- [ ] ¿Al invocar `updateSkillMastery` se emite el evento y persiste en storage?
- [ ] ¿Se muestra una comparativa clara entre la competencia más fuerte y la que necesita refuerzo?
