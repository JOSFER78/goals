import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, ChevronDown, ChevronRight, BookOpen, Lightbulb, Award, ArrowRight, Image as ImageIcon, Maximize2, X } from 'lucide-react';
import { sanitizeTextForSpeech, getBestSpanishVoice } from '../services/aiService';

interface DidacticResponseRendererProps {
  content: string;
}

export const DidacticResponseRenderer: React.FC<DidacticResponseRendererProps> = ({ content }) => {
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({});
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; alt: string } | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenAccordions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = sanitizeTextForSpeech(text);
      if (!clean) return;
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'es-ES';
      const bestVoice = getBestSpanishVoice();
      if (bestVoice) utterance.voice = bestVoice;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const rawText = (content || '').trim();

  // 📸 Extracción de enlaces de imágenes (Markdown ![alt](url) o [title](url) o URLs directas)
  const extractedImages: { alt: string; url: string }[] = [];
  const imageRegex = /!?\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
  let match: RegExpExecArray | null;

  while ((match = imageRegex.exec(rawText)) !== null) {
    const alt = match[1] || 'Imagen explicativa';
    const url = match[2];
    if (url.match(/\.(jpeg|jpg|gif|png|svg|webp)/i) || url.includes('wikimedia.org') || url.includes('pollinations.ai') || url.includes('unsplash')) {
      extractedImages.push({ alt, url });
    }
  }

  // Texto limpio sin corchetes de enlaces markdown visuales
  const cleanDisplayText = rawText
    .replace(/!?\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi, '')
    .replace(/\*\*/g, '')
    .replace(/###?/g, '')
    .trim();

  return (
    <div className="space-y-3 font-sans text-xs text-slate-100 animate-fadeIn">
      {/* Texto conversacional directo y limpio */}
      {cleanDisplayText && (
        <div className="flex items-start justify-between gap-2.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/60">
          <span className="flex-1 whitespace-pre-wrap">{cleanDisplayText}</span>
          <button
            type="button"
            onClick={() => speakText(cleanDisplayText)}
            className="p-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 transition-all shrink-0 cursor-pointer border border-indigo-500/20"
            title="Escuchar locución"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* RENDERIZADO VISUAL DE INFOGRAFÍA E IMÁGENES GENERADAS */}
      {extractedImages.length > 0 && (
        <div className="grid grid-cols-1 gap-3 pt-1">
          {extractedImages.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveLightboxImg(img)}
              className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-indigo-500/40 hover:border-indigo-400/80 shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01]"
            >
              {/* Badge Superior de Infografía */}
              <div className="bg-slate-900/90 border-b border-indigo-500/20 px-3 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Infografía Explicativa Generada</span>
                </div>
                <span className="p-1 rounded-lg bg-indigo-500/30 text-indigo-300 text-[9px] font-bold flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  <span>Ampliar</span>
                </span>
              </div>

              {/* Imagen de la Infografía */}
              <img 
                src={img.url} 
                alt={img.alt} 
                className="w-full max-h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Pie de foto de la Infografía */}
              <div className="bg-slate-900/90 p-2 px-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300 truncate max-w-[85%]">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL PARA VER LA INFOGRAFÍA A PANTALLA COMPLETA */}
      {activeLightboxImg && (
        <div 
          onClick={() => setActiveLightboxImg(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn select-none"
        >
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-3 overflow-hidden shadow-2xl space-y-2">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Infografía: {activeLightboxImg.alt}</span>
              </span>
              <button
                onClick={() => setActiveLightboxImg(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img 
              src={activeLightboxImg.url} 
              alt={activeLightboxImg.alt} 
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-slate-800"
            />
          </div>
        </div>
      )}
      
    </div>
  );
};
