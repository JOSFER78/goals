# 📊 08. PSICOMETRÍA ADAPTATIVA (IRT 2PL) Y CALIBRACIÓN DE ELO DE PENSAMIENTO CRÍTICO
## Modelo Logístico IRT 2PL, Detección de Sesgos, Rating ELO en Grafos Dialécticos y Progresión a 25 Niveles

**Especialidad:** Psicometría del Razonamiento y Epistemología Computacional  
**Norma:** 100% Ecuaciones Matemáticas Reales · 25 Niveles de Carrera  

---

## 1. MODELO PSICOMÉTRICO IRT 2PL

$$P_i(\theta) = \frac{1}{1 + e^{-1.702 \cdot a_i (\theta - b_i)}}$$

- $\theta \in [-3.0, +3.0]$: Habilidad latente de pensamiento crítico, detección de sesgos y razonamiento lógico.
- $b_i$: Dificultad o sutileza del sesgo/falacia ($b_i \in [-3.0, +3.0]$).
- $a_i$: Parámetro de discriminación ($a_i \in [0.5, 2.5]$).

$$\text{SE}(\hat{\theta}) = \frac{1}{\sqrt{\text{TIF}(\hat{\theta})}} \le 0.26 \quad (\text{Fiabilidad } \ge 93\%)$$

---

## 2. RATING ELO DIALÉCTICO EN GRAFOS CONCEPTUALES
$$R'_{\text{alumno}} = R_{\text{alumno}} + K \cdot (S - E)$$

$$E = \frac{1}{1 + 10^{\frac{R_{\text{desafío}} - R_{\text{alumno}}}{400}}}$$

- **Escala:** 800 (Pensador Intuitivo) $\to$ 1500 (Razonador Crítico) $\to$ 2400 (Gran Maestro Dialéctico).

---

## 3. CURVA DE 25 NIVELES A 365 DÍAS
$$\text{XP}_{\text{req}}(L) = \lfloor 58.5 \cdot (L-1)^{2.08} + 91.5 \cdot (L-1) \rfloor = 45.000\text{ XP}$$
- **Soft-cap diario:** $250\text{ XP}$ con multiplicadores de racha de indagación.
