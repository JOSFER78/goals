# Sistema de Auto-Actualizaciones OTA In-App (Firebase + APK)

## 📌 Visión General
Para aplicaciones Android distribuidas de forma directa (sideloaded / descargadas desde la web sin Google Play Store), el sistema de auto-actualizaciones in-app permite que el usuario reciba notificaciones automáticas dentro de la aplicación cada vez que se publica una nueva versión en Firebase, pudiendo actualizar el APK con un solo toque y sin perder sus datos de progreso.

---

## 🏗️ Flujo de Arquitectura

```mermaid
flowchart TD
    A[Arranque de la App / Comprobar Manual] --> B[AppUpdateService.checkForUpdates]
    B --> C{¿Hay conexión a version.json en Hosting?}
    C -->|SÍ| D[Obtener Payload JSON Remoto]
    C -->|NO| E[Consultar Firestore: system_config/app_version]
    E --> D
    
    D --> F{¿latestVersion > currentVersion?}
    F -->|NO| G[Estado: App al Día]
    F -->|SÍ| H[Activar useAppUpdate -> isModalOpen = true]
    
    H --> I[Mostrar UpdateAvailableModal con Release Notes]
    I --> J[Usuario pulsa 'Descargar e Instalar APK']
    J --> K{¿Es Capacitor Nativo?}
    K -->|SÍ| L[window.open(apkUrl, '_system') -> Gestor de Descargas Android]
    K -->|NO| M[Descarga directa en Navegador Web]
    L --> N[Instalador de Paquetes de Android actualiza el APK]
```

---

## 📄 Estructura del Manifiesto `public/version.json`

```json
{
  "version": "2.5.1",
  "versionCode": 251,
  "minRequiredVersion": "2.4.0",
  "releaseDate": "2026-08-17",
  "title": "Actualización Goalskid v2.5.1",
  "releaseNotes": [
    "Inicio de sesión con Google 100% nativo para Android (resolución bloqueo 403).",
    "Nueva navegación por pilares minimalista (Aprender, Laboratorio, Retos).",
    "Ajuste magnético suave y limpio en portadas y módulos.",
    "Showcase fotorrealista 16:9 sin textos superpuestos en fotos.",
    "Sistema de comprobación y notificación de auto-actualizaciones in-app."
  ],
  "apkUrl": "https://appgoals.web.app/download/goalskid-v2.5.1.apk",
  "apkDirectDownload": "https://appgoals.web.app/download/goalskid.apk",
  "fileSizeBytes": 16777216,
  "isMandatory": false
}
```

---

## 🛠️ Componentes Clave

1. **`src/core/config/version.ts`**:
   - Define `CURRENT_APP_VERSION = '2.5.1'`, `CURRENT_VERSION_CODE = 251` y la función de comparación semántica `compareSemver`.
2. **`src/core/services/AppUpdateService.ts`**:
   - Servicio singleton que realiza la comprobación con debounce y cache-busting `?_nocache=timestamp`.
3. **`src/core/hooks/useAppUpdate.ts`**:
   - Hook React para suscripción automática al estado de versiones.
4. **`src/core/components/UpdateAvailableModal.tsx`**:
   - Interfaz Dark Glassmorphism con indicador visual de versión, notas de versión (*changelog*) y botón de descarga directa.

---

## 🚀 Publicación de una Nueva Versión (Checklist)

1. Incrementar versión en `package.json` y `src/core/config/version.ts`.
2. Incrementar `versionCode` y `versionName` en `android/app/build.gradle`.
3. Actualizar `public/version.json` con las notas del parche.
4. Compilar web y sincronizar: `npm run build && npx cap sync android`.
5. Compilar APK: `cd android && ./gradlew assembleDebug` (o `assembleRelease`).
6. Colocar el nuevo APK en `public/download/goalskid.apk`.
7. Desplegar en Firebase: `firebase deploy`.
