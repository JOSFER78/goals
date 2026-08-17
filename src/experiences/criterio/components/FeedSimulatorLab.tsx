import React, { useState } from 'react';
import { 
  Heart, Share2, MessageCircle, AlertTriangle, Cpu, Sparkles, 
  RotateCcw, ShieldCheck, Zap, TrendingUp, Filter, Eye, EyeOff
} from 'lucide-react';
import { SOCIAL_FEED_POSTS } from '../data/aiScenariosData';
import { SocialFeedPost } from '../types';

interface FeedSimulatorLabProps {
  onAddXP?: (amount: number, reason: string) => void;
}

export const FeedSimulatorLab: React.FC<FeedSimulatorLabProps> = ({ onAddXP }) => {
  const [interactions, setInteractions] = useState<{
    likedIds: string[];
    sharedIds: string[];
    ignoredIds: string[];
  }>({
    likedIds: [],
    sharedIds: [],
    ignoredIds: []
  });

  const [sensationalWeight, setSensationalWeight] = useState<number>(50);
  const [scientificWeight, setScientificWeight] = useState<number>(50);
  const [hasReceivedXP, setHasReceivedXP] = useState<boolean>(false);

  const handleLike = (post: SocialFeedPost) => {
    setInteractions((prev) => ({
      ...prev,
      likedIds: prev.likedIds.includes(post.id) 
        ? prev.likedIds.filter((id) => id !== post.id)
        : [...prev.likedIds, post.id]
    }));

    if (post.category === 'sensational' || post.category === 'extreme_debate') {
      setSensationalWeight((prev) => Math.min(100, prev + 15));
      setScientificWeight((prev) => Math.max(10, prev - 10));
    } else if (post.category === 'scientific') {
      setScientificWeight((prev) => Math.min(100, prev + 20));
      setSensationalWeight((prev) => Math.max(10, prev - 10));
    }

    checkReward();
  };

  const handleShare = (post: SocialFeedPost) => {
    setInteractions((prev) => ({
      ...prev,
      sharedIds: prev.sharedIds.includes(post.id)
        ? prev.sharedIds.filter((id) => id !== post.id)
        : [...prev.sharedIds, post.id]
    }));

    if (post.category === 'sensational' || post.category === 'extreme_debate') {
      setSensationalWeight((prev) => Math.min(100, prev + 25));
    }

    checkReward();
  };

  const handleIgnore = (post: SocialFeedPost) => {
    setInteractions((prev) => ({
      ...prev,
      ignoredIds: [...prev.ignoredIds, post.id]
    }));
    checkReward();
  };

  const checkReward = () => {
    if (!hasReceivedXP) {
      setHasReceivedXP(true);
      onAddXP?.(30, 'Simulación interactiva del algoritmo de redes completada');
    }
  };

  const handleReset = () => {
    setInteractions({ likedIds: [], sharedIds: [], ignoredIds: [] });
    setSensationalWeight(50);
    setScientificWeight(50);
  };

  return (
    <div className="w-full space-y-5 animate-fadeIn">
      
      {/* Cabecera del Laboratorio */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-950 border border-indigo-500/30 shadow-2xl backdrop-blur-xl space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white">
                Simulador del Algoritmo de Feed
              </h2>
              <p className="text-xs text-indigo-200/80">
                Descubre cómo cada interacción tuya (Like, Share o Tiempo) reclasifica tu perfil y estrecha lo que ves.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar Algoritmo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Columna Izquierda: El Feed Simulado (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1 font-mono">
            <span>PUBLICACIONES EN TU PANTALLA</span>
            <span>TÚ DECIDES CÓMO INTERACTUAR</span>
          </div>

          {SOCIAL_FEED_POSTS.map((post) => {
            const isLiked = interactions.likedIds.includes(post.id);
            const isShared = interactions.sharedIds.includes(post.id);
            const isIgnored = interactions.ignoredIds.includes(post.id);

            if (isIgnored) return null;

            return (
              <div 
                key={post.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 space-y-3.5 shadow-xl ${
                  post.category === 'sensational' || post.category === 'extreme_debate'
                    ? 'bg-slate-950/90 border-rose-500/30 hover:border-rose-500/60'
                    : 'bg-slate-950/90 border-indigo-500/30 hover:border-indigo-500/60'
                }`}
              >
                {/* Cabecera del Post */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-extrabold text-xs sm:text-sm text-white">
                          {post.authorName}
                        </strong>
                        {post.verified && (
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-slate-950 flex items-center justify-center text-[9px] font-black">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {post.authorHandle} · {post.timeAgo}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    post.category === 'sensational' || post.category === 'extreme_debate'
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {post.category === 'sensational' ? 'ALTO IMPACTO EMOCIONAL' : post.category === 'scientific' ? 'CIENCIA & DATOS' : post.category === 'gaming' ? 'CEBO DE CLICS' : 'DEBATE POLARIZANTE'}
                  </span>
                </div>

                {/* Contenido del Post */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {post.content}
                </p>

                {/* Impacto Algorítmico Explicativo */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Efecto en la red:</strong> {post.algorithmImpact}</span>
                </div>

                {/* Botones de Interacción */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={() => handleLike(post)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isLiked 
                        ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{post.stats.likes + (isLiked ? 1 : 0)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(post)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isShared 
                        ? 'bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/40' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{post.stats.shares + (isShared ? 1 : 0)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleIgnore(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                    title="Ocultar e ignorar del feed"
                  >
                    <EyeOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Ignorar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Columna Derecha: Telemetría y Cámara de Eco en Vivo (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4 sticky top-16">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm text-white">
                Telemetría del Motor de Recomendación
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Observa cómo cambia la probabilidad de que el algoritmo te recomiende noticias sensacionalistas vs rigurosas según tus clics.
            </p>

            {/* Barras Comparativas de Afinidades */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-mono font-bold mb-1">
                  <span className="text-rose-400">Contenido Emocional / Rabia</span>
                  <span className="text-rose-400">{sensationalWeight}% Exposición</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${sensationalWeight}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono font-bold mb-1">
                  <span className="text-indigo-400">Contenido Científico / Fuentes</span>
                  <span className="text-indigo-400">{scientificWeight}% Exposición</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${scientificWeight}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Diagnóstico Pedagógico Dinámico */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
              <strong className="text-amber-300 font-bold block">
                {sensationalWeight > 70 
                  ? '⚠️ Advertencia: Has entrado en una Cámara de Eco' 
                  : scientificWeight > 70 
                    ? '✨ Excelente: Tu feed prioriza el rigor y la ciencia' 
                    : '⚖️ Feed Equilibrado: Explora cómo reaccionan las barras'}
              </strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {sensationalWeight > 70
                  ? 'Al dar Like o compartir contenido de indignación, el algoritmo interpreta que te engancha y reducirá los temas serios en tu pantalla.'
                  : 'Interactuar con calma y buscar fuentes primarias entrena al sistema para mostrarte contenido de alto valor.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
