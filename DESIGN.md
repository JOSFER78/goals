# GOALS Design System (DESIGN.md)

## 1. Filosofía y Estética: Tactile Brutalism & Linear Glassmorphism
- **Propósito:** Software educativo de alta ingeniería con sensación de producto de millones de dólares (nivel Linear, Raycast, Apple).
- **Prohibiciones Absolutas (Anti-Clichés IA):**
  - Cero cuadrículas simétricas idénticas 1x1 sin peso visual.
  - Cero fondos crema/beige o de rejilla de puntos genérica.
  - Cero emojis informales en headers, badges o tablas (sustituidos por Lucide Icons vectoriales con colores semánticos).
  - Cero degradados agresivos en texto plano; tipografía sobria con tracking display ajustado (`-0.02em` a `-0.03em`).
  - Cero borders de 1px combinados con sombras difusas de 16px.

## 2. Paleta de Colores y Tokens Semánticos
- **Base Background:** Deep Space Dark `#010204` / `bg-slate-950` con `backdrop-blur-xl`.
- **Bordes y Superficies:**
  - `Surface Glass:` `bg-slate-950/80 border border-slate-800/80 backdrop-blur-md`
  - `Bento Highlight (Escuela):` `border-emerald-500/30 text-emerald-400 bg-emerald-950/40`
  - `Bento Highlight (Idiomas):` `border-cyan-500/30 text-cyan-400 bg-cyan-950/40`
  - `Bento Highlight (Cosmos 3D):` `border-indigo-500/30 text-indigo-400 bg-indigo-950/40`
  - `Bento Highlight (Verifica):` `border-amber-500/30 text-amber-400 bg-amber-950/40`

## 3. Tipografía y Jerarquía
- **Display Font:** Space Grotesk / Outfit para titulares e indicadores numéricos.
- **Body Font:** Inter / Nunito para legibilidad en explicaciones pedagógicas.
- **Monospace Font:** JetBrains Mono para telemetría, código, fórmulas y confianza OCR.
- **Regla de Contraste:** Mínimo `≥4.5:1` en texto de lectura y `≥3:1` en elementos grandes.

## 4. Componentes y Patrón Bento Asimétrico
- Cada tarjeta contiene una **Micro-Demo Viva**:
  1. **Escuela IA:** Escáner láser OCR en movimiento, detección paso a paso y confianza en vivo (`99.4%`).
  2. **Idiomas Voz:** Ecualizador de ondas de audio animadas reactivas y score fonético (`98%`).
  3. **Cosmos 3D:** HUD de telemetría astronómica NASA en tiempo real (`ALT 408 KM | VEL 7.66 KM/S`).
  4. **Verifica:** Radar de fuentes académicas oficiales (NASA, ESA, CSIC, BOE).
