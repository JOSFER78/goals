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
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyAbkl4eCQ2M0E6XMwR52vwB_Um4hWt8q8Y",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "goalskid-app-4c276.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "goalskid-app",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "goalskid-app.firebasestorage.app",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "828956321348",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:828956321348:web:babec7f340ae5c7f823e11"
};

export function getStoredFirebaseConfig() {
  try {
    localStorage.removeItem('goals_firebase_config');
  } catch {}
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
