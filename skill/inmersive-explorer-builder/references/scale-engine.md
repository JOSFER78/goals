# Multiscale and Navigation Engineering

## Scale ladder

Document each meaningful range as a named level. Example:

| Level | Range | Reference frame | Precision strategy | LOD |
|---|---|---|---|---|
| L0 | macro | world/global | double/relative | low |
| L1 | regional | local region | relative | medium |
| L2 | object | object frame | float/relative | high |
| L3 | detail | local | high precision | very high |

Never assume this exact ladder applies to every domain.

## Coordinate strategy

For large worlds, evaluate:
- hierarchical transforms;
- local-origin rendering;
- floating-origin rebasing;
- relative-to-camera coordinates;
- double-precision simulation with lower-precision GPU transforms;
- logarithmic depth buffering.

## Camera strategy

The camera should support:
- focus target;
- bounded near/far ranges per scale;
- smooth approach;
- controlled max zoom;
- clipping-plane adaptation;
- target-aware orbit controls;
- free-flight when appropriate;
- camera state persistence.

## LOD strategy

LOD should be driven by projected screen-space error, distance, or another justified metric—not just arbitrary timers.

Stream high-detail textures/models only when needed.

## Accuracy

If an educational mode uses compressed distances, modified sizes, or exaggerated features, maintain the real values separately and surface the mode to the user.
