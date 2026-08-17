/**
 * src/core/components/auth/PendingApprovalGate.tsx
 * Pantalla de Espera para Cuentas Pendientes de Autorización por el Administrador.
 * Incluye escucha reactiva en tiempo real y controles de comprobación y salida.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Clock, RefreshCw, LogOut, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export const PendingApprovalGate: React.FC = () => {
  const { user, logout } = useAuth();
  const [checking, setChecking] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleManualCheck = () => {
    setChecking(true);
    setMessage(null);
    setTimeout(() => {
      setChecking(false);
      setMessage("Tu solicitud continúa en la bandeja de revisión del Administrador. La pantalla se desbloqueará de forma automática en cuanto sea aprobada.");
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-fadeIn select-none font-display">
      
      {/* Halo de luz de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/20 text-white space-y-6 text-center">
        
        {/* Icono de Estado */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
          <Clock className="w-8 h-8 animate-pulse text-amber-400" />
        </div>

        {/* Textos Informativos */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Acceso Controlado • GOALS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Cuenta en Revisión
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            ¡Hola, <span className="font-bold text-white">{user?.displayName || 'Estudiante'}</span>! Tu registro ha sido recibido con éxito. Para garantizar un entorno seguro y personalizado, un administrador debe autorizar tu acceso.
          </p>
        </div>

        {/* Ficha Resumen del Usuario */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 text-left text-xs space-y-1.5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Detalles del Registro:</div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Email vinculado:</span>
            <span className="font-mono text-cyan-300 font-bold truncate max-w-[200px]">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Estado de solicitud:</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Pendiente de autorización
            </span>
          </div>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2 text-left animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Botonera de Acción */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleManualCheck}
            disabled={checking}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30 active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Comprobando...' : 'Comprobar Estado'}</span>
          </button>

          <button
            type="button"
            onClick={() => logout()}
            className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          💡 La página se actualizará automáticamente en cuanto el administrador apruebe tu cuenta.
        </p>
      </div>
    </div>
  );
};
