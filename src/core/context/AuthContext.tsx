import React, { createContext, useContext, useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { 
  auth, 
  db,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
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
  signInAsLocalDevAdmin: () => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfileData: (name: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Detección de entorno local
export const isLocalDev = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.includes('192.168.') ||
  Boolean((import.meta as any).env?.DEV)
);

export const LOCAL_DEV_ADMIN_USER: UserProfile = {
  uid: 'admin_local_dev_uid',
  displayName: 'Admin GOALS',
  email: 'josferestudio@gmail.com',
  photoURL: undefined,
  role: 'admin',
  isApproved: true,
  isAnonymous: false,
  providerId: 'local_admin'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fbUser, setFbUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const explicitLogout = localStorage.getItem('goals_explicit_logout') === 'true';
      if (explicitLogout) return null;

      const stored = localStorage.getItem('goals_local_user');
      if (stored) {
        return JSON.parse(stored);
      }
      if (isLocalDev) {
        localStorage.setItem('goals_local_user', JSON.stringify(LOCAL_DEV_ADMIN_USER));
        return LOCAL_DEV_ADMIN_USER;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isCloud, setIsCloud] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAdmin = user?.email === 'josferestudio@gmail.com' || user?.role === 'admin';

  useEffect(() => {
    if (!isFirebaseReady() || !auth) {
      setLoading(false);
      return;
    }

    let userDocUnsub: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (userDocUnsub) {
        userDocUnsub();
        userDocUnsub = null;
      }

      setFbUser(u);
      if (u) {
        localStorage.removeItem('goals_explicit_logout');
        setIsCloud(true);
        const isSuperAdmin = u.email === 'josferestudio@gmail.com';

        const baseProfile: UserProfile = {
          uid: u.uid,
          displayName: u.displayName || u.email?.split('@')[0] || 'Estudiante GOALS',
          email: u.email,
          photoURL: u.photoURL,
          role: isSuperAdmin ? 'admin' : 'user',
          isApproved: isSuperAdmin, // Super admin siempre aprobado; otros esperan confirmación de Firestore
          isAnonymous: u.isAnonymous,
          providerId: u.providerData[0]?.providerId || (u.isAnonymous ? 'guest' : 'password')
        };

        setUser(baseProfile);
        localStorage.setItem('goals_local_user', JSON.stringify(baseProfile));

        // Comprobar y escuchar en tiempo real la autorización en Firestore
        if (db && u.uid && !u.isAnonymous) {
          const userDocRef = doc(db, 'users', u.uid);

          try {
            const snap = await getDoc(userDocRef);
            if (!snap.exists()) {
              // Registro nuevo: crear con estado pendiente salvo si es Super Admin
              const initialData = {
                uid: u.uid,
                email: u.email,
                displayName: baseProfile.displayName,
                photoURL: u.photoURL,
                isApproved: isSuperAdmin,
                role: isSuperAdmin ? 'admin' : 'student',
                status: isSuperAdmin ? 'approved' : 'pending',
                requestedAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
              };
              await setDoc(userDocRef, initialData, { merge: true });
            } else {
              const existingData = snap.data();
              const approvedStatus = isSuperAdmin || existingData.isApproved === true;
              setUser(prev => prev ? {
                ...prev,
                isApproved: approvedStatus,
                role: isSuperAdmin ? 'admin' : (existingData.role || 'user')
              } : null);
            }
          } catch (err) {
            console.warn("[AuthContext] Error verificando estado de autorización en Firestore:", err);
          }

          // Escucha reactiva en tiempo real: si el Admin aprueba la cuenta, el usuario se desbloquea al instante
          userDocUnsub = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const approved = isSuperAdmin || data.isApproved === true;
              setUser(prev => {
                if (!prev) return null;
                const updated: UserProfile = {
                  ...prev,
                  displayName: data.displayName || prev.displayName,
                  isApproved: approved,
                  role: isSuperAdmin ? 'admin' : (data.role || 'user')
                };
                localStorage.setItem('goals_local_user', JSON.stringify(updated));
                return updated;
              });
            }
          });
        }
      } else {
        const explicitLogout = localStorage.getItem('goals_explicit_logout') === 'true';
        if (explicitLogout) {
          setUser(null);
          localStorage.removeItem('goals_local_user');
          setIsCloud(false);
          setLoading(false);
          return;
        }

        // Sin sesión en Firebase: revisar si hay sesión local de invitado o admin dev
        const stored = localStorage.getItem('goals_local_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed) {
              setUser(parsed);
              setIsCloud(false);
              setLoading(false);
              return;
            }
          } catch {}
        }
        
        if (isLocalDev) {
          setUser(LOCAL_DEV_ADMIN_USER);
          localStorage.setItem('goals_local_user', JSON.stringify(LOCAL_DEV_ADMIN_USER));
        } else {
          setUser(null);
          localStorage.removeItem('goals_local_user');
        }
        setIsCloud(false);
      }
      setLoading(false);
    });

    return () => {
      if (userDocUnsub) userDocUnsub();
      unsubscribe();
    };
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
        try {
          const res = await Promise.race([
            FirebaseAuthentication.signInWithGoogle(),
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Tiempo de espera agotado al conectar con Google Play")), 12000))
          ]);
          const idToken = res.credential?.idToken;
          if (idToken) {
            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential);
            setIsCloud(true);
            setAuthError(null);
            return;
          }
        } catch (nativeErr: any) {
          console.warn("Fallo o timeout en Google Auth nativo de Android, reintentando con popup web:", nativeErr);
          const res = await signInWithPopup(auth, googleProvider);
          if (res.user) {
            setIsCloud(true);
            setAuthError(null);
            return;
          }
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
    localStorage.removeItem('goals_explicit_logout');
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

  const signInAsLocalDevAdmin = async () => {
    setAuthError(null);
    localStorage.removeItem('goals_explicit_logout');
    setUser(LOCAL_DEV_ADMIN_USER);
    localStorage.setItem('goals_local_user', JSON.stringify(LOCAL_DEV_ADMIN_USER));
    setIsCloud(false);
  };

  const signOut = async () => {
    setAuthError(null);
    if (auth && isCloud) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn("Error signing out from Firebase:", e);
      }
    }
    localStorage.setItem('goals_explicit_logout', 'true');
    setUser(null);
    localStorage.removeItem('goals_local_user');
    localStorage.removeItem('astrolingo_local_user');
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
      signInAsLocalDevAdmin,
      signOut,
      logout: signOut,
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
