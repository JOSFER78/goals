export type MascotSkinId = 'astrobot' | 'buho' | 'dragon' | 'gatito';

export type MascotAnimState = 'idle' | 'hover' | 'thinking' | 'speaking' | 'dragging';

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
}

export interface MascotPosition {
  x: number;
  y: number;
}
