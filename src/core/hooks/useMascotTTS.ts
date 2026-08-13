import { useState, useEffect, useRef } from 'react';
import { MascotSkinConfig } from '../types/mascot';
import { sanitizeTextForSpeech, getBestSpanishVoice } from '../services/aiService';

export const useMascotTTS = (skin: MascotSkinConfig) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current || isMuted) return;

    // Detener cualquier lectura previa
    synthRef.current.cancel();

    // Sanitización 100% libre de Markdown, URLs, corchetes y símbolos
    const cleanText = sanitizeTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';

    // Asignar voz neural/natural si está disponible
    const bestVoice = getBestSpanishVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.pitch = skin.speechPitch;
    utterance.rate = skin.speechRate * playbackSpeed;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleMute = () => {
    if (isSpeaking) stop();
    setIsMuted(!isMuted);
  };

  const FILLER_PHRASES = [
    "¡Oído! Dame un segundito...",
    "¡Te escucho! Pensando...",
    "¡Sí, claro! Déjame ver...",
    "¡Buena pregunta! Voy a ver..."
  ];

  const speakFiller = () => {
    if (!synthRef.current || isMuted) return;
    const randomFiller = FILLER_PHRASES[Math.floor(Math.random() * FILLER_PHRASES.length)];
    speak(randomFiller);
  };

  return {
    speak,
    speakFiller,
    stop,
    isSpeaking,
    isMuted,
    toggleMute,
    playbackSpeed,
    setPlaybackSpeed
  };
};
