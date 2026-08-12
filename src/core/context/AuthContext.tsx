import React, { createContext, useContext, useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { 
  auth, 
  db,
  doc,
  setDoc,
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
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

    // Comprobar si proviene de una redirección de autenticación
    if (Capacitor.isNativePlatform() || window.location.href.includes('goalskid.web.app')) {
      getRedirectResult(auth).then((result) => {
        if (result?.user) {
          setIsCloud(true);
        }
      }).catch(err => console.warn("Error en resultado de redirección:", err));
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
      throw new Error("Firebase no está configurado correctamente.");
    }
    try {
      if (Capacitor.isNativePlatform()) {
        try {
          const res = await signInWithPopup(auth, googleProvider);
          if (res.user) setIsCloud(true);
        } catch (popupErr: any) {
          console.warn("Popup en WebView falló, usando signInWithRedirect...", popupErr);
          await signInWithRedirect(auth, googleProvider);
        }
      } else {
        const res = await signInWithPopup(auth, googleProvider);
        if (res.user) {
          setIsCloud(true);
        }
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      const msg = err.code === 'auth/popup-closed-by-user' 
        ? 'Cancelado por el usuario.' 
        : 'Sugerencia: En la App Nativa Móvil, usa tu Correo y Contraseña para Iniciar Sesión de forma nativa e instantánea sin salir de la App.';
      setAuthError(msg);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    if (!isFirebaseReady() || !auth) {
      throw new Error("Firebase no está activo en este momento.");
    }
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setIsCloud(true);
    } catch (err: any) {
      const MAP: Record<string, string> = {
        'auth/invalid-credential': 'Email o contraseña incorrectos.',
        'auth/user-not-found': 'No existe cuenta con este correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-email': 'Formato de email no válido.'
      };
      const msg = MAP[err.code] || err.message || 'Error al iniciar sesión.';
      setAuthError(msg);
      throw err;
    }
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    setAuthError(null);
    if (isFirebaseReady() && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(cred.user, { displayName: name });
        setIsCloud(true);
      } catch (err: any) {
        const MAP: Record<string, string> = {
          'auth/email-already-in-use': 'Este correo ya está registrado.',
          'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
          'auth/invalid-email': 'Email no válido.'
        };
        const msg = MAP[err.code] || err.message || 'Error al crear la cuenta.';
        setAuthError(msg);
        throw err;
      }
    } else {
      const localUser: UserProfile = {
        uid: 'local_' + Date.now(),
        displayName: name,
        email,
        photoURL: null,
        isAnonymous: false,
        providerId: 'local'
      };
      setUser(localUser);
      localStorage.setItem('goals_local_user', JSON.stringify(localUser));
      setIsCloud(false);
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
