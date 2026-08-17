# 🔐 README — ARQUITECTURA DE AUTENTICACIÓN FAMILIAR Y LOGIN INFANTIL (GOALS)

> **Guía Canónica de Ingeniería, Cumplimiento Legal y UX Infantil:**  
> Este documento describe la arquitectura unificada mediante la cual un padre/madre gestiona la cuenta titular de la familia y sus hijos acceden de forma autónoma, segura y sin contraseñas complejas (Picture PIN / PIN numérico) en toda la aplicación GOALS.

---

## 🎯 1. VISIÓN Y PRINCIPIOS CLAVE

1. **El Padre es el Titular Legal Único:** El adulto crea la cuenta maestra (Email, Google, Apple) y gestiona la facturación, los límites de tiempo de pantalla y la supervisión del progreso escolar.
2. **Cuentas Infantiles Zero-PII:** Los perfiles de los niños **no requieren correo electrónico, apellidos ni fotos reales**. Operan bajo pseudónimos seguros y avatares ilustrados.
3. **Acceso Infantil Adaptado por Edad:**
   - **6 a 9 años:** **Picture PIN de 4 Iconos** (secuencia visual en teclado de 12 a 16 glifos con feedback sonoro y háptico).
   - **10 a 15 años:** **PIN Numérico de 4 Dígitos**.
4. **Puerta Parental (*Parental Gate*) Infranqueable:** Retos matemáticos dinámicos y comprobación de PIN maestro antes de acceder a compras, facturación o salir a la web general (conforme a Apple Kids Category 1.3 y Google Play Families).
5. **Conmutador Rápido de Hermanos (*Multi-Child Switcher*):** En tablets compartidas del hogar, los hermanos cambian de perfil en 1 tap introduciendo únicamente su Picture PIN en menos de 150 ms sin cerrar la sesión del padre.

---

## 📚 2. ÍNDICE DE DOCUMENTOS EN ESTA CARPETA

| Documento | Contenido Principal |
| :--- | :--- |
| [`01_NORMATIVA_LEGAL_COPPA_RGPD_KIDS.md`](file:///c:/Obsidian/proyectos/webs/10_goals/docs/login/01_NORMATIVA_LEGAL_COPPA_RGPD_KIDS.md) | Marco legal internacional: COPPA (EE.UU.), RGPD-K / LOPDGDD (España, menores 14a), UK Children's Code (15 estándares ICO), Apple Kids 1.3/5.1.4 y Google Play Families. |
| [`02_BENCHMARK_SMARTICK_EDTECH_GLOBAL.md`](file:///c:/Obsidian/proyectos/webs/10_goals/docs/login/02_BENCHMARK_SMARTICK_EDTECH_GLOBAL.md) | Benchmark exhaustivo de líderes EdTech: Smartick (caso de estudio detallado), Duolingo for Schools, Khan Academy Kids, ST Math, Prodigy y Apple Family Sharing. |
| [`03_ARQUITECTURA_BASE_DATOS_RLS_SEGURIDAD.md`](file:///c:/Obsidian/proyectos/webs/10_goals/docs/login/03_ARQUITECTURA_BASE_DATOS_RLS_SEGURIDAD.md) | DDL SQL completo de 6 tablas PostgreSQL, políticas RLS, criptografía de Picture PIN con PBKDF2/Argon2id, custom JWT claims y persistencia cifrada offline AES-256-GCM. |
| [`04_UX_UI_ONBOARDING_PARENTAL_GATES.md`](file:///c:/Obsidian/proyectos/webs/10_goals/docs/login/04_UX_UI_ONBOARDING_PARENTAL_GATES.md) | Wireframes del onboarding en 4 pasos, diseño del teclado Picture PIN, generador algorítmico de retos dinámicos para adultos y conmutador de hermanos. |

---

## 💻 3. DEMOSTRADOR WEB INTERACTIVO EN VIVO

- **Archivo:** [`goals_kids_auth_showcase.html`](file:///c:/Obsidian/proyectos/webs/10_goals/goals_kids_auth_showcase.html) (en la raíz del proyecto).
- **Simulador Interactivo:**
  - 🔑 **Teclado Táctil Picture PIN:** 12 iconos interactivos con sintetizador Web Audio API real.
  - 🛡️ **Generador Dinámico de Parental Gate:** Operaciones aritméticas y transcripción de números en español.
  - 👨‍👩‍👧 **Conmutador Rápido de Hermanos:** Cambio de perfil en 1 tap con aislamiento total de datos.
  - 📄 **Selector de Vista Dual:** Alternador entre la interfaz web interactiva y el texto Markdown en crudo.
