import React, { useState } from 'react';
import { 
  Mic, MessageSquare, Sparkles, BookOpen, PenTool, Activity, 
  TrendingUp, Layers, Lock, Radio, Headphones, Settings, 
  Compass, Award, Globe, Trophy, FlaskConical 
} from 'lucide-react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { MemoryService } from './services/memoryService';
import { NextBestActionEngine } from './services/nextBestAction';
import { StudentLanguageProfile, NextBestActionRecommendation, LanguageInfo, CEFRLevel } from './types';

// Componentes Modulares
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
import { MiniAppSubHeader } from '../../core/components/navigation/MiniAppSubHeader';
import { MiniAppBottomNav, MiniAppPillar } from '../../core/components/navigation/MiniAppBottomNav';
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
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', cefrDefault: 'B2', accent: 'Standard', speechVoiceLang: 'it-IT', samplePrompt: 'Come possiamo esplorare lo空间 profondo?' },
  { code: 'pt', name: 'Portugués', nativeName: 'Português', flag: '🇵🇹', cefrDefault: 'B1', accent: 'Europeu / Brasil', speechVoiceLang: 'pt-PT', samplePrompt: 'Qual é a maior estrela do universo conocido?' }
];

export const LanguagesView: React.FC<LanguagesViewProps> = ({ onBackToGoals, onOpenAuth, onNavigateExperience }) => {
  const { userData, addXP } = useProgress();
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

  const languagesXP = userData?.experiences?.languages?.xp || 0;

  const handleLanguageChange = (lang: LanguageInfo) => {
    const updated = MemoryService.updateProfile({ targetLanguage: lang.name });
    setProfile(updated);
    setRecommendation(NextBestActionEngine.calculateNextAction());
  };

  const handleAddXP = (amount: number, reason: string) => {
    addXP(amount, 'languages', reason);
    setRecommendation(NextBestActionEngine.calculateNextAction());
  };

  const handleExecuteRecommendation = () => {
    if (recommendation.suggestedPrompt) {
      setActivePrompt(recommendation.suggestedPrompt);
      setActiveTab('voice');
    }
  };

  const handleUpdateLevel = (newLevel: CEFRLevel) => {
    const updated = MemoryService.updateProfile({ overallLevel: newLevel });
    setProfile(updated);
    setRecommendation(NextBestActionEngine.calculateNextAction());
  };

  // Mapeo entre Dock y Tabs
  const handleSelectPillar = (pillar: MiniAppPillar) => {
    if (pillar === 'learn') setActiveTab('voice');
    else if (pillar === 'lab') setActiveTab('roleplay');
    else if (pillar === 'tests') setActiveTab('mastery');
  };

  const currentPillar: MiniAppPillar = 
    ['voice', 'practice', 'stories', 'grammar'].includes(activeTab) ? 'learn' :
    ['roleplay', 'writing', 'listening', 'pronunciation'].includes(activeTab) ? 'lab' : 'tests';

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
      
      {/* Banner de Invitación si no está logeado */}
      {!isAuthenticated && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-cyan-300 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Navegación Libre: Explora el Profesor Particular IA. Inicia sesión para guardar tu historial pedagógico.</span>
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

      {/* Selector Compacto de Idiomas & Nivel Activo */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
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

      {/* Tarjeta del Profesor y Recomendación Adaptativa (Next Best Action) */}
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

      {/* Barra Rápida de Módulos */}
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

      {/* Contenedor Reactivo de Módulos */}
      <div className="transition-all duration-300">
        {activeTab === 'voice' && (
          <VoiceConversationArena
            profile={profile}
            initialPrompt={activePrompt}
            onAddXP={handleAddXP}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeGeneratorPad
            profile={profile}
            onAddXP={handleAddXP}
          />
        )}

        {activeTab === 'roleplay' && (
          <RoleplayStudio
            profile={profile}
            onAddXP={handleAddXP}
          />
        )}

        {activeTab === 'stories' && (
          <StoryLab
            profile={profile}
            onAddXP={handleAddXP}
          />
        )}

        {activeTab === 'writing' && (
          <WritingTranslationBench
            profile={profile}
            onAddXP={handleAddXP}
          />
        )}

        {activeTab === 'listening' && (
          <ListeningDeckPad
            profile={profile}
            onAddXP={handleAddXP}
          />
        )}

        {activeTab === 'grammar' && (
          <GrammarClinicPad
            profile={profile}
            onAddXP={handleAddXP}
          />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationWaveCoach
            profile={profile}
            onAddXP={handleAddXP}
          />
        )}

        {activeTab === 'mastery' && (
          <ProgressMasteryGrid profile={profile} />
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

      {/* Dock Inferior Ultra-Minimalista de Idiomas (5 Pestañas Dinámicas) */}
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
