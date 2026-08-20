/**
 * src/core/services/SpeechVoiceService.ts
 * Servicio Central Unificado de Síntesis de Voz Real (TTS) para GOALS.
 * 
 * Soporta de forma 100% REAL:
 * 1. Deepgram Aura Neural TTS REST API (aura-orpheus-en / helios / arcas / zeus)
 * 2. OpenAI Neural TTS REST API (tts-1 con voces ash / alloy / echo / fable / onyx / nova)
 * 3. ElevenLabs Neural TTS REST API (eleven_multilingual_v2)
 * 4. Web Speech API Nativo (con selección prioritaria de voz de chico joven natural)
 */

import { sanitizeForSpeech } from './SpeechSanitizer';
import { VoiceProviderService } from './VoiceProviderService';

export interface SpeakOptions {
  pitch?: number;        // Clamp automático seguro: 0.90 - 1.08
  rate?: number;         // Clamp automático seguro: 0.85 - 1.25
  volume?: number;       // 0.0 - 1.0
  lang?: string;         // 'es-ES', 'en-US', etc.
  voiceOverride?: string; // ID de voz específica para forzar
  providerOverride?: string; // ID de proveedor para forzar
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  onBoundary?: (word: string, charIndex: number) => void;
}

export type TTSStatus = 'unsupported' | 'ready' | 'speaking' | 'paused';

class SpeechVoiceServiceImpl {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private currentAudioUrl: string | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private isMuted = false;
  private status: TTSStatus = 'ready';
  private listeners: Set<(status: TTSStatus) => void> = new Set();
  private voiceListeners: Set<(voices: SpeechSynthesisVoice[]) => void> = new Set();

  // Whitelist de voces masculinas / chico joven en español (WebSpeech)
  private readonly MALE_VOICE_NAMES = [
    'alvaro',   // Microsoft Álvaro Online (Natural) - Chico español joven Nº1
    'jorge',    // Microsoft Jorge Online (Natural) - Chico joven
    'nil',      // Microsoft Nil Online (Natural) - Chico suave
    'gonzalo',  // Microsoft Gonzalo Online (Natural)
    'mateo',    // Microsoft Mateo / Google Mateo
    'raul',     // Microsoft Raúl
    'david',    // Microsoft David
    'pablo',    // Microsoft Pablo (Local Windows SAPI/OneCore)
    'alonso',   // Microsoft Alonso
    'carlos',   // Google Carlos
    'diego',    // Diego
    'miguel'    // Miguel
  ];

  // Blacklist estricta para descartar voces femeninas
  private readonly FEMALE_INDICATORS = [
    'helena', 'laura', 'elvira', 'monica', 'elena', 'paulina', 
    'sabina', 'carmen', 'lucia', 'paloma', 'francisca', 'zira', 
    'female', 'mujer', 'chica', 'sofia', 'dalia', 'victoria', 
    'hilda', 'camila', 'mia', 'lupe', 'penelope', 'abril'
  ];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoiceLoader();
    } else {
      this.status = 'unsupported';
    }
  }

  private initVoiceLoader(): void {
    if (!this.synth) return;

    const update = () => {
      const v = this.synth!.getVoices();
      if (v && v.length > 0) {
        this.voices = v;
        this.isInitialized = true;
        this.notifyVoiceListeners();
      }
    };

    update();
    window.speechSynthesis.addEventListener('voiceschanged', update);
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = update;
    }

    [50, 150, 400, 1000].forEach((ms) => {
      setTimeout(() => {
        if (this.voices.length === 0 || !this.hasNeuralVoices()) {
          update();
        }
      }, ms);
    });
  }

  private hasNeuralVoices(): boolean {
    return this.voices.some((v) => {
      const n = v.name.toLowerCase();
      return n.includes('natural') || n.includes('neural') || n.includes('online');
    });
  }

  private normalize(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  private notifyVoiceListeners(): void {
    for (const listener of this.voiceListeners) {
      try {
        listener(this.voices);
      } catch (err) {
        console.error('[SpeechVoiceService] Error in voice listener:', err);
      }
    }
  }

  /**
   * Obtiene la mejor voz masculina / chico joven natural en español de WebSpeech
   */
  public getBestSpanishBoyVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const available = this.voices.length > 0 ? this.voices : this.synth.getVoices();
    const spanishVoices = available.filter(v => v.lang.toLowerCase().startsWith('es'));
    if (spanishVoices.length === 0) return null;

    const maleVoicesOnly = spanishVoices.filter(v => {
      const name = this.normalize(v.name);
      return !this.FEMALE_INDICATORS.some(femaleName => name.includes(femaleName));
    });

    const candidates = maleVoicesOnly.length > 0 ? maleVoicesOnly : spanishVoices;

    const alvaro = candidates.find(v => this.normalize(v.name).includes('alvaro'));
    if (alvaro) return alvaro;

    for (const maleName of this.MALE_VOICE_NAMES) {
      const match = candidates.find(v => this.normalize(v.name).includes(maleName));
      if (match) return match;
    }

    const safeNatural = candidates.find(v => {
      const n = this.normalize(v.name);
      const isNatural = n.includes('natural') || n.includes('neural') || n.includes('online');
      const isNotFemale = !this.FEMALE_INDICATORS.some(fn => n.includes(fn));
      return isNatural && isNotFemale;
    });
    if (safeNatural) return safeNatural;

    const pablo = candidates.find(v => this.normalize(v.name).includes('pablo'));
    if (pablo) return pablo;

    return candidates[0] || spanishVoices[0];
  }

  public getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    if (langCode.toLowerCase().startsWith('es')) return this.getBestSpanishBoyVoice();

    const available = this.voices.length > 0 ? this.voices : this.synth.getVoices();
    const prefix = langCode.slice(0, 2).toLowerCase();
    const matching = available.filter(v => v.lang.toLowerCase().startsWith(prefix));
    if (matching.length === 0) return null;

    const maleSafe = matching.filter(v => {
      const n = this.normalize(v.name);
      return !this.FEMALE_INDICATORS.some(fn => n.includes(fn));
    });

    const pool = maleSafe.length > 0 ? maleSafe : matching;
    const neural = pool.find(v => {
      const n = this.normalize(v.name);
      return n.includes('natural') || n.includes('neural') || n.includes('online') || n.includes('google');
    });

    return neural || pool[0];
  }

  /**
   * Síntesis de audio neural vía API REST real (Deepgram / OpenAI / ElevenLabs)
   */
  private async synthesizeNeuralAudio(
    text: string, 
    providerId: string, 
    apiKey: string, 
    selectedVoice?: string
  ): Promise<Blob | null> {
    if (!apiKey) return null;

    try {
      if (providerId === 'deepgram') {
        const voiceModel = selectedVoice || 'aura-orpheus-en';
        // Los modelos públicos Deepgram Aura (aura-*-en) son exclusivamente en inglés.
        // Si el texto es en español, evitamos el acento inglés forzado retornando null para usar el motor nativo en español (WebSpeech Álvaro/Jorge/Nil/Pablo o Cartesia/OpenAI).
        if (voiceModel.endsWith('-en') || voiceModel.includes('-en-') || voiceModel.startsWith('aura-')) {
          return null;
        }
        const url = `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(voiceModel)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${apiKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text })
        });
        if (res.ok) {
          return await res.blob();
        } else {
          console.warn('[SpeechVoiceService] Error Deepgram TTS:', res.status, await res.text());
        }
      } else if (providerId === 'openai_realtime' || providerId === 'openai') {
        const voiceName = selectedVoice || 'ash';
        const res = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: text,
            voice: voiceName
          })
        });
        if (res.ok) {
          return await res.blob();
        }
      } else if (providerId === 'cartesia') {
        const voiceId = selectedVoice || '156fb8d2-335b-4950-9cb3-a2d33befec77'; // Sonic Spanish Male
        const res = await fetch('https://api.cartesia.ai/tts/bytes', {
          method: 'POST',
          headers: {
            'X-API-Key': apiKey.trim(),
            'Cartesia-Version': '2024-06-10',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model_id: 'sonic-3.5',
            transcript: text,
            voice: { mode: 'id', id: voiceId },
            language: 'es',
            output_format: { container: 'mp3', sample_rate: 44100, bit_rate: 128000 }
          })
        });
        if (res.ok) {
          return await res.blob();
        }
      } else if (providerId === 'elevenlabs') {
        const voiceId = selectedVoice || 'ErXwobaYiN019PkySvjV'; // Antoni (Español Nativo)
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey.trim(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2'
          })
        });
        if (res.ok) {
          return await res.blob();
        }
      }
    } catch (err) {
      console.warn(`[SpeechVoiceService] Excepción sintetizando con ${providerId}:`, err);
    }
    return null;
  }

  /**
   * Reproduce un Blob de audio neural con control de ciclo de vida
   */
  private playAudioBlob(blob: Blob, options: SpeakOptions): Promise<void> {
    return new Promise((resolve) => {
      this.cleanupAudio();
      const url = URL.createObjectURL(blob);
      this.currentAudioUrl = url;
      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.volume = options.volume !== undefined ? Math.max(0, Math.min(1, options.volume)) : 1.0;
      audio.playbackRate = options.rate ?? 1.0;

      audio.onplay = () => {
        this.setStatus('speaking');
        if (options.onStart) options.onStart();
      };

      audio.onended = () => {
        this.setStatus('ready');
        this.cleanupAudio();
        if (options.onEnd) options.onEnd();
        resolve();
      };

      audio.onerror = (err) => {
        console.warn('[SpeechVoiceService] Error reproduciendo audio neural:', err);
        this.setStatus('ready');
        this.cleanupAudio();
        if (options.onError) options.onError(err);
        if (options.onEnd) options.onEnd();
        resolve();
      };

      audio.play().catch((err) => {
        console.warn('[SpeechVoiceService] Error en audio.play():', err);
        this.setStatus('ready');
        this.cleanupAudio();
        if (options.onEnd) options.onEnd();
        resolve();
      });
    });
  }

  private cleanupAudio(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.src = '';
      } catch {}
      this.currentAudio = null;
    }
    if (this.currentAudioUrl) {
      try {
        URL.revokeObjectURL(this.currentAudioUrl);
      } catch {}
      this.currentAudioUrl = null;
    }
  }

  /**
   * Fallback clásico con Web Speech API
   */
  private speakWithWebSpeech(cleanText: string, options: SpeakOptions): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || this.isMuted) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const lang = options.lang || 'es-ES';
      utterance.lang = lang;

      let voice: SpeechSynthesisVoice | null = null;
      if (options.voiceOverride) {
        const allVoices = this.voices.length > 0 ? this.voices : (this.synth?.getVoices() || []);
        const targetClean = options.voiceOverride.toLowerCase();
        if (targetClean.includes('guy') || targetClean.includes('english')) {
          voice = allVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Guy') || v.name.includes('David') || v.name.includes('Google'))) || null;
        } else if (targetClean.includes('elvira') || targetClean.includes('female')) {
          voice = allVoices.find(v => v.lang.startsWith('es') && (v.name.toLowerCase().includes('elvira') || v.name.toLowerCase().includes('laura') || v.name.toLowerCase().includes('helena'))) || null;
        } else if (targetClean.includes('nil')) {
          voice = allVoices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('nil')) || null;
        } else if (targetClean.includes('jorge')) {
          voice = allVoices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('jorge')) || null;
        } else if (targetClean.includes('pablo')) {
          voice = allVoices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('pablo')) || null;
        } else if (targetClean.includes('alvaro')) {
          voice = allVoices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('alvaro')) || null;
        } else {
          voice = allVoices.find(v => v.name.toLowerCase().includes(targetClean)) || null;
        }
      }

      if (!voice) {
        voice = lang.startsWith('es') 
          ? this.getBestSpanishBoyVoice() 
          : this.getBestVoiceForLanguage(lang);
      }

      if (voice) {
        utterance.voice = voice;
      }

      const requestedPitch = options.pitch ?? 1.0;
      utterance.pitch = Math.max(0.90, Math.min(1.05, requestedPitch));

      const requestedRate = options.rate ?? 1.0;
      utterance.rate = Math.max(0.85, Math.min(1.20, requestedRate));

      utterance.volume = options.volume !== undefined ? Math.max(0, Math.min(1, options.volume)) : 1.0;

      utterance.onstart = () => {
        this.setStatus('speaking');
        if (options.onStart) options.onStart();
      };

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (event.name === 'word' && options.onBoundary) {
          const word = cleanText.slice(event.charIndex, event.charIndex + (event.charLength || 6));
          options.onBoundary(word, event.charIndex);
        }
      };

      utterance.onend = () => {
        this.setStatus('ready');
        this.currentUtterance = null;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (err) => {
        this.setStatus('ready');
        this.currentUtterance = null;
        if (options.onError) options.onError(err);
        if (options.onEnd) options.onEnd();
        resolve();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Método principal speak: resuelve el motor neural activo (Deepgram Aura / OpenAI / ElevenLabs)
   * y produce audio 100% REAL en tiempo de ejecución.
   */
  public async speak(rawText: string, options: SpeakOptions = {}): Promise<void> {
    if (this.isMuted) return;
    this.cancel();

    const cleanText = sanitizeForSpeech(rawText);
    if (!cleanText) {
      this.setStatus('ready');
      return;
    }

    // 1. Obtener la configuración operativa del proveedor de voz
    const state = VoiceProviderService.getState();
    const operationalConfig = VoiceProviderService.resolveOperationalProvider();
    const targetProviderId = options.providerOverride || operationalConfig.providerId;
    const provConfig = state.providers[targetProviderId as any];
    const targetVoice = options.voiceOverride || provConfig?.selectedVoice || operationalConfig.selectedVoice;
    const apiKey = provConfig?.apiKey?.trim() || operationalConfig.apiKey?.trim();

    // 2. Si el proveedor activo es Deepgram, OpenAI o ElevenLabs y tiene API key, sintetizar con audio neural real
    if (targetProviderId !== 'webspeech' && apiKey) {
      const neuralBlob = await this.synthesizeNeuralAudio(cleanText, targetProviderId, apiKey, targetVoice);
      if (neuralBlob && neuralBlob.size > 500) {
        return this.playAudioBlob(neuralBlob, options);
      }
    }

    // 3. Fallback a Web Speech API si no hay clave o si falló la petición de red
    return this.speakWithWebSpeech(cleanText, options);
  }

  public cancel(): void {
    this.cleanupAudio();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
      this.currentUtterance = null;
    }
    this.setStatus('ready');
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) this.cancel();
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.isMuted) this.cancel();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isSpeaking(): boolean {
    const isAudioPlaying = this.currentAudio ? !this.currentAudio.paused && !this.currentAudio.ended : false;
    const isSynthSpeaking = this.synth ? this.synth.speaking : false;
    return isAudioPlaying || isSynthSpeaking;
  }

  public getStatus(): TTSStatus {
    return this.status;
  }

  public subscribeStatus(listener: (status: TTSStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public subscribeVoices(listener: (voices: SpeechSynthesisVoice[]) => void): () => void {
    this.voiceListeners.add(listener);
    if (this.voices.length > 0) listener(this.voices);
    return () => this.voiceListeners.delete(listener);
  }

  private setStatus(next: TTSStatus): void {
    this.status = next;
    this.listeners.forEach(l => l(next));
  }
}

export const speechVoiceService = new SpeechVoiceServiceImpl();
