# COSMOS 3D — IMPLEMENTACIÓN DEL PILOTO ADAPTATIVO

## 1. Visión del Piloto Cosmos
Cosmos 3D es el piloto insignia de GOALS para validar la arquitectura adaptativa antes de replicarla a Escuela, Idiomas, Criterio e IA Lab.

**Regla de Oro**: Ningún usuario de 6 años puede recibir el mismo currículo, la misma teoría ni los mismos exámenes que un estudiante de 15 años.

---

## 2. Componentes Clave de Cosmos y su Rol

### 1. `AstroExperience.tsx`
Orquestador principal de la experiencia.
- Gestiona 3 pestañas:
  - `learn`: Visor de "Mi Camino" adaptativo (`CosmicLearningPath.tsx`) y Lector Teórico (`LessonTheoryView.tsx`).
  - `tests`: Centro de Evaluaciones Adaptadas por Tramo (`TestsCatalogHub.tsx`) y Examen Activo (`LessonTestView.tsx`).
  - `explore`: Simulador Kepleriano 3D interactivo a escala real.
- Inyecta `trancheUnits` dinámicamente según `effectiveAge` o `declaredAge`.

### 2. `CosmicLearningPath.tsx`
Renderiza la vista dual:
- **"Mi Camino"**: Calcula la ruta activa con `LearningPathEngine`, mostrando la unidad actual, próximas metas, estrellas y cápsulas de refuerzo.
- **"Catálogo del Tramo"**: Desglose de todas las unidades didácticas del tramo del alumno.

### 3. `TestsCatalogHub.tsx`
Centro de exámenes desacoplado:
- Consume `units: CurriculumUnit[]` del tramo activo.
- Muestra el estado gradual de desbloqueo, estrellas ⭐ ganadas (0-3), recompensa de XP y botón de reintento.

### 4. `LessonTheoryView.tsx` & `LessonTestView.tsx`
- Priorizan las propiedades de `CurriculumUnit` (`unit.steps`, `unit.test`) con fallback a `Lesson`.
- Visualizan fotos reales de la NASA, pies de foto, datos WOW y preguntas calibradas.

---

## 3. Catálogo Adaptativo (`adaptiveCosmosCatalog.ts`)
- **`UNITS_6_7`**: 3 unidades iniciales con enfoque sensorial (La Tierra como casa azul, ciclo día/noche con peonza, familia solar de 8 planetas).
- **`UNITS_8_9`**: 3 unidades de explorador (Atmósfera y satélites a 100 km, gran eclipse de 2026 en España, traslación y estaciones).
- **`UNITS_10_11`**: 3 unidades con relaciones de escala (Leyes de Kepler, masa y gravedad comparada, Nube de Oort y sonda Voyager 1).
- **`UNITS_12_13`**: 3 unidades intermedias de física estelar (Estrellas vecinas y Alfa Centauri, Vía Láctea y agujero negro supermasivo Sagitario A*).
- **`UNITS_14_15`**: 3 unidades avanzadas de astrofísica relativista (Cosmología relativista, Radiación de Fondo CMB a $2,725\text{ K}$, modelo $\Lambda$-CDM y energía oscura).

---

## 4. Conexión con el Panel de Administración (`AdminDashboard.tsx`)
- Filtro por tramo de edad (`6-7`, `8-9`, `10-11`, `12-13`, `14-15`).
- Filtro por estado de aprobación (`Todos`, `Aprobados`, `Pendientes`).
- Ficha individual del alumno con desglose del perfil, estado global y progreso en cada MiniApp.
- Selector de edad simulada en la barra superior para auditar en tiempo real cómo experimenta la plataforma cualquier franja de edad.
