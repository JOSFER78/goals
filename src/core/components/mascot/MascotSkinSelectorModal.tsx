import React from 'react';
import { MASCOT_SKINS, resolveMascotVoice } from '../../config/mascotSkins';
import { MascotSkinId } from '../../types/mascot';
import { Check, Sparkles, X, Volume2 } from 'lucide-react';
import { MascotPet } from './MascotPet';

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
      <div className="w-full max-w-2xl bg-slate-950 border border-indigo-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(99,102,241,0.3)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-white">Compañeros Pixel Art Didácticos</h2>
              <p className="text-xs text-slate-400">Selecciona el avatar asistente que te acompañará y conversará contigo</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {Object.values(MASCOT_SKINS).map((skin) => {
            const isSelected = currentSkinId === skin.id;
            const voiceInfo = resolveMascotVoice(skin.id as MascotSkinId);
            return (
              <button
                key={skin.id}
                onClick={() => onSelectSkin(skin.id as MascotSkinId)}
                className={`group relative p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-b from-indigo-950/90 to-slate-900 border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.4)] scale-[1.02]' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-2">
                  <div 
                    className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 bg-slate-950 overflow-hidden"
                    style={{ borderColor: `${skin.primaryColor}50` }}
                  >
                    <MascotPet skinId={skin.id as MascotSkinId} animState="idle" scale={0.7} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white flex items-center gap-1">
                      <span>{skin.avatarIcon}</span>
                      <span>{skin.name}</span>
                    </h3>
                    <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-md border mt-0.5 ${skin.badgeBg}`}>
                      {skin.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight mb-2">
                  {skin.personality}
                </p>

                <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 gap-2">
                  <span className="flex items-center gap-1 text-slate-400 truncate max-w-[140px]" title={`Voz: ${voiceInfo.voiceLabel}`}>
                    <Volume2 className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate">{voiceInfo.voiceLabel}</span>
                  </span>
                  <span className="text-indigo-400 font-bold shrink-0">
                    {isSelected ? 'Activo' : 'Elegir'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Botón de Confirmación */}
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
