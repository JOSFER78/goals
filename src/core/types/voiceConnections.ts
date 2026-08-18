/**
 * src/core/types/voiceConnections.ts
 * 
 * Tipos de datos para el Centro de Conexiones de Voz Agéntica (BYOK - Bring Your Own Key) en GOALS.
 */

export type VoiceProviderId = 
  | 'gemini_live'
  | 'deepgram'
  | 'openai_realtime'
  | 'cartesia'
  | 'groq_edge'
  | 'elevenlabs'
  | 'webspeech';

export type ConnectionStatus = 
  | 'idle' 
  | 'testing' 
  | 'connected' 
  | 'error' 
  | 'unauthorized' 
  | 'rate_limited' 
  | 'offline';

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  gender: 'male' | 'female' | 'neutral';
  tone: string;
  recommended?: boolean;
}

export interface VoiceProviderModel {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
}

export interface VoiceProviderMetadata {
  id: VoiceProviderId;
  name: string;
  brandColor: string;
  accentColor: string;
  badge: string;
  tagline: string;
  description: string;
  freeTierDesc: string;
  apiKeyUrl: string;
  requiresKey: boolean;
  isOfflineCapable: boolean;
  typicalLatencyMs: number;
  models: VoiceProviderModel[];
  voices: VoiceOption[];
  guideSteps: string[];
}

export interface VoiceProviderConfig {
  providerId: VoiceProviderId;
  apiKey: string;
  selectedModel: string;
  selectedVoice: string;
  customEndpoint?: string;
  temperature?: number;
  rate?: number;
  pitch?: number;
  lastTestedAt?: number;
  lastLatencyMs?: number;
  lastStatus?: ConnectionStatus;
  lastErrorMessage?: string;
}

export interface VoiceTestResult {
  providerId: VoiceProviderId;
  status: ConnectionStatus;
  latencyMs: number;
  message: string;
  timestamp: number;
}

export interface VoiceConnectionsState {
  activeProviderId: VoiceProviderId;
  enableSmartFallback: boolean;
  fallbackChain: VoiceProviderId[];
  providers: Record<VoiceProviderId, VoiceProviderConfig>;
}
