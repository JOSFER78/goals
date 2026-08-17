import React, { useState } from 'react';
import { 
  BookOpen, Camera, CheckCircle, Sparkles, ArrowRight, Calculator, 
  FlaskConical, Landmark, Leaf, AlertCircle, Loader2, Lock, Check,
  Cpu, Scan, HelpCircle, Layers, Lightbulb, Compass, Trophy, Brain
} from 'lucide-react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { getAcademicTutorResponse, analyzeNotesOCR } from '../../core/services/aiService';
import { MiniAppSubHeader } from '../../core/components/navigation/MiniAppSubHeader';
import { MiniAppBottomNav, MiniAppPillar } from '../../core/components/navigation/MiniAppBottomNav';
import { MiniAppSubmenuSheet, SubmenuSection } from '../../core/components/navigation/MiniAppSubmenuSheet';
import { ExperienceId } from '../../core/types';

interface SchoolViewProps {
  onBackToGoals?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigateExperience?: (expId: ExperienceId) => void;
}

export const SchoolView: React.FC<SchoolViewProps> = ({ onBackToGoals, onOpenAuth, onNavigateExperience }) => {
  const { userData, addXP } = useProgress();
  const { user } = useAuth();
  const isAuthenticated = !!(user && !user.isAnonymous);

  const [activeTab, setActiveTab] = useState<'tutor' | 'ocr' | 'map'>('tutor');
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Matemáticas');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAskingAI, setIsAskingAI] = useState<boolean>(false);
  const [ocrSampleText, setOcrSampleText] = useState<string>(
    'Ecuación cuadrática: 2x^2 + 5x - 3 = 0. Calcular las raíces x1 y x2 usando la fórmula general.'
  );

  const schoolXP = userData?.experiences?.school?.xp || 0;

  const SUBJECTS = [
    { id: 'math', name: 'Matemáticas', icon: Calculator, progress: '85%', color: 'from-emerald-500 to-teal-500', iconColor: 'text-emerald-400', samplePrompt: 'Demostración paso a paso del Teorema de Pitágoras' },
    { id: 'physics', name: 'Física & Química', icon: FlaskConical, progress: '70%', color: 'from-emerald-400 to-cyan-500', iconColor: 'text-emerald-300', samplePrompt: '¿Cómo funciona la 2ª Ley de Newton F=m·a?' },
    { id: 'history', name: 'Historia & Geo', icon: Landmark, progress: '90%', color: 'from-teal-500 to-emerald-600', iconColor: 'text-teal-400', samplePrompt: 'Causas económicas de la Revolución Industrial' },
    { id: 'biology', name: 'Biología & Ciencias', icon: Leaf, progress: '65%', color: 'from-green-500 to-emerald-500', iconColor: 'text-green-400', samplePrompt: 'Proceso de fotosíntesis lumínica y oscura' }
  ];

  const OCR_SAMPLES = [
    { title: 'Álgebra 2º Grado', text: 'Ecuación: 3x^2 - 12x + 9 = 0. Hallar las soluciones reales.' },
    { title: 'Física: Cinemática', text: 'Un móvil parte del reposo con aceleración a=2m/s^2 durante 5 segundos. Calcular velocidad final y distancia recorrida.' },
    { title: 'Química: Enlace', text: 'Diferencia entre enlace iónico y covalente. Ejemplos con NaCl y H2O.' }
  ];

  const handleAskTutor = async (customPrompt?: string) => {
    const promptToSend = customPrompt || userQuery;
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    if (!promptToSend.trim() || isAskingAI) return;
    setIsAskingAI(true);
    setAiResponse(null);
    if (customPrompt) setUserQuery(customPrompt);

    try {
      const responseText = await getAcademicTutorResponse(selectedSubject, promptToSend);
      setAiResponse(responseText);
      addXP(20, 'school', 'Consulta con Tutor IA Real');
    } catch (error: any) {
      setAiResponse(`Error de conexión con la IA: ${error.message}`);
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
      setAiResponse(`Error de conexión con la IA: ${error.message}`);
    } finally {
      setIsAskingAI(false);
    }
  };

  // Mapeo entre el pilar seleccionado en el Dock inferior y la pestaña
  const handleSelectPillar = (pillar: MiniAppPillar) => {
    if (pillar === 'learn') setActiveTab('tutor');
    else if (pillar === 'lab') setActiveTab('ocr');
    else if (pillar === 'tests') setActiveTab('map');
  };

  const currentPillar: MiniAppPillar = activeTab === 'tutor' ? 'learn' : activeTab === 'ocr' ? 'lab' : 'tests';

  // Secciones para el menú inferior desplegable ("Hamburguesa Abajorizada")
  const submenuSections: SubmenuSection[] = [
    {
      title: 'Tutoría Socrática por Materias',
      icon: BookOpen,
      items: SUBJECTS.map((sub) => ({
        id: `subject-${sub.id}`,
        label: sub.name,
        description: sub.samplePrompt,
        icon: sub.icon,
        badge: sub.progress,
        isActive: activeTab === 'tutor' && selectedSubject === sub.name,
        onClick: () => {
          setSelectedSubject(sub.name);
          setUserQuery(sub.samplePrompt);
          setActiveTab('tutor');
        }
      }))
    },
    {
      title: 'Laboratorios & OCR',
      icon: FlaskConical,
      items: [
        {
          id: 'lab-ocr',
          label: 'Escáner OCR Holográfico',
          description: 'Digitalización y resolución socrática de apuntes reales',
          icon: Scan,
          badge: '+25 XP',
          isActive: activeTab === 'ocr',
          onClick: () => setActiveTab('ocr')
        }
      ]
    },
    {
      title: 'Itinerario Académico',
      icon: Trophy,
      items: [
        {
          id: 'map-knowledge',
          label: 'Mapa Curricular & Retos',
          description: 'Competencias dominadas y temas de refuerzo',
          icon: Compass,
          badge: '82% Nivel',
          isActive: activeTab === 'map',
          onClick: () => setActiveTab('map')
        }
      ]
    }
  ];

  return (
    <div className="w-full space-y-4 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-28 font-display">
      
      {/* Banner de Modo Exploración Libre */}
      {!isAuthenticated && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-emerald-300 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Navegación Libre: Explora la Mini App Escuela. Inicia sesión para usar el Tutor IA Real y acumular XP.</span>
          </div>
          <button
            onClick={() => onOpenAuth?.('signup')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shrink-0 transition-all text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Todo</span>
          </button>
        </div>
      )}

      {/* Asignaturas Principales con Micro-Elevación Esmeralda */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SUBJECTS.map((sub) => {
          const SubIcon = sub.icon;
          const isSel = selectedSubject === sub.name && activeTab === 'tutor';
          return (
            <div 
              key={sub.id} 
              onClick={() => {
                setSelectedSubject(sub.name);
                setUserQuery(sub.samplePrompt);
                setActiveTab('tutor');
              }}
              className={`border rounded-2xl p-3.5 space-y-2.5 cursor-pointer transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
                isSel 
                  ? 'border-emerald-400/80 bg-slate-900 shadow-[0_0_24px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30' 
                  : 'border-slate-800/80 bg-slate-950/80 hover:border-emerald-500/40 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl bg-slate-950 border ${isSel ? 'border-emerald-500/40' : 'border-slate-800'} ${sub.iconColor}`}>
                  <SubIcon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400">{sub.progress}</span>
              </div>
              <div>
                <p className="font-extrabold text-xs text-white leading-tight">{sub.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{sub.samplePrompt}</p>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/50">
                <div className={`h-full bg-gradient-to-r ${sub.color} rounded-full`} style={{ width: sub.progress }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pestaña: Tutor Socrático */}
      {activeTab === 'tutor' && (
        <div className="bg-slate-900/90 border border-emerald-500/20 rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Consulta al Tutor Socrático de {selectedSubject}</span>
              </h3>
              <p className="text-xs text-slate-400">Guía paso a paso con preguntas reflexivas y razonamiento conceptual guiado.</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              +20 XP por consulta
            </span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleAskTutor(); }} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={`Ej: Explícame el concepto principal de ${selectedSubject}...`}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={isAskingAI || !userQuery.trim()}
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0"
              >
                {isAskingAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Razonando...</span>
                  </>
                ) : (
                  <>
                    <span>Preguntar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Chips de sugerencias rápidas */}
            <div className="flex flex-wrap items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="text-slate-500 flex items-center gap-1 font-semibold">
                <Lightbulb className="w-3 h-3 text-emerald-400" /> Atajos:
              </span>
              <button
                type="button"
                onClick={() => handleAskTutor('¿Cómo resolver ecuaciones de segundo grado paso a paso?')}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-colors"
              >
                Ecuaciones 2º Grado
              </button>
              <button
                type="button"
                onClick={() => handleAskTutor('Explica la ley de conservación de la energía mecánica')}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-colors"
              >
                Conservación Energía
              </button>
              <button
                type="button"
                onClick={() => handleAskTutor('¿Por qué el ADN tiene estructura de doble hélice?')}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-colors"
              >
                Estructura ADN
              </button>
            </div>
          </form>

          {aiResponse && (
            <div className="bg-slate-950/95 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-3 animate-fadeIn shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Respuesta del Tutor Socrático ({selectedSubject}):</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  INFERENCIA 100% REAL
                </span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pestaña: Escáner OCR con Visor Láser Holográfico */}
      {activeTab === 'ocr' && (
        <div className="bg-slate-900/90 border border-emerald-500/20 rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Scan className="w-4 h-4 text-emerald-400" />
                <span>Visor Holográfico de Reconocimiento OCR de Apuntes</span>
              </h3>
              <p className="text-xs text-slate-400">Digitalización de apuntes, extracción de fórmulas y explicación socrática inmediata.</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              +25 XP por análisis
            </span>
          </div>

          {/* Selector de Apuntes de Prueba */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Muestras de Apuntes:</span>
            {OCR_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setOcrSampleText(sample.text)}
                className="px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-emerald-300 font-medium transition-colors"
              >
                {sample.title}
              </button>
            ))}
          </div>

          {/* Viewfinder con Esquinas de Cámara y Láser Animado */}
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3 overflow-hidden">
            {/* Esquinas de enfoque de cámara */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

            {/* Haz Láser Animado durante análisis */}
            {isAskingAI && <div className="animate-laser-scan" />}

            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
              <span>// RECONOCIMIENTO DE TEXTO & FÓRMULAS</span>
              <span>ESTADO: {isAskingAI ? 'ESCANEANDO...' : 'LISTO'}</span>
            </div>

            <textarea
              rows={4}
              value={ocrSampleText}
              onChange={(e) => setOcrSampleText(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-400 font-mono tracking-wide leading-relaxed"
            />

            <div className="flex justify-end pt-1">
              <button
                onClick={handleRunOCR}
                disabled={isAskingAI}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isAskingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Digitalizando Apuntes...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 text-slate-950" />
                    <span>Escanear y Explicar con IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {aiResponse && (
            <div className="bg-slate-950/95 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-3 animate-fadeIn shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Desglose Didáctico de los Apuntes:</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  OCR MULTIMODAL GEMINI
                </span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pestaña: Mapa Curricular */}
      {activeTab === 'map' && (
        <div className="bg-slate-900/90 border border-emerald-500/20 rounded-3xl p-5 space-y-3 shadow-xl backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white">Mapa de Conocimiento Académico</h3>
              <p className="text-xs text-slate-400">Diagnóstico en tiempo real de competencias dominadas y temas clave de repaso.</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-xs font-mono">
              Nivel Global: 82%
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <span className="font-bold text-white block">Ecuaciones de 1er y 2º Grado</span>
                <span className="text-[10px] text-slate-400">Álgebra & Polinomios</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">Dominado 100%</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <span className="font-bold text-white block">Leyes de Newton y Dinámica</span>
                <span className="text-[10px] text-slate-400">Física Clásica</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px]">Repasar Hoy</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <span className="font-bold text-white block">Tabla Periódica & Enlaces</span>
                <span className="text-[10px] text-slate-400">Química Inorgánica</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">Dominado 90%</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <span className="font-bold text-white block">Célula & Ciclo de Krebs</span>
                <span className="text-[10px] text-slate-400">Biología Celular</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">Dominado 85%</span>
            </div>
          </div>
        </div>
      )}

      {/* Dock Inferior Ultra-Minimalista de Escuela IA */}
      <MiniAppBottomNav
        experienceId="school"
        onOpenMenu={() => setIsSubmenuOpen(true)}
        items={[
          {
            id: 'tutor',
            label: 'Tutor IA',
            icon: Sparkles,
            isActive: activeTab === 'tutor',
            onClick: () => setActiveTab('tutor')
          },
          {
            id: 'ocr',
            label: 'Escáner OCR',
            icon: Scan,
            badge: '+25 XP',
            isActive: activeTab === 'ocr',
            onClick: () => setActiveTab('ocr')
          },
          {
            id: 'map',
            label: 'Mapa Curricular',
            icon: Compass,
            isActive: activeTab === 'map',
            onClick: () => setActiveTab('map')
          }
        ]}
      />

      {/* Submenú Desplegable Discreto hacia arriba */}
      <MiniAppSubmenuSheet
        isOpen={isSubmenuOpen}
        onClose={() => setIsSubmenuOpen(false)}
        experienceId="school"
        onNavigateExperience={onNavigateExperience}
        onSelectAction={(actionId) => {
          if (actionId === 'learn') setActiveTab('tutor');
          if (actionId === 'lab') setActiveTab('ocr');
          if (actionId === 'tests') setActiveTab('map');
          if (actionId === 'subj-math') setSelectedSubject('Matemáticas');
          if (actionId === 'subj-physics') setSelectedSubject('Física & Química');
          if (actionId === 'subj-lang') setSelectedSubject('Lengua y Literatura');
          if (actionId === 'subj-bio') setSelectedSubject('Biología & Ciencias');
          if (actionId === 'subj-hist') setSelectedSubject('Historia & Geo');
        }}
      />

    </div>
  );
};

export default SchoolView;
