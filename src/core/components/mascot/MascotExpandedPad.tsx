/**
 * src/core/components/mascot/MascotExpandedPad.tsx
 * Pizarra de Dibujo y Escritura a Mano con Suavizado Bézier y Bloc de Notas
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Pencil,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Send,
  Mic,
  MicOff,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Type,
  Palette,
  Copy,
  Sliders,
  Highlighter
} from 'lucide-react';
import { askAI, askAIVision, normalizeChildVoiceIntent, buildChildSystemPrompt } from '../../services/aiService';

export type CanvasBackgroundType = 'chalkboard' | 'grid' | 'ruled' | 'whiteboard';
export type ToolMode = 'pen' | 'chalk' | 'highlighter' | 'eraser';

interface MascotExpandedPadProps {
  isOpen: boolean;
  onClose: () => void;
  mascotName?: string;
  primaryColor?: string;
  initialTab?: 'draw' | 'text';
  onSendToAI?: (query: string, imageBase64?: string) => Promise<string | void>;
}

const NEON_PALETTE = [
  { name: 'Blanco Tiza', color: '#F8FAFC' },
  { name: 'Amarillo Neón', color: '#FDE047' },
  { name: 'Cian Cósmico', color: '#38BDF8' },
  { name: 'Verde Lima', color: '#4ADE80' },
  { name: 'Rosa Mágico', color: '#F472B6' },
  { name: 'Naranja Chispa', color: '#FB923C' },
  { name: 'Púrpura Galáctico', color: '#C084FC' },
  { name: 'Rojo Rubí', color: '#F87171' }
];

export const MascotExpandedPad: React.FC<MascotExpandedPadProps> = ({
  isOpen,
  onClose,
  mascotName = 'Sparky',
  primaryColor = '#F97316',
  initialTab = 'draw',
  onSendToAI
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'text'>(initialTab);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTool, setCurrentTool] = useState<ToolMode>('pen');
  const [selectedColor, setSelectedColor] = useState<string>(NEON_PALETTE[1].color);
  const [brushSize, setBrushSize] = useState<number>(4);
  const [bgType, setBgType] = useState<CanvasBackgroundType>('chalkboard');

  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isDrawingRef = useRef<boolean>(false);
  const strokePointsRef = useRef<{ x: number; y: number }[]>([]);

  const [textNote, setTextNote] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechInterim, setSpeechInterim] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const initData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initData]);
      setHistoryIndex(0);
    }
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === 'draw') {
      const timer = setTimeout(initCanvas, 50);
      window.addEventListener('resize', initCanvas);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', initCanvas);
      };
    }
  }, [isOpen, activeTab, initCanvas]);

  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, currentImg].slice(-25);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 24));
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetIdx = historyIndex - 1;
    ctx.putImageData(history[targetIdx], 0, 0);
    setHistoryIndex(targetIdx);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetIdx = historyIndex + 1;
    ctx.putImageData(history[targetIdx], 0, 0);
    setHistoryIndex(targetIdx);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    saveSnapshot();
    showToast('Lienzo limpio');
  };

  const applyStrokeStyle = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 4;
      ctx.shadowBlur = 0;
    } else if (currentTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = brushSize * 3;
      ctx.shadowBlur = 0;
    } else if (currentTool === 'chalk') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.shadowColor = selectedColor;
      ctx.shadowBlur = 8;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.shadowColor = selectedColor;
      ctx.shadowBlur = 4;
    }
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const coords = getCanvasCoords(e);
    strokePointsRef.current = [coords];

    ctx.save();
    applyStrokeStyle(ctx);

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, (ctx.lineWidth || 2) / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    const pts = strokePointsRef.current;
    pts.push(coords);

    if (pts.length < 3) {
      const p1 = pts[0];
      const p2 = pts[1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      return;
    }

    const pPrev = pts[pts.length - 2];
    const pCurrent = pts[pts.length - 1];
    const midPoint = {
      x: (pPrev.x + pCurrent.x) / 2,
      y: (pPrev.y + pCurrent.y) / 2
    };

    ctx.beginPath();
    const pStartMid = pts.length === 3
      ? pts[0]
      : {
          x: (pts[pts.length - 3].x + pPrev.x) / 2,
          y: (pts[pts.length - 3].y + pPrev.y) / 2
        };

    ctx.moveTo(pStartMid.x, pStartMid.y);
    ctx.quadraticCurveTo(pPrev.x, pPrev.y, midPoint.x, midPoint.y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.restore();
      }
    }
    isDrawingRef.current = false;
    strokePointsRef.current = [];
    saveSnapshot();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    expCtx.fillStyle = bgType === 'whiteboard' ? '#FFFFFF' : '#090D16';
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    expCtx.drawImage(canvas, 0, 0);

    const dataUrl = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `apunte-goals-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    showToast('¡Apunte descargado!');
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    expCtx.fillStyle = bgType === 'whiteboard' ? '#FFFFFF' : '#090D16';
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    expCtx.drawImage(canvas, 0, 0);

    exportCanvas.toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          showToast('¡Copiado al portapapeles!');
        } catch (e) {
          showToast('No se pudo copiar');
        }
      }
    });
  };

  const handleSendDrawingToAI = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsAiProcessing(true);
    setAiFeedback(null);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext('2d');
    if (expCtx) {
      expCtx.fillStyle = bgType === 'whiteboard' ? '#FFFFFF' : '#0F172A';
      expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      expCtx.drawImage(canvas, 0, 0);
    }

    const base64Img = exportCanvas.toDataURL('image/png');

    if (onSendToAI) {
      try {
        const reply = await onSendToAI(
          textNote || 'Explícame o corrige este apunte o dibujo escolar hecho en mi pizarra.',
          base64Img
        );
        if (reply) setAiFeedback(reply);
      } catch (err: any) {
        setAiFeedback(`Error al consultar con ${mascotName}: ${err.message}`);
      } finally {
        setIsAiProcessing(false);
      }
      return;
    }

    try {
      const response = await askAIVision({
        imageBase64OrUrl: base64Img,
        promptText: textNote || 'Analiza este apunte escolar o dibujo hecho a mano. Explica de forma didáctica qué representa, corrige posibles errores u operaciones y da un consejo positivo.',
        systemPrompt: buildChildSystemPrompt(mascotName)
      });
      setAiFeedback(response);
    } catch (err: any) {
      setAiFeedback(`No pude analizar la imagen: ${err.message}`);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Tu navegador no soporta dictado por voz');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += ' ' + event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }
        if (finalTrans) {
          setTextNote((prev) => (prev ? prev + ' ' + finalTrans.trim() : finalTrans.trim()));
        }
        setSpeechInterim(currentInterim);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setSpeechInterim('');
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSendTextToAI = async () => {
    if (!textNote.trim()) return;

    setIsAiProcessing(true);
    setAiFeedback(null);

    if (onSendToAI) {
      try {
        const reply = await onSendToAI(textNote);
        if (reply) setAiFeedback(reply);
      } catch (err: any) {
        setAiFeedback(`Error: ${err.message}`);
      } finally {
        setIsAiProcessing(false);
      }
      return;
    }

    try {
      const cleanPrompt = await normalizeChildVoiceIntent(textNote);
      const res = await askAI({
        messages: [
          { role: 'system', content: buildChildSystemPrompt(mascotName) },
          { role: 'user', content: cleanPrompt }
        ]
      });
      setAiFeedback(res);
    } catch (e: any) {
      setAiFeedback(`Error: ${e.message}`);
    } finally {
      setIsAiProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className={`bg-slate-950/95 border border-indigo-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullScreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-4xl h-[88vh] max-h-[760px]'
        }`}
      >
        {/* CABECERA */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `${primaryColor}20`,
                borderColor: `${primaryColor}50`,
                color: primaryColor
              }}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <span>Pizarra & Bloc de Apuntes</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {mascotName} Tutor
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Escribe a mano, dibuja esquemas o dicta por voz a tu mascota
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('draw')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'draw'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Pizarra Dibujo</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Voz & Notas</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullScreen((prev) => !prev)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullScreen ? 'Ventana Normal' : 'Pantalla Completa'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Cerrar Pizarra"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        {activeTab === 'draw' ? (
          <div className="flex-1 flex flex-col min-h-0 relative">
            <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentTool('pen')}
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    currentTool === 'pen'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Bolígrafo / Marcador Fluido"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Neón</span>
                </button>

                <button
                  onClick={() => setCurrentTool('chalk')}
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    currentTool === 'chalk'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Tiza Escolar Brillante"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tiza</span>
                </button>

                <button
                  onClick={() => setCurrentTool('highlighter')}
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    currentTool === 'highlighter'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Subrayador Fluorescente"
                >
                  <Highlighter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Subrayar</span>
                </button>

                <button
                  onClick={() => setCurrentTool('eraser')}
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    currentTool === 'eraser'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Goma de Borrar"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Goma</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl">
                <Sliders className="w-3 h-3 text-slate-400" />
                {[2, 5, 10, 18].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      brushSize === size
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className="rounded-full bg-current"
                      style={{ width: `${Math.min(size + 2, 14)}px`, height: `${Math.min(size + 2, 14)}px` }}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                {NEON_PALETTE.map((item) => (
                  <button
                    key={item.color}
                    onClick={() => {
                      setSelectedColor(item.color);
                      if (currentTool === 'eraser') setCurrentTool('pen');
                    }}
                    style={{ backgroundColor: item.color }}
                    className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                      selectedColor === item.color && currentTool !== 'eraser'
                        ? 'ring-2 ring-white scale-110'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    title={item.name}
                  />
                ))}
                <label className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 cursor-pointer overflow-hidden relative ml-1">
                  <Palette className="w-3 h-3 text-slate-300" />
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      if (currentTool === 'eraser') setCurrentTool('pen');
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setBgType('chalkboard')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    bgType === 'chalkboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Pizarra Oscura"
                >
                  Pizarra
                </button>
                <button
                  onClick={() => setBgType('grid')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    bgType === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Cuadrícula Escolar"
                >
                  Cuadrícula
                </button>
                <button
                  onClick={() => setBgType('ruled')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    bgType === 'ruled' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Pauta Rayada"
                >
                  Pauta
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                  title="Deshacer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                  title="Rehacer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer"
                  title="Limpiar Lienzo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              className={`flex-1 relative overflow-hidden flex items-center justify-center ${
                bgType === 'chalkboard'
                  ? 'bg-slate-950'
                  : bgType === 'grid'
                  ? 'bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
                  : bgType === 'ruled'
                  ? 'bg-slate-950 bg-[linear-gradient(to_bottom,transparent_23px,#1e293b_24px)] [background-size:100%_24px]'
                  : 'bg-white'
              }`}
            >
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ touchAction: 'none' }}
                className="absolute inset-0 w-full h-full cursor-crosshair"
              />

              {toastMessage && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg animate-bounce pointer-events-none z-20">
                  {toastMessage}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={textNote}
                  onChange={(e) => setTextNote(e.target.value)}
                  placeholder={`Pregunta a ${mascotName} sobre tu dibujo...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyImage}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Copiar Imagen"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copiar</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Descargar PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Guardar</span>
                </button>

                <button
                  onClick={handleSendDrawingToAI}
                  disabled={isAiProcessing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAiProcessing ? 'Analizando...' : `Consultar con ${mascotName}`}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto bg-slate-950">
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSpeechRecognition}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 animate-pulse ring-4 ring-rose-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                  title={isListening ? 'Detener Micrófono' : 'Comenzar a Dictar'}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isListening ? '🎙️ Escuchando tu voz...' : 'Dictar apunte o pregunta'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isListening ? 'Habla con naturalidad a tu tutor' : 'Pulsa el micro para hablar directamente'}
                  </p>
                </div>
              </div>

              {isListening && (
                <div className="flex items-center gap-1 h-6 px-3 py-1 bg-slate-950 rounded-xl border border-rose-500/40">
                  {[40, 80, 60, 100, 50, 90, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-rose-400 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-xs font-bold text-indigo-300">
                Texto del Apunte / Pregunta:
              </label>
              <textarea
                value={textNote}
                onChange={(e) => setTextNote(e.target.value)}
                placeholder="Escribe tus dudas, apuntes de clase, o las palabras dictadas aparecerán aquí..."
                rows={7}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 leading-relaxed resize-none"
              />
              {speechInterim && (
                <div className="text-[11px] text-amber-400 italic px-2">
                  🎙️ Transcribiendo: {speechInterim}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Sugerencias Rápidas:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  '💡 Explícamelo con un ejemplo sencillo',
                  '📐 ¿Cómo se resuelve este ejercicio?',
                  '🌍 Cuéntame un dato asombroso de este tema',
                  '📝 Hazme un resumen en 3 puntos clave'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTextNote(chip)}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-indigo-300 transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSendTextToAI}
                disabled={!textNote.trim() || isAiProcessing}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAiProcessing ? 'Pensando...' : `Enviar a ${mascotName}`}</span>
              </button>
            </div>
          </div>
        )}

        {aiFeedback && (
          <div className="p-3.5 bg-indigo-950/40 border-t border-indigo-500/30 flex items-start gap-3 animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs text-slate-200 leading-relaxed">
              <div className="font-bold text-amber-300 mb-0.5">Respuesta de {mascotName}:</div>
              <p className="whitespace-pre-wrap">{aiFeedback}</p>
            </div>
            <button
              onClick={() => setAiFeedback(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
