/**
 * src/core/services/v2v/DeepgramVoiceAgentProvider.ts
 * 
 * Adaptador para Deepgram Voice Agent API (wss://agent.deepgram.com/agent).
 * Integra Nova-2 STT + Groq/LLaMA + Deepgram Aura TTS en una única sesión WebSocket de ultra-baja latencia.
 */

import { IVoiceAgentProvider, VoiceSessionConfig } from './types';
import { VoiceProviderId } from '../../types/voiceConnections';

export class DeepgramVoiceAgentProvider implements IVoiceAgentProvider {
  public providerId: VoiceProviderId = 'deepgram';
  private ws: WebSocket | null = null;
  private audioCallback?: (pcmInt16: ArrayBuffer) => void;
  private transcriptCallback?: (text: string, isFinal: boolean, sender: 'user' | 'agent') => void;
  private interruptCallback?: () => void;
  private errorCallback?: (err: any) => void;

  async connect(config: VoiceSessionConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = 'wss://agent.deepgram.com/agent';
        this.ws = new WebSocket(url, ['token', config.apiKey]);
        this.ws.binaryType = 'arraybuffer';

        let connectionTimeout = setTimeout(() => {
          reject(new Error('Timeout al conectar con Deepgram Voice Agent'));
        }, 10000);

        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          const settings = {
            type: 'SettingsConfiguration',
            audio: {
              input: { encoding: 'linear16', sample_rate: config.sampleRate || 16000 },
              output: { encoding: 'linear16', sample_rate: 16000, container: 'none' }
            },
            agent: {
              listen: {
                model: config.model || 'nova-2'
              },
              think: {
                provider: { type: 'open_ai' },
                model: 'gpt-4o-mini',
                instructions: config.systemPrompt || 'Eres un tutor educativo didáctico y motivador en español para estudiantes. Responde siempre en español de forma concisa y amigable.'
              },
              speak: {
                model: config.voice || 'aura-orpheus-es'
              }
            }
          };
          this.ws?.send(JSON.stringify(settings));
          resolve();
        };

        this.ws.onmessage = (event) => {
          if (typeof event.data === 'string') {
            try {
              const msg = JSON.parse(event.data);
              if (msg.type === 'UserStartedSpeaking') {
                this.interruptCallback?.();
              } else if (msg.type === 'ConversationText') {
                this.transcriptCallback?.(
                  msg.content || '', 
                  true, 
                  msg.role === 'assistant' ? 'agent' : 'user'
                );
              }
            } catch (e) {
              console.warn('[DeepgramVoiceAgent] Error parseando mensaje:', e);
            }
          } else if (event.data instanceof ArrayBuffer) {
            this.audioCallback?.(event.data);
          }
        };

        this.ws.onerror = (err) => {
          clearTimeout(connectionTimeout);
          this.errorCallback?.(err);
          reject(err);
        };

        this.ws.onclose = () => {
          this.ws = null;
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  sendAudioChunk(pcmInt16: ArrayBuffer): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(pcmInt16);
    }
  }

  sendTextMessage(text: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'InjectAgentMessage',
        message: text
      }));
    }
  }

  interrupt(): void {
    // Deepgram gestiona el corte automáticamente al detectar actividad vocal en la entrada
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onAudioData(callback: (pcmInt16: ArrayBuffer) => void) { this.audioCallback = callback; }
  onTranscript(callback: (text: string, isFinal: boolean, sender: 'user' | 'agent') => void) { this.transcriptCallback = callback; }
  onInterrupted(callback: () => void) { this.interruptCallback = callback; }
  onError(callback: (err: any) => void) { this.errorCallback = callback; }
}
