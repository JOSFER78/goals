import { sanitizeTextForSpeech } from '../../../core/services/aiService';
import { speechVoiceService } from '../../../core/services/SpeechVoiceService';

export class VoiceEngine {
  private static recognitionInstance: any = null;
  private static isCurrentlyListening: boolean = false;

  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public static isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  /**
   * Mapeo de idiomas a códigos BCP 47
   */
  public static getLangCode(lang: string): string {
    const l = lang.toLowerCase();
    if (l.includes('ing') || l.includes('eng')) return 'en-US';
    if (l.includes('fran') || l.includes('fre')) return 'fr-FR';
    if (l.includes('alem') || l.includes('ger') || l.includes('deu')) return 'de-DE';
    if (l.includes('jap') || l.includes('jp')) return 'ja-JP';
    if (l.includes('ital') || l.includes('ita')) return 'it-IT';
    if (l.includes('port') || l.includes('por')) return 'pt-PT';
    return 'en-US';
  }

  /**
   * Inicia el reconocimiento de voz en tiempo real
   */
  public static startListening(
    targetLanguage: string,
    onTranscript: (text: string, isFinal: boolean) => void,
    onError?: (error: any) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      if (onError) onError(new Error('Reconocimiento de voz no soportado en este navegador.'));
      return false;
    }

    try {
      this.stopListening();

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = this.getLangCode(targetLanguage);

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim()) {
          onTranscript(finalTranscript.trim(), true);
        } else if (interimTranscript.trim()) {
          onTranscript(interimTranscript.trim(), false);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (onError) onError(event);
      };

      recognition.onend = () => {
        this.isCurrentlyListening = false;
        if (onEnd) onEnd();
      };

      recognition.start();
      this.recognitionInstance = recognition;
      this.isCurrentlyListening = true;
      return true;
    } catch (err) {
      console.error('Error starting SpeechRecognition:', err);
      if (onError) onError(err);
      return false;
    }
  }

  public static stopListening(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch {}
      this.recognitionInstance = null;
    }
    this.isCurrentlyListening = false;
  }

  public static isListening(): boolean {
    return this.isCurrentlyListening;
  }

  /**
   * Obtiene la mejor voz neuronal disponible para el idioma seleccionado
   */
  public static getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
    return speechVoiceService.getBestVoiceForLanguage(langCode);
  }

  /**
   * Reproduce el texto mediante el servicio unificado SpeechVoiceService
   */
  public static speakText(
    text: string,
    targetLanguage: string,
    rate: number = 0.95,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    const langCode = this.getLangCode(targetLanguage);
    speechVoiceService.speak(text, {
      lang: langCode,
      rate,
      pitch: 1.0,
      onStart,
      onEnd,
      onError: onEnd
    });
  }

  public static stopSpeaking(): void {
    speechVoiceService.cancel();
  }
}
