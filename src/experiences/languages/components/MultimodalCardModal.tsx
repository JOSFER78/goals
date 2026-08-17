import React from 'react';
import { X, Image as ImageIcon, Sparkles, Download, ExternalLink } from 'lucide-react';

interface MultimodalCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  concept: string;
  explanation: string;
  imageUrl?: string;
}

export const MultimodalCardModal: React.FC<MultimodalCardModalProps> = ({
  isOpen,
  onClose,
  title,
  concept,
  explanation,
  imageUrl
}) => {
  if (!isOpen) return null;

  const finalImageUrl = imageUrl || `https://image.pollinations.ai/prompt/detailed_educational_infographic_diagram_about_${encodeURIComponent(concept)}_clean_vector_graphic_educational_labels_hd?width=800&height=500&nologo=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
            <Sparkles className="w-5 h-5" />
            <span>Artefacto Didáctico Multimodal</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Imagen / Infografía */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center relative min-h-[220px]">
          <img
            src={finalImageUrl}
            alt={title}
            className="w-full h-auto object-cover max-h-[320px]"
            loading="lazy"
          />
        </div>

        {/* Información & Explicación */}
        <div className="space-y-1.5">
          <h4 className="text-lg font-bold text-white">{title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{explanation}</p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
