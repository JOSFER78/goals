import React, { useState } from 'react';
import { 
  Mic, MessageSquare, Sparkles, BookOpen, PenTool, Activity, 
  TrendingUp, Layers, Lock, Radio, Headphones, Settings, 
  Compass, Award, Globe 
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

interface LanguagesViewProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'Inglés', nativeName: 'English', flag: '🇬🇧', cefrDefault: 'B2', accent: 'Oxford & US', speechVoiceLang: 'en-US', samplePrompt: 'Can you tell me about the James Webb telescope discoveries?' },
  { code: 'fr', name: 'Francés', nativeName: 'Français', flag: '🇫🇷', cefrDefault: 'B1', accent: 'Standard', speechVoiceLang: 'fr-FR', samplePrompt: 'Comment fonctionne la théorie de la relativité ?' },
  { code: 'de', name: 'Alemán', nativeName: 'Deutsch', flag: '🇩🇪', cefrDefault: 'B1', accent: 'Hochdeutsch', speechVoiceLang: 'de-DE', samplePrompt: 'Was ist der Unterschied zwischen Stern und Planet?' },
  { code: 'ja', name: 'Japonés', nativeName: '日本語', flag: '🇯🇵', cefrDefault: 'A2', accent: 'Tokyo Hyojungo', speechVoiceLang: 'ja-JP', samplePrompt: 'Kore wa nihongo no gakushuu desu ka?' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', cefrDefault: 'B2', accent: 'Standard', speechVoiceLang: 'it-IT', samplePrompt: 'Come possiamo esplorare lo spazio profondo?' },
  { code: 'pt', name: 'Portugués', nativeName: 'Português', flag: '🇵🇹', cefrDefault: 'B1', accent: 'Europeu / Brasil', speechVoiceLang: 'pt-PT', samplePrompt: 'Qual é a maior estrela do universo conhecido?' }
];

export const LanguagesView: React.FC<LanguagesViewProps> = ({ onOpenAuth }) => {
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

  return (
    <div className="w-full space-y-5 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-24 font-display">
      
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

      {/* Barra de Herramientas de Personalización y Diagnóstico */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDiagnosticOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Test de Nivel Adaptativo (CEFR)</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Ajustes del Profesor</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Nivel Activo: <strong className="text-cyan-300">{profile.overallLevel}</strong> • {profile.targetLanguage}
        </span>
      </div>

      {/* Selector Orbital de Idiomas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSel = profile.targetLanguage.toLowerCase().includes(lang.name.toLowerCase());
          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={`p-3 rounded-2xl border text-left space-y-1.5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden ${
                isSel
                  ? 'border-cyan-400/80 bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/40'
                  : 'border-slate-800/80 bg-slate-950/80 hover:border-cyan-500/40 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{lang.flag}</span>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  {lang.cefrDefault}
                </span>
              </div>
              <p className="font-extrabold text-xs text-white leading-tight">{lang.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{lang.accent}</p>
            </button>
          );
        })}
      </div>

      {/* Barra de Navegación de Experiencias Pedagógicas (9 Módulos) */}
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
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
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

    </div>
  );
};
