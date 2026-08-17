# 🤖 COMPENDIO CIENTÍFICO DE VANGUARDIA EN INTELIGENCIA ARTIFICIAL 2026
## GOALS AI Lab — Fundamentos Matemáticos, Arquitecturas y Transposición Didáctica (6 a 15 Años)

**Centro de Excelencia:** GOALS AI Lab  
**Marco Metodológico:** Construccionismo Tensorial (Papert-Vaswani), Rigor Matemático Cero Mocks, Escalera Cognitiva de 5 Tramos (6–7, 8–9, 10–11, 12–13, 14–15 años).  
**Vigencia:** 2026 (Modelos de Razonamiento, SLMs WebGPU, MoE fino, MTP, RoPE YaRN, VLA, End-to-End Audio, AWQ/GPTQ/MLA, LoRA Geométrico y Flow Matching DiT).

---

### ÍNDICE GENERAL
1. **Modelos de Razonamiento y Test-Time Compute** (System 1 vs System 2, GRPO, PRMs vs ORMs, MCTS, Scaling Laws de Inferencia).
2. **Small Language Models (SLMs) y Ejecución Local Edge/Web** (SmolLM-135M/360M, Gemma 2, Qwen2.5-Coder, Phi-3.5 en WebGPU/Wasm SIMD).
3. **Arquitecturas de Vanguardia** (Mixture of Experts con enrutamiento fino Top-k, Multi-Token Prediction y Rotary Position Embeddings RoPE/YaRN).
4. **Modelos Multimodales Nativos** (Vision-Language-Action - VLA para robótica y agentes web, Audio-to-Audio nativo con RVQ duplex).
5. **Cuantización y Optimización de Caché KV** (INT4/INT8, GPTQ, AWQ, GGUF, PagedAttention, GQA y Multi-Head Latent Attention MLA).
6. **LoRA y Fine-Tuning en Álgebra Lineal Geométrica** (Descomposición de bajo rango, Grassmannian manifold, SVD, QLoRA y DoRA).
7. **Modelos de Difusión Latente y Flow Matching** (Proceso forward/reverse Markoviano, Classifier-Free Guidance, DiT/MMDiT, Euler y Rectified Flow).
8. **Matriz de Transposición Didáctica K-12 (6 a 15 Años)**.

---

## 1. MODELOS DE RAZONAMIENTO Y TEST-TIME COMPUTE (SYSTEM 2 LLMS)

### 1.1. Fundamentos Teóricos: De la Autoregresión Ciega al Razonamiento Deliberativo
Los modelos de lenguaje clásicos operan bajo el paradigma de **Sistema 1** (rápido, intuitivo, probabilístico y sin marcha atrás): emiten el siguiente token $x_{t+1}$ condicionando exclusivamente en los tokens pasados $x_{1:t}$ mediante un único paso hacia adelante (*forward pass*):
$$P(x_{t+1} \mid x_{1:t}) = \text{Softmax}\left( W_u \cdot \text{Transformer}(x_{1:t}) \right)$$

En 2024–2026, la frontera de la IA converge en el **Sistema 2** (deliberativo, estructurado, con autocrítica, verificación y rectificación de errores antes de comprometer la respuesta final). Los modelos de razonamiento (OpenAI o1/o3, DeepSeek-R1) no solo escalan en la fase de preentrenamiento (*Pre-training Scaling Laws* de Kaplan/Chinchilla), sino que introducen las **Leyes de Escalado en Tiempo de Inferencia (*Test-Time Scaling Laws*)**:
$$\text{Exactitud}(C_{\text{train}}, C_{\text{test}}) \propto C_{\text{train}}^\alpha \cdot C_{\text{test}}^\beta, \quad \beta > 0$$
donde $C_{\text{test}}$ representa el presupuesto de cómputo en inferencia (medido en tokens de pensamiento generados, ramas de búsqueda exploradas y llamadas al verificador).

```
                      ┌────────────────────────────────────────┐
                      │          PROMPT DEL USUARIO            │
                      └──────────────────┬─────────────────────┘
                                         ▼
                 ┌──────────────────────────────────────────────────┐
                 │    CADENA DE PENSAMIENTO OCULTA (<think>)       │
                 │                                                  │
                 │  Paso 1: Análisis y descomposición del problema  │
                 │  Paso 2: Hipótesis A (Derivación matemática)     │
                 │  Paso 3: Verificación con PRM -> [Score: 0.21]   │
                 │          ❌ Error detectado: Backtracking!       │
                 │  Paso 4: Hipótesis B (Camino alternativo)        │
                 │  Paso 5: Verificación con PRM -> [Score: 0.98]   │
                 │  Paso 6: Validación de consistencia final        │
                 └──────────────────┬───────────────────────────────┘
                                    ▼
                      ┌────────────────────────────────────────┐
                      │    RESPUESTA FINAL AL USUARIO          │
                      │  (Solución verificada paso a paso)     │
                      └────────────────────────────────────────┘
```

### 1.2. Cadena de Pensamiento Oculta (*Hidden CoT*) y Aprendizaje por Refuerzo Puro (GRPO)
A diferencia del fine-tuning supervisado (SFT) que copia cadenas de pensamiento humanas, los modelos de razonamiento de última generación utilizan **RL Puro a Gran Escala** con entornos de recompensa basados en reglas (*Rule-Based Verifiers* para matemáticas y código) mediante **Group Relative Policy Optimization (GRPO)**.

#### Formulación Matemática de GRPO:
GRPO elimina la necesidad de entrenar una red de valor crítica (*Critic Network*) del mismo tamaño que el modelo generador, ahorrando un $\approx 50\%$ de memoria VRAM durante el entrenamiento de RL. Muestrea un grupo de $G$ respuestas candidatas $\{o_1, o_2, \dots, o_G\}$ para una misma pregunta $q$ a partir de la política antigua $\pi_{\theta_{\text{old}}}$:

$$\mathcal{J}_{\text{GRPO}}(\theta) = \mathbb{E}_{\substack{q \sim P(Q), \\ \{o_i\}_{i=1}^G \sim \pi_{\theta_{\text{old}}}(O|q)}} \left[ \frac{1}{G} \sum_{i=1}^G \left( \min\left( \frac{\pi_\theta(o_i|q)}{\pi_{\theta_{\text{old}}}(o_i|q)} \hat{A}_i, \, \text{clip}\left(\frac{\pi_\theta(o_i|q)}{\pi_{\theta_{\text{old}}}(o_i|q)}, 1-\epsilon, 1+\epsilon\right) \hat{A}_i \right) - \beta D_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}}) \right) \right]$$

La ventaja normalizada $\hat{A}_i$ de la respuesta $i$-ésima dentro del grupo $G$ se calcula directamente sin red de valor:
$$\hat{A}_i = \frac{r_i - \text{media}(\{r_1, \dots, r_G\})}{\text{desv\_est}(\{r_1, \dots, r_G\}) + \delta}$$

### 1.3. Verificadores: Process Reward Models (PRMs) vs. Outcome Reward Models (ORMs)
- **Outcome Reward Model (ORM):** Evalúa únicamente si la respuesta final $y$ es correcta: $r_{\text{ORM}}(x, y) \in \{0, 1\}$. Sufre de asignación de crédito deficiente.
- **Process Reward Model (PRM):** Evalúa la corrección formal de cada paso intermedio $s_t$:
  $$r_{\text{PRM}}(s_t \mid x, s_{1:t-1}) = \sigma\left( W_{\text{PRM}} \cdot h_t \right) \in [0, 1]$$
  donde $h_t$ es el embedding del token delimitador de final de paso (ej. `\n\n`).

### 1.4. Búsqueda en Inferencia: Monte Carlo Tree Search (MCTS)
Durante el tiempo de inferencia (*test-time search*), el modelo expande un árbol de razonamiento donde cada nodo es un paso $s_t$. La selección del siguiente nodo para explorar se rige por la fórmula **PUCT (Predictor Upper Confidence bounds for Trees)**:
$$a^* = \arg\max_a \left[ Q(s, a) + c_{\text{puct}} \cdot P(s, a) \cdot \frac{\sqrt{\sum_{b} N(s, b)}}{1 + N(s, a)} \right]$$
donde $Q(s,a)$ es el valor acumulado del verificador PRM, $P(s,a)$ es la probabilidad prior generada por el LLM y $N(s,a)$ es el número de visitas al nodo.

---

## 2. SMALL LANGUAGE MODELS (SLMs) Y EJECUCIÓN LOCAL EDGE / WEBGPU

### 2.1. El Ecosistema SLM en 2026
Frente al paradigma de centros de datos masivos, los SLMs (100M a 9B parámetros) permiten inferencia en tiempo real, 100% privada y offline directamente en el navegador del estudiante:

| Modelo | Parámetros Totales | Parámetros Activos | Ventana Contexto | Arquitectura / Innovación Clave |
| :--- | :--- | :--- | :--- | :--- |
| **SmolLM-135M** | 135M | 135M | 2k / 4k | Preentrenado con Cosmopedia v2 (datos sintéticos de alta densidad educativa). |
| **SmolLM-360M** | 362M | 362M | 4k / 8k | Ideal para dispositivos móviles básicos y Wasm SIMD128. |
| **Gemma 2 2B / 9B** | 2.6B / 9.2B | 2.6B / 9.2B | 8k | Logit Soft-Capping ($\kappa=30/50$), Interleaving Local-Global Attention. |
| **Qwen2.5-Coder 1.5B/7B**| 1.5B / 7.6B | 1.5B / 7.6B | 128k | SOTA en síntesis de código Wasm, soporte de 92 lenguajes y razonamiento formal. |
| **Phi-3.5 / Phi-4 Mini** | 3.8B | 3.8B | 128k | Curación sintética masiva "Textbooks Are All You Need", paridad con modelos 10x más grandes. |

### 2.2. Logit Soft-Capping en Gemma 2
Para evitar que los logits crezcan indefinidamente durante el preentrenamiento (lo que provoca inestabilidades numéricas y degradación en cuantización INT4), Gemma 2 introduce una función tangente hiperbólica acotada:
$$\text{logits}_{\text{capped}} = \kappa \cdot \tanh\left( \frac{\text{logits}}{\kappa} \right)$$
donde $\kappa = 50.0$ en las capas de atención y $\kappa = 30.0$ en la capa de proyección final del vocabulario.

---

## 3. ARQUITECTURAS DE ÚLTIMA GENERACIÓN (MoE, MTP, RoPE)

### 3.1. Mixture of Experts (MoE) con Sparse Routing Top-k y Fine-Grained Experts
En lugar de activar todos los parámetros para cada token, una arquitectura MoE activa únicamente un subconjunto de redes feed-forward (FFN).

#### Formulación Matemática del Enrutamiento Top-$k$:
Dado un token de entrada $x \in \mathbb{R}^d$, la compuerta de enrutamiento (*Router/Gating Network*) calcula las afinidades hacia $E$ expertos:
$$g(x) = \text{Softmax}\left( \text{Top-}k(W_g x + b_g, \, k) \right)$$

La salida de la capa MoE es la combinación lineal ponderada:
$$y = \sum_{i \in \text{Top-}k} g(x)_i \cdot E_i(x) + \sum_{j \in \text{Shared}} E_j^{\text{shared}}(x)$$

- **Granularidad Fina (*Fine-Grained Experts*):** En vez de 8 expertos grandes activando 2 (como Mixtral $8\times 7\text{B}$), divide en 64 o 256 expertos pequeños activando 8 o 16 ($k=8$). Esto permite combinaciones funcionales exponencialmente más ricas: $\binom{256}{8} \approx 4.6 \times 10^{14}$ sub-redes posibles.
- **Expertos Compartidos (*Shared Experts*):** Reserva expertos fijos que procesan todo el conocimiento común transversal (sintaxis básica, gramática, razonamiento lógico general).

---

### 3.2. Multi-Token Prediction (MTP)
El paradigma clásico *Next-Token Prediction* fuerza al modelo a aprender representaciones locales inmediatas. **Multi-Token Prediction (Gloeckle et al. Meta 2024 / DeepSeek-V3)** entrena el modelo para predecir concurrentemente los siguientes $M$ tokens futuros ($x_{t+1}, x_{t+2}, \dots, x_{t+M}$):

$$\mathcal{L}_{\text{MTP}} = \mathcal{L}_{\text{NTP}}(x_{t+1}) + \sum_{m=1}^{M-1} \lambda_m \cdot \mathcal{L}_{\text{CE}}\left( x_{t+m+1}, \, \text{Head}_m\left( \text{RMSNorm}(h_t^{(m)} + \text{Emb}(x_{t+m})) \right) \right)$$

Permite **Especulación Nativa (*Self-Speculative Decoding*)** acelerando la velocidad de generación por $\mathbf{1.8\times \dots 2.4\times}$ en cliente.

---

### 3.3. Rotary Position Embeddings (RoPE) y YaRN
RoPE (Su et al.) codifica la posición absoluta de un token aplicando una rotación en el plano complejo de pares de coordenadas en el espacio de embeddings, garantizando que el producto escalar entre Query y Key dependa estrictamente de la distancia relativa $(m - n)$:
$$R_{\Theta, m}^{(i)} = \begin{pmatrix} \cos(m \theta_i) & -\sin(m \theta_i) \\ \sin(m \theta_i) & \cos(m \theta_i) \end{pmatrix}, \quad \theta_i = 10000^{-2(i-1)/d}$$

$$\langle R_{\Theta, m} q, \, R_{\Theta, n} k \rangle = q^T R_{\Theta, n-m} k = g(q, k, n-m)$$

---

## 4. MODELOS MULTIMODALES NATIVOS (VLA Y AUDIO-TO-AUDIO)

### 4.1. Vision-Language-Action (VLA) para Robótica y Agentes Web
Los modelos VLA (OpenVLA, RT-2) unifican la percepción visual, el lenguaje y el control motor discretizando el vector de acción continua $a \in \mathbb{R}^7$ en 256 contenedores (*bins*):
$$a_i^{\text{token}} = \text{clamp}\left( \left\lfloor \frac{a_i - a_{\min, i}}{a_{\max, i} - a_{\min, i}} \times 255 \right\rceil, \, 0, \, 255 \right)$$

---

### 4.2. Audio-to-Audio Nativo End-to-End (Streaming Dúplex)
Los modelos de audio nativos (Moshi, Gemini Live) operan mediante **Codecs Neuronales de Cuantización Vectorial Residual (RVQ)** en modo dúplex completo con latencia $< 160\text{ ms}$:
$$\text{Audio In} \xrightarrow{\text{RVQ Encoder}} \text{Tokens Acústicos} \xrightarrow{\text{LLM Dúplex}} \text{Tokens Acústicos Out} \xrightarrow{\text{RVQ Decoder}} \text{Audio Out}$$

$$z \approx \sum_{k=1}^{N_q} e_{q_k}^{(k)}, \quad q_k = \arg\min_j \| r_{k-1} - e_j^{(k)} \|_2^2$$

---

## 5. CUANTIZACIÓN DE MODELOS Y OPTIMIZACIÓN DE CACHÉ KV

### 5.1. Cuantización de Post-Entrenamiento: GPTQ vs. AWQ
- **GPTQ:** Minimiza $E = \| W X - \hat{W} X \|_2^2$ usando la inversa de la matriz Hessiana $H = 2 X X^T$:
  $$w_{>q} \leftarrow w_{>q} - \frac{w_q - \hat{w}_q}{[H^{-1}]_{qq}} \cdot H^{-1}_{:, q}$$
- **AWQ:** Protege el 1% de canales salientes aplicando un factor de escala $s = s_X^\alpha = \left( \max(|X|) \right)^\alpha$.

### 5.2. Multi-Head Latent Attention (MLA)
Comprime las claves y valores en un vector latente $c_t^{KV} \in \mathbb{R}^{d_c}$ ($d_c \ll n_h d_h$):
$$c_t^{KV} = W_{DKV} h_t, \quad [K_t^C; V_t^C] = W_{UKV} c_t^{KV}$$
**Reduce el consumo de VRAM de la caché KV en un $\mathbf{93.3\%}$**.

---

## 6. LORA (LOW-RANK ADAPTATION) Y FINE-TUNING GEOMÉTRICO
Factoriza la actualización $\Delta W$ en dos matrices de bajo rango ($r \ll \min(d, k)$):
$$W = W_0 + \Delta W = W_0 + \frac{\alpha}{r} \cdot B \cdot A, \quad A \in \mathbb{R}^{r \times k}, \, B \in \mathbb{R}^{d \times r}$$
- **DoRA:** Desacopla la magnitud $\| \cdot \|$ de la dirección: $W = m \cdot \frac{W_0 + \frac{\alpha}{r} B A}{\| W_0 + \frac{\alpha}{r} B A \|_F}$.

---

## 7. MODELOS DE DIFUSIÓN LATENTE Y FLOW MATCHING
- **Classifier-Free Guidance (CFG):** $\tilde{\epsilon}_\theta(z_t, t, c) = \epsilon_\theta(z_t, t, \emptyset) + s \cdot \left( \epsilon_\theta(z_t, t, c) - \epsilon_\theta(z_t, t, \emptyset) \right)$.
- **Rectified Flow / Flow Matching:** Transporte en línea recta con velocidad constante $\frac{d z_t}{d t} = v(z_t, t) = z_1 - z_0$.

---

## 8. MATRIZ DE TRANSPOSICIÓN DIDÁCTICA K-12 (6 A 15 AÑOS)

| Tramo | Enfoque Pedagógico | Metáforas y Representaciones |
| :--- | :--- | :--- |
| **6–7 años (N1)** | Kinestésico / Unplugged | "El Detective que Piensa en Silencio", "La Cuadrícula de Fichas", "El Pintor de Arena". |
| **8–9 años (N2)** | Bloques Visuales y FSM | Árboles de decisión en Blockly, Las Cajas de Números (Cuantización), La Libreta Compartida (PagedAttention). |
| **10–11 años (N3)** | Texto Python Wasm | Búsqueda MCTS en tableros, Cálculo de bytes en RAM, Reloj de manecillas (RoPE), Brazo robótico VLA en Python. |
| **12–13 años (N4)** | Álgebra Vectorial Intuitiva | Proyección LoRA en sombras 2D, Rotaciones en plano complejo RoPE, Curvas de nivel GPTQ, Euler Schedulers. |
| **14–15 años (N5)** | Deep Learning Formal | GRPO en PyTorch/Wasm, Compute Shaders WebGPU para SmolLM, Flow Matching ODEs, Descomposición MLA. |
