# 09 · INTEGRACIÓN Y CONTRATO TÉCNICO DE MATIZA (FASE 3 — MATIZA INTEGRATION)
**Mini App**: CRITERIO · Aprender a Informarse (GOALS)  
**Herramienta Integrada**: Laboratorio MATIZA de Contraste Fáctico y Matización  

---

## 1. PROPÓSITO Y POSICIONAMIENTO DENTRO DE GOALS

**MATIZA** no constituye una miniapp independiente ni compite con el núcleo formativo de CRITERIO; opera como una **estación de herramientas analíticas de alta precisión** integrada en la interfaz de CRITERIO.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MINI APP CRITERIO (GOALS)                       │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ 12 Módulos Didácticos │  │ Laboratorio de Feed & Algoritmos      │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ 60 Misiones de Campo  │  │ Laboratorio Forense de IA & Deepfakes │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 🛠️ LABORATORIO MATIZA (Herramienta Especializada de Contraste)   │  │
│  │ - Descomposición de afirmaciones en 4 capas de rigor             │  │
│  │ - Puntuación de certeza y detección de contexto faltante         │  │
│  │ - Conclusión matizada y enlaces a fuentes primarias verificadas  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CONTRATO DE ENTRADA Y SALIDA (API Y PROMPTING)

### Entrada:
- Texto sin formato o consulta introducida por el estudiante (ej. *"¿La inteligencia artificial gasta más agua que una ciudad entera?"*).

### Procesamiento en 4 Capas:
1. **Detección de la Afirmación Nuclear**: Qué está afirmando exactamente el texto, eliminando el ruido retórico y emocional.
2. **Cotejo de Hechos Comprobados**: Datos científicos o empíricos verificables con fuentes primarias.
3. **Identificación de Vacíos y Contexto Faltante**: Qué cifras se omiten, qué comparaciones son engañosas o qué matices técnicos alteran el significado.
4. **Dictamen Matizado**: Conclusión redactada en tono educativo que fomenta la comprensión en lugar del juicio absolutista.

### Salida Estructurada:
```json
{
  "claim": "¿El entrenamiento de la IA consume volúmenes desproporcionados de agua?",
  "verdict": "Parcialmente Cierto / Falta Contexto",
  "confidenceScore": 88,
  "confirmedFacts": [
    "Los centros de datos de gran escala requieren refrigeración por evaporación y electricidad que utiliza agua en su ciclo térmico.",
    "El entrenamiento de modelos fundacionales de gran tamaño tiene un consumo hídrico medible documentado por estudios de la Universidad de California Riverside."
  ],
  "uncertainOrMissing": [
    "La eficiencia hídrica varía radicalmente entre centros de datos modernos con circuitos cerrados y plantas antiguas.",
    "Comparar el consumo con 'una ciudad entera' sin especificar plazos ni tamaños genera una falsa equivalencia."
  ],
  "nuancedConclusion": "Es un reto ambiental y energético real en constante optimización tecnológica, pero no una catástrofe inmediata descontrolada como sugieren los titulares sensacionalistas.",
  "verifiedSources": [
    {
      "title": "Making AI Less Thirsty (UC Riverside / UTA)",
      "domain": "arxiv.org",
      "authorityLevel": "Académica"
    },
    {
      "title": "Informe de Sostenibilidad Ambiental de Centros de Datos",
      "domain": "iea.org",
      "authorityLevel": "Oficial / Primaria"
    }
  ]
}
```
