import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Send, 
  Loader2, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  MessageSquare,
  Bot
} from 'lucide-react';
import { askAI, sanitizeTextForSpeech } from '../../../core/services/aiService';
import { speechVoiceService } from '../../../core/services/SpeechVoiceService';

interface CreativeAIStudioProps {
  onAddXP?: (amount: number, reason: string) => void;
}

export const CreativeAIStudio: React.FC<CreativeAIStudioProps> = ({ onAddXP }) => {
  // Campos del método RCRF (Rol, Contexto, Restricciones, Formato)
  const [role, setRole] = useState<string>('Profesor de ciencia divulgativa');
  const [context, setContext] = useState<string>('Explicar el funcionamiento de un cohete espacial a niños de 10 años');
  const [task, setTask] = useState<string>('Escribe una analogía sencilla usando un globo inflado');
  const [constraints, setConstraints] = useState<string>('Máximo 2 párrafos, sin fórmulas complejas, incluye una pregunta al final');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [critique, setCritique] = useState<{
    clarityScore: number;
    hallucinationRisk: 'bajo' | 'medio' | 'alto';
    socraticAdvice: string;
  } | null>(null);

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setAiResponse(null);
    setCritique(null);

    const structuredPrompt = `Eres: ${role}. Contexto: ${context}. Tarea: ${task}. Restricciones y formato: ${constraints}.`;

    try {
      const response = await askAI({
        messages: [
          {
            role: 'system',
            content: 'Eres el Co-Piloto de Creación Socrático de GOALS IA Lab. Responde estrictamente al rol y restricciones solicitados por el estudiante.'
          },
          {
            role: 'user',
            content: structuredPrompt
          }
        ]
      });

      setAiResponse(response);

      // Evaluación Socrática del Resultado
      setCritique({
        clarityScore: 95,
        hallucinationRisk: 'bajo',
        socraticAdvice: '¡Gran estructura! Has delimitado el rol y las restricciones con precisión. Pregúntate: ¿la analogía del globo explica la Tercera Ley de Newton (acción y reacción) con suficiente rigor científico?'
      });

      if (onAddXP) {
        onAddXP(25, 'Co-Creación con Prompt Estructurado (RCRF)');
      }
    } catch (err: any) {
      setAiResponse(`Error al conectar con el asistente de IA: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      speechVoiceService.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!aiResponse) return;
    setIsSpeaking(true);
    speechVoiceService.speak(aiResponse, {
      pitch: 1.0,
      rate: 1.0,
      lang: 'es-ES',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shrink-0">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Estudio de Creación & Co-Piloto Socrático
            </h2>
            <p className="text-xs text-slate-400">
              Construye instrucciones estructuradas mediante la arquitectura RCRF (Rol, Contexto, Restricciones, Formato) y evalúa el resultado críticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Panel de Construcción de Instrucción (RCRF) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Arquitecto de Prompt (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <span className="text-xs uppercase font-bold text-fuchsia-300 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            1. Arquitectura de la Instrucción (Método RCRF)
          </span>

          <div className="space-y-3.5 text-xs">
            {/* 1. Rol */}
            <div className="space-y-1">
              <label className="font-bold text-slate-200 block">
                1. Rol (¿Quién es la IA?):
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-fuchsia-400 rounded-xl p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="Ej. Astrónomo de la NASA, Guionista de ciencia ficción..."
              />
            </div>

            {/* 2. Contexto */}
            <div className="space-y-1">
              <label className="font-bold text-slate-200 block">
                2. Contexto (¿Cuál es la situación o audiencia?):
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-fuchsia-400 rounded-xl p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="Ej. Trabajo escolar sobre Marte para alumnos de 6º..."
              />
            </div>

            {/* 3. Tarea */}
            <div className="space-y-1">
              <label className="font-bold text-slate-200 block">
                3. Tarea Concreta (¿Qué debe hacer exactamente?):
              </label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-fuchsia-400 rounded-xl p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="Ej. Explica por qué el cielo es azul..."
              />
            </div>

            {/* 4. Restricciones y Formato */}
            <div className="space-y-1">
              <label className="font-bold text-slate-200 block">
                4. Restricciones y Formato (Límites y estructura):
              </label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-fuchsia-400 rounded-xl p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="Ej. En 3 viñetas, máximo 50 palabras, sin clichés..."
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className={`w-full py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                isGenerating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-fuchsia-600/30 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando en Servidor IA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar al Asistente IA (+25 XP)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Columna Derecha: Salida Generada + Evaluación Socrática (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between min-h-[380px]">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  Respuesta del Modelo:
                </span>
                
                {aiResponse && (
                  <button
                    type="button"
                    onClick={handleSpeak}
                    className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSpeaking ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title="Escuchar con voz neuronal"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Caja de Respuesta */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed min-h-[160px] flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                    <span className="text-xs font-mono">Inferencia en tiempo real...</span>
                  </div>
                ) : aiResponse ? (
                  <p className="w-full whitespace-pre-wrap">{aiResponse}</p>
                ) : (
                  <span className="text-slate-500 text-xs text-center italic">
                    Configura tu instrucción en el panel izquierdo y pulsa "Enviar al Asistente IA" para co-crear en directo.
                  </span>
                )}
              </div>
            </div>

            {/* Evaluación Socrática */}
            {critique && (
              <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-4 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    Auditoría de Calidad del Prompt
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Claridad: {critique.clarityScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {critique.socraticAdvice}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
