import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { PresentationEngine } from '../services/PresentationEngine';
import { ArrowLeft, Lock, Mail, User, Sparkles, KeyRound, X, GraduationCap } from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'signup';
  onBackToLanding: () => void;
  onSuccess: () => void;
  onOpenDownloadGuide?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login', onBackToLanding, onSuccess, onOpenDownloadGuide }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInGuest, signInAsLocalDevAdmin, authError, setAuthError } = useAuth();
  const { saveChildProfileData, showToast } = useProgress();
  
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAge, setSelectedAge] = useState<number>(9);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeLevelBadge = PresentationEngine.getLevelBadge(selectedAge);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    setIsSubmitting(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim();
    try {
      if (mode === 'login') {
        await signInWithEmail(cleanEmail, password);
      } else {
        await signUpWithEmail(cleanName, cleanEmail, password);
        saveChildProfileData({
          childName: cleanName || 'Estudiante',
          age: selectedAge,
          grade: activeLevelBadge.label.split(' (')[0],
          schoolName: '',
          favoriteSubjects: ['Ciencias Naturales', 'Inglés'],
          weakSubjects: [],
          extracurriculars: ['Robótica y Código 🤖'],
          interests: ['Espacio y Astronomía 🚀', 'Ciencia Ficción y Robots 🛸'],
          learningStyle: selectedAge <= 9 ? 'visual' : 'practico'
        });
        showToast(`✨ ¡Bienvenido/a ${cleanName}! Experiencia adaptada a ${selectedAge} años (${activeLevelBadge.label}).`);
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
            {mode === 'login' ? 'Iniciar Sesión en GOALS' : 'Crear Cuenta en GOALS'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Accede a tu perfil y progreso educacional' 
              : 'Regístrate para comenzar a aprender'}
          </p>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nombre del Estudiante</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tu nombre o apodo"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Edad y Nivel Educativo</span>
                  </label>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${activeLevelBadge.color}`}>
                    {activeLevelBadge.label}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[
                    { age: 7, label: '6-7', stage: '1º-2º Pri' },
                    { age: 9, label: '8-9', stage: '3º-4º Pri' },
                    { age: 11, label: '10-11', stage: '5º-6º Pri' },
                    { age: 13, label: '12-13', stage: '1º-2º ESO' },
                    { age: 15, label: '14-15', stage: '3º-4º ESO' }
                  ].map(item => {
                    const isSelected = (selectedAge <= 7 && item.age === 7) ||
                                       (selectedAge >= 8 && selectedAge <= 9 && item.age === 9) ||
                                       (selectedAge >= 10 && selectedAge <= 11 && item.age === 11) ||
                                       (selectedAge >= 12 && selectedAge <= 13 && item.age === 13) ||
                                       (selectedAge >= 14 && item.age === 15);
                    return (
                      <button
                        key={item.age}
                        type="button"
                        onClick={() => setSelectedAge(item.age)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold font-mono">{item.label}</div>
                        <div className="text-[9px] text-slate-400 truncate">{item.stage}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 font-medium">
                  🎯 Adaptaremos los textos, modelos 3D, tests y la IA a tu nivel.
                </p>
              </div>
            </>
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
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase text-slate-500 font-semibold bg-slate-900 px-2">o bien</div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm disabled:opacity-50 active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{mode === 'login' ? 'Iniciar sesión con Google' : 'Registrarse con Google'}</span>
        </button>

        {/* Acceso Rápido Desarrollador e Invitado */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={async () => {
              try {
                await signInGuest();
                onSuccess();
              } catch (e) {}
            }}
            className="py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-bold transition-all text-center cursor-pointer active:scale-95"
            title="Explorar como Invitado"
          >
            👤 Modo Invitado
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await signInAsLocalDevAdmin();
                onSuccess();
              } catch (e) {}
            }}
            className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-[11px] font-bold transition-all text-center cursor-pointer active:scale-95"
            title="Entrar como Super Admin"
          >
            ⚡ Super Admin (Dev)
          </button>
        </div>

        <div className="text-center pt-2 border-t border-slate-800/60">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setAuthError(null);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            {mode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
          </button>
        </div>
      </div>

    </div>
  );
};
