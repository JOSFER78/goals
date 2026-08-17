# 👨‍👩‍👦 PORTAL FAMILIAR, TRANQUILIDAD PARENTAL Y ANALÍTICA EDUCATIVA
## Informes Semanales en Lenguaje Humano, Alertas Tempranas ERI, Preguntas de Sobremesa STEM y Generador Oficial de PDF (GOALS School)

**Principio Rector:** *"Parental Peace of Mind"* — Ofrecer a las familias visibilidad real, cálida y sin tecnicismos del progreso escolar de sus hijos, empoderándoles para acompañar sin discusiones ni estrés.

---

### ÍNDICE GENERAL
1. **La Filosofía de la Tranquilidad Parental (Cero Jerga Psicométrica)**.
2. **El Resumen Semanal para Padres (Weekly Snapshot)**.
3. **Alertas Tempranas Preventivas (Pre-Examen y Detección de Bloqueos)**.
4. **Preguntas STEM de Sobremesa para la Cena Familiar**.
5. **Generador de Informes Trimestrales en PDF para el Colegio Real**.

---

## 1. LA FILOSOFÍA DE LA TRANQUILIDAD PARENTAL

Muchos padres se sienten abrumados cuando ven notas bajas o cuando no saben cómo ayudar a sus hijos con los deberes sin generar conflictos en casa. El Portal Familiar de GOALS School transforma la experiencia:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              EL DASHBOARD FAMILIAR DE GOALS SCHOOL                                     │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. ¿QUÉ HA APRENDIDO ESTA SEMANA?                                                                      │
│    "Álex ha dominado la suma de fracciones con distinto denominador y el relieve de Europa."           │
│                                                                                                        │
│ 2. ¿DÓNDE SE SIENTE SEGURO Y CÓMO ESTÁ SU CONFIANZA?                                                   │
│    "En Ciencias de la Naturaleza tiene un 94% de soltura y se muestra entusiasmado."                  │
│                                                                                                        │
│ 3. ¿QUÉ LE HA COSTADO MÁS Y CÓMO LO HEMOS REFORZADO?                                                   │
│    "Dudaba al despejar ecuaciones con paréntesis; hemos practicado con una balanza visual y ya lo saca."│
│                                                                                                        │
│ 4. PRÓXIMOS EXÁMENES Y ESTADO DE PREPARACIÓN                                                           │
│    "Examen de Matemáticas el jueves 20. Índice de Preparación (ERI): 88% (Verde / Tranquilidad)."       │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. PREGUNTAS DE SOBREMESA STEM PARA LA CENA FAMILIAR

Para reforzar el aprendizaje sin parecer un interrogatorio escolar, la app genera 2 preguntas conversacionales curiosas cada semana:

- **Ciencias (Ciclo del Agua):** *"Hoy Álex aprendió sobre la condensación. En la cena podéis preguntarle: '¿Por qué cuando sacamos una botella fría de la nevera se llena de gotitas por fuera?'"*.
- **Historia (Edad Media):** *"Pregúntale: '¿Por qué los castillos tenían escaleras de caracol que subían girando hacia la derecha?' (Pista: para que los defensores diestros tuvieran espacio para usar la espada y los atacantes no)"*.

---

## 3. GENERADOR DE INFORMES TRIMESTRALES EN PDF PARA EL COLEGIO

El sistema compila un informe técnico estructurado según la normativa oficial (LOMLOE RD 157/2022 o UK DfE SATs/GCSE) con rúbricas de competencias clave (IN, SU, BI, NT, SB) para que los padres puedan compartirlo en las tutorías con los maestros del colegio real:

```typescript
export interface SchoolOfficialPdfReport {
  studentName: string;
  grade: string;
  trimester: '1st_Term' | '2nd_Term' | '3rd_Term';
  academicYear: '2025-2026';
  competencyRadarScores: {
    mathematicalSense: number; // 0 a 10
    scientificInquiry: number;
    linguisticCommunication: number;
    spatialHistoricalSense: number;
    foreignLanguageFluency: number;
  };
  strengthsSummary: string[];
  growthAreasRemediated: string[];
  teacherRecommendations: string[];
}
```
