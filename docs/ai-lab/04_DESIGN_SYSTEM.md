# 04 · SISTEMA DE DISEÑO (DESIGN SYSTEM & UI/UX)

**Módulo:** `ai-lab`  
**Estilo Visual:** Dark Glassmorphism, Paleta Curada HSL Ultravioleta, Tipografía Moderna y Microanimaciones Reactivas.

---

## 1. Paleta de Colores de Identidad

| Token | Hex | Tailwind Class | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Primary AI Glow** | `#8B5CF6` | `text-purple-400`, `bg-purple-600` | Botones primarios, halos de luz, bordes activos y acentos. |
| **Secondary Synapse** | `#A855F7` | `text-purple-300`, `border-purple-500/40` | Insignias de nivel, etiquetas de competencia, curvas de activación. |
| **Neural Cyan** | `#22D3EE` | `text-cyan-400`, `border-cyan-500/30` | Puntos de clase 0, tokens de lenguaje, chips numéricos. |
| **Safety Amber** | `#F59E0B` | `text-amber-400`, `bg-amber-500/10` | Alertas forenses, casos de alucinaciones, curva de pérdida. |
| **Ethics Rose** | `#F43F5E` | `text-rose-400`, `border-rose-500/30` | Indicadores de sesgo crítico, dilemas morales. |
| **Verified Emerald** | `#10B981` | `text-emerald-400`, `bg-emerald-500/10` | Módulos completados, modelos equitativos, aciertos de tests. |
| **Deep Space Background** | `#030712` | `bg-slate-950` | Fondo base ultra-oscuro con reducción de fatiga visual. |

---

## 2. Tipografía y Jerarquía Visual

- **Fuente de Pantalla (Display):** Inter / Outfit (Geométrica, ultra-legible en pantallas móviles de alta densidad).
- **Fuente Monoespaciada:** JetBrains Mono / SF Mono (Utilizada para IDs de tokens, pesos numéricos, épocas, matrices y código).
- **Jerarquía de Encabezados:**
  - `h1`: 24px–32px, `font-extrabold`, seguimiento estricto (`tracking-tight`).
  - `h2`: 18px–22px, `font-black`, encabezados de sección y títulos de módulos.
  - `h3`: 14px–16px, `font-bold`, títulos de tarjetas y pasos.
  - `p`: 12px–14px, `font-medium`, interlineado relajado (`leading-relaxed`).

---

## 3. Componentes Visuales y Micro-Interacciones

1. **Tarjetas Glassmorphism:** Fondo `rgba(15, 23, 42, 0.85)`, borde fino `rgba(168, 85, 247, 0.3)`, desenfoque `backdrop-blur-xl`.
2. **Botones Hápticos:** Elevación suave al hover (`hover:-translate-y-0.5`), halo difuso y compresión al pulsar (`active:scale-95`).
3. **Píxeles y Celdas Sensibles:** Aumento de escala `scale-125` y anillo de enfoque fluorescente (`ring-2 ring-purple-400`) al pasar el cursor sobre la cuadrícula.
4. **Patrón de Malla Sináptica (`neural-mesh-pattern`):** Fondo procedural con puntos radiales y rejilla ortogonal con opacidad tenue (15%) que evoca una red neuronal interconectada.
