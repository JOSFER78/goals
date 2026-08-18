/**
 * src/core/services/v2v/GeminiLiveProvider.ts
 * 
 * Adaptador para Gemini 2.0 Flash Multimodal Live (WebSocket Bidireccional).
 * Audio nativo en tiempo real a 24kHz con voces Puck (chico) / Charon (sabio).
 */

import { IVoiceAgentProvider, VoiceSessionConfig } from './types';
import { VoiceProviderId } from '../../types/voiceConnections';

export class GeminiLiveProvider implements IVoiceAgentProvider {
  public providerId: VoiceProviderId = 'gemini_live';
  private ws: WebSocket | null = null;
  private audioCallback?: (pcmInt16: ArrayBuffer) => void;
  private transcriptCallback?: (text: string, isFinal: boolean, sender: 'user' | 'agent') => void;
  private interruptCallback?: () => void;
  private errorCallback?: (err: any) => void;

  async connect(config: VoiceSessionConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${config.apiKey}`;
        this.ws = new WebSocket(url);

        let timeout = setTimeout(() => {
          reject(new Error('Timeout al conectar con Gemini Live WebSocket'));
        }, 10000);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          const setupMsg = {
            setup: {
              model: config.model || 'models/gemini-2.0-flash-exp',
              generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: config.voice || 'Puck'
                    }
                  }
                }
              },
              systemInstruction: {
                parts: [{ text: config.systemPrompt || 'Eres un tutor educativo dinámico y motivador en español.' }]
              }
            }
          };
          this.ws?.send(JSON.stringify(setupMsg));
          resolve();
        };

        this.ws.onmessage = (event) => {
          if (typeof event.data === 'string') {
            try {
              const msg = JSON.parse(event.data);
              
              // Detección de interrupción del servidor
              if (msg.serverContent?.interrupted) {
                this.interruptCallback?.();
              }

              // Procesamiento de partes de audio y texto
              const parts = msg.serverContent?.modelTurn?.parts;
              if (parts && Array.isArray(parts)) {
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    const rawBinary = atob(part.inlineData.data);
                    const bytes = new Uint8Array(rawBinary.length);
                    for (let i = 0; i < rawBinary.length; i++) {
                      bytes[i] = rawBinary.charCodeAt(i);
                    }
                    this.audioCallback?.(bytes.buffer);
                  }
                  if (part.text) {
                    this.transcriptCallback?.(part.text, false, 'agent');
                  }
                }
              }
            } catch (e) {
              console.warn('[GeminiLiveProvider] Error procesando paquete:', e);
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

      const msg = {
        realtimeInput: {
          mediaChunks: [
            {
              mimeType: 'audio/pcm;rate=16000',
              data: base64
            }
          ]
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendTextMessage(text: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        clientContent: {
          turns: [
            {
              role: 'user',
              parts: [{ text }]
            }
          ],
          turnComplete: true
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  interrupt(): void {
    // Si se interrumpe localmente, se envía señal de cancelación
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
