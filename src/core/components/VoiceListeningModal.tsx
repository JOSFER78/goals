import React, { useEffect, useState, useRef } from 'react';
import { Mic, CheckCircle2, X, Loader2, Sparkles } from 'lucide-react';
import { normalizeChildVoiceIntent } from '../services/aiService';

interface VoiceListeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (cleanText: string) => void;
}

export const VoiceListeningModal: React.FC<VoiceListeningModalProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcriptRaw, setTranscriptRaw] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [seconds, setSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setTranscriptRaw('');
      setInterimText('');
      setSeconds(0);
      setIsProcessing(false);
      return;
    }

    startRecording();
    return () => {
      stopRecording();
    };
  }, [isOpen]);

  const startRecording = () => {
    setIsRecording(true);
    setSeconds(0);
    setTranscriptRaw('');
    setInterimText('');
    setIsProcessing(false);

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;

        let accumulated = '';

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              accumulated += ' ' + event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }
          setTranscriptRaw(accumulated.trim());
          setInterimText(currentInterim.trim());
        };

        recognition.onerror = (err: any) => {
          console.warn("Error en captura de voz:", err);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("No se pudo iniciar SpeechRecognition:", err);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  const handleFinish = async () => {
    stopRecording();
    setIsProcessing(true);

    const fullRaw = (transcriptRaw + ' ' + interimText).trim();
    if (!fullRaw) {
      onClose();
      return;
    }

    try {
      const cleanIntent = await normalizeChildVoiceIntent(fullRaw);
      onTranscriptComplete(cleanIntent);
    } catch (e) {
      onTranscriptComplete(fullRaw);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    /* POPUP MÍNIMO FLOTANTE JUNTO AL MICRO / CHAT (SIN BACKDROP GIGANTE) */
    <div className="fixed z-50 bottom-16 right-4 sm:right-12 w-72 bg-slate-950/95 border-2 border-amber-500/60 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 text-left font-sans select-none space-y-3">
      
      {/* Cabecera Mínima con Botón X */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs">
          <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>¡Te estoy escuchando!</span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          title="Cerrar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mensaje de Advertencia Mínimo */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 text-[10px] text-amber-200 font-medium">
        ⚠️ <b>No toques nada</b> mientras hablas.
      </div>

      {/* Mini Ondas de Audio + Transcripción en Vivo */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 min-h-[46px] flex flex-col justify-center text-[11px]">
        {isProcessing ? (
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Traduciendo con IA...</span>
          </div>
        ) : transcriptRaw || interimText ? (
          <p className="text-slate-200 font-medium line-clamp-2 leading-tight">
            <span>{transcriptRaw}</span>
            <span className="text-amber-400 italic"> {interimText}</span>
          </p>
        ) : (
          <div className="flex items-center justify-between text-slate-500 italic text-[10px]">
            <span>Habla ahora...</span>
            <div className="flex items-center gap-1 h-3">
              {[30, 80, 50, 90, 40].map((h, idx) => (
                <div 
                  key={idx}
                  className="w-1 bg-amber-400 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${idx * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botón Mínimo Listo */}
      <button
        onClick={handleFinish}
        disabled={isProcessing}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>{isProcessing ? 'Procesando...' : '¡Listo! Terminé'}</span>
      </button>

    </div>
  );
};
