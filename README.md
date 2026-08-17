# 🚀 GOALS — Plataforma Educativa Inteligente Unificada

> **Ecosistema Educativo Multimodal con Tutoría IA, Física 3D NASA, Práctica de Idiomas por Voz y Gamificación Adaptativa estilo Duolingo / Smartick.**

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.165-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.4-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)

---

## 🌐 Enlaces Oficiales & Repositorio GitHub

- **Repositorio GitHub Oficial**: [JOSFER78 / goals](https://github.com/JOSFER78/goals)
- **Despliegue en Producción Firebase**: [goalskid.web.app](https://goalskid.web.app)
- **App Nativa Android**: APK v2.4.0 (`goalskid_2.4.apk`, 7.3 MB) disponible para descarga directa.

---

## 📱 Guía Arquitectónica: Autenticación Nativa con Google Auth en APK (Sideloaded APK fuera de Google Play Store)

### 🔴 1. El Problema del Bloqueo en WebViews (`403: disallowed_useragent`)
Cuando se intenta ejecutar la autenticación de Google mediante el SDK Web estándar de Firebase (`signInWithPopup` o `signInWithRedirect`) dentro del WebView nativo de una APK de Android, Google bloquea la petición arrojando el error **`403: disallowed_useragent`**. 

**¿Por qué sucede?**  
Google prohíbe las solicitudes OAuth desde "embedded WebViews" (`android.webkit.WebView`) para evitar ataques de suplantación de identidad (Phishing) y Man-in-the-Middle (MITM). Exige que la autenticación ocurra sobre la capa segura del sistema operativo o mediante Chrome Custom Tabs.

---

### 🛠️ 2. Solución Arquitectónica Nativa con Capacitor
Para resolver esto en una APK descargada fuera de Play Store (Sideloaded), se implementó la biblioteca nativa **`@capacitor-firebase/authentication`**, delegando el inicio de sesión directamente al motor nativo **Google Play Services** del sistema Android.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CAPACITOR ANDROID APK                           │
│                                                                        │
│  ┌────────────────────────┐            ┌────────────────────────────┐  │
│  │   AuthContext.tsx      │            │ Capacitor Bridge           │  │
│  │   (Entorno WebView)    │            │ Native Java Plugin         │  │
│  └───────────┬────────────┘            └─────────────┬──────────────┘  │
│              │                                       │                 │
│              │ 1. FirebaseAuthentication             │                 │
│              │    .signInWithGoogle()                │                 │
│              └──────────────────────────────────────►│                 │
│                                                      │                 │
│                                                      │ 2. Invoca       │
│                                                      ▼ Native OS       │
│                                        ┌────────────────────────────┐  │
│                                        │ Android System Sheet       │  │
│                                        │ (Google Play Services)     │  │
│                                        └─────────────┬──────────────┘  │
│                                                      │                 │
│                                                      │ 3. Retorna      │
│                                                      │    idToken      │
│  ┌────────────────────────┐                          │                 │
│  │ Firebase JS SDK        │◄─────────────────────────┘                 │
│  │ signInWithCredential() │ 4. Hydrates Session                        │
│  └────────────────────────┘                                            │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 🔑 3. Pasos de Configuración Paso a Paso

#### A. Registro de Huellas Digitales en Firebase Console
En el proyecto de Firebase (`astrolingo-96820`), dentro de la app Android con nombre de paquete **`app.goalskids.app`**, se registraron las firmas criptográficas del certificado debug/release del Keystore local:
- **SHA-1**: `0D:B3:75:69:13:14:5D:23:6C:8A:82:6F:E9:23:E8:4F:20:0D:35:DD`
- **SHA-256**: `FE:89:3D:B9:9A:37:15:22:A0:27:12:29:AE:1B:D2:4E:D7:F5:21:74:05:C1:0D:8B:E0:FD:F7:AD:46:23:20:0E`

#### B. Archivo `android/app/google-services.json`
Se descargó el manifiesto oficial de Google e instaló en `android/app/google-services.json`. Este archivo vincula el cliente nativo de Android (`client_type: 1`) con el servidor OAuth Web (`client_type: 3`), permitiendo el intercambio automático de `idToken`.

#### C. Inyección de Dependencias Gradle (`android/app/build.gradle`)
Se añadieron las librerías nativas uniformes de Google Play Services:
```gradle
dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.3.1')
    implementation 'com.google.firebase:firebase-auth'
    ...
}
apply plugin: 'com.google.gms.google-services'
```

#### D. Configuración del Plugin (`capacitor.config.ts`)
```typescript
const config: CapacitorConfig = {
  appId: 'app.goalskids.app',
  appName: 'GOALS Platform',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'goalskid.web.app'
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com']
    }
  }
};
```

#### E. Flujo de Código en `AuthContext.tsx` (Sin Cajas Rojas de Error)
```typescript
const signInWithGoogle = async () => {
  setAuthError(null);
  if (!isFirebaseReady() || !auth) {
    throw new Error("Firebase no está configurado correctamente.");
  }
  try {
    if (Capacitor.isNativePlatform()) {
      try {
        // Autenticación NATIVA con Google Play Services en Android
        const res = await FirebaseAuthentication.signInWithGoogle();
        const idToken = res.credential?.idToken;
        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
          setIsCloud(true);
          setAuthError(null);
          return;
        }
      } catch (nativeErr: any) {
        console.warn("Inicio de sesión nativo cancelado:", nativeErr);
        setAuthError(null); // Suprime errores rojos al usuario
      }
    } else {
      // Autenticación WEB estándar en navegador de escritorio
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setIsCloud(true);
        setAuthError(null);
      }
    }
  } catch (err: any) {
    console.error("Google Auth Error:", err);
    setAuthError(null);
  }
};
```

---

## 🔄 Motor de Verificación de Versiones e Instalación In-App

1. **Restricción Exclusiva para APK Nativa (`isNativeApp()`)**:
   - En el entorno **Web** (`https://goalskid.web.app`), la app **NO realiza comprobaciones de versión ni muestra notificaciones**, dado que la versión web siempre se sirve actualizada en vivo.
   - En la **APK Nativa instalada**, la función `getAppVersion()` consulta dinámicamente la versión real del paquete mediante la API del sistema operativo Android (`App.getInfo()`).
2. **Comparación Semver Transparente**:
   - `checkForApkUpdate()` consulta `https://goalskid.web.app/version.json?t=timestamp` forzando un bypass de caché HTTP.
   - Si la versión remota es mayor a la instalada (ej: `v2.4.0` > `v2.1.0`), notifica al usuario con enlace de descarga directa al archivo **`goalskid_2.4.apk`**.

---

## 📖 Arquitectura Teórica & Didáctica

**GOALS** es una plataforma educativa de nueva generación diseñada para unificar áreas de estudio tradicionalmente aisladas (matemáticas, física, idiomas y ciencia) en un **perfil de aprendizaje único y persistente**.

### 🧠 Principios Pedagógicos
1. **No-Silos de Progreso**: El estudiante no pierde sus logros ni su racha al pasar de resolver ejercicios de matemáticas a explorar misiones espaciales en 3D o practicar inglés con un tutor de voz.
2. **Aversión a la Pérdida & Racha Diaria (Streak)**: Basado en la economía conductual (Kahneman & Tversky), la racha diaria activa encendida en llama 🔥 crea un hábito de conexión diario sostenible.
3. **Comprensión Espacial Fotorreal 3D**: Sustituye la memorización pasiva de libros impresos por simulaciones interactivas en Three.js con escalas reales del Universo de la NASA.
4. **Tutoría Multimodal con IA Adaptativa**: La inteligencia artificial recuerda los fallos cometidos en lecciones anteriores para adaptar automáticamente los ejercicios y explicaciones a las necesidades del estudiante.

---

## 🧩 Ecosistema de las 4 Mini Apps Especializadas

```
                  ┌─────────────────────────────────────────┐
                  │          GOALS MAIN PLATFORM            │
                  │   Perfil Único • XP • Racha • Estrellas │
                  └────────────────────┬────────────────────┘
                                       │
         ┌──────────────────┬──────────┴──────────┬──────────────────┐
         ▼                  ▼                     ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  📚 Escuela IA  │ │ 🌐 Idiomas Voz  │ │🪐 AstroLingo 3D │ │   🧭 Criterio   │
│ Tutor OCR &     │ │ Voz IA &        │ │ Simulador NASA  │ │ Algoritmos, IA, │
│ Apuntes Mano    │ │ Memoria B1/B2   │ │ 18 Lecciones 3D │ │ Fuentes, MATIZA │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 1. 📚 Escuela IA
- **Tutor Multimodal con OCR**: Permite escanear con la cámara del dispositivo móvil fotos de deberes o cuadernos escritos a mano. La IA detecta ecuaciones (`2x + 5 = 15`) y texto manuscrito, guiando al estudiante paso a paso sin darle la respuesta directa.
- **Mapa Académico Conceptual**: Mapea el dominio de asignaturas (Matemáticas, Física, Biología, Historia) e identifica los temas a reforzar antes de exámenes.

### 2. 🌐 Idiomas Voz (AstroLingo Conversacional)
- **Tutor de Voz IA en Tiempo Real**: Inmersión hablada fluida con síntesis y reconocimiento de voz.
- **Memoria de Sesión**: El tutor de voz recuerda los errores fonéticos o gramaticales de charlas pasadas, adaptando el vocabulario técnico y científico a niveles B1/B2.

### 3. 🪐 AstroLingo 3D (Laboratorio Espacial)
- **Simulador 3D en 8 Escalas del Universo**: Desde la órbita de la Tierra y la Luna hasta exoplanetas, nebulosas y el agujero negro supermasivo M87*.
- **18 Lecciones Interactivas**: Artemis II, Starship Raptor 3, Telescopio James Webb, física orbital y tests de ordenación cronológica espacial.
- **54 Estrellas ⭐**: Sistema de puntuación estelar (0 a 3 estrellas por lección).

### 4. 🧭 Criterio (Aprender a Informarse)
- **Alfabetización Informativa, Algoritmos & Seguridad en IA**: 12 módulos pedagógicos por franjas de edad (8–18 años) bajo la pregunta «¿Y tú cómo lo sabes?».
- **Simulador de Feed de Redes Sociales**: Demostración interactiva de cómo los clics y el tiempo de pantalla entrenan al algoritmo de recomendación y crean cámaras de eco.
- **Laboratorio Forense de IA**: Detección práctica de alucinaciones de LLMs, deepfakes e imágenes generadas, y prevención de estafas por clonación de voz.
- **Método PAUSA & 60 Misiones Gamificadas**: Protocolo de desaceleración conductual (30s) y situaciones cotidianas con dificultad adaptativa.
- **Estación Integrada MATIZA**: Herramienta de descomposición y contraste de afirmaciones en 4 capas de rigor frente a fuentes primarias (BOE, NASA, ESA, CSIC).

---

## 🎯 Arquitectura Adaptativa & Cosmos 3D (5 Tramos LOMLOE: 6–15 Años)

GOALS cuenta con un **Motor Adaptativo Multidimensional** que calibra de forma estricta qué contenidos, vocabulario, densidad visual y evaluaciones recibe cada alumno según su edad:

- **5 Tramos de Edad y Etapas LOMLOE**:
  - `6-7 años`: Primaria 1º ciclo (Lenguaje sensorial, mantita protectora de aire, peonza día/noche, IA `cosmic_pet`).
  - `8-9 años`: Primaria 2º ciclo (Línea de Kármán a 100 km, gran eclipse de España 2026, traslación, IA `friendly_tutor`).
  - `10-11 años`: Primaria 3º ciclo (Mecánica Kepleriana, gravedad comparada, Nube de Oort, Voyager 1, IA `socratic_mentor`).
  - `12-13 años`: ESO 1º ciclo (Estrellas vecinas, Vía Láctea, agujero negro supermasivo Sagitario A*, IA `socratic_mentor`).
  - `14-15 años`: ESO 2º ciclo (Cosmología relativista, Fondo Cósmico CMB a 2,725 K, energía oscura y modelo $\Lambda$-CDM, IA `science_colleague`).
- **Separación Arquitectónica de 4 Capas**: Base de Conocimiento (SSOT Markdown) $\to$ Currículo Pedagógico (`CurriculumUnit`) $\to$ Estado del Alumno (`LearnerProfile` & `StudentLearningState`) $\to$ Presentación e IA (`PresentationProfile` & `PresentationEngine`).
- **Simulador en Tiempo Real para Super Admin**: Conmutador en cabecera para auditar instantáneamente la experiencia de cualquier tramo de edad.
- **Filtro de Alumnos en Admin**: Panel de control con filtrado por edad, curso, estado de autorización y visor de expedientes formativos.

---

## 🎮 Gamificación (Estilo Duolingo / Smartick)

- **🔥 Racha Diaria**: Evaluación consecutiva con heatmap semanal (L M X J V S D).
- **⭐ Estrellas por Lección**: Recompensa estelar (1 a 3 estrellas según porcentaje de acierto).
- **🎯 Retos Diarios con Recompensa de XP**: 5 misiones diarias con botón de reclamación instantánea.
- **🌌 Rangos Astronómicos**: Desde *Novato de la Tierra 🌍* hasta *Astrofísico Principal 🌌*.

---

## 💻 Stack de Tecnologías

- **Core**: React 18.3, TypeScript 5.4, Vite 5.4.
- **UI & Estilos**: Tailwind CSS 3.4 (Dark Glassmorphism, Neón), Lucide React.
- **Motor 3D**: Three.js 0.165 (WebGL, OrbitControls, Iluminación procedimental).
- **Backend & Nube**: Firebase Auth v10, Firestore Cloud Database, Firebase Hosting.
- **Empaquetado Nativo**: Capacitor 8, `@capacitor-firebase/authentication` 8.4, Gradle Android.

---

## ⚡ Guía de Compilación y Ejecución

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/JOSFER78/goals.git
cd 10_goals
npm install

# 2. Servidor de desarrollo local
npm run dev

# 3. Ejecutar Suite de Tests Adaptativos Automatizados
npm test

# 4. Compilación web para producción
npm run build

# 4. Sincronización nativa con Android
npx cap sync android

# 5. Compilar APK en Android
cd android
./gradlew assembleDebug
```

---

## 📄 Licencia & Autoría

- **Desarrollador / Creador**: José Fernando (JOSFER78)
- **Repositorio**: [https://github.com/JOSFER78/goals](https://github.com/JOSFER78/goals)
- **Plataforma**: GOALS Educational Platform & AstroLingo 3D

*GOALS Platform © 2026. Todos los derechos reservados.*
