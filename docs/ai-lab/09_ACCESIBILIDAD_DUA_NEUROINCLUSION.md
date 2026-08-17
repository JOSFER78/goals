# ♿ ACCESIBILIDAD UNIVERSAL DUA 3.0 Y NEUROINCLUSIÓN EN COMPUTACIÓN E IA
## GOALS AI Lab — Especificación Técnica WCAG 2.2 Nivel AAA y Adaptaciones Neuroinclusivas

**Conformidad:** WCAG 2.2 Nivel AAA | DUA 3.0 (CAST 2024) | EN 301 549 v3.2.1  
**Perfiles Neuroinclusivos:** TDAH, Trastorno del Espectro Autista (TEA), Dislexia/Discalculia, Baja Visión y Daltonismo.

---

### ÍNDICE GENERAL
1. **Adaptaciones Neuroinclusivas por Perfil (6 a 15 Años)**.
2. **Matriz DUA 3.0 Aplicada a Ciencias de la Computación e IA**.
3. **Tabla de Conformidad Técnica WCAG 2.2 Nivel AAA**.
4. **Módulos de Software Accesible** (Sonificación Web Audio API, Verbalizador ARIA AST, Tokens CSS Okabe-Ito).

---

## 1. ADAPTACIONES POR PERFIL NEURODIVERGENTE

```
+====================================================================================================+
|                    ARQUITECTURA DE ADAPTACIONES NEUROINCLUSIVAS (GOALS AI LAB)                     |
+====================================================================================================+
| 🟢 TDAH (Atención y Función Ejecutiva)  | 🟣 TEA (Estructura y Procesamiento Sensorial)            |
|  • 'Modo Zen' (Focus IDE sin parásitos) |  • Layout Invariante de 3 Columnas Fijas                 |
|  • Micro-Desafíos de Código de 3 Min    |  • Cero Temporizadores de Estrés ni Pánico               |
|  • Pausas Activas Hápticas (Vibration)  |  • Modo Sensorial Bajo (Muted Palette & Silence)         |
|  • Deferred Linting (Sin interrupciones)|  • Feedback Literal en 3 Capas (Hecho-Línea-Solución)    |
+-----------------------------------------+----------------------------------------------------------+
| 🟠 DISLEXIA / DIFICULTADES DE LECTURA   | 🔵 BAJA VISIÓN Y DALTONISMO                              |
|  • Atkinson Hyperlegible + JetBrains    |  • Paleta Okabe-Ito de Contraste Extremo (> 7:1 AAA)     |
|  • Ligaduras Opcionales Desactivadas    |  • Operación 100% Keyboard-First (Sin Ratón)             |
|  • Resaltado Semántico por Ámbito       |  • Foco Visible Neón de 3px con Offset                   |
|  • Lector ARIA AST Paso a Paso          |  • Sonificación Sintáctica Web Audio de Profundidad AST  |
+====================================================================================================+
```

### 1.1. TDAH (Déficit de Atención e Hiperactividad)
- **Modo Zen (`Ctrl+Shift+Z`):** Ocultación total de barras laterales, minimapas y estímulos parásitos. Pantalla con solo 3 elementos: Directriz atómica, Editor de código activo y Botón `[ ▶ Ejecutar ]`.
- **Deferred Linting:** El linter estático no interrumpe mientras el alumno escribe; se activa tras 3 segundos de inactividad de tipeo o al presionar `Run`.
- **Pausas Activas Hápticas (DMN):** Notificaciones calibradas por edad (6 min para 6-7 años hasta 20 min para 14-15 años) con vibración suave (`navigator.vibrate([150, 100, 150])`) y ejercicios de respiración.

### 1.2. TEA (Trastorno del Espectro Autista)
- **Layout Invariante de 3 Columnas:** Columna 1 (Especificación 28%), Columna 2 (Editor 44%), Columna 3 (Terminal y Canvas 28%). Cero modales flotantes invasivos.
- **Cero Temporizadores de Estrés:** Eliminación de cuentas regresivas punitivas; el motor IRT no penaliza la duración.
- **Diagnóstico Literal en 3 Capas:**
  ```
  [ESTADO]: Error de Tipo (TypeError).
  [HECHO EXACTO]: En la línea 5, intentaste sumar un Texto ("10") con un Número (5).
  [ACCIÓN TÉCNICA]: Convierte el texto usando int("10") o el número usando str(5).
  ```

### 1.3. Dislexia y Dificultades Lectoras de Código
- **Tipografía Atkinson Hyperlegible Mono:** Distinción inequívoca de caracteres geométricamente similares (`0`/`O`, `1`/`l`/`I`, `rn`/`m`, `cl`/`d`).
- **Desactivación de Ligaduras (`calt` 0):** Los operadores complejos se muestran como caracteres separados para evitar confusión perceptiva.
- **Regla Horizontal de Lectura:** Resaltado sutil de la línea activa en el editor.

### 1.4. Baja Visión y Daltonismo
- **Paleta Okabe-Ito con Ratio $> 7:1$ (WCAG AAA):** Colores calibrados sobre fondo oscuro `#0D1117` con redundancia no cromática (negritas en palabras clave, cursivas en comentarios, comillas visibles en strings).
- **Navegación 100% Keyboard-First:** Todos los comandos son accesibles por teclado sin ratón, con foco neón visible de 3px (`#00E5FF`).
- **Sonificación Sintáctica Web Audio API:** Al mover el cursor verticalmente, un oscilador senoidal emite un tono suave proporcional a la profundidad de indentación ($f(d) = 220 \cdot 1.25^d\text{ Hz}$).

---

## 2. MATRIZ DUA 3.0: CIENCIAS DE LA COMPUTACIÓN E IA

| Principio DUA 3.0 | Aplicación en GOALS AI Lab | Impacto Neurodivergente |
| :--- | :--- | :--- |
| **I. Múltiples Formas de Compromiso** | Micro-desafíos de 3 min, selector de contextos espaciales y eliminación de relojes de pánico. | **TDAH / TEA:** Fomenta la perseverancia y previene el burnout. |
| **II. Múltiples Formas de Representación** | Paleta Okabe-Ito (>7:1), Atkinson Mono, visualizador 3D de tensores y sonificación Web Audio. | **Dislexia / Baja Visión / Daltonismo:** Garantiza la legibilidad universal. |
| **III. Múltiples Formas de Acción y Expresión** | Dualidad Bloques-Texto, navegación por teclado y andamiaje socrático literal en 3 capas. | **TEA / Discapacidad Motriz / TDAH:** Elimina barreras de entrada sintácticas. |

---

## 3. TABLA DE CONFORMIDAD TÉCNICA WCAG 2.2 NIVEL AAA

| Criterio WCAG 2.2 | Nivel | Requisito en IDE de Código e IA | Especificación Técnica |
| :--- | :---: | :--- | :--- |
| **1.4.6 Contraste Mejorado** | **AAA** | Ratio $\ge 7:1$ en todo el código y textos. | Paleta Okabe-Ito (`#E69F00`, `#56B4E9`, `#F0E442` sobre `#0D1117`). |
| **1.4.8 Presentación Visual** | **AAA** | Ancho de línea $\le 80$ caracteres, interlineado $\ge 1.85$. | `.code-editor { max-width: 80ch; line-height: 1.85; }`. |
| **2.1.1 Teclado** | **A** | 100% de operaciones ejecutables por teclado. | Atajos globales `Ctrl+Enter`, `Ctrl+Alt+E`, `Ctrl+Alt+T`, `Escape`. |
| **2.2.3 Sin Tiempo** | **AAA** | Cero límites de tiempo punitivos en retos. | Evaluación basada puramente en corrección lógica y eficiencia. |
| **2.4.7 Foco Visible** | **AA** | Indicador de foco inequívoco. | `outline: 3px solid #00E5FF; outline-offset: 3px;`. |
| **3.3.5 Ayuda Contextual** | **AAA** | Diagnósticos de error paso a paso sin ironía. | Plantilla formal `[Estado]` - `[Hecho]` - `[Solución]`. |
| **4.1.3 Mensajes de Estado** | **AA** | Anuncios ARIA para lectores de pantalla. | `<div aria-live="polite">` y `<div aria-live="assertive" role="alert">`. |
