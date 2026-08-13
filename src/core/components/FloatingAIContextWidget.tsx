import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, X, Send, Eye, RefreshCw, Trash2, Volume2, VolumeX, Settings, Move, Maximize2, Minimize2, ChevronLeft } from 'lucide-react';
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

  const [currentSkinId, setCurrentSkinId] = useState<MascotSkinId>(() => {
    return (localStorage.getItem('goals_mascot_skin') as MascotSkinId) || 'astrobot';
  });
  const currentSkin = MASCOT_SKINS[currentSkinId] || MASCOT_SKINS.astrobot;

  const [isOpen, setIsOpen] = useState(false);
  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animState, setAnimState] = useState<MascotAnimState>('idle');

  const [mascotScale, setMascotScale] = useState(() => {
    return parseFloat(localStorage.getItem('goals_mascot_scale') || '1.2');
  });

  const [position, setPosition] = useState<{ x?: number; y?: number }>({});
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number; startLeft: number; startTop: number }>({ x: 0, y: 0, startLeft: 0, startTop: 0 });

  const { speak, stop, isSpeaking, isMuted, toggleMute } = useMascotTTS(currentSkin);

  const chatEndRef = useRef<HTMLDivElement>(null);

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

  const handleSelectSkin = async (skinId: MascotSkinId) => {
    setCurrentSkinId(skinId);
    localStorage.setItem('goals_mascot_skin', skinId);
    setIsSkinModalOpen(false);

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

  const captureScreenContext = (): string => {
    const sectionName = activeExperience
      ? `Mini App ${activeExperience.toUpperCase()}`
      : 'Dashboard Principal GOALS';
    
    let pageText = '';
    const mainEl = document.querySelector('main');
    if (mainEl) {
      pageText = mainEl.innerText.slice(0, 1500);
    } else {
      pageText = document.body.innerText.slice(0, 1500);
    }

    try {
      const astroIframe = document.querySelector('iframe') as HTMLIFrameElement | null;
      if (astroIframe && astroIframe.contentDocument) {
        const iframeBodyText = astroIframe.contentDocument.body?.innerText || '';
        if (iframeBodyText.trim()) {
          pageText += `\n\n--- CONTENIDO INTERNO EN PANTALLA 3D (ASTROLINGO IFRAME) ---\n${iframeBodyText.slice(0, 1500)}`;
        }
      }
    } catch (e) {}

    return `Sección actual: ${sectionName}\nTexto visible en pantalla:\n${pageText}`;
  };

  const saveToChatDiary = async (userPrompt: string, aiReply: string, screenContext: string) => {
    const diaryEntry = {
      timestamp: Date.now(),
      dateStr: new Date().toISOString(),
      activeExperience: activeExperience || 'goals_home',
      skinId: currentSkinId,
      userPrompt,
      aiReply,
      screenContextSnippet: screenContext.slice(0, 300)
    };

    try {
      const localHistory = JSON.parse(localStorage.getItem('goals_chat_diary') || '[]');
      localHistory.push(diaryEntry);
      if (localHistory.length > 50) localHistory.shift();
      localStorage.setItem('goals_chat_diary', JSON.stringify(localHistory));
    } catch (e) {}

    if (db && user?.uid && !user.isAnonymous) {
      try {
        await addDoc(collection(db, 'users', user.uid, 'chat_diary'), diaryEntry);
      } catch (err) {
        console.warn('Error guardando diario de chat en Firestore:', err);
      }
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const query = customMessage || inputText;
    if (!query.trim() || isLoading) return;

    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }

    const contextInfo = captureScreenContext();
    const fullPrompt = `${query}\n\n[CONTEXTO VISIBLE EN PANTALLA DEL ESTUDIANTE]:\n${contextInfo}`;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    if (!customMessage) setInputText('');
    setIsLoading(true);

    try {
      const responseText = await askAI({
        messages: [{ role: 'system', content: `Eres ${currentSkin.name}, asistente de GOALS.` }, ...newMessages],
        temperature: 0.6
      });
      setMessages([...newMessages, { role: 'assistant', content: responseText }]);
      speak(responseText);
      saveToChatDiary(query, responseText, contextInfo);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `⚠️ Error: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainScreen = () => {
    handleSendMessage('🔍 Explícame qué hay en esta pantalla.');
  };

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
        <div
          onClick={onToggleMinimize}
          className="fixed bottom-6 right-0 z-50 flex items-center gap-1 py-2 px-1.5 rounded-l-xl bg-slate-950/90 border-l border-t border-b border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.4)] backdrop-blur-md cursor-pointer hover:pl-2.5 transition-all duration-300 select-none animate-fadeIn group"
          title={`Restaurar ${currentSkin.name}`}
        >
          <ChevronLeft className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
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

  // Calcular la posición inteligente de la ventana de chat para que JAMÁS se salga de la pantalla
  const getSmartPopupPosition = () => {
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const popupW = Math.min(windowW - 24, 380);
    const popupH = Math.min(windowH - 100, 480);

    if (!dragRef.current) {
      return {
        left: Math.max(12, windowW - popupW - 24),
        top: Math.max(12, windowH - popupH - 95),
        width: popupW,
        height: popupH
      };
    }

    const rect = dragRef.current.getBoundingClientRect();
    const isRightHalf = rect.left + rect.width / 2 > windowW / 2;
    const isBottomHalf = rect.top + rect.height / 2 > windowH / 2;

    let left = isRightHalf
      ? rect.right - popupW
      : rect.left;

    let top = isBottomHalf
      ? rect.top - popupH - 12
      : rect.bottom + 12;

    // Clamping estricto dentro de la pantalla visible (Márgenes de 12px)
    left = Math.max(12, Math.min(left, windowW - popupW - 12));
    top = Math.max(12, Math.min(top, windowH - popupH - 12));

    return { left, top, width: popupW, height: popupH };
  };

  return (
    <>
      {/* Ventana de Chat Flotante con Clamping Estricto (Nunca se sale de la pantalla) */}
      {isOpen && (() => {
        const pop = getSmartPopupPosition();
        return (
          <div
            style={{
              position: 'fixed',
              left: `${pop.left}px`,
              top: `${pop.top}px`,
              width: `${pop.width}px`,
              height: `${pop.height}px`,
            }}
            className="z-50 rounded-3xl bg-slate-950/95 border border-indigo-500/40 shadow-[0_10px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans"
          >
            {/* Cabecera Minimalista de la Mascota */}
            <div className="p-3 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentSkin.avatarIcon}</span>
                <h3 className="font-extrabold text-xs text-white tracking-wide">{currentSkin.name}</h3>
              </div>

              {/* Botones de Control */}
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
                  title="Cambiar Skin"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => { setMessages([]); stop(); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all text-xs cursor-pointer"
                  title="Limpiar chat"
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

            {/* Slider de Resize */}
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
                <span>Analizar Pantalla</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('💡 ¿Qué consejos me das para esta sección?')}
                className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold shrink-0 transition-all active:scale-95 cursor-pointer"
              >
                💡 Consejos
              </button>
            </div>

            {/* Historial de Mensajes */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2 text-slate-500">
                  <Sparkles className="w-5 h-5 text-indigo-400/60 animate-pulse" />
                  <p className="text-xs font-medium text-slate-400">Pregunta lo que quieras sobre esta pantalla</p>
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
                  <span>Analizando pantalla...</span>
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
                placeholder="Preguntar..."
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
        );
      })()}

      {/* Contenedor Principal Flotante (Draggable Position de la Mascota) */}
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
        {/* Mascota Pet Animada (Draggable) */}
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
