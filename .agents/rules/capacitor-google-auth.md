# Regla de Proyecto: Autenticación de Google en Apps Móviles Capacitor (Android APK)

## 🔴 Prohibición Estricta de Flujo OAuth Web en WebView
- **Nunca usar `signInWithPopup` ni `signInWithRedirect` dentro de un APK**: Provoca el error `403 disallowed_useragent` debido a las restricciones de seguridad de Google para WebViews embebidos.

## 📱 Pipeline Nativo Obligatorio
1. **Detección de Entorno**: Condicionar el login mediante `Capacitor.isNativePlatform()`.
2. **Invocación Nativa**: Utilizar `@capacitor-firebase/authentication` con `FirebaseAuthentication.signInWithGoogle()`.
3. **Intercambio de Token**: Extraer el `idToken` y vincularlo a Firebase JS mediante `signInWithCredential(auth, GoogleAuthProvider.credential(idToken))`.
4. **Huellas Criptográficas**: Toda APK debe tener sus huellas SHA-1 y SHA-256 (debug y release) registradas en Firebase Console junto al `google-services.json` actualizado.
