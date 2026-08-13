import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, X, Send, Eye, RefreshCw, Trash2, ChevronDown, MessageSquare } from 'lucide-react';
import { askAI, ChatMessage } from '../services/aiService';
import { useAuth } from '../context/AuthContext';

interface FloatingAIContextWidgetProps {
  activeExperience: string | null;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const FloatingAIContextWidget: React.FC<FloatingAIContextWidgetProps> = ({
  activeExperience,
  onOpenAuth
}) => {
  const { user, isCloud } = useAuth();
  const isAuthenticated = isCloud && user && !user.isAnonymous;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [screenSummary, setScreenSummary] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Captura del texto visible en pantalla para enviar como contexto
  const captureScreenContext = (): string => {
    const sectionName = activeExperience
      ? activeExperience.toUpperCase()
      : 'PRESENTACIÓN PRINCIPAL GOALS';
    
    // Extraer texto relevante del contenedor principal
    const mainEl = document.querySelector('main');
    let pageText = '';
    if (mainEl) {
      // Limpiar texto para no saturar tokens
      pageText = mainEl.innerText
        .replace(/\s+/g, ' ')
        .slice(0, 1200);
    }

    return `📍 SECCIÓN ACTIVA EN PANTALLA: ${sectionName}\n📄 TEXTO VISIBLE EN PANTALLA:\n"${pageText}"`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: query }
    ];

    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Capturar contexto fresco de la pantalla
      const contextInfo = captureScreenContext();
      
      const systemPrompt: ChatMessage = {
        role: 'system',
        content: `Eres el Asistente Contextual Flotante de la plataforma educativa GOALS.
Tu función es responder a las preguntas del usuario considerando la información visible en su pantalla actual.

${contextInfo}

INSTRUCCIONES DE RESPUESTA:
- Responde de forma súper clara, amable, directa y concisa en Markdown.
- Si el usuario te pregunta por algo de su pantalla, usa la información del contexto capturado arriba.
- Sé breve y ve al grano para una conversación ágil.`
      };

      const responseText = await askAI({
        messages: [systemPrompt, ...newMessages],
        temperature: 0.6
      });

      setMessages([
        ...newMessages,
        { role: 'assistant', content: responseText }
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `⚠️ Error de respuesta: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainScreen = () => {
    handleSendMessage('🔍 Explícame qué hay en esta pantalla y qué puedo hacer aquí.');
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Ventana de Chat Flotante Desplegada */}
      {isOpen && (
        <div className="mb-3 w-[350px] sm:w-[420px] h-[520px] max-h-[80vh] rounded-3xl bg-slate-950/95 border border-indigo-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Cabecera del Widget */}
          <div className="p-3.5 px-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-indigo-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-extrabold text-xs text-white">Copilot Contextual IA</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-indigo-300 font-medium">
                  {activeExperience ? `Viendo: ${activeExperience.toUpperCase()}` : 'Viendo: Inicio GOALS'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all text-xs"
                title="Limpiar chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chips Rápidos de Contexto */}
          <div className="p-2 px-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 text-[11px]">
            <button
              onClick={handleExplainScreen}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>Analizar esta Pantalla</span>
            </button>
            <button
              onClick={() => handleSendMessage('💡 ¿Qué consejos me das para esta sección?')}
              className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold shrink-0 transition-all active:scale-95 cursor-pointer"
            >
              💡 Dar Consejos
            </button>
          </div>

          {/* Historial de Mensajes con Memoria */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2.5 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-bold text-xs text-slate-200">Asistente Continuo en Vivo</h4>
                <p className="text-[11px] text-slate-400 max-w-[260px]">
                  Leo automáticamente lo que ves en pantalla. Pregúntame cualquier duda de tus lecciones o ejercicios.
                </p>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 text-xs mt-1">
                      🤖
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md font-medium'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm space-y-1'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 p-2 bg-indigo-950/40 border border-indigo-500/20 rounded-xl w-fit animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analizando pantalla e IA pensando...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Formulario de Entrada de Texto */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pregunta algo sobre esta pantalla..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md active:scale-95 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante Fijo Redondo (Trigger) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 p-3.5 px-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
      >
        <div className="relative">
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
        </div>
        <span className="hidden sm:inline font-display tracking-wide text-xs font-black">
          Copilot IA Pantalla
        </span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      </button>
    </div>
  );
};
