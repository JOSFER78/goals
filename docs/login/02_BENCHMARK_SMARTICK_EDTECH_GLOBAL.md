# 🏆 BENCHMARK GLOBAL: AUTENTICACIÓN INFANTIL, CONTROL PARENTAL Y UX EDTECH
## Caso de Estudio Principal: Smartick vs Duolingo, Khan Academy Kids, Prodigy Math, ST Math, Apple Family Sharing y Google Family Link

**Ecosistema:** GOALS Platform (6 a 15 Años)  
**Metodología:** Análisis de flujos de autenticación, ergonomía cognitiva infantil, separación de roles y mitigación de fricción en dispositivos compartidos.  
**Fecha:** Agosto 2026 • Estado: Documento Canónico de Benchmark de Mercado (SSOT).

---

### ÍNDICE GENERAL
1. **Smartick: El Gold Standard de EdTech Infantil (Separación de Roles & Picture PIN)**.
2. **Duolingo: Aislamiento Social y Cuentas COPPA sin Email**.
3. **Khan Academy Kids: Selector 1-Tap para Tablets Familiares y Modo Offline**.
4. **ST Math, Clever Badges y Contraseñas Pictográficas**.
5. **Apple Family Sharing & Google Family Link a Nivel de Sistema Operativo**.
6. **Tabla Comparativa Maestra de la Industria**.
7. **Arquitectura Canónica Adaptada para GOALS**.

---

## 1. SMARTICK — CASO DE ESTUDIO PRINCIPAL

```
                                  ┌──────────────────────────────┐
                                  │      CUENTA PADRE/MADRE      │
                                  │   (Titular / Facturación)    │
                                  │   Email + Password / OAuth   │
                                  └──────────────┬───────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
          ┌───────────────────────────┐                     ┌───────────────────────────┐
          │      HIJO 1 (6 años)      │                     │      HIJO 2 (11 años)     │
          │ Alias: "Mateo"            │                     │ Alias: "Lucia_Math"       │
          │ Login: Picture PIN        │                     │ Login: PIN Numérico (4d)  │
          │ (⭐ 🚀 🍎 🐱)              │                     │ (7 · 2 · 9 · 4)           │
          └─────────────┬─────────────┘                     └─────────────┬─────────────┘
                        │                                                 │
                        ▼                                                 ▼
          ┌───────────────────────────┐                     ┌───────────────────────────┐
          │     APP DEL ALUMNO        │                     │     APP DEL ALUMNO        │
          │ 15 Min Sesión Adaptativa  │                     │ 15 Min Sesión Adaptativa  │
          └─────────────┬─────────────┘                     └─────────────┬─────────────┘
                        │ (Al completar)                                  │ (Al completar)
                        ▼                                                 ▼
          ┌───────────────────────────┐                     ┌───────────────────────────┐
          │     MUNDO VIRTUAL         │                     │     MUNDO VIRTUAL         │
          │ Habitación, Tienda Ticks, │                     │ Gimnasio, Smartick Brain, │
          │ Smartick Brain, Pozo      │                     │ Tienda, Competición       │
          └───────────────────────────┘                     └───────────────────────────┘
```

### 1.1. Las 3 Claves del Éxito de Smartick:
1. **El Niño no gestiona contraseñas complejas:** Accede con un alias amigable y un Picture PIN de 4 iconos (para 4-8 años) o un PIN numérico de 4 dígitos (para 9-14 años).
2. **Separación de Entornos (*Air-Gapped Separation*):**
   - **Web/App del Padre:** Analítica profunda en tiempo real, desglose de aciertos/fallos por subcompetencia, velocidad de respuesta en ms, alertas de atascos y gestión de cobros.
   - **App del Alumno:** Túnel de concentración sin enlaces externos, sin ajustes, sin opciones de compra y con gamificación condicionada (el Mundo Virtual solo se abre tras completar la sesión diaria).
3. **Selector Nativo en Dispositivos Compartidos:** En la tablet del hogar, los hermanos aparecen con sus avatares; cada uno toca su tarjeta y entra con su PIN en menos de 2 segundos.

---

## 2. DUOLINGO, KHAN ACADEMY KIDS Y PRODIGY MATH

### 2.1. Duolingo for Schools: Aislamiento Social
- Las cuentas de menores de 13 años (o 14 en España) no requieren email del menor.
- Tienen las funciones sociales desactivadas por defecto: perfiles privados, sin chat abierto con desconocidos y ligas con avatares genéricos.

### 2.2. Khan Academy Kids: Selector 1-Tap y Modo Offline
- Diseñado para tablets compartidas en el hogar (hasta 5 perfiles infantiles bajo 1 cuenta parental).
- **Acceso 1-Tap:** El niño toca su personaje para entrar de inmediato.
- **Parental Gate Aritmético:** Para acceder a la configuración, la app exige resolver una multiplicación como $8 \times 9 = 72$.
- **Librería Offline:** Descarga de contenidos en almacenamiento local que se sincronizan en segundo plano al recuperar Wi-Fi.

### 2.3. ST Math & Clever Badges: Contraseñas Visuales y QR
- **ST Math:** Secuencia de imágenes espaciales memorizadas por el alumno.
- **Clever Badges:** Códigos QR físicos que el niño muestra a la cámara de la tablet/ordenador para iniciar sesión instantáneamente en el colegio.

---

## 3. TABLA COMPARATIVA MAESTRA

| Criterio | Smartick | Duolingo Schools | Khan Kids | Prodigy Math | Apple / Google Family | **GOALS (Estándar)** |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Público Objetivo** | 4 a 14 años | 6 a 18 años | 2 a 8 años | 6 a 14 años | Menores (<14a) | **6 a 15 años** |
| **Login Infantil** | Picture PIN / PIN 4d | Usuario + Password | Selector 1-Tap | Usuario + Password | Cuenta supervisada | **Picture PIN / PIN 4d** |
| **Fricción Prelectores**| Nula (Iconos) | Media | Nula | Alta | Automática | **Nula (4 Iconos)** |
| **Soporte Multihijo** | Nativo (Selector) | Logout manual | Hasta 5 niños 1-Tap | Cierre manual | Cuentas SO | **Nativo Multi-Hijo** |
| **Separación Padre/Hijo**| Total (2 Apps) | Web docente | Gate aritmético | Portal web | Ajustes SO | **Total (Parental Gate)**|
| **Modo Offline** | Sesión previa | Caché lección | Librería completa | Nulo | Políticas locales | **Cifrado AES-GCM local**|
| **Prevención IAP** | Cero compras niño | Cero IAP niño | 100% Gratis | Oferta guiada | Ask to Buy obligatorio| **Parental Gate Nivel 3**|

---

## 4. ESPECIFICACIÓN CANÓNICA DE LOGIN PARA GOALS

1. **Titular Único de Cuenta:** El padre/madre crea la cuenta con Email/Google/Apple Auth y define su **PIN Maestro Parental (4 dígitos)**.
2. **Perfiles Infantiles Sin Email:** Cada hijo tiene un alias (ej. *LeoCosmo*), un avatar cósmico, su curso escolar y su método de acceso:
   - **6 a 9 años:** **Picture PIN de 4 Iconos** (cuadrícula de 12 glifos: 🚀, ⭐, 🪐, 🍕, 🐱, 🤖, 🦖, 🍦, ⚡, 💎, 🚗, 🎮).
   - **10 a 15 años:** **PIN Numérico de 4 Dígitos**.
3. **Puerta Parental (*Parental Gate*):** Reto aritmético dinámico (ej. $7 \times 8 = 56$) + PIN Maestro para salir a la web general o acceder a pagos.
