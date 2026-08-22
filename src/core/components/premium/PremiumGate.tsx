/**
 * src/core/components/premium/PremiumGate.tsx
 * Pantalla de Venta y Desbloqueo Premium GOALS.
 *
 * Características:
 * 1. Visualización de la miniapp bloqueada (icono + identidad GOALS_EXPERIENCES).
 * 2. Puerta Parental conforme a normativa COPPA: reto aritmético dinámico de 2 dígitos.
 * 3. Tarjetas de precios con los 3 planes GOALS_PLANS (destacando family_pro).
 * 4. Activación simulada mediante activatePlan(planId) de ProgressContext.
 * 5. Aviso honesto de transparencia: Demo de activación simulada sin pasarela real.
 */

import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { GOALS_EXPERIENCES } from '../../config/experiencesConfig';
import { GOALS_PLANS } from '../../services/EntitlementService';
import { ExperienceId } from '../../types';
import { GoalsPlanId } from '../../types/gamification';
import {
  Lock,
  Shield,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  Zap,
  Star,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Crown,
  CheckCircle2,
  Users,
  Award
} from 'lucide-react';

interface PremiumGateProps {
  experienceId: ExperienceId | string;
  onBack?: () => void;
  onBackToGoals?: () => void;
}

interface ArithmeticChallenge {
  num1: number;
  num2: number;
  operation: string;
  answer: number;
  prompt: string;
}

const generateArithmeticChallenge = (): ArithmeticChallenge => {
  const a = Math.floor(Math.random() * 8) + 6; // 6..13
  const b = Math.floor(Math.random() * 7) + 4; // 4..10
  return {
    num1: a,
    num2: b,
    operation: '×',
    answer: a * b,
    prompt: `${a} × ${b}`
  };
};

export const PremiumGate: React.FC<PremiumGateProps> = ({
  experienceId,
  onBack,
  onBackToGoals
}) => {
  const handleBack = onBack || onBackToGoals || (() => {});
  const { entitlements, activatePlan, showToast } = useProgress();

  const [challenge, setChallenge] = useState<ArithmeticChallenge>(generateArithmeticChallenge);
  const [parentInput, setParentInput] = useState<string>('');
  const [challengeError, setChallengeError] = useState<boolean>(false);
  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(false);
  const [selectedPlanToActivate, setSelectedPlanToActivate] = useState<GoalsPlanId | null>(null);

  const expConfig = GOALS_EXPERIENCES[experienceId] || {
    id: experienceId,
    name: 'Experiencia GOALS PRO',
    shortName: 'PRO',
    tagline: 'Módulo de Aprendizaje Avanzado',
    badge: 'Módulo PRO',
    icon: Lock,
    primaryHex: '#6366F1',
    secondaryHex: '#4F46E5',
    colorClass: 'indigo',
    borderClass: 'border-indigo-500/40',
    bgGradientClass: 'from-slate-900/60 via-slate-950 to-slate-950',
    btnBgClass: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold',
    badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    freeBannerClass: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    iconColorClass: 'text-indigo-400',
    progressPct: 100,
    bgPatternClass: 'cyber-grid-pattern',
    themeKeyword: 'CONTENIDO EXCLUSIVO',
    ambientGlow: 'rgba(99, 102, 241, 0.08)'
  };

  const IconComp = expConfig.icon;

  const handleVerifyParent = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(parentInput.trim(), 10);
    if (val === challenge.answer) {
      setIsParentUnlocked(true);
      setChallengeError(false);
      showToast('🛡️ Verificación parental correcta. Zona de suscripción desbloqueada.');
    } else {
      setChallengeError(true);
      setChallenge(generateArithmeticChallenge());
      setParentInput('');
    }
  };

  const handleRefreshChallenge = () => {
    setChallenge(generateArithmeticChallenge());
    setChallengeError(false);
    setParentInput('');
  };

  const handleActivate = (planId: GoalsPlanId) => {
    setSelectedPlanToActivate(planId);
    activatePlan(planId);
  };

  const currentPlan = entitlements?.plan || 'free';

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-display select-none">
      
      {/* Halo de luz ambiental */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${expConfig.ambientGlow || 'rgba(99,102,241,0.06)'} 0%, transparent 80%)`
        }}
      />

      <div className="relative z-10 w-full max-w-5xl bg-slate-950/95 border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-8 text-white backdrop-blur-2xl">
        
        {/* Cabecera con Botón Volver y MiniApp Bloqueada */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <button
            type="button"
            onClick={handleBack}
            className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a GOALS</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold uppercase">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Acceso PRO Requerido</span>
            </span>
            <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold uppercase ${expConfig.badgeClass}`}>
              {expConfig.badge || 'PRO'}
            </span>
          </div>
        </div>

        {/* Identidad de la MiniApp Bloqueada */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-slate-900 border border-indigo-500/40 flex items-center justify-center shadow-xl text-indigo-400">
            <IconComp className="w-10 h-10" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md border border-slate-950">
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <span>{expConfig.name}</span>
              <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                PRO
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {expConfig.tagline}
            </p>
          </div>
          
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 text-center max-w-lg mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Desbloquea tutorías ilimitadas, 3D completo y simulación interactiva con un Plan Familiar GOALS.</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PASO 1: PUERTA PARENTAL CONFORME COPPA (RETO ARITMÉTICO DINÁMICO)       */}
        {/* ========================================================================= */}
        {!isParentUnlocked ? (
          <div className="max-w-md mx-auto p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 shadow-2xl space-y-5 animate-fadeIn">
            
            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Control Parental COPPA
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Verificación de adulto requerida para consultar planes y precios.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Para proteger a los menores conforme a la legislación vigente (COPPA / AI Act), un padre, madre o tutor legal debe resolver este reto aritmético:
            </p>

            {/* Caja del Reto Dinámico */}
            <form onSubmit={handleVerifyParent} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                    Reto de Seguridad:
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-wider font-mono">
                    ¿Cuánto es {challenge.prompt}?
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshChallenge}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Generar otro reto"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {challengeError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Respuesta incorrecta. Inténtalo con el nuevo reto generado.</span>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  value={parentInput}
                  onChange={(e) => setParentInput(e.target.value)}
                  placeholder="Tu respuesta..."
                  autoFocus
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!parentInput.trim()}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 cursor-pointer shadow-lg shadow-amber-950/40"
                >
                  Desbloquear
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
              <span>🔒 Entorno seguro infantil</span>
              <span>COPPA & GDPR Compliant</span>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* PASO 2: ZONA DE COMPRA Y COMPARATIVA DE PLANES (GOALS_PLANS)             */
          /* ========================================================================= */
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Puerta Parental Superada
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Planes de Suscripción GOALS
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsParentUnlocked(false)}
                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                🔒 Volver a bloquear
              </button>
            </div>

            {/* Grid de 3 Tarjetas de Precios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {GOALS_PLANS.map((plan) => {
                const isFamilyPro = plan.id === 'family_pro';
                const isFamilyPass = plan.id === 'family_pass';
                const isCurrent = currentPlan === plan.id;

                let cardBorder = 'border-slate-800 bg-slate-900/60';
                let headerBadge = null;

                if (isFamilyPro) {
                  cardBorder = 'border-2 border-indigo-500/80 bg-gradient-to-b from-indigo-950/60 via-slate-900/90 to-slate-950 shadow-2xl shadow-indigo-950/50 md:-translate-y-2';
                  headerBadge = (
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      RECOMENDADO · MÁS POPULAR
                    </span>
                  );
                } else if (isFamilyPass) {
                  cardBorder = 'border border-cyan-500/40 bg-gradient-to-b from-cyan-950/30 via-slate-900/80 to-slate-950 shadow-lg';
                  headerBadge = (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase">
                      💎 MEJOR VALOR ANUAL
                    </span>
                  );
                }

                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl p-5 sm:p-6 border flex flex-col justify-between gap-5 transition-all relative ${cardBorder}`}
                  >
                    
                    {/* Header del Plan */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {headerBadge || <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Plan Básico</span>}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                            ACTUAL
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-white">{plan.name}</h3>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                            {plan.priceLabel.split(' / ')[0]}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            / {plan.priceLabel.split(' / ')[1] || 'siempre'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 min-h-[32px] leading-snug">
                          {plan.tagline}
                        </p>
                      </div>

                      {/* Lista de Características */}
                      <div className="border-t border-slate-800/80 pt-3 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                          Incluye:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-200">
                          {plan.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2 leading-relaxed">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Botón de Activación */}
                    <div className="pt-3 border-t border-slate-800/80">
                      {isCurrent ? (
                        <div className="w-full py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center text-xs font-bold text-slate-300">
                          ✓ Plan Actualmente Activo
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleActivate(plan.id)}
                          className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg ${
                            isFamilyPro
                              ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white shadow-indigo-950/60'
                              : isFamilyPass
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white shadow-cyan-950/60'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>{plan.id === 'free' ? 'Elegir Plan Free' : `Activar ${plan.name}`}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Aviso Honesto de Transparencia (AGENTS.md / Requisitos) */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Nota de Transparencia • Demo de Activación Simulada</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans pl-5.5">
                Demo: activación simulada sin pasarela de pago real. Al pulsar en activar, tu cuenta adquiere los permisos completos de forma inmediata en Firestore y LocalStorage para evaluación pedagógica.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
