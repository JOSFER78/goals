import { useState, useEffect, useRef } from 'react';
import { MascotSkinConfig } from '../types/mascot';

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

    // Limpiar Markdown y etiquetas de HTML antes de enviar a voz
    const cleanText = text
      .replace(/[*_#`~[\]()]/g, '')
      .replace(/<[^>]*>/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
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

  return {
    speak,
    stop,
    isSpeaking,
    isMuted,
    toggleMute,
    playbackSpeed,
    setPlaybackSpeed
  };
};
