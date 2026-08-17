# Explorer Model

The explorer should be data-driven and UI-independent.

## Core entity

```ts
interface ExplorerEntity {
  id: string;
  type: string;
  name: string;
  parentId?: string;
  tags?: string[];
  representations?: string[];
  measurements?: Record<string, Measurement>;
  sources?: SourceRef[];
  children?: string[];
}
```

## Interaction vocabulary

- SELECT: select an entity.
- FOCUS: center camera/view on entity.
- FOLLOW: keep the entity in view as it moves.
- APPROACH: travel toward the entity.
- ORBIT: orbit around a reference entity.
- INSPECT: show contextual information.
- MEASURE: create a measurement between entities/locations.
- COMPARE: compare two or more entities.
- ISOLATE: hide unrelated layers/entities.
- CUTAWAY: reveal internal structures.
- EXPLODE: separate mechanical/structural components.
- ANIMATE: play a process or state transition.
- ANNOTATE: attach labels, notes, or teaching callouts.

## Representations

An entity can have multiple representations. Examples:
- globe → map → terrain → city;
- human → organ → tissue → cell;
- cell → organelle → molecular/process layer;
- machine → exterior → cutaway → exploded → animated;
- planet → spacecraft → surface landmark.

## Separation

Keep the following concerns separate:
- entity data;
- simulation state;
- spatial state;
- rendering state;
- interaction state;
- educational state;
- UI state.
