import React, { useState } from 'react';
import { X, Settings, UserCheck, Volume2, Sparkles, Check } from 'lucide-react';
import { StudentLanguageProfile } from '../types';
import { MemoryService } from '../services/memoryService';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentLanguageProfile;
  onProfileUpdated: (updated: StudentLanguageProfile) => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated
}) => {
  const [correctionPref, setCorrectionPref] = useState<'inmediata' | 'contextual' | 'diferida'>(
    profile.correctionPreference || 'contextual'
  );
  const [learningStyle, setLearningStyle] = useState<'visual' | 'auditivo' | 'practico' | 'conversacional'>(
    profile.learningStyle || 'visual'
  );
  const [dailyMinutes, setDailyMinutes] = useState<number>(profile.dailyGoalMinutes || 15);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = MemoryService.updateProfile({
      correctionPreference: correctionPref,
      learningStyle,
      dailyGoalMinutes: dailyMinutes
    });
    onProfileUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
            <Settings className="w-5 h-5" />
            <span>Configuración del Profesor & Preferencias</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          
          {/* Modo de Corrección Pedagógica */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Estilo de Corrección del Profesor
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'inmediata', label: 'Inmediata', desc: 'Corrige cada fallo en el acto.' },
                { id: 'contextual', label: 'Contextual', desc: 'Corrige de forma sutil sin cortar.' },
                { id: 'diferida', label: 'Al Final', desc: 'Resume los fallos al terminar.' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setCorrectionPref(m.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    correctionPref === m.id
                      ? 'border-cyan-400 bg-cyan-950/60 shadow-md ring-1 ring-cyan-500'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs text-white block">{m.label}</span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Estilo de Aprendizaje Predominante */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Estilo de Aprendizaje
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'visual', label: '👁️ Visual & Infografías' },
                { id: 'conversacional', label: '🗣️ Conversacional / Voz' },
                { id: 'auditivo', label: '🎧 Auditivo & Listening' },
                { id: 'practico', label: '⚡ Práctico & Retos' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setLearningStyle(st.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                    learningStyle === st.id
                      ? 'border-cyan-400 bg-slate-950 text-cyan-300 ring-1 ring-cyan-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meta de Estudio Diario */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-300 uppercase tracking-wider">Meta Diaria de Práctica</label>
              <span className="font-mono text-cyan-300 font-bold">{dailyMinutes} minutos / día</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Ajustes</span>
          </button>
        </div>

      </div>
    </div>
  );
};
