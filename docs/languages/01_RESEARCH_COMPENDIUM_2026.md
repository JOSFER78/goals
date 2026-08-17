# 📚 COMPENDIO DE INVESTIGACIÓN LINGÜÍSTICA Y SLA 2026
## GOALS Languages — Estado del Arte en Adquisición de Segundas Lenguas (6 a 15 Años)

**Marco Teórico:** Second Language Acquisition (SLA), Psicolingüística Evolutiva, Fonética Acústica Pediátrica, Modelos Neurocognitivos del Bilingüismo (Paradis, Ullman - Declarative/Procedural Model).

---

### ÍNDICE GENERAL
1. **Fundamentos Neurocognitivos del Período Crítico (Lenneberg) y Plasticidad Fonológica**.
2. **Jerarquía y Orden Natural de Adquisición Morfosintáctica (Goldschneider & DeKeyser)**.
3. **Bioacústica del Tracto Vocal Infantil: F0 y Formantes F1–F4**.
4. **Métrica Goodness of Pronunciation (GOP) Adaptativa y Modelos ASR (Whisper ONNX Wasm)**.
5. **Andamiaje Pragmático, Negociación de Significado y Desescalada del Filtro Afectivo**.

---

## 1. NEUROBIOLOGÍA Y PERÍODO CRÍTICO EN ADQUISICIÓN L2

La adquisición lingüística en la infancia temprana (6 a 9 años) se apoya predominantemente en la **memoria procedimental implícita** (circuitos córtico-estriatales), permitiendo la asimilación fonotáctica y morfofonémica sin instrucción metalingüística formal.

```
       MEMORIA PROCEDIMENTAL (6–9 años)              MEMORIA DECLARATIVA (12–15 años)
     ┌──────────────────────────────────┐          ┌──────────────────────────────────┐
     │ • Circuitos Córtico-Estriatales  │          │ • Hipocampo & Lóbulo Temporal    │
     │ • Adquisición implícita natural  │          │ • Reglas gramaticales explícitas │
     │ • Sintonización fonológica nativa│          │ • Control metalingüístico formal │
     └──────────────────────────────────┘          └──────────────────────────────────┘
```

- **Sintonización Fonológica:** Antes de los 8–9 años, los niños retienen la plasticidad sináptica para establecer representaciones categoriales de fonemas no presentes en su L1 (ej. la distinción entre /b/ oclusiva y /v/ labiodental, o los contrastes vocálicos ingleses /iː/ vs /ɪ/ en *sheep* vs *ship*).
- **A partir de los 10–12 años:** Se consolida la dominancia de la memoria declarativa (lóbulo temporal medial e hipocampo), requiriendo andamiaje visual explícito (*Grammar-as-Structure*) y práctica deliberada.

---

## 2. ORDEN NATURAL DE ADQUISICIÓN DE MORFEMAS (GOLDSCHNEIDER & DEKEYSER)

La adquisición morfosintáctica en inglés como L2 no sigue el orden tradicional de los libros de texto, sino una secuencia universal determinada por la saliencia perceptiva, complejidad fonética y frecuencia:

$$\text{Facilidad de Adquisición} \propto \text{Saliencia Perceptiva} + \text{Regularidad Fonológica} + \text{Frecuencia Semántica}$$

| Fase de Adquisición | Morfemas y Estructuras | Ejemplos en Diálogo Situacional | Estrategia GOALS |
| :--- | :--- | :--- | :--- |
| **Fase 1 (6–7 años)** | Gerundio `-ing`, Plural regular `-s`, Cópula `be` (*is/are*). | *"Eating apple"*, *"Two dogs"*, *"She is happy"*. | Imput auditivo masivo en roleplays 3D. |
| **Fase 2 (8–9 años)** | Artículos `a/the`, Pasado irregular frecuente (*went, saw, broke*). | *"A big train"*, *"I went to London"*. | Chunks léxicos y narrativas ilustradas. |
| **Fase 3 (10–11 años)** | Pasado regular `-ed` (/t/, /d/, /ɪd/), 3ª Persona `-s` (*runs*), Posesivo `'s`. | *"He walked"*, *"My brother's car"*. | *Noticing the gap* con corrección socrática. |
| **Fase 4 (12–13 años)** | Auxiliares modales (*can, must, should*), Pasado Continuo, Comparativos. | *"You should rest"*, *"Faster than light"*. | Dilemas morales y argumentación situacional. |
| **Fase 5 (14–15 años)** | Pasado Perfecto, Voz Pasiva, Tercer Condicional, Inversión. | *"If I had known..."*, *"Was built in 1900"*. | Ensayos académicos y debates competitivos. |

---

## 3. BIOACÚSTICA PEDIÁTRICA Y RECONOCIMIENTO DE VOZ EN CLIENTE

Los motores tradicionales de reconocimiento de voz (ASR) entrenados con voces adultas colapsan ante el habla infantil debido a diferencias anatómicas fundamentales:

1. **Longitud del Tracto Vocal:** $10.5\text{ cm}$ a los 6 años frente a $17.5\text{ cm}$ en adultos masculinos.
2. **Formantes Acústicos Elevados:**
   - Formante 1 ($F_1$): Abertura mandibular ($300 - 1100\text{ Hz}$).
   - Formante 2 ($F_2$): Posición lingual anteroposterior ($1000 - 3200\text{ Hz}$, desplazado $+30\%$).
   - Formante 3 ($F_3$) y 4 ($F_4$): Resonancias del tracto superior ($3000 - 5500\text{ Hz}$).
3. **Frecuencia Fundamental ($F_0$):** $260 - 340\text{ Hz}$ en niños de 6 a 8 años, con alta variabilidad tímbrica.

```
       ADULTO (Tracto 17 cm)                     NIÑO 7 AÑOS (Tracto 11 cm)
   ┌───────────────────────────┐             ┌───────────────────────────┐
   │ F0: 100 - 160 Hz          │             │ F0: 260 - 350 Hz (Agudo)  │
   │ F1: 500 Hz | F2: 1500 Hz  │             │ F1: 750 Hz | F2: 2200 Hz  │
   │ F3: 2500 Hz               │             │ F3: 3800 Hz (+30% Shifting│
   └───────────────────────────┘             └───────────────────────────┘
```

---

## 4. MÉTRICA GOODNESS OF PRONUNCIATION (GOP) ADAPTATIVA

GOALS implementa la métrica GOP calculada a partir de las probabilidades a posteriori de la red acústica de Whisper ONNX:

$$\text{GOP}(p) = \frac{1}{|T_p|} \sum_{t \in T_p} \log \left( \frac{P(o_t \mid s_p)}{\sum_{q \in \mathcal{P}} P(o_t \mid s_q)} \right)$$

- **Normalización Acústica Pediátrica:** Se aplica un escalado de frecuencia bilinear (*Vocal Tract Length Normalization - VTLN*) con factor $\alpha \approx 1.18$ para mapear el espectrograma infantil al espacio acústico de referencia.
- **Tolerancia Psicolingüística:** Si $\text{GOP} \ge \theta_{\text{age}}$, se concede aprobación fonética. Si $\text{GOP} < \theta_{\text{age}}$, se activa un *Recast* conversacional natural del tutor sin interrumpir el flujo.

---

## 5. ANDAMIAJE PRAGMÁTICO Y DESESCALADA DEL FILTRO AFECTIVO

Siguiendo la hipótesis del Filtro Afectivo de Krashen, la ansiedad, la vergüenza o la corrección punitiva bloquean la adquisición. GOALS aplica:
- **Recasts Implícitos:** Si el alumno dice *"Yesterday I go to cinema"*, el tutor IA responde: *"Oh, you went to the cinema! What movie did you see?"* (modelado natural sin reproche).
- **Andamiaje Bimodal:** Apoyo simultáneo con subtítulos dinámicos, gestos del avatar 3D y pistas visuales desplegables a demanda.
