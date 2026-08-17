# ⚡ 11. ARQUITECTURA OFFLINE-FIRST, CACHÉ L1–L4 Y CAPACITOR EN CRITERIO
## Almacenamiento Local de Grafos Argdown, Inferencia de Reglas Lógicas y Sincronización CRDT

**Especialidad:** Infraestructura de Plataforma y Rendimiento Móvil  
**Pila:** Argdown Parser Wasm + Dexie IndexedDB + Capacitor Native  

---

## 1. PIRÁMIDE DE CACHÉ EN 4 CAPAS (L1–L4)
1. **L1 (RAM):** Árbol sintáctico del debate en memoria y tablas de verdad computadas ($<1\text{ ms}$).
2. **L2 (IndexedDB):** Casos históricos de verificación, metadatos y grafos de debate guardados localmente ($15\text{ ms}$).
3. **L3 (Firestore CDN):** Nuevos torneos de debate, actualizaciones de noticias y datasets de verificación ($200\text{ ms}$).
4. **L4 (Inmutable Bundle):** Motor de resolución lógica proposicional en JavaScript puro 100% offline ($0\text{ ms}$).

---

## 2. INTEGRACIÓN MÓVIL CAPACITOR
- `@capacitor/haptics`: Vibración háptica en la detección de falacias y aciertos socráticos.
- `@capacitor/screen-orientation`: Modo apaisado para la inspección de grafos dialécticos complejos.
- `@capacitor/local-notifications`: Notificaciones del dilema ético del día y mantenimiento de la racha crítica.
