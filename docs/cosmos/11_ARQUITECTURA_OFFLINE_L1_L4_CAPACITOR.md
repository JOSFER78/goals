# ⚡ 11. ARQUITECTURA DE SOFTWARE, CACHÉ L1–L4 Y MODO OFFLINE-FIRST
## Jerarquía de Memoria, Sincronización CRDT, Optimización Render-on-Demand (85% Ahorro Batería) y Empaquetado Móvil con Capacitor

**Especialidad:** Infraestructura de Plataforma, Modo Offline-First y Rendimiento Móvil

---

## 1. PIRÁMIDE DE CACHÉ EN 4 CAPAS (L1–L4)

```
        ┌─────────────────────────────────────────────────────────┐
        │  L1: RAM Memory Cache (Map / React State) [< 1 ms]      │
        ├─────────────────────────────────────────────────────────┤
        │  L2: IndexedDB Local Storage (Dexie / FileSystem) [15ms]│
        ├─────────────────────────────────────────────────────────┤
        │  L3: Cloud Firestore / Firebase Storage CDN [200 ms]    │
        ├─────────────────────────────────────────────────────────┤
        │  L4: Git SSOT Immutable Bundle (Procedural Canvas) [0ms]│
        └─────────────────────────────────────────────────────────┘
```

1. **L1 (RAM):** Mallas Three.js clonadas, texturas en VRAM, efemérides orbitales precalculadas.
2. **L2 (IndexedDB):** Modelos GLB cacheados, cola de operaciones offline `sync_queue`, historial local.
3. **L3 (Nube):** Sincronización delta con Firestore y assets remotos de alta resolución.
4. **L4 (Inmutable):** Código empaquetado en `dist/` con generadores de texturas procedurales Canvas 2K que garantizan funcionamiento en caso de caída de red total.

---

## 2. RECONCILIACIÓN CRDT BIDIRECCIONAL
Al reconectarse tras una sesión sin internet:
- **XP y Gemas:** $\text{XP}_{\text{final}} = \max(\text{XP}_{\text{local}}, \text{XP}_{\text{remote}}) + \Delta\text{XP}_{\text{offline}}$ (operación monótona aditiva sin pérdida).
- **Lecciones y Misiones Superadas:** Unión de conjuntos ($S_{\text{final}} = S_{\text{local}} \cup S_{\text{remote}}$).
- **Calificaciones de Tests:** Conservación de la mejor puntuación obtenida ($\max(S_{\text{local}}, S_{\text{remote}})$).

---

## 3. OPTIMIZACIÓN DEL MOTOR 3D (RENDER-ON-DEMAND)
- **Bucle Reactivo Condicional (`RenderDemandController`):** Detiene el bucle `requestAnimationFrame` cuando la escena está estática (sin interacción de usuario ni animaciones físicas activas).
- **Ahorro de Batería:** Hasta un **$85\%$ de reducción en el consumo energético** en tablets y teléfonos escolares.
- **Compresión KTX2 / Basis Universal:** Reduce el consumo de VRAM en un $75\%$ (de 64 MB a 16 MB por textura planetaria) con descompresión directa en GPU.

---

## 4. EMPAQUETADO MÓVIL NATIVO CON CAPACITOR
- `@capacitor/haptics`: Vibración háptica diferenciada en respuestas y cambios de escala.
- `@capacitor/screen-orientation`: Bloqueo apaisado automático al ingresar al visor espacial 3D y desbloqueo para lectura teórica.
- `@capacitor/local-notifications`: Notificaciones locales de eventos astronómicos reales y racha diaria.
- **Rendimiento:** First Contentful Paint (FCP) **$< 1,2\text{ segundos}$**.
