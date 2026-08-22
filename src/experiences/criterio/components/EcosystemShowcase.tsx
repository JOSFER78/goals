import React from 'react';
import { 
  Lock, Sparkles, ArrowRight, ShieldCheck, Star, 
  ExternalLink, Zap, Compass, CheckCircle2, ChevronRight,
  BookOpen, Orbit, Brain, Globe, Shield, Heart
} from 'lucide-react';
import { GOALS_EXPERIENCES, MiniAppConfig } from '../../../core/config/experiencesConfig';
import { ExperienceId } from '../../../core/types';
import { PREMIUM_EXPERIENCES } from '../../../core/types/gamification';

interface EcosystemShowcaseProps {
  onNavigateExperience?: (expId: ExperienceId) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  className?: string;
  isModal?: boolean;
  onCloseModal?: () => void;
}

interface PremiumAppFeature {
  id: ExperienceId;
  currencyName: string;
  currencyEmoji: string;
  currencyDesc: string;
  highlights: string[];
  recommendedAge: string;
}

const PREMIUM_APP_FEATURES: Record<string, PremiumAppFeature> = {
  school: {
    id: 'school',
    currencyName: 'Cristales de Forja',
    currencyEmoji: '🗝️',
    currencyDesc: 'Moneda maestra que activa la Llave Estelar y multiplica el progreso',
    highlights: [
      'Tutor socrático OCR para cuadernos y deberes',
      'Resolución guiada paso a paso sin dar la solución directa',
      'Generador adaptativo de ejercicios por tramo de edad'
    ],
    recommendedAge: '6–18 años'
  },
  astro: {
    id: 'astro',
    currencyName: 'Stardust',
    currencyEmoji: '✨',
    currencyDesc: 'Moneda estelar acumulada explorando planetas y órbitas reales',
    highlights: [
      'Simulador orbital 3D con datos de la NASA',
      'Mecánica celeste, gravedad y astrofísica interactiva',
      'Diagnósticos conceptuales y misiones estelares'
    ],
    recommendedAge: '8–18 años'
  },
  'ai-lab': {
    id: 'ai-lab',
    currencyName: 'Bytes',
    currencyEmoji: '💾',
    currencyDesc: 'Moneda de computación ganada entrenando redes y auditando algoritmos',
    highlights: [
      'Simulador visual de redes neuronales 2D',
      'Laboratorio de tokenización y modelos LLM',
      'Estudio creativo y auditoría de alucinaciones de IA'
    ],
    recommendedAge: '7–16 años'
  },
  languages: {
    id: 'languages',
    currencyName: 'Flow',
    currencyEmoji: '🌊',
    currencyDesc: 'Moneda de fluidez ganada practicando pronunciación y fonética de voz',
    highlights: [
      'Tutor particular por voz con retroalimentación en tiempo real',
      'Inmersión conversacional en múltiples idiomas',
      'Evaluación fonética de entonación y acento nativo'
    ],
    recommendedAge: '6–18 años'
  }
};

export const EcosystemShowcase: React.FC<EcosystemShowcaseProps> = ({
  onNavigateExperience,
  onOpenAuth,
  className = '',
  isModal = false,
  onCloseModal
}) => {
  const premiumApps: MiniAppConfig[] = (PREMIUM_EXPERIENCES as string[])
    .map((id) => GOALS_EXPERIENCES[id])
    .filter(Boolean);

  const handleCardClick = (expId: string) => {
    if (onNavigateExperience) {
      onNavigateExperience(expId as ExperienceId);
    } else if (onOpenAuth) {
      onOpenAuth('signup');
    }
  };

  return (
    <section 
      aria-label="Ecosistema GOALS Family"
      className={`w-full space-y-6 rounded-3xl bg-slate-950/90 border border-amber-500/25 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden font-display ${className}`}
    >
      {/* Resplandor de fondo ambiental */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mt-32" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mb-32" />

      {/* Cabecera Principal con Copy Ético de Upsell */}
      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </span>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                ECOSISTEMA GOALS FAMILY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                El Ecosistema Completo de Aprendizaje
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Criterio: 100% Gratis</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black font-mono flex items-center gap-1 shadow-sm">
              <Lock className="w-3.5 h-3.5" />
              <span>Pase PRO Familiar</span>
            </span>
          </div>
        </div>

        {/* Copy Ético y Honesto */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-inner">
          <p>
            <strong className="text-amber-300 font-bold">Criterio es gratis para siempre.</strong> Creemos firmemente que el pensamiento crítico, la alfabetización algorítmica y la capacidad de verificar fuentes deben estar al alcance de todas las familias y centros educativos sin barreras.
          </p>
          <p className="text-slate-400">
            Para acompañar el desarrollo integral del estudiante, el ecosistema <strong className="text-white">GOALS Family</strong> incluye 4 experiencias interactivas adicionales con tutores IA dedicados, simulación científica 3D, entrenamiento fonético de voz y cuadernos socráticos.
          </p>
        </div>

        {/* 3 Pilares Éticos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-white block font-bold">Sin Anuncios ni Rastreo</strong>
              <span className="text-slate-400">Espacio 100% seguro y ético para niños y jóvenes.</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Brain className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-white block font-bold">Tutor Socrático Dedicado</strong>
              <span className="text-slate-400">Guía el razonamiento sin dar las respuestas de memoria.</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-white block font-bold">Gamificación Armónica</strong>
              <span className="text-slate-400">Tus Synapses de Criterio se integran en el Rango Cósmico.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de las 4 Experiencias Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
        {premiumApps.map((app) => {
          const IconComponent = app.icon;
          const feature = PREMIUM_APP_FEATURES[app.id as string] || {
            currencyName: 'Moneda',
            currencyEmoji: '💎',
            currencyDesc: 'Moneda de dominio',
            highlights: ['Aprendizaje interactivo con IA', 'Gamificación profunda', 'Retos diarios'],
            recommendedAge: '8–18 años'
          };

          return (
            <div
              key={app.id}
              className={`p-5 rounded-3xl bg-slate-900/80 border ${app.borderClass || 'border-slate-800'} hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group`}
            >
              {/* Badge PRO / Candado en la esquina superior */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center ${app.iconColorClass || 'text-amber-400'} shadow-md group-hover:scale-105 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-white">
                        {app.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>PRO</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1">
                      {app.tagline}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 shrink-0">
                  {feature.recommendedAge}
                </span>
              </div>

              {/* Puntos destacados del módulo */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  Lo que desarrollarás:
                </span>
                <ul className="space-y-1.5">
                  {feature.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Moneda de Dominio de la Experiencia */}
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{feature.currencyEmoji}</span>
                  <div>
                    <span className="font-bold text-white block leading-tight">{feature.currencyName}</span>
                    <span className="text-[10px] text-slate-400 leading-none">{feature.currencyDesc}</span>
                  </div>
                </div>
              </div>

              {/* Botón de Acción para Explorar / Desbloquear */}
              <button
                type="button"
                onClick={() => handleCardClick(app.id as string)}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer group-hover:border-amber-400"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Explorar {app.shortName} con GOALS Family</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Banner Informativo de GOALS Family */}
      <div className="relative z-10 p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-500/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-amber-400/30 text-amber-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-white">
              Un único pase para toda la familia
            </h4>
            <p className="text-xs text-slate-300">
              Desbloquea las 5 experiencias completas para hasta 4 perfiles con progreso unificado.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenAuth) onOpenAuth('signup');
            else if (onNavigateExperience) onNavigateExperience('school');
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Conocer Planes Family</span>
        </button>
      </div>
    </section>
  );
};

export default EcosystemShowcase;
