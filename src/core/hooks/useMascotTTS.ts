import { useState, useCallback, useEffect } from 'react';
import { MascotSkinConfig } from '../types/mascot';
import { speechVoiceService } from '../services/SpeechVoiceService';

export const useMascotTTS = (skin: MascotSkinConfig) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(() => speechVoiceService.getMuted());
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  useEffect(() => {
    const unsub = speechVoiceService.subscribeStatus((status) => {
      setIsSpeaking(status === 'speaking');
    });
    return unsub;
  }, []);

  const speak = useCallback((text: string) => {
    if (isMuted) return;

    speechVoiceService.speak(text, {
      pitch: skin.speechPitch,
      rate: skin.speechRate * playbackSpeed,
      lang: 'es-ES',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  }, [isMuted, skin.speechPitch, skin.speechRate, playbackSpeed]);

  const stop = useCallback(() => {
    speechVoiceService.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = speechVoiceService.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const FILLER_PHRASES = [
    "¡Oído! Dame un segundito...",
    "¡Te escucho! Pensando...",
    "¡Sí, claro! Déjame ver...",
    "¡Buena pregunta! Voy a ver..."
  ];

  const speakFiller = useCallback(() => {
    const randomPhrase = FILLER_PHRASES[Math.floor(Math.random() * FILLER_PHRASES.length)];
    speak(randomPhrase);
  }, [speak]);

  return {
    isSpeaking,
    isMuted,
    playbackSpeed,
    setPlaybackSpeed,
    speak,
    stop,
    toggleMute,
    speakFiller,
  };
};
