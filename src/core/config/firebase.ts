import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut, 
  signInAnonymously,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, onSnapshot, Firestore } from 'firebase/firestore';

export const defaultFirebaseConfig = {
  apiKey: "AIzaSyBsaRLUUFG1QdSjMMzxzOVmzW4aqrN0TbM",
  authDomain: "appgoals.web.app",
  projectId: "goalskid-app",
  storageBucket: "goalskid-app.firebasestorage.app",
  messagingSenderId: "828956321348",
  appId: "1:828956321348:web:babec7f340ae5c7f823e11"
};

export function getStoredFirebaseConfig() {
  try {
    const custom = localStorage.getItem('goals_firebase_config');
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
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInAnonymously,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  onSnapshot
};
export type { User };
