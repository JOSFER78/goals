# Evidence and Provenance Protocol

For every factually meaningful object or relationship, distinguish:

1. **Observed/primary** — official dataset, institutional archive, primary record.
2. **Authoritative secondary** — reputable academic/institutional source.
3. **Reconstruction** — informed interpretation, historical reconstruction, inferred geometry.
4. **Pedagogical simplification** — intentionally transformed for teaching.
5. **Decorative/fictional** — visual element with no factual claim.

Recommended metadata:

```json
{
  "id": "object-id",
  "claim": "human-readable statement",
  "source": "canonical URL or dataset ID",
  "sourceType": "primary|secondary|reconstruction|pedagogical|fictional",
  "confidence": 0.0,
  "retrievedAt": "ISO-8601",
  "license": "license or unknown",
  "notes": "limitations"
}
```

Rules:
- Do not silently blend sources with conflicting definitions.
- Record retrieval dates for changing web data.
- Record license information for third-party assets.
- For historical reconstructions, distinguish evidence from inference.
- For scientific visualization, preserve units and definitions.
- If a quantity is approximate, say so.
