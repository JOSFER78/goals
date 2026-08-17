# 🔍 DIAGNÓSTICO DE LAGUNAS COGNITIVAS Y REMEDIACIÓN DE PRERREQUISITOS
## Motor de Diagnóstico Profundo, Modelos DINA / Matriz Q, Backtracking No Punitivo y Micro-Lecciones de 120s (GOALS School)

**Marco Teórico:** Cognitive Diagnostic Models (DINA Model de de la Torre, 2009), Knowledge Space Theory (Doignon & Falmagne), Stealth Assessment (Valerie Shute) y Protocolo Neuroafectivo *Zero-Shame Knowledge Repair*.

---

### ÍNDICE GENERAL
1. **El Problema del Diagnóstico Superficial y la Causa Raíz Oculta**.
2. **Modelización Matemática: Matriz Q y Modelo DINA**.
3. **Matrices de Prerrequisitos por Materia (Matemáticas, Física/Química, Biología, Lengua, Historia, Geografía, Inglés)**.
4. **Protocolo Neuroafectivo Zero-Shame y Descenso en el Grafo (Backtracking)**.
5. **Micro-Lecciones CPA de 120 Segundos Cronometrados**.
6. **Evaluación Invisible (Stealth Assessment) y Métrica de Consolidación**.

---

## 1. EL PROBLEMA DEL DIAGNÓSTICO SUPERFICIAL

Cuando un alumno de Secundaria o Primaria falla un ejercicio, **el 85% de las veces la causa no está en el contenido que se está impartiendo hoy, sino en una laguna cognitiva previa no detectada**:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              CASOS REALES DE DIAGNÓSTICO DIFERENCIAL EN GOALS                          │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────────────────────┤
│ SÍNTOMA OBSERVABLE (FALLO) │ DIAGNÓSTICO ERRONEO TÍPICO  │ CAUSA RAÍZ REAL DETECTADA (PRERREQUISITO)   │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
│ Falla en ecuaciones:       │ "No se le da bien el        │ No comprende el **signo igual como balanza**│
│ $2x + 3 = 11 \to 2x = 14$  │ álgebra de 2.º ESO".        │ o falla en la resta de enteros negativos.   │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
│ Falla en Genética (Mendel):│ "No entiende la genética    │ No domina las **fracciones y porcentajes**  │
│ Cuadro de Punnett 3:1.     │ de 4.º ESO".                │ ni la probabilidad elemental ($1/4 = 25\%$).│
├────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
│ Falla en Estequiometría:   │ "No sabe química general    │ No comprende la **proporcionalidad directa**│
│ Moles en reacciones.       │ de 3.º/4.º ESO".            │ o la masa molecular ($M_r$) como factor.    │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
│ Falla en Sintaxis:         │ "No sabe analizar oraciones │ Confunde las **categorías gramaticales**    │
│ Confunde CD con Sujeto.    │ subordinadas".              │ (sustantivo/pronombre) con funciones.       │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
│ Falla en Cinemática MRUA:  │ "No sabe física de 4.º ESO".│ Dificultad para **despejar incógnitas** con │
│ $s = s_0 + v_0 t + 1/2at^2$│                             │ exponentes ($t^2$) o factores cuadráticos.  │
└────────────────────────────┴─────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. FORMALIZACIÓN MATEMÁTICA: MODELO DINA Y MATRIZ Q

El modelo DINA (*Deterministic Inputs, Noisy "And" Gate*) modela la probabilidad de que un alumno con un vector de maestría en atributos $\boldsymbol{\alpha}_i = (\alpha_{i1}, \dots, \alpha_{iK})$ responda correctamente al ítem $j$:

$$P(Y_{ij} = 1 \mid \boldsymbol{\alpha}_i) = g_j^{1 - \eta_{ij}} (1 - s_j)^{\eta_{ij}}$$

Donde:
- $\eta_{ij} = \prod_{k=1}^K \alpha_{ik}^{q_{jk}}$ es el indicador latente determinista (vale $1$ si el alumno domina TODOS los prerrequisitos requeridos por la Matriz Q del ítem $j$, y $0$ si le falta al menos uno).
- $s_j = P(Y_{ij} = 0 \mid \eta_{ij} = 1)$ es la probabilidad de desliz (*slip* o error por distracción teniendo el conocimiento).
- $g_j = P(Y_{ij} = 1 \mid \eta_{ij} = 0)$ es la probabilidad de adivinanza (*guess* o acierto casual sin dominar los prerrequisitos).

---

## 3. MATRICES DE PRERREQUISITOS POR MATERIA

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                    ÁRBOL DE PRERREQUISITOS EN MATEMÁTICAS                   │
  │                                                                             │
  │   [Conteo & Recta Numérica] ────► [Valor Posicional Decenas/Centenas]       │
  │                │                                     │                      │
  │                ▼                                     ▼                      │
  │   [Suma/Resta con Llevada]  ────► [Tablas & Multiplicación como Área]       │
  │                │                                     │                      │
  │                ▼                                     ▼                      │
  │   [Enteros Negativos & Balanza] ─► [Fracciones & Razones Proporcionales]    │
  │                │                                     │                      │
  │                ▼                                     ▼                      │
  │   [Ecuaciones de 1.er Grado]  ──► [Sistemas de Ecuaciones & 2.º Grado]      │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. PROTOCOLO NEUROAFECTIVO ZERO-SHAME KNOWLEDGE REPAIR

Para proteger la autoestima del estudiante y evitar la frustración o la vergüenza de "bajar de curso":

```
  1. ACEPTACIÓN EMPÁTICA  ► "¡Ojo! Este paso tiene truco y le pasa a todo el mundo."
  2. METÁFORA DEL PUENTE  ► "Para cruzar este puente con soltura, vamos a revisar una
                            herramienta rápida de 1 minuto."
  3. MICRO-LECCIÓN 120s   ► Reparación concreta con regleta visual o balanza interactiva.
  4. VALIDACIÓN RELÁMPAGO ► 1 mini-pregunta de 10 segundos para consolidar la herramienta.
  5. REGRESO VICTORIOSO   ► "¡Eso es! Ahora mira cómo el ejercicio que teníamos se resuelve solo."
```

---

## 5. MICRO-LECCIONES CPA DE 120 SEGUNDOS CRONOMETRADOS

- **Estructura fija:**
  1. *Segundo 0 a 30 (Fase Concreta/Visual):* Demostración con balanza de platillos interactiva, recta numérica o regletas.
  2. *Segundo 31 a 80 (Fase Pictórica Guiada):* El alumno mueve una ficha o ajusta un control deslizante para equilibrar el modelo.
  3. *Segundo 81 a 120 (Fase Abstracta y Conexión):* Se traduce el modelo físico a números y símbolos, regresando al problema escolar original.
