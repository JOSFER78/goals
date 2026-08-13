import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Bot, X, Send, Eye, RefreshCw, Trash2, Volume2, VolumeX, 
  Settings, Move, Maximize2, Minimize2, ChevronLeft, ChevronUp, ChevronDown, 
  Mic, MicOff, AudioLines, Palette, Zap, RotateCcw, Check, Sparkle, Paperclip, Camera
} from 'lucide-react';
import { askAI, ChatMessage, buildChildSystemPrompt, getCustomMascotName } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { db, collection, addDoc, doc, setDoc } from '../config/firebase';

import { MascotSkinId, MascotAnimState } from '../types/mascot';
import { MASCOT_SKINS } from '../config/mascotSkins';
import { MascotPet } from './mascot/MascotPet';
import { MascotSkinSelectorModal } from './mascot/MascotSkinSelectorModal';
import { useMascotTTS } from '../hooks/useMascotTTS';
import { VoiceListeningModal } from './VoiceListeningModal';
import { DidacticResponseRenderer } from './DidacticResponseRenderer';

interface FloatingAIContextWidgetProps {
  activeExperience: string | null;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
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
  const [isExpanded, setIsExpanded] = useState(false); // Modo Píldora vs Extendido
  const [isVoiceActive, setIsVoiceActive] = useState(false); // Conversación Voz a Voz Live
  const [isDictating, setIsDictating] = useState(false); // Dictado por voz en input
  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animState, setAnimState] = useState<MascotAnimState>('idle');

  // Tamaño personalizable de la ventana extendida (Redimensionable desde la Esquina Superior Izquierda)
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => {
    const savedW = parseInt(localStorage.getItem('goals_chat_w') || '380', 10);
    const savedH = parseInt(localStorage.getItem('goals_chat_h') || '480', 10);
    return { width: savedW, height: savedH };
  });

  const [isResizingTL, setIsResizingTL] = useState(false);
  const resizeStartRef = useRef<{ x: number; y: number; startW: number; startH: number }>({ x: 0, y: 0, startW: 380, startH: 480 });

  // Menú contextual del botón derecho del ratón
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0 });

  const [mascotScale, setMascotScale] = useState(() => {
    return parseFloat(localStorage.getItem('goals_mascot_scale') || '1.2');
  });

  const [position, setPosition] = useState<{ x?: number; y?: number }>({});
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number; startLeft: number; startTop: number }>({ x: 0, y: 0, startLeft: 0, startTop: 0 });

  const { speak, speakFiller, stop, isSpeaking, isMuted, toggleMute } = useMascotTTS(currentSkin);
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

  // Listener global para cerrar el menú contextual con clic izquierdo
  useEffect(() => {
    const handleCloseMenu = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    };
    window.addEventListener('click', handleCloseMenu);
    return () => window.removeEventListener('click', handleCloseMenu);
  }, [contextMenu.visible]);

  // Listener para sincronizar cambios de la mascota
  useEffect(() => {
    const syncMascot = () => {
      const savedSkin = (localStorage.getItem('goals_mascot_skin') as MascotSkinId) || 'astrobot';
      const savedScale = parseFloat(localStorage.getItem('goals_mascot_scale') || '1.2');
      setCurrentSkinId(savedSkin);
      setMascotScale(savedScale);
    };

    window.addEventListener('goals_mascot_updated', syncMascot);
    window.addEventListener('storage', syncMascot);
    return () => {
      window.removeEventListener('goals_mascot_updated', syncMascot);
      window.removeEventListener('storage', syncMascot);
    };
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
      } catch (e) {}
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

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Dictado por voz para niños con modal de aviso e IA
  const handleStartDictation = () => {
    setIsVoiceModalOpen(true);
  };

  const captureScreenContext = (): string => {
    const sectionName = activeExperience
      ? `Mini App / Vista: ${activeExperience.toUpperCase()}`
      : 'Dashboard Principal de Inicio GOALS';
    
    let pageText = '';
    const mainEl = document.querySelector('main') || document.querySelector('#app') || document.body;
    if (mainEl) {
      const clone = mainEl.cloneNode(true) as HTMLElement;
      // Remover texto del propio widget de chat para no duplicar
      const chatWidget = clone.querySelector('[data-widget="ai-chat"]');
      if (chatWidget) chatWidget.remove();
      pageText = (clone.innerText || '').slice(0, 2000).replace(/\s+/g, ' ').trim();
    }

    let extra3DInfo = '';
    const iframeEl = document.querySelector('iframe') as HTMLIFrameElement;
    if (iframeEl && (iframeEl.src.includes('cosmos-3d') || iframeEl.src.includes('astrolingo'))) {
      extra3DInfo = '\n[ESTADO 3D COSMOS: El alumno tiene abierta la experiencia 3D de Mecánica Celeste, Eclipses u Órbitas Planetarias].';
    }

    return `VISTA ACTUAL: ${sectionName}${extra3DInfo}\nTEXTO VISIBLE EN LA PANTALLA DEL ALUMNO:\n${pageText || 'Página de inicio cargada.'}`;
  };

  const [attachedImage, setAttachedImage] = useState<{ file: File; previewUrl: string; base64: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      setAttachedImage({
        file,
        previewUrl,
        base64: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const query = customMessage || inputText;
    if ((!query.trim() && !attachedImage) || isLoading) return;

    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }

    const currentImg = attachedImage;
    setAttachedImage(null);

    const userContent = query.trim() || (currentImg ? 'Analiza esta foto de mi cuaderno escolar.' : '');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userContent }];
    setMessages(newMessages);
    if (!customMessage) setInputText('');
    setIsLoading(true);

    // Capturar contexto REAL de la pantalla en este milisegundo
    const screenContext = captureScreenContext();

    // Locución de relleno instantánea (<100ms)
    speakFiller();

    try {
      let promptToUse = buildChildSystemPrompt(currentSkin.name);

      // INYECCIÓN OBLIGATORIA DEL CONTEXTO DE PANTALLA EN TIEMPO REAL
      promptToUse += `\n\n=== CONTEXTO DE LA PANTALLA EN TIEMPO REAL ===\n${screenContext}\nDIRECTIVA OBLIGATORIA: El estudiante está viendo esta pantalla exactamente en este milisegundo. Si hace preguntas sobre "qué hay aquí", "qué es esto", "explícame esta pantalla" o sobre el contenido visible, responde utilizando los datos exactos del texto visible en su pantalla.`;

      if (currentImg) {
        promptToUse += `\nNOTA: El usuario te ha adjuntado una foto de su cuaderno o ficha escolar. Lee el manuscrito, analiza el ejercicio y guíale didácticamente.`;
      }

      // Si el niño pide explícitamente ver una imagen/foto/infografía
      const isRequestingVisual = /ver|foto|imagen|dibujo|infografía|mostrar/i.test(query);
      if (isRequestingVisual) {
        promptToUse += `\nIMPORTANTE: El estudiante ha pedido ver una imagen/foto/infografía. SIEMPRE incluye una ilustración o esquema visual en formato Markdown usando la siguiente sintaxis exacta: ![Nombre del objeto](https://image.pollinations.ai/prompt/objeto_en_ingles?width=600&height=400&nologo=true)`;
      }

      let responseText = await askAI({
        messages: [
          { role: 'system', content: promptToUse },
          ...newMessages
        ],
        temperature: 0.5
      });

      // Fallback si solicitó una imagen y la respuesta no incluye URL de imagen
      if (isRequestingVisual && !responseText.includes('http')) {
        const topicMatch = query.replace(/quiero|ver|una|foto|de|un|una|imagen|dibujo|infografía/gi, '').trim();
        const searchTopic = topicMatch || 'educational illustration';
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(searchTopic)}?width=600&height=400&nologo=true`;
        responseText += `\n\n![${searchTopic}](${imgUrl})`;
      }

      setMessages([...newMessages, { role: 'assistant', content: responseText }]);
      speak(responseText);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `⚠️ Error: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const lastClickTimeRef = useRef<number>(0);

  // Arrastre del Bot (Pointer Events)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Solo clic izquierdo para arrastrar
    if (!dragRef.current) return;
    setIsDragging(false);
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

    if (!isDragging && Math.hypot(dx, dy) > 6) {
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
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    const now = Date.now();
    // Previene parpadeo o saltos caóticos al pulsar la mascota varias veces rápidamente
    if (!isDragging && now - lastClickTimeRef.current > 180) {
      lastClickTimeRef.current = now;
      if (!isOpen) {
        setIsOpen(true);
        setIsExpanded(false);
      } else {
        setIsOpen(!isOpen);
      }
    }
    setIsDragging(false);
  };

  // Evento Clic Derecho (onContextMenu) sobre la Mascota
  const handleMascotContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 260)
    });
  };

  // Redimensionar ventana desde la Esquina Superior Izquierda (Top-Left Resize)
  const handleResizeTLStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingTL(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startW: windowSize.width,
      startH: windowSize.height
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeTLMove = (e: React.PointerEvent) => {
    if (!isResizingTL) return;
    const dx = resizeStartRef.current.x - e.clientX;
    const dy = resizeStartRef.current.y - e.clientY;

    const newW = Math.max(280, Math.min(750, resizeStartRef.current.startW + dx));
    const newH = Math.max(300, Math.min(800, resizeStartRef.current.startH + dy));

    setWindowSize({ width: newW, height: newH });
  };

  const handleResizeTLEnd = (e: React.PointerEvent) => {
    if (isResizingTL) {
      setIsResizingTL(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
      localStorage.setItem('goals_chat_w', String(windowSize.width));
      localStorage.setItem('goals_chat_h', String(windowSize.height));
    }
  };

  if (isMinimized) {
    return (
      <>
        <div
          onClick={onToggleMinimize}
          className="fixed bottom-6 right-0 z-50 flex items-center gap-1 py-2 px-1.5 rounded-l-xl bg-slate-950/90 border-l border-t border-b border-indigo-500/40 shadow-lg backdrop-blur-md cursor-pointer hover:pl-2.5 transition-all duration-300 select-none animate-fadeIn group"
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

  // Posición de la Ventana Píldora
  const getPillPosition = () => {
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const pillW = Math.min(windowW - 24, 340);
    const pillH = 64;

    if (!dragRef.current) {
      return {
        left: Math.max(12, windowW - pillW - 24),
        top: Math.max(12, windowH - pillH - 95),
        width: pillW
      };
    }

    const rect = dragRef.current.getBoundingClientRect();
    const isRightHalf = rect.left + rect.width / 2 > windowW / 2;
    const isBottomHalf = rect.top + rect.height / 2 > windowH / 2;

    let left = isRightHalf ? rect.right - pillW : rect.left;
    let top = isBottomHalf ? rect.top - pillH - 8 : rect.bottom + 8;

    left = Math.max(12, Math.min(left, windowW - pillW - 12));
    top = Math.max(12, Math.min(top, windowH - pillH - 12));

    return { left, top, width: pillW };
  };

  // Posición de la Ventana Extendida
  const getSmartPopupPosition = () => {
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const popupW = Math.min(windowW - 24, windowSize.width);
    const popupH = Math.min(windowH - 80, windowSize.height);

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

    let left = isRightHalf ? rect.right - popupW : rect.left;
    let top = isBottomHalf ? rect.top - popupH - 12 : rect.bottom + 12;

    left = Math.max(12, Math.min(left, windowW - popupW - 12));
    top = Math.max(12, Math.min(top, windowH - popupH - 12));

    return { left, top, width: popupW, height: popupH };
  };

  return (
    <>
      {/* 1. VENTANA PÍLDORA ULTRA-MINIMALISTA (PULSANDO EN CUALQUIER LADO SE AMPLÍA O PLEGA) */}
      {isOpen && !isExpanded && (() => {
        const pill = getPillPosition();
        const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');

        return (
          <div
            onClick={() => setIsExpanded(true)}
            style={{
              position: 'fixed',
              left: `${pill.left}px`,
              top: `${pill.top}px`,
              width: `${pill.width}px`,
            }}
            className="z-50 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 shadow-2xl backdrop-blur-xl p-2.5 px-3.5 flex items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-200 font-sans select-none cursor-pointer group"
          >
            {/* Texto Resumido */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-200 truncate font-medium">
                {isLoading
                  ? 'Escribiendo...'
                  : lastAssistantMsg
                    ? lastAssistantMsg.content
                    : 'Pregunta sobre la pantalla...'}
              </p>
            </div>

            {/* Iconos de Acción Minimalistas */}
            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              
              {/* Icono Dictar por Voz */}
              <button
                type="button"
                onClick={handleStartDictation}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  isDictating ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Dictar por voz"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Icono Conversación Voz a Voz Live (Formato Círculo Blanco) */}
              <button
                type="button"
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  isVoiceActive
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-white text-slate-950 hover:bg-slate-200'
                }`}
                title={isVoiceActive ? "Desactivar Voz Live" : "Modo Conversación Voz a Voz"}
              >
                <AudioLines className="w-4 h-4" />
              </button>

              {/* Botón Plegar/Cerrar */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                title="Cerrar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* 2. VENTANA EXTENDIDA ULTRA-MINIMALISTA (REDIMENSIONABLE DESDE LA ESQUINA SUPERIOR IZQUIERDA) */}
      {isOpen && isExpanded && (() => {
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
            className="z-50 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans relative"
          >
            
            {/* 📐 AGARRE ESQUINA SUPERIOR IZQUIERDA PARA REDIMENSIONAR (TOP-LEFT RESIZE HANDLE) */}
            <div
              onPointerDown={handleResizeTLStart}
              onPointerMove={handleResizeTLMove}
              onPointerUp={handleResizeTLEnd}
              className="absolute top-0 left-0 w-7 h-7 z-30 cursor-nwse-resize group/resize p-1 flex items-center justify-center select-none"
              title="Arrastrar desde la esquina superior izquierda para redimensionar la ventana"
            >
              <div className="w-3 h-3 border-t-2 border-l-2 border-slate-500 group-hover/resize:border-amber-400 rounded-tl-sm transition-colors" />
            </div>

            {/* BARRA SUPERIOR ULTRA-MINIMALISTA (PULSANDO EN CUALQUIER ZONA VACÍA PLEGA LA VENTANA) */}
            <div 
              onClick={() => setIsExpanded(false)}
              className="p-2.5 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 pl-3">
                <span className="text-base">{currentSkin.avatarIcon}</span>
                <span className="text-[11px] font-extrabold text-white">{getCustomMascotName()}</span>
              </div>

              {/* ICONOS DE ACCIÓN MINIMALISTAS */}
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                
                {/* Dictar por voz */}
                <button
                  type="button"
                  onClick={handleStartDictation}
                  className={`p-1.5 rounded-lg transition-all text-xs cursor-pointer ${
                    isDictating ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Dictar por voz"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Conversación Voz a Voz (Botón Círculo Blanco) */}
                <button
                  type="button"
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                    isVoiceActive
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-white text-slate-950 hover:bg-slate-200'
                  }`}
                  title={isVoiceActive ? "Desactivar Voz Live" : "Modo Conversación Voz a Voz"}
                >
                  <AudioLines className="w-3.5 h-3.5" />
                </button>

                {/* Mute TTS */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`p-1.5 rounded-lg transition-all text-xs cursor-pointer ${
                    isMuted ? 'text-slate-500 hover:text-slate-300' : 'text-amber-400 hover:bg-amber-400/10'
                  }`}
                  title={isMuted ? "Activar Voz TTS" : "Desactivar Voz TTS"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Plegar Ventana */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  title="Plegar a píldora"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Cerrar */}
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); stop(); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  title="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Historial de Mensajes */}
            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2 text-slate-500">
                  <Sparkles className="w-5 h-5 text-amber-400/80 animate-pulse" />
                  <p className="text-xs text-slate-400">Escribe o dicta tu consulta didáctica</p>
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[95%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-sm font-semibold'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm font-sans w-full'
                      }`}
                    >
                      {m.role === 'assistant' ? (
                        <DidacticResponseRenderer content={m.content} />
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-amber-400 p-2 bg-slate-900 border border-slate-800 rounded-xl w-fit animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Procesando...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Vista previa de imagen adjuntada */}
            {attachedImage && (
              <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <img
                      src={attachedImage.previewUrl}
                      alt="Foto cuaderno"
                      className="w-9 h-9 rounded-xl object-cover border border-indigo-500/50 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setAttachedImage(null)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-md hover:scale-110 transition-transform cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="text-[10px] font-extrabold text-indigo-300">
                    Imagen de Cuaderno / Consulta adjuntada
                  </span>
                </div>
              </div>
            )}

            {/* Entrada de Texto */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe o dicta aquí..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all"
              />
              <button
                type="submit"
                disabled={(!inputText.trim() && !attachedImage) || isLoading}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        );
      })()}

      {/* 3. MASCOTA FLOTANTE DRAGGABLE (CON EVENTO CLIC DERECHO HABILITADO) */}
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
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onContextMenu={handleMascotContextMenu}
          className="group relative cursor-grab active:cursor-grabbing"
        >
          {/* Botón Minimizar al Borde */}
          {onToggleMinimize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMinimize();
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-400 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all z-30 shadow-md cursor-pointer active:scale-90"
              title="Minimizar al borde"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <MascotPet skinId={currentSkinId} animState={animState} scale={mascotScale} />
        </div>
      </div>

      {/* 4. MENÚ CONTEXTUAL DEL BOTÓN DERECHO DEL RATÓN (BOTÓN DERECHO EN LA WEB / BOT) */}
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          className="z-50 w-56 bg-slate-950/95 border border-slate-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl font-sans text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[10px] font-bold text-amber-400 border-b border-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Configuración Mascota</span>
          </div>

          {/* Opción: Cambiar Skin */}
          <button
            onClick={() => {
              setContextMenu({ visible: false, x: 0, y: 0 });
              setIsSkinModalOpen(true);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cambiar Aspecto / Skin</span>
          </button>

          {/* Opción: Probar Animación */}
          <button
            onClick={() => {
              setAnimState('speaking');
              setTimeout(() => setAnimState('idle'), 2500);
              setContextMenu({ visible: false, x: 0, y: 0 });
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Animar Mascota (Saludar)</span>
          </button>

          {/* Opción: Ajustar Escala */}
          <div className="px-2 py-1 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-semibold block mb-1">Tamaño Avatar:</span>
            <div className="grid grid-cols-3 gap-1">
              {[0.9, 1.2, 1.5].map((scale) => (
                <button
                  key={scale}
                  onClick={() => {
                    handleScaleChange(scale);
                    setContextMenu({ visible: false, x: 0, y: 0 });
                  }}
                  className={`py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    mascotScale === scale
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {scale}x
                </button>
              ))}
            </div>
          </div>

          {/* Opción: Restablecer Tamaño Ventana */}
          <button
            onClick={() => {
              setWindowSize({ width: 380, height: 480 });
              localStorage.setItem('goals_chat_w', '380');
              localStorage.setItem('goals_chat_h', '480');
              setContextMenu({ visible: false, x: 0, y: 0 });
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-800/80"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Restablecer Tamaño Ventana</span>
          </button>
        </div>
      )}

      {/* Modal de Selección de Skins */}
      {isSkinModalOpen && (
        <MascotSkinSelectorModal
          currentSkinId={currentSkinId}
          onSelectSkin={handleSelectSkin}
          onClose={() => setIsSkinModalOpen(false)}
        />
      )}

      {/* Modal de Escucha Activa Inteligente para Niños */}
      <VoiceListeningModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptComplete={(cleanText) => {
          handleSendMessage(cleanText);
        }}
      />
    </>
  );
};
