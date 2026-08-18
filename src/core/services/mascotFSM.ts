import {
  MascotFSMState,
  MascotEvent,
  MascotFSMContext,
  MascotIdleActionType,
  MascotFSMPoint
} from '../types/mascotFSM';

export const INACTIVITY_SLEEP_THRESHOLD_MS = 45000; // 45 segundos para SLEEPING

export const INITIAL_MASCOT_FSM_CONTEXT: MascotFSMContext = {
  currentState: 'IDLE',
  previousState: 'IDLE',
  idleActionType: null,
  idleActionTimerMs: 0,
  wanderTimerMs: 0,
  wanderOffset: { x: 0, y: 0 },
  wanderTarget: { x: 0, y: 0 },
  inactivityTimerMs: 0,
  isSleeping: false,
  bubble: null,
  currentExperience: null,
};

const IDLE_ACTIONS: MascotIdleActionType[] = ['LOOK_AROUND', 'STRETCH', 'YAWN', 'SPIN', 'SPARKLE'];

export function mascotFSMReducer(
  context: MascotFSMContext,
  event: MascotEvent
): MascotFSMContext {
  // 1. Manejo de Interrupciones de Alta Prioridad
  switch (event.type) {
    case 'DRAG_START':
      return {
        ...context,
        previousState: context.currentState,
        currentState: 'USER_DRAG',
        inactivityTimerMs: 0,
        isSleeping: false,
        wanderOffset: { x: 0, y: 0 },
      };

    case 'DRAG_END':
      return {
        ...context,
        previousState: 'USER_DRAG',
        currentState: 'IDLE',
        inactivityTimerMs: 0,
      };

    case 'POINTER_ENTER':
      if (['USER_DRAG', 'AI_GENERATING', 'AI_SPEAKING', 'VOICE_LISTENING'].includes(context.currentState)) {
        return context;
      }
      return {
        ...context,
        previousState: context.currentState,
        currentState: 'HOVER',
        inactivityTimerMs: 0,
        isSleeping: false,
      };

    case 'POINTER_LEAVE':
      if (context.currentState === 'HOVER') {
        return {
          ...context,
          previousState: 'HOVER',
          currentState: 'IDLE',
          inactivityTimerMs: 0,
        };
      }
      return context;

    case 'PET_CLICK':
      return {
        ...context,
        previousState: context.currentState,
        currentState: 'CLICK',
        inactivityTimerMs: 0,
        isSleeping: false,
      };

    case 'VOICE_START_LISTENING':
      return {
        ...context,
        previousState: context.currentState,
        currentState: 'VOICE_LISTENING',
        inactivityTimerMs: 0,
        isSleeping: false,
      };

    case 'VOICE_STOP_LISTENING':
      if (context.currentState === 'VOICE_LISTENING') {
        return {
          ...context,
          previousState: 'VOICE_LISTENING',
          currentState: 'IDLE',
          inactivityTimerMs: 0,
        };
      }
      return context;

    case 'AI_START_GENERATING':
      return {
        ...context,
        previousState: context.currentState,
        currentState: 'AI_GENERATING',
        inactivityTimerMs: 0,
        isSleeping: false,
      };

    case 'AI_STOP_GENERATING':
      if (context.currentState === 'AI_GENERATING') {
        return {
          ...context,
          previousState: 'AI_GENERATING',
          currentState: 'IDLE',
          inactivityTimerMs: 0,
        };
      }
      return context;

    case 'AI_START_SPEAKING':
      return {
        ...context,
        previousState: context.currentState,
        currentState: 'AI_SPEAKING',
        inactivityTimerMs: 0,
        isSleeping: false,
      };

    case 'AI_STOP_SPEAKING':
      if (context.currentState === 'AI_SPEAKING') {
        return {
          ...context,
          previousState: 'AI_SPEAKING',
          currentState: 'IDLE',
          inactivityTimerMs: 0,
        };
      }
      return context;

    case 'WAKE_UP':
      return {
        ...context,
        inactivityTimerMs: 0,
        isSleeping: false,
        currentState: context.currentState === 'SLEEPING' ? 'IDLE' : context.currentState,
      };

    case 'SET_VIEW':
      return {
        ...context,
        currentExperience: event.view,
        inactivityTimerMs: 0,
        isSleeping: false,
      };

    case 'SHOW_BUBBLE':
      return {
        ...context,
        bubble: event.message,
      };

    case 'TICK': {
      const { deltaMs, inactivityMs } = event;

      // Descartar burbuja si expiró
      let nextBubble = context.bubble;
      if (nextBubble && Date.now() - nextBubble.createdAt > nextBubble.durationMs) {
        nextBubble = null;
      }

      // Si está en estado interactivo o bloqueado, no transicionar a estados autónomos
      if (['USER_DRAG', 'HOVER', 'AI_GENERATING', 'AI_SPEAKING', 'VOICE_LISTENING'].includes(context.currentState)) {
        return {
          ...context,
          inactivityTimerMs: 0,
          bubble: nextBubble,
        };
      }

      // Interrupción por clic en júbilo (duración 1.8s)
      if (context.currentState === 'CLICK') {
        const nextActionTimer = context.idleActionTimerMs + deltaMs;
        if (nextActionTimer >= 1800) {
          return {
            ...context,
            currentState: 'IDLE',
            idleActionTimerMs: 0,
            bubble: nextBubble,
          };
        }
        return {
          ...context,
          idleActionTimerMs: nextActionTimer,
          bubble: nextBubble,
        };
      }

      // REGLA DE SUEÑO: >= 45 segundos de inactividad
      if (inactivityMs >= INACTIVITY_SLEEP_THRESHOLD_MS && context.currentState !== 'SLEEPING') {
        return {
          ...context,
          currentState: 'SLEEPING',
          isSleeping: true,
          wanderOffset: { x: 0, y: 0 },
          idleActionType: null,
          bubble: nextBubble,
        };
      }

      if (context.currentState === 'SLEEPING') {
        return {
          ...context,
          bubble: nextBubble,
        };
      }

      // 2. CICLO AUTÓNOMO: IDLE -> WANDER -> IDLE_ACTION -> IDLE
      if (context.currentState === 'IDLE') {
        const nextWanderTimer = context.wanderTimerMs + deltaMs;
        // Salto a WANDER cada 9s aleatorios
        if (nextWanderTimer >= 9000) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 15 + Math.random() * 25;
          const target: MascotFSMPoint = {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          };
          return {
            ...context,
            currentState: 'WANDER',
            wanderTimerMs: 0,
            wanderTarget: target,
            bubble: nextBubble,
          };
        }
        return {
          ...context,
          wanderTimerMs: nextWanderTimer,
          bubble: nextBubble,
        };
      }

      if (context.currentState === 'WANDER') {
        const nextWanderTimer = context.wanderTimerMs + deltaMs;
        const currentOffset = context.wanderOffset;
        const target = context.wanderTarget;
        const lerpFactor = 0.05;
        const newOffset: MascotFSMPoint = {
          x: currentOffset.x + (target.x - currentOffset.x) * lerpFactor,
          y: currentOffset.y + (target.y - currentOffset.y) * lerpFactor,
        };

        if (nextWanderTimer >= 3500) {
          const randomAction = IDLE_ACTIONS[Math.floor(Math.random() * IDLE_ACTIONS.length)];
          return {
            ...context,
            currentState: 'IDLE_ACTION',
            idleActionType: randomAction,
            idleActionTimerMs: 0,
            wanderTimerMs: 0,
            wanderOffset: newOffset,
            bubble: nextBubble,
          };
        }

        return {
          ...context,
          wanderTimerMs: nextWanderTimer,
          wanderOffset: newOffset,
          bubble: nextBubble,
        };
      }

      if (context.currentState === 'IDLE_ACTION') {
        const nextActionTimer = context.idleActionTimerMs + deltaMs;
        if (nextActionTimer >= 2200) {
          return {
            ...context,
            currentState: 'IDLE',
            idleActionType: null,
            idleActionTimerMs: 0,
            wanderOffset: { x: 0, y: 0 },
            bubble: nextBubble,
          };
        }
        return {
          ...context,
          idleActionTimerMs: nextActionTimer,
          bubble: nextBubble,
        };
      }

      return {
        ...context,
        bubble: nextBubble,
      };
    }

    default:
      return context;
  }
}
