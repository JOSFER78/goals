# BLOQUE 02 — DESIGN SYSTEM & VISUAL HARMONY

> **Fase:** 0 — Fundaciones  
> **Dependencias:** Bloque 01 (Architecture)  
> **Responsabilidad:** Paleta cromática Dark Glassmorphism, tokens HSL, animaciones acústicas y responsive design.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Desarrollar un sistema de diseño visualmente impactante, premium y adaptado al aprendizaje de idiomas. La estética debe combinar un fondo profundo (`slate-950`), reflejos de cristal ahumado (`backdrop-blur-xl`), acentos cian/esmeralda para estímulo cognitivo y animaciones de ecualizador fonético en tiempo real, evitando cualquier cliché de diseño genérico o aburrido.

---

## 2. TOKENS DE DISEÑO & PALETA HSL

```css
:root {
  /* Fondo y Superficies Glassmorphism */
  --lang-bg-deep: #020617; /* slate-950 */
  --lang-surface-card: rgba(15, 23, 42, 0.85); /* slate-900 / 85% */
  --lang-surface-glass: rgba(30, 41, 59, 0.50); /* slate-800 / 50% */
  --lang-border-subtle: rgba(6, 182, 212, 0.25); /* cyan-500 / 25% */
  --lang-border-active: rgba(6, 182, 212, 0.80); /* cyan-400 / 80% */

  /* Acentos Pedagógicos */
  --lang-accent-cyan: #06b6d4; /* cyan-500 */
  --lang-accent-emerald: #10b981; /* emerald-500 (Aciertos y Mastery) */
  --lang-accent-amber: #f59e0b; /* amber-500 (Atención / Errores a reforzar) */
  --lang-accent-rose: #f43f5e; /* rose-500 (Dificultades fonéticas) */

  /* Tipografías */
  --lang-font-main: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --lang-font-mono: 'JetBrains Mono', monospace;
}
```

---

## 3. COMPONENTES VISUALES CLAVE

1. **AudioWaveBar / Equalizer:** Barras animadas con alturas oscilantes sincronizadas con el estado de voz (`listening`, `speaking`, `idle`).
2. **PedagogicalBadge:** Indicador de nivel CEFR (ej. `[CEFR B1]` o `[98% NAT]`) con borde luminoso difuso.
3. **SoundwaveGridPattern:** Textura sutil de fondo en SVG que evoca una rejilla de frecuencias de audio.
4. **InteractiveRipple:** Animación de pulsación cuando el micrófono está en captura activa.

---

## 4. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 02 — DESIGN SYSTEM]
Actúa como Diseñador UI/UX y Especialista Frontend en GOALS.
Tu tarea es implementar el sistema de diseño visual de Languages en `src/experiences/languages/`.

REGLAS DE DISEÑO:
1. Aplica la estética Dark Glassmorphism sobre fondos `bg-slate-950` con bordes sutiles `border-cyan-500/20` y fondos de tarjeta `bg-slate-900/80 backdrop-blur-xl`.
2. Crea el componente `EqualizerWave.tsx` con animaciones CSS fluidas para representar la actividad acústica real.
3. Asegura micro-interacciones pulidas: `hover:-translate-y-0.5`, `active:scale-95`, transiciones de 200ms y anillos de enfoque accesibles `focus:ring-2 focus:ring-cyan-400`.
4. El diseño debe ser 100% responsive, fluido en smartphones (360px+), tablets y pantallas 4K.
5. NO uses placeholders ni imágenes rotas: utiliza íconos de `lucide-react` y gradientes SVG matemáticos.
```

---

## 5. CRITERIOS DE ACEPTACIÓN

- [x] **Consistencia Cromática:** Uso estricto de la paleta cian, esmeralda y pizarra.
- [x] **Animaciones Fluidas a 60 FPS:** Ecualizador y transiciones sin tirones visuales.
- [x] **Accesibilidad Visual:** Ratios de contraste WCAG AA en textos y badges.
- [x] **Totalmente Responsive:** Adaptación sin desbordamientos en anchos desde 320px hasta ultra-wide.

---

## 6. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿Los botones e inputs tienen feedback táctil y visual inmediato?
- [ ] ¿El fondo incorpora la textura y resplandor ambiental cian?
- [ ] ¿El ecualizador de audio reacciona a los cambios de estado de voz?
- [ ] ¿Se verificó en vista móvil que las tarjetas no tengan márgenes rotos?
