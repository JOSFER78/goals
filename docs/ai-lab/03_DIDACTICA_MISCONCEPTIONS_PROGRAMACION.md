# 🐞 CATÁLOGO MAESTRO DE 15 MISCONCEPTIONS Y PROTOCOLOS POE (PREDICT-OBSERVE-EXPLAIN)
## GOALS AI Lab — Didáctica de la Programación y de la Inteligencia Artificial (6 a 15 Años)

**Marco Didáctico:** Cambio Conceptual (Posner et al., 1982), *p-prims* de diSessa, Protocolo POE (White & Gunstone, 1992), Conflicto Cognitivo y Debriefing Socrático.

---

### ÍNDICE GENERAL
1. **Marco Teórico de Cambio Conceptual en Código e IA** (Condiciones de Posner: Insatisfacción, Inteligibilidad, Plausibilidad, Fertilidad).
2. **Matriz Taxonómica Comparativa de las 15 Misconceptions**.
3. **Catálogo Detallado de las 15 Misconceptions con Protocolos POE Completos** (Predicción $\to$ Código Python de Observación $\to$ Explicación Socrática).
4. **Pautas de Mediación Docente y Prevención de Recaídas**.

---

## 1. MARCO TEÓRICO DE CAMBIO CONCEPTUAL POE

```
+----------------------------------------------------------------------------------------------------+
|                         CICLO DE CAMBIO CONCEPTUAL POE (GOALS AI LAB)                              |
+====================================================================================================+
|  1. PREDECIR (Predict)   -->  El alumno formula una hipótesis explícita y su justificación.        |
|  2. OBSERVAR (Observe)   -->  Ejecución de código real en cliente (Wasm/WebGPU). Choque cognitivo. |
|  3. EXPLICAR (Explain)   -->  Debriefing socrático: reconciliación del modelo mental y andamiaje.   |
+----------------------------------------------------------------------------------------------------+
```

1. **Insatisfacción Cognitiva:** El estudiante comprueba empíricamente que su predicción intuitiva falla ante el comportamiento del intérprete o modelo (*Discrepant Event*).
2. **Inteligibilidad:** Se proporciona una metáfora anclada en la arquitectura física de la máquina o en la estadística matricial.
3. **Plausibilidad:** El nuevo modelo mental explica coherentemente tanto el caso anómalo como los casos previos.
4. **Fertilidad (*Fruitfulness*):** El estudiante utiliza el nuevo esquema para predecir con éxito nuevos problemas computacionales.

---

## 2. MATRIZ TAXONÓMICA DE LAS 15 MISCONCEPTIONS

| ID | Preconcepto Erróneo | Dominio | Tramo | Raíz Cognitiva | Disparador de Conflicto | Estándar CSTA / LOMLOE |
|---|---|---|---|---|---|---|
| **M1** | `=` como equivalencia algebraica simétrica | Algoritmia & Memoria | 6–11 | Transferencia negativa de matemáticas escolares | `x = 5; x = x + 1; print(x)` | CSTA 1B-AP-09 / LOMLOE Mat |
| **M2** | Bucle como acelerador de tiempo de CPU | Arquitectura & Flujo | 6–9 | Confusión entre compresión sintáctica y ciclos CPU | Benchmark `for` vs 10 líneas secuenciales con `perf_counter` | CSTA 1A-AP-10 / LOMLOE CyT |
| **M3** | Asignación `b = a` como copia profunda de listas | Memoria & Punteros | 10–15 | Modelo ingenuo de recipientes independientes | `a = [1, 2]; b = a; b.append(3); print(a)` | CSTA 2-AP-11 / LOMLOE Prog |
| **M4** | Pensamiento mágico y antropomorfismo en IA | Inteligencia Artificial | 6–11 | Proyección animista e ilusión de consciencia | Árbol determinista que cambia con 1 carácter | CSTA 1B-IC-18 / UNESCO AI L1 |
| **M5** | Confusión entre Entrenamiento e Inferencia | Machine Learning | 10–15 | Ilusión de aprendizaje continuo en tiempo real | Inspección de pesos $W$ estáticos en `predict()` vs `fit()` | CSTA 3A-AP-13 / UNESCO AI L2 |
| **M6** | El Loro Estocástico: IA como entidad semántica | LLMs & NLP | 12–15 | Falacia de fluidez lingüística = comprensión | Generación con temperatura y muestreo de logits | CSTA 3A-IC-24 / LOMLOE Dig |
| **M7** | Sobreajuste: 100% de precisión como meta ideal | Machine Learning | 12–15 | Transferencia del examen escolar (10/10 memorístico) | Polinomio grado 4 con $Loss_{train}=0$ y colapso en Test | CSTA 3A-AP-14 / UNESCO AI L2 |
| **M8** | Confusión de Correlación con Causalidad | Datos & Estadística | 12–15 | Sesgo de confirmación y búsqueda causal intuitiva | Regresión con variable de confusión oculta (Helados vs Ahogamientos) | CSTA 2-DA-08 / LOMLOE Mat |
| **M9** | Principio GIGO: "La máquina elimina el sesgo humano" | Ética & Algoritmia | 10–15 | Falacia de objetividad matemática de la máquina | Clasificador que reproduce y amplifica sesgo histórico | CSTA 2-IC-21 / EU AI Act |
| **M10** | Alucinaciones en LLMs como "mentiras maliciosas" | Modelos Generativos | 10–15 | Atribución de intencionalidad moral | Análisis de probabilidades Softmax y falta de Ground Truth | CSTA 3A-IC-26 / UNESCO AI L2 |
| **M11** | Ámbito de variables (*Scope* Local vs Global) | Arquitectura & Funciones | 10–15 | Espacio de nombres plano (*flat namespace*) | Modificación local que no afecta variable global homónima | CSTA 2-AP-14 / LOMLOE Prog |
| **M12** | Condiciones compuestas `or "s"` y cortocircuito | Lógica Booleana | 8–13 | Sintaxis del lenguaje natural coloquial | `if opcion == "si" or "s":` siempre evalúa a `True` | CSTA 2-AP-12 / LOMLOE Mat |
| **M13** | Caja negra de gradientes como "adivinanza al azar" | Deep Learning | 14–15 | Misticismo tecnológico vs cálculo multivariable | Backprop analítico $\nabla L$ vs Búsqueda Aleatoria | CSTA 3B-AP-10 / LOMLOE Bach |
| **M14** | Recursión como bucle infinito sin memoria | Algorítmica Avanzada | 12–15 | Falta de visibilidad de la Pila de Llamadas (*Stack*) | Traza de desapilado (*unwinding*) y `RecursionError` | CSTA 3A-AP-15 / LOMLOE CyT |
| **M15** | Tensores como meras listas de números sin forma | Álgebra Tensorial | 14–15 | Ceguera dimensional (*Rank* vs *Shape* vs *Broadcasting*) | `ValueError: operands could not be broadcast together (3,4) (2,4)` | CSTA 3B-AP-08 / UNESCO AI L3 |

---

## 3. CATÁLOGO DE LAS 15 MISCONCEPTIONS Y PROTOCOLOS POE

### 🟢 M1: Signo igual `=` como operador de equivalencia simétrica vs Asignación destructiva
- **Predecir (P):** *«Si `a = 10`, luego `b = a`, y después `b = 20`, ¿qué imprimirá `print(a)`?»* (Predicción errónea típica: `20`).
- **Observar (O):**
```python
a = 10
b = a
b = 20
print(f"a: {a}, b: {b}") # Imprime: a: 10, b: 20
```
- **Explicar (E):** `=` copia el valor de la derecha a la celda de memoria de la izquierda en ese instante; no crea un vínculo eterno entre variables.

---

### 🟢 M2: Bucle como acelerador de tiempo de CPU
- **Predecir (P):** *«¿Qué tarda menos tiempo de CPU: sumar 1 diez veces en 10 líneas o un bucle `for _ in range(10):`?»*
- **Observar (O):**
```python
import time
t0 = time.perf_counter_ns()
x = 0; x+=1; x+=1; x+=1; x+=1; x+=1; x+=1; x+=1; x+=1; x+=1; x+=1
t_seq = time.perf_counter_ns() - t0

t1 = time.perf_counter_ns()
y = 0
for _ in range(10): y += 1
t_loop = time.perf_counter_ns() - t1
print(f"Secuencial: {t_seq} ns vs Bucle: {t_loop} ns")
```
- **Explicar (E):** El bucle añade instrucciones de incremento y chequeo de salto (`CMP`, `JMP`); ahorra tiempo al programador al escribir, no a la CPU al ejecutar.

---

### 🟢 M3: Asignación de listas `b = a` como copia independiente
- **Predecir (P):** *«Si `a = [1, 2]`, `b = a` y `b.append(3)`, ¿qué contiene `a`?»*
- **Observar (O):**
```python
a = [1, 2]
b = a
b.append(3)
print(f"a: {a} (id: {hex(id(a))})") # a: [1, 2, 3]
print(f"b: {b} (id: {hex(id(b))})") # Mismo ID de memoria
```
- **Explicar (E):** En objetos mutables, la variable guarda un puntero a la dirección del Heap; `b = a` solo copia la dirección, no la lista. Para clonar: `b = a.copy()`.

---

### 🟡 M4: Pensamiento mágico y antropomorfismo en IA
- **Predecir (P):** *«Si le dices al bot "No estoy triste para nada", ¿sentirá alivio?»*
- **Observar (O):**
```python
def bot(msg: str) -> str:
    if "triste" in msg.lower(): return "Siento mucho tu tristeza."
    return "Entendido."
print(bot("No estoy triste para nada")) # Responde lamento porque solo busca el substring!
```
- **Explicar (E):** La IA no tiene sentimientos ni consciencia; es un evaluador determinista de tokens y palabras clave.

---

### 🟡 M5: Confusión entre Entrenamiento e Inferencia
- **Predecir (P):** *«¿Cambian los pesos $W$ de una red neuronal cuando realiza predicciones con `model.predict()`?»*
- **Observar (O):**
```python
peso_w = 2.71828
def predict(x): return peso_w * x
for val in [1.0, 5.0, 10.0]:
    p = predict(val)
print(f"Peso tras 3 inferencias: {peso_w} (Exactamente inmutable)")
```
- **Explicar (E):** La inferencia es de solo lectura (Forward Pass). Los pesos solo mutan durante el entrenamiento (Backpropagation).

---

### 🟡 M6: El Loro Estocástico: Comprensión vs Probabilidades Softmax
- **Predecir (P):** *«¿Sabe un LLM qué es el agua cuando completa "El agua moja"?»*
- **Observar (O):**
```python
import numpy as np
vocab = ["moja", "quema", "vuela"]
logits = np.array([5.2, 0.1, -1.5])
probs = np.exp(logits) / np.sum(np.exp(logits))
for w, p in zip(vocab, probs):
    print(f"P({w}) = {p*100:.2f}%")
```
- **Explicar (E):** Un LLM no tiene percepción física del mundo; predice el token estadísticamente más probable a partir de billones de textos.

---

### 🟡 M7: Sobreajuste (*Overfitting*) vs Generalización
- **Predecir (P):** *«¿Un modelo con 100% de acierto en entrenamiento siempre será mejor en datos nuevos de test?»*
- **Observar (O):**
```python
import numpy as np
x_tr = np.array([1, 2, 3, 4, 5]); y_tr = 2*x_tr + 1 + np.random.normal(0, 0.5, 5)
x_te = np.array([1.5, 3.5]); y_te = 2*x_te + 1 + np.random.normal(0, 0.5, 2)
p1 = np.poly1d(np.polyfit(x_tr, y_tr, 1)) # Grado 1
p4 = np.poly1d(np.polyfit(x_tr, y_tr, 4)) # Grado 4 (memoriza)
print(f"MSE Test Lineal: {np.mean((y_te - p1(x_te))**2):.4f}")
print(f"MSE Test Grado 4: {np.mean((y_te - p4(x_te))**2):.4f} (¡Colapso!)")
```
- **Explicar (E):** Memorizar el ruido del entrenamiento destruye la capacidad de generalizar a situaciones nuevas.

---

### 🟡 M8: Correlación vs Causalidad en Machine Learning
- **Predecir (P):** *«Si la venta de helados correlaciona con ataques de tiburón, ¿prohibir los helados salvará vidas?»*
- **Observar (O):**
```python
import numpy as np
temp = np.random.uniform(20, 38, 100) # Variable oculta (Confounder)
helados = 50 * temp + np.random.normal(0, 10, 100)
tiburones = 0.3 * temp + np.random.normal(0, 1, 100)
print(f"Correlación r: {np.corrcoef(helados, tiburones)[0,1]:.3f}")
```
- **Explicar (E):** Una tercera variable latente (el calor del verano) causa ambas cosas. La IA solo ve correlación numérica, no causalidad física.

---

### 🟡 M9: Principio GIGO (*Garbage In, Garbage Out*)
- **Predecir (P):** *«¿El algoritmo corregirá automáticamente el machismo de los datos históricos de contratación?»*
- **Observar (O):**
```python
# Pesos aprendidos minimizando error sobre histórico sesgado:
peso_exp = 0.5; peso_mujer = -3.0
def contratar(exp, es_mujer):
    return "CONTRATAR" if (exp * peso_exp + es_mujer * peso_mujer) > 2.0 else "RECHAZAR"
print("Mujer Exp=8:", contratar(8, 1)) # RECHAZADA por sesgo aprendido
print("Hombre Exp=5:", contratar(5, 0)) # CONTRATADO con menor experiencia
```
- **Explicar (E):** La IA reproduce y magnifica los sesgos de los datos con los que fue entrenada (*Garbage In, Garbage Out*).

---

### 🟡 M10: Alucinaciones en LLMs como Mentiras Deliberadas
- **Predecir (P):** *«Si le preguntas por un libro falso de Einstein en 2024, ¿inventará un título por maldad?»*
- **Observar (O):**
```python
def simular_llm():
    return "En 2024 se editó 'Einstein: Tratado sobre la Propulsión Cuántica'."
print(simular_llm()) # Fluidez gramatical perfecta, verdad fáctica nula.
```
- **Explicar (E):** El modelo no tiene intención de mentir; busca combinaciones de tokens coherentes y verosímiles ante la ausencia de datos reales.

---

### 🔵 M11: Ámbito de Variables (*Scope* Local vs Global)
- **Predecir (P):** *«Si dentro de `def f(): puntos = 50`, ¿cambiará la variable global `puntos = 10`?»*
- **Observar (O):**
```python
puntos = 10
def ganar():
    puntos = 50 # Variable local en el Call Stack Frame
ganar()
print("Puntos globales:", puntos) # Imprime 10
```
- **Explicar (E):** Cada función tiene su propio marco en la pila de llamadas (*Stack Frame*) con sus variables locales aisladas del entorno global.

---

### 🔵 M12: Condiciones Compuestas Lógicas y Cortocircuito
- **Predecir (P):** *«Si `fruta = "platano"`, ¿qué imprimirá `if fruta == "manzana" or "pera":`?»*
- **Observar (O):**
```python
fruta = "platano"
if fruta == "manzana" or "pera":
    print("¡Evaluó a Verdadero!") # 'pera' es un string no vacío (Truthy)
```
- **Explicar (E):** En Python, `or` evalúa dos expresiones completas. `"pera"` siempre es `True`. La forma correcta es `if fruta == "manzana" or fruta == "pera":`.

---

### 🟣 M13: Caja Negra de Gradientes vs Derivadas Analíticas
- **Predecir (P):** *«¿Una red neuronal de 1M de pesos aprende probando números al azar?»*
- **Observar (O):**
```python
import numpy as np
w = 0.0 # Objetivo: w = 3.5 (Loss = (w - 3.5)^2)
for _ in range(10): # 10 pasos con gradiente analítico dL/dw = 2*(w - 3.5)
    w -= 0.2 * (2 * (w - 3.5))
print(f"w tras 10 pasos de gradiente: {w:.4f} (Error: {(w-3.5)**2:.6f})")
```
- **Explicar (E):** El Descenso de Gradiente no adivina al azar; calcula la pendiente matemática exacta de la función de pérdida mediante la Regla de la Cadena.

---

### 🟣 M14: Recursión como Bucle Infinito vs Pila de Llamadas
- **Predecir (P):** *«¿Qué imprimirá `cuenta(2)` si imprime `n`, se llama con `n-1` y luego vuelve a imprimir `n`?»*
- **Observar (O):**
```python
def cuenta(n):
    print(f"Apila: {n}")
    if n > 0: cuenta(n - 1)
    print(f"Desapila (Unwinding): {n}")
cuenta(2)
```
- **Explicar (E):** La recursión apila marcos en el Call Stack y, al alcanzar el caso base, los desapila en orden inverso (LIFO).

---

### 🟣 M15: Formas de Tensores y Reglas de Broadcasting
- **Predecir (P):** *«¿Se puede sumar un tensor de forma `(3, 4)` con uno de `(2, 4)`?»*
- **Observar (O):**
```python
import numpy as np
A = np.ones((3, 4))
B_inv = np.ones((2, 4))
try:
    print(A + B_inv)
except ValueError as e:
    print("Error capturado:", e)
B_val = np.ones((1, 4)) # Dimensión 1 sí es compatible por difusión
print("Suma con Broadcasting (1,4) -> (3,4):\n", (A + B_val).shape)
```
- **Explicar (E):** El broadcasting exige que las dimensiones sean iguales o que una de ellas sea 1 para poder replicarse de forma determinista.
