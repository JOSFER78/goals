# 02 · CURRÍCULO DETALLADO: LOS 12 MÓDULOS DE IA LAB

**Producto:** GOALS · IA LAB  
**Estructura:** 12 Módulos Progresivos, 4 Pasos Interactivos por Módulo, 36 Preguntas de Evaluación y Conexión con 6 Sandboxes.

---

## Matriz Curricular Resumida

| Módulo | Título | Área Competencial | Nivel | XP | Sandbox Vinculado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M01** | ¿Qué es (y qué no es) la IA? | Fundamentos | Nivel 1 | 50 XP | `neural_lab` |
| **M02** | Los Datos: El Alimento de la Máquina | Fundamentos | Nivel 1 | 55 XP | `ethics_bias` |
| **M03** | ¿Cómo Aprende una Máquina? | Mecanismo | Nivel 2 | 65 XP | `neural_lab` |
| **M04** | Visión por Computador: Píxeles a Conceptos | Lenguaje & Visión | Nivel 2 | 60 XP | `vision_lab` |
| **M05** | El Lenguaje de las Máquinas: Tokens & Embeddings | Lenguaje & Visión | Nivel 2 | 65 XP | `token_lab` |
| **M06** | La Siguiente Palabra: Cómo Predicen los LLMs | Lenguaje & Visión | Nivel 3 | 70 XP | `token_lab` |
| **M07** | Alucinaciones y Límites: Por Qué la IA Inventa | Forense & Límites | Nivel 2 | 65 XP | `hallucinations` |
| **M08** | Creatividad Aumentada: Generar con IA | Creación | Nivel 2 | 60 XP | `creative_studio` |
| **M09** | Sesgos Algorítmicos y Justicia | Ética & Seguridad | Nivel 2 | 65 XP | `ethics_bias` |
| **M10** | Privacidad, Seguridad y Huella Digital | Ética & Seguridad | Nivel 2 | 60 XP | `ethics_bias` |
| **M11** | Realidad vs Sintético: Deepfakes y Verificación | Forense & Límites | Nivel 3 | 70 XP | `hallucinations` |
| **M12** | El Futuro y Tú: Impacto, Ética y Carreras | Ética & Seguridad | Nivel 3 | 75 XP | `ethics_bias` |

---

## Detalle Curricular Módulo a Módulo

### Módulo 01: ¿Qué es (y qué no es) la IA?
- **Concepto clave:** La transición del paradigma de reglas explícitas (IF/THEN) al aprendizaje inductivo de funciones aproximadas a partir de datos empíricos.
- **Diferenciación crucial:** IA Estrecha (Narrow AI) frente a la hipotética IA General (AGI). Fluidez verbal no equivale a consciencia.
- **Evaluación:** Identificación de sistemas simbólicos clásicos frente a sistemas conexionistas modernos.

### Módulo 02: Los Datos: El Alimento de la Máquina
- **Concepto clave:** Principio GIGO (Garbage In, Garbage Out). La calidad y representatividad de la muestra determina el límite superior de rendimiento del modelo.
- **División de datos:** Train Set (entrenamiento) frente a Test Set (evaluación ciega).
- **Problemas fundamentales:** Sobreajuste (Overfitting) y memorización estéril frente a generalización.

### Módulo 03: ¿Cómo Aprende una Máquina?
- **Concepto clave:** La neurona artificial como combinación lineal de entradas y pesos con sesgo, proyectada a través de una función de activación no lineal.
- **Optimización:** Función de pérdida (Loss) y Descenso de Gradiente estocástico.
- **Retropropagación:** Propagación del error hacia atrás mediante la regla de la cadena para calibrar pesos.

### Módulo 04: Visión por Computador: De Píxeles a Conceptos
- **Concepto clave:** La imagen como tensor numérico tridimensional (Alto × Ancho × Canales RGB).
- **Convolución:** Operación de filtrado espacial con kernels 3×3 para extraer bordes, esquinas y gradientes.
- **Jerarquía visual:** De características elementales de bajo nivel a representaciones semánticas completas.

### Módulo 05: El Lenguaje de las Máquinas: Tokens y Embeddings
- **Concepto clave:** Tokenización por subpalabras (Byte-Pair Encoding). Vocabularios numéricos finitos.
- **Embeddings:** Proyección del lenguaje a espacios vectoriales multidimensionales continuos.
- **Geometría semántica:** Cálculo de similitud coseno y relaciones conceptuales vectoriales.

### Módulo 06: La Siguiente Palabra: Cómo Predicen los LLMs
- **Concepto clave:** Modelos de lenguaje autoregresivos generados token a token.
- **Mecanismo Transformer:** Auto-atención (Self-Attention) para ponderar dependencias de largo alcance.
- **Muestreo probabilístico:** Temperatura, Top-K y Nucleus Sampling (Top-P) para regular la estocasticidad.

### Módulo 07: Alucinaciones y Límites: Por Qué la IA Inventa
- **Concepto clave:** Confabulación estocástica como subproducto de la optimización de verosimilitud estadística sin anclaje ontológico.
- **Casos reales:** Citas jurídicas inexistentes, artículos académicos falsos y anacronismos.
- **Solución arquitectónica:** Retrieval-Augmented Generation (RAG) y lectura lateral en fuentes primarias.

### Módulo 08: Creatividad Aumentada: Generar con IA
- **Concepto clave:** Modelos de difusión en espacio latente y síntesis guiada por texto.
- **Metodología RCRF:** Arquitectura de prompts estructurados (Rol, Contexto, Tarea, Restricciones y Formato).
- **Ética de la co-creación:** Transparencia, atribución y curación humana indispensable.

### Módulo 09: Sesgos Algorítmicos y Justicia
- **Concepto clave:** Herencia y amplificación de prejuicios y desigualdades históricas en los datasets.
- **Discriminación indirecta:** Sesgos por variables proxy (código postal, aficiones, nombres).
- **Auditoría de equidad:** Métricas de paridad estadística e impacto desproporcionado.

### Módulo 10: Privacidad, Seguridad y Huella Digital
- **Concepto clave:** Ciclo de vida del dato en la nube y reutilización para reentrenamiento de modelos.
- **Vulnerabilidades:** Prompt Injection, Jailbreaks e inferencia de datos privados.
- **Marco normativo:** Reglamento General de Protección de Datos (RGPD) y derechos digitales.

### Módulo 11: Realidad vs Sintético: Deepfakes y Verificación
- **Concepto clave:** Redes GANs, clonación de voz a partir de muestras cortas y manipulación facial en directo.
- **Protocolo forense:** Detección de anomalías en ojos, dientes, simetría y respiración de audio.
- **Certificación inmutable:** Estándar C2PA y metadatos de procedencia criptográfica (Content Credentials).

### Módulo 12: El Futuro y Tú: Impacto, Ética y Carreras
- **Concepto clave:** Huella ambiental (consumo eléctrico y agua de refrigeración en centros de datos).
- **Marco regulatorio:** Clasificación de riesgos de la Ley de Inteligencia Artificial de la UE (EU AI Act).
- **Visión estratégica:** El profesional del futuro potenciado por IA (Human-in-the-loop) y el valor del criterio humano autónomo.
