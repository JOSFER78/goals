# BLOQUE 01 — ARCHITECTURE & MODULAR STRUCTURE

> **Fase:** 0 — Fundaciones  
> **Dependencias:** Ninguna (Bloque Base)  
> **Responsabilidad:** Infraestructura modular de `src/experiences/languages/`, tipado estricto y enrutamiento en GOALS.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Establecer los cimientos arquitectónicos del módulo de Idiomas dentro de la plataforma GOALS. Garantizar una estricta separación de responsabilidades entre tipos, servicios de negocio, componentes de presentación y controladores de estado, erradicando cualquier componente monolítico y asegurando que las vistas no superen las 250-300 líneas.

---

## 2. CONTRATOS DE DATOS & INTERFACES TYPESCRIPT

Ubicación: `src/experiences/languages/types/index.ts`

```typescript
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type LanguageCode = 'en' | 'fr' | 'de' | 'ja' | 'it' | 'pt';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  cefrDefault: CEFRLevel;
  accent: string;
  speechVoiceLang: string;
  samplePrompt: string;
}

export type ViewTab = 'home' | 'voice' | 'practice' | 'roleplay' | 'stories' | 'writing' | 'translation' | 'reading' | 'listening' | 'progress';
```

---

## 3. ESTRUCTURA MODULAR DEL DIRECTORIO

```text
src/experiences/languages/
├── types/
│   └── index.ts                  # Contratos de tipos compartidos
├── services/
│   ├── memoryService.ts          # Servicio de persistencia y expedientes
│   ├── teacherAgent.ts           # Orquestador del agente pedagógico
│   ├── nextBestAction.ts         # Motor de cálculo de la siguiente mejor acción
│   └── voiceEngine.ts            # Motor de síntesis y reconocimiento de voz
├── components/
│   ├── layout/
│   │   ├── LanguagesHeader.tsx   # Cabecera con estado fonético y selector de idioma
│   │   └── LanguagesNavTabs.tsx  # Barra de navegación por pestañas de aprendizaje
│   ├── teacher/
│   │   ├── TeacherCard.tsx       # Tarjeta del profesor con estado y recomendación
│   │   └── VoiceActionButton.tsx # Botón principal de llamada/conversación
│   └── progress/
│       └── MasteryRadarCard.tsx  # Resumen visual del dominio de competencias
└── LanguagesView.tsx             # Vista orquestadora limpia (<250 líneas)
```

---

## 4. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 01 — ARCHITECTURE]
Actúa como Arquitecto Principal de Software de GOALS.
Tu tarea es implementar la arquitectura base modular de la experiencia Languages en `src/experiences/languages/`.

REGLAS OBLIGATORIAS:
1. Divide la lógica en submódulos dentro de `src/experiences/languages/components/` y `src/experiences/languages/services/`.
2. El archivo orquestador `LanguagesView.tsx` NO debe ser monolítico (máximo 250 líneas) e importará sus subcomponentes.
3. Define los tipos base en `types/index.ts` con tipado estricto (sin `any`).
4. Conecta la vista con `ProgressContext` y `AuthContext` de GOALS sin romper la navegación global ni la experiencia de Astro.
5. Ejecuta `npm run build` o la verificación de TypeScript para asegurar cero errores de compilación.
```

---

## 5. CRITERIOS DE ACEPTACIÓN

- [x] **Modularidad Estricta:** `LanguagesView.tsx` delega el renderizado en componentes especializados.
- [x] **Cero Errores TypeScript:** Compilación limpia con `tsc --noEmit`.
- [x] **Compatibilidad GOALS:** Integración perfecta con el selector de experiencias en `App.tsx`.
- [x] **Responsive Layout:** Contenedor adaptativo con diseño fluido en móvil, tablet y escritorio.

---

## 6. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿Existe el directorio `src/experiences/languages/components/` con submódulos claros?
- [ ] ¿El archivo `LanguagesView.tsx` mide menos de 300 líneas?
- [ ] ¿Los contratos de datos están en `types/index.ts` sin tipos `any`?
- [ ] ¿La compilación con Vite pasa sin advertencias críticas?
