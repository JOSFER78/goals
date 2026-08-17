# 🕹️ ESPECIFICACIÓN TÉCNICA: 8 SIMULADORES FÍSICOS 3D INTERACTIVOS (THREE.JS / WEBGPU)
## GOALS Cosmos — Física Numérica Exacta, Shaders GLSL y Modelos Interactivos Client-Side (CERO MOCKS)

**Integridad Técnica:** Física computacional real en navegador (Integrador RK4, Espectroscopía de Planck, Dilatación de Lorentz, Métrica de Schwarzschild en Shaders GLSL y Diagrama H-R dinámico).

---

### ÍNDICE DE LOS 8 SIMULADORES

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     LOS 8 SIMULADORES FÍSICOS 3D INTERACTIVOS (GOALS COSMOS)                     │
├────────┬──────────────────────────────────────────┬──────────────────────────────────────────────┤
│ ID     │ Nombre del Simulador                     │ Fundamento Físico-Matemático Exacto          │
├────────┼──────────────────────────────────────────┼──────────────────────────────────────────────┤
│ **SIM1**│ Mecánica Orbital & Asistencia Gravitatoria│ Integrador RK4 de N-cuerpos ($\Delta\mathcal{E}$)│
│ **SIM2**│ Espectrógrafo de Huellas de Fraunhofer   │ Ley de Planck y líneas $\text{H}_\alpha, \text{Na D}, \text{H}_2\text{O}$│
│ **SIM3**│ Dilatación Temporal Relativista          │ Reloj de luz y factor Lorentz $\gamma = 1/\sqrt{1-\beta^2}$│
│ **SIM4**│ Límite de Roche y Destrucción de Lunas   │ Cizalla kepleriana e InstancedMesh (5.000 partículas)│
│ **SIM5**│ Cronómetro de Retardo de la Luz          │ Constante $c = 299.792\text{ km/s}$ en el Sistema Solar│
│ **SIM6**│ Lente Gravitacional y Curvatura Espacio  │ Shader GLSL Métrica Schwarzschild ($\theta_E$)│
│ **SIM7**│ Mapeador 3D Galaxia y Grupo Local        │ Espirales logarítmicas y flujo de Laniakea   │
│ **SIM8**│ Vida de una Estrella (Diagrama H-R)      │ Pistas evolutivas MIST/Padova y Stefan-Boltzmann│
└────────┴──────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 1. SIM1: MECÁNICA ORBITAL Y ASISTENCIA GRAVITATORIA (SLINGSHOT)
- **Ecuación de Movimiento:**
  $$\frac{d^2 \mathbf{r}}{dt^2} = -\sum_{i=1}^N \frac{G M_i (\mathbf{r} - \mathbf{r}_i(t))}{\left( \|\mathbf{r} - \mathbf{r}_i(t)\|^2 + \epsilon^2 \right)^{3/2}}$$
- **Integrador Numérico RK4:** 4 evaluaciones por paso de tiempo para conservar energía en encuentros hiperbólicos.
- **Visualización 3D:** Vectores de velocidad heliocéntrica ($\mathbf{v}_{\text{in}}, \mathbf{V}_p, \mathbf{v}_{\text{out}}$) con `THREE.ArrowHelper` y esfera de influencia (SOI) transparente.

---

## 2. SIM2: ESPECTRÓGRAFO DE HUELLAS QUÍMICAS (LÍNEAS DE FRAUNHOFER)
- **Radiación Continua:** Ley de Planck $B_\lambda(\lambda, T)$ a temperatura $T_{\text{eff}}$.
- **Líneas de Absorción Reales ($\text{nm}$):** $\text{H}_\alpha (656.3), \text{H}_\beta (486.1), \text{Na D}_1/\text{D}_2 (589.6 / 589.0), \text{Fe} (527.0), \text{H}_2\text{O} (690-730), \text{CH}_4 (619.0)$.
- **Conversión $\lambda \to \text{RGB}$:** Algoritmo continuo con corrección gamma $\gamma = 0.8$.

---

## 3. SIM3: DILATACIÓN TEMPORAL RELATIVISTA DE EINSTEIN
- **Factor de Lorentz:** $\gamma = \frac{1}{\sqrt{1 - (v/c)^2}}$.
- **Viewport Dividido:**
  - *Arriba (Estación fija):* La nave se contrae ($L = L_0 / \gamma$) y el fotón viaja en trayectoria triangular.
  - *Abajo (Cabina de la nave):* La nave mide $L_0$ y el fotón viaja verticalmente en línea recta.

---

## 4. SIM6: SHADER GLSL DE LENTE GRAVITACIONAL (SCHWARZSCHILD)
```glsl
// Fragment Shader: GravitationalLensing.glsl
uniform sampler2D tBackgroundGalaxy;
uniform vec2 uLensCenter;
uniform float uEinsteinRadius;
uniform float uSchwarzschildRadius;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 d = (vUv - uLensCenter) * aspect;
    float r = length(d);
    if (r < uSchwarzschildRadius) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    float defl = (uEinsteinRadius * uEinsteinRadius) / max(r, 0.0001);
    vec2 deflectedUv = vUv - normalize(d) * (defl / aspect);
    vec4 sceneColor = texture2D(tBackgroundGalaxy, deflectedUv);
    float photonRing = smoothstep(uSchwarzschildRadius + 0.015, uSchwarzschildRadius, r);
    gl_FragColor = vec4(sceneColor.rgb + vec3(0.9, 0.6, 0.2) * photonRing * 2.5, 1.0);
}
```
