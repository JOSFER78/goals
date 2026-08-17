/**
 * src/core/components/navigation/MiniAppsDrawer.tsx
 * Menú Desplegable Slide-Over / Popover de Exploración de MiniApps de GOALS.
 * Proporciona selección de módulos con visualización dinámica de variantes en cascada.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { GOALS_EXPERIENCES } from '../../config/experiencesConfig';
import { ExperienceId } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { 
  X, Sparkles, ChevronRight, Zap, Star, ShieldCheck, 
  Orbit, GraduationCap, Globe, Shield, Bot, Layers, Scan, Brain, Volume2, Trophy, Award
} from 'lucide-react';

interface MiniAppsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperience: (id: ExperienceId) => void;
  activeExperience: string | null;
}

const MINIAPP_VARIANTS_SUMMARY: Record<ExperienceId, { id: string; name: string; tag: string }[]> = {
  school: [
    { id: 'ocr', name: 'OCR Cuadernos', tag: 'Visión 99.4%' },
    { id: 'socratic', name: 'Tutor Socrático', tag: 'Pistas IA' },
    { id: 'conceptmap', name: 'Mapa Conceptual', tag: 'Grafo' },
    { id: 'exam', name: 'Simulador Examen', tag: 'Práctica' }
  ],
  languages: [
    { id: 'conversation', name: 'Conversación Voz', tag: 'Baja Latencia' },
    { id: 'phonetics', name: 'Evaluación Fonética', tag: 'Acústica' },
    { id: 'memory', name: 'Memoria de Sesión', tag: 'Adaptativa' },
    { id: 'scenarios', name: 'Escenarios Reales', tag: 'Inmersivo' }
  ],
  astro: [
    { id: 'missions', name: 'Misiones Espaciales', tag: 'Apolo / Artemis' },
    { id: 'celestial', name: 'Sistema Solar 3D', tag: 'Órbitas Físicas' },
    { id: 'motor3d', name: 'Archivo James Webb', tag: 'NASA Data' },
    { id: 'gamification', name: 'Retos Navegación', tag: 'Física 3D' }
  ],
  verify: [
    { id: 'sources', name: 'Fuentes & Hechos', tag: 'BOE & Oficial' },
    { id: 'biases', name: 'Sesgos & Falacias', tag: 'Lógica' },
    { id: 'pausa', name: 'Protocolo PAUSA', tag: 'Juicio Crítico' },
    { id: 'matiza', name: 'Multiperspectiva', tag: 'Prensa Neutral' }
  ],
  criterio: [
    { id: 'sources', name: 'Fuentes & Hechos', tag: 'BOE & Oficial' },
    { id: 'biases', name: 'Sesgos & Falacias', tag: 'Lógica' },
    { id: 'pausa', name: 'Protocolo PAUSA', tag: 'Juicio Crítico' },
    { id: 'matiza', name: 'Multiperspectiva', tag: 'Prensa Neutral' }
  ],
  'ai-lab': [
    { id: 'neural2d', name: 'Redes Neuronales 2D', tag: 'Deep Learning' },
    { id: 'tokens', name: 'Tokenización', tag: 'Vectores' },
    { id: 'convolution', name: 'Visión Convolucional', tag: 'Filtros' },
    { id: 'ethics', name: 'Alineamiento & Ética', tag: 'Seguridad' }
  ]
};

export const MiniAppsDrawer: React.FC<MiniAppsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectExperience,
  activeExperience
}) => {
  const { userData } = useProgress();
  const [expandedApp, setExpandedApp] = useState<ExperienceId | null>(
    (activeExperience as ExperienceId) || 'school'
  );

  if (!isOpen) return null;

  const MINI_APPS = (['school', 'languages', 'astro', 'verify', 'ai-lab'] as ExperienceId[])
    .map((id) => GOALS_EXPERIENCES[id])
    .filter(Boolean);

  const handleSelect = (id: ExperienceId) => {
    onSelectExperience(id);
    onClose();
  };

  const drawerContent = (
    <div className="fixed inset-0 z-[9999] flex justify-end font-display select-none animate-fadeIn">
      
      {/* Backdrop oscuro con desenfoque de cristal */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer" 
        onClick={onClose}
        aria-label="Cerrar panel"
      />

      {/* Panel Lateral Desplegable Minimalista */}
      <div className="relative z-10 w-full max-w-md h-full bg-[#0c101c]/98 border-l border-slate-800/80 shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
        
        {/* Cabecera Minimalista */}
        <div className="p-4 sm:p-5 border-b border-slate-800/70 flex items-center justify-between bg-slate-950/60 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-white tracking-tight">
                Módulos de Aprendizaje
              </h2>
              <p className="text-[11px] text-slate-400">
                5 experiencias interactivas adaptativas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar Menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de MiniApps con Despliegue en Cascada de Variantes */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5 scrollbar-thin">
          {MINI_APPS.map((app) => {
            const IconComp = app.icon;
            const isActive = activeExperience === app.id;
            const isExpanded = expandedApp === app.id;
            const variants = MINIAPP_VARIANTS_SUMMARY[app.id as ExperienceId] || [];
            const expProgress = userData?.experiences?.[app.id as ExperienceId];
            const xpEarned = expProgress?.xp || 0;

            return (
              <div
                key={app.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isActive 
                    ? 'bg-slate-900/80 border-indigo-500/60 shadow-lg shadow-indigo-950/20' 
                    : isExpanded
                      ? 'bg-slate-900/60 border-slate-700/80'
                      : 'bg-slate-900/30 hover:bg-slate-900/60 border-slate-800/60'
                }`}
              >
                {/* Cabecera del Módulo (Click para expandir o entrar) */}
                <div 
                  onClick={() => {
                    if (isExpanded) {
                      handleSelect(app.id as ExperienceId);
                    } else {
                      setExpandedApp(app.id as ExperienceId);
                    }
                  }}
                  className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800/80 ${app.iconColorClass} group-hover:scale-105 transition-transform shrink-0`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-slate-100 truncate">
                          {app.name}
                        </h3>
                        {isActive && (
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold uppercase">
                            Activo
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {app.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      {xpEarned > 0 ? `${xpEarned} XP` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(app.id as ExperienceId);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      Abrir
                    </button>
                  </div>
                </div>

                {/* Sub-variantes Desplegadas Abajo (Cascada Minimalista) */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-800/50 bg-slate-950/40 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-1.5">
                      {variants.map((v) => (
                        <div
                          key={v.id}
                          onClick={() => handleSelect(app.id as ExperienceId)}
                          className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/60 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between gap-1 group/var"
                        >
                          <span className="text-[11px] font-medium text-slate-300 group-hover/var:text-white truncate">
                            {v.name}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {v.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Informativo Minimalista */}
        <div className="p-3.5 border-t border-slate-800/70 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[10px] font-mono text-slate-400">5 MiniApps disponibles</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(drawerContent, document.body);
};

