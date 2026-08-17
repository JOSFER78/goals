# 📱 ARQUITECTURA OFFLINE L1–L4 Y EXPORTACIÓN MÓVIL CAPACITOR
## GOALS AI Lab — Soberanía Técnica Local, Caché de Modelos y Ejecución Autónoma (6 a 15 Años)

**Garantía:** Resiliencia Offline de Grado 1 (Cero Caídas por Pérdida de Conexión, Cero Transmisión de Datos Privados de Menores a Servidores Externos).  
**Pila de Despliegue:** Capacitor 6.x (Android & iOS nativo), Origin Private File System (OPFS), Web Workers multihilo y WebGPU / Wasm SIMD.

---

### ÍNDICE GENERAL
1. **Jerarquía de Almacenamiento Offline L1–L4**.
2. **Estrategia de Caché de Modelos y Pesos Binarios**.
3. **Pipeline de Integración con Capacitor (iOS / Android / Tablets Escolares)**.
4. **Verificación Criptográfica de Integridad (SHA-256)**.
5. **Sincronización Diferida y Persistencia Local de Progreso**.

---

## 1. JERARQUÍA DE ALMACENAMIENTO OFFLINE L1–L4

Para permitir que estudiantes de 6 a 15 años ejecuten laboratorios de código interactivo, visión artificial y redes neuronales en colegios o zonas rurales sin conexión continua a internet, GOALS AI Lab implementa una jerarquía de acceso a datos de 4 niveles:

```
┌────────────────────────────────────────────────────────────────────────┐
│               JERARQUÍA DE MEMORIA Y ALMACENAMIENTO LOCAL              │
├────────────────────────────────────────────────────────────────────────┤
│ L1: VRAM / Wasm Heap Memory (< 0.1 ms)                                 │
│     • Tensores activos en GPU WebGPU y memoria lineal CPython 3.12     │
├────────────────────────────────────────────────────────────────────────┤
│ L2: Origin Private File System - OPFS (5 - 20 ms)                      │
│     • Archivos binarios .onnx y paquetes .whl leídos con SyncHandle    │
├────────────────────────────────────────────────────────────────────────┤
│ L3: IndexedDB / Cache API Storage (20 - 60 ms)                         │
│     • Metadatos de retos, árboles AST serializados y firmas SHA-256    │
├────────────────────────────────────────────────────────────────────────┤
│ L4: Remote CDN / Hugging Face Hub (100 - 800 ms, Solo descarga inicial)│
│     • Paquetes base y pesos preentrenados (Descarga única verificada)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. ESTRATEGIA DE CACHÉ DE MODELOS Y PESOS BINARIOS

Los pesos de modelos como `SmolLM-135M` ($85\text{ MB}$ INT4), `all-MiniLM-L6-v2` ($22.7\text{ MB}$) y `MobileNet v2` ($14\text{ MB}$) se gestionan de forma atómica:

1. **Pre-Caché Selectivo por Tramo de Edad:**
   - **Tramos 1 y 2 (6–9 años):** Solo se hidratan los módulos visuales ligeros de MediaPipe y el motor de bloques Blockly ($< 15\text{ MB}$ en disco).
   - **Tramo 3 (10–11 años):** Se hidrata el runtime Wasm de Pyodide con NumPy y SymPy ($< 25\text{ MB}$).
   - **Tramos 4 y 5 (12–15 años):** Se hidratan Scikit-Learn Wasm, ONNX Runtime Web y los embeddings locales ($< 120\text{ MB}$).

2. **Acceso Síncrono Ultrarrápido con `FileSystemSyncAccessHandle`:**
   En los Web Workers, la lectura directa de OPFS evita la sobrecarga de serialización a Blob de IndexedDB, transfiriendo bloques de bytes directamente a la memoria de WebGPU o Wasm.

---

## 3. INTEGRACIÓN CON CAPACITOR (ANDROID & iOS)

El empaquetado nativo para tablets y teléfonos móviles infantiles se realiza mediante Capacitor sin modificar la base de código web:

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goals.ailab',
  appName: 'GOALS AI Lab',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: false
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    ScreenOrientation: {
      orientation: 'landscape' // Vista óptima para IDE interactivo infantil
    }
  }
};

export default config;
```

---

## 4. VERIFICACIÓN CRIPTOGRÁFICA DE INTEGRIDAD SHA-256

Antes de cargar cualquier archivo binario `.onnx` o `.whl` en el espacio de ejecución, el sistema calcula su firma SHA-256 en cliente mediante `crypto.subtle.digest('SHA-256', buffer)` comparándola con el manifiesto firmado. Si la firma no coincide, el archivo se purga y se solicita re-descarga, impidiendo cualquier inyección de código malicioso.

---

## 5. PERSISTENCIA LOCAL Y PRIVACIDAD TOTAL

- **Cero Envío de Telemetría a la Nube:** Las soluciones de código, errores de depuración, grabaciones de cámara para visión artificial y conversaciones con agentes locales residen exclusivamente en la base de datos local SQLite/IndexedDB del dispositivo del menor.
- **Conformidad Estricta:** Cumple al 100% con **COPPA**, **FERPA**, el **RGPD (Reglamento UE 2016/679)** y el **Reglamento de IA de la UE (2024/1689)**.
