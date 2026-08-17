# 📊 PSICOMETRÍA ADAPTATIVA IRT 2PL, SPACED-ELO Y GAMIFICACIÓN MATEMÁTICA
## GOALS AI Lab — Motor de Calibración, Estimación Bayesiana y Economía de Progreso

**División:** Psicometría Computacional y Sistemas Adaptativos  
**Modelos Formales:** IRT 2PL Multidimensional, Actualización Bayesiana Gauss-Hermite EAP, Spaced-ELO con Grafo DAG y Decaimiento Ebbinghaus/FSRS, Bayesian Knowledge Tracing (BKT $\mathcal{O}(1)$).

---

### ÍNDICE GENERAL
1. **Modelo IRT 2PL Adaptado a Desafíos de Código**.
2. **Estimación Bayesiana de Habilidad Latente $\theta$ (Gauss-Hermite EAP)**.
3. **Spaced-ELO en Grafos DAG de Algoritmia con Decaimiento Temporal**.
4. **Bayesian Knowledge Tracing (BKT) en Cliente**.
5. **Economía Matemática de Gamificación (25 Niveles / $45.000\text{ XP}$)**.

---

## 1. MODELO IRT 2PL PARA PROBLEMAS ALGORÍTMICOS

La probabilidad de que un alumno con habilidad latente $\theta_i$ resuelva con éxito el reto $j$ con discriminación $a_j$ y dificultad $b_j$ se modela mediante la función logística bi-paramétrica:

$$P(U_{ij} = 1 \mid \theta_i, a_j, b_j) = \frac{1}{1 + e^{-D a_j (\theta_i - b_j)}}, \quad D = 1.702$$

### Puntuación Continua $U_{ij} \in [0, 1]$ para Código:
En lugar de una evaluación binaria, la calidad del código se pondera según:
$$U_{ij} = 0.50 \cdot \text{TestPassRate} + 0.20 \cdot \text{ComplexityScore} + 0.15 \cdot \text{ASTDepthScore} + 0.15 \cdot e^{-\lambda \cdot N_{\text{debug\_attempts}}}$$

---

## 2. ESTIMACIÓN BAYESIANA DE HABILIDAD LATENTE $\theta$

La distribución a posteriori de la habilidad se calcula mediante la regla de Bayes:
$$p(\theta \mid \mathbf{u}) = \frac{L(\mathbf{u} \mid \theta) \cdot p(\theta)}{\int_{-\infty}^{\infty} L(\mathbf{u} \mid \theta) \cdot p(\theta) \, d\theta}$$

La estimación puntual EAP (*Expected A Posteriori*) y su error estándar $SE(\theta)$ se aproximan mediante cuadratura de Gauss-Hermite con $Q = 21$ nodos:

$$\hat{\theta}_{\text{EAP}} = \frac{\sum_{k=1}^Q X_k L(\mathbf{u} \mid X_k) W_k}{\sum_{k=1}^Q L(\mathbf{u} \mid X_k) W_k}$$

$$SE(\hat{\theta}) = \sqrt{\frac{\sum_{k=1}^Q (X_k - \hat{\theta}_{\text{EAP}})^2 L(\mathbf{u} \mid X_k) W_k}{\sum_{k=1}^Q L(\mathbf{u} \mid X_k) W_k}}$$

**Condición de Parada:** El test adaptativo concluye cuando $SE(\hat{\theta}) \le 0.25$ o se alcanza el límite de 15 ítems.

---

## 3. SPACED-ELO EN GRAFOS DAG CON DECAIMIENTO EBBINGHAUS

Cada nodo conceptual $C_k$ en el Grafo Dirigido Acíclico (DAG) posee una puntuación ELO $R_k$. El decaimiento temporal por desuso sigue la curva de retención de Ebbinghaus / FSRS:

$$R_{\text{active}}(t) = R_{\text{base}} \cdot e^{-\frac{\Delta t}{S_k}}$$
donde $S_k$ es la estabilidad del concepto (días hasta que la retención cae al $90\%$).

Cuando un concepto padre es repasado con éxito, se propaga un factor de refuerzo $\Delta R_{\text{ancestro}} = \gamma^d \cdot \Delta R$ a sus prerrequisitos en el DAG.

---

## 4. BAYESIAN KNOWLEDGE TRACING (BKT) EN CLIENTE ($\mathcal{O}(1)$)

Para el seguimiento de micro-habilidades (ej. sintaxis de bucles `for`, indexación de listas, slicing), BKT actualiza la probabilidad de dominio $P(L_t)$ tras cada acción:

- **Si la respuesta es correcta:**
  $$P(L_t \mid \text{Correcto}) = \frac{P(L_{t-1})(1 - P(S))}{P(L_{t-1})(1 - P(S)) + (1 - P(L_{t-1}))P(G)}$$
- **Si la respuesta es incorrecta:**
  $$P(L_t \mid \text{Incorrecto}) = \frac{P(L_{t-1})P(S)}{P(L_{t-1})P(S) + (1 - P(L_{t-1}))(1 - P(G))}$$
- **Paso de transición temporal:**
  $$P(L_t) = P(L_t \mid \text{Obs}) + (1 - P(L_t \mid \text{Obs})) \cdot P(T)$$

*Parámetros calibrados:* Desliz $P(S) = 0.08$, Adivinación $P(G) = 0.12$, Transición $P(T) = 0.15$.

---

## 5. ECONOMÍA MATEMÁTICA DE GAMIFICACIÓN (25 NIVELES / $45.000\text{ XP}$)

La curva de experiencia acumulada para alcanzar el nivel $N \in [1, 25]$ sigue una progresión cuadrática suave:

$$\text{XP}_{\text{requerida}}(N) = 75 \cdot N^2 - 75 \cdot N, \quad \text{XP}(25) = 45.000\text{ XP}$$

```
Nivel 1:       0 XP  |  Nivel 10:  6.750 XP  |  Nivel 20: 28.500 XP
Nivel 5:   1.500 XP  |  Nivel 15: 15.750 XP  |  Nivel 25: 45.000 XP
```

### Regulación Neuroprotectora Anti-Adicción:
- **Soft-Cap Diario:** $250\text{ XP}$ al $100\%$ de rendimiento ($\approx 15-20\text{ min}$ de foco activo).
- **Decaimiento Asintótico:** Más allá de $250\text{ XP}$, la ganancia por reto decae según $\text{XP}_{\text{efectiva}} = \text{XP}_{\text{base}} \cdot e^{-\frac{\text{XP}_{\text{diaria}} - 250}{100}}$.
- **Hard-Cap Asintótico:** Máximo teórico de $320\text{ XP/día}$, protegiendo el descanso del estudiante y garantizando la consolidación de esquemas en el sueño.
