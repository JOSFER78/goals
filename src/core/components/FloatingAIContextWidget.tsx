import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Sparkles, Bot, X, Send, Eye, RefreshCw, Trash2, Volume2, VolumeX, 
  Settings, Move, Maximize2, Minimize2, ChevronLeft, ChevronUp, ChevronDown, 
  Mic, MicOff, AudioLines, Palette, Zap, RotateCcw, Check, Sparkle, Paperclip, Camera, Moon, Sun, Flame,
  Pencil, Compass
} from 'lucide-react';
import { askAI, ChatMessage, buildChildSystemPrompt, getCustomMascotName } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { db, collection, addDoc, doc, setDoc } from '../config/firebase';

import { MascotSkinId, MascotAnimState } from '../types/mascot';
import { MASCOT_SKINS } from '../config/mascotSkins';
import { MascotPet } from './mascot/MascotPet';
import { MascotSkinSelectorModal } from './mascot/MascotSkinSelectorModal';
import { MascotSpeechBubble } from './mascot/MascotSpeechBubble';
import { LiveVoiceVisualizer } from './mascot/LiveVoiceVisualizer';
import { useMascotBrain } from '../hooks/useMascotBrain';
import { useLiveVoiceCompanion } from '../hooks/useLiveVoiceCompanion';
import { VoiceListeningModal } from './VoiceListeningModal';
import { DidacticResponseRenderer } from './DidacticResponseRenderer';
import { MascotExpandedPad } from './mascot/MascotExpandedPad';
import { SpatialFlightOverlay } from './mascot/SpatialFlightOverlay';
import { SpatialGuidingBubble } from './mascot/SpatialGuidingBubble';
import { useSpatialAgenticNavigator } from '../hooks/useSpatialAgenticNavigator';
import { MascotSpatialRegistry } from '../services/mascotSpatialRegistry';

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
    return (localStorage.getItem('goals_mascot_skin') as MascotSkinId) || 'sparky';
  });
  const currentSkin = MASCOT_SKINS[currentSkinId] || MASCOT_SKINS.sparky;

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);
  const [isDrawingPadOpen, setIsDrawingPadOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hook del Cerebro Autónomo y FSM de la Mascota
  const mascotBrain = useMascotBrain({
    skinId: currentSkinId,
    activeExperience,
    studentName: user?.displayName || undefined,
    enableAutoGreetings: true,
    enableSpontaneousTips: true,
  });

  // Hook de Voz Bidireccional Flotante
  const voiceCompanion = useLiveVoiceCompanion({
    skinConfig: currentSkin,
    mode: 'continuous_duplex',
    onTranscriptComplete: async (transcript) => {
      return await handleSendMessageInternal(transcript);
    }
  });

  // Sincronizar estado del motor de voz con el FSM de la mascota
  useEffect(() => {
    if (voiceCompanion.companionState === 'listening') {
      mascotBrain.notifyVoiceListening(true);
      mascotBrain.notifyAISpeaking(false);
      mascotBrain.notifyAIGenerating(false);
    } else if (voiceCompanion.companionState === 'thinking') {
      mascotBrain.notifyAIGenerating(true);
      mascotBrain.notifyVoiceListening(false);
      mascotBrain.notifyAISpeaking(false);
    } else if (voiceCompanion.companionState === 'speaking') {
      mascotBrain.notifyAISpeaking(true);
      mascotBrain.notifyVoiceListening(false);
      mascotBrain.notifyAIGenerating(false);
    } else if (voiceCompanion.companionState === 'idle') {
      mascotBrain.notifyAISpeaking(false);
      mascotBrain.notifyVoiceListening(false);
      mascotBrain.notifyAIGenerating(false);
    }
  }, [voiceCompanion.companionState]);

  // Hook de Navegación Espacial Agéntica y Teletransporte
  const spatialNavigator = useSpatialAgenticNavigator({
    mascotScale: parseFloat(localStorage.getItem('goals_mascot_scale') || '1.2'),
    glowColor: currentSkin.glowColor,
    onShowBubble: (bubble) => mascotBrain.showCustomBubble(bubble.text, bubble.durationMs),
    onDismissBubble: () => mascotBrain.dismissBubble(),
    speakTTS: (text) => voiceCompanion.speakTTS(text)
  });

  // Tamaño de la ventana de chat extendida
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => {
    const savedW = parseInt(localStorage.getItem('goals_chat_w') || '380', 10);
    const savedH = parseInt(localStorage.getItem('goals_chat_h') || '480', 10);
    return { width: savedW, height: savedH };
  });

  const [isResizingTL, setIsResizingTL] = useState(false);
  const resizeStartRef = useRef<{ x: number; y: number; startW: number; startH: number }>({ x: 0, y: 0, startW: 380, startH: 480 });

  // Menú contextual del botón derecho
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0 });

  const [mascotScale, setMascotScale] = useState(() => {
    return parseFloat(localStorage.getItem('goals_mascot_scale') || '1.2');
  });

  const [position, setPosition] = useState<{ x?: number; y?: number }>({});
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number; startLeft: number; startTop: number }>({ x: 0, y: 0, startLeft: 0, startTop: 0 });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Listener para cerrar menú contextual
  useEffect(() => {
    const handleCloseMenu = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    };
    window.addEventListener('click', handleCloseMenu);
    return () => window.removeEventListener('click', handleCloseMenu);
  }, [contextMenu.visible]);

  // Sincronizar cambios de skin
  useEffect(() => {
    const syncMascot = () => {
      const savedSkin = (localStorage.getItem('goals_mascot_skin') as MascotSkinId) || 'sparky';
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

  const captureScreenContext = (): string => {
    const sectionName = activeExperience
      ? `Mini App / Vista: ${activeExperience.toUpperCase()}`
      : 'Dashboard Principal de Inicio GOALS';
    
    let pageText = '';
    const mainEl = document.querySelector('main') || document.querySelector('#app') || document.body;
    if (mainEl) {
      const clone = mainEl.cloneNode(true) as HTMLElement;
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

  const handleSendMessageInternal = async (query: string): Promise<string> => {
    if (!query.trim() && !attachedImage) return '';

    // Comprobar si es una intención de navegación espacial directa
    if (!attachedImage && spatialNavigator.parseAndExecuteIntent(query)) {
      const navFeedback = '¡De acuerdo! Guiándote hacia esa sección interactiva.';
      return navFeedback;
    }

    const currentImg = attachedImage;
    setAttachedImage(null);

    const userContent = query.trim() || (currentImg ? 'Analiza esta foto de mi cuaderno escolar.' : '');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userContent }];
    setMessages(newMessages);
    setIsLoading(true);
    mascotBrain.notifyAIGenerating(true);

    const screenContext = captureScreenContext();
    const spatialContext = MascotSpatialRegistry.generateSpatialContextPrompt();

    try {
      let promptToUse = buildChildSystemPrompt(currentSkin.name);
      promptToUse += `\n\n=== CONTEXTO DE LA PANTALLA EN TIEMPO REAL ===\n${screenContext}\n${spatialContext}\nDIRECTIVA OBLIGATORIA: El estudiante está viendo esta pantalla exactamente en este milisegundo. Responde utilizando los datos exactos del texto visible en su pantalla.`;

      if (currentImg) {
        promptToUse += `\nNOTA: El usuario te ha adjuntado una foto de su cuaderno escolar.`;
      }

      const responseText = await askAI({
        messages: [
          { role: 'system', content: promptToUse },
          ...newMessages
        ],
        temperature: 0.5
      });

      setMessages([...newMessages, { role: 'assistant', content: responseText }]);
      mascotBrain.notifyAIGenerating(false);

      // Si la ventana de chat está cerrada, mostrar la respuesta en el bocadillo de cómic
      if (!isOpen) {
        mascotBrain.showCustomBubble(responseText.slice(0, 280), 8000);
      }

      return responseText;
    } catch (err: any) {
      const errText = `Error: ${err.message}`;
      setMessages([...newMessages, { role: 'assistant', content: errText }]);
      mascotBrain.notifyAISpeaking(false);
      mascotBrain.notifyAIGenerating(false);
      return errText;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const query = customMessage || inputText;
    if (!query.trim() && !attachedImage) return;
    if (!customMessage) setInputText('');
    await handleSendMessageInternal(query);
  };

  const lastClickTimeRef = useRef<number>(0);

  // Arrastre suave con pointer capture
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
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
    mascotBrain.onDragStart({ x: rect.left, y: rect.top });
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
      mascotBrain.onDragMove({ x: newLeft, y: newTop });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    const now = Date.now();
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
    mascotBrain.onDragEnd();
  };

  const handleMascotContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 260)
    });
  };

  // Redimensionar ventana extendida desde Top-Left
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

  // Posición de la ventana emergente inteligente
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
    let top = isBottomHalf ? rect.top - popupH - 8 : rect.bottom + 8;

    left = Math.max(12, Math.min(left, windowW - popupW - 12));
    top = Math.max(12, Math.min(top, windowH - popupH - 12));

    return { left, top, width: popupW, height: popupH };
  };

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

  return (
    <>
      {/* 1. BOCADILLO DE CÓMIC AUTÓNOMO ESTILO CHATGPT */}
      {!isOpen && mascotBrain.bubble && mascotBrain.bubble.text && (
        <MascotSpeechBubble
          text={mascotBrain.bubble.text}
          mascotPos={spatialNavigator.flightState.isFlying || spatialNavigator.anchorState.isAnchored ? spatialNavigator.mascotPos : position}
          mascotScale={mascotScale}
          mascotName={currentSkin.name}
          primaryColor={currentSkin.primaryColor}
          actionChips={mascotBrain.bubble.chips}
          onActionClick={(prompt) => {
            if (prompt === '__OPEN_DRAWING_PAD__') {
              setIsDrawingPadOpen(true);
            } else {
              setIsOpen(true);
              setIsExpanded(true);
              handleSendMessage(prompt);
            }
          }}
          onOpenDrawingPad={() => setIsDrawingPadOpen(true)}
          onExpandChat={() => {
            setIsOpen(true);
            setIsExpanded(true);
          }}
          onClose={mascotBrain.dismissBubble}
        />
      )}

      {/* 2. VENTANA EMERGENTE MODO PÍLDORA / EXTENDIDA */}
      {isOpen && !isExpanded && (() => {
        const pillPos = getPillPosition();
        return (
          <div
            data-widget="ai-chat"
            style={{
              position: 'fixed',
              left: `${pillPos.left}px`,
              top: `${pillPos.top}px`,
              width: `${pillPos.width}px`,
              zIndex: 50
            }}
            className="bg-slate-950/95 border border-indigo-500/40 rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 flex items-center justify-between gap-2 select-none"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 pl-1">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${currentSkin.primaryColor}20`,
                  borderColor: `${currentSkin.primaryColor}50`,
                  color: currentSkin.primaryColor
                }}
              >
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs text-white block truncate">{currentSkin.name}</span>
                <span className="text-[10px] text-indigo-300 truncate block">Compañero activo</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Botón 1: 🎙️ Transcripción de Voz / Dictado STT */}
              <button
                type="button"
                onClick={() => voiceCompanion.toggleDictation()}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                  voiceCompanion.isDictating
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30'
                }`}
                title={voiceCompanion.isDictating ? 'Detener Transcripción de Voz' : 'Transcripción de Voz (Dictado STT)'}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              {/* Botón 2: 💬 Agente de Voz en Directo (Live V2V) */}
              <button
                type="button"
                onClick={() => voiceCompanion.toggleLiveV2V()}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                  voiceCompanion.isV2VActive
                    ? 'bg-gradient-to-tr from-cyan-400 to-indigo-500 text-slate-950 font-black animate-pulse shadow-md shadow-cyan-500/40 ring-2 ring-cyan-400/30'
                    : 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-white border border-cyan-500/30'
                }`}
                title={voiceCompanion.isV2VActive ? 'Detener Agente de Voz en Directo' : 'Agente de Voz en Directo (Live V2V)'}
              >
                {voiceCompanion.isV2VActive ? (
                  <div className="flex items-center gap-0.5 h-3.5">
                    <span className="w-0.5 h-2 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-3.5 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-2.5 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-0.5 h-1.5 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                  </div>
                ) : (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <rect x="3" y="9" width="2.4" height="6" rx="1.2" />
                    <rect x="8" y="4" width="2.4" height="16" rx="1.2" />
                    <rect x="13" y="2" width="2.4" height="20" rx="1.2" />
                    <rect x="18" y="7" width="2.4" height="10" rx="1.2" />
                  </svg>
                )}
              </button>

              {/* Botón 3: 🛑 Callar / Detener Inmediato en 0ms (Visible cuando hay actividad de audio) */}
              {(voiceCompanion.isSpeaking || voiceCompanion.isListening || voiceCompanion.isThinking || voiceCompanion.isDictating || voiceCompanion.isV2VActive) && (
                <button
                  type="button"
                  onClick={() => voiceCompanion.stopAllNow()}
                  className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-all cursor-pointer border border-rose-500 shadow-md shadow-rose-600/30 active:scale-90"
                  title="🛑 Callar a la mascota inmediatamente (0ms)"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Expandir Chat Completo"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Cerrar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* 3. VENTANA EXTENDIDA DE CONVERSACIÓN Y VISOR DIDÁCTICO */}
      {isOpen && isExpanded && (() => {
        const smartPos = getSmartPopupPosition();
        return (
          <div
            data-widget="ai-chat"
            style={{
              position: 'fixed',
              left: `${smartPos.left}px`,
              top: `${smartPos.top}px`,
              width: `${smartPos.width}px`,
              height: `${smartPos.height}px`,
              zIndex: 50
            }}
            className="bg-slate-950/95 border border-indigo-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Controlador de Redimensionado Top-Left */}
            <div
              onPointerDown={handleResizeTLStart}
              onPointerMove={handleResizeTLMove}
              onPointerUp={handleResizeTLEnd}
              className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize z-30 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
              title="Arrastrar para redimensionar"
            >
              <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-indigo-400 rounded-tl-sm" />
            </div>

            {/* Cabecera */}
            <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 pl-4">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${currentSkin.primaryColor}20`,
                    borderColor: `${currentSkin.primaryColor}40`,
                    color: currentSkin.primaryColor
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white">{currentSkin.name}</h3>
                  <p className="text-[10px] text-slate-400">{currentSkin.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Botón Silenciar Rápido si la mascota habla */}
                {voiceCompanion.isSpeaking && (
                  <button
                    type="button"
                    onClick={() => voiceCompanion.stopAllNow()}
                    className="px-2 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer border border-rose-500 shadow-sm animate-pulse active:scale-95"
                    title="🛑 Callar a la mascota (0ms)"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span className="hidden sm:inline">Callar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsSkinModalOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Cambiar Aspecto de Mascota"
                >
                  <Palette className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Modo Píldora"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Cerrar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Historial de Mensajes */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-sans text-xs">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3 text-slate-400">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `${currentSkin.primaryColor}15`,
                      borderColor: `${currentSkin.primaryColor}30`,
                      color: currentSkin.primaryColor
                    }}
                  >
                    <MascotPet skinId={currentSkinId} animState="idle" scale={1} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">¡Hola! Soy {currentSkin.name}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Pregúntame cualquier duda, pídeme que analice tu pantalla o háblame por voz.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                    <button
                      onClick={() => handleSendMessage('¿Qué podemos aprender hoy en GOALS?')}
                      className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/40 text-[10px] text-indigo-300 transition-all cursor-pointer"
                    >
                      🚀 ¿Qué podemos aprender hoy?
                    </button>
                    <button
                      onClick={() => handleSendMessage('Explícame de forma sencilla lo que veo en pantalla')}
                      className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/40 text-[10px] text-indigo-300 transition-all cursor-pointer"
                    >
                      👀 Explícame esta pantalla
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
                      }`}
                    >
                      <DidacticResponseRenderer content={msg.content} />
                      {msg.role === 'assistant' && (
                        <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => voiceCompanion.speak(msg.content)}
                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
                            title="Escuchar respuesta de viva voz"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Escuchar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex items-center gap-2 text-indigo-400 text-xs italic">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>{currentSkin.name} está pensando...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Entrada de Texto y Voz Multimodal con Reactividad Total (Estándar ChatGPT / Gemini Live) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (voiceCompanion.isDictating) {
                  voiceCompanion.stopDictation();
                } else {
                  handleSendMessage();
                }
              }}
              className="p-2.5 bg-slate-900/95 border-t border-slate-800/80 flex items-center gap-2 shrink-0 select-none"
            >
              {/* MODO 1: GRABANDO DICTADO STT */}
              {voiceCompanion.isDictating ? (
                <div className="flex-1 flex items-center justify-between bg-slate-950/90 border border-rose-500/60 rounded-full px-3 py-1.5 shadow-[0_0_15px_rgba(244,63,94,0.2)] transition-all">
                  {/* Badge REC + Cronómetro */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-rose-400 tabular-nums">
                      00:{voiceCompanion.dictationDurationSec.toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Ondas Ecualizadoras Reactivas */}
                  <div className="flex items-center gap-0.5 mx-2 h-4 shrink-0">
                    {[0.35, 0.75, 1.0, 0.6, 0.9, 0.45, 0.8].map((factor, idx) => {
                      const heightPx = Math.max(3, Math.min(16, voiceCompanion.audioLevel * 18 * factor + (idx % 2 === 0 ? 2 : 4)));
                      return (
                        <div
                          key={idx}
                          className="w-0.5 bg-gradient-to-t from-rose-500 to-rose-300 rounded-full transition-all duration-75 ease-out"
                          style={{ height: `${heightPx}px` }}
                        />
                      );
                    })}
                  </div>

                  {/* Transcripción en Directo */}
                  <div className="flex-1 min-w-0 text-left px-1.5 truncate text-xs text-slate-100 font-medium">
                    {voiceCompanion.interimTranscript || voiceCompanion.finalTranscript || (
                      <span className="text-slate-400 italic">Escuchando tu voz...</span>
                    )}
                  </div>

                  {/* Acciones: Cancelar / Enviar */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => voiceCompanion.stopAllNow()}
                      className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Cancelar dictado"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => voiceCompanion.stopDictation()}
                      className="h-6 px-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
                      title="Terminar y Enviar"
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Listo</span>
                    </button>
                  </div>
                </div>
              ) : voiceCompanion.isV2VActive ? (
                /* MODO 2: LIVE V2V DÚPLEX ACTIVO */
                <div className="flex-1 flex items-center justify-between bg-slate-950/90 border border-cyan-500/60 rounded-full px-3 py-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all">
                  {/* Badge Estado V2V */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                    </span>
                    <span className="text-[11px] font-bold text-cyan-300">
                      {voiceCompanion.companionState === 'speaking' ? 'Hablando...' :
                       voiceCompanion.companionState === 'thinking' ? 'Pensando...' : 'En Vivo (Duplex)'}
                    </span>
                  </div>

                  {/* Ondas V2V */}
                  <div className="flex items-center gap-0.5 mx-2 h-4 shrink-0">
                    {[0.3, 0.7, 1.2, 0.8, 0.5, 0.9, 0.4].map((mult, i) => {
                      const activeLevel = voiceCompanion.companionState === 'speaking' 
                        ? voiceCompanion.viseme.aperture 
                        : voiceCompanion.audioLevel;
                      const barH = Math.max(3, Math.min(16, activeLevel * 16 * mult + 3));
                      return (
                        <div
                          key={i}
                          className="w-0.5 bg-cyan-400 rounded-full transition-all duration-75"
                          style={{ height: `${barH}px` }}
                        />
                      );
                    })}
                  </div>

                  {/* Botón Callar (0ms) */}
                  <button
                    type="button"
                    onClick={() => voiceCompanion.stopAllNow()}
                    className="px-2 py-0.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer shrink-0 transition-all active:scale-95"
                    title="🛑 Detener audio y callar (0ms)"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>Callar</span>
                  </button>
                </div>
              ) : (
                /* MODO 3: ENTRADA NORMAL (TEXTO + STT + ADJUNTO + SILENCIAR) */
                <div className="flex-1 relative flex items-center bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus-within:border-indigo-500/70 focus-within:ring-1 focus-within:ring-indigo-500/30 rounded-full px-3 py-1.5 transition-all shadow-inner">
                  {/* Botón Adjuntar Foto de Cuaderno */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0 mr-1"
                    title="Adjuntar foto de cuaderno o apunte"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Pregunta a ${currentSkin.name} o di algo...`}
                    className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none min-w-0 pr-1 font-sans"
                  />

                  {/* Botón Silencio 0ms si la mascota está hablando */}
                  {voiceCompanion.isSpeaking && (
                    <button
                      type="button"
                      onClick={() => voiceCompanion.stopAllNow()}
                      className="flex items-center gap-1 px-2 py-0.5 mr-1 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white text-[10px] font-semibold transition-all cursor-pointer shrink-0 shadow-sm animate-pulse active:scale-95"
                      title="🛑 Callar a la mascota inmediatamente (0ms)"
                    >
                      <VolumeX className="w-3 h-3" />
                      <span className="hidden sm:inline">Callar</span>
                    </button>
                  )}

                  {/* Botón 1: 🎙️ Icono de Micrófono para Dictado STT (Voz a Texto) */}
                  <button
                    type="button"
                    onClick={() => voiceCompanion.toggleDictation()}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      voiceCompanion.isDictating
                        ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={voiceCompanion.isDictating ? 'Detener Transcripción de Voz' : 'Transcripción de Voz (Dictado STT)'}
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>

                  {/* Botón Enviar Mensaje (Aparece cuando hay texto ingresado) */}
                  {inputText.trim() && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-7 h-7 ml-1 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
                      title="Enviar mensaje"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* BOTÓN 2: CONMUTADOR CIRCULAR MODERNO LIVE V2V (Estándar Gemini Live / ChatGPT Voice) */}
              <button
                type="button"
                onClick={() => voiceCompanion.toggleLiveV2V()}
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-95 ${
                  voiceCompanion.isV2VActive
                    ? 'bg-gradient-to-tr from-cyan-400 to-indigo-500 text-slate-950 ring-4 ring-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-pulse'
                    : 'bg-slate-950 border border-slate-800 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 hover:bg-slate-900 shadow-sm'
                }`}
                title={voiceCompanion.isV2VActive ? 'Detener Conversación en Vivo (Live V2V)' : 'Modo Conversación en Vivo (Live V2V)'}
              >
                {voiceCompanion.isV2VActive ? (
                  /* Animación de Ondas Activas Live V2V */
                  <div className="flex items-center gap-0.5 h-4">
                    <span className="w-0.5 h-2.5 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-4 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-3 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-0.5 h-2 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                  </div>
                ) : (
                  /* Icono 4-bar soundwave estándar de la industria (ılı|ı) */
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <rect x="3" y="9" width="2.4" height="6" rx="1.2" />
                    <rect x="8" y="4" width="2.4" height="16" rx="1.2" />
                    <rect x="13" y="2" width="2.4" height="20" rx="1.2" />
                    <rect x="18" y="7" width="2.4" height="10" rx="1.2" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        );
      })()}

      {/* OVERLAY DE VUELO CINEMÁTICO Y PARTÍCULAS STARDUST */}
      <SpatialFlightOverlay
        particles={spatialNavigator.particles}
        isFlying={spatialNavigator.flightState.isFlying}
      />

      {/* 4. MASCOTA FLOTANTE DRAGGABLE CON DERIVA AUTÓNOMA Y VISUALIZADOR DE VOZ */}
      <div 
        ref={dragRef}
        style={{
          position: 'fixed',
          left: spatialNavigator.flightState.isFlying || spatialNavigator.anchorState.isAnchored
            ? `${spatialNavigator.mascotPos.x}px`
            : position.x !== undefined ? `${position.x}px` : undefined,
          top: spatialNavigator.flightState.isFlying || spatialNavigator.anchorState.isAnchored
            ? `${spatialNavigator.mascotPos.y}px`
            : position.y !== undefined ? `${position.y}px` : undefined,
          bottom: (!spatialNavigator.flightState.isFlying && !spatialNavigator.anchorState.isAnchored && position.y === undefined) ? '24px' : undefined,
          right: (!spatialNavigator.flightState.isFlying && !spatialNavigator.anchorState.isAnchored && position.x === undefined) ? '24px' : undefined,
          transform: spatialNavigator.flightState.isFlying
            ? `rotate(${spatialNavigator.flightState.rotationDeg}deg) scaleX(${spatialNavigator.flightState.flipX ? -1 : 1})`
            : `translate3d(${mascotBrain.wanderOffset.x}px, ${mascotBrain.wanderOffset.y}px, 0)`,
          transition: spatialNavigator.flightState.isFlying 
            ? 'none' 
            : mascotBrain.state === 'WANDER' 
            ? 'transform 0.12s linear' 
            : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          touchAction: 'none'
        }}
        className="z-50 font-sans select-none flex flex-col items-end"
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onContextMenu={handleMascotContextMenu}
          onMouseEnter={mascotBrain.onPointerEnter}
          onMouseLeave={mascotBrain.onPointerLeave}
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

          {/* Visualizador de Ondas de Voz en Vivo */}
          <LiveVoiceVisualizer
            state={voiceCompanion.companionState}
            audioLevel={voiceCompanion.audioLevel}
            frequencyData={voiceCompanion.frequencyData}
            viseme={voiceCompanion.viseme}
            isV2V={voiceCompanion.isV2VActive}
            primaryColor={voiceCompanion.isV2VActive ? '#00F0FF' : currentSkin.primaryColor}
            glowColor={voiceCompanion.isV2VActive ? 'rgba(0, 240, 255, 0.45)' : currentSkin.glowColor}
            size={Math.round(80 * mascotScale)}
          >
            <MascotPet
              skinId={currentSkinId}
              animState={
                spatialNavigator.flightState.isFlying 
                  ? 'walk_roam' 
                  : voiceCompanion.companionState === 'speaking' 
                  ? 'speaking' 
                  : voiceCompanion.companionState === 'thinking' || isLoading
                  ? 'thinking'
                  : voiceCompanion.companionState === 'listening'
                  ? 'idle'
                  : mascotBrain.animState
              }
              scale={mascotScale}
              viseme={voiceCompanion.viseme}
              onClick={mascotBrain.onPetClick}
            />
          </LiveVoiceVisualizer>
        </div>
      </div>

      {/* 5. MENÚ CONTEXTUAL DEL BOTÓN DERECHO */}
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          className="z-50 w-60 bg-slate-950/95 border border-slate-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl font-sans text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[10px] font-bold text-amber-400 border-b border-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>{currentSkin.name}</span>
          </div>

          <button
            onClick={() => {
              setContextMenu({ visible: false, x: 0, y: 0 });
              setIsDrawingPadOpen(true);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-amber-400" />
            <span>Pizarra & Bloc de Apuntes</span>
          </button>

          <button
            onClick={() => {
              setContextMenu({ visible: false, x: 0, y: 0 });
              spatialNavigator.runTour();
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tour Guiado Agéntico</span>
          </button>

          {spatialNavigator.anchorState.isAnchored && (
            <button
              onClick={() => {
                setContextMenu({ visible: false, x: 0, y: 0 });
                spatialNavigator.returnToDock();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Volver a Reposo</span>
            </button>
          )}

          <button
            onClick={() => {
              setContextMenu({ visible: false, x: 0, y: 0 });
              setIsSkinModalOpen(true);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cambiar Compañero Pixel</span>
          </button>

          <button
            onClick={() => {
              mascotBrain.onPetClick();
              setContextMenu({ visible: false, x: 0, y: 0 });
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Acariciar / Saludar</span>
          </button>

          <div className="px-2 py-1 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-semibold block mb-1">Tamaño:</span>
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

      {/* Modal de Dictado por Voz */}
      <VoiceListeningModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptComplete={(cleanText) => {
          handleSendMessage(cleanText);
        }}
      />

      {/* Modal Pizarra de Escritura y Apuntes */}
      <MascotExpandedPad
        isOpen={isDrawingPadOpen}
        onClose={() => setIsDrawingPadOpen(false)}
        mascotName={currentSkin.name}
        primaryColor={currentSkin.primaryColor}
        onSendToAI={async (query, _img) => {
          return await handleSendMessageInternal(query);
        }}
      />
    </>
  );

  function handleStartDictation() {
    setIsVoiceModalOpen(true);
  }
};
