import React, { createContext, useContext, useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { 
  auth, 
  db,
  doc,
  setDoc,
  onAuthStateChanged, 
  signInWithPopup, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut as fbSignOut, 
  signInAnonymously,
  isFirebaseReady,
  User
} from '../config/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  fbUser: User | null;
  isCloud: boolean;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  signInGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfileData: (name: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fbUser, setFbUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('goals_local_user') || localStorage.getItem('astrolingo_local_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isCloud, setIsCloud] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAdmin = user?.email === 'josferestudio@gmail.com';

  useEffect(() => {
    if (!isFirebaseReady() || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setFbUser(u);
      if (u) {
        setIsCloud(true);
        const profile: UserProfile = {
          uid: u.uid,
          displayName: u.displayName || u.email?.split('@')[0] || 'Estudiante GOALS',
          email: u.email,
          photoURL: u.photoURL,
          isAnonymous: u.isAnonymous,
          providerId: u.providerData[0]?.providerId || (u.isAnonymous ? 'guest' : 'password')
        };
        setUser(profile);
        localStorage.setItem('goals_local_user', JSON.stringify(profile));

        // Sincronizar automáticamente la ficha del usuario en Firestore
        if (db && u.uid && !u.isAnonymous) {
          setDoc(doc(db, 'users', u.uid), {
            uid: u.uid,
            email: u.email,
            displayName: profile.displayName,
            photoURL: u.photoURL,
            isApproved: true,
            requestedAt: new Date().toISOString(),
            status: 'approved'
          }, { merge: true }).catch(err => console.warn("Error guardando ficha en Firestore:", err));
        }
      } else {
        setIsCloud(false);
        try {
          const local = localStorage.getItem('goals_local_user') || localStorage.getItem('astrolingo_local_user');
          if (local) setUser(JSON.parse(local));
          else setUser({ uid: 'guest', displayName: 'Invitado GOALS', email: null, photoURL: null, isAnonymous: true, providerId: 'guest' });
        } catch {
          setUser({ uid: 'guest', displayName: 'Invitado GOALS', email: null, photoURL: null, isAnonymous: true, providerId: 'guest' });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const signInWithGoogle = async () => {
    setAuthError(null);
    if (!isFirebaseReady() || !auth) {
      const err = "Firebase Auth no está listo en el cliente.";
      setAuthError(err);
      throw new Error(err);
    }
    try {
      if (Capacitor.isNativePlatform()) {
        const res = await FirebaseAuthentication.signInWithGoogle();
        const idToken = res.credential?.idToken;
        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
          setIsCloud(true);
          setAuthError(null);
          return;
        } else {
          throw new Error("No se obtuvo token de credencial de Google.");
        }
      } else {
        const res = await signInWithPopup(auth, googleProvider);
        if (res.user) {
          setIsCloud(true);
          setAuthError(null);
          return;
        }
      }
    } catch (err: any) {
      console.error("Firebase Google Auth Error Real:", err);
      const MAP: Record<string, string> = {
        'auth/popup-closed-by-user': 'Has cerrado la ventana de inicio de sesión con Google.',
        'auth/unauthorized-domain': 'Este dominio no está autorizado en la consola de Firebase Auth.',
        'auth/operation-not-allowed': 'El proveedor de Google no está activado en la consola de Firebase.'
      };
      const msg = MAP[err.code] || err.message || 'Error al autenticar con Google en Firebase.';
      setAuthError(msg);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!isFirebaseReady() || !auth) {
      const err = "El servicio de autenticación de Firebase no está disponible.";
      setAuthError(err);
      throw new Error(err);
    }
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
      setIsCloud(true);
      setAuthError(null);
    } catch (err: any) {
      console.error("Firebase Email Login Error Real:", err);
      const MAP: Record<string, string> = {
        'auth/invalid-credential': 'Email o contraseña incorrectos en Firebase.',
        'auth/user-not-found': 'No existe ninguna cuenta registrada con este correo en Firebase.',
        'auth/wrong-password': 'Contraseña incorrecta para esta cuenta.',
        'auth/invalid-email': 'Formato de correo electrónico no válido.',
        'auth/user-disabled': 'Esta cuenta de usuario ha sido desactivada.',
        'auth/operation-not-allowed': 'El inicio de sesión por Email/Contraseña no está habilitado en la consola de Firebase.'
      };
      const msg = MAP[err.code] || err.message || 'Error de autenticación en Firebase.';
      setAuthError(msg);
      throw err;
    }
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];
    if (!isFirebaseReady() || !auth) {
      const err = "Firebase Auth no está activo para registrar nuevas cuentas.";
      setAuthError(err);
      throw new Error(err);
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      await updateProfile(cred.user, { displayName: cleanName });
      setIsCloud(true);
      setAuthError(null);
    } catch (err: any) {
      console.error("Firebase SignUp Error Real:", err);
      const MAP: Record<string, string> = {
        'auth/email-already-in-use': 'Este correo electrónico ya está registrado en Firebase.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-email': 'El formato de correo no es válido.',
        'auth/operation-not-allowed': 'El registro por Email/Contraseña no está activado en Firebase Console.'
      };
      const msg = MAP[err.code] || err.message || 'Error al crear la cuenta en Firebase.';
      setAuthError(msg);
      throw err;
    }
  };

  const signInGuest = async () => {
    setAuthError(null);
    if (isFirebaseReady() && auth) {
      try {
        await signInAnonymously(auth);
        setIsCloud(true);
        return;
      } catch (e) {
        console.warn("Guest sign in error", e);
      }
    }
    const guestUser: UserProfile = {
      uid: 'guest',
      displayName: 'Invitado GOALS',
      email: null,
      photoURL: null,
      isAnonymous: true,
      providerId: 'guest'
    };
    setUser(guestUser);
    localStorage.setItem('goals_local_user', JSON.stringify(guestUser));
    setIsCloud(false);
  };

  const updateUserProfileData = async (name: string, photoURL?: string) => {
    if (auth && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name, photoURL: photoURL || null });
      if (db && auth.currentUser.uid && !auth.currentUser.isAnonymous) {
        try {
          await setDoc(doc(db, 'users', auth.currentUser.uid), {
            displayName: name,
            photoURL: photoURL || null
          }, { merge: true });
        } catch (e) {
          console.warn("Error saving updated profile to Firestore:", e);
        }
      }
    }
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, displayName: name, photoURL: photoURL || prev.photoURL };
      localStorage.setItem('goals_local_user', JSON.stringify(updated));
      return updated;
    });
  };

  const signOut = async () => {
    setAuthError(null);
    if (auth && isCloud) {
      await fbSignOut(auth);
    }
    const guestUser: UserProfile = {
      uid: 'guest',
      displayName: 'Invitado GOALS',
      email: null,
      photoURL: null,
      isAnonymous: true,
      providerId: 'guest'
    };
    setUser(guestUser);
    localStorage.setItem('goals_local_user', JSON.stringify(guestUser));
    setIsCloud(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      fbUser,
      isCloud,
      isAdmin,
      loading,
      authError,
      setAuthError,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInGuest,
      signOut,
      updateUserProfileData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
