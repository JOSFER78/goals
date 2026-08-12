import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut, 
  signInAnonymously,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, Firestore } from 'firebase/firestore';

export const defaultFirebaseConfig = {
  apiKey: "AIzaSyBgEZaM-qNSHKcNr6ZJmQlo8kzpg1qpfAA",
  authDomain: "goalskid.web.app",
  projectId: "astrolingo-96820",
  storageBucket: "astrolingo-96820.firebasestorage.app",
  messagingSenderId: "882204482981",
  appId: "1:882204482981:web:aebeb62cd46ad4035d1c4c",
  measurementId: "G-X5C79PDNKB"
};

export function getStoredFirebaseConfig() {
  try {
    const custom = localStorage.getItem('goals_firebase_config') || localStorage.getItem('astrolingo_firebase_config');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.apiKey && parsed.apiKey.length > 5) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error leyendo configuración personalizada de Firebase", e);
  }
  return defaultFirebaseConfig;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function initFirebase(customConfig?: typeof defaultFirebaseConfig) {
  const config = customConfig || getStoredFirebaseConfig();
  if (config.apiKey && config.apiKey.length > 10) {
    try {
      if (getApps().length === 0) {
        app = initializeApp(config);
      } else {
        app = getApps()[0];
      }
      auth = getAuth(app);
      db = getFirestore(app);
      return { app, auth, db, isReady: true };
    } catch (err) {
      console.error("Error inicializando Firebase:", err);
    }
  }
  return { app: null, auth: null, db: null, isReady: false };
}

initFirebase();
export const isFirebaseReady = () => !!(auth && db);
export const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  db, 
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInAnonymously,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
};
export type { User };
