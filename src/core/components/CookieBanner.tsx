import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('goals_cookie_consent') || localStorage.getItem('al_cookie_consent');
      if (!consent) {
        // Mostrar suavemente tras 600ms al cargar por primera vez la web
        const timer = setTimeout(() => setShow(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignorar fallos de acceso a localStorage
    }
  }, []);

  const handleAccept = (type: 'accepted' | 'essential') => {
    try {
      localStorage.setItem('goals_cookie_consent', type);
      localStorage.setItem('al_cookie_consent', 'all');
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[100] animate-fadeIn font-display">
      <div className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-[0_10px_38px_rgba(0,0,0,0.8),0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-xl space-y-3 relative overflow-hidden">
        
        {/* Glow decorativo */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Encabezado */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0 shadow-inner">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white">Privacidad & Cookies en GOALS</h3>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-semibold">
                GDPR / LOPD
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Utilizamos cookies esenciales y almacenamiento local para guardar tu progreso educativo, sincronizar tus perfiles y garantizar la mejor experiencia interactiva en GOALS y Astrolingo.
            </p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => handleAccept('accepted')}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 text-slate-950" />
            <span>Aceptar Todas</span>
          </button>

          <button
            onClick={() => handleAccept('essential')}
            className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Solo Esenciales</span>
          </button>
        </div>

      </div>
    </div>
  );
};
