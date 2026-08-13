import React, { useState } from 'react';
import { BookOpen, Camera, CheckCircle, Sparkles, HelpCircle, ArrowRight, FileText, Cpu, Award, Zap, Loader2, Lock } from 'lucide-react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { getAcademicTutorResponse, analyzeNotesOCR } from '../../core/services/aiService';

interface SchoolViewProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const SchoolView: React.FC<SchoolViewProps> = ({ onOpenAuth }) => {
  const { addXP } = useProgress();
  const { user, isCloud } = useAuth();
  const isAuthenticated = isCloud && user && !user.isAnonymous;

  const [activeTab, setActiveTab] = useState<'tutor' | 'ocr' | 'step' | 'map'>('tutor');
  const [userQuery, setUserQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Matemáticas');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAskingAI, setIsAskingAI] = useState<boolean>(false);
  const [ocrSampleText, setOcrSampleText] = useState<string>(
    'Ecuación cuadrática: 2x^2 + 5x - 3 = 0. Calcular las raíces x1 y x2 usando la fórmula general.'
  );

  const SUBJECTS = [
    { id: 'math', name: 'Matemáticas', icon: '📐', progress: '85%', color: 'from-emerald-600 to-teal-700' },
    { id: 'physics', name: 'Física & Química', icon: '🧪', progress: '70%', color: 'from-cyan-600 to-blue-700' },
    { id: 'history', name: 'Historia & Geografía', icon: '🏛️', progress: '90%', color: 'from-amber-600 to-orange-700' },
    { id: 'biology', name: 'Biología & Ciencias', icon: '🌿', progress: '65%', color: 'from-green-600 to-emerald-800' }
  ];

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    if (!userQuery.trim() || isAskingAI) return;
    setIsAskingAI(true);
    setAiResponse(null);

    try {
      const responseText = await getAcademicTutorResponse(selectedSubject, userQuery);
      setAiResponse(responseText);
      addXP(20, 'school', 'Consulta con Tutor IA Real');
    } catch (error: any) {
      setAiResponse(`❌ Error de conexión con la IA: ${error.message}`);
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleRunOCR = async () => {
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    if (isAskingAI) return;
    setIsAskingAI(true);
    setAiResponse(null);

    try {
      const responseText = await analyzeNotesOCR(ocrSampleText);
      setAiResponse(responseText);
      addXP(25, 'school', 'Análisis Real de Apuntes con OCR e IA');
    } catch (error: any) {
      setAiResponse(`❌ Error de conexión con la IA: ${error.message}`);
    } finally {
      setIsAskingAI(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Banner de Modo Exploración Libre si no ha iniciado sesión */}
      {!isAuthenticated && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-emerald-300 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Navegación Libre: Puedes explorar la Mini App Escuela. Inicia sesión para usar el Tutor IA Real y acumular XP.</span>
          </div>
          <button
            onClick={() => onOpenAuth?.('signup')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shrink-0 transition-all text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Todo</span>
          </button>
        </div>
      )}

      {/* Header de la Mini App Escuela */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-emerald-500/30">📚</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl text-white">Escuela GOALS</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  IA Conectada Real 🟢
                </span>
              </div>
              <p className="text-xs text-emerald-200">Tutoría Inteligente en Tiempo Real & Resolución de Apuntes con LLM Proxy</p>
            </div>
          </div>
        </div>

        {/* Pestañas Internas de Escuela */}
        <div className="flex gap-2 pt-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'tutor'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tutor IA Real</span>
          </button>

          <button
            onClick={() => setActiveTab('ocr')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'ocr'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto de Apuntes OCR (IA)</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'map'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mapa Académico</span>
          </button>
        </div>
      </div>

      {/* Asignaturas Principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUBJECTS.map((sub) => (
          <div 
            key={sub.id} 
            onClick={() => setSelectedSubject(sub.name)}
            className={`bg-slate-900 border rounded-xl p-3 space-y-2 cursor-pointer transition-all ${
              selectedSubject === sub.name ? 'border-emerald-400 bg-slate-800/80 shadow-lg shadow-emerald-500/10' : 'border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{sub.icon}</span>
              <span className="text-[10px] font-bold text-emerald-400">{sub.progress}</span>
            </div>
            <p className="font-semibold text-xs text-white leading-tight">{sub.name}</p>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${sub.color}`} style={{ width: sub.progress }} />
            </div>
          </div>
        ))}
      </div>

      {/* Área de Tutoría Interactiva / OCR */}
      {activeTab === 'tutor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Consulta en Vivo a tu Tutor IA de {selectedSubject}</span>
            </h3>
            <p className="text-xs text-slate-400">Pregunta dudas de deberes o solicita una explicación paso a paso. (Conexión 100% Real API).</p>
          </div>

          <form onSubmit={handleAskTutor} className="flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={`Ej: Explícame el concepto principal de ${selectedSubject}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isAskingAI || !userQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isAskingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Pensando...</span>
                </>
              ) : (
                <>
                  <span>Preguntar IA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {aiResponse && (
            <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Respuesta Real del Tutor IA:</span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ocr' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Análisis Real de Apuntes Transcritos con IA</span>
            </h3>
            <p className="text-xs text-slate-400">Edita el texto del cuaderno escaneado y presiona analizar para que la IA resuelva el problema.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Texto Transcrito del Cuaderno:</label>
            <textarea
              rows={3}
              value={ocrSampleText}
              onChange={(e) => setOcrSampleText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              onClick={handleRunOCR}
              disabled={isAskingAI}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isAskingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Procesando Apuntes en la IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analizar Apuntes con IA Real</span>
                </>
              )}
            </button>
          </div>

          {aiResponse && (
            <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Explicación Didáctica de los Apuntes:</span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'map' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <h3 className="font-display font-bold text-sm text-white">Mapa de Conocimiento Académico</h3>
          <p className="text-xs text-slate-400">Diagnóstico de temas dominados y áreas de repaso antes de tus exámenes.</p>
          
          <div className="space-y-2 pt-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Ecuaciones de 1er y 2º Grado</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">Dominado</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Leyes de Newton y Dinámica</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[10px]">Repasar hoy</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Tabla Periódica y Enlaces Químicos</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">Dominado</span>
            </div>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR DE MENÚ RESPONSIVA (Estilo AstroLingo) */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 bg-slate-950/95 backdrop-blur-xl border border-emerald-500/30 p-1.5 rounded-2xl flex justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-extrabold transition-all ${
            activeTab === 'tutor' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tutor IA</span>
        </button>

        <button
          onClick={() => setActiveTab('ocr')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-extrabold transition-all ${
            activeTab === 'ocr' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>OCR Apuntes</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-extrabold transition-all ${
            activeTab === 'map' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mapas</span>
        </button>
      </div>

    </div>
  );
};
