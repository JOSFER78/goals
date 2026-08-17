# 🧬 TUTOR PERSONAL SOCRÁTICO, MEMORIA PERSISTENTE Y PSICOMETRÍA
## Arquitectura de Memoria Tri-Capa, Modelo BKT con pgvector HNSW, Protocolo MAIEUTIC-4 y Esquema de Base de Datos PostgreSQL con RLS (GOALS School)

**Principio Rector:** El tutor de IA conoce profundamente al alumno: sus fortalezas, sus dudas históricas, los trucos que le funcionaron y su ritmo cognitivo, manteniendo una privacidad y seguridad estricta para menores (COPPA / GDPR-K / ENS).

---

### ÍNDICE GENERAL
1. **Arquitectura de Memoria Persistente Tri-Capa**.
2. **Modelo Semántico Probabilístico (Bayesian Knowledge Tracing - BKT)**.
3. **El Protocolo de Diálogo Socrático MAIEUTIC-4**.
4. **Esquema Relacional PostgreSQL con pgvector y Row-Level Security (RLS)**.
5. **Motor TypeScript de Coordinación de Contexto**.

---

## 1. ARQUITECTURA DE MEMORIA PERSISTENTE TRI-CAPA

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ARQUITECTURA DE MEMORIA TRI-CAPA EN GOALS                               │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. MEMORIA EPISÓDICA (pgvector HNSW)                                                                   │
│    • Registro vectorial de sesiones de estudio, fotos de deberes subidas y preguntas literales.        │
│    • Búsqueda semántica: "Recuperar la duda que tuvo con las fracciones equivalentes hace 2 semanas".  │
│                                                                                                        │
│ 2. MEMORIA SEMÁNTICA (Knowledge Graph DAG + BKT)                                                       │
│    • Grafo de conceptos curriculares (LOMLOE & UK NC) con probabilidades de dominio $P(L) \in [0, 1]$.  │
│    • Detección topológica de lagunas previas y prerrequisitos encadenados.                             │
│                                                                                                        │
│ 3. PERFIL DINÁMICO DEL ALUMNO                                                                          │
│    • Edad (6 a 15a), curso escolar, intereses personales (deportes, videojuegos, arte, animales).      │
│    • Calibración emocional: nivel de tolerancia a la frustración y ritmo de atención óptimo.           │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. FORMALIZACIÓN MATEMÁTICA DE BAYESIAN KNOWLEDGE TRACING (BKT)

Para cada nodo conceptual $k$, el estado de conocimiento latente $L_t$ se actualiza tras cada interacción $u_t \in \{0, 1\}$ (0 = fallo, 1 = acierto):

1. **Paso de Inferencia Condicional:**
   - Si la respuesta fue **correcta ($u_t = 1$):**
     $$P(L_t \mid u_t = 1) = \frac{P(L_t) \cdot (1 - s)}{P(L_t) \cdot (1 - s) + (1 - P(L_t)) \cdot g}$$
   - Si la respuesta fue **incorrecta ($u_t = 0$):**
     $$P(L_t \mid u_t = 0) = \frac{P(L_t) \cdot s}{P(L_t) \cdot s + (1 - P(L_t)) \cdot (1 - g)}$$
2. **Paso de Transición de Aprendizaje:**
   $$P(L_{t+1}) = P(L_t \mid u_t) + (1 - P(L_t \mid u_t)) \cdot P(T)$$

Donde $P(L_0) \approx 0.10$ (conocimiento previo), $P(T) \approx 0.20$ (probabilidad de aprendizaje), $s \approx 0.10$ (desliz) y $g \approx 0.25$ (adivinanza).

---

## 3. EL PROTOCOLO SOCRÁTICO MAIEUTIC-4

El motor modula el nivel de andamiaje (*Scaffolding*) en 4 niveles progresivos:
- **Nivel L1 (Socratic Query):** Pregunta abierta para activar conocimientos previos (*"¿Qué relación ves entre la base y la altura de este rectángulo?"*).
- **Nivel L2 (Heuristic Hint):** Sugerencia estratégica (*"Prueba a descomponer la figura en dos triángulos rectángulos"*).
- **Nivel L3 (Partial Scaffold):** Estructuración de la ecuación con huecos para rellenar (*"Área $= \frac{\text{base} \times \text{altura}}{2} \implies \text{Área} = \frac{8 \times \Box}{2}$"*).
- **Nivel L4 (Concrete Grounding):** Animación interactiva manipulativa antes de reintentar.

---

## 4. ESQUEMA RELACIONAL POSTGRESQL CON RLS

```sql
-- Extensión para embeddings vectoriales
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla de Perfil del Alumno
CREATE TABLE student_profiles (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL,
    first_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    current_grade TEXT NOT NULL, -- ej. '4_PRIMARIA' o 'YEAR_5'
    curriculum_system TEXT NOT NULL DEFAULT 'LOMLOE_BILINGUAL',
    preferred_tone TEXT NOT NULL DEFAULT 'friendly_tutor',
    interests TEXT[] DEFAULT ARRAY['space', 'nature', 'technology'],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Memoria Episódica
CREATE TABLE student_episodic_memories (
    memory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES student_profiles(student_id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    subject TEXT NOT NULL,
    topic_node_id TEXT NOT NULL,
    conversation_summary TEXT NOT NULL,
    breakthrough_insight TEXT,
    embedding vector(1536), -- OpenAI / Gemini embedding
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Memoria Semántica (BKT Knowledge State)
CREATE TABLE student_knowledge_nodes (
    student_id UUID NOT NULL REFERENCES student_profiles(student_id) ON DELETE CASCADE,
    node_id TEXT NOT NULL, -- ej. 'MAT_PRIM_FRAC_EQUIV'
    p_mastery FLOAT NOT NULL DEFAULT 0.10,
    consecutive_successes INT DEFAULT 0,
    last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
    stability_s FLOAT DEFAULT 1.0,
    PRIMARY KEY (student_id, node_id)
);

-- Políticas de Seguridad RLS para Protección de Menores
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_episodic_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_knowledge_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY student_isolation_policy ON student_profiles
    FOR ALL USING (auth.uid() = family_id);
```
