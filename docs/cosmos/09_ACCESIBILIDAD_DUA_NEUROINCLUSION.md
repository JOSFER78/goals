# ♿ 09. ACCESIBILIDAD UNIVERSAL (A11Y), DUA Y NEUROINCLUSIÓN
## Manual de Conformidad WCAG 2.2 AAA, Diseño Universal para el Aprendizaje y Adaptaciones Específicas para TDAH, TEA, Dislexia y Baja Visión

**Especialidad:** Accesibilidad Universal e Inclusión Educativa  
**Conformidad:** WCAG 2.2 Nivel AAA · Marco DUA (Redes de Reconocimiento, Estratégicas y Afectivas)

---

## 1. ADAPTACIONES NEUROINCLUSIVAS

### 1.1. Alumnado con TDAH
- **Micro-lecciones:** Segmentadas en pasos de $<180-240\text{ segundos}$ con barra visual de checkpoints.
- **Zero Distraction HUD:** Atenuación automática de telemetría secundaria y desenfoque del fondo 3D durante la lectura.
- **Retroalimentación Háptica (Vibration API):** Pulso corto (50 ms) en aciertos, doble pulso (30-40-30 ms) en correcciones y pulso largo (80 ms) en transiciones orbitales.
- **Pauta Activa 2:1:** 60-90s de teoría $\rightarrow$ 30-60s de manipulación 3D interactiva $\rightarrow$ 30s de validación.

### 1.2. Alumnado con TEA (Espectro Autista)
- **Estructura Fija:** 3 áreas predecibles (Árbol a la izquierda, Viewport 3D en el centro, Telemetría a la derecha/inferior).
- **Cero Temporizadores de Estrés:** Modo cronómetro relajado sin cuentas regresivas punitivas.
- **Modo Baja Estimulación Sensorial:** Supresión del 95% de partículas estelares, eliminación de destellos/bloom y audio libre de frecuencias agudas (>4000 Hz).
- **Lenguaje Literal:** Sin metáforas ambiguas; instrucciones paso a paso en imperativo directo con pictogramas.

### 1.3. Alumnado con Dislexia
- **Tipografía Adaptativa:** *Atkinson Hyperlegible*, *OpenDyslexic* y *Lexend Deca* con interlineado 1.8, espaciado 0.08em y ancho máximo de 65 caracteres por línea.
- **Sintetizador de Voz (TTS) Sincronizado:** Lectura con `window.speechSynthesis` y resaltado visual en tiempo real palabra por palabra (`onboundary`).
- **Glosario Fonético Interactivo:** Silabeo coloreado (*fo · to · sfe · ra*), transcripción AFI y pronunciación a $0,75\times$.

---

## 2. BAJA VISIÓN Y DALTONISMO (CVD-SAFE)

- **Contraste Calibrado:** Ratio de luminancia $>18:1$ en texto principal (`#020617` vs `#F8FAFC`) y $>7.4:1$ en metadatos.
- **Doble Codificación Obligatoria:** Color (paleta Okabe-Ito) + Símbolo Geométrico (Cuadrado, Círculo, Rombo) + Trazo de Línea (Sólida, Discontinua, Punteada).
- **Árbol Semántico ARIA para WebGL:** Estructura DOM paralela oculta accesible para lectores de pantalla (NVDA, JAWS, VoiceOver) con roles interactivos y regiones en vivo (`aria-live="polite"`).

---

## 3. NAVEGACIÓN 100% POR TECLADO
- **`Barra Espaciadora (Space)`:** Modo Paneo libre de cámara 3D (`mouseButtons.LEFT = THREE.MOUSE.PAN`).
- **`Flechas Direccionales`:** Rotación orbital en incrementos discretos de $15^\circ$.
- **`+` / `-`:** Zoom in / Zoom out controlado.
- **`P`:** Pausa/reanudación de la física de la simulación.
- **`M`:** Alternancia entre Escala Didáctica y Escala 1:1 Real.
- **`Tab` / `Enter`:** Foco visible de 3px (`ring-3 ring-cyan-400`).
