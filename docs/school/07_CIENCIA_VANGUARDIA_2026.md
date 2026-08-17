# 📅 PLANIFICACIÓN DE CALENDARIO ESCOLAR, TRIMESTRES Y PREPARACIÓN DE EXÁMENES
## Periodización Multirregional, Algoritmo FSRS de Sprint 7 Días Pre-Examen y Generador Paramétrico de Simulacros (GOALS School)

**Marco de Aplicación:** 
- **España:** Calendarios Escolares Oficiales de las 17 Comunidades Autónomas (1.º Trimestre: Sep–Dic, 2.º Trimestre: Ene–Mar/Abr, 3.º Trimestre: Abr–Jun).
- **Reino Unido / Internacional:** Autumn Term, Spring Term y Summer Term con períodos de Half-Term.

---

### ÍNDICE GENERAL
1. **Configuración de Calendarios Escolares y Sincronización de Aula**.
2. **El Sprint de 7 Días Pre-Examen Anti-Agobio**.
3. **El Generador Paramétrico de Simulacros de Examen**.
4. **Calibración Psicométrica IRT 2PL de Ítems del Simulacro**.
5. **Algoritmo de Gestión de la Ansiedad ante Exámenes**.

---

## 1. CONFIGURACIÓN DE CALENDARIOS ESCOLARES

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        ESTRUCTURA DE TRIMESTRES Y TÉRMINOS ESCOLARES                                   │
├──────────────────────────────┬───────────────────────────────┬─────────────────────────────────────────┤
│ PERÍODO / TRIMESTRE          │ ESPAÑA (17 COMUNIDADES CCAA)  │ REINO UNIDO / BILINGÜE (UK TERMS)       │
├──────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────┤
│ **1.º Período (Otoño)**      │ 1.º Trimestre (Sep – Dic)     │ Autumn Term (Sep – Dec) + Half-Term Oct │
│ **2.º Período (Invierno)**   │ 2.º Trimestre (Ene – Mar/Abr) │ Spring Term (Jan – Mar/Apr) + Half Feb  │
│ **3.º Período (Primavera)**  │ 3.º Trimestre (Abr – Jun)     │ Summer Term (Apr – Jul) + Half May      │
└──────────────────────────────┴───────────────────────────────┴─────────────────────────────────────────┘
```

---

## 2. EL SPRINT DE 7 DÍAS PRE-EXAMEN ANTI-AGOBIO

Cuando el alumno indica: *"Tengo examen de Matemáticas el próximo jueves de los temas 4 y 5"*, el sistema despliega automáticamente una secuencia balanceada de **micro-sesiones diarias de 15 a 25 minutos** basada en *Retrieval Practice* y práctica espaciada:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                         CRONOGRAMA DEL SPRINT DE 7 DÍAS PRE-EXAMEN                                     │
├─────────┬───────────────────────────┬──────────────┬───────────────────────────────────────────────────┤
│ DÍA     │ NOMBRE DE LA FASE         │ DURACIÓN     │ ACTIVIDAD PEDAGÓGICA                              │
├─────────┼───────────────────────────┼──────────────┼───────────────────────────────────────────────────┤
│ **D-7** │ Diagnóstico Relámpago     │ 15 min       │ Test exploratorio de 5 preguntas clave (BKT).     │
│ **D-6** │ Foco en Nudos Críticos 1  │ 20 min       │ Reparación socrática de las lagunas del Tema 4.   │
│ **D-5** │ Foco en Nudos Críticos 2  │ 20 min       │ Reparación socrática de las lagunas del Tema 5.   │
│ **D-4** │ Práctica Intercalada      │ 20 min       │ Problemas mixtos alternados (*Interleaving*).     │
│ **D-3** │ Simulacro Cronometrado    │ 25 min       │ Mini-examen realista en condiciones de colegio.   │
│ **D-2** │ Sutura de Fallos (Feynman)│ 15 min       │ El alumno explica con sus palabras los 2 fallos.  │
│ **D-1** │ Consolidación de Calma    │ 10 min       │ 3 preguntas rápidas de éxito garantizado (Boost). │
│ **D-0** │ **DÍA DEL EXAMEN REAL**   │ —            │ Mensaje matutino de confianza y serenidad.        │
└─────────┴───────────────────────────┴──────────────┴───────────────────────────────────────────────────┘
```

---

## 3. GENERADOR PARAMÉTRICO DE SIMULACROS DE EXAMEN

Para evitar que el alumno memorice enunciados de memoria, el generador paramétrico altera los coeficientes numéricos, los contextos narrativos y los objetos de los problemas conservando la estructura lógica y competencial:

```typescript
export interface ParametricExamMock {
  examId: string;
  subject: 'Mathematics' | 'Science' | 'SpanishLanguage' | 'English' | 'SocialSciences';
  targetGrade: string; // ej. "2.º ESO" / "Year 8"
  includedTopics: string[];
  estimatedMinutes: number; // 20-30 min
  questions: Array<{
    id: string;
    bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze';
    irtDifficulty_b: number; // -3.0 a +3.0
    irtDiscrimination_a: number; // 0.5 a 2.5
    statementMarkdown: string;
    rubricCriteria: string;
    commonMisconceptions: string[];
  }>;
}
```

---

## 4. ÍNDICE DE PREPARACIÓN PARA EL EXAMEN (EXAM READINESS INDEX - ERI)

El motor calcula un indicador probabilístico continuo de $0\%$ a $100\%$ que predice el rendimiento del estudiante en el examen oficial:

$$\text{ERI} = 0.40 \cdot \bar{P}(L_{\text{temas}}) + 0.35 \cdot \text{Score}_{\text{simulacro}} + 0.15 \cdot \text{Retención}_{\text{FSRS}} + 0.10 \cdot \text{Calibración}_{\text{metacognitiva}}$$

- $\text{ERI} \ge 85\%$: 🟢 **Preparación Excelente (Alta Confianza)**.
- $65\% \le \text{ERI} < 85\%$: 🟡 **Preparación Adecuada (Repasar 1 concepto clave)**.
- $\text{ERI} < 65\%$: 🔴 **Alerta Preventiva (Activar micro-remediación inmediata)**.
