# 04 · ARQUITECTURA DE INFORMACIÓN Y NAVEGACIÓN (FASE 3 — IA & NAVEGACIÓN)
**Mini App**: CRITERIO · Aprender a Informarse (GOALS)  
**Principios**: Mobile-First (390px viewport), Jerarquía Clara, Sin Fricción, Orientación por Estado  

---

## 1. ÁRBOL DE NAVEGACIÓN Y VISTAS

```
GOALS Main App (App.tsx)
 └── Header Global (Navegación / Racha / XP / Perfil / Selector de Mini App)
      └── Experiencia: CRITERIO (`activeExperience === 'verify'`)
           │
           ├── [1] HERO & HUB PRINCIPAL (CriterioHome)
           │    ├── Selector de Edad / Nivel (8-10, 10-12, 12-14, 14-16, 16-18)
           │    ├── Radar de Competencias (8 Habilidades con medidor de dominio)
           │    ├── Acceso Directo: Misión Diaria
           │    └── Grid de los 12 Módulos Temáticos
           │
           ├── [2] VISOR DE MÓDULO INTERACTIVO (CriterioModuleViewer)
           │    ├── Paso 1: El Dilema / Contexto Visual
           │    ├── Paso 2: El Mecanismo Técnico (Micro-simulador o diagrama SVG)
           │    ├── Paso 3: Pregunta de Razonamiento Socrático
           │    ├── Paso 4: Revelación de la Evidencia & Pistas
           │    └── Paso 5: Conclusión Matizada & Recompensa XP
           │
           ├── [3] SIMULADOR DE ALGORITMOS & FEED (CriterioFeedLab)
           │    ├── Panel de Contenido Social Interactivo (Posts, Vídeos, Memes)
           │    ├── Controles de Interacción del Alumno (Like, Compartir, Tiempo de Vista)
           │    ├── Visualizador de Telemetría Algorítmica (Burbuja de Filtros en Vivo)
           │    └── Lección Práctica: "Cómo tu interacción entrena al recomendador"
           │
           ├── [4] ENTRENAMIENTO & MISIONES GAMIFICADAS (CriterioMissions)
           │    ├── Filtro por Temática (Colegio, Redes, Ciencia, Sorteos, IA)
           │    ├── Selector de Modo (5, 10, 15 preguntas o Misión Diaria)
           │    ├── Ejecución con temporizador conductual PAUSA
           │    └── Pantalla de Resultados con desglose de aprendizajes y repaso
           │
           ├── [5] LABORATORIO FORENSE DE IA (CriterioAILab)
           │    ├── Detección de Alucinaciones en Texto (Encontrar fallos sutiles)
           │    ├── Comparador de Imágenes Reales vs Sintéticas
           │    └── Simulador de Voz Clonada y Verificación por Canal Seguro
           │
           └── [6] LABORATORIO MATIZA (MatizaTool)
                ├── Campo de Entrada: Afirmación, Noticia o Enlace
                ├── Escáner de 4 Capas (Afirmación, Evidencia, Contexto, Fuentes)
                ├── Historial de Análisis Guardados
                └── Exportación de Ficha de Rigor en Markdown o Visual
```

---

## 2. FLUJOS DE USUARIO PRINCIPALES (USER JOURNEYS)

### Flujo A: El Viaje Diario del Estudiante (Micro-learning de 5 minutos)
1. El estudiante abre GOALS en su móvil o navegador.
2. Entra en **CRITERIO** desde el Dashboard unificado.
3. Se le presenta la **Misión Diaria**: Un mensaje viral de WhatsApp sobre un falso suceso escolar.
4. El estudiante activa el método **PAUSA** (30s de reflexión), examina la fuente y detecta la falta de fecha.
5. Emite su juicio matizado: *"Falta confirmación de la dirección del centro"*.
6. Gana +35 XP, mantiene su racha 🔥 y desbloquea el siguiente módulo.

### Flujo B: Consulta Libre con la Herramienta MATIZA
1. El estudiante escucha un rumor en TikTok sobre un descubrimiento astronómico o un evento histórico.
2. Abre la pestaña **Laboratorio MATIZA** dentro de CRITERIO.
3. Escribe: *"¿Es verdad que han descubierto una ciudad alienígena en Marte?"*.
4. MATIZA analiza la afirmación contra bases de datos reales y responde estructuradamente:
   - *Afirmación*: Detección de estructuras artificiales en Marte.
   - *Evidencia real*: Fotografías de la sonda Mars Reconnaissance Orbiter (NASA) que muestran formaciones geológicas naturales erosionadas por el viento (pareidolia).
   - *Fuentes primarias*: NASA Planetary Data System, CSIC-CAB.
   - *Conclusión matizada*: Fenómeno geológico natural ampliamente documentado.
