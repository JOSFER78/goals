# 📱 ARQUITECTURA OFFLINE L1-L4, CAPACITOR MOBILE Y MOTORES WASM CLIENT-SIDE
## Ejecución Local 100% Autónoma, OPFS, Pyodide Wasm (SymPy), ONNX Runtime Web y Almacenamiento SQLite Cifrado (GOALS School)

**Principio Rector:** La app de GOALS School debe funcionar de manera impecable en tablets, teléfonos Android/iOS (Capacitor) y navegadores web incluso en modo avión o sin conexión a internet en la escuela.

---

### ÍNDICE GENERAL
1. **Los 4 Niveles de Autonomía Offline (L1 a L4)**.
2. **Motor Simbólico SymPy en Cliente (Pyodide WebAssembly)**.
3. **Pipeline de OCR Local con ONNX Runtime Web (TrOCR & UniMERNet Quantized)**.
4. **Almacenamiento Local Cifrado con SQLite & OPFS (Origin Private File System)**.
5. **Configuración Capacitor para Despliegue Nativo en Android e iOS**.

---

## 1. LOS 4 NIVELES DE AUTONOMÍA OFFLINE (L1 A L4)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DE AUTONOMÍA LOCAL L1 A L4 EN GOALS SCHOOL                         │
├───────┬──────────────────────────┬─────────────────────────────┬───────────────────────────────────────┤
│ NIVEL │ ESTADO DE CONEXIÓN       │ CAPACIDAD LOCAL EN DISPOSITIVO│ MOTORES UTILIZADOS                    │
├───────┼──────────────────────────┼─────────────────────────────┼───────────────────────────────────────┤
│ **L1**│ Offline Total (Modo Avión)│ Tutoría Socrática Heurística,│ SLM Local Wasm (Gemma-2B / Qwen-1.5B) │
│       │                          │ SymPy Wasm, GeoGebra & BKT. │ + SQLite local cifrado.               │
├───────┼──────────────────────────┼─────────────────────────────┼───────────────────────────────────────┤
│ **L2**│ Conexión Intermitente    │ Sincronización en segundo   │ Background Sync Service Worker /      │
│       │                          │ plano de vectores y notas.  │ Workbox BackgroundSync Plugin.        │
├───────┼──────────────────────────┼─────────────────────────────┼───────────────────────────────────────┤
│ **L3**│ Conexión Estándar 4G/WiFi│ Tutoría Multimodal con OCR  │ Cloud API Vision + Gemini Flash       │
│       │                          │ en alta resolución y TTS HD.│ para respuestas ultrarrápidas.        │
├───────┼──────────────────────────┼─────────────────────────────┼───────────────────────────────────────┤
│ **L4**│ Conexión Alta Capacidad  │ Generación de simulacros    │ Pipelines de síntesis de voz          │
│       │                          │ adaptativos y PDF oficial.  │ neuronal y analítica docente avanzada.│
└───────┴──────────────────────────┴─────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. MOTOR SIMBÓLICO CLIENT-SIDE: SYMPY WASM (PYODIDE)

Para verificar operaciones matemáticas, derivar pasos intermedios y resolver ecuaciones sin depender de servidores externos:

```javascript
import { loadPyodide } from "pyodide";

let pyodideInstance = null;

export async function initLocalMathEngine() {
  if (!pyodideInstance) {
    pyodideInstance = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
    });
    await pyodideInstance.loadPackage("sympy");
    await pyodideInstance.runPythonAsync(`
import sympy as sp
from sympy.parsing.sympy_parser import parse_expr

def solve_step_by_step(equation_str, target_var_str):
    x = sp.Symbol(target_var_str)
    lhs, rhs = equation_str.split("=")
    eq = sp.Eq(parse_expr(lhs), parse_expr(rhs))
    sol = sp.solve(eq, x)
    return str(sol)
`);
  }
  return pyodideInstance;
}
```

---

## 3. CONFIGURACIÓN CAPACITOR PARA ANDROID E IOS (`capacitor.config.ts`)

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goals.school',
  appName: 'GOALS School: Super Tutor Bilingüe',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0b0f19',
      showSpinner: false
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
```
