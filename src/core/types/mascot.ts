import { VoiceProviderId } from './voiceConnections';

export type MascotSkinId = 'sparky' | 'astrobot' | 'buho' | 'dragon' | 'gatito' | 'slime';

export type MascotAnimState = 
  | 'idle' 
  | 'hover' 
  | 'thinking' 
  | 'speaking' 
  | 'dragging' 
  | 'walk_roam' 
  | 'sleep_zzz' 
  | 'pet_happy';

export interface MascotSkinConfig {
  id: MascotSkinId;
  name: string;
  subtitle: string;
  primaryColor: string;
  glowColor: string;
  badgeBg: string;
  speechPitch: number;
  speechRate: number;
  avatarIcon: string;
  personality: string;
  defaultProvider?: VoiceProviderId;
  defaultVoice?: string;
}

export interface MascotPosition {
  x: number;
  y: number;
}

export interface VisemeState {
  aperture: number;
  width: number;
  shape: 'rest' | 'aa' | 'ee' | 'oh' | 'oo' | 'smile';
  intensity: number;
  currentWord?: string;
}

export interface MascotVoiceAssignment {
  providerId: VoiceProviderId;
  voiceId: string;
  voiceKey: string;
  voiceLabel: string;
}

export interface MascotConfig {
  skinId?: MascotSkinId;
  customName?: string;
  soulPrompt?: string;
  scale?: number;
  pitch?: number;
  rate?: number;
  assignedVoice?: string;
  assignedProvider?: VoiceProviderId;
  assignedVoicesBySkin?: Partial<Record<MascotSkinId, string>>;
  skinVoices?: Partial<Record<MascotSkinId, { providerId: VoiceProviderId; voiceId: string; voiceKey: string }>>;
}
