import React, { useState } from 'react';
import { ShieldCheck, Search, FileCheck, CheckCircle2, AlertTriangle, ExternalLink, Loader2, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { verifyFactOrHeadline } from '../../core/services/aiService';

interface VerifyViewProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const VerifyView: React.FC<VerifyViewProps> = ({ onOpenAuth }) => {
  const { addXP } = useProgress();
  const { user } = useAuth();
  const isAuthenticated = !!(user && !user.isAnonymous);

  const [headline, setHeadline] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  const handleVerifyHeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    if (!headline.trim() || isVerifying) return;
    setIsVerifying(true);
    setAuditResult(null);

    try {
      const result = await verifyFactOrHeadline(headline);
      setAuditResult(result);
      addXP(25, 'verify', 'Auditoría Real de Noticia con IA y Fuentes Oficiales');
    } catch (error: any) {
      setAuditResult({
        verdict: 'Error en Verificación',
        trustScore: '0%',
        summary: `Ocurrió un error al contactar al servidor de verificación de IA: ${error.message}`,
        sources: ['Servidor de Verificación Offline']
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full space-y-4 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-24 font-display">
      
      {/* Banner de Modo Exploración Libre */}
      {!isAuthenticated && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-amber-300 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Navegación Libre: Explora la Mini App Verifica. Inicia sesión para auditar noticias con la IA.</span>
          </div>
          <button
            onClick={() => onOpenAuth?.('signup')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 transition-all text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Todo</span>
          </button>
        </div>
      )}

      {/* Header de la Mini App Verifica */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">Verifica & Rigor Científico</h2>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>FUENTES OFICIALES</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Educación Crítica: Detección de Bulos, Rumores y Contrastación contra Publicaciones Académicas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Consulta de Noticia */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
        <form onSubmit={handleVerifyHeadline} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Introduce cualquier Titular, Rumor o Noticia a Verificar:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ej. 'La NASA cancela la misión Artemis' o 'Descubren vida en Marte'..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-amber-500/80 transition-colors outline-none font-sans font-medium"
              />
            </div>
          </div>

          {/* Sugerencias Rápidas */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ejemplos:</span>
            {[
              '¿Es verdad que el cometa pasará a simple vista?',
              '¿El telescopio James Webb detectó señales alienígenas?',
              '¿Se cancelan los exámenes oficiales de junio?'
            ].map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeadline(sug)}
                className="px-2.5 py-1 rounded-lg bg-slate-950/90 hover:bg-slate-800 border border-slate-800 text-[10px] font-medium text-slate-300 hover:text-white transition-all cursor-pointer truncate max-w-[280px]"
              >
                {sug}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying || !headline.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analizando Fuentes y Publicaciones Científicas...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Auditar Titular con IA Real</span>
              </>
            )}
          </button>
        </form>

        {/* Resultado del Dictamen */}
        {auditResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                auditResult.trustScore && parseInt(auditResult.trustScore) > 70
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                {auditResult.verdict}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">Nivel de Confianza: {auditResult.trustScore}</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">{auditResult.summary}</p>

            {auditResult.sources && auditResult.sources.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evidencias y Fuentes Oficiales Consultadas:</p>
                {auditResult.sources.map((src: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-amber-300/90 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{src}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Barra Inferior de Navegación Rápida */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-1.5 rounded-2xl flex justify-around shadow-2xl">
        <button
          onClick={() => {}}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Verificar</span>
        </button>

        <button
          onClick={() => {}}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Caza-Bulos</span>
        </button>

        <button
          onClick={() => {}}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <FileCheck className="w-4 h-4" />
          <span>Guía Detector</span>
        </button>
      </div>

    </div>
  );
};

