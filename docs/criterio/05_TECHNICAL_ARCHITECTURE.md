# 05 · ARQUITECTURA TÉCNICA E IMPLEMENTACIÓN (FASE 3 — TECHNICAL ARCHITECTURE)
**Mini App**: CRITERIO · Aprender a Informarse (GOALS)  
**Stack**: React 18.3.1 · TypeScript 5.4.5 · TailwindCSS 3.4 · Firebase v10 Firestore / Auth · Capacitor 8.4  

---

## 1. ESTRUCTURA DE DIRECTORIOS Y MODULARIZACIÓN

Para garantizar un código limpio, desacoplado y sin archivos monolíticos, la arquitectura de CRITERIO se organiza en:

```
src/experiences/criterio/
├── CriterioExperience.tsx          # Contenedor raíz de la mini app (Control de vistas y estado)
├── components/
│   ├── CriterioHeader.tsx          # Barra superior contextual con racha, XP y selector de vistas
│   ├── CriterioHero.tsx            # Hub principal con radar de 8 competencias y progreso por edad
│   ├── ModuleCard.tsx              # Tarjeta bento para cada uno de los 12 módulos
│   ├── ModuleViewerModal.tsx       # Visor interactivo paso a paso de lecciones
│   ├── FeedSimulatorLab.tsx        # Simulador dinámico del algoritmo de redes y economía de atención
│   ├── TrainingMissionsModal.tsx   # Motor interactivo de las 60 misiones gamificadas
│   ├── AIFilterLabModal.tsx        # Laboratorio forense de alucinaciones, deepfakes e imágenes sintéticas
│   ├── MatizaToolModal.tsx         # Herramienta integrada MATIZA de análisis de afirmaciones
│   └── PauseTimerWidget.tsx        # Componente reactivo del temporizador conductual Método PAUSA
├── data/
│   ├── modulesData.ts              # Los 12 módulos pedagógicos con pasos y explicaciones
│   ├── missionsData.ts             # Las 60 situaciones de entrenamiento catalogadas por edad y tema
│   ├── aiScenariosData.ts          # Casos forenses de IA (alucinaciones de texto, clonación de voz, deepfakes)
│   └── verifiedSourcesData.ts      # Repositorio de fuentes primarias y académicas (NASA, ESA, BOE, CSIC)
├── hooks/
│   ├── useCriterioProgress.ts      # Hook personalizado para vincular el progreso con ProgressContext
│   └── useFeedAlgorithm.ts         # Hook para la física de simulación del feed y la burbuja de filtros
├── services/
│   ├── criterioAIService.ts        # Peticiones especializadas para tutoría socrática y MATIZA
│   └── sourceVerificationService.ts# Utilidades de verificación y cotejo de enlaces y fuentes
└── types/
    └── index.ts                    # Interfaces de TypeScript específicas para Criterio
```

---

## 2. MODELO DE DATOS Y CONTRATOS TYPESCRIPT

```typescript
export type CriterioAgeBracket = '8-10' | '10-12' | '12-14' | '14-16' | '16-18';

export type CriterioCompetencyId = 
  | 'sources'      // C1: Rastreo de fuentes primarias
  | 'fact_opinion' // C2: Distinción hecho vs opinión
  | 'context'      // C3: Identificación de contexto faltante
  | 'algorithms'   // C4: Comprensión de algoritmos y atención
  | 'ai_literacy'  // C5: Detección de alucinaciones y deepfakes
  | 'lateral_search'// C6: Búsqueda y lectura lateral
  | 'pause_method' // C7: Desaceleración y método PAUSA
  | 'nuance';      // C8: Juicio matizado e incertidumbre

export interface CriterioModule {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  ageBracket: CriterioAgeBracket;
  competency: CriterioCompetencyId;
  iconName: string;
  xpReward: number;
  durationMinutes: number;
  steps: CriterioStep[];
}

export interface CriterioStep {
  id: number;
  type: 'concept' | 'interactive_diagram' | 'socratic_question' | 'evidence_reveal' | 'reflection';
  title: string;
  content: string;
  keyTakeaway: string;
  question?: {
    prompt: string;
    options: {
      text: string;
      isNuanced: boolean;
      score: number;
      explanation: string;
    }[];
  };
  sources?: {
    name: string;
    url: string;
    type: 'primary' | 'academic' | 'regulatory' | 'factcheck';
  }[];
}

export interface CriterioMission {
  id: string;
  title: string;
  category: 'colegio' | 'redes' | 'ciencia' | 'sorteos' | 'ia_deepfakes';
  minAge: number;
  situation: string;
  mediaType?: 'text' | 'image_prompt' | 'chat_capture' | 'voice_memo';
  initialClaim: string;
  options: {
    id: string;
    text: string;
    quality: 'impulsive' | 'skeptical' | 'nuanced_correct';
    criterioScore: number;
    feedback: string;
  }[];
  revealedEvidence: string;
  primarySourceUrl?: string;
  primarySourceName?: string;
}

export interface MatizaAnalysisResult {
  claim: string;
  verdict: 'Comprobado con Evidencia Sólida' | 'Falso / Desinformación' | 'Parcialmente Cierto / Falta Contexto' | 'Opinión o Especulación';
  confidenceScore: number; // 0 - 100
  confirmedFacts: string[];
  uncertainOrMissing: string[];
  nuancedConclusion: string;
  verifiedSources: {
    title: string;
    domain: string;
    url?: string;
    authorityLevel: 'Oficial / Primaria' | 'Académica' | 'Periodística';
  }[];
}
```

---

## 3. INTEGRACIÓN CON EL CORE GOALS (`ProgressContext` & `AuthContext`)

1. **Identificador Global**: Se utiliza el ID de experiencia `verify` en `src/core/types/index.ts` y en `GOALS_EXPERIENCES`, actualizando su metadata visible a **CRITERIO** (o permitiendo la transición transparente).
2. **Registro de XP y Evoluciones**:
   - `addXP(amount, 'verify', reason)` suma puntos al XP global del alumno y al acumulador específico de la miniapp (`experiences.verify.xp`).
   - Se crea una entrada en `evolutions` con el tipo de lección o reto completado.
3. **Persistencia Multiplataforma**:
   - Almacenamiento local automático en `localStorage` (`goals_data_<uid>`).
   - Sincronización transparente con Google Cloud Firestore (`users/<uid>`) cuando el usuario tiene sesión activa, compatible con la APK Android Capacitor nativa.
