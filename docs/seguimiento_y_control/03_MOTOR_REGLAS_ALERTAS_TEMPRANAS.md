# 🧠 MOTOR DE INTELIGENCIA DE ALERTAS Y DETECCIÓN DE RIESGO ACADÉMICO (GOALS)

> **Módulo:** Seguimiento y Control • Capa 3: Motor Psicométrico y Alertas Proactivas  
> **Estado:** Tratado de Ingeniería y Modelado Matemático (Cero Mocks / 100% Determinista)  
> **Modelos:** Bayesian Knowledge Tracing (BKT $\mathcal{O}(1)$), Decaimiento FSRS/Ebbinghaus, Exam Readiness Index (ERI), Traversal DAG de Prerrequisitos y Rate Limiting Anti-Saturación.

---

## 1. 📐 FUNDAMENTACIÓN MATEMÁTICA Y MODELADO PSICOMÉTRICO

El motor de alertas tempranas de GOALS no se basa en heurísticas arbitrarias ni encuestas subjetivas, sino en la interacción determinista de cuatro modelos psicométricos y temporales continuos:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MODELO MULTI-CAPA DE EVALUACIÓN DETERMINISTA                     │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Bayesian Knowledge Tracing (BKT) ──> Probabilidad de Dominio Latente $P(L_t) \in [0, 1]$       │
│ 2. Ebbinghaus / FSRS Memory Decay  ──> Decaimiento por Inactividad $P(L_k, t) = P(L_0) \cdot e^{-\Delta t/S_k}$ │
│ 3. Curricular Dependency DAG       ──> Traversal de Prerrequisitos e Identificación de Causa Raíz│
│ 4. Exam Readiness Index (ERI)      ──> Ponderación Curricular y Frescura $\in [0, 100]\%$         │
│ 5. Priority & Anti-Saturation Filter──> Token Bucket, Cooldown Matrix y Resumen Vespertino       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.1. Bayesian Knowledge Tracing (BKT $\mathcal{O}(1)$)
Para cada micro-concepto curricular $k \in \mathcal{K}$, el estado de conocimiento latente $L_t$ se actualiza de forma estocástica y bayesiana tras cada respuesta $u_t \in \{0, 1\}$ (0 = error, 1 = acierto):

1. **Paso de Inferencia Condicional (Actualización de Evidencia):**
   - Si la respuesta fue **correcta ($u_t = 1$):**
     $$P(L_t \mid u_t = 1) = \frac{P(L_t) \cdot (1 - s)}{P(L_t) \cdot (1 - s) + (1 - P(L_t)) \cdot g}$$
   - Si la respuesta fue **incorrecta ($u_t = 0$):**
     $$P(L_t \mid u_t = 0) = \frac{P(L_t) \cdot s}{P(L_t) \cdot s + (1 - P(L_t)) \cdot (1 - g)}$$

2. **Paso de Transición de Aprendizaje (Proyección Temporal):**
   $$P(L_{t+1}) = P(L_t \mid u_t) + (1 - P(L_t \mid u_t)) \cdot P(T)$$

**Parámetros calibrados en GOALS:**
- $P(L_0) = 0.10$ (Conocimiento previo base).
- $P(T) = 0.20$ (Tasa de transición por reto completado).
- $s = 0.10$ (Probabilidad de desliz/slip: sabe el concepto pero erró por despiste).
- $g = 0.25$ (Probabilidad de acierto por azar/guess).

---

### 1.2. Decaimiento de Memoria por Inactividad (FSRS / Ebbinghaus)
La maestría efectiva decae si el alumno no practica el nodo $k$ según la estabilidad $S_k$ (días de vida media de memoria consolidada):

$$P(L_k, t_{\text{eval}}) = P(L_k, t_{\text{last}}) \cdot \exp\left( - \frac{\ln(10/9) \cdot (t_{\text{eval}} - t_{\text{last\_practice}})}{S_k} \right)$$

Donde $S_k$ se actualiza tras cada sesión espaciada:
$$S_{k, n+1} = S_{k, n} \cdot \left(1 + 0.35 \cdot \min(\text{streak}, 5)\right)$$

---

### 1.3. Índice de Preparación de Examen (Exam Readiness Index - ERI)
Para un examen $\mathcal{E}$ con fecha $T_{\text{exam}}$ y temario $\mathcal{K}_{\mathcal{E}} = \{k_1, \dots, k_m\}$ con pesos normalizados $w_k$:

1. **Maestría Agregada Decaída:**
   $$M_{\mathcal{E}}(t_{\text{now}}) = \sum_{k \in \mathcal{K}_{\mathcal{E}}} w_k \cdot P(L_k, t_{\text{now}})$$

2. **Factor de Frescura de Práctica ($\phi_{\text{freshness}}$):**
   $$\phi_{\text{freshness}} = \frac{1}{|\mathcal{K}_{\mathcal{E}}|} \sum_{k \in \mathcal{K}_{\mathcal{E}}} \mathbb{I}\left( (t_{\text{now}} - t_{\text{last\_practice}, k}) \le 48\text{ h} \right)$$

3. **Cálculo Determinista del ERI:**
   $$\text{ERI}(t_{\text{now}}) = M_{\mathcal{E}}(t_{\text{now}}) \times \left( 0.70 + 0.30 \cdot \phi_{\text{freshness}} \right) \times 100\%$$

---

### 1.4. Traversal de Grafo DAG para Detección de Laguna Prerrequisito
Dado el grafo curricular $G = (\mathcal{V}, \mathcal{E})$ donde $(u, v) \in \mathcal{E} \implies u \prec v$:

Si el alumno falla en el concepto objetivo $v$ ($u_t(v) = 0$ o $P(L_v) < 0.50$):
$$\text{LagunaDetectada}(u) \iff u \in \text{Ancestors}(v) \quad \land \quad P(L_u, t_{\text{now}}) < \theta_{\text{gap}} = 0.65$$

Esto identifica la **causa raíz**: el alumno no suspende álgebra porque no entienda la ecuación, sino porque arrastra una laguna no consolidada en fracciones o números enteros.

---

## 2. 📋 CATÁLOGO DE DISPARADORES Y 5 REGLAS EN TIEMPO REAL

| Regla ID | Nombre | Tipo de Disparador | Condición Formal / Algorítmica | Severidad | Redacción Calibrada (Lenguaje Humano, Cero Estrés) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RULE-01** | **Deberes Pendientes del Día** | Cron Diario `18:30` | $\exists h \in \text{Homeworks} : \text{due} = \text{Tomorrow} \land \text{status} \neq \text{'COMPLETED'} \land \text{minToday} == 0$ | `WARNING (P2)` | *"Hola [Padre], Álex tiene para mañana deberes de [Materia] ([Detalle]). Aún no ha abierto la sesión en GOALS. ¡Un recordatorio suave antes de cenar le ayudará a dejarlos listos sin prisas!"* |
| **RULE-02** | **Examen Inminente sin Preparación** | Cron Horario + Ingesta | $(T_{\text{exam}} - t_{\text{now}}) \le 48\text{ h} \land (\Delta t_{\text{practice}} \ge 48\text{ h} \lor \text{ERI} < 70\%)$ | `CRITICAL (P1)` | *"Álex tiene examen de [Materia] el [Día] ([Tema]) y su preparación actual es del [ERI]%. Hemos preparado una sesión relámpago de 10 min para afianzar los conceptos clave."* |
| **RULE-03** | **Laguna Crítica Prerrequisito Pre-Examen** | Event-Driven `TEST_SUBMITTED` | $\text{HasExamInDays}(\le 7) \land u_t(k_{\text{target}}) = 0 \land \exists k_{\text{pre}} : P(L_{k_{\text{pre}}}) < 0.65$ | `WARNING (P2)` | *"Hemos detectado por qué a Álex le cuesta '[Tema actual]': la base de '[Concepto prerrequisito]' necesita un pequeño repaso. El tutor ya le ha propuesto una actividad interactiva para desbloquearlo."* |
| **RULE-04** | **Inactividad Prolongada con Compromisos** | Cron Diario `17:00` | $(t_{\text{now}} - t_{\text{last\_login}}) \ge 48\text{ h} \land (\text{CountPendingTasks} > 0 \lor \text{HasExamInDays}(\le 5))$ | `INFO (P3)` | *"Álex lleva 2 días sin entrar en GOALS y tiene entregas esta semana ([Materia]). ¿Le animas a hacer un reto rápido de 5 minutos hoy?"* |
| **RULE-05** | **Celebración de Éxito y Racha** | Event-Driven `STREAK` | $(\text{Score}_{\text{sim}} \ge 90\%) \lor (\text{StreakDays} \ge 5 \land \text{IsMilestone})$ | `CELEBRATION (P4)` | *"🌟 ¡Gran noticia! Álex acaba de sacar un [94]% en el simulacro de [Materia]. Ha demostrado un dominio excelente. ¡Felicítale hoy en casa por su esfuerzo!"* |

---

## 3. 🛡️ FILTRADO INTELIGENTE ANTI-SATURACIÓN (RATE LIMITING PARENTAL)

```typescript
export class ParentalNotificationDispatcher {
  private static readonly MAX_INSTANT_PUSH_PER_DAY = 2;
  private static readonly COOLDOWN_HOURS_PER_RULE = 24;

  public static processAlert(
    alert: GeneratedAlert,
    familyState: FamilyNotificationState
  ): { sendImmediately: boolean; addToEveningDigest: boolean } {
    const now = new Date();

    // 1. Comprobar ventana de Cooldown por regla idéntica (24h)
    const lastSentForRule = familyState.sentRuleCooldownMap.get(alert.ruleId);
    if (lastSentForRule) {
      const hoursSince = (now.getTime() - lastSentForRule.getTime()) / (1000 * 3600);
      if (hoursSince < this.COOLDOWN_HOURS_PER_RULE) {
        return { sendImmediately: false, addToEveningDigest: false };
      }
    }

    // 2. Alertas Críticas (P1) siempre tienen pase directo prioritario
    if (alert.severity === 'CRITICAL') {
      return { sendImmediately: true, addToEveningDigest: false };
    }

    // 3. Control de Cuota Máxima Diaria (máx 2 avisos push/día)
    if (familyState.alertsSentToday < this.MAX_INSTANT_PUSH_PER_DAY) {
      return { sendImmediately: true, addToEveningDigest: false };
    }

    // 4. Si supera cuota, acumular para el Resumen Vespertino (20:00)
    return { sendImmediately: false, addToEveningDigest: true };
  }
}
```
