import { MascotSkinConfig, MascotSkinId, MascotVoiceAssignment } from '../types/mascot';
import { VoiceProviderId } from '../types/voiceConnections';
import { VoiceProviderService, VOICE_PROVIDERS_METADATA } from '../services/VoiceProviderService';

export const MASCOT_SKINS: Record<MascotSkinId, MascotSkinConfig> = {
  sparky: {
    id: 'sparky',
    name: 'Sparky Fueguito',
    subtitle: 'Chispa Elemental de Energía & Pasión',
    primaryColor: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    speechPitch: 1.0,
    speechRate: 1.05,
    avatarIcon: '🔥',
    personality: 'Hiperactivo, curioso, apasionado y siempre animando al alumno con energía radiante.',
    defaultProvider: 'webspeech',
    defaultVoice: 'webspeech_alvaro'
  },
  astrobot: {
    id: 'astrobot',
    name: 'AstroBot',
    subtitle: 'Robot Espacial STEM & Lógica',
    primaryColor: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.4)',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    speechPitch: 1.04,
    speechRate: 1.0,
    avatarIcon: '🤖',
    personality: 'Robótico, preciso, analítico, enfocado en física, astronomía y lógica.',
    defaultProvider: 'webspeech',
    defaultVoice: 'webspeech_nil'
  },
  buho: {
    id: 'buho',
    name: 'Búho Sabio',
    subtitle: 'Tutor Didáctico de Ciencias',
    primaryColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    speechPitch: 0.92,
    speechRate: 0.95,
    avatarIcon: '🦉',
    personality: 'Pausado, reflexivo, sabio y paciente. Explica conceptos complejos de forma sencilla.',
    defaultProvider: 'webspeech',
    defaultVoice: 'webspeech_alvaro'
  },
  dragon: {
    id: 'dragon',
    name: 'Dragón Cósmico',
    subtitle: 'Guía Mítico de Rachas & Metas',
    primaryColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    speechPitch: 0.88,
    speechRate: 1.02,
    avatarIcon: '🐲',
    personality: 'Valiente, motivador, enfocado en superar retos y conseguir rachas de victorias.',
    defaultProvider: 'webspeech',
    defaultVoice: 'webspeech_jorge'
  },
  gatito: {
    id: 'gatito',
    name: 'Gatito Galáctico',
    subtitle: 'Compañero Ágil de Idiomas',
    primaryColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    speechPitch: 1.05,
    speechRate: 1.05,
    avatarIcon: '🐱',
    personality: 'Juguetón, alegre, con oído fino para la fonética, idiomas y vocabulario.',
    defaultProvider: 'webspeech',
    defaultVoice: 'webspeech_elvira'
  },
  slime: {
    id: 'slime',
    name: 'Slime Cuántico',
    subtitle: 'Elemental Elástico de Matemáticas',
    primaryColor: '#84CC16',
    glowColor: 'rgba(132, 204, 22, 0.4)',
    badgeBg: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
    speechPitch: 1.02,
    speechRate: 1.04,
    avatarIcon: '🟢',
    personality: 'Flexible, divertido, rebotante y siempre buscando patrones geométricos y números.',
    defaultProvider: 'webspeech',
    defaultVoice: 'webspeech_alvaro'
  }
};

export interface FlatVoiceItem {
  key: string;
  providerId: VoiceProviderId;
  providerName: string;
  providerBadge: string;
  voiceId: string;
  voiceName: string;
  lang: string;
  gender: string;
  qualityScore?: number;
}

export interface ConfiguredVoiceGroup {
  providerId: VoiceProviderId;
  providerName: string;
  badge: string;
  brandColor: string;
  voices: {
    key: string;
    voiceId: string;
    name: string;
    lang: string;
    qualityScore?: number;
  }[];
}

/**
 * 1. Obtiene únicamente los grupos de proveedores debidamente configurados (BYOK o nativos)
 * con sus voces correspondientes para alimentar los desplegables de UI.
 */
export function getConfiguredVoiceGroups(): ConfiguredVoiceGroup[] {
  const configuredProviders = VoiceProviderService.getConfiguredProviders().filter((p) => p.voices && p.voices.length > 0);
  return configuredProviders.map((prov) => ({
    providerId: prov.id,
    providerName: prov.name,
    badge: prov.badge,
    brandColor: prov.brandColor,
    voices: prov.voices.map((v) => ({
      key: `${prov.id}::${v.id}`,
      voiceId: v.id,
      name: v.name,
      lang: v.lang,
      qualityScore: v.qualityScore
    }))
  }));
}

/**
 * 2. Devuelve la lista de voces disponibles.
 * Por defecto filtra ÚNICAMENTE aquellas cuyos proveedores están configurados/habilitados en el perfil (BYOK o nativos).
 */
export function getAllAvailableVoicesList(onlyConfigured: boolean = true): FlatVoiceItem[] {
  const list: FlatVoiceItem[] = [];
  const providers = Object.values(VOICE_PROVIDERS_METADATA);
  
  for (const p of providers) {
    if (onlyConfigured && !VoiceProviderService.isProviderConfigured(p.id)) {
      continue;
    }

    for (const v of p.voices) {
      list.push({
        key: `${p.id}::${v.id}`,
        providerId: p.id,
        providerName: p.name,
        providerBadge: p.badge,
        voiceId: v.id,
        voiceName: v.name,
        lang: v.lang,
        gender: v.gender,
        qualityScore: v.qualityScore
      });
    }
  }
  return list;
}

/**
 * 3. Resuelve la voz activa y válida para una mascota específica.
 * Implementa resolución en cascada asegurando que el proveedor esté conectado.
 */
export function resolveMascotVoice(
  skinId: MascotSkinId,
  userDataMascot?: Record<string, any>
): MascotVoiceAssignment {
  const skin = MASCOT_SKINS[skinId] || MASCOT_SKINS.sparky;
  
  const localSkinVoice = typeof window !== 'undefined' ? localStorage.getItem(`goals_mascot_voice_${skinId}`) : null;

  // 1. Buscar asignación específica para este skin en el perfil o en localStorage
  const rawSkinAssigned = 
    userDataMascot?.assignedVoicesBySkin?.[skinId] ||
    userDataMascot?.skinVoices?.[skinId]?.voiceKey ||
    (typeof userDataMascot?.skinVoices?.[skinId] === 'string' ? userDataMascot?.skinVoices?.[skinId] : null) ||
    localSkinVoice;

  const configuredVoices = getAllAvailableVoicesList(true);

  if (rawSkinAssigned) {
    let targetProvider: string = '';
    let targetVoiceId: string = '';

    if (rawSkinAssigned.includes('::')) {
      const parts = rawSkinAssigned.split('::');
      targetProvider = parts[0];
      targetVoiceId = parts[1];
    } else {
      targetVoiceId = rawSkinAssigned;
    }

    if (targetProvider && VoiceProviderService.isProviderConfigured(targetProvider as VoiceProviderId)) {
      const match = configuredVoices.find((item) => item.providerId === targetProvider && item.voiceId === targetVoiceId);
      if (match) {
        return {
          providerId: match.providerId,
          voiceId: match.voiceId,
          voiceKey: match.key,
          voiceLabel: `${match.voiceName} (${match.providerName.split(' ')[0]})`
        };
      }
    } else if (!targetProvider) {
      const match = configuredVoices.find((item) => item.voiceId === targetVoiceId);
      if (match) {
        return {
          providerId: match.providerId,
          voiceId: match.voiceId,
          voiceKey: match.key,
          voiceLabel: `${match.voiceName} (${match.providerName.split(' ')[0]})`
        };
      }
    }
  }

  // 2. Si no hay voz explícita para este skin, usar el default individual del skin
  const defaultProvider = skin.defaultProvider || 'webspeech';
  const defaultVoice = skin.defaultVoice || 'webspeech_alvaro';

  if (VoiceProviderService.isProviderConfigured(defaultProvider)) {
    const meta = VOICE_PROVIDERS_METADATA[defaultProvider];
    const voiceObj = meta?.voices?.find((v) => v.id === defaultVoice) || meta?.voices?.[0];
    if (voiceObj) {
      return {
        providerId: defaultProvider,
        voiceId: voiceObj.id,
        voiceKey: `${defaultProvider}::${voiceObj.id}`,
        voiceLabel: `${voiceObj.name} (${meta.name.split(' ')[0]})`
      };
    }
  }

  // 3. Si el proveedor del skin no está activo, usar el primer proveedor activo
  const activeProvId = VoiceProviderService.getState().activeProviderId;
  if (VoiceProviderService.isProviderConfigured(activeProvId)) {
    const meta = VOICE_PROVIDERS_METADATA[activeProvId];
    const firstVoice = meta.voices[0];
    if (firstVoice) {
      return {
        providerId: activeProvId,
        voiceId: firstVoice.id,
        voiceKey: `${activeProvId}::${firstVoice.id}`,
        voiceLabel: `${firstVoice.name} (${meta.name.split(' ')[0]})`
      };
    }
  }

  // 4. WebSpeech nativo de respaldo en Español
  const webMeta = VOICE_PROVIDERS_METADATA.webspeech;
  return {
    providerId: 'webspeech',
    voiceId: 'webspeech_alvaro',
    voiceKey: 'webspeech::webspeech_alvaro',
    voiceLabel: `${webMeta.voices[0].name} (Nativo Español)`
  };
}
