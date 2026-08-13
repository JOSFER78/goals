import React, { useState } from 'react';
import { Mic, Volume2, Globe, Sparkles, CheckCircle, ArrowRight, Play, RefreshCw, Send, Loader2, Lock } from 'lucide-react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { getLanguagePartnerResponse } from '../../core/services/aiService';

interface LanguagesViewProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const LanguagesView: React.FC<LanguagesViewProps> = ({ onOpenAuth }) => {
  const { addXP } = useProgress();
  const { user, isCloud } = useAuth();
  const isAuthenticated = !!(user && !user.isAnonymous);

  const [activeTab, setActiveTab] = useState<'voice' | 'science' | 'pronunciation'>('voice');
  const [userTextInput, setUserTextInput] = useState<string>('Hello teacher! Can you explain the difference between speed and velocity in physics?');
  const [targetLanguage, setTargetLanguage] = useState<string>('Inglés');
  const [isAskingAI, setIsAskingAI] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const handleSendLanguageQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    if (!userTextInput.trim() || isAskingAI) return;
    setIsAskingAI(true);
    setAiFeedback(null);

    try {
      const responseText = await getLanguagePartnerResponse(userTextInput, targetLanguage);
      setAiFeedback(responseText);
      addXP(20, 'languages', 'Práctica de Conversación de Idiomas con IA Real');
    } catch (error: any) {
      setAiFeedback(`❌ Error de comunicación con la IA: ${error.message}`);
    } finally {
      setIsAskingAI(false);
    }
  };

  return (
    <div className="py-4 space-y-5 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-20">
      
      {/* Banner de Modo Exploración Libre si no ha iniciado sesión */}
      {!isAuthenticated && (
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-cyan-300 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Navegación Libre: Explora la Mini App Idiomas. Inicia sesión para practicar voz en vivo con la IA.</span>
          </div>
          <button
            onClick={() => onOpenAuth?.('signup')}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shrink-0 transition-all text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Todo</span>
          </button>
        </div>
      )}

      {/* Header de la Mini App Idiomas */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-sky-950/80 border border-cyan-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-cyan-500/30">🌐</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl text-white">Idiomas GOALS</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  IA Real Conectada 🟢
                </span>
              </div>
              <p className="text-xs text-cyan-200">Conversación en Tiempo Real, Corrección Gramatical & Análisis Léxico</p>
            </div>
          </div>
        </div>

        {/* Pestañas Internas de Idiomas */}
        <div className="flex gap-2 pt-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'voice'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Tutor de Conversación IA</span>
          </button>

          <button
            onClick={() => setActiveTab('science')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'science'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Inmersión Científica</span>
          </button>

          <button
            onClick={() => setActiveTab('pronunciation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'pronunciation'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Pronunciación</span>
          </button>
        </div>
      </div>

      {/* Contenido de Voz / Texto IA Real */}
      {activeTab === 'voice' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sm text-white">Tutor Conversacional e Interactivo de Idiomas</h3>
            <p className="text-xs text-slate-400">Escribe o dicta tu mensaje para recibir corrección inmediata y respuesta fluida de la IA.</p>
          </div>

          <div className="flex gap-2 mb-2">
            {['Inglés', 'Francés', 'Alemán', 'Italiano'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setTargetLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  targetLanguage === lang
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendLanguageQuery} className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={userTextInput}
                onChange={(e) => setUserTextInput(e.target.value)}
                placeholder={`Escribe una frase en ${targetLanguage}...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={isAskingAI || !userTextInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isAskingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluando con IA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Frase a la IA ({targetLanguage})</span>
                </>
              )}
            </button>
          </form>

          {aiFeedback && (
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Evaluación y Respuesta del Tutor IA ({targetLanguage}):</span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {aiFeedback}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'science' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <h3 className="font-display font-bold text-sm text-white">Inmersión Léxica Científica & Tecnológica</h3>
          <p className="text-xs text-slate-400">Glosario interactivo con contexto técnico en tiempo real.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">Gravitational Singularity</span>
                <Volume2 className="w-4 h-4 text-cyan-400 cursor-pointer" />
              </div>
              <p className="text-xs text-slate-400">Singularidad Gravitatoria — Punto de densidad infinita en el centro de un agujero negro.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">Orbital Velocity</span>
                <Volume2 className="w-4 h-4 text-cyan-400 cursor-pointer" />
              </div>
              <p className="text-xs text-slate-400">Velocidad Orbital — Velocidad necesaria para mantener la órbita de un satélite.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pronunciation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <h3 className="font-display font-bold text-sm text-white">Análisis de Onda Fonética y Fluidez</h3>
          <p className="text-xs text-slate-400">Comparación visual entre tu onda de voz y la grabación nativa de referencia.</p>
          
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
            <div className="h-16 flex items-center justify-center gap-1">
              {[40, 70, 30, 90, 50, 80, 60, 40, 95, 30, 75].map((h, idx) => (
                <div key={idx} className="w-1.5 bg-cyan-400/80 rounded-full" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="text-xs text-cyan-300 font-semibold">Coincidencia Fonética: 96% Excepcional</p>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR DE MENÚ RESPONSIVA (Estilo AstroLingo) */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 bg-slate-950/95 backdrop-blur-xl border border-cyan-500/30 p-1.5 rounded-2xl flex justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-extrabold transition-all ${
            activeTab === 'voice' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Tutor Voz</span>
        </button>

        <button
          onClick={() => setActiveTab('science')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-extrabold transition-all ${
            activeTab === 'science' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Glosario</span>
        </button>

        <button
          onClick={() => setActiveTab('pronunciation')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-extrabold transition-all ${
            activeTab === 'pronunciation' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Fonética</span>
        </button>
      </div>

    </div>
  );
};
