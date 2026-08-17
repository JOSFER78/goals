# 📊 08. PSICOMETRÍA ADAPTATIVA (IRT 2PL) Y SISTEMA SPACED-ELO
## Evaluación Lingüística Adaptativa, ELO de Vocabulario y Estructuras, Retención Pimsleur/Ebbinghaus y 25 Niveles de Carrera

**Especialidad:** Psicometría Computacional del Lenguaje  
**Modelo:** IRT 2PL Gauss-Hermite · ELO con Decaimiento Temporal  

---

## 1. MODELO LOGÍSTICO IRT 2PL PARA COLOCACIÓN CEFR

$$P_i(\theta) = \frac{1}{1 + \exp\left(-1.702 \cdot a_i (\theta - b_i)\right)}$$

- $\theta \in [-3.0, +3.0]$: Nivel de competencia lingüística latente del alumno.
- $b_i$: Dificultad intrínseca del ítem comunicativo/fonético.
- $a_i$: Parámetro de discriminación.

$$\text{SE}(\hat{\theta}) = \frac{1}{\sqrt{\text{TIF}(\hat{\theta})}} \le 0.28 \quad (\text{Confianza } \ge 92\%)$$

---

## 2. SPACED-ELO DE VOCABULARIO Y COLOCACIONES
Para cada una de las 5.000 palabras y estructuras en el inventario:

$$E_{\text{student}} = \frac{1}{1 + 10^{\frac{R_{\text{item}} - R_{\text{student}}}{400}}}$$

$$R'_{\text{student}} = R_{\text{student}} + K \cdot (S - E_{\text{student}})$$

### Decaimiento Temporal de Memoria:
$$R_{\text{active}}(t) = R_{\text{floor}} + (R_{\text{student}} - R_{\text{floor}}) \cdot e^{-\lambda \cdot \Delta t} \quad (\lambda = 0.040\text{ d}^{-1})$$

---

## 3. CURVA DE 25 NIVELES DE PROGRESIÓN POLÍGLOTA
$$\text{XP}_{\text{req}}(L) = \lfloor 58.5 \cdot (L-1)^{2.08} + 91.5 \cdot (L-1) \rfloor = 45.000\text{ XP}$$
- **Soft-cap diario:** $250\text{ XP}$ (Hard cap asintótico de $380\text{ XP}$).
