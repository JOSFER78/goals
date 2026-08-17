# 🤖 00. MASTER PLAN CURRICULAR: GOALS AI LAB (6 A 15 AÑOS)
## Plan Maestro de Ciencias de la Computación, Algoritmia, Modelos Neuronales, Inteligencia Artificial y Ética Digital

**Proyecto:** GOALS AI Lab  
**Rango de Edad:** 6 a 15 años (Educación Primaria y Educación Secundaria Obligatoria / K–10)  
**Marco Teórico y Pedagógico:** Construccionismo de Seymour Papert, Taxonomía de Bloom para la Era Digital, Estándares CSTA K-12, ACM Computer Science Guidelines, Marco de Competencias de IA para Estudiantes de la UNESCO (2024), EU AI Act (Reglamento UE 2024/1689) y LOMLOE (RD 157/2022 y RD 217/2022).  
**Principio Técnico Rector:** **100% CERO MOCKS / CERO DATOS FICTICIOS**. Toda la computación se ejecuta en el navegador del alumno mediante WebAssembly (Pyodide Python 3.12), WebGPU (TensorFlow.js / ONNX Runtime Web) y Transformers.js en cliente.

---

## 🧭 1. FILOSOFÍA PEDAGÓGICA Y MAPA EN ESPIRAL (DE UNPLUGGED A TRANSFORMERS)

El currículo de GOALS AI Lab no enseña "herramientas efímeras" ni "recetas de usuario pasivo", sino **las estructuras computacionales profundas y las matemáticas subyacentes que gobiernan el software y la inteligencia artificial moderna**.

```
+----------------------------------------------------------------------------------------------------+
|                         MAPA DE PROGRESIÓN EN ESPIRAL (GOALS AI LAB)                               |
+====================================================================================================+
| 🟢 TRAMO 1 (6–7 años): COMPUTACIÓN DESCONECTADA & SINTONICIDAD CORPORAL                            |
|    • Algoritmos kinestésicos en cuadrícula 5x5, secuenciación determinista, detección de colisión. |
|    • Concepto de 'Bug': la máquina no se equivoca por maldad, sigue órdenes literales erróneas.    |
+----------------------------------------------------------------------------------------------------+
| 🟡 TRAMO 2 (8–9 años): BLOQUES VISUALES & MÁQUINAS DE ESTADO (FSM)                                 |
|    • Programación por eventos, variables de estado, bucles condicionales (`while`, `repeat until`). |
|    • Autómatas finitos (FSM) para robótica y clasificación sensorial de materiales.                |
+----------------------------------------------------------------------------------------------------+
| 🟠 TRAMO 3 (10–11 años): TEXTO REAL (PYTHON 3.12 WASM) & COMPLEJIDAD ASINTÓTICA                    |
|    • Transición de bloques a Python tipado: listas, diccionarios hash map en O(1), funciones puras.|
|    • Duelo algorítmico: Búsqueda Lineal O(N) vs Búsqueda Binaria O(log N) en 1.000.000 de datos.   |
|    • Algoritmos de ordenación: Bubble Sort O(N^2) vs Merge Sort recursivo O(N log N).              |
+----------------------------------------------------------------------------------------------------+
| 🔵 TRAMO 4 (12–13 años): MACHINE LEARNING CLÁSICO & ÁLGEBRA VECTORIAL EN CLIENTE                   |
|    • Aprendizaje supervisado vs no supervisado, regresión lineal OLS multivariable.                |
|    • Clasificador K-Nearest Neighbors (KNN) con asteroides reales de la NASA (NeoWs).              |
|    • Árboles de decisión y pureza de Gini. Métricas de equidad algorítmica y sesgo (GIGO).        |
+----------------------------------------------------------------------------------------------------+
| 🟣 TRAMO 5 (14–15 años): DEEP LEARNING, TRANSFORMERS (VASWANI 2017) & GOBERNANZA                   |
|    • Tensores N-D, Descenso de Gradiente y Backpropagation mediante regla de la cadena en WebGPU.  |
|    • Auto-Atención Multicabezal: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V.                |
|    • Modelos SLM en local, Embeddings semánticos 384D, RAG Vectorial y cumplimiento del EU AI Act. |
+----------------------------------------------------------------------------------------------------+
```

---

## 📊 2. ESTRUCTURA CURRICULAR DETALLADA: 5 TRAMOS DE EDAD (35 UNIDADES TRONCALES)

---

### 🟢 TRAMO 1: 6 A 7 AÑOS (1.º Y 2.º EDUCACIÓN PRIMARIA / GRADES 1–2 / KS1)
**Objetivo Central:** Desarrollar el pensamiento algorítmico kinestésico, la lateralidad espacial, el concepto de paso discreto y la resiliencia ante el error (*debugging* lúdico sin frustración).

#### Unidad 1.1: El Robot Humano y la Cuadrícula del Tesoro (Unplugged)
- **Conceptos Computacionales:** Algoritmo secuencial, estado inicial ($S_0$), estado final objetivo ($S_f$), conjunto cerrado de primitivas directas: `AVANZAR`, `GIRAR_IZQ_90`, `GIRAR_DER_90`.
- **Experiencia de Aprendizaje:** El alumno asume el rol de "Programador" o "Robot". Sobre un tapete de $5 \times 5$, debe guiar a un avatar físico para recoger muestras minerales evitando charcos de lava.
- **Rigor Matemático/Lógico:** Grafo dirigido plano en $\mathbb{Z}^2$. No ambigüedad sintáctica: si el robot recibe "camina un poco", entra en estado de `CRASH: Comando Indefinido`.
- **Criterio de Evaluación LOMLOE / CSTA:** CSTA `1A-AP-08`. Descompone un trayecto en una serie ordenada de 3 a 5 instrucciones elementales.

#### Unidad 1.2: El Poder de la Repetición: Bucles Fijos (`REPEAT N`)
- **Conceptos Computacionales:** Bucle de iteración determinada, ahorro de memoria de código (*code compactness*), patrones repetitivos en la naturaleza y en la danza.
- **Experiencia de Aprendizaje:** Dibujar un cuadrado o una escalera. En lugar de escribir 8 líneas de código, introducir la tarjeta multiplicadora: `REPEAT 4 [ AVANZAR, GIRAR_DER ]`.
- **Desmitificación / Misconception:** "El bucle no hace que el robot vaya más rápido en el tiempo; reduce el número de instrucciones almacenadas en la memoria".

#### Unidad 1.3: La Bifurcación Mágica: Sensores y Decisiones (`IF / ELSE`)
- **Conceptos Computacionales:** Condicional booleano simple, operador de comparación con el entorno (`SI hay obstáculo delante ENTONCES... SI NO...`).
- **Experiencia de Aprendizaje:** Conducir un vehículo explorador marciano que esquiva rocas de forma autónoma.
- **Conexión con el Mundo Real:** Sensores de puertas automáticas y aspiradoras robot.

#### Unidad 1.4: Cazadores de 'Bugs': La Máquina no se Equivoca, Cumple lo Escrito
- **Conceptos Computacionales:** Depuración (*Debugging*), lectura paso a paso (*Dry Run / Traza de Ejecución*).
- **Experiencia de Aprendizaje:** Se entrega al alumno un programa "estropeado" donde el robot choca contra la pared en el paso 3. El alumno debe rastrear con el dedo instrucción por instrucción hasta encontrar la orden incorrecta y sustituirla.
- **Educación Socioemocional:** Despenalización absoluta del fallo; el error es una discrepancia lógica detectable y reparable.

#### Unidad 1.5: ¿Qué es una Máquina Inteligente? Seres Vivos vs Autómatas
- **Conceptos de IA:** Diferencia entre un objeto inerte, un electrodoméstico programado mecánicamente y un sistema que aprende de ejemplos.
- **Experiencia de Aprendizaje:** Clasificación de tarjetas: ¿Una tostadora es inteligente? ¿Un perro es inteligente? ¿Un coche autónomo es inteligente?

---

### 🟡 TRAMO 2: 8 A 9 AÑOS (3.º Y 4.º EDUCACIÓN PRIMARIA / GRADES 3–4 / KS2 LOWER)
**Objetivo Central:** Dominar la programación visual por bloques libre de errores de sintaxis, la concurrencia basada en eventos, variables de estado numéricas y autómatas finitos.

#### Unidad 2.1: Programación por Eventos y Escenas Interactivas (Blockly / Scratch)
- **Conceptos Computacionales:** Paradigma *Event-Driven*, escuchadores de eventos (`Al presionar tecla Espacio`, `Al hacer clic en actor`, `Al recibir mensaje broadcast`).
- **Experiencia de Aprendizaje:** Creación de un ecosistema marino donde los peces huyen si el cursor del ratón (tiburón) se acerca a menos de 50 píxeles.
- **Criterio CSTA:** `1B-AP-10`. Crea programas que responden a múltiples eventos iniciados por el usuario y señales del sistema.

#### Unidad 2.2: La Caja de los Secretos: Variables de Memoria y Puntuación
- **Conceptos Computacionales:** Variable como contenedor nombrado en memoria RAM, tipo de dato entero/cadena, asignación destructiva ($x \leftarrow x + 1$), inicialización obligatoria al arrancar ($x \leftarrow 0$).
- **Experiencia de Aprendizaje:** Videojuego de recolección de residuos espaciales con contador de vidas (`vidas = 3`), temporizador regresivo (`tiempo = 30`) y marcador de puntuación (`score`).
- **Misconception:** "La ecuación $x = x + 1$ no es una igualdad matemática imposible; es una instrucción imperativa de sobrescritura de memoria".

#### Unidad 2.3: Autómatas Finitos (FSM) y Sensores Físicos
- **Conceptos Computacionales:** Máquina de Estados Finitos (*Finite State Machine - FSM*), estados discretos (`IDLE`, `ESCANEANDO`, `CLASIFICANDO`, `ALERTA`), tabla de transiciones activada por sensores analógicos (peso, proximidad, reflectancia óptica).
- **Experiencia de Aprendizaje:** Diseñar el cerebro digital de una papelera inteligente de reciclaje que clasifica plástico, vidrio, metal y orgánico según las lecturas de los sensores.

#### Unidad 2.4: Bucles Condicionales y Lógica Booleana Compuesta (`AND`, `OR`, `NOT`)
- **Conceptos Computacionales:** Bucles no determinados (`WHILE condición DO`, `REPEAT UNTIL condición`), combinación de predicados con operadores lógicos booleanos.
- **Experiencia de Aprendizaje:** Control de aterrizaje lunar: `REPEAT UNTIL altitud == 0 OR combustible == 0 [ SI velocidad > 5 AND combustible > 0 ENTONCES encender_retrocohete ]`.

#### Unidad 2.5: Teachable Machine y Visión por Computador Elemental
- **Conceptos de IA:** Entrenamiento supervisado mediante cámara web: recolección de 30 fotos de "Mano Abierta" (Clase 1) y 30 fotos de "Mano Cerrada" (Clase 2).
- **Experiencia de Aprendizaje:** Entrenar un modelo de clasificación de gestos en tiempo real para encender una bombilla virtual o controlar un videojuego sin tocar el teclado.
- **Reflexión Ética:** ¿Qué ocurre si entrenamos el modelo solo con una persona y luego lo prueba un compañero con diferente tono de piel o gafas? Descubrimiento empírico del **sesgo en los datos de entrenamiento**.

---

### 🟠 TRAMO 3: 10 A 11 AÑOS (5.º Y 6.º EDUCACIÓN PRIMARIA / GRADES 5–6 / KS2 UPPER)
**Objetivo Central:** Realizar la transición fluida de bloques a texto formal en **Python 3.12 WebAssembly (Pyodide)**, dominar estructuras de datos compuestas (listas, diccionarios hash), modularización con funciones puras y análisis de complejidad asintótica $\mathcal{O}(n)$.

#### Unidad 3.1: Hola Python: Sintaxis Rigurosa, Tipado y Sangría Estricta
- **Conceptos Computacionales:** Intérprete Wasm en cliente, tipado dinámico estricto (`int`, `float`, `str`, `bool`), asignación, bloques de código delimitados por indentación (4 espacios), comentarios y mensajes de error del compilador.
- **Laboratorio:** Creación de un conversor universal de unidades astronómicas (UA a kilómetros, años luz a metros) con validación de entradas numéricas y excepciones (`try / except ValueError`).

#### Unidad 3.2: Estructuras de Datos I: Listas Dinámicas e Indexación
- **Conceptos Computacionales:** Arrays dinámicos en memoria contigua, indexación base cero (`arr[0]`), longitud `len()`, operaciones de mutación (`append`, `pop`, `insert`), recorrido secuencial con bucles `for elemento in lista:` y slicing (`lista[1:4]`).
- **Laboratorio:** Procesamiento de una serie temporal de temperaturas medias de Marte capturadas por el rover Perseverance (cálculo de media, máxima, mínima y filtrado de anomalías térmicas).

#### Unidad 3.3: Estructuras de Datos II: Diccionarios Hash Map en $\mathcal{O}(1)$
- **Conceptos Computacionales:** Colecciones de pares clave-valor (`dict`), tablas hash, función de dispersión, tiempo de acceso constante promedio $\mathcal{O}(1)$ frente a búsqueda secuencial $\mathcal{O}(n)$.
- **Laboratorio:** Construcción del catálogo estelar del telescopio espacial: base de datos de exoplanetas indexada por nombre (*Kepler-452b*, *Proxima Centauri b*, *TRAPPIST-1e*) con propiedades físicas asociadas.

#### Unidad 3.4: Modularización y Funciones: Ámbito de Variables (*Scope*) y Recursión
- **Conceptos Computacionales:** Abstracción procedimental, firma de funciones (`def calcular_orbita(radio: float, masa: float) -> float:`), parámetros formales vs argumentos reales, valores de retorno (`return`), variables locales vs globales, funciones recursivas elementales (cálculo de factorial y sucesión de Fibonacci).
- **Laboratorio:** Diseñador modular de trayectorias de cohetes espaciales descompuesto en 4 funciones independientes testeadas unitariamente.

#### Unidad 3.5: Duelo Algorítmico y Complejidad Asintótica ($\mathcal{O}(n)$ vs $\mathcal{O}(\log n)$)
- **Conceptos Computacionales:** Notación Big-O, conteo riguroso de operaciones elementales y comparaciones en el peor caso.
- **Laboratorio de Código Real:**
  - Búsqueda Lineal ($\mathcal{O}(n)$) vs Búsqueda Binaria ($\mathcal{O}(\log n)$) sobre un millón de identificadores satelitales ordenados.
  - Conteo empírico de comparaciones: 1.000.000 vs 20 comparaciones. Visualización en microsegundos reales en el navegador.

#### Unidad 3.6: Algoritmos de Ordenación: Del Caos al Orden ($\mathcal{O}(n^2)$ vs $\mathcal{O}(n \log n)$)
- **Conceptos Computacionales:** Algoritmos comparativos in-place vs divide y vencerás: Bubble Sort ($\mathcal{O}(n^2)$) frente a Merge Sort recursivo ($\mathcal{O}(n \log n)$).
- **Laboratorio:** Simulación de un radar de control de tráfico aéreo espacial: ordenación de 10.000 fragmentos de basura orbital por proximidad a la Estación Espacial Internacional con instrumentación de accesos a memoria.

---

### 🔵 TRAMO 4: 12 A 13 AÑOS (1.º Y 2.º ESO / GRADES 7–8 / KS3)
**Objetivo Central:** Comprender la fundamentación matemática del Machine Learning clásico, el cálculo vectorial en espacios multidimensionales, regresión, clasificación y gobernanza de datos.

#### Unidad 4.1: ¿Qué es el Aprendizaje Automático? Paradigma Tradicional vs ML
- **Conceptos Teóricos:**
  - *Programación Clásica:* $\text{Reglas} + \text{Datos} \implies \text{Respuestas}$.
  - *Machine Learning:* $\text{Datos} + \text{Respuestas} \implies \text{Reglas (Modelo Paramétrico)}$.
- **Taxonomía:** Aprendizaje Supervisado (Regresión y Clasificación), No Supervisado (Clustering K-Means) y por Refuerzo (Agente, Entorno, Recompensa).

#### Unidad 4.2: Álgebra Vectorial y Regresión Lineal Multivariable (OLS)
- **Fundamento Matemático:** Ajuste por Mínimos Cuadrados Ordinarios:
  $$y = w_1 x_1 + w_2 x_2 + \dots + w_d x_d + b = \mathbf{w}^T \mathbf{x} + b$$
  Ecuación Normal Matricial: $\mathbf{w} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}$.
  Métricas de error: Mean Squared Error (MSE), Root Mean Squared Error (RMSE) y Coeficiente de Determinación $R^2 \in [0, 1]$.
- **Laboratorio en Pyodide:** Predicción del consumo energético de una colonia lunar en función de la temperatura exterior, número de habitantes y horas de luz solar.

#### Unidad 4.3: Clasificador K-Nearest Neighbors (KNN) con Asteroides de la NASA
- **Fundamento Matemático:** Espacio euclídeo $\mathbb{R}^d$, distancia $d(\mathbf{u}, \mathbf{v}) = \sqrt{\sum (u_i - v_i)^2}$, normalización Min-Max $x' = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$, hiperparámetro $k$, votación ponderada por la inversa de la distancia.
- **Laboratorio con Datos Reales:** Ingesta del dataset oficial de la NASA (NeoWs - *Near Earth Object Web Service*) para clasificar si un asteroide es potencialmente peligroso (PHA) según su diámetro, velocidad relativa y distancia mínima de aproximación a la Tierra.

#### Unidad 4.4: Árboles de Decisión y Pureza de Gini
- **Fundamento Matemático:** Partición recursiva del espacio de características, cálculo de la impureza de Gini:
  $$I_G(p) = 1 - \sum_{i=1}^C p_i^2$$
  Ganancia de información (*Information Gain*), prevención de sobreajuste (*Overfitting*) mediante poda y profundidad máxima (*max_depth*).
- **Laboratorio:** Diagnóstico de fallos en sistemas de propulsión aeroespacial mediante árboles de decisión interactivos con visualización de nodos y hojas.

#### Unidad 4.5: El Principio GIGO (*Garbage In, Garbage Out*) y Métricas de Equidad
- **Conceptos de Ética Algorítmica:** Un algoritmo no "crea verdad"; optimiza una función de pérdida sobre los datos históricos que se le suministran.
- **Métricas Matemáticas:**
  - *Ratio de Impacto Dispar (Disparate Impact Ratio - DIR)* $\ge 0.80$.
  - *Paridad Demográfica* e *Igualdad de Oportunidades (Equal Opportunity)*.
- **Estudio de Caso Real:** Auditoría de un algoritmo de concesión de becas escolares que discrimina por código postal o género, y corrección del dataset mediante técnicas de reponderación (*reweighting*).

---

### 🟣 TRAMO 5: 14 A 15 AÑOS (3.º Y 4.º ESO / GRADES 9–10 / KS4 GCSE)
**Objetivo Central:** Dominar el cálculo tensorial profundo en GPU (TensorFlow.js / WebGPU), redes neuronales multicapa (MLP, CNN), la arquitectura Transformer (Vaswani et al., 2017), modelos SLM locales, embeddings semánticos, RAG y cumplimiento del EU AI Act.

#### Unidad 5.1: Tensores N-Dimensionales y Álgebra en WebGPU
- **Fundamento Matemático:** Tensores $\mathbb{R}^{B \times C \times H \times W}$, strides de memoria plana, multiplicación matricial paralelizada en shaders de WebGPU ($C_{ij} = \sum A_{ik} B_{kj}$), broadcasting y operaciones vectorizadas element-wise.
- **Laboratorio:** Implementación en TypeScript de operaciones tensoriales aceleradas por hardware en el navegador.

#### Unidad 5.2: Perceptrón Multicapa, Descenso de Gradiente y Backpropagation
- **Fundamento Matemático:**
  - Neurona artificial: $z = \sum w_i x_i + b$, funciones de activación no lineales (ReLU $\max(0, z)$, Sigmoid $\sigma(z) = \frac{1}{1+e^{-z}}$, Softmax).
  - Función de pérdida Cross-Entropy: $\mathcal{L} = -\sum y_i \log(\hat{y}_i)$.
  - Descenso de Gradiente con Momento: $W \leftarrow W - \eta \nabla_W \mathcal{L}$.
  - Derivación de la regla de la cadena para la retropropagación del error en capas densas: $\frac{\partial \mathcal{L}}{\partial W^{(l)}} = \delta^{(l)} (a^{(l-1)})^T$.
- **Laboratorio:** Entrenamiento completo desde cero de una red neuronal densa (2 capas ocultas) para clasificar tipos de galaxias (espirales, elípticas, irregulares) con visualización en vivo de la frontera de decisión y curvas de pérdida.

#### Unidad 5.3: Visión por Computador con Redes Convolucionales (CNN) y Transfer Learning
- **Fundamento Matemático:** Operación de convolución 2D discreta con kernels ($3 \times 3$), detección de bordes (filtros Sobel), capas de Max Pooling ($2 \times 2$), mapas de características de alta dimensión y extracción de embeddings con MobileNet v2 ($1280\text{D}$).
- **Laboratorio:** Clasificador en tiempo real en el navegador mediante cámara web y *Transfer Learning*: adaptación de la cabeza de clasificación con capas Dropout y Softmax en TensorFlow.js.

#### Unidad 5.4: Arquitectura Transformer y Auto-Atención Multicabezal (Vaswani 2017)
- **Fundamento Matemático Riguroso:**
  $$\text{Attention}(Q, K, V) = \text{softmax}\left( \frac{Q K^T}{\sqrt{d_k}} \right) V$$
  - Proyección de matrices $Q = X W_Q$, $K = X W_K$, $V = X W_V$.
  - Demostración de por qué dividimos por $\sqrt{d_k}$: estabilización de la varianza del producto escalar para evitar gradientes nulos en la región saturada de Softmax.
  - Multi-Head Attention (MHA): concatenación de $h$ cabezales de atención independientes para capturar relaciones sintácticas y semánticas simultáneas.
  - Positional Encoding sinusoidal ($PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d})$).
- **Laboratorio:** Implementación pura en NumPy / Python Wasm de una celda de auto-atención escalada con visualización matricial interactiva del mapa de calor de atención entre palabras.

#### Unidad 5.5: Embeddings Semánticos, Similitud Coseno y RAG Vectorial Local
- **Fundamento Matemático:** Proyección en espacio latente continuo $f: \mathcal{V} \to \mathbb{R}^{384}$, métrica de Similitud Coseno:
  $$\cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2}$$
  Índices vectoriales planos, chunking de documentos y pipeline completo de **Retrieval-Augmented Generation (RAG)** ejecutado en cliente con `Transformers.js` (`all-MiniLM-L6-v2`) sin enviar datos a servidores externos.
- **Laboratorio:** Asistente documental privado que responde preguntas técnicas sobre el manual de operaciones de la estación espacial citando fuentes exactas del PDF cargado.

#### Unidad 5.6: Agentes Autónomos, Function Calling y Ciclo ReAct
- **Conceptos de Arquitectura de Agentes:** Ciclo *Reason + Act* (Pensamiento $\to$ Selección de Herramienta $\to$ Ejecución $\to$ Observación $\to$ Respuesta Final), llamadas a funciones estructuradas en JSON, gestión de memoria episódica vs semántica.
- **Laboratorio:** Creación de un agente autónomo de exploración que consulta una API meteorológica real y una base de datos astronómica para planificar una noche de observación telescópica.

#### Unidad 5.7: Gobernanza de IA, Seguridad y Cumplimiento del EU AI Act (2024/1689)
- **Marco Legal y Técnico:**
  - Los 4 niveles de riesgo del Reglamento Europeo de IA (Inaceptable, Alto Riesgo, Transparencia, Mínimo).
  - Requisitos obligatorios de supervisión humana (*Human-in-the-loop*), explicabilidad algorítmica (*XAI* / SHAP values) y marcado criptográfico de procedencia C2PA.
  - Vulnerabilidades de seguridad: *Prompt Injection* directo/indirecto, envenenamiento de datos (*Data Poisoning*) y jailbreaks.
- **Laboratorio:** Auditoría de seguridad de un chatbot corporativo: detección y blindaje contra intentos de manipulación de instrucciones del sistema (*System Prompt Defense*).

---

## 🔬 3. MATRIZ DE 15 MÓDULOS DE AMPLIACIÓN Y VANGUARDIA (TALENTO Y PROYECTOS AVANZADOS)

| Módulo Avanzado | Tópico Técnico | Pila Tecnológica Real | Proyecto Práctico |
| :--- | :--- | :--- | :--- |
| **MOD-ADV-01** | **Quantization & Small Language Models (SLMs)** | ONNX Runtime Web / WebGPU 4-bit (INT4) | Ejecución local de *SmolLM-135M* o *Gemma-2-2B* a 25 tokens/s en el navegador. |
| **MOD-ADV-02** | **Modelos de Difusión y Generación de Imágenes** | WebGPU Shader / Latent Diffusion Pipeline | U-Net denoising paso a paso y visualización de la reducción de ruido gaussiano. |
| **MOD-ADV-03** | **Mixture of Experts (MoE) y Sparse Routing** | Python Wasm / PyTorch Export | Mecanismo de enrutamiento por compuerta (*Top-2 Gating Router*) para expertos especializados. |
| **MOD-ADV-04** | **LoRA (Low-Rank Adaptation) & Fine-Tuning** | Álgebra Lineal ($W = W_0 + B \cdot A, r=4$) | Adaptación de bajo rango para cambiar el estilo literario de un modelo lingüístico. |
| **MOD-ADV-05** | **Aprendizaje por Refuerzo con Feedback Humano (RLHF / DPO)** | Algoritmo Direct Preference Optimization | Alineación de preferencias de un asistente para evitar respuestas tóxicas. |
| **MOD-ADV-06** | **Visión-Lenguaje-Acción (VLA) en Robótica** | Transformers Multimodales / ROS Web Bridge | Control de un brazo robótico simulado mediante instrucciones en lenguaje natural. |
| **MOD-ADV-07** | **Optimización de Caché KV en LLMs** | Gestión de Memoria GPU en C++/Wasm | Implementación de PagedAttention y Multi-Query Attention (MQA) para reducir VRAM. |
| **MOD-ADV-08** | **Rotary Position Embeddings (RoPE)** | Geometría Compleja / Rotaciones $2\text{D}$ | Extensión de longitud de contexto en Transformers mediante matrices de rotación ortogonales. |
| **MOD-ADV-09** | **Redes Generativas Adversarias (GANs)** | TensorFlow.js WebGPU | Duelo Minimax entre Red Generadora y Red Discriminadora para síntesis de texturas 3D. |
| **MOD-ADV-10** | **Graph Neural Networks (GNNs)** | DGL / PyG Wasm | Predicción de enlaces moleculares y análisis de redes de satélites en constelación. |
| **MOD-ADV-11** | **Criptografía Post-Cuántica y Seguridad de IA** | WebCrypto API / Dilithium signatures | Firma digital de pesos neuronales para certificar la procedencia legítima del modelo. |
| **MOD-ADV-12** | **Compilación de Shaders WGSL para Tensores** | WebGPU Native WGSL Shaders | Escribir un kernel de producto tensorial manual optimizado para Apple Silicon / Nvidia RTX. |
| **MOD-ADV-13** | **Evaluación de Alucinaciones con LLM-as-a-Judge** | Framework de Evaluación Ragas / G-Eval | Creación de un juez sintético calibrado para medir fidelidad fáctica (*Factuality Score*). |
| **MOD-ADV-14** | **IA Simbólica + Conexión Neuro-Simbólica** | Lógica de Primer Orden + Pyodide SymPy | Fusión de razonadores lógicos deterministas con redes neuronales probabilísticas. |
| **MOD-ADV-15** | **Diseño de Micro-Agentes con Memoria Vectorial** | SQLite Wasm (Vector Extension) + Local LLM | Agente de investigación que recuerda conversaciones pasadas y construye un grafo de conocimiento. |

---

## 📐 4. RÚBRICA DE EVALUACIÓN COMPETENCIAL (CSTA, UNESCO Y LOMLOE)

Cada una de las 35 unidades evalúa 6 descriptores competenciales con ponderación multidimensional:

```
+----------------------------------------------------------------------------------------------------+
|                             RÚBRICA DE EVALUACIÓN GOALS AI LAB                                     |
+================================+===================================================================+
| 1. Pensamiento Algorítmico     | Capacidad de descomponer problemas complejos en secuencias        |
|    (CSTA 1A/B-AP, STEM1)       | deterministas óptimas y reutilizables.                            |
+--------------------------------+-------------------------------------------------------------------+
| 2. Corrección & Depuración     | Habilidad metódica para identificar, aislar y reparar errores     |
|    (CSTA 2-AP-17, CPSAA1)      | lógicos y sintácticos mediante pruebas unitarias y trazas.        |
+--------------------------------+-------------------------------------------------------------------+
| 3. Eficiencia Computacional    | Comprensión y optimización de complejidad temporal O(N) y         |
|    (CSTA 3A-AP-14, CD2)        | uso de memoria en estructuras de datos avanzadas.                 |
+--------------------------------+-------------------------------------------------------------------+
| 4. Modelado Matemático de ML   | Dominio conceptual de funciones de pérdida, optimizadores,        |
|    (UNESCO AI Level 2-3)       | matrices de confusión, tensores y arquitecturas neuronales.       |
+--------------------------------+-------------------------------------------------------------------+
| 5. Autonomía en Código Texto   | Fluidez sintáctica en Python 3.12 y TypeScript sin dependencia de  |
|    (CSTA 2/3A-AP, CD3)         | asistentes mágicos; capacidad de escribir código limpio y tipado. |
+--------------------------------+-------------------------------------------------------------------+
| 6. Ética, Seguridad & Legalidad| Evaluación de sesgos en datos (GIGO), privacidad y cumplimiento  |
|    (EU AI Act, UNESCO Ethics)  | estricto de los marcos éticos internacionales y normativas de IA.  |
+--------------------------------+-------------------------------------------------------------------+
```

---

## 🏛️ 5. CERTIFICACIÓN DE VANGUARDIA Y ACTUALIZACIÓN CONTINUA

> [!IMPORTANT]
> **COMPROMISO DE VANGUARDIA CIENTÍFICA (SSOT 2026):**
> Este plan curricular garantiza que ningún estudiante de GOALS aprenda conceptos obsoletos o meramente cosméticos. La transición desde los algoritmos desconectados a los 6 años hasta la auto-atención matricial de Transformers y la gobernanza del EU AI Act a los 15 años forma la columna vertebral más sólida y avanzada de educación computacional en habla hispana.
