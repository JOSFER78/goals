import React, { useState } from 'react';
import { ShieldCheck, Search, FileCheck, CheckCircle2, AlertTriangle, ExternalLink, Loader2, Lock } from 'lucide-react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { verifyFactOrHeadline } from '../../core/services/aiService';

interface VerifyViewProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const VerifyView: React.FC<VerifyViewProps> = ({ onOpenAuth }) => {
  const { addXP } = useProgress();
  const { user, isCloud } = useAuth();
  const isAuthenticated = isCloud && user && !user.isAnonymous;

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
    <div className="py-4 space-y-5 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-20">
      
      {/* Banner de Modo Exploración Libre si no ha iniciado sesión */}
      {!isAuthenticated && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-amber-300 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Navegación Libre: Explora la Mini App Verifica. Inicia sesión para auditar noticias con la IA.</span>
          </div>
          <button
            onClick={() => onOpenAuth?.('signup')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shrink-0 transition-all text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Todo</span>
          </button>
        </div>
      )}

      {/* Header de la Mini App Verifica */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/80 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-amber-500/30">🛡️</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl text-white">Verifica GOALS</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  IA Real Conectada 🟢
                </span>
              </div>
              <p className="text-xs text-amber-200">Educación Crítica para Estudiantes: Aprende a Verificar Noticias, Rumores y Detectar Bulos en Redes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Consulta de Noticia */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <form onSubmit={handleVerifyHeadline} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Introduce cualquier Titular, Rumor o Noticia a Verificar:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ej. 'He visto un vídeo que dice que cancelan los exámenes la semana que viene...'"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-amber-500 transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analizando Noticia y Buscando Evidencias...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verificar Noticia con Detector IA</span>
              </>
            )}
          </button>
        </form>

        {/* Resultado del Dictamen */}
        {auditResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                auditResult.trustScore && parseInt(auditResult.trustScore) > 70
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}>
                {auditResult.verdict}
              </span>
              <span className="text-xs font-extrabold text-amber-400">Nivel de Veracidad: {auditResult.trustScore}</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">{auditResult.summary}</p>

            {auditResult.sources && auditResult.sources.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400">Evidencias y Fuentes Oficiales:</p>
                {auditResult.sources.map((src: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-amber-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{src}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BARRA INFERIOR DE MENÚ RESPONSIVA (Estilo AstroLingo) */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 bg-slate-950/95 backdrop-blur-xl border border-amber-500/30 p-1.5 rounded-2xl flex justify-around shadow-2xl">
        <button
          onClick={() => {}}
          className="flex flex-col items-center gap-0.5 px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-md"
        >
          <Search className="w-4 h-4" />
          <span>Verificar</span>
        </button>

        <button
          onClick={() => {}}
          className="flex flex-col items-center gap-0.5 px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold text-slate-400 hover:text-white"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Caza-Bulos</span>
        </button>

        <button
          onClick={() => {}}
          className="flex flex-col items-center gap-0.5 px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold text-slate-400 hover:text-white"
        >
          <FileCheck className="w-4 h-4" />
          <span>Guía Detector</span>
        </button>
      </div>

    </div>
  );
};
