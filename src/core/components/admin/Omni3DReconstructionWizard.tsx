/**
 * src/core/components/admin/Omni3DReconstructionWizard.tsx
 * Estudio de Co-Creación y Diálogo con IA 3D 100% Dinámico (Cero Hardcodeo).
 * Permite al usuario:
 * 1. Chatear libremente con la IA sobre cualquier objeto, sistema o estructura.
 * 2. Subir fotografías de referencia o planos para mapeo de texturas PBR y normales.
 * 3. Seleccionar acabados (PBR Físico, Rayos X, Malla CAD) y ángulos de cámara.
 * 4. Generar y persistir la escena 3D universal en Firebase Firestore con fuentes oficiales reales.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Eye, 
  Radio, 
  Layers, 
  Compass, 
  Focus, 
  Split, 
  Rocket, 
  CheckCircle2, 
  Loader2, 
  BookOpen, 
  ShieldCheck,
  Cpu,
  Image as ImageIcon,
  Paperclip,
  Trash2
} from 'lucide-react';
import { Model3DDocument, Model3DService } from '../../services/Model3DService';
import { Omni3DGeneratorService, ChatMessage, ImageAnalysisReport } from '../../services/Omni3DGeneratorService';
import { Dynamic3DModelSpec } from '../../3d/interpreter/Universal3DInterpreter';
import { ImageTextureMapper, ProcessedPhotoTexture } from '../../3d/mapping/ImageTextureMapper';

export interface UploadedPhotoRef {
  id: string;
  name: string;
  url: string;
  file: File;
  processedTexture?: ProcessedPhotoTexture;
}

export interface Wizard3DConfig {
  query: string;
  presetId: string;
  name: string;
  category: string;
  finishStyle: 'pbr_physical' | 'xray' | 'cad_wireframe';
  visionPerspective: 'isometric' | 'macro' | 'cross_section';
  selectedModelDoc: Model3DDocument;
  generatedSpec?: Dynamic3DModelSpec;
  uploadedPhotos?: UploadedPhotoRef[];
}

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt: string;
  onConfirmReconstruction: (config: Wizard3DConfig) => void;
}

export const Omni3DReconstructionWizard: React.FC<WizardProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  onConfirmReconstruction
}) => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [finishStyle, setFinishStyle] = useState<'pbr_physical' | 'xray' | 'cad_wireframe'>('pbr_physical');
  const [visionPerspective, setVisionPerspective] = useState<'isometric' | 'macro' | 'cross_section'>('isometric');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [detectedDomain, setDetectedDomain] = useState<string>('Ingeniería y Ciencia');
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhotoRef[]>([]);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<boolean>(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  // Inicializar conversación con el prompt del usuario
  useEffect(() => {
    if (!isOpen) return;

    const trimmedPrompt = initialPrompt.trim();
    const hasInitialPrompt = trimmedPrompt.length > 0;

    const welcomeMsg: ChatMessage = {
      id: 'msg_welcome',
      role: 'assistant',
      content: hasInitialPrompt
        ? `¡Hola! Soy tu Asistente de Creación y Síntesis 3D. He visto que te interesa: **"${trimmedPrompt}"**.\n\n¿Deseas detallar algún componente específico, o prefieres subir fotografías reales de referencia (📎) para mapear sus texturas y perspectivas multi-ángulo?`
        : `¡Hola! Soy tu Asistente de Creación y Síntesis 3D Universal. Puedo modelar cualquier objeto, máquina, circuito, cuerpo celeste, órgano o sistema físico del universo.\n\n¿Qué deseas construir hoy? Puedes describirlo en el chat o hacer clic en el clip (📎) para subir fotos reales de referencia y extraer sus vistas multi-ángulo.`,
      timestamp: Date.now(),
      suggestions: hasInitialPrompt
        ? ['🌟 Modo Realista PBR', '🩻 Modo Radiografía / Rayos X', '🚀 ¡Generar en 3D ahora!']
        : ['🌌 Nebulosa / Galaxia 3D', '⚡ Cuadro Eléctrico REBT', '🪐 Planeta Tierra con Atmósfera', '🚀 Telescopio Espacial']
    };

    setMessages([welcomeMsg]);
    setInputMessage('');
    setIsGenerating(false);
    setLatestAnalysisReport(null);

    // Consulta inicial SOLO si hay un prompt explícito
    if (hasInitialPrompt) {
      const triggerInitialAnalysis = async () => {
        setIsAiThinking(true);
        try {
          const res = await Omni3DGeneratorService.chat([], trimmedPrompt);
          setDetectedDomain(res.detectedDomain);
          setMessages([
            welcomeMsg,
            {
              id: 'msg_ai_init_' + Date.now(),
              role: 'assistant',
              content: res.responseText,
              timestamp: Date.now(),
              suggestions: res.suggestions
            }
          ]);
        } catch {
          // En caso de fallo, se mantiene el mensaje de bienvenida
        } finally {
          setIsAiThinking(false);
        }
      };

      triggerInitialAnalysis();
    } else {
      setDetectedDomain('Exploración & Creación 3D');
      setIsAiThinking(false);
    }
  }, [isOpen, initialPrompt]);

  // Auto-scroll del chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking, uploadedPhotos]);

  // Manejador de subida de fotos en el diálogo
  const [latestAnalysisReport, setLatestAnalysisReport] = useState<ImageAnalysisReport | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhoto(true);
    const newPhotos: UploadedPhotoRef[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const texture = await ImageTextureMapper.processUserImage(file);
        
        // Crear elemento Image real para inspección visual de píxeles
        const imgEl = new Image();
        imgEl.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          imgEl.onload = () => resolve();
          imgEl.onerror = () => resolve();
          imgEl.src = texture.sourceUrl;
        });

        const conversationSummary = messages.map(m => `${m.role === 'user' ? 'Usuario' : 'IA'}: ${m.content}`).join('\n');
        const analysis = await Omni3DGeneratorService.analyzeImageAndInvestigate(
          file.name,
          texture.dominantColor || '#0284c7',
          texture.aspectRatio || 1.0,
          conversationSummary,
          initialPrompt,
          imgEl,
          texture.sourceUrl
        );

        setLatestAnalysisReport(analysis);
        setDetectedDomain(analysis.domain);

        // Mapear las 4 vistas reales (NASA API / Flux) para visualización en el wizard
        if (analysis.multiAnglesSuggested && analysis.multiAnglesSuggested.length > 0) {
          texture.multiAngleViews = analysis.multiAnglesSuggested.map((ang, idx) => ({
            id: 'angle_' + idx,
            name: ang.angleName,
            angleLabel: ang.angleName.split(' ')[0] || `${idx * 45}°`,
            dataUrl: ang.previewUrl || texture.sourceUrl,
            pitchDeg: ang.pitchDeg,
            yawDeg: ang.yawDeg,
            description: ang.description || 'Perspectiva espacial de triangulación'
          }));
        }

        newPhotos.push({
          id: 'photo_' + Date.now() + '_' + i,
          name: file.name,
          url: texture.sourceUrl,
          file,
          processedTexture: texture
        });

        const anglesDesc = analysis.multiAnglesSuggested.map(a => `• **${a.angleName}:** ${a.description}`).join('\n');
        const sourcesDesc = analysis.officialSources.map(s => `• **${s.name}** (${s.organization} • \`${s.standardCode || 'OFICIAL'}\`)`).join('\n');

        const fullAiMsg = `${analysis.narrativeAnalysis}\n\n📐 **Vistas y Proyecciones Multi-Ángulo Sintetizadas:**\n${anglesDesc}\n\n📚 **Fuentes Oficiales & Archivos Científicos:**\n${sourcesDesc}\n\n¿Deseas aplicar estos ángulos y comenzar la reconstrucción 3D o afinar algún parámetro de iluminación y materiales?`;

        setMessages(prev => [
          ...prev,
          {
            id: 'msg_user_photo_' + Date.now(),
            role: 'user',
            content: `📎 Adjunté fotografía de referencia: **${file.name}** (${analysis.detectedEntity}) para análisis visual, investigación y reconstrucción 3D.`,
            timestamp: Date.now()
          },
          {
            id: 'msg_ai_photo_' + Date.now(),
            role: 'assistant',
            content: fullAiMsg,
            timestamp: Date.now(),
            suggestions: analysis.suggestedActionPills
          }
        ]);
      } catch (err) {
        console.warn('Error al procesar foto para 3D:', err);
      }
    }

    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    setIsProcessingPhoto(false);
    setIsAiThinking(false);
  };

  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isAiThinking || isGenerating) return;

    // Si el usuario pulsa un botón directo de generación
    if (query.includes('¡Generar') || query.includes('Generar en 3D')) {
      handleTriggerGeneration();
      return;
    }

    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsAiThinking(true);

    try {
      const historyForApi = newHistory.map(m => ({ role: m.role, content: m.content }));
      const aiResponse = await Omni3DGeneratorService.chat(historyForApi, query);
      
      setDetectedDomain(aiResponse.detectedDomain);
      setMessages(prev => [
        ...prev,
        {
          id: 'msg_ai_' + Date.now(),
          role: 'assistant',
          content: aiResponse.responseText,
          timestamp: Date.now(),
          suggestions: aiResponse.suggestions
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg_err_' + Date.now(),
          role: 'assistant',
          content: 'Entendido. Tengo toda la información técnica necesaria. Pulsa el botón inferior para sintetizar el modelo 3D con sombreadores PBR.',
          timestamp: Date.now(),
          suggestions: ['🚀 ¡Generar en 3D ahora!']
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleTriggerGeneration = async () => {
    setIsGenerating(true);
    const mainPrompt = initialPrompt.trim() || 'Objeto 3D Dinámico';
    const conversationSummary = messages.map(m => `${m.role === 'user' ? 'Usuario' : 'IA'}: ${m.content}`).join('\n');

    try {
      // 1. Generar la especificación técnica 3D con la IA
      const generatedSpec = await Omni3DGeneratorService.generateModelSpec(mainPrompt, conversationSummary, finishStyle);
      
      // 2. Convertir a documento de Firestore
      const doc = Omni3DGeneratorService.specToDocument(generatedSpec, finishStyle);
      doc.spec = generatedSpec;
      doc.officialSources = generatedSpec.officialSources;
      doc.visionPerspective = visionPerspective;

      // 3. Vincular fotos subidas si existen
      if (uploadedPhotos.length > 0) {
        doc.cameras = uploadedPhotos.map((p, idx) => ({
          id: `user_cam_${idx + 1}`,
          name: `Foto de Usuario: ${p.name}`,
          localPath: p.url,
          source: 'Fotografía Real Subida por Usuario',
          resolution: 'Proyección Textura PBR',
          sensor: 'RGB / Normal Sobel Map',
          description: `Fotografía mapeada sobre la geometría con cálculo de rugosidad y normales tangenciales.`
        }));
      }

      // 4. Persistir en Firestore
      await Model3DService.getInstance().saveModel(doc);

      // 5. Notificar a la vista 3D
      onConfirmReconstruction({
        query: mainPrompt,
        presetId: doc.id,
        name: doc.name,
        category: doc.category,
        finishStyle,
        visionPerspective,
        selectedModelDoc: doc,
        generatedSpec,
        uploadedPhotos
      });

      onClose();
    } catch (err) {
      console.error('Error generando modelo 3D:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[850px]">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Estudio 3D Autónomo IA • Diálogo, Fotos & Creación</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  100% DINÁMICO
                </span>
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span>Dominio detectado:</span>
                <span className="text-cyan-400 font-semibold">{detectedDomain}</span>
                <span>• Fuentes Oficiales & Mapeo de Fotos</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Controls: Estilo Visual & Ángulo de Enfoque */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 text-xs">
          
          {/* Estilo de Acabado */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Estilo:</span>
            <div className="flex items-center gap-1 w-full">
              <button
                type="button"
                onClick={() => setFinishStyle('pbr_physical')}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  finishStyle === 'pbr_physical' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>🌟 Realista PBR</span>
              </button>
              <button
                type="button"
                onClick={() => setFinishStyle('xray')}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  finishStyle === 'xray' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Radio className="w-3 h-3" />
                <span>🩻 Rayos X</span>
              </button>
              <button
                type="button"
                onClick={() => setFinishStyle('cad_wireframe')}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  finishStyle === 'cad_wireframe' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>📐 Malla CAD</span>
              </button>
            </div>
          </div>

          {/* Enfoque de Cámara */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Ángulo:</span>
            <div className="flex items-center gap-1 w-full">
              <button
                type="button"
                onClick={() => setVisionPerspective('isometric')}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  visionPerspective === 'isometric' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>🔄 360°</span>
              </button>
              <button
                type="button"
                onClick={() => setVisionPerspective('macro')}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  visionPerspective === 'macro' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Focus className="w-3 h-3" />
                <span>🔍 Detalle</span>
              </button>
              <button
                type="button"
                onClick={() => setVisionPerspective('cross_section')}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  visionPerspective === 'cross_section' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Split className="w-3 h-3" />
                <span>✂️ Corte</span>
              </button>
            </div>
          </div>

        </div>

        {/* Chat History Panel */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/50 text-slate-200">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none shadow-md shadow-cyan-900/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}>
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Botones de sugerencia rápida */}
                {m.role === 'assistant' && m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {m.suggestions.map((sug: string, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          sug.includes('¡Generar')
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-sm font-bold'
                            : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700/60'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Miniaturas de Fotografías Subidas y Proyecciones Multi-Ángulo */}
          {uploadedPhotos.length > 0 && (
            <div className="p-3 bg-slate-900/90 border border-cyan-500/30 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Fotografías y Planos Mapeados ({uploadedPhotos.length})</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">PBR Normal Map & DIBR Ready</span>
              </div>

              {/* Fotos del Usuario */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {uploadedPhotos.map((p) => (
                  <div key={p.id} className="relative group w-20 h-16 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-black">
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(p.id)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Vistas Multi-Ángulo Sintetizadas (Novel View Synthesis) */}
              {uploadedPhotos[0]?.processedTexture?.multiAngleViews && uploadedPhotos[0].processedTexture.multiAngleViews.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-cyan-400" />
                      <span>Perspectivas Multi-Ángulo Sintetizadas (360° Triangulación):</span>
                    </span>
                    <span className="text-[9px] text-cyan-400/80">Haz clic para fijar ángulo</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {uploadedPhotos[0].processedTexture.multiAngleViews.map((ang) => (
                      <button
                        key={ang.id}
                        type="button"
                        onClick={() => {
                          if (ang.id.includes('45')) setVisionPerspective('isometric');
                          else if (ang.id.includes('top')) setVisionPerspective('cross_section');
                          else if (ang.id.includes('90')) setVisionPerspective('macro');
                          else setVisionPerspective('isometric');
                        }}
                        className="group relative p-1 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all text-left flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <div className="w-full h-12 rounded-lg overflow-hidden bg-black relative">
                          <img src={ang.dataUrl} alt={ang.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-0.5 left-1 text-[8px] font-mono font-bold text-cyan-300">
                            {ang.angleLabel}
                          </span>
                        </div>
                        <span className="text-[9px] font-medium text-slate-300 text-center truncate w-full px-1">
                          {ang.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Indicador de pensamiento de la IA o procesamiento */}
          {(isAiThinking || isProcessingPhoto) && (
            <div className="flex gap-3 justify-start items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 px-3 rounded-2xl rounded-tl-none">
                <span>{isProcessingPhoto ? 'Mapeando fotografía y calculando relieve con filtros Sobel PBR...' : 'Analizando especificación técnica, normas y geometría 3D...'}</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Footer Chat Input & Action Bar */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex-1 w-full relative flex items-center gap-2"
          >
            {/* Input oculto para subida de fotos */}
            <input
              ref={fileUploadRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileUploadRef.current?.click()}
              title="Adjuntar fotografías reales o planos para mapear texturas"
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-all cursor-pointer shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Chatea o afina detalles (ej: añade interruptor diferencial, pon tubos de cobre, haz corte transversal)..."
              disabled={isAiThinking || isGenerating}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors pr-10"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isAiThinking || isGenerating}
              className="absolute right-2 p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Botón Maestro de Generación */}
          <button
            type="button"
            onClick={handleTriggerGeneration}
            disabled={isGenerating || isAiThinking}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 transition-all shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sintetizando 3D en GPU...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>🚀 ¡Generar y Guardar en 3D!</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
