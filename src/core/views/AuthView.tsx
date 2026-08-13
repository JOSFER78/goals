import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Lock, Mail, User, Sparkles, KeyRound, X } from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'signup';
  onBackToLanding: () => void;
  onSuccess: () => void;
  onOpenDownloadGuide?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login', onBackToLanding, onSuccess, onOpenDownloadGuide }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, authError, setAuthError } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pantalla previa de bloqueo por Código de Invitación (3333)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.trim() === '3333') {
      localStorage.setItem('goals_invite_unlocked', 'true');
      setIsUnlocked(true);
      setCodeError(null);
    } else {
      setCodeError('🔑 Código de invitación incorrecto. Acceso denegado.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!isUnlocked && enteredCode.trim() !== '3333') {
      setCodeError('🔑 Debes verificar primero el código de acceso.');
      return;
    }

    setIsSubmitting(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim();
    try {
      if (mode === 'login') {
        await signInWithEmail(cleanEmail, password);
      } else {
        await signUpWithEmail(cleanName, cleanEmail, password);
      }
      onSuccess();
    } catch (err) {
      // Error expuesto mediante AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError(null);
    if (!isUnlocked && enteredCode.trim() !== '3333') {
      setCodeError('🔑 Debes introducir primero el código de acceso antes de continuar con Google.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err) {
      // Error expuesto mediante AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔒 PANTALLA PREVIA OBLIGATORIA: CÓDIGO DE INVITACIÓN SECRETO
  if (!isUnlocked) {
    return (
      <div className="pt-2 pb-12 max-w-md mx-auto px-4 w-full animate-fadeIn font-display">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-all mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Presentación GOALS</span>
        </button>

        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-6 text-center relative overflow-hidden">
          
          <button
            type="button"
            onClick={onBackToLanding}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
            title="Cerrar y volver a GOALS"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner animate-pulse">
            <KeyRound className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-widest">
              <Lock className="w-3 h-3" />
              <span>Control de Acceso Secreto</span>
            </div>

            <h2 className="text-2xl font-black text-white leading-tight">
              Introduce el Código de Invitación
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Para poder registrarte o iniciar sesión (vía Email o con Google), debes introducir tu clave secreta de acceso de 4 dígitos.
            </p>
          </div>

          {codeError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold animate-fadeIn">
              {codeError}
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                required
                autoFocus
                value={enteredCode}
                onChange={(e) => { setEnteredCode(e.target.value); setCodeError(null); }}
                placeholder="••••"
                className="w-full text-center tracking-[0.4em] text-2xl font-black py-3.5 rounded-2xl bg-slate-950 border-2 border-amber-500/50 text-amber-300 placeholder-slate-600 focus:border-amber-400 transition-all outline-none shadow-inner"
              />
              <p className="text-[10px] text-slate-500 mt-2 font-semibold">Introduce la clave secreta de 4 dígitos proporcionada por el administrador.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verificar Código y Desbloquear</span>
            </button>
          </form>

          <p className="text-[10px] text-slate-500 font-medium">
            🔒 Acceso protegido por código de invitación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-12 max-w-md mx-auto px-4 w-full animate-fadeIn">
      
      {/* Botón Volver */}
      <button
        onClick={onBackToLanding}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-all mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la Presentación GOALS</span>
      </button>

      {/* Tarjeta Formulario de Autenticación */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 relative">
        <button
          type="button"
          onClick={onBackToLanding}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
          title="Cerrar y volver a GOALS"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-display font-black text-indigo-400 text-sm mx-auto mb-2">
            G
          </div>
          <h2 className="font-display font-bold text-xl text-white">
            {mode === 'login' ? 'Iniciar Sesión en GOALS' : 'Solicitar Acceso por Invitación'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Accede a tu perfil autorizado y progreso en la nube' 
              : 'Registra tu solicitud. Requiere aprobación del administrador para ingresar.'}
          </p>
        </div>

        {/* Banner Infografía Acceso por Invitación */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Acceso Exclusivo por Invitación</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-normal">
            Al registrarte (vía Email o con Google), tu cuenta pasará a la lista de solicitudes. El administrador la autorizará para darte acceso completo.
          </p>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="estudiante@email.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Enviar Solicitud de Registro'}
          </button>
        </form>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase text-slate-500 font-semibold bg-slate-900 px-2">o bien</div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm disabled:opacity-50 active:scale-95"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{mode === 'login' ? 'Iniciar sesión con Google' : 'Solicitar Acceso con Google'}</span>
        </button>

        <div className="text-center pt-2 border-t border-slate-800/60">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setAuthError(null);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            {mode === 'login' ? '¿No tienes cuenta? Registrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
          </button>
        </div>

        {/* Aviso de App Nativa para Android con Icono Oficial (Abre la Guia de Descarga) */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3">
          <img src="/android-logo.png" alt="Android Official Logo" className="w-8 h-8 object-contain shrink-0" />
          <div className="text-left flex-1 min-w-0">
            <p className="text-[11px] font-bold text-white flex items-center gap-1">
              <span>App Nativa para Android</span>
            </p>
            <p className="text-[10px] text-slate-400">Instala GOALS directamente en tu dispositivo móvil.</p>
          </div>
          <button
            type="button"
            onClick={onOpenDownloadGuide}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shrink-0 transition-all shadow active:scale-95 cursor-pointer"
          >
            Descargar
          </button>
        </div>
      </div>

    </div>
  );
};
