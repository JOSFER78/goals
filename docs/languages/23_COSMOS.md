# BLOQUE 23 — COSMOS (PARENT & EDUCATOR PORTAL)

> **Fase:** 6 — Motivación y Entorno  
> **Dependencias:** Bloques 01, 03, 05, 07, 21  
> **Responsabilidad:** Panel de visualización para padres y educadores con métricas de tiempo, evolución de vocabulario y recomendaciones, protegiendo la privacidad del menor.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Permitir a los padres y tutores seguir con orgullo y claridad el progreso lingüístico real de sus hijos. El portal Cosmos muestra métricas agregadas (tiempo de práctica por semana, palabras aprendidas, evolución en el radar de competencias) y resúmenes pedagógicos de alto nivel, preservando siempre la confidencialidad de las conversaciones íntimas del menor.

---

## 2. COMPONENTES VISUALES & ARQUITECTURA

Ubicación: `src/experiences/languages/components/cosmos/`

```text
cosmos/
├── ParentDashboardView.tsx      # Vista general para padres y tutores
├── WeeklyStudyTimeChart.tsx     # Gráfico de minutos dedicados por día
├── VocabularyGrowthCurve.tsx    # Curva de expansión léxica acumulada
└── PedagogicalHighlights.tsx    # Tarjetas con hitos alcanzados y sugerencias
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 23 — COSMOS]
Actúa como Especialista en Analítica para Familias y Desarrollador Frontend en GOALS.
Tu tarea es implementar el Portal de Padres y Educadores en `src/experiences/languages/components/cosmos/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `ParentDashboardView.tsx` protegido con PIN parental opcional:
   - Resumen semanal: Minutos hablados, sesiones completadas y tasa de constancia.
   - Radar de competencias CEFR del estudiante con comparativa frente al mes anterior.
   - Gráfico de barras de actividad diaria (lunes a domingo) con minutos invertidos.
   - Listado de las 10 últimas palabras dominadas con su traducción y pronunciación.
2. Añade la sección "Recomendaciones para Casa":
   - Consejos sencillos para que los padres apoyen el aprendizaje sin necesidad de saber el idioma (ej. "Pregúntale sobre cómo se piden cosas en un restaurante").
3. NO expongas nunca transcripciones literales de las conversaciones privadas del menor.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Privacidad Estricta del Menor:** Solo métricas formativas agregadas, sin historiales de chat invasivos.
- [x] **Claridad para Familias:** Información comprensible sin tecnicismos pedagógicos innecesarios.
- [x] **Exportación de Informe:** Botón para generar un resumen en PDF / vista imprimible.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El dashboard se visualiza con diseño limpio y profesional?
- [ ] ¿Las métricas reflejan los datos reales acumulados en `MemoryService`?
- [ ] ¿El PIN parental protege el acceso a configuraciones de cuenta sensibles?
- [ ] ¿Se ofrece el resumen de progreso en formato descargable o compartible?
