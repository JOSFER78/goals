# 00 · INFORME DE AUDITORÍA INTEGRAL (FASE 0 — GUARDRAILS Y AUDITORÍA)
**Proyecto**: GOALS Platform — Nueva Mini App de Alfabetización Informativa, Algoritmos, IA y Pensamiento Crítico  
**Código Interno / Nombre de Producto**: `criterio` (CRITERIO · Aprender a Informarse)  
**Fecha de Auditoría**: 14 de Agosto de 2026  
**Auditor**: Antigravity Multi-Agent Orchestrator  

---

## 1. RESUMEN EJECUTIVO Y OBJETIVOS DE LA AUDITORÍA

La presente auditoría técnica, pedagógica y editorial evalúa el estado del ecosistema **GOALS**, los activos previos del proyecto de desinformación en VPS (`/home/ubuntu/workspace/pro/old/05-impacto-social/desinformacion/`), la web de referencia `contradesinformacion2.web.app`, y la herramienta `MATIZA` (`https://143-47-35-167.sslip.io/pro/matiza/`).

### Hallazgo Central
La actual mini app `verify` (`VerifyView.tsx`) en GOALS es un prototipo básico de fact-checking binario con IA de 378 líneas, centrado exclusivamente en validar titulares científicos contra agencias espaciales (NASA/ESA). Esto contradice el objetivo de producto:
> **La nueva experiencia NO es una app de fact-checking tipo "verdadero/falso" llamada Verifica.** Es una plataforma integral de **Alfabetización Informativa y Pensamiento Crítico** para niños y adolescentes (8 a 18 años), donde la pregunta central es **«¿Y tú cómo lo sabes?»**, explorando la economía de la atención, el funcionamiento real de los algoritmos de recomendación, los sesgos cognitivos, la naturaleza probabilística y los riesgos de la IA generativa (alucinaciones, deepfakes, clonación de voz), y donde **MATIZA** queda integrada como una potente herramienta de análisis y contraste, no como el centro monolítico del producto.

---

## 2. AUDITORÍA DEL ECOSISTEMA GOALS ACTUAL

### 2.1. Arquitectura y Stack Tecnológico
- **Core Frontend**: React 18.3.1 + TypeScript 5.4.5 + Vite 5.4.21.
- **Estilos y Diseño**: TailwindCSS 3.4 con directivas táctiles brutalistas y dark glassmorphism (`bg-slate-950/90`, `border-slate-800/80`, `backdrop-blur-xl`).
- **Autenticación**: Firebase Auth v10 unificado (`AuthContext.tsx`) con soporte web (`signInWithPopup`) y nativo Android Capacitor (`@capacitor-firebase/authentication` v8.4.0) con bypass de errores 403 `disallowed_useragent`.
- **Persistencia de Datos**: Dual-layer: `localStorage` (`goals_data_<uid>`) + Cloud Firestore (`users/<uid>`), gestionado reactivamente por `ProgressContext.tsx`.
- **Sistema de Gamificación Compartido**:
  - XP único global y por miniapp (`experiences[id].xp`).
  - Racha diaria consecutiva (`streak`) con heatmap semanal.
  - Rangos de maestría (`Novato de la Tierra` a `Astrofísico Principal / Gran Maestro`).
  - Retos diarios dinámicos y evoluciones históricas (`EvolutionEntry[]`).
- **Tutoría IA y Mascota Contextual**:
  - `FloatingAIContextWidget.tsx`: Widget flotante continuo de tutoría IA con TTS neuronal en español (`useMascotTTS`), selector de skins (`AstroBot`, `Búho Sabio`, `Dragón Cósmico`, `Gatito Galáctico`), soporte de dictado por voz y prompts adaptativos por edad y grado (`ChildLearningProfile`).
  - `aiService.ts`: Proxy unificado hacia `https://143-47-35-167.sslip.io/v1` con fallback heurístico educativo inteligente.

### 2.2. Inventario de Componentes GOALS Reutilizables
| Componente / Servicio | Ubicación | Utilidad para la Nueva Mini App |
| :--- | :--- | :--- |
| `ProgressContext` / `useProgress` | `src/core/context/ProgressContext.tsx` | Registro de XP, estrellas, lecciones completadas, evoluciones y feedback Toast |
| `AuthContext` / `useAuth` | `src/core/context/AuthContext.tsx` | Identidad, perfil de usuario, rol y sincronización en la nube |
| `Header` / `Footer` | `src/core/components/Header.tsx`, `Footer.tsx` | Navegación unificada, selector de miniapps, migas de pan y controles de sesión |
| `ProfileModal` | `src/core/components/ProfileModal.tsx` | Gestión de edad, avatar, bio y estadísticas globales |
| `aiService.ts` (`askAI`) | `src/core/services/aiService.ts` | Peticiones a LLM para tutoría socrática, pistas graduadas y análisis MATIZA |
| `FloatingAIContextWidget` | `src/core/components/FloatingAIContextWidget.tsx` | Copiloto IA contextual que lee el estado de la lección activa |
| `Toast` / `CookieBanner` | `src/core/components/Toast.tsx` | Notificaciones flotantes y cumplimiento de privacidad GDPR |

---

## 3. AUDITORÍA DE REFERENCIAS EXTERNAS Y ANTECEDENTES

### 3.1. Proyecto VPS (`/home/ubuntu/workspace/pro/old/05-impacto-social/desinformacion/`)
- **Activos existentes**: 12 módulos interactivos en JS/HTML5 Canvas, 60 escenarios de entrenamiento gamificado, informe de fuentes basado en la investigación UGR-CIMCYC y Newtral (288.347 mensajes analizados), análisis de casos judiciales (Cambridge Analytica / FTC, Fox-Dominion, Torre-Pacheco, DANA Bonaire/Benagéber).
- **Lecciones aprendidas**: La versión anterior tenía sobrecarga visual y terminológica ("índice patogénico", "topología retórica"). Debe simplificarse para niños y adolescentes con lenguaje directo, metáforas claras y mobile-first (390px).

### 3.2. Referencia Editorial `contradesinformacion2.web.app`
- **Puntos fuertes**:
  - Enfoque pedagógico: "No te decimos qué pensar, te enseñamos a comprobar antes de creer".
  - Método **PAUSA** (Parar el impulso, Analizar la fuente, Ubicar el contexto, Sopesar la evidencia, Actuar con criterio).
  - Sin partidismo político ni juicios morales; foco en el mecanismo de amplificación y el incentivo de la atención.
  - Tratamiento del error no como castigo, sino como oportunidad de aprendizaje reflexivo.

### 3.3. Referencia de Herramienta `MATIZA` (`https://143-47-35-167.sslip.io/pro/matiza/`)
- **Rol en el nuevo producto**: MATIZA es un motor avanzado de contraste y matización estructurada. No debe absorber la miniapp; debe integrarse como un laboratorio o herramienta de consulta ("Laboratorio MATIZA") donde el alumno puede introducir una afirmación o noticia y recibir un desglose pedagógico en 4 capas:
  1. *Qué se afirma con certeza*.
  2. *Qué evidencia real existe*.
  3. *Qué contexto o información falta*.
  4. *Conclusión matizada con grado de incertidumbre*.

---

## 4. DETECCIÓN DE RIESGOS, DUPLICACIONES Y DEUDA TÉCNICA

| Riesgo / Deuda | Impacto | Mitigación Arquitectónica |
| :--- | :--- | :--- |
| **Monolitismo de vista** | `VerifyView.tsx` actual es un único archivo de 378 líneas que mezcla UI, llamadas IA y pestañas sin estado persistente. | Estructurar la nueva miniapp en módulos independientes: `CriterioView`, subcomponentes (`CriterioHome`, `CriterioMissionRunner`, `CriterioFeedSimulator`, `CriterioAILab`, `MatizaToolWidget`, `CriterioInvestigation`), y servicios de datos desacoplados. |
| **Sesgo binario "Verdadero/Falso"** | Enseñar que todo en internet es verdad o mentira destruye el pensamiento crítico. | Diseñar la pedagogía alrededor de grados de evidencia, matices, incertidumbre y contexto. |
| **Tecnofobia o cinismo** | Presentar a las redes sociales, algoritmos o IA como entidades malignas crea rechazo o desconfianza total. | Enseñar mecanismos técnicos objetivos: qué optimiza una red social (tiempo de permanencia/interacción), cómo aprende un LLM (probabilidad estadística de tokens), y cómo usar la IA como aliada para contrastar. |
| **Falsos mocks o datos inventados** | Violación de la regla de CERO MOCKS del proyecto. | Todos los escenarios, misiones y fuentes deben estar rigurosamente documentados con enlaces y referencias a hechos y consensos científicos y jurídicos reales. |

---

## 5. CONCLUSIÓN Y DICTAMEN DE FASE 0

Se aprueba la transición a la **FASE 1 (Investigación Multiagente)** y **FASE 2 (Product Discovery)**.
- Se adopta la denominación de producto **CRITERIO** (`id: 'verify'`, nombre visible: **Criterio · Saber e Informarse**) preservando la compatibilidad de identificador en el core de GOALS sin alterar rutas ni persistencia existente de los usuarios.
- Se establece la ruta de entregables documentales en `docs/criterio/` y la arquitectura modular en `src/experiences/criterio/`.
