/**
 * Servicio de Integración de Voz a Voz Agéntico (Gemini Live WebSocket & Tool Calling)
 * Conecta mediante WebSockets con la API Gemini Live para audio bidireccional y ejecución de herramientas en vivo.
 */

export interface GeminiLiveToolDeclaration {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface GeminiLiveConfig {
  apiKey?: string;
  model?: string;
  systemInstruction?: string;
  tools?: GeminiLiveToolDeclaration[];
}

export class GeminiLiveSession {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private isConnected: boolean = false;
  private onToolCallHandler?: (name: string, args: any) => void;
  private onTextChunkHandler?: (text: string) => void;

  constructor(private config: GeminiLiveConfig) {}

  /**
   * Herramientas Agénticas por Defecto de GOALS (Infografías, Tests, Diapositivas, Pronunciación)
   */
  public static getDefaultTools(): GeminiLiveToolDeclaration[] {
    return [
      {
        name: 'generate_infographic',
        description: 'Genera y renderiza una infografía dinámica SVG/Canvas en pantalla según los datos expuestos.',
        parameters: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING', description: 'Título de la infografía' },
            data_points: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Puntos clave o datos a visualizar' },
            chart_type: { type: 'STRING', enum: ['bar', 'pie', 'flowchart', 'timeline'], description: 'Tipo de gráfico' }
          },
          required: ['title', 'data_points']
        }
      },
      {
        name: 'create_quiz_test',
        description: 'Genera un test didáctico interactivo de 5 preguntas sobre el tema activo.',
        parameters: {
          type: 'OBJECT',
          properties: {
            topic: { type: 'STRING', description: 'Tema del test' },
            difficulty: { type: 'STRING', enum: ['easy', 'medium', 'hard'] }
          },
          required: ['topic']
        }
      },
      {
        name: 'evaluate_english_fluency',
        description: 'Evalúa la fluidez y pronunciación en inglés para la mini app Idiomas Voz.',
        parameters: {
          type: 'OBJECT',
          properties: {
            phrase: { type: 'STRING', description: 'Frase pronunciada' },
            score: { type: 'NUMBER', description: 'Puntuación 0-100' },
            feedback: { type: 'STRING', description: 'Consejos de corrección fonética' }
          },
          required: ['phrase', 'score']
        }
      }
    ];
  }

  /**
   * Conectar con el endpoint WebSocket de Gemini Live
   */
  public async connect(
    onToolCall?: (name: string, args: any) => void,
    onTextChunk?: (text: string) => void
  ): Promise<void> {
    this.onToolCallHandler = onToolCall;
    this.onTextChunkHandler = onTextChunk;

    const apiKey = this.config.apiKey || 'freellmapi-bc5d56dc6a1548c6c11a0d409008b1ed0273e4105cd64784';
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.sendInitialConfig();
          this.startAudioCapture();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleIncomingMessage(event.data);
        };

        this.ws.onerror = (err) => {
          console.warn('Error en WebSocket Gemini Live:', err);
          reject(err);
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.stopAudioCapture();
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Enviar configuración inicial BidiGenerateContentSetup
   */
  private sendInitialConfig() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const setupMessage = {
      setup: {
        model: this.config.model || 'models/gemini-2.0-flash-exp',
        generationConfig: {
          responseModalities: ['AUDIO', 'TEXT'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Puck'
              }
            }
          }
        },
        systemInstruction: {
          parts: [{ text: this.config.systemInstruction || 'Eres el asistente agéntico de GOALS. Responde de forma muy breve y ejecuta herramientas visuales si el usuario te lo pide.' }]
        },
        tools: [{ functionDeclarations: this.config.tools || GeminiLiveSession.getDefaultTools() }]
      }
    };

    this.ws.send(JSON.stringify(setupMessage));
  }

  /**
   * Iniciar la captura continua del micrófono del usuario (Web Audio API PCM 16kHz)
   */
  private async startAudioCapture() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        if (!this.isConnected || !this.ws) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }

        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
        const realtimeInput = {
          realtimeInput: {
            mediaChunks: [{
              mimeType: 'audio/pcm;rate=16000',
              data: base64Audio
            }]
          }
        };

        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(realtimeInput));
        }
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);
    } catch (e) {
      console.warn('No se pudo acceder al micrófono para Gemini Live:', e);
    }
  }

  /**
   * Procesar mensajes entrantes de la API Live (Audio, Texto y Llamadas a Funciones)
   */
  private handleIncomingMessage(dataStr: string) {
    try {
      const data = JSON.parse(dataStr);

      if (data.serverContent?.modelTurn?.parts) {
        for (const part of data.serverContent.modelTurn.parts) {
          if (part.text && this.onTextChunkHandler) {
            this.onTextChunkHandler(part.text);
          }
        }
      }

      if (data.toolCall?.functionCalls) {
        for (const call of data.toolCall.functionCalls) {
          console.log(`🤖 Ejecutando herramienta agéntica: ${call.name}`, call.args);
          if (this.onToolCallHandler) {
            this.onToolCallHandler(call.name, call.args);
          }
        }
      }
    } catch (e) {
      console.warn('Error parseando paquete Gemini Live:', e);
    }
  }

  private stopAudioCapture() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  public disconnect() {
    this.isConnected = false;
    this.stopAudioCapture();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
