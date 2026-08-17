# 👨‍🏫 PORTAL DE ANALÍTICA DOCENTE, RADAR 6D Y 25 RETOS FAMILIARES DESENCHUFADOS
## GOALS AI Lab — Seguimiento Pedagógico, Alertas Tempranas y Experiencias Fuera de Pantalla

**Marco Analítico:** Radar Competencial 6D de Pensamiento Computacional, Algoritmos de Alerta Temprana, Rúbricas Oficiales LOMLOE (RD 157/2022 y RD 217/2022) y Catálogo de 25 Retos Desenchufados (*Off-Screen AI Quests*).

---

### ÍNDICE GENERAL
1. **Radar Competencial 6D de Pensamiento Computacional**.
2. **Algoritmos Matemáticos de Alerta Temprana** ($I_{\text{frust}}$, $I_{\text{comfort}}$, $I_{\text{gifted}}$).
3. **Rúbricas Oficiales LOMLOE e Informes Evaluativos (IN/SU/BI/NT/SB)**.
4. **Catálogo Maestro de 25 Retos Familiares Desenchufados (5 Tramos $\times$ 5 Temáticas)**.

---

## 1. RADAR COMPETENCIAL 6D DE PENSAMIENTO COMPUTACIONAL

```
                     [1] Pensamiento Algorítmico
                                  /\
                                 /  \
     [6] Gobernanza & Ética     /    \     [2] Depuración & Traza
                               /      \
                              /        \
                             \          /
       [5] Código Texto       \        /   [3] Eficiencia O(N)
                               \      /
                                \    /
                                 \  /
                                  \/
                         [4] Modelado ML & Datos
```

| Dimensión 6D | Enfoque Pedagógico | Señales Telemétricas Clave |
|---|---|---|
| **1. Pensamiento Algorítmico** | Descomposición modular, reconocimiento de patrones, secuencias y recursión. | Precisión primera pasada, anidamiento óptimo, generalización en tests ciegos. |
| **2. Depuración & Traza** | Ejecución mental (dry-run), aislamiento de fallos semánticos, traza de variables. | Ratio de bisección de errores, precisión prediciendo variables, MTTD. |
| **3. Eficiencia $\mathcal{O}(N)$** | Coste temporal/espacial ($\mathcal{O}(1), \mathcal{O}(\log N), \mathcal{O}(N), \mathcal{O}(N^2)$), poda de ramas. | Complejidad asintótica del código vs óptimo, contador de iteraciones redundantes. |
| **4. Modelado ML & Datos** | Representaciones vectoriales, balance de datasets, sesgo-varianza, hiperparámetros. | Éxito en tuning neuronal, detección de overfitting y data leakage, matrices de confusión. |
| **5. Autonomía en Código Texto** | Transición de bloques a Python/TypeScript, fluidez sintáctica sin sugerencias ciegas. | Tasa de `SyntaxError` por KLoC, ratio de tipeo fluido vs copia indiscriminada. |
| **6. Gobernanza & Ética de IA** | Detección de sesgos, EU AI Act, análisis de deepfakes, explicabilidad y privacidad. | Puntuación en dilemas éticos, detección de alucinaciones, comprensión del impacto socioambiental. |

---

## 2. ALGORITMOS MATEMÁTICOS DE ALERTA TEMPRANA

### 2.1. Detección de Frustración en Debugging ($I_{\text{frust}}$)
$$I_{\text{frust}} = 0.35 \cdot f_{\text{fail}} + 0.30 \cdot f_{\text{rep}} + 0.20 \cdot \mathcal{H}_{\text{edit}} + 0.15 \cdot f_{\text{freeze}}$$
- Si $I_{\text{frust}} \ge 0.70$ durante $>90\text{ s}$ $\implies$ Se activa el widget del "Pato de Goma Socrático" con preguntas de bisección guiadas.

### 2.2. Detección de Estancamiento en Zona de Confort ($I_{\text{comfort}}$)
$$I_{\text{comfort}} = 0.40 \cdot \left(\frac{N_{\text{passed}}}{N_{\text{total}}}\right) + 0.30 \cdot \max\left(0, 1 - \frac{T_{\text{solve}}}{\mu_{\text{cohort}} - \sigma_{\text{cohort}}}\right) + 0.30 \cdot \mathbb{I}(\text{ComplexAvoided})$$
- Si $I_{\text{comfort}} > 0.82$ en 4 retos consecutivos $\implies$ Activación automática de la "Ruta de Mutación Algorítmica" con restricciones de complejidad.

### 2.3. Detección de Talento Precoz en Algoritmia ($I_{\text{gifted}}$)
$$I_{\text{gifted}} = 0.35 \cdot \mathbb{I}(\text{OptimalFirstTry}) + 0.30 \cdot \left(1 - \frac{\text{Hints}}{\text{MaxHints}}\right) + 0.20 \cdot \text{EleganceRatio} + 0.15 \cdot \text{ZeroShotTransfer}$$
- Si $I_{\text{gifted}} \ge 0.85$ sostenido en 3 módulos $\implies$ Desbloqueo de retos de Olimpiada Informática y paso acelerado a Python textual.

---

## 3. RÚBRICAS OFICIALES LOMLOE (IN / SU / BI / NT / SB)

| Criterio | Insuficiente (IN: 1-4.9) | Suficiente (SU: 5-5.9) | Bien (BI: 6-6.9) | Notable (NT: 7-8.9) | Sobresaliente (SB: 9-10) |
|---|---|---|---|---|---|
| **Algoritmia & Descomposición** | No identifica secuencias; ensayo-error ciego. | Secuencias simples con apoyo directo. | Descompone en 2-3 módulos con bucles funcionales. | Modula estructuras complejas y optimiza funciones. | Diseña algoritmos elegantes, recursivos y paramétricos. |
| **Depuración y Traza** | Abandona ante errores de sintaxis. | Corrige sintaxis obvia con ayuda. | Localiza fallos siguiendo la traza de variables. | Aplica bisección y aísla *edge cases*. | Implementa tests unitarios y aserciones preventivas. |
| **Eficiencia $\mathcal{O}(N)$** | Genera bucles infinitos o redundancia masiva. | Reconoce que menos pasos ahorran tiempo. | Selecciona estructuras adecuadas que evitan iteraciones. | Diseña soluciones óptimas $\mathcal{O}(N)$ o $\mathcal{O}(\log N)$. | Análisis formal riguroso de complejidad espacial y temporal. |
| **Modelado ML & Datos** | Confunde correlación con causalidad. | Comprende que los datos entrenan al modelo. | Ajusta parámetros básicos y previene el sobreajuste. | Diseña datasets balanceados y valida con matrices de confusión. | Evalúa funciones de pérdida, arquitecturas y límites éticos. |
| **Ética y Gobernanza** | Acepta la salida de la IA como verdad dogmática. | Identifica que la IA puede equivocarse y alucinar. | Reconoce sesgos cotidianos y protege la privacidad. | Aplica el EU AI Act y propone métricas de equidad ($DIR$). | Diseña auditorías algorítmicas, trazabilidad y gobernanza integral. |

---

## 4. CATÁLOGO MAESTRO: 25 RETOS FAMILIARES DESENCHUFADOS (OFF-SCREEN QUESTS)

```
                MATRIZ DE 25 RETOS DESENCHUFADOS (5 TRAMOS × 5 TEMÁTICAS)
  [A] Algoritmos y Secuenciación       [B] Visión Artificial y Patrones
  [C] Entrenamiento ML, Datos y Sesgo  [D] Eficiencia y Complejidad O(N)
  [E] Ética, Seguridad y Gobernanza de IA
```

### 🔹 TRAMO 1 (6–7 AÑOS)
- **1.A El Robot-Papá Ciego:** Comandos atómicos exactos con antifaz para recoger un vaso esquivando obstáculos.
- **1.B El Clasificador de Calcetines por Píxeles:** Segmentación en cuadrícula según Color y Estampado (*Feature Extraction*).
- **1.C El Monstruo Glotón y los Datos Contaminados:** Caja de zapatos entrenada solo con comida roja que come un Lego por sesgo muestral.
- **1.D La Carrera del Libro de Cuentas:** Búsqueda lineal página por página vs búsqueda binaria abriendo por la mitad.
- **1.E El Semáforo del Sombrero Mágico:** Puerta inteligente que solo deja pasar peluches con gorra; debate sobre inclusión.

### 🔹 TRAMO 2 (8–9 AÑOS)
- **2.A La Coreografía de Origami y Funciones:** Empaquetar pliegues bajo la tarjeta `hacer_base_barco()` para no repetir instrucciones.
- **2.B Convolución con Cartón Perforado:** Ventana $3\times3$ que escanea números en una cuadrícula para detectar bordes.
- **2.C El Monstruo del Sobreajuste con Plastilina:** Modelo que memoriza cada grieta de una hoja y fracasa ante hojas nuevas del jardín.
- **2.D El Puente de Espaguetis y el Algoritmo Voraz:** Por qué elegir la unión más corta inmediata derriba la estructura general.
- **2.E El Asistente del Micrófono Fisgón:** Simulación de escucha en la nube vs procesamiento local en el dispositivo (*Edge AI*).

### 🔹 TRAMO 3 (10–11 AÑOS)
- **3.A La Máquina de Estados de la Lavadora:** Círculos en el suelo (`REPOSO`, `LLENADO`, `LAVADO`, `CENTRIFUGADO`) y eventos de seguridad.
- **3.B Filtro Sobel con Monedas y Fichas:** Matriz $\begin{bmatrix}-1 & 0 & +1\end{bmatrix}$ sumando productos para resaltar líneas verticales.
- **3.C El Árbol de Decisión de 20 Preguntas:** Selección de preguntas que dividen la lista al 50% (Ganancia de Información máxima).
- **3.D El Gran Torneo de Cartas (Bubble Sort vs Quick Sort):** Conteo de intercambios ordenando 8 cartas desordenadas.
- **3.E El Detective Forense de Deepfakes:** Análisis con lupa de anomalías físicas (reflejos, 6 dedos) y sellos de marca de agua C2PA.

### 🔹 TRAMO 4 (12–13 AÑOS)
- **4.A Punteros, Pilas (Stack) y Colas (Queue):** Simulación del botón Deshacer (LIFO con platos) y cola de impresión (FIFO con tubo).
- **4.B Espacios Vectoriales (Embeddings) en el Salón:** Ecuación $\vec{v}(\text{Rey}) - \vec{v}(\text{Hombre}) + \vec{v}(\text{Mujer}) \approx \vec{v}(\text{Reina})$ con post-its y cuerdas.
- **4.C Descenso del Gradiente en la Colina de Cojines:** Búsqueda del valle más bajo con antifaz ajustando el tamaño del paso ($\alpha$).
- **4.D La Ruta del Repartidor de Pizza (Dijkstra):** Sillas unidas con lanas calculando el camino de menor tiempo acumulado.
- **4.E El Tribunal de Admisión y el EU AI Act:** Auditoría de currículums y detección de variables proxy que discriminan indirectamente.

### 🔹 TRAMO 5 (14–15 AÑOS)
- **5.A La Red Neuronal Humana de Fósforos:** Propagación hacia adelante y cálculo manual de derivadas en una neurona con pesos de cartón.
- **5.B Auto-Atención Multicabezal con Hilos de Lana:** Cruce de miradas entre palabras de una frase conectando arcos de afinidad semántica ($Q K^T$).
- **5.C El Ataque de Inyección de Prompt (*Jailbreak*):** Un familiar hace de IA guardiana con un secreto y el alumno debe redactar prompts de evasión y defensas.
- **5.D Criptografía y Firmas Digitales con Candados:** Simulación de curvas elípticas y verificación de procedencia de contenido C2PA.
- **5.E El Juicio Ético de la IA Médica:** Debate de rol con el Reglamento Europeo 2024/1689 sobre responsabilidad en diagnósticos de alto riesgo.
