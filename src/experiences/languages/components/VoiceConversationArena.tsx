import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, Volume2, Sparkles, CheckCircle2, AlertCircle, 
  BookOpen, Loader2, ArrowRight, RefreshCw, MessageSquare
} from 'lucide-react';
import { TeacherAgent, TeacherInteractionResult } from '../services/teacherAgent';
import { VoiceEngine } from '../services/voiceEngine';
import { StudentLanguageProfile } from '../types';

interface MessageItem {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  timestamp: string;
  pedagogicalResult?: TeacherInteractionResult;
}

interface VoiceConversationArenaProps {
  profile: StudentLanguageProfile;
  initialPrompt?: string;
  onAddXP: (amount: number, reason: string) => void;
}

export const VoiceConversationArena: React.FC<VoiceConversationArenaProps> = ({
  profile,
  initialPrompt,
  onAddXP
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm_init',
      sender: 'teacher',
      text: `Hello ${profile.name}! It's great to see you today. What would you like to talk about? We can chat about space, games, or your day!`,
      timestamp: 'Ahora'
    }
  ]);
  const [inputText, setInputText] = useState<string>(initialPrompt || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const studentMsg: MessageItem = {
      id: `msg_${Date.now()}`,
      sender: 'student',
      text: textToSend.trim(),
      timestamp: 'Ahora'
    };

    setMessages(prev => [...prev, studentMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'student' ? ('user' as const) : ('assistant' as const),
        content: m.text
      }));

      const result = await TeacherAgent.interact(textToSend, profile.targetLanguage, history);

      const teacherMsg: MessageItem = {
        id: `msg_${Date.now() + 1}`,
        sender: 'teacher',
        text: result.teacherReply,
        timestamp: 'Ahora',
        pedagogicalResult: result
      };

      setMessages(prev => [...prev, teacherMsg]);
      onAddXP(result.xpGranted || 20, 'Conversación Pedagógica con el Profesor');

      // Reproducir automáticamente la respuesta del profesor si está habilitado
      VoiceEngine.speakText(
        result.teacherReply,
        profile.targetLanguage,
        speechRate,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    } catch (err: any) {
      console.error('Error in conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      VoiceEngine.stopListening();
      setIsListening(false);
    } else {
      const started = VoiceEngine.startListening(
        profile.targetLanguage,
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            VoiceEngine.stopListening();
            setIsListening(false);
            handleSendMessage(transcript);
          }
        },
        () => setIsListening(false),
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
    }
  };

  const handleSpeak = (text: string) => {
    VoiceEngine.speakText(
      text,
      profile.targetLanguage,
      speechRate,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl backdrop-blur-xl flex flex-col h-[650px]">
      
      {/* Header del Chat */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              Sala de Conversación & Tutoría en Vivo
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-xs text-slate-400">
              Idioma: <strong className="text-cyan-300">{profile.targetLanguage}</strong> • Modo Corrección: <strong className="text-emerald-300">{profile.correctionPreference}</strong>
            </p>
          </div>
        </div>

        {/* Ajuste de velocidad de voz */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400">
          <span>Velocidad de Voz:</span>
          <select
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value="0.8">Lento (0.8x)</option>
            <option value="0.95">Normal (0.95x)</option>
            <option value="1.1">Rápido (1.1x)</option>
          </select>
        </div>
      </div>

      {/* Flujo de Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {messages.map((m) => {
          const isTeacher = m.sender === 'teacher';
          return (
            <div key={m.id} className={`flex flex-col ${isTeacher ? 'items-start' : 'items-end'} space-y-2`}>
              <div className="flex items-start gap-2.5 max-w-[88%] sm:max-w-[75%]">
                {isTeacher && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-sm shrink-0 mt-1">
                    👨‍🏫
                  </div>
                )}
                
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isTeacher
                      ? 'bg-slate-950/90 border border-cyan-500/30 text-slate-200 shadow-md'
                      : 'bg-cyan-600 text-white font-medium shadow-cyan-600/20 shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  
                  {isTeacher && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 gap-3 text-[11px] text-slate-400">
                      <button
                        onClick={() => handleSpeak(m.text)}
                        className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Escuchar</span>
                      </button>
                      <span className="font-mono text-[10px] text-slate-500">{m.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tarjeta de Corrección Pedagógica si la hubo */}
              {m.pedagogicalResult?.detectedError && (
                <div className="max-w-[85%] sm:max-w-[75%] ml-10 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Tip de Mejora: Decimos "{m.pedagogicalResult.detectedError.correction}" en lugar de "{m.pedagogicalResult.detectedError.incorrect}"</span>
                  </div>
                  <p className="text-[11px] text-amber-300/80">{m.pedagogicalResult.detectedError.explanation}</p>
                </div>
              )}

              {/* Píldoras de Vocabulario Nuevo */}
              {m.pedagogicalResult?.newVocabulary && m.pedagogicalResult.newVocabulary.length > 0 && (
                <div className="max-w-[85%] sm:max-w-[75%] ml-10 flex flex-wrap gap-1.5 pt-0.5">
                  {m.pedagogicalResult.newVocabulary.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-[10px] text-cyan-300 font-mono flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-cyan-400" />
                      <strong>{v.term}</strong>: {v.translation}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-cyan-300 animate-pulse ml-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>El profesor está pensando una respuesta pedagógica...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias Rápidas de Continuación */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <span className="text-slate-500 font-bold shrink-0">Sugerencias:</span>
        <button
          onClick={() => handleSendMessage("Can you explain how black holes are formed in simple English?")}
          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer"
        >
          🌌 Black holes
        </button>
        <button
          onClick={() => handleSendMessage("I want to practice ordering food at a restaurant.")}
          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer"
        >
          🍕 Order food
        </button>
        <button
          onClick={() => handleSendMessage("What did you do yesterday?")}
          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer"
        >
          ⏰ Past tense
        </button>
      </div>

      {/* Barra de Entrada (Texto y Micrófono) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-2 focus-within:border-cyan-500/50 transition-all shrink-0"
      >
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          className={`p-3 rounded-xl transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
              : 'bg-slate-900 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
          }`}
          title={isListening ? 'Detener dictado' : 'Hablar por micrófono'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Escribe o habla en ${profile.targetLanguage}...`}
          className="flex-1 bg-transparent border-none text-xs sm:text-sm text-cyan-100 placeholder-slate-500 focus:outline-none px-2"
        />

        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md disabled:opacity-40 cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
