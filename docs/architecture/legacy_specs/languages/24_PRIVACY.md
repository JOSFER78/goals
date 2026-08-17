# BLOQUE 24 — SAFETY & PRIVACY AUDIT (COPPA / GDPR-K)

> **Fase:** 7 — Seguridad, QA y Despliegue  
> **Dependencias:** Bloques 01, 03, 04, 09, 23  
> **Responsabilidad:** Políticas de minimización de datos, cifrado en reposo, consentimiento parental y cumplimiento de normativas de menores.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Asegurar que la plataforma sea un entorno seguro, ético y legalmente conforme con la normativa internacional de protección de menores en internet (COPPA en EE.UU., GDPR-K en Europa). La arquitectura aplica minimización de datos, no almacena grabaciones de voz en bruto en servidores públicos, no perfila comercialmente a los estudiantes y permite la supresión total de datos con un clic.

---

## 2. PILARES DE SEGURIDAD Y PRIVACIDAD

```text
1. MINIMIZACIÓN: Solo se almacena lo imprescindible para la experiencia pedagógica.
2. PROTECCIÓN DE VOZ: El audio se procesa en memoria efímera sin persistencia de grabaciones sin consentimiento.
3. AISLAMIENTO: Las transcripciones no se utilizan para entrenar modelos públicos externos.
4. CONSENTIMIENTO: Verificación parental explícita para usuarios menores de 13/16 años.
5. DERECHO AL OLVIDO: Botón "Borrar todos mis datos de idiomas" con eliminación atómica en Firestore y LocalStorage.
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 24 — SAFETY & PRIVACY]
Actúa como Ingeniero de Seguridad y Cumplimiento Normativo (Privacy by Design) en GOALS.
Tu tarea es implementar el Módulo de Seguridad y Privacidad en `src/experiences/languages/services/privacyService.ts` y el modal `PrivacySettingsModal.tsx`.

REGLAS DE IMPLEMENTACIÓN:
1. Desarrolla `privacyService.ts`:
   - `exportStudentData()`: Descarga un archivo JSON con todos los datos pedagógicos del alumno.
   - `eraseAllStudentData()`: Limpia atómicamente el perfil, historial, errores y vocabulario en LocalStorage y Firestore (`users/{uid}/languages/...`).
   - `anonymizeTelemetry()`: Purga cualquier identificador personal antes de emitir métricas pedagógicas.
2. Desarrolla `PrivacySettingsModal.tsx`:
   - Explicación clara y accesible en lenguaje humano sobre qué datos se guardan y por qué.
   - Controles para activar/desactivar procesamiento de voz local o remoto.
   - Botón de exportación de datos y botón de eliminación permanente con confirmación por escrito.
3. Asegura que ningún dato personal sensible se transmita en cabeceras o URLs.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Eliminación Total:** El borrado purga el 100% de los datos del estudiante de forma irreversible y comprobable.
- [x] **Portabilidad de Datos:** Exportación completa en JSON estándar según el RGPD.
- [x] **Cero Telemetría Invasiva:** Ausencia total de trackers publicitarios o de terceros.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿El modal de privacidad explica de forma transparente el uso pedagógico de los datos?
- [ ] ¿La función de exportación genera un archivo JSON estructurado y válido?
- [ ] ¿La función de borrado limpia todas las claves `goals_languages_*` de LocalStorage?
- [ ] ¿Se requiere doble confirmación antes de eliminar el expediente del alumno?
