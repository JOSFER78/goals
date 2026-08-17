# 🧠 NEUROEDUCACIÓN, FUNCIONES EJECUTIVAS Y CARGA COGNITIVA EN PROGRAMACIÓN E IA
## GOALS AI Lab — Fundamentos Cognitivos, Psicológicos y Didácticos (6 a 15 Años)

**División:** Ciencias Cognitivas y Didáctica de la Computación  
**Población:** 6 a 15 años (5 tramos evolutivos)  
**Marco Teórico:** Funciones Ejecutivas (Diamond / Miyake), Carga Cognitiva (Sweller / Paas), Chunks de Cowan ($k \approx 2-4$), Máquina Nocional (du Boulay / Sorva), Esquemas de Soloway, Codificación Dual (Paivio / Mayer).

---

### ÍNDICE GENERAL
1. **Maduración de las Funciones Ejecutivas en Programación** (dlPFC, dACC, rIFG, Control Inhibitorio, Flexibilidad y Memoria de Trabajo).
2. **Teoría de la Carga Cognitiva de Sweller en Código e IA** (Carga Intrínseca, Extrínseca, Germánica, Aislamiento de Elementos, Worked Examples y Faded-Guidance).
3. **Psicología de la Depuración (*Debugging*) y Resiliencia Cognitiva** (Neurobiología del error, Desescalada Amigdalina, Protocolo Socrático GOALS en 5 Fases).
4. **Teoría de la Codificación Dual (Paivio & Mayer) para Tensores y Auto-Atención** (Isomorfismo Simbólico-Visoespacial, Geometría 3D de Tensores, Vaswani 2017 decodificado).
5. **Tabla Maestra de Pautas de Implementación Técnica y Didáctica**.

---

## 1. MADURACIÓN DE LAS FUNCIONES EJECUTIVAS EN EL APRENDIZAJE COMPUTACIONAL

```
       ┌────────────────────────────────────────────────────────┐
       │             CÓRTEX PREFRONTAL (PFC) & FE               │
       └──────────────────────────┬─────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ CONTROL          │    │ FLEXIBILIDAD     │    │ MEMORIA DE       │
│ INHIBITORIO      │    │ COGNITIVA        │    │ TRABAJO          │
│ (dACC / rIFG)    │    │ (dlPFC / FPN)    │    │ (dlPFC / IPS)    │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         ▼                       ▼                       ▼
• Frena "Code & Pray"   • Máquina Nocional      • Traza mental de RAM
• Inhibe semántica      • Alternancia de tipos  • Call Stack recursivo
  matemática previa       (Lista ↔ Hash Map)    • Anidamiento de bucles
```

### 1.1. Neurobiología del Córtex Prefrontal
1. **Córtex Prefrontal Dorsolateral (dlPFC):** Memoria de trabajo operativa, manipulación de variables y planificación multietapa. Mielinización prolongada hasta los 25 años.
2. **Córtex Cingulado Anterior dorsal (dACC):** Detección de conflictos lógicos, monitorización de errores sintácticos y regulación del esfuerzo atencional.
3. **Giro Frontal Inferior derecho (rIFG) y pre-SMA:** Inhibición conductual y supresión de respuestas impulsivas.
4. **Córtex Orbitofrontal (OFC) y Amígdala:** Tolerancia a la frustración ante el fallo en tiempo de ejecución (*runtime error*) y perseverancia.

### 1.2. Control Inhibitorio
- **Interferencia Semántica Matemática:** En matemáticas, `=` denota equivalencia simétrica ($a = b \iff b = a$). En programación imperativa, `=` denota asignación asimétrica y sobrescritura de memoria RAM ($x \leftarrow x + 1$). Requiere supresión activa en dACC y rIFG.
- **Inhibición de la Impulsividad Ejecutiva:** Supresión del ensayo-error ciego (*"code and pray"*). GOALS introduce un retardo forzado de 3 a 5 segundos con preguntas socráticas antes de permitir la reejecución tras un fallo.

### 1.3. Flexibilidad Cognitiva y Máquina Nocional (*Notional Machine*)
Permite alternar entre la perspectiva del usuario (diseño de alto nivel) y el modelo de ejecución paso a paso del ordenador (la Máquina Nocional de du Boulay / Sorva).

### 1.4. Matriz Evolutiva de Neurodesarrollo y Hitos Computacionales

| Tramo de Edad | Estado Neurobiológico del PFC | Capacidad de Memoria de Trabajo ($k$ Chunks) | Construcciones Algorítmicas Óptimas | Construcciones Desaconsejadas (Riesgo de Sobrecarga) |
| :--- | :--- | :--- | :--- | :--- |
| **6–7 años (T1)** | Mielinización inicial frontoestriatal. Inhibición dependiente de contexto perceptual. | $2 \pm 1$ chunks | Secuencias lineales discretas, bucles fijos tangibles (`REPEAT N`), robótica física en cuadrícula $5 \times 5$. | Variables mutables en memoria invisible, bucles condicionales anidados, sintaxis de texto. |
| **8–9 años (T2)** | Maduración progresiva de dACC y pre-SMA. Coordinación de 2 dimensiones de reglas. | $3 \pm 1$ chunks | Bloques visuales, máquinas de estados finitos (FSM), variables de estado simples, eventos concurrentes. | Ámbitos de variables (*scoping*), recursividad, estructuras anidadas complejas. |
| **10–11 años (T3)** | Conectividad frontoparietal acelerada. Emergencia del razonamiento formal. | $3-4$ chunks estructurados | Texto real (Python 3.12 Wasm), listas, indexación base 0, funciones con parámetros/retorno, $O(N)$ vs $O(\log N)$. | Punteros explícitos, paso por referencia complejo, concurrencia asíncrona multihilo. |
| **12–13 años (T4)** | Reorganización sináptica puberal. Abstracción algebraica y vectores. | $4 \pm 1$ chunks | Machine Learning clásico (KNN, OLS, Árboles), vectores 1D/2D, funciones puras, matrices de confusión. | Derivación de gradientes tensores multidimensionales sin andamiaje visual. |
| **14–15 años (T5)** | Eficiencia sináptica avanzada en dlPFC. Metaprogramación y modelado tensorial. | $4-5$ chunks jerárquicos | Tensores N-D, Descenso de Gradiente, Mecanismos de Auto-Atención (*Transformers*), Embeddings, RAG. | Implementaciones crípticas sin tipado estricto o sin abstracción de capas. |

---

## 2. TEORÍA DE LA CARGA COGNITIVA DE SWELLER EN PROGRAMACIÓN E IA

$$\text{Carga Total} = \text{Carga Intrínseca} + \text{Carga Extrínseca} + \text{Carga Germánica} \le \text{Capacidad } WM$$

```
CAPACIDAD TOTAL DE LA MEMORIA DE TRABAJO (WM Capacity: 2-4 Chunks de Cowan)
┌──────────────────────────────┬─────────────────────────────┬──────────────────────────────┐
│  CARGA EXTRÍNSECA (RUIDO)    │  CARGA INTRÍNSECA (LÓGICA)  │  CARGA GERMÁNICA (ESQUEMAS)  │
│  • Sintaxis críptica         │  • Interactividad de        │  • Consolidación de          │
│  • Errores incomprensibles   │    elementos inherente      │    esquemas reutilizables    │
│  • Split-Attention en IDE    │  • Relación entre variables │  • Abstracción algorítmica   │
│  ══════════════════════════  │  ══════════════════════════ │  ══════════════════════════  │
│  ► MINIMIZAR A CERO          │  ► GESTIONAR Y ANDAMIAR     │  ► MAXIMIZAR Y PROMOVER      │
└──────────────────────────────┴─────────────────────────────┴──────────────────────────────┘
```

### 2.1. Carga Intrínseca e Interactividad de Elementos
Un algoritmo de ordenación como Bubble Sort exige manipular 7 elementos simultáneamente ($A[i]$, $A[i+1]$, condición, variable temporal de swap, puntero interno, contador externo, bandera swapped), colapsando la memoria de trabajo infantil ($k \approx 2-4$) si no se aplica la técnica de **Aislamiento de Elementos** (*Isolated-Elements Effect*):
1. **Fase 1:** Intercambio de dos variables aisladas (`temp = a; a = b; b = temp`).
2. **Fase 2:** Bucle simple recorriendo una lista (`for i in range(len(lista)-1)`).
3. **Fase 3:** Integración del algoritmo completo.

### 2.2. Modelo de Ejemplos Resueltos y Andamiaje Desvanecido (*Faded Guidance*)
1. **Ejemplo Resuelto Completo (*Worked Example*):** El alumno analiza una solución óptima comentada paso a paso (cero carga extrínseca de generación).
2. **Problema de Completación (*Completion Problem*):** El alumno recibe el 80% resuelto y completa la línea crítica.
3. **Andamiaje Hacia Atrás (*Backward Fading*):** Retirada progresiva de plantillas hasta la resolución autónoma.

### 2.3. Carga Extrínseca: Prevención del *Syntax Shock*
- **Eliminación del Split-Attention:** Salidas de consola, trazas de depuración y variables renderizadas *inline* junto al código.
- **Vista Dual Sincronizada:** Bloques visuales y código Python 3.12 reflejados en tiempo real de forma bidireccional.
- **Frame-Based Editing:** Plantillas estructurales completas con campos autocompletables para evitar indentaciones rotas.

### 2.4. Carga Germánica y Esquemas de Soloway
Consolidación de planes algorítmicos estándar en la memoria a largo plazo (Plan de Acumulación, Plan de Búsqueda de Extremo, Plan de Bandera). Una vez automatizados, ocupan $1\text{ chunk}$ en memoria de trabajo.

---

## 3. PSICOLOGÍA DE LA DEPURACIÓN (*DEBUGGING*) Y RESILIENCIA COGNITIVA

```
                               NEUROBIOLOGÍA ANTE EL ERROR DE CÓDIGO
                               
                  ┌───────────────────────────────────────────────┐
                  │       ERROR DE EJECUCIÓN (Runtime Crash)      │
                  └───────────────────────┬───────────────────────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
       ┌────────────────────────┐                  ┌────────────────────────┐
       │   RUTA AMIGDALINA      │                  │  RUTA SOCRÁTICA GOALS  │
       │   (Desregulación)      │                  │  (Metacognición dlPFC) │
       ├────────────────────────┤                  ├────────────────────────┤
       │ • Disparo de Cortisol  │                  │ • Desescalada y Pausa  │
       │ • Desconexión dlPFC    │                  │ • Modelo Mental vs Real│
       │ • "Code & Pray" / Bloq │                  │ • Aislamiento Binario  │
       └────────────────────────┘                  └────────────────────────┘
```

### 3.1. Protocolo de Depuración Socrática GOALS en 5 Fases
1. **Desescalada Afectiva:** Pausa obligada de 3 segundos, respiración y reseteo del foco atencional.
2. **Explicitación del Modelo Mental:** Verbalización obligatoria: *"¿Qué esperabas que ocurriera frente a qué ha sucedido exactamente?"*.
3. **Aislamiento y Localización:** Búsqueda binaria del fallo para acotar el bloque causante.
4. **Rastreabilidad Instrumental:** Inspección de valores de variables y ejecución paso a paso.
5. **Verificación y Post-Mortem:** Formulación de hipótesis formal, reparación y test unitario.

---

## 4. TEORÍA DE LA CODIFICACIÓN DUAL (PAIVIO & MAYER) EN APRENDIZAJE DE TENSORES E IA

$$\text{Notación Formal Matemática} \iff \text{Código en Cliente} \iff \text{Geometría Espacial Dinámica}$$

| Rango Tensorial | Notación Formal | Código en Cliente (Pyodide/WebGPU) | Representación Visoespacial Dinámica | Metáfora Cognitiva Anclada |
| :--- | :--- | :--- | :--- | :--- |
| **0D (Escalar)** | $x \in \mathbb{R}$ | `x = 42.0` | Punto geométrico adimensional con indicador de magnitud. | Una lectura de temperatura de sensor. |
| **1D (Vector)** | $\mathbf{x} \in \mathbb{R}^{D}$ | `x = torch.tensor([0.2, 0.8, -0.5])` | Flecha orientada en $\mathbb{R}^3$ o tira lineal de celdas. | Coordenadas de un rover o embedding de 1 palabra. |
| **2D (Matriz)** | $\mathbf{X} \in \mathbb{R}^{M \times N}$ | `X = torch.zeros((4, 4))` | Rejilla ortogonal 2D con codificación cromática (Heatmap). | Hoja de puntuaciones o imagen en escala de grises. |
| **3D (Volumen)** | $\mathcal{X} \in \mathbb{R}^{C \times H \times W}$ | `X = torch.randn((3, 224, 224))` | Prisma cúbico con 3 capas superpuestas (Canales R, G, B). | Sándwich de transparencias coloreadas. |
| **4D (Batch)** | $\mathcal{B} \in \mathbb{R}^{B \times C \times H \times W}$ | `B = torch.randn((32, 3, 224, 224))` | Fila de $B$ prismas cúbicos en cinta transportadora temporal. | Álbum secuencial de fotogramas de telescopio. |

### 4.1. Decodificación Visual-Simbólica de la Auto-Atención (Vaswani 2017)
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$$
- **Acto 1 (Similitud):** Matriz $N \times N$ donde el cruce de dos palabras ilumina su afinidad semántica ($Q K^T$).
- **Acto 2 (Foco):** Cada fila se normaliza en barras de probabilidad ($0-100\%$) mediante $\text{softmax}$.
- **Acto 3 (Contexto):** Multiplicación por $V$ donde el nuevo embedding es la suma ponderada cromática de todos los tokens.

---

## 5. TABLA MAESTRA DE PAUTAS DE IMPLEMENTACIÓN

| Componente | Requisito Neuroeducativo | Implementación en GOALS AI Lab | Métrica de Validación |
| :--- | :--- | :--- | :--- |
| **Editor de Código** | Eliminar Carga Extrínseca por *Split-Attention*. | Editor Monaco/Wasm con salida *inline* y evaluación de variables en tiempo real ($<50\text{ ms}$). | Tasa de fijaciones sacádicas dispersas reducida en $>60\%$. |
| **Transición Bloques-Texto** | Mitigar el *Syntax Shock* y sobrecarga de $WM$. | Dual-View interactivo bidireccional y auto-cierre de estructuras indentadas. | Reducción del $85\%$ en errores de sintaxis tipo `IndentationError`. |
| **Depuración (*Debugging*)** | Desescalar el secuestro amigdalino ante el fallo. | Interfaz de diagnóstico socrático con "Rubber Duck" guiado y despenalización de puntos. | Tiempo medio de recuperación activa post-error $<45\text{ s}$. |
| **Progresión Algorítmica** | Respetar el límite de $2-4$ chunks de Cowan. | Secuencia: Ejemplo Resuelto $\to$ Completación $\to$ Fading $\to$ Creación Autónoma. | Incremento en tasa de transferencia a nuevos problemas ($d \text{ de Cohen} > 0.8$). |
| **Tensores e IA** | Codificación Dual profunda de dimensiones tensoriales. | Visualizador WebGPU 3D acoplado en tiempo real al `tensor.shape` de Pyodide/ONNX. | Precisión diagnóstica en operaciones de *Broadcasting* y *Reshape* $>90\%$. |
