# BLOQUE 21 — PEDAGOGICAL GAMIFICATION (NO-ANXIETY)

> **Fase:** 6 — Motivación y Entorno  
> **Dependencias:** Bloques 01, 03, 05, 20  
> **Responsabilidad:** Sistema de puntos de experiencia (XP), misiones formativas, niveles, logros e incentivos vinculados estrictamente al progreso lingüístico real.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Desarrollar una gamificación constructiva, alejada de mecánicas tóxicas o que generen ansiedad. En lugar de castigar al alumno con la pérdida total de su racha por un día de ausencia o premiar clics mecánicos sin aprendizaje, el sistema recompensa:
- Demostrar la adquisición de objetivos lingüísticos (+50 XP).
- Mantener una conversación de más de 5 minutos (+40 XP).
- Superar misiones con metas contextuales (ej. *Misión "Survive the Airport"*).
- Racha empática: mensaje positivo de bienvenida (*"¡Qué alegría verte de nuevo! Continuamos desde donde lo dejamos."*).

---

## 2. COMPONENTES VISUALES & ARQUITECTURA

Ubicación: `src/experiences/languages/components/gamification/`

```text
gamification/
├── MissionsTrackerCard.tsx      # Lista de misiones activas y recompensas
├── AchievementBadgeGrid.tsx     # Cuadrícula de medallas desbloqueables
├── StreakWarmthBadge.tsx        # Indicador de racha empática con mensaje de aliento
└── LevelUpCelebrationModal.tsx  # Modal de felicitación con confetti SVG
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 21 — PEDAGOGICAL GAMIFICATION]
Actúa como Diseñador de Gamificación Educativa y Frontend en GOALS.
Tu tarea es implementar el Sistema de Gamificación Pedagógica en `src/experiences/languages/components/gamification/`.

REGLAS DE IMPLEMENTACIÓN:
1. Conecta los eventos formativos con `ProgressContext`:
   - Diálogo completado: +20 a +35 XP según longitud y complejidad.
   - Ejercicio acertado al primer intento: +15 XP.
   - Roleplay completado con nota superior a 80%: +60 XP.
   - Hito curricular desbloqueado: +100 XP.
2. Desarrolla `MissionsTrackerCard.tsx` con misiones semanales (ej. "Mantén 3 conversaciones", "Aprende 10 palabras de viajes", "Completa un taller de escritura").
3. Diseña `StreakWarmthBadge.tsx` que premie la constancia sin penalizaciones dramáticas por pausas.
4. Diseña medallas de logros formativos (ej. *Políglota Espacial*, *Orador Fluido*, *Maestro de los Verbos Irregulares*).
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **XP Vinculado al Aprendizaje:** Ninguna recompensa se otorga por acciones triviales o no pedagógicas.
- [x] **Rachas Sin Ansiedad:** Enfoque en crear hábito positivo y no culpabilidad.
- [x] **Efectos Visuales Ligeros:** Modal de felicitación con animaciones CSS/SVG puras y fluidas.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El progreso de las misiones se actualiza automáticamente al realizar actividades?
- [ ] ¿El modal de subida de nivel aparece con animación festiva y detalle de ventajas?
- [ ] ¿Las medallas muestran claramente la condición necesaria para desbloquearlas?
- [ ] ¿Los puntos de experiencia se suman de forma sincronizada con el perfil global de GOALS?
