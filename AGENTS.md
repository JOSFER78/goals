# Reglas de Proyecto: GOALS (Memoria Persistente)

## 🔴 Integridad Técnica Absoluta (Cero Ilusiones / Cero Mocks)
- **Veracidad del Origen de Datos (Data Provenance)**: Si un modelo 3D, archivo, dataset o asset es pre-existente o descargado previamente (ej. NASA, NIH, repositorios CAD), se debe declarar explícitamente su origen. Queda ESTRICTAMENTE PROHIBIDO presentarlo como si hubiera sido generado en tiempo real desde una foto.
- **Prohibición de Pipelines Fantasma**: Si una funcionalidad requiere una GPU o backend neuronal (TRELLIS, DUSt3R, TripoSR) y no está conectado físicamente, NUNCA simular capas ni inventar temporizadores (`setTimeout`) cosméticos. Se debe declarar el estado real con total honestidad.
- **Denominación Exacta**: Nunca llamar "Reconstrucción Hiperrealista" a esquemas geométricos de cajas o cilindros; denominarlo "Diagrama Técnico Paramétrico".

## 🎮 Navegación y Controles 3D Universales (Obligatorio en Toda la Web)
- **Gestos Táctiles Móviles**: Todo visor Three.js / WebGL DEBE tener habilitado `enablePan: true`, `screenSpacePanning: true` y gestos de **dos dedos** (`touches: { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }`).
- **Navegación Desktop (Barra Espaciadora + Panning)**: En toda la web, mantener pulsada la **Barra Espaciadora (`Space`)** o clic derecho/rueda central debe cambiar el cursor a `grab`/`grabbing` y activar el modo de paneo/arrastre libre (`mouseButtons.LEFT = THREE.MOUSE.PAN`), restaurándose a rotación al soltar la tecla.
