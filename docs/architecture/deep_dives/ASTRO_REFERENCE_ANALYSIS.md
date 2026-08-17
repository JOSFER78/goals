# Análisis Comparativo: AstroLingo Referencia (Golden Master) vs Astro GOALS

> **Fecha del Informe:** Agosto 2026  
> **Propósito:** Comparación exhaustiva entre la referencia funcional original (*AstroLingo HTML/Web Live*) y la implementación React integrada en el proyecto GOALS (*astrolingo/src*).

---

## 1. Tabla Comparativa General

| Dimensión | AstroLingo Original (Golden Master) | Astro GOALS Actual (React Vite) | Estado de Paridad / Mejora |
| :--- | :--- | :--- | :--- |
| **Arquitectura** | Monolito HTML5 estático en 1 archivo (171 KB) con scripts CDN. | Componentes modulares React 18 + TypeScript + Vite + Tailwind. | 🟢 **Mejorado** (Mayor mantenibilidad y modularidad). |
| **Navegación** | Manipulación directa del DOM (`showTab`, `classList.add/remove`). | Estado reactivo (`tab`, `subView` en `App.tsx`) con confirmación de salida. | 🟢 **Mejorado** (Cero flicker, transiciones suaves). |
| **Experiencia de Usuario (UX)** | Diseño glassmorphic oscuro en HTML/CSS plano con modales sencillos. | UI reactiva moderna con Lucide Icons, animaciones micro-interactivas y Toasts. | 🟢 **Mejorado** (Mayor fluidez visual y feedback). |
| **Gamificación** | Contador de XP simple y racha básica en `localStorage`. | `ProgressContext` completo: XP, Racha calculada, Estrellas (1-3), Desbloqueo progresivo y Log de Evoluciones. | 🟢 **Mejorado** (Gamificación enriquecida). |
| **Aprendizaje** | Pasos teóricos y preguntas de selección múltiple simples. | Pasos con "Dato Wow", "Actualidad 2026", mini-visores 3D integrados y preguntas tipo ordenación. | 🟢 **Mejorado** (Mayor rigor pedagógico y variedad). |
| **Exploración 3D** | Escena Three.js única con controles de órbita y panel estático. | `SpaceLabView` con 8 niveles de magnitud astronómica, shaders de atmósfera y ajustes gráficos admin. | 🟢 **Mejorado** (Calidad visual y profundidad científica superior). |
| **Persistencia** | Firebase SDK compat (v9/v10 inline) + LocalStorage. | Firebase SDK Modular v10 con Auth state listener, Firestore merge y fallback transparente a LocalStorage. | 🟢 **Paridad Alcanzada**. |
| **Distribución Nativa** | Enlace estático a APK. | Descarga directa de APK ZIP + Botón de compartir nativo por WhatsApp. | 🟢 **Mejorado**. |

---

## 2. Análisis Detallado por Dimensión

### A. Funcionalidades
- **Original:** Presentaba las pestañas principales en un solo documento con renderizado manual de cadenas HTML.
- **GOALS Astro:** Separa limpiamente las pantallas en vistas independientes (`LearnView`, `LessonStepView`, `TestView`, `RetosView`, `SpaceLabView`), manteniendo un control estricto del estado global a través de React Context.

### B. Navegación
- **Original:** Cambiar de sección ocultaba divs con la clase `.hidden`. Al refrescar la página se perdía la vista concreta y se volvía al estado inicial.
- **GOALS Astro:** La navegación está centralizada en `App.tsx`. Cuenta con guardas de navegación: si el usuario intenta salir de una lección o test a mitad de proceso, el sistema solicita confirmación para evitar la pérdida de respuestas en curso.

### C. UX / UI
- **Original:** Utilizaba Tailwind por CDN y estilos inyectados en la cabecera HTML. Buen contraste pero componentes rígidos.
- **GOALS Astro:** Mantiene la estética estelar oscura (slate-950, micro-estrellas generadas por Canvas/CSS), pero añade:
  - Tarjeta de bienvenida inteligente (muestra el estado del guardado: Nube vs Local).
  - Indicadores visuales de dificultad y estado de desbloqueo (candados animables, checks de verificación).
  - Componente global `Toast.tsx` para feedback inmediato cuando el usuario desbloquea un test o consigue estrellas.

### D. Gamificación
- **Original:** Registraba aciertos y sumaba XP básico.
- **GOALS Astro:**
  - **Racha Diaria:** Algoritmo en `streak.ts` que valida si la actividad ocurrió hoy, ayer (mantiene la racha) o hace más de 48 horas (la reinicia automáticamente).
  - **Sistema de Estrellas:** Basado en el porcentaje del test (≥99% = 3 estrellas, ≥60% = 2 estrellas, <60% = 1 estrella).
  - **Desbloqueo Secuencial:** La lección N sólo es accesible si se ha superado el test de la lección N-1.
  - **Registro de Evolución:** Historial completo navegable desde el modal de Perfil con marca temporal y desglose de XP obtenido.

### E. Aprendizaje (Learning Engine)
- **Original:** Texto estándar explicativo.
- **GOALS Astro:**
  - Estructura pedagógica enriquecida por cada lección:
    - **Teoría Principal:** Exposición clara del fenómeno.
    - **Dato Wow:** Curiosidad llamativa para enganchar al estudiante.
    - **Actualidad 2026:** Datos recientes (Artemis II amerizando en abril de 2026, Starship Raptor 3, James Webb).
    - **Mini 3D Viewer:** Visor Three.js incrustado directamente dentro de la tarjeta de la lección.
  - **Tipos de Pregunta:**
    - `choice`: Elección múltiple tradicional.
    - `order`: Arrastrar o pulsar para ordenar eventos cronológicos (ej: orden de misiones lunares).

### F. Exploración 3D (Space Lab)
- **Original:** Un único mundo 3D interactivo basándose en un render sencillo de Three.js.
- **GOALS Astro:**
  - `SpaceLabView.tsx` incluye 8 escalas de magnitud astronómicas:
    1. *Tierra y Luna*
    2. *Sistema Solar*
    3. *Exoplanetas*
    4. *Estrellas Comparadas*
    5. *Vía Láctea*
    6. *Grupo Local*
    7. *Universo Profundo*
    8. *Agujeros Negros*
  - Control de iluminación realista (Sun Light, Ambient Light, Glow de atmósfera procedimental).
  - Modal de Preferencias Gráficas accesible desde el panel Admin para ajustar resolución de texturas, sombras y velocidad de rotación.

### G. Persistencia y Nube
- **Original:** Inicialización síncrona de Firebase en scripts inline.
- **GOALS Astro:** Inicializador asíncrono robusto en `config/firebase.ts`. Si la conexión con Firebase falla o la API Key no es válida, la aplicación conmuta inmediatamente a modo offline/local sin estrellarse (`fallback` transparente a `localStorage`).

---

## 3. Conclusión y Recomendación para la Fase 1

La implementación actual en `astrolingo/src` **ha superado con éxito la funcionalidad y calidad del prototipo de referencia (Golden Master)**. 

No se requiere reescribir la lógica de Astro. Para la **Fase 1 (Estabilizar GOALS)**, el plan de trabajo debe centrarse en:
1. Crear el contenedor raíz de **GOALS** en el nivel superior de la aplicación.
2. Extraer el sistema de **Autenticación** y **Perfil** de Astro para que sea el motor común de **GOALS**.
3. Integrar la experiencia Astro dentro del router de GOALS como el primer módulo seleccionable de la plataforma.
