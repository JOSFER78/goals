/**
 * src/core/services/v2v/UniversalVoiceEngine.ts
 * 
 * Motor Universal de Voz a Voz en Tiempo Real (<250ms).
 * Gestiona la captura con AudioWorklet (pcm-recorder-processor.js), la reproducción
 * sin jitter (pcm-player-processor.js), el cambio de proveedor en caliente (Hot-Swap)
 * y la purga instantánea en 0ms para interrupciones (Barge-in).
 */

import { IVoiceAgentProvider, VoiceSessionConfig } from './types';
import { VoiceProviderId } from '../../types/voiceConnections';
import { DeepgramVoiceAgentProvider } from './DeepgramVoiceAgentProvider';
import { GeminiLiveProvider } from './GeminiLiveProvider';
import { OpenAIRealtimeProvider } from './OpenAIRealtimeProvider';
import { VoiceProviderService } from '../VoiceProviderService';
import { speechVoiceService } from '../SpeechVoiceService';

export class UniversalVoiceEngine {
  private static instance: UniversalVoiceEngine | null = null;
  private audioCtx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private recorderNode: AudioWorkletNode | null = null;
  private playerNode: AudioWorkletNode | null = null;
  private currentProvider: IVoiceAgentProvider | null = null;
  private activeProviderId: VoiceProviderId = 'deepgram';
  private isConnected = false;

  private transcriptListeners: Set<(text: string, isFinal: boolean, sender: 'user' | 'agent') => void> = new Set();
  private audioLevelListeners: Set<(level: number) => void> = new Set();
  private stateListeners: Set<(state: 'idle' | 'listening' | 'speaking' | 'error') => void> = new Set();

  public static getInstance(): UniversalVoiceEngine {
    if (!UniversalVoiceEngine.instance) {
      UniversalVoiceEngine.instance = new UniversalVoiceEngine();
    }
    return UniversalVoiceEngine.instance;
  }

  /**
   * Inicializa el grafo Web Audio API y registra los procesadores AudioWorklet
   */
  public async initializeHardware(): Promise<void> {
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass({ sampleRate: 48000, latencyHint: 'interactive' });

      // Cargar módulos de AudioWorklet
      try {
        await this.audioCtx.audioWorklet.addModule('/pcm-recorder-processor.js');
        await this.audioCtx.audioWorklet.addModule('/pcm-player-processor.js');
      } catch (workletErr) {
        console.warn('[UniversalVoiceEngine] No se pudieron cargar AudioWorklets, usando fallback nativo:', workletErr);
      }

      this.playerNode = new AudioWorkletNode(this.audioCtx, 'pcm-player-processor');
      this.playerNode.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn('[UniversalVoiceEngine] Error inicializando AudioContext:', e);
    }
  }

  /**
   * Conecta el micrófono y comienza el streaming continuo
   */
  public async startMicrophone(): Promise<void> {
    await this.initializeHardware();
    if (!this.audioCtx) return;

    if (!this.micStream) {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        }
      });

      const micSource = this.audioCtx.createMediaStreamSource(this.micStream);
      this.recorderNode = new AudioWorkletNode(this.audioCtx, 'pcm-recorder-processor');

      micSource.connect(this.recorderNode);

      this.recorderNode.port.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer && this.currentProvider) {
          this.currentProvider.sendAudioChunk(event.data);
        }
      };
    }
  }

  /**
   * Conecta con el proveedor activo o realiza Hot-Swap
   */
  public async connect(overrideProviderId?: VoiceProviderId): Promise<void> {
    const operationalConfig = VoiceProviderService.resolveOperationalProvider();
    const targetProviderId = overrideProviderId || operationalConfig.providerId;

    // Si es Web Speech Nativo, delegamos a SpeechVoiceService
    if (targetProviderId === 'webspeech') {
      this.activeProviderId = 'webspeech';
      this.isConnected = true;
      this.notifyState('listening');
      return;
    }

    // Si ya estamos conectados al mismo proveedor, no duplicar
    if (this.currentProvider && this.activeProviderId === targetProviderId && this.isConnected) {
      return;
    }

    // Purgar sesión anterior
    await this.disconnect();
    await this.startMicrophone();

    let provider: IVoiceAgentProvider;
    switch (targetProviderId) {
      case 'deepgram':
        provider = new DeepgramVoiceAgentProvider();
        break;
      case 'gemini_live':
        provider = new GeminiLiveProvider();
        break;
      case 'openai_realtime':
        provider = new OpenAIRealtimeProvider();
        break;
      default:
        provider = new DeepgramVoiceAgentProvider();
    }

    provider.onAudioData((pcmInt16) => {
      this.notifyState('speaking');
      this.playerNode?.port.postMessage({ type: 'AUDIO', buffer: pcmInt16 }, [pcmInt16]);
    });

    provider.onTranscript((text, isFinal, sender) => {
      this.transcriptListeners.forEach((cb) => cb(text, isFinal, sender));
    });

    provider.onInterrupted(() => {
      this.handleBargeIn();
    });

    provider.onError((err) => {
      console.warn(`[UniversalVoiceEngine] Error en ${targetProviderId}:`, err);
      // Fallback suave
      this.notifyState('error');
    });

    const sessionConfig: VoiceSessionConfig = {
      apiKey: operationalConfig.apiKey,
      systemPrompt: 'Eres un tutor y acompañante educativo didáctico, alegre y motivador en GOALS. Responde siempre en español de forma concisa y natural.',
      voice: operationalConfig.selectedVoice,
      model: operationalConfig.selectedModel,
      sampleRate: 16000
    };

    await provider.connect(sessionConfig);
    this.currentProvider = provider;
    this.activeProviderId = targetProviderId;
    this.isConnected = true;
    this.notifyState('listening');
  }

  /**
   * Interrupción instantánea (Barge-in): purga el buffer de audio en 0ms
   */
  public handleBargeIn(): void {
    this.playerNode?.port.postMessage({ type: 'FLUSH' });
    speechVoiceService.cancel();
    if (this.currentProvider) {
      this.currentProvider.interrupt();
    }
    this.notifyState('listening');
  }

  /**
   * Envía texto directamente al agente conversacional
   */
  public sendTextMessage(text: string): void {
    if (this.currentProvider?.sendTextMessage) {
      this.currentProvider.sendTextMessage(text);
    }
  }

  /**
   * Desconecta la sesión activa y apaga físicamente el hardware del micrófono
   */
  public async disconnect(): Promise<void> {
    this.handleBargeIn();
    
    if (this.micStream) {
      try {
        this.micStream.getTracks().forEach((t) => {
          t.enabled = false;
          t.stop();
        });
      } catch (e) {}
      this.micStream = null;
    }

    if (this.recorderNode) {
      try {
        this.recorderNode.disconnect();
      } catch (e) {}
      this.recorderNode = null;
    }

    if (this.currentProvider) {
      try {
        await this.currentProvider.disconnect();
      } catch (e) {}
      this.currentProvider = null;
    }

    this.isConnected = false;
    this.notifyState('idle');
  }

  /**
   * Cierre total de hardware
   */
  public async shutdown(): Promise<void> {
    await this.disconnect();
    if (this.micStream) {
      try {
        this.micStream.getTracks().forEach((t) => {
          t.enabled = false;
          t.stop();
        });
      } catch (e) {}
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      await this.audioCtx.close();
      this.audioCtx = null;
    }
  }

  public getActiveProviderId(): VoiceProviderId {
    return this.activeProviderId;
  }

  public onTranscript(cb: (text: string, isFinal: boolean, sender: 'user' | 'agent') => void): () => void {
    this.transcriptListeners.add(cb);
    return () => this.transcriptListeners.delete(cb);
  }

  public onStateChange(cb: (state: 'idle' | 'listening' | 'speaking' | 'error') => void): () => void {
    this.stateListeners.add(cb);
    return () => this.stateListeners.delete(cb);
  }

  private notifyState(state: 'idle' | 'listening' | 'speaking' | 'error'): void {
    this.stateListeners.forEach((cb) => cb(state));
  }
}

export const universalVoiceEngine = UniversalVoiceEngine.getInstance();
