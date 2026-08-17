# 📊 08. PSICOMETRÍA ADAPTATIVA, ELO CONCEPTUAL Y ECONOMÍA DE GAMIFICACIÓN
## Formalización Matemática: Modelo IRT (2PL), Inferencia Bayesiana EAP, Rating en Grafos DAG y Progresión Anti-inflacionaria a 365 Días

**Especialidad:** Psicometría Adaptativa y Gamificación Educativa  
**Calibración:** 25 Niveles de Carrera Espacial, $45.000\text{ XP}$ Acumulada, Banco de 25 Ítems Reales

---

## 1. MODELO DE TEORÍA DE RESPUESTA AL ÍTEM (IRT - 2PL)

### 1.1. Probabilidad e Información de Fisher
$$P_i(\theta) = \frac{1}{1 + e^{-a_i(\theta - b_i)}} \quad,\quad Q_i(\theta) = 1 - P_i(\theta)$$

$$I_i(\theta) = a_i^2 \cdot P_i(\theta) \cdot Q_i(\theta)$$

$$\text{SE}(\hat{\theta}) = \frac{1}{\sqrt{\sum_{j=1}^{k} I_j(\hat{\theta}) + \sigma_0^{-2}}}$$

### 1.2. Algoritmo de Actualización Bayesiana (EAP con Cuadratura Gauss-Hermite)
Se utiliza una rejilla de $M = 41$ nodos en $[-4.0, +4.0]$ con pesos iniciales $W_m^{(0)} = \mathcal{N}(\mu_0, \sigma_0^2)$.
Tras cada respuesta $u_k \in \{0, 1\}$:

$$W_m^{(k)} = \frac{W_m^{(k-1)} \cdot \left[P_k(X_m)\right]^{u_k} \cdot \left[1 - P_k(X_m)\right]^{1-u_k}}{\sum_{j=1}^{M} \widetilde{W}_j^{(k)}}$$

$$\hat{\theta}_{\text{EAP}} = \sum_{m=1}^{M} X_m W_m^{(k)} \quad,\quad \operatorname{Var}(\theta) = \sum_{m=1}^{M} (X_m - \hat{\theta}_{\text{EAP}})^2 W_m^{(k)}$$

---

## 2. ELO CONCEPTUAL EN GRAFOS DIRIGIDOS (DAG)

### 2.1. Ecuación Logística Adaptada
$$E = \frac{1}{1 + 10^{\frac{R_i - R_c}{400}}} \quad,\quad R_c^{(\text{new})} = R_c^{(\text{old})} + K \cdot (S - E)$$

$$K(n_c, \Delta t, S, E) = 64 \cdot \max\left(0.25, \frac{1}{\sqrt{1 + 0.15 n_c}}\right) \cdot (1.0 + \min(0.50, 0.025 \Delta t)) \cdot \Omega(S, E)$$

### 2.2. Mapeo de Maestría y Retención Temporal
$$\text{Mastery}(c) = \frac{100}{1 + \exp\left(-\frac{R_c - 1200}{160}\right)}$$

$$M(c, t) = \text{Mastery}_{\text{base}}(c) \cdot e^{-\lambda t} \quad (\lambda = 0,035\text{ d}^{-1})$$

Intervalos de repaso espaciado: $1\text{d} \rightarrow 3\text{d} \rightarrow 7\text{d} \rightarrow 14\text{d} \rightarrow 30\text{d}$.

---

## 3. ECONOMÍA DE GAMIFICACIÓN A 365 DÍAS

### 3.1. Curva de Progresión a 25 Niveles
$$\text{XP}_{\text{req}}(L) = \left\lfloor 58.5 \cdot (L - 1)^{2.08} + 91.5 \cdot (L - 1) \right\rfloor$$

- Nivel 1: 0 XP (Aspirante a Cadete)
- Nivel 5: 950 XP (Cadete Mayor Graduado)
- Nivel 10: 4.200 XP (Explorador Planetario Senior)
- Nivel 15: 10.750 XP (Navegante Mayor de Espacio Profundo)
- Nivel 20: 22.800 XP (Director Supremo de Misiones)
- Nivel 25: **45.000 XP (Gran Astrofísico Principal del Cosmos)**

### 3.2. Soft-Cap Diario Asintótico
$$\text{XP}_{\text{efectiva}}(x) = \begin{cases} x & \text{si } x \le 250 \\ 250 + 60 \cdot \ln\left(1 + \frac{x - 250}{60}\right) & \text{si } 250 < x \le 500 \\ 380\text{ XP (Hard Cap)} & \text{si } x > 500 \end{cases}$$

### 3.3. Multiplicador de Racha y Escudos
$$\text{Multiplier} = 1.0 + \min\left(0.50, 0.05 \cdot \left\lfloor \frac{\text{streak}}{3} \right\rfloor\right)$$
- Escudo de Materia Oscura: protege la racha 1 día (máximo 2 en inventario).
