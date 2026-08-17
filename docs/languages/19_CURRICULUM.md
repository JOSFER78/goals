# BLOQUE 19 — CURRICULUM CEFR (A1 TO C2 MATRIX)

> **Fase:** 5 — Currículo y Adaptabilidad  
> **Dependencias:** Bloques 01, 05, 11, 17  
> **Responsabilidad:** Matriz curricular completa del Marco Común Europeo de Referencia (A1, A2, B1, B2, C1, C2) desglosada por micro-competencias y requisitos previos.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Proveer una estructura pedagógica sólida y transparente basada en el marco internacional CEFR. Cada nivel (A1 a C2) se descompone en competencias específicas, hitos de aprendizaje medibles y objetivos comunicativos que el alumno puede consultar y desbloquear a medida que demuestra maestría.

---

## 2. ESTRUCTURA CURRICULAR CEFR

```text
NIVEL CEFR ──> 8 COMPETENCIAS ──> MICRO-HABILIDADES ──> RETOS & ACTIVIDADES
[A1 Acceso]      - Speaking        - Presentarse         - Conversación 3 min
[A2 Plataforma]  - Listening       - Pedir en tienda     - Roleplay Aeropuerto
[B1 Umbral]      - Reading         - Pasado irregular    - Práctica 5 verbos
[B2 Avanzado]    - Writing         - Escribir email      - Taller de Redacción
[C1 Dominio]     - Grammar         - Debatir opiniones   - Discusión Científica
[C2 Maestría]    - Pronunciation   - Matices sutiles     - Fonética Acústica
```

---

## 3. CONTRATOS DE DATOS

```typescript
export interface CurriculumNode {
  id: string;
  level: CEFRLevel;
  skill: keyof SkillMastery;
  title: string;
  description: string;
  prerequisites: string[]; // IDs de nodos previos requeridos
  targetOutcomes: string[];
  xpValue: number;
  completed: boolean;
  masteryPercentage: number;
}
```

---

## 4. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 19 — CURRICULUM CEFR]
Actúa como Diseñador Curricular y Desarrollador Frontend en GOALS.
Tu tarea es implementar el Explorador de Currículo CEFR en `src/experiences/languages/components/curriculum/` y su base de datos en `src/experiences/languages/data/curriculumData.ts`.

REGLAS DE IMPLEMENTACIÓN:
1. Define en `curriculumData.ts` la matriz de hitos pedagógicos desde A1 hasta C2 para las 8 competencias.
2. Desarrolla `CurriculumTreeView.tsx`:
   - Selector visual de niveles CEFR con pestañas (A1, A2, B1, B2, C1, C2).
   - Árbol de micro-habilidades con nodos interactivos, líneas de conexión y badges de estado (`Bloqueado`, `En progreso`, `Completado`).
   - Al pulsar un nodo, despliega un panel lateral con objetivos, vocabulario recomendado y botón de "Comenzar práctica".
3. Vincula el progreso de los nodos con las métricas de `SkillMastery` en `MemoryService`.
```

---

## 5. CRITERIOS DE ACEPTACIÓN

- [x] **Matriz Rigurosa:** Alineada con las directrices oficiales del Consejo de Europa para el aprendizaje de lenguas.
- [x] **Visualización en Árbol Intuitiva:** El alumno comprende con claridad qué sabe, qué está aprendiendo y cuál es el siguiente paso.
- [x] **Activación Directa:** Posibilidad de lanzar una actividad formativa directamente desde cualquier nodo del currículo.

---

## 6. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El árbol curricular muestra los 6 niveles CEFR con navegación rápida?
- [ ] ¿Se marcan visualmente los requisitos previos no completados?
- [ ] ¿Al tocar un nodo se muestra el desglose de resultados esperados?
- [ ] ¿El progreso de los nodos se guarda y sincroniza con el perfil del estudiante?
