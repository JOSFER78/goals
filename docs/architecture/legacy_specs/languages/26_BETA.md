# BLOQUE 26 — BETA LAUNCHER & MULTI-LANGUAGE SUITE

> **Fase:** 7 — Seguridad, QA y Despliegue  
> **Dependencias:** Todos los bloques anteriores (01 a 25)  
> **Responsabilidad:** Integración final en la suite GOALS, soporte para 6 idiomas globales, optimización de bundles y despliegue para producción.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Poner en producción la experiencia completa de Goals Languages. Soporta formalmente 6 idiomas objetivo con acentos, voces y currículos calibrados:
1. 🇬🇧 **Inglés** (*Oxford & General US*)
2. 🇫🇷 **Francés** (*Français Standard*)
3. 🇩🇪 **Alemán** (*Hochdeutsch*)
4. 🇯🇵 **Japonés** (*Tokyo Hyojungo*)
5. 🇮🇹 **Italiano** (*Italiano Standard*)
6. 🇵🇹 **Portugués** (*Português Europeu & Brasileiro*)

---

## 2. LISTA DE COMPROBACIÓN FINAL DE LANZAMIENTO BETA

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    GOALS LANGUAGES BETA RELEASE READY                   │
├─────────────────────────────────────────────────────────────────────────┤
│ [✓] 26 Bloques de ingeniería implementados modularmente                 │
│ [✓] Profesor de voz en tiempo real con Web Speech y síntesis neuronal   │
│ [✓] Memoria episódica, léxica y de errores persistente                  │
│ [✓] 6 modalidades de práctica bajo demanda                              │
│ [✓] Motor generativo de Roleplay con rúbricas de 5 dimensiones          │
│ [✓] Cuentos, lecturas interactivas y laboratorio de escritura           │
│ [✓] Planificador adaptativo Next Best Action en home                    │
│ [✓] Radar de dominio en 8 competencias CEFR (A1 a C2)                   │
│ [✓] Empaquetado Capacitor Android verificado libre de errores           │
│ [✓] Compilación Vite 100% limpia sin advertencias de tipos              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 26 — BETA LAUNCHER]
Actúa como Ingeniero de Release y Líder Técnico en GOALS.
Tu tarea es realizar el ensamblaje final, optimización y validación del lanzamiento de Languages en `src/experiences/languages/`.

REGLAS DE IMPLEMENTACIÓN:
1. Asegura que la navegación entre las 10 pestañas y modalidades funcione de manera instantánea y sin parpadeos:
   - Inicio / Profesor, Diálogo de Voz, Prácticas Rápidas, Roleplay, Cuentos, Lectura, Escritura, Traducción, Escucha, Progreso y Cosmos.
2. Verifica que el selector de los 6 idiomas actualice la voz de síntesis, la bandera, el acento y los ejemplos de muestra.
3. Ejecuta `npm run build` para validar que el bundle se genere sin errores de TypeScript ni recursos no resueltos.
4. Genera el documento de Release Notes y activa el acceso a la experiencia desde la Home principal de GOALS.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Construcción de Producción Exitosa:** `vite build` genera los artefactos en `dist/` sin advertencias.
- [x] **Experiencia Multilingüe Completa:** Soporte fluido para los 6 idiomas en todas las modalidades.
- [x] **Rendimiento Móvil Óptimo:** Tiempo de carga inicial inferior a 1 segundo en redes 4G/5G.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿Se pueden alternar los 6 idiomas y las voces responden en la lengua seleccionada?
- [ ] ¿El build de Vite finaliza con código de salida 0?
- [ ] ¿Todas las vistas y modales se cierran y limpian sus estados correctamente?
- [ ] ¿La experiencia de idiomas convive en perfecta armonía con Astro y el resto de GOALS?
