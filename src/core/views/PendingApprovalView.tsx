import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { db, doc, setDoc, onSnapshot } from '../config/firebase';
import { ShieldAlert, Clock, RefreshCw, LogOut, Mail, User, Send, CheckCircle2 } from 'lucide-react';

export const PendingApprovalView: React.FC = () => {
  const { user, signOut } = useAuth();
  const { showToast } = useProgress();
  const [checking, setChecking] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Escuchar en tiempo real cambios en el documento del usuario en Firestore
  // Si el Admin pulsa "Aprobar", la app desbloquea al instante sin recargar
  useEffect(() => {
    if (!db || !user?.uid) return;

    const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isApproved === true) {
          showToast('🎉 ¡Tu acceso a GOALS ha sido APROBADO por el Administrador!');
          setTimeout(() => {
            window.location.reload();
          }, 800);
        }
      }
    });

    return () => unsub();
  }, [user?.uid, showToast]);

  const handleSendRequest = async () => {
    setChecking(true);
    try {
      if (db && user?.uid) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Estudiante GOALS',
          photoURL: user.photoURL || null,
          isApproved: false,
          status: 'pending',
          requestedAt: new Date().toISOString(),
          lastRequestedAt: new Date().toISOString()
        }, { merge: true });

        setRequestSent(true);
        showToast('📩 ¡Solicitud de autorización enviada en tiempo real al Administrador!');
      } else {
        showToast('⚠ Modo local: Tu solicitud ha sido registrada');
      }
    } catch (e) {
      console.error("Error al enviar solicitud:", e);
      showToast('Error al enviar la solicitud al servidor');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 text-center font-display">
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-6 relative overflow-hidden">
        
        {/* Glow de fondo */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icono Principal */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner animate-pulse">
          <Clock className="w-8 h-8" />
        </div>

        {/* Título & Mensaje Principal */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-widest">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Acceso Pendiente de Autorización</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Solicitud Registrada en la Red
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            Tu cuenta ha sido registrada correctamente, pero requiere autorización del Administrador para acceder al ecosistema unificado de <span className="text-white font-bold">GOALS</span>.
          </p>
        </div>

        {/* Ficha Resumen del Usuario */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-left text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-bold text-white truncate">{user?.displayName || 'Estudiante'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{user?.email}</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-semibold">Administrador Principal:</span>
            <span className="text-amber-400 font-bold">josferestudio@gmail.com</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSendRequest}
            disabled={checking}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2"
          >
            {checking ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : requestSent ? (
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
            ) : (
              <Send className="w-4 h-4 text-slate-950" />
            )}
            <span>{checking ? 'Enviando Solicitud al Admin...' : requestSent ? ' Reenviar Notificación al Admin' : '📩 Notificar / Solicitar Autorización al Admin'}</span>
          </button>

          <button
            onClick={signOut}
            className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión / Cambiar de Cuenta</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-500 font-medium">
          📡 Escuchando en tiempo real: En cuanto el administrador autorice tu correo, entrarás automáticamente.
        </p>

      </div>
    </div>
  );
};
