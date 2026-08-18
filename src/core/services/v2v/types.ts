/**
 * src/core/services/v2v/types.ts
 * 
 * Interfaces comunes para los adaptadores de Voz a Voz Agéntica en Tiempo Real (Realtime V2V).
 */

import { VoiceProviderId } from '../../types/voiceConnections';

export interface VoiceSessionConfig {
  apiKey: string;
  systemPrompt: string;
  voice: string;
  model: string;
  sampleRate: 16000 | 24000;
  tools?: any[];
}

export interface IVoiceAgentProvider {
  providerId: VoiceProviderId;
  connect(config: VoiceSessionConfig): Promise<void>;
  sendAudioChunk(pcmInt16: ArrayBuffer): void;
  sendTextMessage?(text: string): void;
  interrupt(): void;
  disconnect(): Promise<void>;
  onAudioData(callback: (pcmInt16: ArrayBuffer) => void): void;
  onTranscript(callback: (text: string, isFinal: boolean, sender: 'user' | 'agent') => void): void;
  onInterrupted(callback: () => void): void;
  onError(callback: (err: any) => void): void;
}
