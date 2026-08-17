# ⚡ 11. ARQUITECTURA OFFLINE-FIRST, CACHÉ L1–L4 Y CAPACITOR EN IDIOMAS
## Jerarquía de Memoria de Audio, Whisper ONNX Cuantizado INT8 y Sincronización CRDT

**Especialidad:** Infraestructura de Plataforma y Rendimiento Móvil  
**Stack:** Web Audio API + Dexie IndexedDB + Capacitor Native Plugins  

---

## 1. PIRÁMIDE DE CACHÉ DE AUDIO Y LÉXICO (L1–L4)

1. **L1 (RAM Memory):** Buffers de audio decodificados (Float32) y estados de conversación inmediatos ($<1\text{ ms}$).
2. **L2 (IndexedDB / Dexie):** Banco de 5.000 palabras con archivos de audio OGG/Opus y modelo Whisper-tiny cuantizado en INT8 ($15\text{ ms}$).
3. **L3 (Firestore CDN):** Descarga de nuevos roleplays y paquetes temáticos avanzados ($200\text{ ms}$).
4. **L4 (Inmutable Bundle):** Voces sintéticas nativas Web Speech API como respaldo sin conexión ($0\text{ ms}$).

---

## 2. INTEGRACIÓN CAPACITOR MÓVIL
- `@capacitor/voice-recorder`: Captura de audio de baja latencia con reducción de ruido ambiental.
- `@capacitor/haptics`: Vibración háptica diferenciada en fonemas acertados y pausas prosódicas.
- `@capacitor/local-notifications`: Recordatorio de repaso fonético espaciado (Pimsleur).
