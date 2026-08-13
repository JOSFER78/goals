import React from 'react';
import { MASCOT_SKINS } from '../../config/mascotSkins';
import { MascotSkinId } from '../../types/mascot';
import { Check, Sparkles, X, Volume2 } from 'lucide-react';

interface MascotSkinSelectorModalProps {
  currentSkinId: MascotSkinId;
  onSelectSkin: (skinId: MascotSkinId) => void;
  onClose: () => void;
}

export const MascotSkinSelectorModal: React.FC<MascotSkinSelectorModalProps> = ({
  currentSkinId,
  onSelectSkin,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-950 border border-indigo-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(99,102,241,0.3)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-white">Personalizar Mascota Copilot</h2>
              <p className="text-xs text-slate-400">Selecciona el compañero didáctico que te acompañará en GOALS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid de Skins Seleccionables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.values(MASCOT_SKINS).map((skin) => {
            const isSelected = currentSkinId === skin.id;
            return (
              <button
                key={skin.id}
                onClick={() => onSelectSkin(skin.id as MascotSkinId)}
                className={`group relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.4)] scale-[1.02]' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="flex items-center gap-3.5 mb-3">
                  <div 
                    className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{ 
                      backgroundColor: `${skin.primaryColor}15`, 
                      borderColor: `${skin.primaryColor}30`,
                      color: skin.primaryColor 
                    }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{skin.name}</h3>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border mt-1 ${skin.badgeBg}`}>
                      {skin.subtitle}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    Tono de voz: {skin.speechPitch}x
                  </span>
                  <span className="text-indigo-400 font-bold">
                    {isSelected ? 'Activo' : 'Seleccionar'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Cierre */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Guardar y Continuar
          </button>
        </div>

      </div>
    </div>
  );
};
