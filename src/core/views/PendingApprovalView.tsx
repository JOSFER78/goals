import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Clock, RefreshCw, LogOut, CheckCircle2, Mail, User } from 'lucide-react';

export const PendingApprovalView: React.FC = () => {
  const { user, signOut } = useAuth();
  const [checking, setChecking] = useState(false);

  const handleRefreshStatus = () => {
    setChecking(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 text-center font-display">
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-6 relative overflow-hidden">
        
        {/* Glow de fondo */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icono Principal Animatronics */}
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
            Solicitud Registrada con Éxito
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            Tu cuenta ha sido creada correctamente, pero para ingresar al ecosistema de <span className="text-white font-bold">GOALS</span> el administrador debe autorizar tu acceso.
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
            <span className="text-slate-400 font-semibold">Administrador Encargado:</span>
            <span className="text-amber-400 font-bold">josferestudio@gmail.com</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleRefreshStatus}
            disabled={checking}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Comprobando Autorización...' : 'Comprobar Estado de Autorización'}</span>
          </button>

          <button
            onClick={signOut}
            className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión / Usar Otra Cuenta</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-500 font-medium">
          Recibirás acceso en cuanto el administrador revise la lista de solicitudes desde su panel.
        </p>

      </div>
    </div>
  );
};
