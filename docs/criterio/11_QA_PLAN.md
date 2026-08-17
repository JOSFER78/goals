# 11 · PLAN DE ASEGURAMIENTO DE CALIDAD (FASE 4 / 14 — QA PLAN)
**Mini App**: CRITERIO · Aprender a Informarse (GOALS)  
**Cobertura**: Funcional, Responsive (390px - 1440px), Rendimiento, Accesibilidad y QA Pedagógico  

---

## 1. MATRIZ DE VERIFICACIÓN DE CALIDAD

| Dimensión de Prueba | Criterio de Éxito | Método de Validación |
| :--- | :--- | :--- |
| **Funcionalidad Multi-Módulo** | Los 12 módulos y las 60 misiones cargan correctamente sin errores de consola | Navegación manual y automatizada por cada paso |
| **Simulador de Algoritmos** | El feed responde reactivamente a los clics del usuario y actualiza el gráfico de afinidad | Pruebas de estado en React y transiciones CSS |
| **Laboratorio Forense IA** | El comparador deslizante de imágenes y detector de alucinaciones funcionan con fluidez | Validación en viewport móvil y de escritorio |
| **Herramienta MATIZA** | Procesa consultas en vivo con fallback resiliente si el servidor no responde | Prueba con queries reales y corte simulado de red |
| **Responsive Design** | Cero scroll horizontal no deseado a 390px (iPhone SE/13), 768px (iPad) y 1440px (Desktop) | Emulación en DevTools y Playwright |
| **Persistencia de Progreso** | El XP, estrellas y lecciones completadas se guardan en `localStorage` y Firestore | Comprobación de estado tras recarga de página (`F5`) |
| **Rigor Pedagógico** | Ningún módulo ofrece afirmaciones falsas simplistas ni dogmáticas | Revisión por el agente pedagógico y escéptico |
| **TypeScript / Build** | `npm run build` compila con 0 errores de tipado | Ejecución del script `vite build` |
