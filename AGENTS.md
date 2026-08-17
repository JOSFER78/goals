# Reglas de Proyecto: GOALS (Memoria Persistente)

## 🔴 Integridad Técnica Absoluta (Cero Ilusiones / Cero Mocks)
- **Veracidad del Origen de Datos (Data Provenance)**: Si un modelo 3D, archivo, dataset o asset es pre-existente o descargado previamente (ej. NASA, NIH, repositorios CAD), se debe declarar explícitamente su origen. Queda ESTRICTAMENTE PROHIBIDO presentarlo como si hubiera sido generado en tiempo real desde una foto.
- **Prohibición de Pipelines Fantasma**: Si una funcionalidad requiere una GPU o backend neuronal (TRELLIS, DUSt3R, TripoSR) y no está conectado físicamente, NUNCA simular capas ni inventar temporizadores (`setTimeout`) cosméticos. Se debe declarar el estado real con total honestidad.
- **Denominación Exacta**: Nunca llamar "Reconstrucción Hiperrealista" a esquemas geométricos de cajas o cilindros; denominarlo "Diagrama Técnico Paramétrico".

## 🎮 Navegación y Controles 3D Universales (Obligatorio en Toda la Web)
- **Gestos Táctiles Móviles**: Todo visor Three.js / WebGL DEBE tener habilitado `enablePan: true`, `screenSpacePanning: true` y gestos de **dos dedos** (`touches: { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }`).
- **Navegación Desktop (Barra Espaciadora + Panning)**: En toda la web, mantener pulsada la **Barra Espaciadora (`Space`)** o clic derecho/rueda central debe cambiar el cursor a `grab`/`grabbing` y activar el modo de paneo/arrastre libre (`mouseButtons.LEFT = THREE.MOUSE.PAN`), restaurándose a rotación al soltar la tecla.

## 📱 Autenticación Google en Android APK (Capacitor Native vs Web)
- **Prohibición de OAuth WebView**: NUNCA usar `signInWithPopup` o `signInWithRedirect` dentro del entorno nativo APK de Android (genera error `403 disallowed_useragent`).
- **Delegación a Google Play Services**: En entorno nativo (`Capacitor.isNativePlatform()`), utilizar `@capacitor-firebase/authentication` con `FirebaseAuthentication.signInWithGoogle()` para invocar el selector nativo de cuentas de Android.
- **Intercambio de Credencial Firebase**: Extraer el `idToken` nativo devuelto por Google Play y vincularlo con `GoogleAuthProvider.credential(idToken)` a la instancia central de Firebase Auth mediante `signInWithCredential(auth, credential)`.
- **Huellas Criptográficas SHA**: Mantener registradas las huellas SHA-1 y SHA-256 de depuración y producción en la consola de Firebase (`android/app/google-services.json`).

## 🔄 Sistema de Auto-Actualizaciones In-App OTA (Firebase + APK)
- **Verificación Híbrida Silenciosa**: Toda APK comprueba en segundo plano `https://appgoals.web.app/version.json` con fallback en tiempo real a Firestore (`system_config/app_version`).
- **Control de Versión Semántica**: La versión central reside en `src/core/config/version.ts`, `public/version.json`, `package.json` y `android/app/build.gradle` (`versionCode` + `versionName`).
- **Descarga e Instalación Segura**: Notificar al usuario mediante `UpdateAvailableModal` con notas de la versión y delegar la descarga al navegador del sistema (`window.open(apkUrl, '_system')`) para que el instalador de Android gestione la actualización manteniendo los datos del usuario intactos.


