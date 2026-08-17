# 06 · SISTEMA DE DISEÑO Y GUÍA DE ESTILOS (FASE 4 — DESIGN SYSTEM)
**Mini App**: CRITERIO · Aprender a Informarse (GOALS)  
**Estética**: Tactile Brutalism & Linear Glassmorphism · Mobile-First (390px) · Ámbar Forense & Esmeralda Evidencia  

---

## 1. PALETA DE COLORES Y TOKENS SEMÁNTICOS

| Token Semántico | Valor Hex / Tailwind | Propósito Pedagógico y Visual |
| :--- | :--- | :--- |
| **Primary Accent (Ámbar Forense)** | `#F59E0B` (`amber-500`) | Identidad visual de CRITERIO, botones primarios de investigación, estados activos de radar. |
| **Secondary Accent (Dorado Rigor)** | `#EAB308` (`yellow-500`) | Destacados numéricos, puntuaciones de Criterio y medidores de confianza. |
| **Evidencia Confirmada (Esmeralda)** | `#10B981` (`emerald-500`) | Hechos probados por fuentes primarias, respuestas matizadas con evidencia. |
| **Alerta Emocional / Precaución (Rosa/Rojo)** | `#EF4444` (`rose-500` / `red-500`) | Detección de lenguaje hiperbólico, contenido sin fuente, llamadas a la urgencia artificial. |
| **Incertidumbre / Falta Contexto (Cian)** | `#06B6D4` (`cyan-500`) | Puntos que requieren comprobación adicional, zonas grises donde faltan datos. |
| **Base Canvas Dark Space** | `#020617` (`slate-950`) | Fondo base de alto contraste inmersivo. |
| **Surface Glassmorphic Panel** | `bg-slate-900/80 border-slate-800/80 backdrop-blur-xl` | Tarjetas bento, modales y visores interactivos. |

---

## 2. TIPOGRAFÍA Y JERARQUÍA VISUAL

- **Display & Números**: `Space Grotesk`, `Outfit`, `Inter` (Font Display de GOALS) con tracking compensado (`-0.02em`).
- **Cuerpo y Reflexiones**: `Inter`, `Nunito` para legibilidad continua con line-height de `1.6`.
- **Telemetría y Fuentes Primarias**: `JetBrains Mono` con etiquetas uppercase para metadatos (`[FECHA: 2026-07-23]`, `[FUENTE: BOE]`, `[CONFIANZA: 94%]`).
- **Accesibilidad**: Contraste estricto WCAG AA (`≥ 4.5:1` en texto de lectura y `≥ 3:1` en elementos interactivos).

---

## 3. COMPONENTES VIVOS Y PATRONES INTERACTIVOS

1. **Bento Card Asimétrica con Micro-Demo Viva**:
   - Cada uno de los 12 módulos dispone de una animación SVG reactiva (diagrama de embudo de verificación, oscilador de emociones, red de propagación, selector de feed).
2. **Widget del Método PAUSA con Respiración Visual**:
   - Cuenta atrás de 30 segundos con aura palpitante suave que enseña al alumno a desacelerar antes de responder.
3. **Escáner Forense de IA**:
   - Comparador deslizante (*Split View*) para analizar fotos reales vs generadas por IA, con resaltado de artefactos en manos, ojos, textos de fondo e iluminación.
4. **Laboratorio de Feed Social Interactivo**:
   - Interfaz que recrea un feed de publicaciones con botones táctiles de *Like*, *Compartir* y *Detenerse*. Al interactuar, un gráfico dinámico muestra cómo el algoritmo reclasifica el perfil del usuario y estrecha las recomendaciones.
