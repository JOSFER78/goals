# BLOQUE 03 — FIREBASE & DATA MODEL

> **Fase:** 0 — Fundaciones  
> **Dependencias:** Bloque 01 (Architecture)  
> **Responsabilidad:** Esquemas de colecciones de Firestore, reglas de seguridad y sincronización resiliente con fallback en LocalStorage.

---

## 1. OBJETIVO TÉCNICO Y PEDAGÓGICO

Definir la estructura de datos persistente en Firestore y el motor de almacenamiento offline-first. Debe soportar el perfil del estudiante, estado de aprendizaje por competencias, memoria de errores, vocabulario activo/olvidado, sesiones episódicas y misiones sin inventar esquemas ad-hoc en componentes visuales.

---

## 2. COLECCIONES DE FIRESTORE Y ESQUEMAS

### 1. `users/{userId}/languages/profile`
```json
{
  "id": "usr_98124",
  "name": "Alex",
  "age": 9,
  "nativeLanguage": "Español",
  "targetLanguage": "Inglés",
  "overallLevel": "A2",
  "interests": ["Minecraft", "Astronomía", "Robótica", "Fútbol"],
  "learningStyle": "visual",
  "correctionPreference": "contextual",
  "dailyGoalMinutes": 15,
  "createdAt": "2026-08-14T08:00:00Z",
  "updatedAt": "2026-08-14T08:30:00Z"
}
```

### 2. `users/{userId}/languages/mastery`
```json
{
  "speaking": 68,
  "listening": 75,
  "reading": 80,
  "writing": 62,
  "grammar": 65,
  "vocabulary": 72,
  "pronunciation": 60,
  "fluency": 64,
  "lastCalculated": 1786696200000
}
```

### 3. `users/{userId}/languages/vocabulary/{vocabId}`
```json
{
  "id": "v_1786696201",
  "term": "boarding pass",
  "translation": "tarjeta de embarque",
  "status": "active",
  "confidence": 0.85,
  "lastUsed": "2026-08-14",
  "category": "travel",
  "exampleSentence": "Please show your boarding pass at gate 4."
}
```

### 4. `users/{userId}/languages/errors/{errorId}`
```json
{
  "id": "e_1786696202",
  "incorrect": "goed",
  "correction": "went",
  "category": "irregular_past",
  "frequency": 4,
  "severity": "medium",
  "status": "recurring",
  "lastSeen": "2026-08-14",
  "pedagogicalNote": "Confusión con el pasado simple irregular."
}
```

### 5. `users/{userId}/languages/sessions/{sessionId}`
```json
{
  "id": "s_1786696203",
  "timestamp": 1786696203000,
  "durationSeconds": 480,
  "activityType": "roleplay",
  "topic": "Aeropuerto",
  "xpEarned": 50,
  "skillsExercised": ["speaking", "vocabulary"],
  "summary": "Simulación fluida de check-in en aeropuerto."
}
```

---

## 3. PROMPT EJECUTABLE PARA AGY

```text
[PROMPT BLOQUE 03 — FIREBASE & DATA MODEL]
Actúa como Arquitecto de Datos y Backend en GOALS.
Tu tarea es implementar el modelo de datos unificado y el servicio de persistencia en `src/experiences/languages/services/memoryService.ts`.

REGLAS DE PERSISTENCIA:
1. Define las interfaces TypeScript en `types/index.ts` reflejando fielmente las colecciones de Firestore: `StudentLanguageProfile`, `SkillMastery`, `VocabularyItem`, `ErrorPattern`, `EpisodicMemory`.
2. Implementa sincronización bidireccional en `memoryService.ts`:
   - Si el usuario está autenticado en Firebase (`user.uid`), persiste y lee de Firestore en subcolecciones `users/{uid}/languages/...`.
   - Si está en modo offline o invitado, utiliza `localStorage` con claves con prefijo `goals_languages_*` de forma totalmente transparente.
3. Asegura que ninguna actualización de estado lance excepciones no controladas si Firestore está desconectado.
4. Exporta métodos para leer, crear, actualizar y borrar elementos de vocabulario, errores y perfiles.
```

---

## 4. CRITERIOS DE ACEPTACIÓN

- [x] **Persistencia Híbrida:** Funciona al 100% en modo offline (LocalStorage) y se sincroniza al autenticarse en Firebase.
- [x] **Integridad Referencial:** Los datos guardados respetan los tipos de TypeScript sin campos huérfanos.
- [x] **Cero Mocks:** Los datos persisten entre recargas de página y sesiones de usuario reales.

---

## 5. CHECKLIST DE VERIFICACIÓN (DEFINITION OF DONE)

- [ ] ¿Los esquemas de tipos están sincronizados entre `types/index.ts` y Firestore?
- [ ] ¿Al modificar el perfil se emiten eventos y se actualiza el almacenamiento local?
- [ ] ¿Las funciones de `memoryService.ts` capturan errores de red con `try/catch`?
- [ ] ¿El borrado y adición de vocabulario o errores actualiza el estado inmediatamente?
