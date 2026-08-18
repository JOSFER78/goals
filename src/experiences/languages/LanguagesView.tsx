import React, { useState } from 'react';
import { 
  MessageSquare, Sparkles, BookOpen, PenTool, Activity, 
  TrendingUp, Layers, Lock, Radio, Headphones, Settings, 
  Compass, Trophy, FlaskConical, Loader2, Zap
} from 'lucide-react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { MemoryService } from './services/memoryService';
import { NextBestActionEngine } from './services/nextBestAction';
import { StudentLanguageProfile, NextBestActionRecommendation, LanguageInfo, CEFRLevel } from './types';

// Componentes del Motor Agéntico de IA
import { DynamicExerciseEngine } from '../../core/services/DynamicExerciseEngine';
import { DynamicExercisePlayer } from '../../core/components/exercises/DynamicExercisePlayer';
import { InfographicAgentService } from '../../core/services/InfographicAgentService';
import { VisualKnowledgeBoard } from '../../core/components/infographics/VisualKnowledgeBoard';
import { DynamicExerciseBatch } from '../../core/types/dynamicExercise';
import { EducationalInfographicPayload } from '../../core/types/visualInfographic';

// Componentes Modulares de Idiomas
import { TeacherCard } from './components/TeacherCard';
import { VoiceConversationArena } from './components/VoiceConversationArena';
import { PracticeGeneratorPad } from './components/PracticeGeneratorPad';
import { RoleplayStudio } from './components/RoleplayStudio';
import { StoryLab } from './components/StoryLab';
import { WritingTranslationBench } from './components/WritingTranslationBench';
import { ListeningDeckPad } from './components/ListeningDeckPad';
import { GrammarClinicPad } from './components/GrammarClinicPad';
import { PronunciationWaveCoach } from './components/PronunciationWaveCoach';
import { ProgressMasteryGrid } from './components/ProgressMasteryGrid';
import { MultimodalCardModal } from './components/MultimodalCardModal';
import { PlacementDiagnosticModal } from './components/PlacementDiagnosticModal';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';

// Componentes del Sistema de Navegación Universal
import { MiniAppBottomNav } from '../../core/components/navigation/MiniAppBottomNav';
import { MiniAppSubmenuSheet, SubmenuSection } from '../../core/components/navigation/MiniAppSubmenuSheet';
import { ExperienceId } from '../../core/types';

interface LanguagesViewProps {
  onBackToGoals?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigateExperience?: (expId: ExperienceId) => void;
}

const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'Inglés', nativeName: 'English', flag: '🇬🇧', cefrDefault: 'B2', accent: 'Oxford & US', speechVoiceLang: 'en-US', samplePrompt: 'Can you tell me about the James Webb telescope discoveries?' },
  { code: 'fr', name: 'Francés', nativeName: 'Français', flag: '🇫🇷', cefrDefault: 'B1', accent: 'Standard', speechVoiceLang: 'fr-FR', samplePrompt: 'Comment fonctionne la théorie de la relativité ?' },
  { code: 'de', name: 'Alemán', nativeName: 'Deutsch', flag: '🇩🇪', cefrDefault: 'B1', accent: 'Hochdeutsch', speechVoiceLang: 'de-DE', samplePrompt: 'Was ist der Unterschied zwischen Stern und Planet?' },
  { code: 'ja', name: 'Japonés', nativeName: '日本語', flag: '🇯🇵', cefrDefault: 'A2', accent: 'Tokyo Hyojungo', speechVoiceLang: 'ja-JP', samplePrompt: 'Kore wa nihongo no gakushuu desu ka?' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', cefrDefault: 'B2', accent: 'Standard', speechVoiceLang: 'it-IT', samplePrompt: 'Come possiamo esplorare lo spazio profondo?' },
  { code: 'pt', name: 'Portugués', nativeName: 'Português', flag: '🇵🇹', cefrDefault: 'B1', accent: 'Europeu / Brasil', speechVoiceLang: 'pt-PT', samplePrompt: 'Qual é a maior estrela do universo conocido?' }
];

const QUICK_LANGUAGE_TOPICS = [
  { id: 't1', label: 'Past Simple vs Present Perfect', desc: 'Diferenciación temporal y uso práctico' },
  { id: 't2', label: 'Phrasal Verbs de Uso Diario', desc: 'Get on, look up, turn down y más' },
  { id: 't3', label: 'Condicionales 1 & 2 (If Clauses)', desc: 'Estructuras reales e hipotéticas' },
  { id: 't4', label: 'Vocabulario de Viajes & Aeropuerto', desc: 'Embarque, aduanas e imprevistos' }
];

export const LanguagesView: React.FC<LanguagesViewProps> = ({ onOpenAuth, onNavigateExperience }) => {
  const { addXP } = useProgress();
  const { user } = useAuth();
  const isAuthenticated = !!(user && !user.isAnonymous);

  const [profile, setProfile] = useState<StudentLanguageProfile>(() => MemoryService.getProfile());
  const [recommendation, setRecommendation] = useState<NextBestActionRecommendation>(() => NextBestActionEngine.calculateNextAction());
  
  const [activeTab, setActiveTab] = useState<
    'voice' | 'practice' | 'roleplay' | 'stories' | 'writing' | 'listening' | 'grammar' | 'pronunciation' | 'mastery'
  >('voice');

  const [activePrompt, setActivePrompt] = useState<string>('');
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);

  // Estados del Motor Agéntico de IA
  const [dynamicBatch, setDynamicBatch] = useState<DynamicExerciseBatch | null>(null);
  const [isGeneratingExercises, setIsGeneratingExercises] = useState<boolean>(false);
  const [infographicData, setInfographicData] = useState<EducationalInfographicPayload | null>(null);
  const [isGeneratingInfographic, setIsGeneratingInfographic] = useState<boolean>(false);

  // Modales
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    concept: string;
    explanation: string;
  }>({
    isOpen: false,
    title: '',
    concept: '',
    explanation: ''
  });

  const handleLanguageChange = (lang: LanguageInfo) => {
    const updated = MemoryService.updateProfile({ targetLanguage: lang.name });
    setProfile(updated);
    setRecommendation(NextBestActionEngine.calculateNextAction());
  };

  const handleAddXP = (amount: number, reason: string) => {
    addXP(amount, 'languages', reason);
    setRecommendation(NextBestActionEngine.calculateNextAction());
  };

  const handleUpdateLevel = (newLevel: CEFRLevel) => {
    const updated = MemoryService.updateProfile({ overallLevel: newLevel });
    setProfile(updated);
    setRecommendation(NextBestActionEngine.calculateNextAction());
  };

  // Generador Agéntico de Ejercicios por IA Real
  const handleGenerateExercises = async (customTopic?: string) => {
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    const topicToUse = customTopic || `Vocabulario y estructuras gramaticales de nivel ${profile.overallLevel} en ${profile.targetLanguage}`;
    setIsGeneratingExercises(true);
    try {
      const batch = await DynamicExerciseEngine.generateExerciseBatch({
        topic: `${profile.targetLanguage} (Nivel ${profile.overallLevel}): ${topicToUse}`,
        discipline: 'languages',
        questionCount: 4,
        allowedTypes: ['choice', 'fill_gap', 'boolean']
      });
      setDynamicBatch(batch);
      setInfographicData(null);
    } catch (err: any) {
      console.error('Error generando ejercicios de idiomas:', err);
    } finally {
      setIsGeneratingExercises(false);
    }
  };

  // Generador Agéntico de Infografías y Mapas de Conjugación por IA Real
  const handleGenerateInfographic = async (customTopic?: string) => {
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    const topicToUse = customTopic || `Mapa conceptual de conjugación verbal, tiempos y reglas sintácticas clave en ${profile.targetLanguage} (Nivel ${profile.overallLevel})`;
    setIsGeneratingInfographic(true);
    try {
      const data = await InfographicAgentService.generateConceptualInfographic(
        `Idiomas (${profile.targetLanguage})`,
        topicToUse
      );
      setInfographicData(data);
      setDynamicBatch(null);
    } catch (err: any) {
      console.error('Error generando infografía de idiomas:', err);
    } finally {
      setIsGeneratingInfographic(false);
    }
  };

  // Ejecución adaptativa de la recomendación pedagógica
  const handleExecuteRecommendation = () => {
    if (recommendation.action === 'GENERATE_EXERCISE' || recommendation.action === 'REVIEW_ERROR' || recommendation.action === 'REVIEW_VOCABULARY') {
      handleGenerateExercises(recommendation.suggestedPrompt || recommendation.title);
      return;
    }
    if (recommendation.action === 'SHOW_VISUAL') {
      handleGenerateInfographic(recommendation.suggestedPrompt || recommendation.title);
      return;
    }
    if (recommendation.suggestedPrompt) {
      setActivePrompt(recommendation.suggestedPrompt);
      setActiveTab('voice');
    }
  };

  // Submenú Desplegable con los 9 módulos clasificados + opciones
  const submenuSections: SubmenuSection[] = [
    {
      title: 'Tutoría & Comprensión Oral',
      icon: BookOpen,
      items: [
        {
          id: 'tab-voice',
          label: 'Tutor Conversacional',
          description: 'Práctica socrática por voz en tiempo real con IA',
          icon: MessageSquare,
          badge: 'Voz Directa',
          isActive: activeTab === 'voice',
          onClick: () => setActiveTab('voice')
        },
        {
          id: 'tab-practice',
          label: 'Práctica Adaptativa',
          description: 'Ejercicios interactivos con IA generativa',
          icon: Sparkles,
          badge: '+15 XP',
          isActive: activeTab === 'practice',
          onClick: () => setActiveTab('practice')
        },
        {
          id: 'tab-stories',
          label: 'Cuentos Interactivos',
          description: 'Lecturas inmersivas con bifurcación de decisiones',
          icon: BookOpen,
          badge: '+25 XP',
          isActive: activeTab === 'stories',
          onClick: () => setActiveTab('stories')
        },
        {
          id: 'tab-grammar',
          label: 'Clínica de Gramática',
          description: 'Diagnóstico y reparación de patrones sintácticos',
          icon: Layers,
          badge: 'Estructuras',
          isActive: activeTab === 'grammar',
          onClick: () => setActiveTab('grammar')
        }
      ]
    },
    {
      title: 'Laboratorios de Práctica Aplicada',
      icon: FlaskConical,
      items: [
        {
          id: 'tab-roleplay',
          label: 'Roleplay Studio',
          description: 'Simulaciones en escenarios reales (aeropuerto, entrevista...)',
          icon: Radio,
          badge: 'Inmersión',
          isActive: activeTab === 'roleplay',
          onClick: () => setActiveTab('roleplay')
        },
        {
          id: 'tab-writing',
          label: 'Escritura & Traducción',
          description: 'Banco de redacción con corrección estilística IA',
          icon: PenTool,
          badge: '+20 XP',
          isActive: activeTab === 'writing',
          onClick: () => setActiveTab('writing')
        },
        {
          id: 'tab-listening',
          label: 'Listening Deck',
          description: 'Entrenamiento auditivo con acentos nativos reales',
          icon: Headphones,
          badge: 'Audio Real',
          isActive: activeTab === 'listening',
          onClick: () => setActiveTab('listening')
        },
        {
          id: 'tab-pronunciation',
          label: 'Fonética & Ondas',
          description: 'Visualizador de entonación y análisis acústico',
          icon: Activity,
          badge: 'Análisis Wave',
          isActive: activeTab === 'pronunciation',
          onClick: () => setActiveTab('pronunciation')
        }
      ]
    },
    {
      title: 'Evaluación & Dominio CEFR',
      icon: Trophy,
      items: [
        {
          id: 'tab-mastery',
          label: 'Matriz de Dominio CEFR',
          description: 'Progreso por habilidades A1-C2 y radar de fluidez',
          icon: TrendingUp,
          badge: profile.overallLevel,
          isActive: activeTab === 'mastery',
          onClick: () => setActiveTab('mastery')
        },
        {
          id: 'action-diagnostic',
          label: 'Test de Nivel Adaptativo',
          description: 'Prueba diagnóstica formativa de calibración CEFR',
          icon: Compass,
          badge: 'Diagnóstico',
          onClick: () => setIsDiagnosticOpen(true)
        }
      ]
    },
    {
      title: 'Ajustes del Profesor IA',
      icon: Settings,
      items: [
        {
          id: 'action-settings',
          label: 'Ajustes & Parámetros Pedagógicos',
          description: 'Personalizar velocidad, tono, corrección y voz',
          icon: Settings,
          badge: 'Config',
          onClick: () => setIsSettingsOpen(true)
        }
      ]
    }
  ];

  return (
    <div className="w-full space-y-5 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-28 font-display">
      
      {/* Banner de Modo Exploración Libre */}
      {!isAuthenticated && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-cyan-300 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Navegación Libre: Explora el Profesor Particular IA. Inicia sesión para guardar tu progreso y desbloquear todas las funciones.</span>
          </div>
          <button
            onClick={() => onOpenAuth?.('signup')}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shrink-0 transition-all text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Todo</span>
          </button>
        </div>
      )}

      {/* Selector Compacto de Idiomas & Nivel Activo con Target de Mascota */}
      <div 
        data-mascot-target="lang-selector"
        data-mascot-anchor="top-left"
        data-mascot-label="Selector de Idioma y Nivel CEFR"
        data-mascot-hint="Cambia el idioma objetivo o realiza una prueba diagnóstica adaptativa."
        className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Idioma:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSel = profile.targetLanguage.toLowerCase().includes(lang.name.toLowerCase());
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSel 
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsDiagnosticOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            title="Test de Nivel Adaptativo (CEFR)"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-mono">Nivel {profile.overallLevel}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-cyan-300 border border-slate-800 text-xs font-bold transition-all cursor-pointer"
            title="Ajustes del Profesor"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Tarjeta del Profesor y Recomendación Adaptativa con Target de Mascota */}
      <div
        data-mascot-target="teacher-card"
        data-mascot-anchor="top-right"
        data-mascot-label="Profesor Particular IA y Próxima Mejor Acción"
        data-mascot-hint="Tu tutor personal analiza tus fortalezas y te propone el siguiente paso óptimo."
      >
        <TeacherCard
          profile={profile}
          recommendation={recommendation}
          isListening={isListeningVoice}
          onStartVoiceChat={() => {
            setActiveTab('voice');
            setIsListeningVoice(prev => !prev);
          }}
          onExecuteRecommendation={handleExecuteRecommendation}
        />
      </div>

      {/* Dock de Acciones Rápidas del Motor Agéntico (Generación Real IA) */}
      <div 
        data-mascot-target="agentic-action-dock"
        data-mascot-anchor="top-center"
        data-mascot-label="Acciones Rápidas del Motor Agéntico"
        data-mascot-hint="Genera ejercicios dinámicos por IA o infografías de conjugación y gramática al vuelo."
        className="p-4 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-cyan-500/20 shadow-xl backdrop-blur-xl space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Motor Agéntico de {profile.targetLanguage}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  Nivel {profile.overallLevel}
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">Generación pedagógica dinámica en tiempo real por IA.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerateExercises()}
              disabled={isGeneratingExercises}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingExercises ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generando Reto...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generar Reto Rápido IA</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleGenerateInfographic()}
              disabled={isGeneratingInfographic}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGeneratingInfographic ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creando Infografía...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mapa de Conjugación & Gramática</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Chips de Temas Rápidos Contextuales */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold shrink-0">Temas directos:</span>
          {QUICK_LANGUAGE_TOPICS.map((top) => (
            <button
              key={top.id}
              onClick={() => handleGenerateExercises(top.label)}
              className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-cyan-500/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 border border-slate-800 text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              <span>{top.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Renderizado de Batería de Ejercicios Dinámicos de IA (Vocab Builder) */}
      {dynamicBatch && (
        <div 
          data-mascot-target="vocab-builder"
          data-mascot-anchor="top-right"
          data-mascot-label="Batería de Ejercicios Dinámicos de Idiomas (IA)"
          data-mascot-hint="Resuelve retos interactivos de léxico y gramática adaptados a tu nivel."
          className="space-y-4 animate-fadeIn"
        >
          <DynamicExercisePlayer
            batch={dynamicBatch}
            onClose={() => setDynamicBatch(null)}
            onGenerateMore={() => handleGenerateExercises()}
            onFinish={(result) => {
              handleAddXP(result.totalXpEarned, `Batería de ejercicios de ${profile.targetLanguage} completada`);
            }}
          />
        </div>
      )}

      {/* Renderizado de Infografía / Mapa de Conjugación Agéntico IA */}
      {infographicData && (
        <div 
          data-mascot-target="grammar-infographic"
          data-mascot-anchor="top-left"
          data-mascot-label="Pizarrón Visual de Conjugaciones e Infografías"
          data-mascot-hint="Mapas conceptuales interactivos de tiempos verbales, reglas y analogías."
          className="space-y-4 animate-fadeIn"
        >
          <VisualKnowledgeBoard
            infographic={infographicData}
            onClose={() => setInfographicData(null)}
          />
        </div>
      )}

      {/* Barra Rápida de Módulos con Pestañas */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'voice', label: 'Tutor Conversacional', icon: MessageSquare },
          { id: 'practice', label: 'Práctica Adaptativa', icon: Sparkles },
          { id: 'roleplay', label: 'Roleplay Studio', icon: Radio },
          { id: 'stories', label: 'Cuentos Interactivos', icon: BookOpen },
          { id: 'writing', label: 'Escritura & Traducción', icon: PenTool },
          { id: 'listening', label: 'Listening Deck', icon: Headphones },
          { id: 'grammar', label: 'Clínica de Gramática', icon: Layers },
          { id: 'pronunciation', label: 'Fonética & Ondas', icon: Activity },
          { id: 'mastery', label: 'Dominio CEFR', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isAct
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-black scale-102'
                  : 'bg-slate-900/80 text-slate-400 hover:text-cyan-300 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenedor Reactivo de Módulos con Targets Espaciales */}
      <div className="transition-all duration-300">
        {activeTab === 'voice' && (
          <div
            data-mascot-target="speaking-lab"
            data-mascot-anchor="top-right"
            data-mascot-label="Laboratorio de Voz y Práctica Conversacional"
            data-mascot-hint="Habla al micrófono en tiempo real para practicar conversación natural con el profesor IA."
          >
            <VoiceConversationArena
              profile={profile}
              initialPrompt={activePrompt}
              onAddXP={handleAddXP}
            />
          </div>
        )}

        {activeTab === 'practice' && (
          <div
            data-mascot-target="vocab-builder"
            data-mascot-anchor="top-right"
            data-mascot-label="Práctica Adaptativa de Léxico"
            data-mascot-hint="Genera ejercicios interactivos con IA adaptados a tus fortalezas."
          >
            <PracticeGeneratorPad
              profile={profile}
              onAddXP={handleAddXP}
            />
          </div>
        )}

        {activeTab === 'roleplay' && (
          <div
            data-mascot-target="roleplay-studio"
            data-mascot-anchor="top-right"
            data-mascot-label="Estudio de Roleplay y Diálogos Situacionales"
            data-mascot-hint="Entrena situaciones del mundo real como entrevistas, aeropuertos y cafés."
          >
            <RoleplayStudio
              profile={profile}
              onAddXP={handleAddXP}
            />
          </div>
        )}

        {activeTab === 'stories' && (
          <div
            data-mascot-target="story-lab"
            data-mascot-anchor="top-right"
            data-mascot-label="Cuentos Interactivos y Comprensión Lectora"
            data-mascot-hint="Historias ramificadas donde tus decisiones moldean el desenlace en el idioma objetivo."
          >
            <StoryLab
              profile={profile}
              onAddXP={handleAddXP}
            />
          </div>
        )}

        {activeTab === 'writing' && (
          <div
            data-mascot-target="writing-bench"
            data-mascot-anchor="top-right"
            data-mascot-label="Banco de Redacción y Traducción Estilística"
            data-mascot-hint="Redacta textos y recibe feedback instantáneo sobre fluidez, registro y gramática."
          >
            <WritingTranslationBench
              profile={profile}
              onAddXP={handleAddXP}
            />
          </div>
        )}

        {activeTab === 'listening' && (
          <div
            data-mascot-target="listening-deck"
            data-mascot-anchor="top-right"
            data-mascot-label="Deck de Comprensión Auditiva y Acentos"
            data-mascot-hint="Agudiza tu oído con acentos reales y transcripciones guiadas."
          >
            <ListeningDeckPad
              profile={profile}
              onAddXP={handleAddXP}
            />
          </div>
        )}

        {activeTab === 'grammar' && (
          <div
            data-mascot-target="grammar-clinic"
            data-mascot-anchor="top-right"
            data-mascot-label="Clínica de Diagnóstico y Estructuras Gramaticales"
            data-mascot-hint="Diagnostica y repara estructuras sintácticas, tiempos verbales y preposiciones."
          >
            <GrammarClinicPad
              profile={profile}
              onAddXP={handleAddXP}
            />
          </div>
        )}

        {activeTab === 'pronunciation' && (
          <div
            data-mascot-target="pronunciation-coach"
            data-mascot-anchor="top-right"
            data-mascot-label="Entrenador de Fonética y Ondas Acústicas"
            data-mascot-hint="Visualiza tu entonación acústica y perfecciona tu acento fonema a fonema."
          >
            <PronunciationWaveCoach
              profile={profile}
              onAddXP={handleAddXP}
            />
          </div>
        )}

        {activeTab === 'mastery' && (
          <div
            data-mascot-target="cefr-mastery"
            data-mascot-anchor="top-right"
            data-mascot-label="Matriz de Dominio y Radar de Habilidades CEFR"
            data-mascot-hint="Supervisa tu progreso en las 4 destrezas lingüísticas del marco europeo CEFR."
          >
            <ProgressMasteryGrid profile={profile} />
          </div>
        )}
      </div>

      {/* Modales Interactivos */}
      <PlacementDiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        profile={profile}
        onUpdateLevel={handleUpdateLevel}
      />

      <TeacherSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onProfileUpdated={(up) => setProfile(up)}
      />

      <MultimodalCardModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData(prev => ({ ...prev, isOpen: false }))}
        title={modalData.title}
        concept={modalData.concept}
        explanation={modalData.explanation}
      />

      {/* Dock Inferior Ultra-Minimalista de Idiomas */}
      <MiniAppBottomNav
        experienceId="languages"
        onOpenMenu={() => setIsSubmenuOpen(true)}
        items={[
          {
            id: 'voice',
            label: 'Voz en Vivo',
            icon: MessageSquare,
            badge: 'IA',
            isActive: activeTab === 'voice',
            onClick: () => setActiveTab('voice')
          },
          {
            id: 'roleplay',
            label: 'Roleplay',
            icon: Radio,
            isActive: activeTab === 'roleplay',
            onClick: () => setActiveTab('roleplay')
          },
          {
            id: 'writing',
            label: 'Escritura',
            icon: PenTool,
            isActive: activeTab === 'writing',
            onClick: () => setActiveTab('writing')
          },
          {
            id: 'listening',
            label: 'Listening',
            icon: Headphones,
            isActive: activeTab === 'listening' || activeTab === 'pronunciation',
            onClick: () => setActiveTab('listening')
          },
          {
            id: 'mastery',
            label: 'Nivel CEFR',
            icon: Trophy,
            badge: profile.overallLevel,
            isActive: activeTab === 'mastery',
            onClick: () => setActiveTab('mastery')
          }
        ]}
      />

      {/* Submenú Desplegable Discreto hacia arriba */}
      <MiniAppSubmenuSheet
        isOpen={isSubmenuOpen}
        onClose={() => setIsSubmenuOpen(false)}
        experienceId="languages"
        onNavigateExperience={onNavigateExperience}
        submenuSections={submenuSections}
        onSelectAction={(actionId) => {
          if (actionId === 'learn') setActiveTab('voice');
          if (actionId === 'lab') setActiveTab('roleplay');
          if (actionId === 'tests') setActiveTab('mastery');
          if (actionId === 'lang-en') { const l = SUPPORTED_LANGUAGES.find(x => x.code === 'en'); if (l) handleLanguageChange(l); }
          if (actionId === 'lang-fr') { const l = SUPPORTED_LANGUAGES.find(x => x.code === 'fr'); if (l) handleLanguageChange(l); }
          if (actionId === 'lang-de') { const l = SUPPORTED_LANGUAGES.find(x => x.code === 'de'); if (l) handleLanguageChange(l); }
          if (actionId === 'lang-it') { const l = SUPPORTED_LANGUAGES.find(x => x.code === 'it'); if (l) handleLanguageChange(l); }
          if (actionId === 'lang-zh') { const l = SUPPORTED_LANGUAGES.find(x => x.code === 'ja'); if (l) handleLanguageChange(l); }
        }}
      />

    </div>
  );
};

export default LanguagesView;
