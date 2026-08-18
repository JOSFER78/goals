import { useState, useEffect, useRef, useCallback } from 'react';
import { MascotSkinConfig, VisemeState } from '../types/mascot';
import { sanitizeTextForSpeech, normalizeChildVoiceIntent } from '../services/aiService';
import { speechVoiceService } from '../services/SpeechVoiceService';
import { universalVoiceEngine } from '../services/v2v/UniversalVoiceEngine';
import { unifiedTranscriptionService } from '../services/UnifiedTranscriptionService';
import { VoiceProviderService } from '../services/VoiceProviderService';
import { resolveMascotVoice } from '../config/mascotSkins';

export type CompanionVoiceMode = 'push_to_talk' | 'continuous_duplex' | 'v2v_realtime';
export type VoicePermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';
export type CompanionState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
export type VoiceActiveEngine = 'none' | 'stt_dictation' | 'v2v_live';
export type STTEngineType = 'groq_whisper' | 'deepgram_nova' | 'webspeech';

export interface UseLiveVoiceCompanionOptions {
  skinConfig: MascotSkinConfig;
  mode?: CompanionVoiceMode;
  silenceTimeoutMs?: number;
  autoSpeakResponse?: boolean;
  onTranscriptComplete?: (transcript: string) => Promise<string | void> | void;
  onStateChange?: (state: CompanionState) => void;
}

export const useLiveVoiceCompanion = ({
  skinConfig,
  mode = 'continuous_duplex',
  silenceTimeoutMs = 1400,
  autoSpeakResponse = true,
  onTranscriptComplete,
  onStateChange,
}: UseLiveVoiceCompanionOptions) => {
  const [companionState, setCompanionState] = useState<CompanionState>('idle');
  const [activeEngine, setActiveEngine] = useState<VoiceActiveEngine>('none');
  const [permissionState, setPermissionState] = useState<VoicePermissionState>('prompt');
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [lastResponseText, setLastResponseText] = useState('');
  const [sttEngineUsed, setSttEngineUsed] = useState<STTEngineType | null>(null);
  const [dictationDurationSec, setDictationDurationSec] = useState<number>(0);

  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(32));

  const [viseme, setViseme] = useState<VisemeState>({
    aperture: 0,
    width: 1,
    shape: 'rest',
    intensity: 0,
  });

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const micRafIdRef = useRef<number | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const silenceTimerRef = useRef<any>(null);
  const watchdogTimerRef = useRef<any>(null);
  const dictationIntervalRef = useRef<any>(null);
  const isListeningActiveRef = useRef<boolean>(false);
  const isExplicitlyStoppedRef = useRef<boolean>(false);
  const isDictatingRef = useRef<boolean>(false);
  const isV2VActiveRef = useRef<boolean>(false);
  const visemeDecayRafRef = useRef<number | null>(null);
  const hasDetectedSpeechInDictationRef = useRef<boolean>(false);

  const accumulatedDictationFinalRef = useRef<string>('');
  const accumulatedDictationInterimRef = useRef<string>('');

  const targetVisemeRef = useRef<VisemeState>({
    aperture: 0,
    width: 1,
    shape: 'rest',
    intensity: 0,
  });

  const updateCompanionState = useCallback((nextState: CompanionState) => {
    setCompanionState(nextState);
    if (onStateChange) onStateChange(nextState);
  }, [onStateChange]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          setPermissionState(permissionStatus.state as VoicePermissionState);
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state as VoicePermissionState);
          };
        })
        .catch(() => {});
    }

    return () => {
      stopAllNow();
    };
  }, []);

  useEffect(() => {
    const loop = () => {
      setViseme((prev) => {
        const target = targetVisemeRef.current;
        const lerpFactor = 0.20;
        const newAperture = prev.aperture + (target.aperture - prev.aperture) * lerpFactor;
        const newWidth = prev.width + (target.width - prev.width) * lerpFactor;
        const newIntensity = prev.intensity + (target.intensity - prev.intensity) * lerpFactor;

        if (targetVisemeRef.current.aperture > 0) {
          targetVisemeRef.current.aperture = Math.max(0, targetVisemeRef.current.aperture - 0.04);
        }

        return {
          aperture: Math.max(0, Math.min(1, newAperture)),
          width: Math.max(0.5, Math.min(1.5, newWidth)),
          shape: target.shape,
          intensity: Math.max(0, Math.min(1, newIntensity)),
          currentWord: target.currentWord,
        };
      });

      visemeDecayRafRef.current = requestAnimationFrame(loop);
    };

    visemeDecayRafRef.current = requestAnimationFrame(loop);
    return () => {
      if (visemeDecayRafRef.current) cancelAnimationFrame(visemeDecayRafRef.current);
    };
  }, []);

  const releaseMicHardware = useCallback(() => {
    if (micRafIdRef.current) {
      cancelAnimationFrame(micRafIdRef.current);
      micRafIdRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.enabled = false;
          track.stop();
        });
      } catch (e) {}
      mediaStreamRef.current = null;
    }
    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch (e) {}
      analyserRef.current = null;
    }
    setAudioLevel(0);
    setFrequencyData(new Uint8Array(32));
  }, []);

  const initAudioAnalyser = async (): Promise<MediaStream | null> => {
    try {
      if (mediaStreamRef.current && mediaStreamRef.current.active) {
        return mediaStreamRef.current;
      }

      releaseMicHardware();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const processAudioFrame = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const currentLvl = Math.min(1.0, (sum / bufferLength) / 128.0);
        setAudioLevel(currentLvl);
        setFrequencyData(new Uint8Array(dataArray));

        // VAD Inteligente en modo dictado
        if (isDictatingRef.current) {
          if (currentLvl > 0.05) {
            hasDetectedSpeechInDictationRef.current = true;
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          } else if (hasDetectedSpeechInDictationRef.current) {
            if (!silenceTimerRef.current) {
              silenceTimerRef.current = setTimeout(() => {
                if (isDictatingRef.current) stopDictation();
              }, silenceTimeoutMs);
            }
          }
        }

        micRafIdRef.current = requestAnimationFrame(processAudioFrame);
      };

      processAudioFrame();
      setPermissionState('granted');
      return stream;
    } catch (err: any) {
      console.warn('[useLiveVoiceCompanion] Error:', err);
      if (err.name === 'NotAllowedError') setPermissionState('denied');
      return null;
    }
  };

  const mapWordToViseme = (word: string) => {
    const clean = word.toLowerCase().trim();
    if (!clean) {
      targetVisemeRef.current = { aperture: 0, width: 1, shape: 'rest', intensity: 0 };
      return;
    }
    if (/[aá]/.test(clean)) targetVisemeRef.current = { aperture: 0.9, width: 1.0, shape: 'aa', intensity: 0.9, currentWord: word };
    else if (/[oó]/.test(clean)) targetVisemeRef.current = { aperture: 0.75, width: 0.75, shape: 'oh', intensity: 0.8, currentWord: word };
    else if (/[uú]/.test(clean)) targetVisemeRef.current = { aperture: 0.5, width: 0.6, shape: 'oo', intensity: 0.6, currentWord: word };
    else if (/[eéií]/.test(clean)) targetVisemeRef.current = { aperture: 0.6, width: 1.3, shape: 'ee', intensity: 0.7, currentWord: word };
    else if (/^[mbp]/.test(clean)) targetVisemeRef.current = { aperture: 0.05, width: 1.0, shape: 'rest', intensity: 0.1, currentWord: word };
    else targetVisemeRef.current = { aperture: 0.45, width: 1.0, shape: 'smile', intensity: 0.5, currentWord: word };
  };

  const speak = useCallback(async (text: string): Promise<void> => {
    if (isMuted) return;
    updateCompanionState('speaking');
    const cleanText = sanitizeTextForSpeech(text);
    if (!cleanText) { updateCompanionState('idle'); return; }

    const assigned = resolveMascotVoice(skinConfig.id);

    await speechVoiceService.speak(cleanText, {
      pitch: skinConfig.speechPitch,
      rate: skinConfig.speechRate * playbackSpeed,
      lang: 'es-ES',
      providerOverride: assigned.providerId as any,
      voiceOverride: assigned.voiceId,
      onStart: () => updateCompanionState('speaking'),
      onBoundary: (word) => mapWordToViseme(word),
      onEnd: () => {
        targetVisemeRef.current = { aperture: 0, width: 1, shape: 'rest', intensity: 0 };
        updateCompanionState(isV2VActiveRef.current ? 'listening' : 'idle');
      },
      onError: (err) => {
        targetVisemeRef.current = { aperture: 0, width: 1, shape: 'rest', intensity: 0 };
        updateCompanionState(isV2VActiveRef.current ? 'listening' : 'idle');
      }
    });
  }, [skinConfig, playbackSpeed, isMuted, updateCompanionState]);

  const speakFiller = useCallback(() => {
    const FILLERS = ['¡Oído! Dame un segundito...', '¡Te escucho! Pensando...', '¡Buena pregunta!', '¡Entendido!'];
    speak(FILLERS[Math.floor(Math.random() * FILLERS.length)]);
  }, [speak]);

  const stopAllNow = useCallback(() => {
    isExplicitlyStoppedRef.current = true;
    isListeningActiveRef.current = false;
    isDictatingRef.current = false;
    isV2VActiveRef.current = false;
    hasDetectedSpeechInDictationRef.current = false;

    // 1. Abortar reproducción TTS y motores V2V en 0ms
    try { if (synthRef.current) synthRef.current.cancel(); speechVoiceService.cancel(); } catch (e) {}
    try { universalVoiceEngine.handleBargeIn(); universalVoiceEngine.disconnect(); } catch (e) {}
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (e) {} recognitionRef.current = null; }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') { try { mediaRecorderRef.current.stop(); } catch (e) {} mediaRecorderRef.current = null; }

    // 2. Apagado físico inmediato de hardware de micrófono
    releaseMicHardware();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') { try { audioContextRef.current.suspend(); } catch (e) {} }

    // 3. Limpieza de temporizadores
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
    if (dictationIntervalRef.current) clearInterval(dictationIntervalRef.current);
    targetVisemeRef.current = { aperture: 0, width: 1, shape: 'rest', intensity: 0 };
    setViseme({ aperture: 0, width: 1, shape: 'rest', intensity: 0 });
    setActiveEngine('none');
    updateCompanionState('idle');
  }, [releaseMicHardware, updateCompanionState]);

  const startDictation = async () => {
    stopAllNow();
    isExplicitlyStoppedRef.current = false;
    isDictatingRef.current = true;
    hasDetectedSpeechInDictationRef.current = false;
    setActiveEngine('stt_dictation');
    setDictationDurationSec(0);
    accumulatedDictationFinalRef.current = '';
    accumulatedDictationInterimRef.current = '';
    const stream = await initAudioAnalyser();
    if (!stream) { updateCompanionState('error'); return; }
    try {
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.start(100);
      mediaRecorderRef.current = recorder;
    } catch (e) {}
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true; rec.interimResults = true;
      rec.onresult = (e: any) => {
        let final = '', interim = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        if (final.trim() || interim.trim()) {
          hasDetectedSpeechInDictationRef.current = true;
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (isDictatingRef.current) stopDictation();
          }, silenceTimeoutMs);
        }
        if (final.trim()) { 
          accumulatedDictationFinalRef.current += ' ' + final; 
          setFinalTranscript(accumulatedDictationFinalRef.current.trim()); 
        }
        setInterimTranscript(interim);
      };
      rec.start();
      recognitionRef.current = rec;
    }
    dictationIntervalRef.current = setInterval(() => setDictationDurationSec(p => p + 1), 1000);
    watchdogTimerRef.current = setTimeout(() => stopDictation(), 30000);
    updateCompanionState('listening');
  };

  const stopDictation = async (): Promise<string> => {
    if (!isDictatingRef.current) return '';
    isDictatingRef.current = false;
    isExplicitlyStoppedRef.current = true;
    hasDetectedSpeechInDictationRef.current = false;
    updateCompanionState('thinking');

    if (dictationIntervalRef.current) {
      clearInterval(dictationIntervalRef.current);
      dictationIntervalRef.current = null;
    }
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      recognitionRef.current = null;
    }

    let audioBlob: Blob | null = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      audioBlob = await new Promise((res) => {
        const rec = mediaRecorderRef.current!;
        rec.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            res(new Blob(audioChunksRef.current, { type: rec.mimeType || 'audio/webm' }));
          } else {
            res(null);
          }
        };
        try { rec.stop(); } catch { res(null); }
      });
    }

    // Apagado físico e inmediato de los tracks del micrófono
    releaseMicHardware();

    let text = '';
    let engine: STTEngineType = 'webspeech';

    if (audioBlob && audioBlob.size > 1000) {
      try {
        const res = await unifiedTranscriptionService.transcribeAudio(audioBlob);
        if (res.text && res.text.trim()) {
          text = res.text.trim();
          engine = res.providerUsed === 'groq_whisper' 
            ? 'groq_whisper' 
            : res.providerUsed === 'deepgram_nova2' 
            ? 'deepgram_nova' 
            : 'webspeech';
        }
      } catch (e) {
        console.warn('[useLiveVoiceCompanion] Error con UnifiedSTT:', e);
      }
    }

    if (!text) {
      const fallback = (accumulatedDictationFinalRef.current + ' ' + interimTranscript).trim();
      if (fallback) {
        try {
          text = await normalizeChildVoiceIntent(fallback);
        } catch {
          text = fallback;
        }
        engine = 'webspeech';
      }
    }

    setSttEngineUsed(engine);
    setFinalTranscript(text);
    setActiveEngine('none');

    if (text && onTranscriptComplete) {
      speakFiller();
      try {
        const aiResponse = await onTranscriptComplete(text);
        if (aiResponse && typeof aiResponse === 'string' && autoSpeakResponse) {
          setLastResponseText(aiResponse);
          await speak(aiResponse);
        }
      } catch (e) {
        console.error('[useLiveVoiceCompanion] Error procesando respuesta de IA:', e);
      }
    }

    updateCompanionState('idle');
    return text;
  };

  const startLiveV2V = async () => {
    stopAllNow();
    isExplicitlyStoppedRef.current = false;
    isV2VActiveRef.current = true;
    setActiveEngine('v2v_live');
    await initAudioAnalyser();

    const activeProv = VoiceProviderService.getState().activeProviderId;
    if (activeProv === 'webspeech') {
      startContinuousDuplexLocal();
      return;
    }

    try {
      await universalVoiceEngine.connect();
      universalVoiceEngine.onStateChange((s) => {
        if (isV2VActiveRef.current) updateCompanionState(s);
      });
      universalVoiceEngine.onTranscript((t, f, sender) => {
        if (sender === 'user') {
          f ? setFinalTranscript(t) : setInterimTranscript(t);
        } else if (sender === 'agent' && f) {
          setLastResponseText(t);
        }
      });
      updateCompanionState('listening');
    } catch (e) {
      console.warn('[useLiveVoiceCompanion] Fallback a Continuous Duplex:', e);
      startContinuousDuplexLocal();
    }
  };

  const startContinuousDuplexLocal = async () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setPermissionState('unsupported');
      updateCompanionState('error');
      return;
    }

    try {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'es-ES';

      rec.onstart = () => {
        isListeningActiveRef.current = true;
        updateCompanionState('listening');
      };

      rec.onresult = (e: any) => {
        let accumulatedFinal = '';
        let currentInterim = '';

        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) accumulatedFinal += e.results[i][0].transcript;
          else currentInterim += e.results[i][0].transcript;
        }

        if (accumulatedFinal.trim()) {
          setFinalTranscript((prev) => (prev ? `${prev} ${accumulatedFinal.trim()}` : accumulatedFinal.trim()));
        }
        setInterimTranscript(currentInterim.trim());

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        const currentFull = (accumulatedFinal || currentInterim).trim();
        if (currentFull.length > 2 && isV2VActiveRef.current) {
          silenceTimerRef.current = setTimeout(async () => {
            const queryToSend = accumulatedFinal.trim() || currentInterim.trim();
            if (queryToSend) {
              handleAutoDispatch(queryToSend);
            }
          }, silenceTimeoutMs);
        }
      };

      rec.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setPermissionState('denied');
          stopAllNow();
        }
      };

      rec.onend = () => {
        if (isV2VActiveRef.current && !isExplicitlyStoppedRef.current && companionState !== 'speaking' && companionState !== 'thinking') {
          try { rec.start(); } catch {}
        }
      };

      rec.start();
      recognitionRef.current = rec;
      updateCompanionState('listening');
    } catch (err) {
      console.error('[useLiveVoiceCompanion] Error starting Duplex fallback:', err);
      updateCompanionState('error');
    }
  };

  const handleAutoDispatch = async (transcript: string) => {
    if (!transcript.trim()) return;
    updateCompanionState('thinking');
    speakFiller();

    try {
      if (onTranscriptComplete) {
        const res = await onTranscriptComplete(transcript);
        if (res && typeof res === 'string' && autoSpeakResponse) {
          setLastResponseText(res);
          await speak(res);
        }
      }
    } catch (e) {
      console.error('[useLiveVoiceCompanion] Error en dispatch V2V:', e);
    } finally {
      setInterimTranscript('');
      setFinalTranscript('');
    }
    updateCompanionState('idle');
  };

  return {
    companionState, activeEngine, permissionState, isListening: companionState === 'listening',
    isSpeaking: companionState === 'speaking', isThinking: companionState === 'thinking',
    isDictating: isDictatingRef.current, isV2VActive: isV2VActiveRef.current, isMuted,
    audioLevel, frequencyData, viseme, interimTranscript, finalTranscript, lastResponseText,
    playbackSpeed, sttEngineUsed, dictationDurationSec, startDictation, stopDictation, 
    toggleDictation: () => isDictatingRef.current ? stopDictation() : startDictation(),
    startLiveV2V, stopLiveV2V: stopAllNow, toggleLiveV2V: () => isV2VActiveRef.current ? stopAllNow() : startLiveV2V(),
    stopAllNow, stopAll: stopAllNow, stopSpeaking: () => speechVoiceService.cancel(),
    speak, speakTTS: speak, speakFiller, toggleMute: () => setIsMuted(!isMuted), setPlaybackSpeed
  };
};
