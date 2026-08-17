/**
 * GOALS 3D Cosmos - EntityDetailDrawer
 * Ficha Educativa Contextual Rica y Panel de Exploración Astrofísica
 */

import React, { useState } from 'react';
import { CelestialEntityInfo, Landmark } from '../../../core/3d/data/CelestialBodiesDatabase';
import { X, Rocket, Zap, Compass, Info, Layers, History, MapPin, Sparkles, ChevronRight } from 'lucide-react';

interface EntityDetailDrawerProps {
  entity: CelestialEntityInfo | null;
  onClose: () => void;
  onCinematicTravel: (key: string) => void;
  onInstantFocus: (key: string) => void;
  onSelectLandmark?: (landmark: Landmark) => void;
}

type TabKey = 'stats' | 'structure' | 'exploration' | 'landmarks' | 'facts';

export const EntityDetailDrawer: React.FC<EntityDetailDrawerProps> = ({
  entity,
  onClose,
  onCinematicTravel,
  onInstantFocus,
  onSelectLandmark
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('stats');

  if (!entity) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-950/95 backdrop-blur-2xl border-l border-cyan-500/30 shadow-2xl flex flex-col text-white animate-in slide-in-from-right duration-300 pointer-events-auto">
      {/* CABECERA DE LA FICHA */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            {entity.category.toUpperCase()}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95"
            title="Cerrar Ficha"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>{entity.name}</span>
          </h2>
          <p className="text-xs text-cyan-300 font-medium">{entity.tagline}</p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
          {entity.summary}
        </p>

        {/* BOTONES DE ACCIÓN DE CÁMARA */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onCinematicTravel(entity.key)}
            className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-cyan-400"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Viajar con Cámara</span>
          </button>
          <button
            onClick={() => onInstantFocus(entity.key)}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Enfoque Inmediato</span>
          </button>
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="flex items-center gap-1 px-4 pt-3 border-b border-white/10 overflow-x-auto scrollbar-none bg-slate-900/50">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === 'stats'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Datos Físicos</span>
        </button>

        <button
          onClick={() => setActiveTab('structure')}
          className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === 'structure'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Estructura</span>
        </button>

        <button
          onClick={() => setActiveTab('exploration')}
          className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === 'exploration'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Exploración</span>
        </button>

        {entity.landmarks && entity.landmarks.length > 0 && (
          <button
            onClick={() => setActiveTab('landmarks')}
            className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'landmarks'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Puntos Clave</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('facts')}
          className={`px-3 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === 'facts'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>¿Sabías qué?</span>
        </button>
      </div>

      {/* CONTENIDO DESPLAZABLE DE LA PESTAÑA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* PESTAÑA: DATOS FÍSICOS */}
        {activeTab === 'stats' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Parámetros Astrofísicos Verificados
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Diámetro / Dimensiones:</span>
                <strong className="text-sm text-white font-mono">{entity.stats.diameter}</strong>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Masa:</span>
                <strong className="text-sm text-cyan-300 font-mono">{entity.stats.mass}</strong>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Gravedad Superficial:</span>
                <strong className="text-sm text-emerald-400 font-mono">{entity.stats.gravity}</strong>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Temperatura Media:</span>
                <strong className="text-sm text-amber-300 font-mono">{entity.stats.avgTemp}</strong>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Periodo Orbital:</span>
                <strong className="text-sm text-indigo-300 font-mono">{entity.stats.orbitalPeriod}</strong>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Velocidad Orbital:</span>
                <strong className="text-sm text-rose-300 font-mono">{entity.stats.orbitalSpeed}</strong>
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-xs">
              <span className="text-[10px] text-slate-400 block font-mono">Distancia / Altitud Media:</span>
              <strong className="text-sm text-white font-bold">{entity.stats.distanceOrAltitude}</strong>
            </div>
          </div>
        )}

        {/* PESTAÑA: ESTRUCTURA */}
        {activeTab === 'structure' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Composición y Capas Internas
            </h3>
            <div className="space-y-2.5">
              {entity.structure.layers.map((layer, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-cyan-300">{layer.name}</h4>
                    <span className="text-[9px] font-mono text-slate-500">Capa {idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-300">{layer.desc}</p>
                  <p className="text-[11px] text-slate-400 font-mono pt-1 border-t border-white/5">
                    <strong>Composición:</strong> {layer.composition}
                  </p>
                </div>
              ))}
            </div>

            {entity.structure.atmosphere && (
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-cyan-500/30 space-y-1">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>🌬️</span>
                  <span>Composición Atmosférica</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">{entity.structure.atmosphere}</p>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: EXPLORACIÓN Y MISIONES */}
        {activeTab === 'exploration' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Hitos de la Exploración Espacial
            </h3>
            <div className="space-y-2.5">
              {entity.exploration.historicMissions.map((m, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1 relative pl-4">
                  <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-cyan-500 rounded-r" />
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{m.name}</h4>
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {m.year} • {m.agency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{m.highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA: PUNTOS DE INTERÉS (LANDMARKS) */}
        {activeTab === 'landmarks' && entity.landmarks && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Puntos de Interés Geográficos y Misiones
            </h3>
            <div className="space-y-2.5">
              {entity.landmarks.map((lm) => (
                <div
                  key={lm.id}
                  onClick={() => onSelectLandmark?.(lm)}
                  className="bg-slate-900/80 hover:bg-slate-800/90 p-3.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-cyan-300 group-hover:text-white transition-colors flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lm.name}</span>
                    </h4>
                    <span className="text-[9px] font-mono text-slate-400">
                      {lm.coords.lat}° N, {lm.coords.lon}° E
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{lm.description}</p>
                  <p className="text-[11px] text-amber-300 font-mono bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <strong>Importancia:</strong> {lm.significance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA: ¿SABÍAS QUÉ? */}
        {activeTab === 'facts' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Curiosidades y Hechos Asombrosos
            </h3>
            <div className="space-y-2.5">
              {entity.didYouKnow.map((fact, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="text-lg shrink-0">💡</span>
                  <p className="text-xs text-slate-200 leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
