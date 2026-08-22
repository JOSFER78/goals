# 🎯 PLAN MAESTRO: Ecosistema GOALS — Gamificación Unificada + Freemium (Criterio GRATIS)

**Fecha:** 2026-08-22 • **Presupuesto:** 10h • **Estado:** EN EJECUCIÓN

## Visión
GOALS = 1 cuenta de usuario (edad + curso) → 1 sistema de gamificación unificado (XP universal, 5 monedas, Master Key, 10 rangos cósmicos) → 5 miniapps conectadas:
- **🧭 Criterio = GRATIS** (app reclamo: enseñar a niños a informarse, detectar mentiras de la IA, fake news). Escaparate del ecosistema.
- **📐 Escuela IA, 🌌 Cosmos 3D, 🤖 IA Lab, 🗣️ Idiomas Voz = PREMIUM** (paywall con puerta parental + entitlement Firestore).
- **School IA** = tutor personalizado SIN gamificación interna (entorno sobrio), pero su sesión diaria activa la Master Key global.

## Decisiones adoptadas (defaults, sin respuesta del usuario)
1. Paywall: simulado + entitlement en Firestore (`users/{uid}.entitlements`). Sin Stripe/Play Billing aún.
2. Criterio: MVP jugable completo (la experiencia ya existe: 4.200 líneas; se cablea gamificación + free banner).
3. School: gateada como premium sin tocar su interior.

## Fases
### Fase 0 ✅ Investigación (3 subagentes paralelos)
- `01_gamificacion_criterio_spec.md` — fórmulas canónicas, 10 tiers, contratos TS, spec Criterio.
- `02_codebase_gap_analysis.md` — estado actual: XP básico 5 niveles, sin monedas/MasterKey/premium.
- `03_datos_freemium_spec.md` — modelo Firestore, COPPA/RGPD, parental gates, naming, planes.

### Fase 1 🔧 Sistema Unificado (base, secuencial — Chief)
1. `src/core/types/gamification.ts` — contratos SSOT: DomainCurrencies, CosmicTier (10), MasterKeyStatus, Entitlements, planes.
2. `src/core/services/GamificationEngine.ts` — Shannon Φ, curva 100 niveles `⌊120·L^1.85+250·L⌋`, Master Key (2.0x/2.5x), 5 monedas, badges cruzados.
3. `src/core/services/EntitlementService.ts` — planes free/premium, check `canAccess(expId)`, activación simulada, persistencia Firestore+local.
4. Integración en `ProgressContext.tsx` — addXP aplica moneda+MasterKey+Shannon; expone currencies/cosmicRank/masterKey/entitlements.

### Fase 2 🧭 Criterio GRATIS + escaparate (paralelo)
- Cablear XP/Synapse en CriterioExperience (módulos, misiones, laboratorios).
- Banner "GRATIS PARA SIEMPRE" + showcase del ecosistema dentro de Criterio (upsell ético).
- GoalsHome/Landing: Criterio destacada como reclamo gratuito.

### Fase 3 🔒 Paywall premium (paralelo)
- `PremiumGate.tsx`: pantalla de venta con puerta parental (aritmética 2 dígitos) antes del CTA.
- Wiring en MiniAppPortalGate/App.tsx: school/astro/ai-lab/languages → check entitlement → PremiumGate.
- Badges PREMIUM/FREE en GoalsHome, MiniAppsDrawer, Landing.

### Fase 4 🎮 UI gamificación + integración final (paralelo)
- MasterKeyHUD, CosmicRankCard (10 tiers + radar Shannon), widget monedas en Header/GoalsHome/ProfileModal.
- Tests (`npm test`), `npm run build`, verificación curl :4000, commit git.

## Reglas de ejecución
- Subagentes en paralelo solo sobre ficheros DISJUNTOS; la base (Fase 1) la hace el Chief primero.
- Cero mocks fantasma (AGENTS.md): el paywall es simulado y se declara como tal.
- Verificar siempre con build + curl, no a ciegas.
