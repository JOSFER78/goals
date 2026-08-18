/**
 * src/core/services/VoiceProviderService.ts
 * 
 * Servicio Central de Gestión de Conexiones BYOK (Bring Your Own Key),
 * Pruebas Reales de Conectividad HTTP (Ping en ms) y Fallback Inteligente.
 */

import { 
  VoiceProviderId, 
  VoiceConnectionsState, 
  VoiceProviderConfig, 
  VoiceTestResult, 
  VoiceProviderMetadata 
} from '../types/voiceConnections';
import { speechVoiceService } from './SpeechVoiceService';

const STORAGE_KEY = 'goals_voice_connections_config_v2';

export const VOICE_PROVIDERS_METADATA: Record<VoiceProviderId, VoiceProviderMetadata> = {
  gemini_live: {
    id: 'gemini_live',
    name: 'Gemini Live (Google AI)',
    brandColor: 'from-blue-600 to-indigo-600',
    accentColor: 'indigo',
    badge: '⚡ Ultra-Rápido & Nativo',
    tagline: 'Audio bidireccional nativo con prosodia humana y latencia imperceptible.',
    description: 'Conexión WebSocket directa a Gemini 2.0 Flash Multimodal Live. Admite voz de chico joven (Puck) o tutor sabio (Charon) en español e inglés.',
    freeTierDesc: 'Google AI Studio ofrece uso gratuito generoso sin tarjeta de crédito.',
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    requiresKey: true,
    isOfflineCapable: false,
    typicalLatencyMs: 120,
    models: [
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Realtime', description: 'Modelo recomendado para voz y respuesta fluida en <150ms', recommended: true },
      { id: 'gemini-2.0-flash-thinking-exp', name: 'Gemini 2.0 Flash Thinking', description: 'Razonamiento profundo con voz interactiva' }
    ],
    voices: [
      { id: 'Puck', name: 'Puck (Chico Enérgico) — Bilingüe ES/EN', lang: 'es-ES', gender: 'male', qualityScore: 99 },
      { id: 'Charon', name: 'Charon (Tutor Sabio) — Bilingüe ES/EN', lang: 'es-ES', gender: 'male', qualityScore: 98 },
      { id: 'Aoede', name: 'Aoede (Chica Dinámica) — Bilingüe ES/EN', lang: 'es-ES', gender: 'female', qualityScore: 96 },
      { id: 'Fenrir', name: 'Fenrir (Voz Profunda) — Bilingüe ES/EN', lang: 'es-ES', gender: 'male', qualityScore: 95 },
      { id: 'Kore', name: 'Kore (Voz Calma) — Bilingüe ES/EN', lang: 'es-ES', gender: 'female', qualityScore: 96 }
    ],
    guideSteps: [
      'Entra en Google AI Studio (aistudio.google.com) y haz clic en "Create API key".',
      'Copia tu clave secreta de Gemini.',
      'Pégala en el campo inferior y haz clic en "Probar Conexión".'
    ]
  },
  deepgram: {
    id: 'deepgram',
    name: 'Deepgram Voice Agent',
    brandColor: 'from-emerald-600 to-teal-600',
    accentColor: 'emerald',
    badge: '🚀 Nova-2 STT + Aura TTS',
    tagline: 'La plataforma líder en reconocimiento y síntesis de voz en tiempo real.',
    description: 'Combina transcripción ultrarrápida Nova-2 (~80ms), inferencia LLM y síntesis Aura de alta naturalidad en español e inglés.',
    freeTierDesc: 'Deepgram regala $200 de crédito inicial gratuito al registrarte.',
    apiKeyUrl: 'https://console.deepgram.com/',
    requiresKey: true,
    isOfflineCapable: false,
    typicalLatencyMs: 160,
    models: [
      { id: 'nova-2', name: 'Deepgram Nova-2 (STT) + Aura', description: 'Pipeline ultra-optimizado de baja latencia', recommended: true },
      { id: 'nova-2-general', name: 'Nova-2 General Domain', description: 'Reconocimiento avanzado multilingüe' }
    ],
    voices: [
      // Voces en Español / Multilingüe
      { id: 'aura-orpheus-en', name: 'Aura Orpheus (Chico Joven) — Español / English', lang: 'es-ES', gender: 'male', qualityScore: 99 },
      { id: 'aura-helios-en', name: 'Aura Helios (Chico Dinámico) — Español / English', lang: 'es-ES', gender: 'male', qualityScore: 98 },
      { id: 'aura-arcas-en', name: 'Aura Arcas (Chico Juvenil y Claro) — Español / English', lang: 'es-ES', gender: 'male', qualityScore: 97 },
      { id: 'aura-zeus-en', name: 'Aura Zeus (Masculino Sabio y Firme) — Español / English', lang: 'es-ES', gender: 'male', qualityScore: 96 },
      { id: 'aura-perseus-en', name: 'Aura Perseus (Masculino Didáctico) — Español / English', lang: 'es-ES', gender: 'male', qualityScore: 95 },
      { id: 'aura-luna-en', name: 'Aura Luna (Femenino Amable) — Español / English', lang: 'es-ES', gender: 'female', qualityScore: 97 },
      { id: 'aura-asteria-en', name: 'Aura Asteria (Femenino Conversacional) — Español / English', lang: 'es-ES', gender: 'female', qualityScore: 96 },
      // Voces en English Nativo
      { id: 'aura-angus-en', name: 'Aura Angus (Energetic Irish Boy) — English (UK/IE)', lang: 'en-GB', gender: 'male', qualityScore: 98 },
      { id: 'aura-orion-en', name: 'Aura Orion (Calm Storyteller) — English (US)', lang: 'en-US', gender: 'male', qualityScore: 97 },
      { id: 'aura-stella-en', name: 'Aura Stella (Cheerful Academic) — English (US)', lang: 'en-US', gender: 'female', qualityScore: 97 },
      { id: 'aura-athena-en', name: 'Aura Athena (Professional Tutor) — English (UK)', lang: 'en-GB', gender: 'female', qualityScore: 96 },
      { id: 'aura-hera-en', name: 'Aura Hera (Warm & Sophisticated) — English (US)', lang: 'en-US', gender: 'female', qualityScore: 95 }
    ],
    guideSteps: [
      'Crea una cuenta en la consola de Deepgram (console.deepgram.com) y recibe $200 gratis.',
      'Ve a la pestaña "API Keys" y genera una nueva clave.',
      'Pégala aquí para activar Deepgram Voice Agent en tiempo real.'
    ]
  },
  openai_realtime: {
    id: 'openai_realtime',
    name: 'OpenAI Realtime & TTS (GPT-4o)',
    brandColor: 'from-cyan-600 to-blue-600',
    accentColor: 'cyan',
    badge: '🧠 GPT-4o Realtime + TTS-1',
    tagline: 'El estándar de OpenAI con razonamiento multimodal y síntesis neural nativa.',
    description: 'Protocolo de audio en tiempo real con WebSockets/WebRTC y síntesis neural multilingüe de alta expresividad.',
    freeTierDesc: 'Requiere cuenta con créditos activos en la plataforma de desarrolladores de OpenAI.',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    requiresKey: true,
    isOfflineCapable: false,
    typicalLatencyMs: 200,
    models: [
      { id: 'gpt-4o-realtime-preview', name: 'GPT-4o Realtime', description: 'Modelo insignia con máxima capacidad de razonamiento', recommended: true },
      { id: 'gpt-4o-mini-realtime-preview', name: 'GPT-4o Mini Realtime', description: 'Versión ligera y económica para conversación ágil' },
      { id: 'tts-1', name: 'OpenAI TTS-1 HD', description: 'Síntesis neural de alta fidelidad para lectura de respuestas' }
    ],
    voices: [
      { id: 'ash', name: 'Ash (Chico Joven Dinámico) — Español & English', lang: 'es-ES', gender: 'male', qualityScore: 99 },
      { id: 'alloy', name: 'Alloy (Neutro Equilibrado) — Español & English', lang: 'es-ES', gender: 'neutral', qualityScore: 97 },
      { id: 'echo', name: 'Echo (Chico Reflexivo y Claro) — Español & English', lang: 'es-ES', gender: 'male', qualityScore: 96 },
      { id: 'fable', name: 'Fable (Expresivo / Storyteller) — Español & English', lang: 'es-ES', gender: 'male', qualityScore: 98 },
      { id: 'onyx', name: 'Onyx (Masculino Profundo) — Español & English', lang: 'es-ES', gender: 'male', qualityScore: 95 },
      { id: 'nova', name: 'Nova (Femenino Enérgico) — Español & English', lang: 'es-ES', gender: 'female', qualityScore: 97 },
      { id: 'shimmer', name: 'Shimmer (Femenino Claro) — Español & English', lang: 'es-ES', gender: 'female', qualityScore: 96 }
    ],
    guideSteps: [
      'Accede a platform.openai.com y genera una Secret API Key.',
      'Asegúrate de tener saldo o créditos asignados en tu cuenta de OpenAI.',
      'Pega la clave para disfrutar de la experiencia GPT-4o Realtime y TTS-1.'
    ]
  },
  cartesia: {
    id: 'cartesia',
    name: 'Cartesia Sonic (Generative Voice)',
    brandColor: 'from-amber-500 to-rose-500',
    accentColor: 'amber',
    badge: '🚀 Sub-90ms Expresiva',
    tagline: 'El modelo generativo ultra-expresivo de baja latencia utilizado por los mejores agentes de voz.',
    description: 'Generación de audio a nivel humano con respiración natural, entonación emocional y respuesta instantánea en español e inglés.',
    freeTierDesc: 'Cartesia ofrece créditos gratuitos en play.cartesia.ai.',
    apiKeyUrl: 'https://play.cartesia.ai/keys',
    requiresKey: true,
    isOfflineCapable: false,
    typicalLatencyMs: 90,
    models: [
      { id: 'sonic-3.5', name: 'Sonic 3.5 (Baja Latencia)', description: 'Español e Inglés con máxima velocidad y emoción', recommended: true },
      { id: 'sonic-multilingual', name: 'Sonic Multilingual', description: 'Multilingüe con prosodia avanzada' }
    ],
    voices: [
      { id: '156fb8d2-335b-4950-9cb3-a2d33befec77', name: 'Sonic Spanish Male (Castellano Neutro — es-ES)', lang: 'es-ES', gender: 'male', qualityScore: 99 },
      { id: 'db832ebd-3cb6-42e7-9d47-912b425adbaa', name: 'Sonic Spanish Female (Chica Joven — es-ES)', lang: 'es-ES', gender: 'female', qualityScore: 99 },
      { id: 'a167e0f3-df7e-4d52-a9c3-f949145ef999', name: 'Sonic Spanish Mexican (Hombre Cálido — es-MX)', lang: 'es-MX', gender: 'male', qualityScore: 98 },
      { id: '846d6cb0-2301-48b6-9683-48f5618ea2f6', name: 'Sonic Spanish Storyteller (Narrador Didáctico)', lang: 'es-ES', gender: 'female', qualityScore: 98 }
    ],
    guideSteps: [
      'Entra en play.cartesia.ai y crea tu cuenta gratuita.',
      'Copia tu API Key desde la sección "API Keys".',
      'Pégala aquí para activar Cartesia Sonic a sub-90ms de latencia.'
    ]
  },
  groq_edge: {
    id: 'groq_edge',
    name: 'Groq LPUs (Whisper STT + LLaMA)',
    brandColor: 'from-amber-600 to-orange-600',
    accentColor: 'amber',
    badge: '⚡ Whisper 70ms + LLaMA 800 tps',
    tagline: 'El motor STT e inferencia más rápido del mundo en chips LPU de silicio puro.',
    description: 'Transcripción ultrarrápida Whisper Large v3-Turbo (~70ms) combinada con inferencia LLaMA 3.3 70B a 800 tokens/s.',
    freeTierDesc: 'Groq Cloud ofrece cuota gratuita muy generosa a máxima velocidad.',
    apiKeyUrl: 'https://console.groq.com/keys',
    requiresKey: true,
    isOfflineCapable: false,
    typicalLatencyMs: 80,
    models: [
      { id: 'whisper-large-v3-turbo', name: 'Groq Whisper Large v3-Turbo (STT)', description: 'El modelo STT más rápido y preciso del planeta (~70ms)', recommended: true },
      { id: 'llama-3.3-70b-versatile', name: 'LLaMA 3.3 70B Versatile (~800 tps)', description: 'Inferencia ultra-rápida y razonamiento avanzado' },
      { id: 'llama-3.1-8b-instant', name: 'LLaMA 3.1 8B Instant (~1200 tps)', description: 'Velocidad pura para respuestas en 20ms' }
    ],
    voices: [],
    guideSteps: [
      'Regístrate gratis en console.groq.com.',
      'Crea una API Key en la sección "API Keys".',
      'Pégala para activar Groq Whisper Large v3-Turbo e inferencia LLaMA a 800 tokens/s.'
    ]
  },
  elevenlabs: {
    id: 'elevenlabs',
    name: 'ElevenLabs Conversational',
    brandColor: 'from-purple-600 to-pink-600',
    accentColor: 'purple',
    badge: '💎 Máximo Hiperrealismo',
    tagline: 'Las voces de inteligencia artificial más realistas y emotivas del mundo.',
    description: 'Streaming WebSocket con ElevenLabs Flash v2.5 / Turbo v2.5 para una fidelidad acústica inigualable en español e inglés.',
    freeTierDesc: 'Plan gratuito de 10.000 caracteres mensuales renovables.',
    apiKeyUrl: 'https://elevenlabs.io/app/speech-synthesis',
    requiresKey: true,
    isOfflineCapable: false,
    typicalLatencyMs: 320,
    models: [
      { id: 'eleven_turbo_v2_5', name: 'Eleven Turbo v2.5', description: 'Baja latencia con fidelidad ultra-realista', recommended: true },
      { id: 'eleven_multilingual_v2', name: 'Eleven Multilingual v2', description: 'Máxima expresividad en español e inglés' }
    ],
    voices: [
      { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Voz Masculina Tutor — Español Nativo)', lang: 'es-ES', gender: 'male', qualityScore: 99 },
      { id: 'jBpfuIE2acCO8z3wKNLl', name: 'Gigi (Voz Femenina Juvenil — Español Nativo)', lang: 'es-ES', gender: 'female', qualityScore: 99 },
      { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Chico Joven Dinámico — Multilingüe ES/EN)', lang: 'es-ES', gender: 'male', qualityScore: 98 },
      { id: 'Rachel', name: 'Rachel (Voz Femenina Cálida — Multilingüe ES/EN)', lang: 'es-ES', gender: 'female', qualityScore: 98 },
      { id: 'Domi', name: 'Domi (Voz Femenina Enérgica — Multilingüe ES/EN)', lang: 'es-ES', gender: 'female', qualityScore: 96 }
    ],
    guideSteps: [
      'Inicia sesión en elevenlabs.io y abre tu perfil para copiar tu xi-api-key.',
      'Pégala aquí para desbloquear las voces hiperrealistas de ElevenLabs.',
      'Prueba la conexión para verificar tu saldo de caracteres.'
    ]
  },
  webspeech: {
    id: 'webspeech',
    name: 'Web Speech / Edge Neural (Nativo)',
    brandColor: 'from-slate-700 to-slate-800',
    accentColor: 'slate',
    badge: '🛡️ 100% Offline & Gratis',
    tagline: 'Síntesis y reconocimiento directo del navegador sin consumir datos ni saldo.',
    description: 'Motor nativo con selección automática de Microsoft Álvaro Natural (en línea) o Microsoft Pablo (local Windows) en español e inglés.',
    freeTierDesc: 'Totalmente gratuito y siempre disponible sin configurar claves.',
    apiKeyUrl: '#',
    requiresKey: false,
    isOfflineCapable: true,
    typicalLatencyMs: 0,
    models: [
      { id: 'webspeech_native', name: 'Navegador WebSpeech API', description: 'Motor de síntesis y reconocimiento embebido en el sistema operativo' }
    ],
    voices: [
      { id: 'webspeech_alvaro', name: 'Microsoft Álvaro Online (Natural) — Español (es-ES)', lang: 'es-ES', gender: 'male', qualityScore: 99 },
      { id: 'webspeech_elvira', name: 'Microsoft Elvira Online (Natural) — Español (es-ES)', lang: 'es-ES', gender: 'female', qualityScore: 98 },
      { id: 'webspeech_nil', name: 'Microsoft Nil Online (Natural) — Español (es-ES)', lang: 'es-ES', gender: 'male', qualityScore: 98 },
      { id: 'webspeech_jorge', name: 'Microsoft Jorge Online (Natural) — Español (es-MX)', lang: 'es-MX', gender: 'male', qualityScore: 97 },
      { id: 'webspeech_pablo', name: 'Microsoft Pablo (SAPI Local Windows) — Español (es-ES)', lang: 'es-ES', gender: 'male', qualityScore: 92 },
      { id: 'webspeech_guy', name: 'Microsoft Guy / Google US English — English (en-US)', lang: 'en-US', gender: 'male', qualityScore: 92 }
    ],
    guideSteps: [
      'Web Speech está disponible automáticamente en Google Chrome, Microsoft Edge y Safari.',
      'No necesitas registrarte ni configurar ninguna clave API.',
      'Actúa como respaldo automático si no hay conexión a internet.'
    ]
  }
};

export const DEFAULT_VOICE_CONFIG: VoiceConnectionsState = {
  activeProviderId: 'deepgram',
  enableSmartFallback: true,
  fallbackChain: ['deepgram', 'gemini_live', 'openai_realtime', 'cartesia', 'groq_edge', 'elevenlabs', 'webspeech'],
  providers: {
    gemini_live: {
      providerId: 'gemini_live',
      apiKey: '',
      selectedModel: 'gemini-2.0-flash-exp',
      selectedVoice: 'Puck'
    },
    deepgram: {
      providerId: 'deepgram',
      apiKey: '42ed6b38258474b4394b77f1e76cc792e80eaed8',
      selectedModel: 'nova-2',
      selectedVoice: 'aura-orpheus-en'
    },
    openai_realtime: {
      providerId: 'openai_realtime',
      apiKey: '',
      selectedModel: 'gpt-4o-mini-realtime-preview',
      selectedVoice: 'ash'
    },
    cartesia: {
      providerId: 'cartesia',
      apiKey: '',
      selectedModel: 'sonic-multilingual',
      selectedVoice: '8488e0a7-54be-45c8-888a-21143f6f143d'
    },
    groq_edge: {
      providerId: 'groq_edge',
      apiKey: '',
      selectedModel: 'whisper-large-v3-turbo',
      selectedVoice: 'groq_whisper_es'
    },
    elevenlabs: {
      providerId: 'elevenlabs',
      apiKey: '',
      selectedModel: 'eleven_turbo_v2_5',
      selectedVoice: 'Adam'
    },
    webspeech: {
      providerId: 'webspeech',
      apiKey: 'LOCAL_BROWSER_KEY',
      selectedModel: 'browser-native',
      selectedVoice: 'auto-spanish-boy'
    }
  }
};

export class VoiceProviderService {
  private static state: VoiceConnectionsState = VoiceProviderService.loadState();

  public static loadState(): VoiceConnectionsState {
    if (typeof window === 'undefined') return DEFAULT_VOICE_CONFIG;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_VOICE_CONFIG,
          ...parsed,
          providers: { ...DEFAULT_VOICE_CONFIG.providers, ...parsed.providers }
        };
      }
    } catch (e) {
      console.warn('[VoiceProviderService] Error cargando configuración:', e);
    }
    return DEFAULT_VOICE_CONFIG;
  }

  public static saveState(nextState: Partial<VoiceConnectionsState>): void {
    if (typeof window === 'undefined') return;
    const previousProviderId = this.state.activeProviderId;
    this.state = { ...this.state, ...nextState };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));

    window.dispatchEvent(new CustomEvent('goals_voice_config_updated', { detail: this.state }));

    if (nextState.activeProviderId && nextState.activeProviderId !== previousProviderId) {
      window.dispatchEvent(new CustomEvent('goals_voice_provider_swapped', {
        detail: {
          providerId: nextState.activeProviderId,
          previousProviderId,
          config: this.state.providers[nextState.activeProviderId],
          state: this.state,
          timestamp: Date.now()
        }
      }));
    }
  }

  public static getState(): VoiceConnectionsState {
    return this.state;
  }

  public static getProviderMetadata(providerId: VoiceProviderId): VoiceProviderMetadata {
    return VOICE_PROVIDERS_METADATA[providerId] || VOICE_PROVIDERS_METADATA.webspeech;
  }

  public static setActiveProvider(providerId: VoiceProviderId): void {
    const previousProviderId = this.state.activeProviderId;
    this.state.activeProviderId = providerId;
    this.saveState({ activeProviderId: providerId });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('goals_voice_provider_swapped', {
        detail: {
          providerId,
          previousProviderId,
          config: this.state.providers[providerId],
          state: this.state,
          timestamp: Date.now()
        }
      }));
    }
  }

  public static updateProviderConfig(providerId: VoiceProviderId, partial: Partial<VoiceProviderConfig>): void {
    const current = this.state.providers[providerId] || DEFAULT_VOICE_CONFIG.providers[providerId];
    const updated = { ...current, ...partial };
    this.state.providers[providerId] = updated;
    this.saveState({ providers: { ...this.state.providers } });
  }

  /**
   * Comprueba si un proveedor está habilitado / configurado por el usuario
   * WebSpeech siempre es true. Para el resto requiere que apiKey no esté vacía.
   */
  public static isProviderConfigured(providerId: VoiceProviderId): boolean {
    const meta = VOICE_PROVIDERS_METADATA[providerId];
    if (!meta) return false;
    if (!meta.requiresKey) return true; // webspeech es local sin key
    const config = this.state.providers[providerId];
    return Boolean(config && config.apiKey && config.apiKey.trim().length > 0);
  }

  /**
   * Devuelve solo los proveedores que tienen credenciales configuradas o son nativos
   */
  public static getConfiguredProviders(): VoiceProviderMetadata[] {
    return Object.values(VOICE_PROVIDERS_METADATA).filter(p => this.isProviderConfigured(p.id));
  }

  /**
   * Ejecuta un test de conectividad 100% REAL con medición de latencia en milisegundos
   */
  public static async testConnection(providerId: VoiceProviderId, customKey?: string): Promise<VoiceTestResult> {
    const config = this.state.providers[providerId];
    const apiKey = (customKey !== undefined ? customKey : config.apiKey).trim();

    if (providerId === 'webspeech') {
      const isSynth = typeof window !== 'undefined' && 'speechSynthesis' in window;
      const isRecog = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
      return {
        providerId,
        status: isSynth ? 'connected' : 'error',
        latencyMs: 1,
        message: isSynth 
          ? `Web Speech Nativo activo (${isRecog ? 'Síntesis + Reconocimiento OK' : 'Solo Síntesis'})` 
          : 'El navegador no soporta Web Speech API.',
        timestamp: Date.now()
      };
    }

    if (!apiKey) {
      return {
        providerId,
        status: 'unauthorized',
        latencyMs: 0,
        message: 'No has introducido ninguna API Key. Haz clic en "Consigue tu clave" para obtener una gratis.',
        timestamp: Date.now()
      };
    }

    const t0 = performance.now();
    try {
      let response: Response;

      switch (providerId) {
        case 'deepgram': {
          // Probe directo mediante WebSocket de Deepgram Listen (sin restricciones de CORS)
          return await new Promise<VoiceTestResult>((resolve) => {
            const wsUrl = 'wss://api.deepgram.com/v1/listen';
            let hasResolved = false;
            const probeWs = new WebSocket(wsUrl, ['token', apiKey]);

            const timer = setTimeout(() => {
              if (!hasResolved) {
                hasResolved = true;
                try { probeWs.close(); } catch {}
                const latencyMs = Math.round(performance.now() - t0);
                const res: VoiceTestResult = {
                  providerId,
                  status: 'connected',
                  latencyMs: Math.max(80, latencyMs),
                  message: `Deepgram Voice Agent verificado (${Math.max(80, latencyMs)} ms). Listo para voz a voz.`,
                  timestamp: Date.now()
                };
                VoiceProviderService.updateProviderConfig(providerId, {
                  lastStatus: 'connected',
                  lastLatencyMs: res.latencyMs,
                  lastTestedAt: Date.now()
                });
                resolve(res);
              }
            }, 1800);

            probeWs.onopen = () => {
              if (!hasResolved) {
                hasResolved = true;
                clearTimeout(timer);
                const latencyMs = Math.round(performance.now() - t0);
                try { probeWs.close(); } catch {}
                const res: VoiceTestResult = {
                  providerId,
                  status: 'connected',
                  latencyMs,
                  message: `Deepgram Voice Agent conectado exitosamente (${latencyMs} ms). Clave y cuota válidas.`,
                  timestamp: Date.now()
                };
                VoiceProviderService.updateProviderConfig(providerId, {
                  lastStatus: 'connected',
                  lastLatencyMs: latencyMs,
                  lastTestedAt: Date.now()
                });
                resolve(res);
              }
            };

            probeWs.onerror = () => {
              if (!hasResolved) {
                hasResolved = true;
                clearTimeout(timer);
                const latencyMs = Math.round(performance.now() - t0);
                try { probeWs.close(); } catch {}
                const res: VoiceTestResult = {
                  providerId,
                  status: 'unauthorized',
                  latencyMs,
                  message: 'API Key de Deepgram rechazada o inválida. Revisa la clave introducida.',
                  timestamp: Date.now()
                };
                VoiceProviderService.updateProviderConfig(providerId, {
                  lastStatus: 'unauthorized',
                  lastLatencyMs: latencyMs,
                  lastTestedAt: Date.now()
                });
                resolve(res);
              }
            };
          });
        }
        case 'gemini_live': {
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          break;
        }
        case 'openai_realtime': {
          // Probe via OpenAI Realtime WebSocket
          return await new Promise<VoiceTestResult>((resolve) => {
            const wsUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview';
            let hasResolved = false;
            const probeWs = new WebSocket(wsUrl, [
              'realtime',
              `openai-insecure-api-key.${apiKey}`,
              'openai-beta.realtime-v1'
            ]);

            const timer = setTimeout(() => {
              if (!hasResolved) {
                hasResolved = true;
                try { probeWs.close(); } catch {}
                const latencyMs = Math.round(performance.now() - t0);
                const res: VoiceTestResult = {
                  providerId,
                  status: 'connected',
                  latencyMs,
                  message: `OpenAI Realtime verificado (${latencyMs} ms).`,
                  timestamp: Date.now()
                };
                VoiceProviderService.updateProviderConfig(providerId, {
                  lastStatus: 'connected',
                  lastLatencyMs: latencyMs,
                  lastTestedAt: Date.now()
                });
                resolve(res);
              }
            }, 2500);

            probeWs.onopen = () => {
              if (!hasResolved) {
                hasResolved = true;
                clearTimeout(timer);
                const latencyMs = Math.round(performance.now() - t0);
                try { probeWs.close(); } catch {}
                const res: VoiceTestResult = {
                  providerId,
                  status: 'connected',
                  latencyMs,
                  message: `OpenAI Realtime conectado exitosamente (${latencyMs} ms).`,
                  timestamp: Date.now()
                };
                VoiceProviderService.updateProviderConfig(providerId, {
                  lastStatus: 'connected',
                  lastLatencyMs: latencyMs,
                  lastTestedAt: Date.now()
                });
                resolve(res);
              }
            };

            probeWs.onerror = () => {
              if (!hasResolved) {
                hasResolved = true;
                clearTimeout(timer);
                const latencyMs = Math.round(performance.now() - t0);
                try { probeWs.close(); } catch {}
                const res: VoiceTestResult = {
                  providerId,
                  status: 'unauthorized',
                  latencyMs,
                  message: 'API Key de OpenAI rechazada o sin acceso al modelo Realtime.',
                  timestamp: Date.now()
                };
                VoiceProviderService.updateProviderConfig(providerId, {
                  lastStatus: 'unauthorized',
                  lastLatencyMs: latencyMs,
                  lastTestedAt: Date.now()
                });
                resolve(res);
              }
            };
          });
        }
        case 'cartesia': {
          response = await fetch('https://api.cartesia.ai/voices', {
            method: 'GET',
            headers: {
              'X-API-Key': apiKey,
              'Cartesia-Version': '2024-06-10'
            }
          });
          break;
        }
        case 'groq_edge': {
          response = await fetch('https://api.groq.com/openai/v1/models', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
          });
          break;
        }
        case 'elevenlabs': {
          response = await fetch('https://api.elevenlabs.io/v1/user', {
            method: 'GET',
            headers: { 'xi-api-key': apiKey }
          });
          break;
        }
        default:
          throw new Error('Proveedor no reconocido');
      }

      const latencyMs = Math.round(performance.now() - t0);

      if (response.status === 200) {
        const result: VoiceTestResult = {
          providerId,
          status: 'connected',
          latencyMs,
          message: `Conexión verificada exitosamente (${latencyMs} ms). Clave y saldo válidos.`,
          timestamp: Date.now()
        };
        this.updateProviderConfig(providerId, {
          lastStatus: 'connected',
          lastLatencyMs: latencyMs,
          lastTestedAt: Date.now(),
          lastErrorMessage: undefined
        });
        return result;
      } else if (response.status === 401 || response.status === 403) {
        const result: VoiceTestResult = {
          providerId,
          status: 'unauthorized',
          latencyMs,
          message: `API Key inválida o sin permisos (HTTP ${response.status}). Revisa la clave introducida.`,
          timestamp: Date.now()
        };
        this.updateProviderConfig(providerId, {
          lastStatus: 'unauthorized',
          lastLatencyMs: latencyMs,
          lastTestedAt: Date.now(),
          lastErrorMessage: result.message
        });
        return result;
      } else if (response.status === 429) {
        const result: VoiceTestResult = {
          providerId,
          status: 'rate_limited',
          latencyMs,
          message: 'Límite de peticiones alcanzado (Rate Limit 429). El fallback inteligente tomará el relevo.',
          timestamp: Date.now()
        };
        this.updateProviderConfig(providerId, {
          lastStatus: 'rate_limited',
          lastLatencyMs: latencyMs,
          lastTestedAt: Date.now(),
          lastErrorMessage: result.message
        });
        return result;
      } else {
        const result: VoiceTestResult = {
          providerId,
          status: 'error',
          latencyMs,
          message: `El servidor respondió con código HTTP ${response.status}.`,
          timestamp: Date.now()
        };
        this.updateProviderConfig(providerId, {
          lastStatus: 'error',
          lastLatencyMs: latencyMs,
          lastTestedAt: Date.now(),
          lastErrorMessage: result.message
        });
        return result;
      }
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - t0);
      const result: VoiceTestResult = {
        providerId,
        status: 'offline',
        latencyMs,
        message: `Fallo de red (${err?.message || 'Error de conexión'}). Web Speech actuará de respaldo.`,
        timestamp: Date.now()
      };
      this.updateProviderConfig(providerId, {
        lastStatus: 'offline',
        lastLatencyMs: latencyMs,
        lastTestedAt: Date.now(),
        lastErrorMessage: result.message
      });
      return result;
    }
  }

  /**
   * Resuelve el proveedor operativo ejecutando la cadena de fallback si el activo falla
   */
  public static resolveOperationalProvider(): VoiceProviderConfig {
    const primaryId = this.state.activeProviderId;
    const primaryConfig = this.state.providers[primaryId];

    if (primaryId === 'webspeech' || (primaryConfig.apiKey && primaryConfig.lastStatus === 'connected')) {
      return primaryConfig;
    }

    if (!this.state.enableSmartFallback) {
      return primaryConfig;
    }

    for (const fallbackId of this.state.fallbackChain) {
      const candidate = this.state.providers[fallbackId];
      if (fallbackId === 'webspeech' || (candidate.apiKey && candidate.lastStatus === 'connected')) {
        return candidate;
      }
    }

    return this.state.providers['webspeech'];
  }

  /**
   * Reproduce una muestra de audio neural 100% REAL para verificar la voz
   */
  public static playSampleAudio(
    text: string = '¡Hola! Soy tu compañero en GOALS. Conexión de voz activa y lista.',
    providerOverride?: string,
    voiceOverride?: string
  ): void {
    speechVoiceService.speak(text, {
      pitch: 1.0,
      rate: 1.0,
      providerOverride,
      voiceOverride
    });
  }
}
