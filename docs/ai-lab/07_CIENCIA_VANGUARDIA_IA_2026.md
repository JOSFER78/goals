# 🔬 CIENCIA Y VANGUARDIA EN INTELIGENCIA ARTIFICIAL 2026
## GOALS AI Lab — Tratado de Arquitecturas Avanzadas, Deep Learning y Derivaciones Matemáticas

**Vigencia:** 2026  
**Especialidad:** Modelos de Razonamiento (System 2), GRPO, MCTS, Multi-Token Prediction, MLA, DoRA y Flow Matching.

---

### ÍNDICE GENERAL
1. **Leyes de Escalado en Inferencia (*Test-Time Compute Scaling Laws*)**.
2. **Group Relative Policy Optimization (GRPO) y Modelos de Recompensa de Proceso (PRMs)**.
3. **Multi-Head Latent Attention (MLA) vs MHA y GQA**.
4. **DoRA: Low-Rank Adaptation Desacoplada en Magnitud y Dirección**.
5. **Flow Matching y Ecuaciones Diferenciales Ordinarias (ODEs) en Generación Visual**.

---

## 1. LEYES DE ESCALADO EN INFERENCIA (*TEST-TIME COMPUTE*)

A diferencia de la ley de Chinchilla/Kaplan que relaciona el rendimiento exclusivamente con los parámetros $N$ y tokens de preentrenamiento $D$, los modelos de razonamiento introducen el cómputo de inferencia $C_{\text{test}}$:

$$\text{Error}(N, D, C_{\text{test}}) \propto N^{-\alpha} + D^{-\beta} + C_{\text{test}}^{-\gamma}$$

```
                ┌────────────────────────────────────────────────────────┐
                │          ESPACIO DE BÚSQUEDA EN INFERENCIA             │
                └──────────────────────────┬─────────────────────────────┘
                                           │
                         ┌─────────────────┴─────────────────┐
                         ▼                                   ▼
              ┌─────────────────────┐             ┌─────────────────────┐
              │ BÚSQUEDA SECUENCIAL │             │ BÚSQUEDA EN ÁRBOL   │
              │ (Hidden CoT Tokens) │             │ (MCTS + PUCT)       │
              └─────────────────────┘             └─────────────────────┘
```

- **Monte Carlo Tree Search con PUCT:**
  $$a^* = \arg\max_a \left[ Q(s, a) + c_{\text{puct}} \cdot P(s, a) \cdot \frac{\sqrt{\sum_b N(s, b)}}{1 + N(s, a)} \right]$$

---

## 2. GROUP RELATIVE POLICY OPTIMIZATION (GRPO)

GRPO optimiza la política sin requerir una red de valor (Critic), evaluando la ventaja comparativa dentro de un grupo de $G$ candidatos $\{o_1, \dots, o_G\}$ para una misma consulta $q$:

$$\mathcal{J}_{\text{GRPO}}(\theta) = \mathbb{E}_{\substack{q \sim P(Q), \\ \{o_i\}_{i=1}^G \sim \pi_{\theta_{\text{old}}}}} \left[ \frac{1}{G} \sum_{i=1}^G \left( \min\left( r_i(\theta) \hat{A}_i, \, \text{clip}(r_i(\theta), 1-\epsilon, 1+\epsilon) \hat{A}_i \right) - \beta D_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}}) \right) \right]$$

donde el ratio de probabilidad es $r_i(\theta) = \frac{\pi_\theta(o_i|q)}{\pi_{\theta_{\text{old}}}(o_i|q)}$ y la ventaja normalizada es:
$$\hat{A}_i = \frac{R(o_i) - \mu_R}{\sigma_R + \delta}$$

---

## 3. MULTI-HEAD LATENT ATTENTION (MLA)

Para superar el cuello de botella de la caché KV en ventanas de contexto extremas (128k - 1M tokens), MLA comprime las matrices de clave y valor mediante una proyección latente de bajo rango $d_c \ll n_h d_h$:

$$c_t^{KV} = W_{DKV} h_t \in \mathbb{R}^{d_c}$$
$$K_t^C = W_{UK} c_t^{KV}, \quad V_t^C = W_{UV} c_t^{KV}$$

Al almacenar únicamente el vector comprimido $c_t^{KV}$ más una coordenada desacoplada RoPE $k_t^R$, la memoria de la caché KV se reduce en un **$93.3\%$** respecto a Multi-Head Attention estándar.

```
       MHA (Multi-Head Attention)           MLA (Multi-Head Latent Attention)
    ┌──────────────────────────────┐        ┌──────────────────────────────┐
    │  K: (n_heads × d_head)       │        │  c_KV: Comprimido (d_c)      │
    │  V: (n_heads × d_head)       │        │  k_RoPE: Desacoplado (d_r)   │
    │  [100% Consumo de VRAM]      │        │  [Ahorro del 93.3% en VRAM]  │
    └──────────────────────────────┘        └──────────────────────────────┘
```

---

## 4. DORA: LOW-RANK ADAPTATION CON DESACOPLAMIENTO DE MAGNITUD

DoRA (Weight-Decomposed Low-Rank Adaptation) descompone cualquier matriz de pesos en su componente de magnitud escalar $m$ y su matriz direccional unitaria:

$$W = m \cdot \frac{W_0 + \Delta W}{\| W_0 + \Delta W \|_F} = m \cdot \frac{W_0 + \frac{\alpha}{r} B A}{\| W_0 + \frac{\alpha}{r} B A \|_F}$$

Esta formulación elimina la interferencia espuria entre la escala y la orientación angular de las actualizaciones, logrando una capacidad de aprendizaje superior a LoRA convencional con el mismo número de parámetros entrenables.

---

## 5. FLOW MATCHING Y GENERACIÓN VISUAL RECTIFICADA

En lugar de aproximaciones estocásticas basadas en difusión Gaussiana (DDPM), **Flow Matching (Rectified Flow)** define una trayectoria determinista en línea recta de transporte óptimo:

$$z_t = (1 - t) z_0 + t z_1, \quad t \in [0, 1]$$

La velocidad del flujo es constante:
$$\frac{d z_t}{d t} = v(z_t, t) = z_1 - z_0$$

La red neuronal aprende a predecir directamente este campo de vectores de velocidad $v_\theta(z_t, t)$, permitiendo la síntesis de imágenes en tan solo **4 a 8 pasos de integración numérica con el método de Euler**.
