# 05 · LOS 6 MOTORES INTERACTIVOS DE IA LAB

**Módulo:** `ai-lab`  
**Principio Técnico:** Ejecución de algoritmos matemáticos y lógicos en tiempo real en el cliente.

---

## 1. Sandbox de Red Neuronal 2D (`NeuralNetworkVisualizer`)

### Objetivo
Permitir al estudiante "tocar" una red neuronal, observando cómo los pesos se ajustan mediante cálculo diferencial discreto y cómo se genera la frontera de decisión en un espacio bidimensional.

### Capacidades Interactivas
- **Datasets No Lineales:** Círculo concéntrico ($r < 2.8$), Problema XOR ($x \cdot y > 0$), Dos Lunas entrelazadas y Doble Espiral de Arquímedes.
- **Topología Dinámica:** Selección independiente de 1 a 8 neuronas en Capa 1 y Capa 2.
- **Funciones de Activación:**
  - **ReLU:** $\max(0, x)$ $\rightarrow$ Genera fronteras poligonales angulosas con aprendizaje veloz.
  - **Tanh:** $\tanh(x)$ $\rightarrow$ Genera transiciones suaves y continuas entre clases.
  - **Sigmoide:** $\frac{1}{1 + e^{-x}}$ $\rightarrow$ Proyecta valores al intervalo probabilístico $[0, 1]$.
- **Descenso de Gradiente en Canvas:** Renderizado de $45 \times 45$ celdas de decisión con gradiente de color Ultravioleta (Clase 1) y Cyan (Clase 0), acompañado de una gráfica de pérdida (Loss Curve) en tiempo real.

---

## 2. Laboratorio de Tokens y Predicción LLM (`TokenFlowLab`)

### Objetivo
Desmitificar el "pensamiento" de los Grandes Modelos de Lenguaje, mostrando que operan sobre índices numéricos y distribuciones de probabilidad token a token.

### Capacidades Interactivas
- **Tokenizador de Subpalabras en Vivo:** Convierte cualquier entrada de texto (español, inglés, código o emojis) en chips coloreados con sus IDs de vocabulario (de #1000 a #99999) y bytes UTF-8 asociados.
- **Simulador de Muestreo Probabilístico:**
  - Control de **Temperatura ($T \in [0.1, 2.0]$)**: Escala los logits antes de aplicar la función Softmax, permitiendo comparar respuestas deterministas frente a respuestas estocásticas.
  - Filtro **Top-K ($K \in [1, 7]$)**: Limita la selección a los $K$ candidatos más probables.
  - Filtro **Top-P / Nucleus ($P \in [0.2, 1.0]$)**: Acumula la masa de probabilidad hasta el umbral $P\%$.
  - Botón de **Muestreo Ponderado**: Genera el siguiente token paso a paso alimentando el contexto en bucle autoregresivo.

---

## 3. Laboratorio de Visión y Convolución 3×3 (`ComputerVisionLab`)

### Objetivo
Enseñar cómo las Redes Neuronales Convolucionales (CNN) procesan imágenes dividiéndolas en tensores numéricos e inspeccionando características espaciales locales.

### Capacidades Interactivas
- **Cuadrícula de Píxeles $16 \times 16$:** Representación en escala de grises de 0 a 255.
- **Catálogo de Kernels 3×3:** Detección de Bordes (Laplaciano), Enfoque (Sharpen), Filtros Sobel (derivadas direccionales X/Y), Desenfoque Gaussiano y Relieve (Emboss).
- **Inspección Celda a Celda:** Al pasar el cursor sobre cualquier píxel, el laboratorio muestra la submatriz $3 \times 3$ vecina, el producto escalar con el kernel y la suma final normalizada que genera el mapa de características.

---

## 4. Laboratorio Forense Caza-Alucinaciones (`HallucinationHunterLab`)

### Objetivo
Entrenar el pensamiento crítico del alumno para detectar respuestas inventadas por LLMs y medios audiovisuales sintéticos generados artificialmente.

### Capacidades Interactivas
- **15 Casos Forenses Factuales:** Basados en incidentes reales (citas de sentencias judiciales ficticias, libros apócrifos atribuidos a científicos, anacronismos históricos y errores de física básica).
- **Herramienta de Auditoría:** El alumno subraya la frase sospechosa y pulsa "Verificar Evidencia Forense" para acceder al informe fáctico con fuentes oficiales y explicación de por qué confabuló el modelo.

---

## 5. Simulador de Sesgos y Dilemas Éticos (`BiasAndEthicsLab`)

### Objetivo
Comprender el impacto social de la IA y el marco regulatorio europeo (EU AI Act).

### Capacidades Interactivas
- **Simulador de Selección de Talento:** Ajusta la proporción demográfica de los datos de entrenamiento (10% a 90%) y observa cómo el algoritmo crea automáticamente una brecha de aceptación injusta (violación de Paridad Demográfica).
- **Botón de Mitigación (Reweighting):** Aplica reponderación estadística para restaurar la equidad del modelo.
- **Arena de Dilemas Morales:** 3 escenarios de alto impacto (coche autónomo, becas escolares, reconocimiento facial en vía pública) con votación y análisis de los 4 niveles de riesgo de la Ley de IA de la UE.

---

## 6. Estudio de Creación y Co-Piloto Socrático (`CreativeAIStudio`)

### Objetivo
Aprender a co-crear con inteligencia artificial utilizando una estructura rigurosa y evaluación continua.

### Capacidades Interactivas
- **Constructor de Instrucciones RCRF:** Formulario guiado de 4 campos: Rol, Contexto, Tarea Concreta y Restricciones/Formato.
- **Inferencia en Tiempo Real:** Envío del prompt a la API de IA real con síntesis de voz neuronal integrada.
- **Auditoría de Calidad:** Evaluación automática de claridad, riesgo de alucinación y contrapregunta socrática del mentor.
