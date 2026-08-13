import { MascotSkinConfig, MascotSkinId } from '../types/mascot';

export const MASCOT_SKINS: Record<MascotSkinId, MascotSkinConfig> = {
  astrobot: {
    id: 'astrobot',
    name: 'AstroBot',
    subtitle: 'Robot Espacial STEM & Lógica',
    primaryColor: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.4)',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    speechPitch: 1.15,
    speechRate: 1.0,
    avatarIcon: '🤖'
  },
  buho: {
    id: 'buho',
    name: 'Búho Sabio',
    subtitle: 'Tutor Didáctico de Ciencias',
    primaryColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    speechPitch: 0.95,
    speechRate: 0.95,
    avatarIcon: '🦉'
  },
  dragon: {
    id: 'dragon',
    name: 'Dragón Cósmico',
    subtitle: 'Guía Mítico de Rachas & Metas',
    primaryColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    speechPitch: 0.85,
    speechRate: 1.05,
    avatarIcon: '🐲'
  },
  gatito: {
    id: 'gatito',
    name: 'Gatito Galáctico',
    subtitle: 'Compañero Ágil de Idiomas',
    primaryColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    speechPitch: 1.3,
    speechRate: 1.1,
    avatarIcon: '🐱'
  }
};
