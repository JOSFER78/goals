import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, X, Send, Eye, RefreshCw, Trash2, Volume2, VolumeX, Settings, Move, Maximize2, Minimize2 } from 'lucide-react';
import { askAI, ChatMessage } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { db, collection, addDoc, doc, setDoc } from '../config/firebase';

import { MascotSkinId, MascotAnimState } from '../types/mascot';
import { MASCOT_SKINS } from '../config/mascotSkins';
import { MascotPet } from './mascot/MascotPet';
import { MascotSkinSelectorModal } from './mascot/MascotSkinSelectorModal';
import { useMascotTTS } from '../hooks/useMascotTTS';

interface FloatingAIContextWidgetProps {
  activeExperience: string | null;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const FloatingAIContextWidget: React.FC<FloatingAIContextWidgetProps> = ({
  activeExperience,
  onOpenAuth,
  isMinimized = false,
  onToggleMinimize
}) => {
  const { user, isCloud } = useAuth();
  const isAuthenticated = isCloud && user && !user.isAnonymous;

  // Estado de la Skin de la Mascota
  const [currentSkinId, setCurrentSkinId] = useState<MascotSkinId>(() => {
    return (localStorage.getItem('goals_mascot_skin') as MascotSkinId) || 'astrobot';
  });
  const currentSkin = MASCOT_SKINS[currentSkinId] || MASCOT_SKINS.astrobot;

  // Modales y Visibilidad
  const [isOpen, setIsOpen] = useState(false);
  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);

  // Mensajes y Conversación
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animState, setAnimState] = useState<MascotAnimState>('idle');

  // Tamaño de la mascota (Resize dinámico)
  const [mascotScale, setMascotScale] = useState(() => {
    return parseFloat(localStorage.getItem('goals_mascot_scale') || '1.2');
  });

  // Arrastre Libre (Draggable)
  const [position, setPosition] = useState<{ x?: number; y?: number }>({});
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number; startLeft: number; startTop: number }>({ x: 0, y: 0, startLeft: 0, startTop: 0 });

  // Hook de Sintetizador de Voz TTS
  const { speak, stop, isSpeaking, isMuted, toggleMute } = useMascotTTS(currentSkin);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sincronizar estado de animación con lectura de voz e IA
  useEffect(() => {
    if (isLoading) {
      setAnimState('thinking');
    } else if (isSpeaking) {
      setAnimState('speaking');
    } else if (isDragging) {
      setAnimState('dragging');
    } else {
      setAnimState('idle');
    }
  }, [isLoading, isSpeaking, isDragging]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Recalcular límites de pantalla al redimensionar la ventana para que la mascota nunca se salga
  useEffect(() => {
    const handleResize = () => {
      setPosition((prevPos) => {
        if (prevPos.x === undefined || prevPos.y === undefined) return prevPos;
        const mascotW = dragRef.current ? dragRef.current.offsetWidth : 80;
        const mascotH = dragRef.current ? dragRef.current.offsetHeight : 80;
        const maxX = Math.max(12, window.innerWidth - mascotW - 12);
        const maxY = Math.max(12, window.innerHeight - mascotH - 12);
        return {
          x: Math.max(12, Math.min(prevPos.x, maxX)),
          y: Math.max(12, Math.min(prevPos.y, maxY))
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cambiar Skin de la Mascota y guardar en Firestore
  const handleSelectSkin = async (skinId: MascotSkinId) => {
    setCurrentSkinId(skinId);
    localStorage.setItem('goals_mascot_skin', skinId);
    setIsSkinModalOpen(false);

    // Guardar en Firestore ai_profile si está autenticado
    if (db && user?.uid && !user.isAnonymous) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'ai_profile', 'pet_config'), {
          skinId,
          scale: mascotScale,
          updatedAt: Date.now()
        }, { merge: true });
      } catch (e) {
        console.warn('Error guardando pet_config en Firestore:', e);
      }
    }
  };

  // Actualizar tamaño de la mascota y persistir
  const handleScaleChange = (newScale: number) => {
    setMascotScale(newScale);
    localStorage.setItem('goals_mascot_scale', String(newScale));
    if (db && user?.uid && !user.isAnonymous) {
      setDoc(doc(db, 'users', user.uid, 'ai_profile', 'pet_config'), {
        scale: newScale,
        updatedAt: Date.now()
      }, { merge: true }).catch(() => {});
    }
  };

  // Captura profunda del texto y telemetría visible en pantalla (incluyendo iframes 3D)
  const captureScreenContext = (): string => {
    const sectionName = activeExperience
      ? activeExperience.toUpperCase()
      : 'PRESENTACIÓN PRINCIPAL GOALS';
    
    const mainEl = document.querySelector('main');
    let pageText = '';
    if (mainEl) {
      pageText = mainEl.innerText.replace(/\s+/g, ' ').slice(0, 1000);
    }

    let iframeText = '';
    try {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement | null;
      if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
        iframeText = iframe.contentDocument.body.innerText.replace(/\s+/g, ' ').slice(0, 1500);
      }
    } catch (e) {}

    return `📍 SECCIÓN ACTIVA EN PANTALLA: ${sectionName}
📄 TEXTO VISIBLE EN PANTALLA PRINCIPAL:
"${pageText}"
${iframeText ? `\n🪐 CONTENIDO Y TELEMETRÍA DENTRO DEL SIMULADOR 3D / IFRAME:\n"${iframeText}"` : ''}`;
  };

  // Persistencia de diario de conversaciones en Firestore (users/{uid}/chat_diary)
  const saveToChatDiary = async (query: string, response: string, context: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const diaryEntry = {
      date: todayStr,
      timestamp: Date.now(),
      activeExperience: activeExperience || 'home',
      userQuery: query,
      aiResponse: response,
      screenContext: context.slice(0, 500),
      userId: user?.uid || 'anonymous'
    };

    try {
      const existingDiary = JSON.parse(localStorage.getItem('goals_chat_diary') || '[]');
      existingDiary.unshift(diaryEntry);
      localStorage.setItem('goals_chat_diary', JSON.stringify(existingDiary.slice(0, 100)));
    } catch (e) {}

    if (db && user?.uid && !user.isAnonymous) {
      try {
        await addDoc(collection(db, 'users', user.uid, 'chat_diary'), diaryEntry);
      } catch (e) {
        console.warn('Error guardando diario en Firestore:', e);
      }
    }
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
      const contextInfo = captureScreenContext();
      
      const systemPrompt: ChatMessage = {
        role: 'system',
        content: `Eres ${currentSkin.name}, la Mascota IA Copilot Educativa de la plataforma GOALS.
Tu función es responder con precisión didáctica a lo que el usuario está viendo en su pantalla actual.

${contextInfo}

INSTRUCCIONES CLAVE DE RESPUESTA:
- Utiliza la información de la pantalla e iframe proporcionada arriba (telemetría 3D, lecciones, datos del visor, ejercicios).
- Responde de forma súper concisa, directa, amable y didáctica en formato Markdown.
- Si corresponde, incluye explicaciones sencillas y amigables.`
      };

      const responseText = await askAI({
        messages: [systemPrompt, ...newMessages],
        temperature: 0.6
      });

      setMessages([
        ...newMessages,
        { role: 'assistant', content: responseText }
      ]);

      // Leer la respuesta por voz si no está silenciada
      speak(responseText);

      // Guardar en Firestore chat_diary
      saveToChatDiary(query, responseText, contextInfo);

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

  // Manejo de Arrastre Libre (PointerEvents)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startLeft: rect.left,
      startTop: rect.top
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    if (!isDragging && Math.hypot(dx, dy) > 5) {
      setIsDragging(true);
    }

    if (isDragging) {
      let newLeft = pointerStartRef.current.startLeft + dx;
      let newTop = pointerStartRef.current.startTop + dy;

      const mascotW = dragRef.current ? dragRef.current.offsetWidth : (64 * mascotScale);
      const mascotH = dragRef.current ? dragRef.current.offsetHeight : (64 * mascotScale);

      const minX = 12;
      const maxX = Math.max(12, window.innerWidth - mascotW - 12);
      const minY = 12;
      const maxY = Math.max(12, window.innerHeight - mascotH - 12);

      newLeft = Math.max(minX, Math.min(newLeft, maxX));
      newTop = Math.max(minY, Math.min(newTop, maxY));

      setPosition({ x: newLeft, y: newTop });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
    setIsDragging(false);
  };

  if (isMinimized) {
    return (
      <>
        {/* Mascota Asomándose sutilmente en el borde de la pantalla (Peek Mode) */}
        <div
          onClick={onToggleMinimize}
          className="fixed bottom-4 right-0 z-50 flex items-center gap-1.5 p-1.5 pl-2.5 rounded-l-2xl bg-slate-950/90 border-l border-t border-b border-indigo-500/40 shadow-[0_0_25px_rgba(99,102,241,0.5)] backdrop-blur-md cursor-pointer group hover:translate-x-0 translate-x-2 transition-all duration-300 font-display select-none animate-fadeIn"
          title="Mascota Asomada — Haz clic para expandir"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="scale-75 origin-right">
            <MascotPet skinId={currentSkinId} animState="idle" scale={0.6} />
          </div>
          <span className="text-[10px] font-extrabold text-indigo-300 pr-1 group-hover:text-white transition-colors">
            {currentSkin.name}
          </span>
        </div>

        {isSkinModalOpen && (
          <MascotSkinSelectorModal
            currentSkinId={currentSkinId}
            onSelectSkin={handleSelectSkin}
            onClose={() => setIsSkinModalOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* Contenedor Principal Flotante (Draggable Position) */}
      <div 
        ref={dragRef}
        style={{
          position: 'fixed',
          left: position.x !== undefined ? `${position.x}px` : undefined,
          top: position.y !== undefined ? `${position.y}px` : undefined,
          bottom: position.y === undefined ? '24px' : undefined,
          right: position.x === undefined ? '24px' : undefined,
          touchAction: 'none'
        }}
        className="z-50 font-sans select-none flex flex-col items-end"
      >
        {/* Burbuja de Cómic Transparente (Speech Bubble) */}
        {isOpen && (
          <div className="mb-3 w-[340px] sm:w-[420px] h-[500px] max-h-[80vh] rounded-3xl bg-slate-950/95 border border-indigo-500/40 shadow-[0_10px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
            
            {/* Cabecera de la Mascota */}
            <div className="p-3.5 px-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-indigo-500/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-1 bg-slate-900/80 rounded-xl border border-indigo-500/30">
                  {currentSkin.avatarIcon}
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>{currentSkin.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30">
                      Tutor IA
                    </span>
                  </h3>
                  <p className="text-[10px] text-indigo-300 font-medium">Asistente Didáctico con Memoria</p>
                </div>
              </div>

              {/* Botones de Control de la Mascota */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`p-1.5 rounded-lg transition-all text-xs cursor-pointer ${
                    isMuted ? 'text-slate-500 hover:text-slate-300' : 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
                  }`}
                  title={isMuted ? "Activar Voz TTS" : "Desactivar Voz TTS"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSkinModalOpen(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs cursor-pointer"
                  title="Personalizar Mascota (Skins)"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => { setMessages([]); stop(); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all text-xs cursor-pointer"
                  title="Limpiar conversacion"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); stop(); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider de Resize de la Mascota */}
            <div className="px-4 py-1.5 bg-slate-900/60 border-b border-slate-800/50 flex items-center gap-2 shrink-0">
              <Minimize2 className="w-3 h-3 text-slate-500" />
              <input
                type="range"
                min={0.6}
                max={2.5}
                step={0.1}
                value={mascotScale}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="flex-1 h-1 accent-indigo-500 cursor-pointer"
                title={`Tamaño: ${mascotScale.toFixed(1)}x`}
              />
              <Maximize2 className="w-3 h-3 text-slate-500" />
              <span className="text-[9px] font-mono text-indigo-400 w-7 text-right">{mascotScale.toFixed(1)}x</span>
            </div>

            {/* Chips Rápidos */}
            <div className="p-2 px-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 text-[11px]">
              <button
                type="button"
                onClick={handleExplainScreen}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Analizar Pantalla Activa</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('💡 ¿Qué consejos me das para esta sección?')}
                className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold shrink-0 transition-all active:scale-95 cursor-pointer"
              >
                💡 Consejos Didácticos
              </button>
            </div>

            {/* Historial de Mensajes Didácticos */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2.5 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white">¡Hola! Soy {currentSkin.name}</h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Estoy leyendo el contexto de lo que ves en pantalla. Puedes preguntarme cualquier duda sobre esta página o pedirme explicaciones paso a paso.
                  </p>
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md font-sans'
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
                  <span>{currentSkin.name} está analizando la pantalla...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Entrada de Texto */}
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
                placeholder={`Pregunta a ${currentSkin.name}...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Mascota Pet Animada (Draggable) — Sin textos, solo el bicho */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="group relative cursor-grab active:cursor-grabbing"
        >
          {/* Botón X discreto al pasar el ratón para ocultar/asomar */}
          {onToggleMinimize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMinimize();
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-400 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all z-30 shadow-md cursor-pointer active:scale-90"
              title="Asomar mascota al borde de la pantalla (Minimizar)"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <MascotPet skinId={currentSkinId} animState={animState} scale={mascotScale} />
        </div>
      </div>

      {/* Modal de Selección de Skins de la Mascota */}
      {isSkinModalOpen && (
        <MascotSkinSelectorModal
          currentSkinId={currentSkinId}
          onSelectSkin={handleSelectSkin}
          onClose={() => setIsSkinModalOpen(false)}
        />
      )}
    </>
  );
};
