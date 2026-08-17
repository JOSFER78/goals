# 📷 INGESTA MULTIMODAL Y OCR DE DEBERES Y LIBROS DE TEXTO
## Pipeline de Visión Artificial, Segmentación Cromática de Tintas, TrOCR Infantil, LaTeX UniMERNet y Grounding en GeoGebra/SymPy (GOALS School)

**Principio Rector:** Reconocimiento de alta fidelidad de fotos de cuadernos manuscritos con letra infantil, páginas de editoriales oficiales (Santillana, Anaya, Oxford, Cambridge) y grounding semántico formal sin alucinaciones.

---

### ÍNDICE GENERAL
1. **Pipeline de Preprocesamiento de Imagen en Cliente (OpenCV / Canvas)**.
2. **Segmentación Cromática de Tintas (Lápiz, Bolígrafo Azul, Correcciones en Rojo)**.
3. **Reconocimiento Óptico de Texto e Infancia (TrOCR Fine-Tuned & UniMERNet)**.
4. **Segmentación y Aislamiento del Ejercicio Concreto**.
5. **Grounding Semántico en Motores Simbólicos y Geométricos (SymPy Wasm & GeoGebra API)**.

---

## 1. PIPELINE DE PREPROCESAMIENTO DE IMAGEN EN CLIENTE

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              PIPELINE DE VISIÓN ARTIFICIAL DE GOALS SCHOOL                             │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. CAPTURA O FOTO (Móvil / Tablet / WebCam)                                                            │
│       │                                                                                                │
│       ▼                                                                                                │
│ 2. DETECCIÓN CUADRILATERAL DE PÁGINA (Canny Edge + Douglas-Peucker)                                    │
│       │                                                                                                │
│       ▼                                                                                                │
│ 3. CORRECCIÓN DE PERSPECTIVA Y DEWARPING DE LOMO (Transformación de Homografía 2D)                    │
│       │                                                                                                │
│       ▼                                                                                                │
│ 4. BINARIZACIÓN ADAPTATIVA LOCAL (Sauvola Binarization con $k=0.18, w=25$)                             │
│       │                                                                                                │
│       ▼                                                                                                │
│ 5. EXTRACCIÓN DUAL: TEXTO IMPRESO + LETRA MANUSCRITA + FÓRMULAS LATEX                                  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. SEGMENTACIÓN CROMÁTICA DE TINTAS

En un cuaderno escolar infantil o juvenil coexisten múltiples capas de tinta:
1. **Capa 1: Rejilla o Pauta del Cuaderno (Líneas azules/grises o cuadrícula $4\times 4\text{ mm}$):** Filtro de eliminación morfológica para no interferir con los trazos de los números.
2. **Capa 2: Trazo de Grafito / Bolígrafo Azul del Alumno:** Aislado en espacio de color HSV para análisis del procedimiento manuscrito.
3. **Capa 3: Correcciones y Notas del Docente en Rojo/Verde:** Identificadas para registrar feedback previo del colegio.

---

## 3. RECONOCIMIENTO DE FÓRMULAS LATEX Y DIAGRAMAS

- **UniMERNet (Universal Mathematical Expression Recognition):** Convierte expresiones complejas (fracciones encadenadas, raíces, integrales, matrices) en código LaTeX matemático puro:
  $$\frac{3x - 5}{2} + \sqrt{16} = 14 \implies \text{Extracción AST exacta}$$
- **Detección de Figuras Geométricas y Tablas:** Segmentación de triángulos, circunferencias, diagramas de barras y tablas de contingencia mediante redes YOLOv8-DocLayNet.

---

## 4. GROUNDING SEMÁNTICO EN SYMPY WASM Y GEOGEBRA WEB API

Para garantizar que el tutor de IA **nunca alucine ni cometa un error de cálculo** en la tutoría socrática:

```typescript
// Contrato de Verificación Simbólica en Cliente (SymPy Pyodide Wasm)
export interface SymbolicProblemGrounding {
  rawProblemText: string;
  isolatedExerciseId: string;
  latexEquation?: string;
  knownVariables: Record<string, number | string>;
  targetUnknown: string;
  exactSympySolution: string;
  geogebraConstructionCommands?: string[];
  pedagogicalHints: string[];
}
```

- **GeoGebra Web API:** Si el ejercicio es de geometría o funciones, el sistema genera automáticamente el applet interactivo con los vértices, rectas o curvas del problema para que el estudiante interactúe con el modelo visualmente.
- **SymPy Wasm:** Calcula la solución analítica exacta en local ($< 15\text{ ms}$) y genera el árbol de pasos lógicos intermedios para que el tutor socrático guíe al alumno sin revelar el número final.
