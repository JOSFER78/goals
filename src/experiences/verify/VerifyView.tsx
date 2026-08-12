import React, { useState } from 'react';
import { ShieldCheck, Search, FileCheck, CheckCircle2, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { useProgress } from '../../core/context/ProgressContext';
import { verifyFactOrHeadline } from '../../core/services/aiService';

export const VerifyView: React.FC = () => {
  const { addXP } = useProgress();
  const [headline, setHeadline] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  const handleVerifyHeadline = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="py-4 space-y-5 max-w-4xl mx-auto px-3">
      
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
              <p className="text-xs text-amber-200">Investigación, Contraste de Noticias & Auditoría en Tiempo Real con LLM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador de Verificación */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400" />
            <span>Contraste Real de Noticias y Afirmaciones Científicas</span>
          </h3>
          <p className="text-xs text-slate-400">Pega un titular de prensa o afirmación para auditar su veracidad con la IA y fuentes oficiales.</p>
        </div>

        <form onSubmit={handleVerifyHeadline} className="flex gap-2">
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Ej: ¿La nave Artemis II de la NASA amerizó en el océano Pacífico?"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={isVerifying || !headline.trim()}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditando IA...</span>
              </>
            ) : (
              <span>Verificar Noticia</span>
            )}
          </button>
        </form>

        {auditResult && (
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                auditResult.trustScore && parseInt(auditResult.trustScore) > 70 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}>
                {auditResult.verdict}
              </span>
              <span className="text-xs font-extrabold text-amber-400">Nivel de Confianza: {auditResult.trustScore}</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">{auditResult.summary}</p>

            {auditResult.sources && auditResult.sources.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400">Fuentes y Consenso de IA:</p>
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

    </div>
  );
};
