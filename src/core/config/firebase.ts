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
  apiKey: "AIzaSyCucHoxxH6GXuEf_Gls397E98v4R2IXl-U",
  authDomain: "desinformacion-app.firebaseapp.com",
  projectId: "desinformacion-app",
  storageBucket: "desinformacion-app.firebasestorage.app",
  messagingSenderId: "607853319788",
  appId: "1:607853319788:web:0d2187ead98e5a99deaa49"
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
