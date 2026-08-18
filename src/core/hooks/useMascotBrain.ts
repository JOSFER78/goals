import { useState, useEffect, useRef, useCallback } from 'react';
import { MascotSkinId, MascotAnimState, MascotSkinConfig } from '../types/mascot';
import { MASCOT_SKINS } from '../config/mascotSkins';
import {
  MascotFSMState,
  MascotEvent,
  MascotFSMContext,
  MascotBubbleMessage,
  MascotFSMPoint,
} from '../types/mascotFSM';
import { mascotFSMReducer, INITIAL_MASCOT_FSM_CONTEXT } from '../services/mascotFSM';
import { MascotDialogueEngine } from '../services/mascotDialogueEngine';
import { useMascotTTS } from './useMascotTTS';

export interface UseMascotBrainProps {
  skinId?: MascotSkinId;
  activeExperience?: string | null;
  studentName?: string;
  enableAutoGreetings?: boolean;
  enableSpontaneousTips?: boolean;
  enableSpeechOnBubble?: boolean;
}

export interface UseMascotBrainReturn {
  // Estado actual del FSM
  state: MascotFSMState;
  animState: MascotAnimState;
  skinConfig: MascotSkinConfig;
  
  // Posiciones y derivas
  wanderOffset: MascotFSMPoint;
  isSleeping: boolean;
  
  // Burbuja de pensamiento / cómic
  bubble: MascotBubbleMessage | null;
  dismissBubble: () => void;
  showCustomBubble: (text: string, durationMs?: number) => void;
  
  // Disparadores de Eventos e Interacciones
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onDragStart: (pos: MascotFSMPoint) => void;
  onDragMove: (pos: MascotFSMPoint) => void;
  onDragEnd: () => void;
  onPetClick: () => void;
  
  // Notificadores de IA y Voz
  notifyAIGenerating: (isGenerating: boolean) => void;
  notifyAISpeaking: (isSpeaking: boolean, text?: string) => void;
  notifyVoiceListening: (isListening: boolean) => void;
  
  // Didáctica y lecciones
  notifyLessonCompleted: (lessonId: number, experienceId: string, stars?: number, title?: string) => void;
  saySpontaneousTip: () => void;
  triggerGreeting: () => void;
  
  // TTS Control
  speak: (text: string) => void;
  stopTTS: () => void;
  isTTSSpeaking: boolean;
  isTTSMuted: boolean;
  toggleTTSMute: () => void;
}

export const useMascotBrain = ({
  skinId = 'sparky',
  activeExperience = null,
  studentName,
  enableAutoGreetings = true,
  enableSpontaneousTips = true,
  enableSpeechOnBubble = false,
}: UseMascotBrainProps = {}): UseMascotBrainReturn => {
  const skin = MASCOT_SKINS[skinId] || MASCOT_SKINS.sparky;
  const { speak, stop, isSpeaking: isTTSSpeaking, isMuted, toggleMute } = useMascotTTS(skin);

  const [fsmContext, setFsmContext] = useState<MascotFSMContext>(INITIAL_MASCOT_FSM_CONTEXT);
  const fsmContextRef = useRef<MascotFSMContext>(fsmContext);
  fsmContextRef.current = fsmContext;

  const lastActivityTimeRef = useRef<number>(Date.now());
  const hasGreetedRef = useRef<boolean>(false);

  // Despachador seguro para el reductor
  const dispatch = useCallback((event: MascotEvent) => {
    setFsmContext((prev) => mascotFSMReducer(prev, event));
  }, []);

  // Mapeo del estado FSM al AnimState visual del componente Canvas / SVG
  const getAnimState = (state: MascotFSMState): MascotAnimState => {
    switch (state) {
      case 'USER_DRAG':
        return 'dragging';
      case 'HOVER':
        return 'hover';
      case 'AI_GENERATING':
        return 'thinking';
      case 'AI_SPEAKING':
        return 'speaking';
      case 'CLICK':
        return 'pet_happy';
      case 'SLEEPING':
        return 'sleep_zzz';
      case 'WANDER':
        return 'walk_roam';
      case 'IDLE_ACTION':
      case 'VOICE_LISTENING':
      case 'IDLE':
      default:
        return 'idle';
    }
  };

  // Muestra de burbujas con locución opcional
  const showBubble = useCallback((text: string, type: MascotBubbleMessage['type'], durationMs: number = 5500) => {
    const bubbleMsg: MascotBubbleMessage = {
      id: 'msg_' + Date.now(),
      text,
      type,
      durationMs,
      createdAt: Date.now(),
      chips: [
        { id: '1', label: '💡 Explícamelo fácil', prompt: 'Explícamelo con un ejemplo sencillo para niños.' },
        { id: '2', label: '✨ ¿Sabías qué?', prompt: 'Cuéntame un dato curioso sobre lo que tengo en pantalla.' }
      ]
    };
    dispatch({ type: 'SHOW_BUBBLE', message: bubbleMsg });
    if (enableSpeechOnBubble) {
      speak(text);
    }
  }, [dispatch, enableSpeechOnBubble, speak]);

  const showCustomBubble = useCallback((text: string, durationMs: number = 5500) => {
    showBubble(text, 'idle_thought', durationMs);
  }, [showBubble]);

  const dismissBubble = useCallback(() => {
    dispatch({
      type: 'SHOW_BUBBLE',
      message: { id: '', text: '', type: 'idle_thought', durationMs: 0, createdAt: 0 },
    });
  }, [dispatch]);

  // Listener global de actividad del usuario (resetea inactividad)
  useEffect(() => {
    const handleUserActivity = () => {
      lastActivityTimeRef.current = Date.now();
      if (fsmContextRef.current.currentState === 'SLEEPING') {
        dispatch({ type: 'WAKE_UP' });
      }
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('scroll', handleUserActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [dispatch]);

  // Bucle principal de reloj (Tick)
  useEffect(() => {
    let lastTime = performance.now();
    let animFrameId: number;

    const loop = (currentTime: number) => {
      const deltaMs = currentTime - lastTime;
      lastTime = currentTime;
      const inactivityMs = Date.now() - lastActivityTimeRef.current;

      dispatch({ type: 'TICK', deltaMs, inactivityMs });
      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [dispatch]);

  // Saludo inicial automático según la hora
  useEffect(() => {
    if (enableAutoGreetings && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      const greeting = MascotDialogueEngine.getTimeGreeting(skinId, studentName);
      const t = setTimeout(() => {
        showBubble(greeting.text, greeting.type, greeting.durationMs);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [enableAutoGreetings, skinId, studentName, showBubble]);

  // Reacción al cambio de vista
  useEffect(() => {
    dispatch({ type: 'SET_VIEW', view: activeExperience });
    if (activeExperience) {
      const reaction = MascotDialogueEngine.getViewReaction(activeExperience, skinId);
      if (reaction) {
        showBubble(reaction.text, reaction.type, reaction.durationMs);
      }
    }
  }, [activeExperience, skinId, dispatch, showBubble]);

  // Temporizador para consejos didácticos espontáneos (~2.5 min)
  useEffect(() => {
    if (!enableSpontaneousTips) return;

    const interval = setInterval(() => {
      if (fsmContextRef.current.currentState === 'IDLE' && !fsmContextRef.current.bubble) {
        const tip = MascotDialogueEngine.getSpontaneousTip(activeExperience);
        showBubble(tip.text, tip.type, tip.durationMs);
      }
    }, 150000);

    return () => clearInterval(interval);
  }, [enableSpontaneousTips, activeExperience, showBubble]);

  // Manejadores de interacción
  const onPointerEnter = useCallback(() => dispatch({ type: 'POINTER_ENTER' }), [dispatch]);
  const onPointerLeave = useCallback(() => dispatch({ type: 'POINTER_LEAVE' }), [dispatch]);
  const onDragStart = useCallback((pos: MascotFSMPoint) => dispatch({ type: 'DRAG_START', position: pos }), [dispatch]);
  const onDragMove = useCallback((pos: MascotFSMPoint) => dispatch({ type: 'DRAG_MOVE', position: pos }), [dispatch]);
  const onDragEnd = useCallback(() => dispatch({ type: 'DRAG_END' }), [dispatch]);

  const onPetClick = useCallback(() => {
    dispatch({ type: 'PET_CLICK' });
    const cheers: Record<MascotSkinId, string> = {
      sparky: '🔥 ¡Wooo! ¡Mi llama crece de emoción! ¡Me encanta acompañarte!',
      astrobot: '🤖 ¡Bip bop! ¡Giro de júbilo! Telemetría optimizada al máximo.',
      buho: '🦉 ¡Uhuuu! Me agrada tu compañía en esta jornada de estudio.',
      dragon: '🐲 ¡Rugido alegre! ¡Nuestra energía se multiplica juntos!',
      gatito: '🐱 ¡Purr purr! *Ronroneo galáctico* ¡Me encantan los mimos!',
      slime: '🟢 ¡Boing! ¡Rebotando de felicidad contigo!'
    };
    showBubble(cheers[skinId] || cheers.sparky, 'idle_thought', 3500);
  }, [dispatch, skinId, showBubble]);

  const notifyAIGenerating = useCallback((isGenerating: boolean) => {
    dispatch({ type: isGenerating ? 'AI_START_GENERATING' : 'AI_STOP_GENERATING' });
  }, [dispatch]);

  const notifyAISpeaking = useCallback((isSpeaking: boolean, text?: string) => {
    dispatch({ type: isSpeaking ? 'AI_START_SPEAKING' : 'AI_STOP_SPEAKING', text });
  }, [dispatch]);

  const notifyVoiceListening = useCallback((isListening: boolean) => {
    dispatch({ type: isListening ? 'VOICE_START_LISTENING' : 'VOICE_STOP_LISTENING' });
  }, [dispatch]);

  const notifyLessonCompleted = useCallback((
    lessonId: number,
    experienceId: string,
    stars: number = 3,
    title: string = `Lección ${lessonId}`
  ) => {
    dispatch({ type: 'LESSON_COMPLETED', lessonId, experienceId, stars, title });
    const cheer = MascotDialogueEngine.getLessonCompletionCheer(title, stars, 25, skinId);
    showBubble(cheer.text, cheer.type, cheer.durationMs);
  }, [dispatch, skinId, showBubble]);

  const saySpontaneousTip = useCallback(() => {
    const tip = MascotDialogueEngine.getSpontaneousTip(activeExperience);
    showBubble(tip.text, tip.type, tip.durationMs);
  }, [activeExperience, showBubble]);

  const triggerGreeting = useCallback(() => {
    const greeting = MascotDialogueEngine.getTimeGreeting(skinId, studentName);
    showBubble(greeting.text, greeting.type, greeting.durationMs);
  }, [skinId, studentName, showBubble]);

  return {
    state: fsmContext.currentState,
    animState: getAnimState(fsmContext.currentState),
    skinConfig: skin,
    wanderOffset: fsmContext.wanderOffset,
    isSleeping: fsmContext.isSleeping,
    bubble: fsmContext.bubble,
    dismissBubble,
    showCustomBubble,
    onPointerEnter,
    onPointerLeave,
    onDragStart,
    onDragMove,
    onDragEnd,
    onPetClick,
    notifyAIGenerating,
    notifyAISpeaking,
    notifyVoiceListening,
    notifyLessonCompleted,
    saySpontaneousTip,
    triggerGreeting,
    speak,
    stopTTS: stop,
    isTTSSpeaking,
    isTTSMuted: isMuted,
    toggleTTSMute: toggleMute,
  };
};
