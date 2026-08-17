# Audit de Desarrollo - Proyecto GOALS (Fase 0)

> **Fecha del Informe:** Agosto 2026  
> **Estado:** Fase 0 — Inspección Completa (Sin Modificación de Código)

---

## A. Stack Actual

El proyecto cuenta actualmente con la siguiente infraestructura tecnológica identificada en la carpeta `astrolingo/`:

- **Framework Principal:** React 18.3.1 + TypeScript 5.4.5 + Vite 5.4.21.
- **Estilos & UI:** TailwindCSS 3.4.4 + PostCSS 8.4 + Autoprefixer + Lucide React (0.395.0) para iconografía.
- **Motor 3D:** Three.js 0.165.0 + `@types/three`.
- **BBDD y Autenticación:** Firebase SDK v10.12.2 (`firebase/app`, `firebase/auth`, `firebase/firestore`).
- **Empaquetado Móvil:** Capacitor 8.5.0 (`@capacitor/core`, `@capacitor/android`, `@capacitor/preferences`).
- **Despliegue Web:** Firebase Hosting (`site: astrolingo`, project ID `astrolingo-96820`).

---

## B. Estructura del Proyecto

La estructura física del repositorio en `c:\Obsidian\proyectos\webs\10_goals` es:

```
10_goals/
├── docs/                             # Documentación del proyecto (creado en Fase 0)
│   ├── DEVELOPMENT_AUDIT.md
│   └── ASTRO_REFERENCE_ANALYSIS.md
├── maqueta.html                      # Archivo borrador previo (0 bytes, candidato a eliminación)
└── astrolingo/                       # Aplicación React funcional actual
    ├── index.html                    # prototipo legacy HTML autosuficiente (171 KB)
    ├── package.json
    ├── vite.config.ts
    ├── capacitor.config.json
    ├── firebase.json
    ├── .firebaserc
    └── src/
        ├── App.tsx                   # Componente raíz y enrutamiento interno por estado
        ├── main.tsx                  # Punto de entrada Vite React DOM
        ├── index.css                 # Estilos globales y utilidades Tailwind
        ├── config/
        │   └── firebase.ts           # Inicializador Firebase Auth & Firestore
        ├── context/
        │   ├── AuthContext.tsx       # Estado global de usuario (Google, Email, Invitado)
        │   └── ProgressContext.tsx   # Estado global de gamificación (XP, Rachas, Estrellas)
        ├── data/
        │   ├── lessonsData.ts        # Contenido pedagógico de 4 lecciones con datos 2026
        │   └── exploreData.ts        # Configuración de los 8 niveles astronómicos 3D
        ├── services/
        │   └── nasaService.ts        # Cliente API NASA (APOD / Imágenes de ciencia)
        ├── utils/
        │   ├── nasaTextures.ts       # Generación de texturas procedimentales 3D
        │   └── streak.ts             # Algoritmo de cálculo de racha diaria
        ├── components/
        │   ├── Header.tsx            # Barra superior con XP, racha y perfil
        │   ├── BottomNav.tsx         # Navegación inferior (Aprender, Retos, Explorar)
        │   ├── ProfileModal.tsx      # Modal de cuenta, evolución y config Firebase
        │   ├── AdminModal.tsx        # Panel de administración de gráficos/XP
        │   ├── Mini3DViewer.tsx      # Visor 3D compacto integrado en lecciones
        │   └── Toast.tsx             # Notificaciones flotantes
        └── views/
            ├── LearnView.tsx         # Lista de lecciones y accesos directos
            ├── LessonStepView.tsx    # Visor paso a paso de teoría pedagógica
            ├── TestView.tsx          # Evaluaciones interactivas (tipo test y ordenar)
            ├── RetosView.tsx         # Sección de retos diarios
            └── SpaceLabView.tsx      # Laboratorio Espacial 3D (Three.js)
```

---

## C. Firebase

- **Proyecto Firebase:** `astrolingo-96820`
- **Configuración por defecto:** Definida en `src/config/firebase.ts`.
- **Configuración dinámica:** Permite al usuario sobrescribir las claves de Firebase mediante `localStorage.getItem('astrolingo_firebase_config')`.
- **Persistencia en la Nube:** Si hay credenciales válidas y el usuario ha iniciado sesión con cuenta no anónima, se sincronizan las lecturas y escrituras en Firestore. Si no hay conexión o se opera como invitado, se activa el fallback transparente en `LocalStorage`.

---

## D. Authentication (Autenticación)

Implementada en `src/context/AuthContext.tsx`:
1. **Google Sign-In:** Vía `signInWithPopup(auth, googleProvider)`.
2. **Email / Contraseña:** Registro (`createUserWithEmailAndPassword`) e inicio de sesión (`signInWithEmailAndPassword`).
3. **Modo Invitado (Anónimo):** Vía `signInAnonymously(auth)` o mediante usuario sintético local si Firebase no está disponible.
4. **Cierre de sesión:** `signOut(auth)` limpia la sesión activa y restaura el estado local a invitado.

---

## E. Firestore (Base de Datos)

- **Colección:** `users`
- **Estructura del documento `users/{userId}`:**
  ```ts
  {
    xp: number,             // Puntos de experiencia acumulados
    streak: number,         // Racha actual de días consecutivos
    lastDay: string,        // Fecha ISO del último día de actividad (YYYY-MM-DD)
    lessons: {
      [lessonId: number]: {
        steps: number,      // Pasos leídos
        testDone: boolean,  // ¿Test final superado?
        stars: number       // Estrellas (1 a 3)
      }
    },
    evolutions: [           // Historial de eventos y logros
      {
        id: string,
        timestamp: number,
        dateStr: string,
        type: 'lesson_finished' | 'test_completed',
        title: string,
        score?: string,
        stars?: number,
        xpEarned: number
      }
    ]
  }
  ```
- **Estrategia de guardado:** Merge de Firestore (`setDoc(doc, data, { merge: true })`) tras cada paso de lección o test completado.

---

## F. Astro Existente (Experiencia Actual)

Astro es actualmente la única experiencia construida. Incluye:
- **4 Lecciones interactivas completas:**
  1. Artemis II (Regreso a la Luna 2026).
  2. Starship (Motor Raptor 3 y reutilización).
  3. James Webb (Descubrimientos de galaxias tempranas).
  4. Agujeros Negros (M87*, Sagittarius A* y física extrema).
- **Sistema de Evaluación Dual:** Preguntas de selección múltiple y preguntas de ordenación cronológica/lógica.
- **Laboratorio 3D (`SpaceLabView`):** 8 escalas de magnitud astronómicas interactivas desarrolladas en Three.js con OrbitControls, luces dinámicas, etiquetas y descripciones de la NASA.
- **Panel Admin Guardado:** Acceso protegido en `Header.tsx` / `ProfileModal.tsx` para el usuario `josferestudio@gmail.com` para ajustar parámetros de iluminación, velocidad de rotación y multiplicadores de XP.

---

## G. Problemas Encontrados

1. **Ausencia de Core GOALS Unificado:** La estructura actual está empaquetada como la app individual `astrolingo` dentro de un subdirectorio, sin existir aún el portal o contenedor principal `GOALS` (Home de aplicaciones, navegación global, perfil unificado para múltiples experiencias).
2. **Hardcoding de Emails y Datos:**
   - La comprobación de Admin está ligada al email estático `josferestudio@gmail.com`.
   - Las lecciones están escritas en un archivo `.ts` estático (`lessonsData.ts`), lo que impedirá la edición desde el panel Admin sin volver a compilar la app.
3. **Archivo fantasma:** `maqueta.html` en la raíz está vacío (0 bytes).
4. **Acoplamiento del Estado de Progreso:** `ProgressContext.tsx` guarda los datos bajo la clave `al_data_{uid}` (específica de AstroLingo), en lugar de una estructura modular extensible `goals_user_{uid}` con espacio para `astro`, `languages`, `school`, etc.
5. **Configuración de Firebase rígida:** La configuración apunta directamente al proyecto `astrolingo-96820`. Debería pasar a un entorno GOALS unificado o parametrizado por variables de entorno Vite (`VITE_FIREBASE_*`).

---

## H. Código Reutilizable

- `AuthContext.tsx` → Base excelente para el sistema de Autenticación Core de GOALS.
- `SpaceLabView.tsx` + `nasaTextures.ts` → Motor 3D de exploración espacial extremadamente sólido y optimizado.
- ` streak.ts` → Lógica pura y probada de cálculo de racha diaria.
- `lessonsData.ts` y `exploreData.ts` → Base de contenidos educativos astronómicos verificados al año 2026.
- Configuración de **Capacitor Android** en `capacitor.config.json` y `android/` para compilación nativa en APK.

---

## I. Código que Debería Refactorizarse

1. **Separación Core vs Experiencia Astro:**
   - Extraer `AuthContext` y la cabecera/perfil global a la carpeta `src/core/auth`.
   - Crear un `LearningEngine` abstracto que gestione cualquier tipo de lección (Astro, Idiomas, Escolar) recibiendo la estructura JSON del contenido.
   - Refactorizar `ProgressContext` a un `GamificationEngine` unificado que almacene el XP global del usuario + el progreso específico por experiencia.
2. **Abstracción de Contenido:**
   - Definir un esquema JSON estandarizado para las lecciones del `LearningEngine`.

---

## J. Dependencias

Las dependencias actuales son ligeras y adecuadas:
- **Producción:** `react`, `react-dom`, `three`, `lucide-react`, `firebase`, `@capacitor/core`, `@capacitor/android`, `@capacitor/preferences`, `clsx`, `tailwind-merge`.
- **Desarrollo:** `typescript`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`, `@types/three`, `@types/react`.

No se requiere instalar librerías pesadas adicionales por el momento.

---

## K. Riesgos

1. **Riesgo de Regresión al Refactorizar:** Al mover `astrolingo` a la estructura modular de `GOALS`, se podría romper el visor 3D o la persistencia de datos si no se respeta la compatibilidad de claves de `LocalStorage`.
2. **Rendimiento 3D en Dispositivos de Gama Baja:** Three.js requiere mantener el control estricto de memoria (`dispose()` de geometrías, materiales y texturas al desmontar `SpaceLabView`).
3. **Desconexión entre Nube y Local:** Si el esquema de Firestore cambia drásticamente, los usuarios con datos guardados localmente podrían experimentar inconsistencias si no se migran sus objetos `UserData`.

---

## L. Propuesta de Evolución (Hacia Fase 1)

1. **Estructuración de GOALS Core:**
   - Crear la shell principal de GOALS con la jerarquía:
     - `GOALS Home` (Selector de experiencias: Astro, Idiomas [Próximamente], Escolar [Próximamente], etc.).
     - `Core Auth` (Login / Registro / Invitado / Perfil unificado).
     - Navegación fluida: `GOALS Home` ↔ `Astro` ↔ `Perfil` ↔ `Logout`.
2. **Migración Limpia:**
   - Integrar la app React actual dentro de la arquitectura modular de GOALS garantizando que la experiencia de usuario de Astro funcione al 100% como hasta ahora.
