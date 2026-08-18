import { MascotSkinId } from './mascot';

export type MascotFSMState =
  | 'IDLE'            // Reposo atento con respiración y parpadeo LERP
  | 'WANDER'          // Deambulación / deriva suave por el suelo de la pantalla
  | 'IDLE_ACTION'     // Micro-acciones (mirar alrededor, estirarse, pirueta, bostezo)
  | 'SLEEPING'        // Sueño profundo tras 45s de inactividad con Zzz
  | 'HOVER'           // Alerta y curiosidad por puntero
  | 'USER_DRAG'       // Arrastre activo por el usuario (patalear/sorpresa)
  | 'CLICK'           // Caricia o clic: salto de júbilo con corazones
  | 'AI_GENERATING'   // Procesamiento cognitivo de la IA (órbita de runas/laptop)
  | 'AI_SPEAKING'     // Locución activa TTS con sincronización labial
  | 'VOICE_LISTENING'; // Escucha por micrófono en tiempo real con halo de ondas

export type MascotIdleActionType =
  | 'LOOK_AROUND'
  | 'STRETCH'
  | 'YAWN'
  | 'SPIN'
  | 'SPARKLE';

export interface MascotFSMPoint {
  x: number;
  y: number;
}

export interface ActionChip {
  id: string;
  label: string;
  prompt: string;
}

export interface MascotBubbleMessage {
  id: string;
  text: string;
  type: 'greeting' | 'lesson_cheer' | 'view_reaction' | 'didactic_tip' | 'idle_thought' | 'alert';
  durationMs: number;
  createdAt: number;
  chips?: ActionChip[];
}

export type MascotEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'DRAG_START'; position: MascotFSMPoint }
  | { type: 'DRAG_MOVE'; position: MascotFSMPoint }
  | { type: 'DRAG_END' }
  | { type: 'PET_CLICK' }
  | { type: 'AI_START_GENERATING' }
  | { type: 'AI_STOP_GENERATING' }
  | { type: 'AI_START_SPEAKING'; text?: string }
  | { type: 'AI_STOP_SPEAKING' }
  | { type: 'VOICE_START_LISTENING' }
  | { type: 'VOICE_STOP_LISTENING' }
  | { type: 'TICK'; deltaMs: number; inactivityMs: number }
  | { type: 'WAKE_UP' }
  | { type: 'SET_VIEW'; view: string | null }
  | { type: 'LESSON_COMPLETED'; lessonId: number; experienceId: string; stars?: number; title?: string }
  | { type: 'SHOW_BUBBLE'; message: MascotBubbleMessage };

export interface MascotFSMContext {
  currentState: MascotFSMState;
  previousState: MascotFSMState;
  idleActionType: MascotIdleActionType | null;
  idleActionTimerMs: number;
  wanderTimerMs: number;
  wanderOffset: MascotFSMPoint;
  wanderTarget: MascotFSMPoint;
  inactivityTimerMs: number;
  isSleeping: boolean;
  bubble: MascotBubbleMessage | null;
  currentExperience: string | null;
}
