import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { db, doc, onSnapshot } from '../config/firebase';
import { Clock, LogOut, Mail, User, CheckCircle2 } from 'lucide-react';

export const PendingApprovalView: React.FC = () => {
  const { user, signOut } = useAuth();
  const { showToast } = useProgress();

  // Escuchar en tiempo real si el Admin aprueba la cuenta en Firestore
  useEffect(() => {
    if (!db || !user?.uid) return;

    const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isApproved === true) {
          showToast('🎉 ¡Tu acceso a GOALS ha sido APROBADO!');
          setTimeout(() => {
            window.location.reload();
          }, 800);
        }
      }
    });

    return () => unsub();
  }, [user?.uid, showToast]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 text-center font-display animate-fadeIn">
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
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Solicitud de Acceso Registrada</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Tu Solicitud Ha Sido Recibida
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            Tu cuenta se ha creado correctamente. La solicitud ya ha sido enviada y se encuentra en revisión. Accederás automáticamente una vez sea autorizada.
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
            <span className="text-slate-400 font-semibold">Estado de la Cuenta:</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" /> En Revisión
            </span>
          </div>
        </div>

        {/* Botón Salir / Entendido */}
        <div className="pt-2">
          <button
            onClick={signOut}
            className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
          >
            <LogOut className="w-4 h-4 text-amber-400" />
            <span>Entendido / Volver al Inicio</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-500 font-medium">
          📡 En cuanto la solicitud sea aceptada, la plataforma dará paso automáticamente.
        </p>

      </div>
    </div>
  );
};
