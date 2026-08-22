# BLOQUE 18 — MULTIMODAL ARTIFACTS & INFOGRAPHICS

> **Fase:** 4 — Generadores de Contenido y Modalidades  
> **Dependencias:** Bloques 01, 02, 06, 11, 12  
> **Responsabilidad:** Despliegue de tarjetas visuales enriquecidas, infografías vectoriales SVG, diagramas gramaticales y mapas conceptuales disparados por el profesor.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Enriquecer la conversación auditiva y textual con artefactos visuales dinámicos. El profesor puede decidir proyectar en la interfaz tarjetas visuales cuando el tema requiera claridad espacial o conceptual (ej. el ciclo del agua, las partes de un avión, una tabla comparativa de tiempos verbales o un mapa de una ciudad). La imagen no es meramente decorativa: se convierte en la base de la siguiente pregunta socrática.

---

## 2. TIPOS DE ARTEFACTOS MULTIMODALES

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          MULTIMODAL ARTIFACTS                           │
├─────────────────┬──────────────────┬─────────────────┬──────────────────┤
│ 1. VisualCard   │ 2. GrammarTree   │ 3. Infographic  │ 4. ConceptMap    │
│  - Imagen real  │  - Diagrama SVG  │  - Datos clave  │  - Nodos conexos │
│  - Glosario     │  - Tiempos y uso │  - Ilustración  │  - Relaciones    │
└─────────────────┴──────────────────┴─────────────────┴──────────────────┘
```

---

## 3. CONTRATOS DE DATOS

```typescript
export type ArtifactType = 'visual_card' | 'grammar_diagram' | 'infographic' | 'concept_map' | 'vocabulary_card';

export interface MultimodalArtifact {
  id: string;
  type: ArtifactType;
  title: string;
  caption: string;
  svgContent?: string;
  imageUrl?: string;
  tags: string[];
  interactiveHotspots?: Array<{
    x: number; // Porcentaje 0 - 100
    y: number; // Porcentaje 0 - 100
    label: string;
    description: string;
  }>;
}
```

---

## 4. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 18 — MULTIMODAL ARTIFACTS]
Actúa como Especialista en Pedagogía Visual y Desarrollador Frontend en GOALS.
Tu tarea es implementar el Sistema de Artefactos Multimodales en `src/experiences/languages/components/artifacts/`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `ArtifactModalViewer.tsx`:
   - Modal emergente de alta resolución con fondo difuminado y animación suave de entrada.
   - Renderiza infografías vectoriales SVG generadas algorítmicamente y tarjetas fotográficas de ciencia/viajes.
   - Puntos interactivos (*hotspots*) pulsantes sobre la imagen que al tocarse revelan el término en el idioma objetivo y su pronunciación con un botón de audio.
2. Integra el disparador en el flujo del `TeacherAgent`:
   - Si la respuesta del profesor contiene un artefacto (`showVisualArtifact`), se proyecta una mini-tarjeta en el chat y se ofrece el botón "Expandir visualización".
3. Añade una biblioteca interactiva de "Mis Tarjetas Coleccionadas" donde el alumno puede repasar todos los artefactos desbloqueados.
```

---

## 5. CRITERIOS DE ACEPTACIÓN

- [x] **Interactividad Visual:** Los puntos calientes en las infografías emiten audio nativo y muestran definiciones.
- [x] **Cero Placeholders Rotos:** Todas las infografías utilizan SVG dinámicos o URLs seguras y verificadas.
- [x] **Integración Orgánica con el Diálogo:** La aparición de la tarjeta complementa lo que el profesor está explicando.

---

## 6. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿Las infografías SVG escalan nítidamente en cualquier resolución de pantalla?
- [ ] ¿Los puntos interactivos son cómodos de pulsar en pantallas táctiles?
- [ ] ¿El modal se puede cerrar con tecla Escape o pulsando fuera del contenido?
- [ ] ¿Los artefactos visualizados se guardan en la colección del estudiante?
