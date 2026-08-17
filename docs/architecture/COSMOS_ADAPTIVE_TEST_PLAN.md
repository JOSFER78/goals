# COSMOS 3D — PLAN DE PRUEBAS Y VALIDACIÓN AUTOMATIZADA

## 1. Objetivos de Prueba
Garantizar de forma empírica y reproducible que:
1. Un alumno de 6 años nunca recibe el mismo contenido ni la misma ruta que uno de 15 años.
2. El diagnóstico conceptual calibra adecuadamente el punto de entrada sin bloquear al estudiante.
3. El motor `LearningPathEngine` progresa de forma reactiva y determinista.
4. El simulador de edad de Super Admin conmuta todas las vistas de forma instantánea.

---

## 2. Suite de Tests Automatizados (`npm test`)

### Archivo: `src/core/__tests__/adaptiveCurriculum.real-user-path.test.ts`
Comando de ejecución:
```bash
npm test
```

### Casos de Prueba Verificados:
- **Grupo 1: Calibración de Tramo de Edad y Perfiles de Presentación**:
  - `6 años` $\to$ Tramo `6-7`, texto conciso, densidad espaciada, IA `cosmic_pet`.
  - `15 años` $\to$ Tramo `14-15`, texto denso, formalismo analítico, IA `science_colleague`.
- **Grupo 2: Incompatibilidad Estricta de Rutas Curriculares (Anti-Fuga)**:
  - Comparación de los arrays de unidades de `6-7` vs `14-15`.
  - Verificación de 0% de solapamiento entre IDs de unidades.
  - Verificación de diferenciación cognitiva en títulos y explicaciones.
- **Grupo 3: Diagnóstico Conceptual Adaptativo**:
  - Búsqueda de ítems diagnósticos adaptados a la edad.
  - Cálculo de porcentaje de maestría inicial y recomendación de unidad de inicio dentro de su tramo.
- **Grupo 4: Motor de Generación Dinámica de Learning Path**:
  - Inicialización con unidad actual activa y 0% de progreso.
  - Actualización reactiva al completar unidades con puntuación $\ge 80\%$.

---

## 3. Matriz de Validación Manual / UI

| Caso de Prueba | Entrada / Acción | Resultado Esperado | Estado |
|---|---|---|---|
| **CP-01**: Onboarding 6 años | Registrar usuario con edad 6 | Onboarding solicita datos básicos y asigna tramo `6-7`. Cosmos muestra "Nuestra Casa es una Gran Esfera Azul". | ✅ APROBADO |
| **CP-02**: Onboarding 15 años | Registrar usuario con edad 15 | Asigna tramo `14-15`. Cosmos muestra "Cosmología y Fondo Cósmico CMB". | ✅ APROBADO |
| **CP-03**: Simulador Admin | Conmutar selector de nivel en Header | Cambia instantáneamente títulos, unidades, tests y lenguaje en tiempo real. | ✅ APROBADO |
| **CP-04**: Centro de Tests | Abrir pestaña "Tests" | Muestra las evaluaciones del tramo activo con estrellas y botón de reintento. | ✅ APROBADO |
| **CP-05**: Filtro Admin | Abrir Panel Admin $\to$ Usuarios | Filtra por tramo de edad, estado de acceso y abre la Ficha detallada del alumno. | ✅ APROBADO |
