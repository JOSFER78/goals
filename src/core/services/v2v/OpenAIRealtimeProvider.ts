/**
 * src/core/services/v2v/OpenAIRealtimeProvider.ts
 * 
 * Adaptador para OpenAI Realtime API (WebSocket).
 * Modulación de voz en directo con modelos GPT-4o Realtime.
 */

import { IVoiceAgentProvider, VoiceSessionConfig } from './types';
import { VoiceProviderId } from '../../types/voiceConnections';

export class OpenAIRealtimeProvider implements IVoiceAgentProvider {
  public providerId: VoiceProviderId = 'openai_realtime';
  private ws: WebSocket | null = null;
  private audioCallback?: (pcmInt16: ArrayBuffer) => void;
  private transcriptCallback?: (text: string, isFinal: boolean, sender: 'user' | 'agent') => void;
  private interruptCallback?: () => void;
  private errorCallback?: (err: any) => void;

  async connect(config: VoiceSessionConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const model = config.model || 'gpt-4o-mini-realtime-preview';
        const url = `wss://api.openai.com/v1/realtime?model=${model}`;
        
        // Protocolos de autenticación para WebSocket en cliente
        const subprotocols = [
          'realtime',
          `openai-insecure-api-key.${config.apiKey}`,
          'openai-beta.realtime-v1'
        ];

        this.ws = new WebSocket(url, subprotocols);

        let timeout = setTimeout(() => {
          reject(new Error('Timeout al conectar con OpenAI Realtime API'));
        }, 10000);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          // Configuración de la sesión
          const sessionConfig = {
            type: 'session.update',
            session: {
              modalities: ['audio', 'text'],
              instructions: config.systemPrompt || 'Eres un tutor educativo amigable y didáctico en español.',
              voice: config.voice || 'ash',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 500
              }
            }
          };
          this.ws?.send(JSON.stringify(sessionConfig));
          resolve();
        };

        this.ws.onmessage = (event) => {
          if (typeof event.data === 'string') {
            try {
              const msg = JSON.parse(event.data);

              // Interrupción detectada por VAD de OpenAI
              if (msg.type === 'input_audio_buffer.speech_started') {
                this.interruptCallback?.();
              }

              // Delta de audio entrante
              if (msg.type === 'response.audio.delta' && msg.delta) {
                const rawBinary = atob(msg.delta);
                const bytes = new Uint8Array(rawBinary.length);
                for (let i = 0; i < rawBinary.length; i++) {
                  bytes[i] = rawBinary.charCodeAt(i);
                }
                this.audioCallback?.(bytes.buffer);
              }

              // Transcripción de respuesta
              if (msg.type === 'response.audio_transcript.delta' && msg.delta) {
                this.transcriptCallback?.(msg.delta, false, 'agent');
              }
            } catch (e) {
              console.warn('[OpenAIRealtimeProvider] Error procesando mensaje:', e);
            }
          }
        };

        this.ws.onerror = (err) => {
          clearTimeout(timeout);
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
      const bytes = new Uint8Array(pcmInt16);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      this.ws.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: base64
      }));
    }
  }

  interrupt(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'response.cancel'
      }));
    }
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
