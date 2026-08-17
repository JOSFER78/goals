# Architecture Patterns

## Recommended modular web shape

```text
app/
  src/
    core/
      simulation/
      spatial/
      camera/
      interaction/
      units/
    rendering/
      materials/
      lod/
      atmosphere/
      loaders/
    domain/
      entities/
      relationships/
      timelines/
      sources/
    experience/
      missions/
      lessons/
      narrative/
    ui/
  public/assets/
  data/
```

Use this only as a pattern. Adapt it to the project's actual stack.

## Rule: engine vs experience

Reusable engine code should not contain domain-specific facts.

Domain packs/configuration should provide:
- entities;
- measurements;
- positions/geometry;
- layers;
- assets;
- educational content;
- source metadata.

## Browser strategy

Use the simplest rendering stack that meets the project requirement. Consider WebGPU when supported and justified; keep a graceful fallback when practical. Do not select a renderer solely because it is fashionable.

## HTML

HTML is the delivery surface, not the architecture. Prefer a modular TypeScript/web application for projects that must evolve. A single HTML file is acceptable for a small prototype or isolated proof of concept only.
