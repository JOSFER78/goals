import React, { useState } from 'react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { CRITERIO_MODULES } from './data/modulesData';
import { CriterioModule, CriterioAgeBracket, CriterioCompetencyId } from './types';
import { CriterioHeader } from './components/CriterioHeader';
import { CriterioHero } from './components/CriterioHero';
import { ModuleCard } from './components/ModuleCard';
import { ModuleViewerModal } from './components/ModuleViewerModal';
import { FeedSimulatorLab } from './components/FeedSimulatorLab';
import { TrainingMissionsModal } from './components/TrainingMissionsModal';
import { AIFilterLabModal } from './components/AIFilterLabModal';
import { MatizaToolModal } from './components/MatizaToolModal';
import { EcosystemShowcase } from './components/EcosystemShowcase';
import { 
  Lock, BookOpen, FlaskConical, Trophy, Sparkles, 
  Radio, Layers, Scale, Brain, 
  MessageSquare, AlertTriangle, Zap, 
  Loader2, Eye, Send, Shield
} from 'lucide-react';

// Servicios Agénticos y Componentes de Generación en Tiempo Real (Cero Mocks)
import { DynamicExerciseEngine } from '../../core/services/DynamicExerciseEngine';
import { DynamicExerciseBatch } from '../../core/types/dynamicExercise';
import { DynamicExercisePlayer } from '../../core/components/exercises/DynamicExercisePlayer';
import { InfographicAgentService } from '../../core/services/InfographicAgentService';
import { EducationalInfographicPayload } from '../../core/types/visualInfographic';
import { VisualKnowledgeBoard } from '../../core/components/infographics/VisualKnowledgeBoard';
import { askAI } from '../../core/services/aiService';

// Componentes del Sistema de Navegación Universal
import { MiniAppBottomNav } from '../../core/components/navigation/MiniAppBottomNav';
import { MiniAppSubmenuSheet, DiscreteMenuItem } from '../../core/components/navigation/MiniAppSubmenuSheet';
import { ExperienceId } from '../../core/types';

export type CriterioTab = 
  | 'modules' 
  | 'fallacies' 
  | 'biases' 
  | 'ethics' 
  | 'debate' 
  | 'feed_lab' 
  | 'missions' 
  | 'ai_lab' 
  | 'matiza'
  | 'ecosystem';

interface CriterioExperienceProps {
  onBackToGoals?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigateExperience?: (expId: ExperienceId) => void;
}

// Catálogo Curado de Falacias Lógicas
const FALLACY_CATALOG = [
  {
    id: 'ad_hominem',
    name: 'Ad Hominem',
    latin: 'Argumentum ad hominem',
    badge: 'Ataque Personal',
    description: 'Descalificar el argumento atacando a la persona que lo formula en vez de refutar su lógica o sus datos.',
    example: '«No le hagas caso a ese estudio sobre el clima; el científico que lo escribió me cae mal».',
    detectionTip: 'Pregúntate: ¿El ataque personal invalida la evidencia objetiva presentada?',
    topicPrompt: 'Falacia Ad Hominem: Desmontaje de ataques personales en debates científicos y redes sociales'
  },
  {
    id: 'strawman',
    name: 'Hombre de Paja',
    latin: 'Straw Man Fallacy',
    badge: 'Distorsión',
    description: 'Caricaturizar, exagerar o deformar la postura de la otra persona para que sea mucho más fácil atacarla.',
    example: '«Dices que debemos controlar el uso del móvil, así que quieres que volvamos a la Edad de Piedra».',
    detectionTip: 'Verifica si la réplica responde a lo que realmente se dijo o a una versión ridícula inventada.',
    topicPrompt: 'Falacia del Hombre de Paja: Detección de posturas exageradas y deformadas'
  },
  {
    id: 'false_dilemma',
    name: 'Falsa Dicotomía',
    latin: 'Bifurcatio / Falso Dilema',
    badge: 'Polarización',
    description: 'Presentar una situación compleja como si solo existieran dos únicas opciones opuestas, ignorando los puntos intermedios.',
    example: '«O estás al 100% con nuestro equipo o estás totalmente en nuestra contra».',
    detectionTip: 'Busca siempre la escala de grises y las terceras opciones viables.',
    topicPrompt: 'Falsa Dicotomía: Identificación de falsos dilemas binarios y búsqueda de matices intermedios'
  },
  {
    id: 'appeal_authority',
    name: 'Apelación Indebida a la Autoridad',
    latin: 'Ad Verecundiam',
    badge: 'Falso Experto',
    description: 'Dar por válida una afirmación únicamente porque la dice un famoso o un experto en un campo completamente ajeno.',
    example: '«Este actor famoso dice que esta dieta cura todas las enfermedades, así que debe ser verdad».',
    detectionTip: 'Comprueba si la fuente citada tiene competencia profesional contrastada en la materia.',
    topicPrompt: 'Falacia Ad Verecundiam: Apelación a falsas autoridades e influencers de salud'
  },
  {
    id: 'slippery_slope',
    name: 'Pendiente Resbaladiza',
    latin: 'Slippery Slope',
    badge: 'Catastrofismo',
    description: 'Afirmar que un primer paso inevitablemente conducirá a una cadena de consecuencias extremas y catastróficas sin demostrar el nexo causal.',
    example: '«Si permitimos que los alumnos usen calculadora hoy, mañana no sabrán ni leer».',
    detectionTip: 'Exige que se demuestre cada eslabón de la cadena de causa y efecto.',
    topicPrompt: 'Pendiente Resbaladiza: Análisis de cadenas causales forzadas y alarmismo sin evidencia'
  },
  {
    id: 'post_hoc',
    name: 'Correlación vs Causalidad',
    latin: 'Post hoc ergo propter hoc',
    badge: 'Falsa Causalidad',
    description: 'Asumir que porque el evento B ocurrió después del evento A, necesariamente A fue la causa de B.',
    example: '«Me puse mis zapatillas rojas y aprobé el examen; las zapatillas me dan suerte».',
    detectionTip: 'Recuerda: que dos hechos ocurran juntos no significa que uno cause al otro.',
    topicPrompt: 'Post Hoc Ergo Propter Hoc: Distinción entre correlación estadística y causa real'
  }
];

// Catálogo de Sesgos Cognitivos
const COGNITIVE_BIASES_CATALOG = [
  {
    id: 'confirmation_bias',
    name: 'Sesgo de Confirmación',
    icon: '🎯',
    tag: 'Filtro Selectivo',
    desc: 'Tendencia a buscar, interpretar y recordar únicamente los datos que ratifican lo que ya creíamos de antemano.',
    antidote: 'Busca activamente pruebas que contradigan tu propia hipótesis.'
  },
  {
    id: 'bandwagon_effect',
    name: 'Efecto Arrastre (Bandwagon)',
    icon: '👥',
    tag: 'Presión Social',
    desc: 'Adoptar una opinión o comportamiento solo porque vemos que una gran multitud o tendencia en redes lo respalda.',
    antidote: 'Evalúa los argumentos de fondo, no la cantidad de likes o seguidores.'
  },
  {
    id: 'anchoring_bias',
    name: 'Sesgo de Anclaje',
    icon: '⚓',
    tag: 'Primera Impresión',
    desc: 'Quedarse condicionado por la primera cifra o dato recibido, usándolo como referencia fija para juzgar todo lo demás.',
    antidote: 'Compara múltiples fuentes y referencias independientes antes de fijar un criterio.'
  },
  {
    id: 'availability_heuristic',
    name: 'Heurística de Disponibilidad',
    icon: '⚡',
    tag: 'Impacto Visual',
    desc: 'Sobreestimar la probabilidad de eventos llamativos o traumáticos solo porque los recordamos con mayor viveza.',
    antidote: 'Consulta estadísticas oficiales y porcentajes reales en vez de anécdotas impactantes.'
  },
  {
    id: 'dunning_kruger',
    name: 'Efecto Dunning-Kruger',
    icon: '🏔️',
    tag: 'Exceso de Certeza',
    desc: 'Tener una confianza desmedida en un tema cuando apenas se conocen los fundamentos superficiales.',
    antidote: 'Cultiva la humildad intelectual: cuanto más profundizas, más matices descubres.'
  },
  {
    id: 'blind_spot',
    name: 'Sesgo de Punto Ciego',
    icon: '🙈',
    tag: 'Autoengaño',
    desc: 'Reconocer con facilidad los prejuicios en los demás creyendo erróneamente que uno mismo es completamente imparcial.',
    antidote: 'Aplica el mismo rigor forense a tus propias convicciones que a las ajenas.'
  }
];

// Catálogo de Dilemas Éticos Contemporáneos
const ETHICAL_DILEMMAS_CATALOG = [
  {
    id: 'ai_privacy_school',
    title: 'IA de Reconocimiento Facial en el Aula',
    category: 'Privacidad vs Seguridad',
    conflict: '¿Deberían instalarse cámaras con IA en el colegio para detectar casos de bullying en tiempo real a costa de la privacidad continua de los estudiantes?',
    stakeholders: ['Alumnos', 'Familias', 'Docentes', 'Desarrolladores de IA']
  },
  {
    id: 'autonomous_car_trolley',
    title: 'El Algoritmo de Decisión en Vehículos Autónomos',
    category: 'Ética de la IA & Conducción',
    conflict: 'Ante un fallo mecánico imprevisto en carretera, ¿cómo debe priorizar el software de un coche autónomo la protección de los pasajeros frente a la de los peatones?',
    stakeholders: ['Pasajeros', 'Peatones', 'Fabricantes', 'Legisladores']
  },
  {
    id: 'content_moderation_speech',
    title: 'Moderación Algorítmica vs Libertad de Expresión',
    category: 'Democracia & Plataformas',
    conflict: '¿Deben los algoritmos de redes sociales censurar preventivamente afirmaciones dudosas antes de contrastarlas, o permitir su difusión adjuntando advertencias de contexto?',
    stakeholders: ['Usuarios', 'Verificadores', 'Plataformas Tecnológicas', 'Sociedad Civil']
  },
  {
    id: 'voice_cloning_consent',
    title: 'Clonación de Voz y Derechos de Identidad Póstuma',
    category: 'Propiedad Intelectual & IA',
    conflict: '¿Es éticamente aceptable utilizar grabaciones de un cantante o actor fallecido para generar nuevas obras mediante IA sin su consentimiento explícito en vida?',
    stakeholders: ['Herederos', 'Público', 'Empresas de IA', 'Artistas Vivos']
  }
];

export const CriterioExperience: React.FC<CriterioExperienceProps> = ({ 
  onOpenAuth, 
  onNavigateExperience 
}) => {
  const { userData, addXP, currencies } = useProgress();
  const { user } = useAuth();
  const isAuthenticated = !!(user && !user.isAnonymous);

  const [activeTab, setActiveTab] = useState<CriterioTab>('modules');
  const [ageBracket, setAgeBracket] = useState<CriterioAgeBracket>('10-12');
  const [selectedCompetency, setSelectedCompetency] = useState<CriterioCompetencyId | null>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);

  const [activeViewingModule, setActiveViewingModule] = useState<CriterioModule | null>(null);
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('goals_criterio_completed_modules');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Estados del Motor Agéntico de Ejercicios Dinámicos
  const [dynamicBatch, setDynamicBatch] = useState<DynamicExerciseBatch | null>(null);
  const [isGeneratingExercises, setIsGeneratingExercises] = useState<boolean>(false);

  // Estados del Motor Agéntico de Infografías y Esquemas Visuales
  const [infographicData, setInfographicData] = useState<EducationalInfographicPayload | null>(null);
  const [isGeneratingInfographic, setIsGeneratingInfographic] = useState<boolean>(false);

  // Estados de la Sala de Debate Socrático
  const [debateTopic] = useState<string>('¿Deberían prohibirse los teléfonos móviles en todas las escuelas?');
  const [debateInput, setDebateInput] = useState<string>('');
  const [isDebating, setIsDebating] = useState<boolean>(false);
  const [debateMessages, setDebateMessages] = useState<Array<{ role: 'user' | 'tutor'; content: string }>>([
    {
      role: 'tutor',
      content: '¡Bienvenido a la Arena Socrática! Mi objetivo no es decirte qué pensar, sino poner a prueba la solidez de tus premisas. ¿Cuál es tu postura inicial sobre este dilema y qué evidencia la respalda?'
    }
  ]);

  // Completar Módulo Curricular con Gamificación Unificada en Criterio
  const handleCompleteModule = (moduleId: number, xpReward: number) => {
    if (!completedModuleIds.includes(moduleId)) {
      const next = [...completedModuleIds, moduleId];
      setCompletedModuleIds(next);
      localStorage.setItem('goals_criterio_completed_modules', JSON.stringify(next));
    }
    addXP(xpReward, 'criterio', `Completado Módulo de Criterio #${moduleId}`);
    setActiveViewingModule(null);
  };

  // Recompensa de XP con Gamificación Unificada en Criterio
  const handleAddXP = (amount: number, reason: string) => {
    addXP(amount, 'criterio', reason);
  };

  // Generador Dinámico de Ejercicios de Lógica y Criterio
  const handleGenerateDynamicExercises = async (customTopic?: string) => {
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    const topicToUse = customTopic || debateTopic || 'Falacias lógicas, sesgos cognitivos y argumentación crítica';
    setIsGeneratingExercises(true);
    try {
      const batch = await DynamicExerciseEngine.generateExerciseBatch({
        topic: `Pensamiento Crítico y Lógica: ${topicToUse}`,
        discipline: 'criterio' as any,
        questionCount: 3,
        allowedTypes: ['choice', 'boolean', 'fill_gap']
      });
      setDynamicBatch(batch);
    } catch (err: any) {
      console.error('Error generando ejercicios dinámicos de criterio:', err);
    } finally {
      setIsGeneratingExercises(false);
    }
  };

  // Generador Agéntico de Infografías y Esquemas de Lógica
  const handleGenerateInfographic = async (topicTitle: string, customSubject: string = 'Pensamiento Crítico y Epistemología') => {
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    setIsGeneratingInfographic(true);
    try {
      const data = await InfographicAgentService.generateConceptualInfographic(
        customSubject,
        topicTitle
      );
      setInfographicData(data);
    } catch (err: any) {
      console.error('Error generando infografía visual:', err);
    } finally {
      setIsGeneratingInfographic(false);
    }
  };

  // Envío de réplica en la Sala de Debate Socrático
  const handleSendDebateMessage = async () => {
    if (!debateInput.trim() || isDebating) return;
    const userMsg = debateInput.trim();
    setDebateInput('');
    setDebateMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsDebating(true);

    try {
      const tutorReply = await askAI({
        messages: [
          {
            role: 'system',
            content: `Eres el Tutor Socrático de Pensamiento Crítico de GOALS. El alumno tiene ${ageBracket} años. El tema de debate es: "${debateTopic}". No des la respuesta; responde con una pregunta reflexiva mayéutica que exponga supuestos no probados, pida fuentes o explore consecuencias imprevistas.`
          },
          ...debateMessages.map(m => ({ role: m.role === 'tutor' ? 'assistant' as const : 'user' as const, content: m.content })),
          { role: 'user' as const, content: userMsg }
        ]
      });
      setDebateMessages(prev => [...prev, { role: 'tutor', content: tutorReply }]);
      addXP(15, 'criterio', 'Réplica dialéctica en Debate Socrático');
    } catch (err) {
      console.error('Error en debate socrático:', err);
      setDebateMessages(prev => [
        ...prev, 
        { 
          role: 'tutor', 
          content: 'Has planteado un punto interesante. Pero reflexiona: ¿es esa una regla universal aplicable a todos los casos o existen excepciones relevantes que cambian el resultado?' 
        }
      ]);
    } finally {
      setIsDebating(false);
    }
  };

  // Filtrado de Módulos según la competencia seleccionada
  const displayedModules = selectedCompetency
    ? CRITERIO_MODULES.filter((m) => m.competency === selectedCompetency)
    : CRITERIO_MODULES;

  const criterioScore = Math.min(100, Math.round((completedModuleIds.length / CRITERIO_MODULES.length) * 100) + 40);

  // Submenú Desplegable con Módulos, Laboratorios y Ecosistema
  const submenuSections: DiscreteMenuItem[] = [
    {
      title: 'Módulos Curriculares & Rigor',
      icon: BookOpen,
      items: [
        {
          id: 'modules-all',
          label: '12 Módulos Pedagógicos',
          description: `${completedModuleIds.length} de ${CRITERIO_MODULES.length} lecciones completadas`,
          icon: BookOpen,
          badge: `${completedModuleIds.length}/${CRITERIO_MODULES.length}`,
          isActive: activeTab === 'modules',
          onClick: () => setActiveTab('modules')
        },
        {
          id: 'tab-fallacies',
          label: 'Detector de Falacias Lógicas',
          description: 'Desmontaje de trampas retóricas y silogismos inválidos',
          icon: AlertTriangle,
          badge: 'Forense',
          isActive: activeTab === 'fallacies',
          onClick: () => setActiveTab('fallacies')
        },
        {
          id: 'tab-biases',
          label: 'Matriz de Sesgos Cognitivos',
          description: 'Identificación de atajos heurísticos y trampas mentales',
          icon: Brain,
          badge: 'Psicología',
          isActive: activeTab === 'biases',
          onClick: () => setActiveTab('biases')
        }
      ]
    },
    {
      title: 'Dialéctica, Ética & Algoritmos',
      icon: FlaskConical,
      items: [
        {
          id: 'tab-ethics',
          label: 'Dilemas Éticos Contemporáneos',
          description: 'Árboles de decisión y consecuencias morales en IA',
          icon: Scale,
          badge: 'Ética',
          isActive: activeTab === 'ethics',
          onClick: () => setActiveTab('ethics')
        },
        {
          id: 'tab-debate',
          label: 'Sala de Debate Socrático',
          description: 'Arena dialéctica con mayéutica y tutoría en vivo',
          icon: MessageSquare,
          badge: 'En Vivo',
          isActive: activeTab === 'debate',
          onClick: () => setActiveTab('debate')
        },
        {
          id: 'tab-feed-lab',
          label: 'Simulador de Feed & Algoritmos',
          description: 'Descubre cómo los algoritmos optimizan la retención',
          icon: Radio,
          badge: 'Simulador',
          isActive: activeTab === 'feed_lab',
          onClick: () => setActiveTab('feed_lab')
        },
        {
          id: 'tab-ai-lab',
          label: 'Laboratorio Forense de IA',
          description: 'Detección de contenido sintético, deepfakes y sesgos',
          icon: Sparkles,
          badge: 'Auditoría',
          isActive: activeTab === 'ai_lab',
          onClick: () => setActiveTab('ai_lab')
        },
        {
          id: 'tab-matiza',
          label: 'Herramienta MATIZA',
          description: 'Pensamiento en escala de grises y contraste oficial',
          icon: Layers,
          badge: 'Rigor',
          isActive: activeTab === 'matiza',
          onClick: () => setActiveTab('matiza')
        }
      ]
    },
    {
      title: 'Misiones de Entrenamiento',
      icon: Trophy,
      items: [
        {
          id: 'tab-missions',
          label: '60 Misiones Gamificadas (PAUSA)',
          description: 'Entrenamiento procedimental de verificación y fuentes',
          icon: Trophy,
          badge: '60 Retos',
          isActive: activeTab === 'missions',
          onClick: () => setActiveTab('missions')
        }
      ]
    },
    {
      title: 'Ecosistema GOALS Family',
      icon: Sparkles,
      items: [
        {
          id: 'tab-ecosystem',
          label: 'Descubre el Ecosistema GOALS',
          description: 'Escuela IA, Cosmos 3D, IA Lab e Idiomas con tutoría PRO',
          icon: Sparkles,
          badge: 'PRO Family',
          isActive: activeTab === 'ecosystem',
          onClick: () => setActiveTab('ecosystem')
        }
      ]
    }
  ];

  return (
    <div className="w-full space-y-5 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-28 font-display text-slate-100">
      
      {/* ── Cabecera Principal de Criterio con Banner Permanente y Telemetría Synapse ── */}
      <CriterioHeader
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab as CriterioTab);
          setDynamicBatch(null);
          setInfographicData(null);
        }}
        ageBracket={ageBracket}
        onChangeAgeBracket={setAgeBracket}
        criterioXP={userData?.experiences?.criterio?.xp || userData?.experiences?.verify?.xp || 0}
        completedModulesCount={completedModuleIds.length}
        totalModulesCount={CRITERIO_MODULES.length}
        synapseBalance={currencies?.synapse || 0}
        onOpenDynamicChallenge={() => handleGenerateDynamicExercises()}
        isGeneratingExercises={isGeneratingExercises}
      />

      {/* Renderizado de Batería de Ejercicios Dinámicos de IA */}
      {dynamicBatch && (
        <div 
          data-mascot-target="criterio-exercises"
          data-mascot-anchor="top-right"
          data-mascot-label="Panel de Ejercicios de Rigor IA"
          data-mascot-hint="Desafíos adaptativos de opción múltiple, cálculo deductivo y rellenado de premisas"
          className="space-y-4 animate-fadeIn"
        >
          <DynamicExercisePlayer
            batch={dynamicBatch}
            onClose={() => setDynamicBatch(null)}
            onGenerateMore={() => handleGenerateDynamicExercises()}
          />
        </div>
      )}

      {/* Renderizado de Infografía Agéntica IA */}
      {infographicData && (
        <div 
          data-mascot-target="philosophy-infographic"
          data-mascot-anchor="top-left"
          data-mascot-label="Pizarrón Visual de Epistemología y Lógica"
          data-mascot-hint="Diagramas de flujo de lógica formal y árboles de decisión generados por IA"
          className="space-y-4 animate-fadeIn"
        >
          <VisualKnowledgeBoard
            infographic={infographicData}
            onClose={() => setInfographicData(null)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TAB: 12 MÓDULOS CURRICULARES */}
      {/* ========================================================================= */}
      {activeTab === 'modules' && !dynamicBatch && !infographicData && (
        <div className="space-y-6 animate-fadeIn">
          <CriterioHero
            onStartDailyMission={() => setActiveTab('missions')}
            onOpenFeedLab={() => setActiveTab('feed_lab')}
            onOpenMatiza={() => setActiveTab('matiza')}
            onSelectCompetencyFilter={setSelectedCompetency}
            selectedCompetency={selectedCompetency}
            criterioScore={criterioScore}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base sm:text-lg text-white">
                Módulos de Alfabetización Informativa
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Mostrando {displayedModules.length} de {CRITERIO_MODULES.length} lecciones
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isCompleted={completedModuleIds.includes(module.id)}
                  onOpenModule={(mod) => setActiveViewingModule(mod)}
                />
              ))}
            </div>
          </div>

          {/* Escaparate del Ecosistema al final de la página de Módulos */}
          <EcosystemShowcase 
            onNavigateExperience={onNavigateExperience}
            onOpenAuth={onOpenAuth}
            className="mt-8"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: DETECTOR FORENSE DE FALACIAS LÓGICAS */}
      {/* ========================================================================= */}
      {activeTab === 'fallacies' && !dynamicBatch && !infographicData && (
        <div 
          data-mascot-target="fallacy-detector"
          data-mascot-anchor="top-right"
          data-mascot-label="Detector Forense de Falacias Lógicas"
          data-mascot-hint="Genera y resuelve ejercicios dinámicos de análisis de falacias y trampas argumentativas"
          className="space-y-5 animate-fadeIn"
        >
          {/* Header del Detector */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/20 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-black text-white">Detector Forense de Falacias Lógicas</h2>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Las falacias son patrones de razonamiento inválidos que parecen persuasivos pero carecen de solidez lógica. Aprende a identificarlas y neutralizarlas en tiempo real.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerateDynamicExercises('Falacias Lógicas y Deconstrucción de Silogismos')}
                  disabled={isGeneratingExercises}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingExercises ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>Entrenar Falacias con IA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateInfographic('Esquema Visual de Falacias Formales y Silogismos')}
                  disabled={isGeneratingInfographic}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingInfographic ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                  <span>Pizarrón Visual</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid de Falacias Lógicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FALLACY_CATALOG.map((f) => (
              <div 
                key={f.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300 space-y-3 relative overflow-hidden group shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      {f.badge}
                    </span>
                    <span className="text-[10px] font-mono italic text-slate-500">{f.latin}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-amber-400 transition-colors">
                      {f.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-amber-200/90 font-mono">
                    <span className="text-slate-500 block font-bold mb-0.5">Ejemplo Cotidiano:</span>
                    {f.example}
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-[11px] text-slate-300">
                    <strong className="text-amber-400">🛡️ Antídoto: </strong>
                    {f.detectionTip}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateDynamicExercises(f.topicPrompt)}
                    className="flex-1 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Practicar Caso</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateInfographic(f.name, 'Lógica Formal y Falacias')}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: MATRIZ DE SESGOS COGNITIVOS */}
      {/* ========================================================================= */}
      {activeTab === 'biases' && !dynamicBatch && !infographicData && (
        <div 
          data-mascot-target="cognitive-biases-matrix"
          data-mascot-anchor="top-left"
          data-mascot-label="Matriz de Sesgos Cognitivos"
          data-mascot-hint="Infografías y esquemas interactivos de sesgos y heurísticas del pensamiento"
          className="space-y-5 animate-fadeIn"
        >
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/20 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-black text-white">Matriz de Sesgos Cognitivos y Atajos Mentales</h2>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  El cerebro ahorra energía mediante heurísticas y trampas intuitivas. Conocer tus sesgos es el primer paso para pensar con independencia y rigor.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerateInfographic('Matriz de Sesgos Cognitivos y Trampas Heurísticas', 'Psicología Cognitiva y Rigor')}
                  disabled={isGeneratingInfographic}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingInfographic ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                  <span>Ver Pizarrón de Sesgos</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COGNITIVE_BIASES_CATALOG.map((b) => (
              <div 
                key={b.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300 space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{b.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      {b.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-white">{b.name}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{b.desc}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-emerald-300">
                    <strong className="text-emerald-400 block font-bold mb-0.5">💡 Estrategia de Neutralización:</strong>
                    {b.antidote}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateDynamicExercises(`Sesgo Cognitivo: ${b.name}`)}
                    className="w-full py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Evaluar mi sesgo con IA</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: LABORATORIO DE DILEMAS ÉTICOS */}
      {/* ========================================================================= */}
      {activeTab === 'ethics' && !dynamicBatch && !infographicData && (
        <div 
          data-mascot-target="ethical-dilemmas"
          data-mascot-anchor="top-right"
          data-mascot-label="Laboratorio de Dilemas Éticos"
          data-mascot-hint="Árboles de decisión moral y análisis de consecuencias en tecnología y sociedad"
          className="space-y-5 animate-fadeIn"
        >
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/20 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-black text-white">Laboratorio de Dilemas Éticos y Árboles de Decisión</h2>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  En la era digital, la tecnología plantea encrucijadas morales donde no existe una respuesta fácil. Analiza consecuencias, principios éticos y posturas contrapuestas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleGenerateDynamicExercises('Dilemas Éticos en Inteligencia Artificial y Sociedad Digital')}
                disabled={isGeneratingExercises}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingExercises ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Generar Caso Ético IA</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ETHICAL_DILEMMAS_CATALOG.map((d) => (
              <div 
                key={d.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300 space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      {d.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">4 Partes Implicadas</span>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-white">{d.title}</h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      {d.conflict}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Actores Afectados:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {d.stakeholders.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-medium text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateInfographic(d.title, 'Ética y Filosofía de la Tecnología')}
                    className="flex-1 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Árbol de Decisión Visual</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: SALA DE DEBATE SOCRÁTICO (ARENA MAYÉUTICA) */}
      {/* ========================================================================= */}
      {activeTab === 'debate' && !dynamicBatch && !infographicData && (
        <div 
          data-mascot-target="debate-arena"
          data-mascot-anchor="top-left"
          data-mascot-label="Sala de Debate Socrático"
          data-mascot-hint="Arena dialéctica con tutoría socrática en tiempo real y mayéutica"
          className="space-y-4 animate-fadeIn"
        >
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-amber-500/20 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white">Sala de Debate Socrático & Mayéutica</h3>
                <p className="text-xs text-slate-400">Tema: <strong className="text-amber-300">{debateTopic}</strong></p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleGenerateDynamicExercises(`Debate y Argumentación sobre: ${debateTopic}`)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Convertir a Reto Evaluado</span>
            </button>
          </div>

          {/* Historial de Turnos Dialécticos */}
          <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800/80 min-h-[280px] max-h-[420px] overflow-y-auto space-y-3 shadow-inner scrollbar-thin">
            {debateMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'tutor' && (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 text-xs font-black">
                    🏛️
                  </div>
                )}
                <div 
                  className={`p-3.5 rounded-2xl max-w-xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isDebating && (
              <div className="flex gap-2 items-center text-xs text-amber-400 italic">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sócrates está formulando su contra-pregunta...</span>
              </div>
            )}
          </div>

          {/* Input de Respuesta Dialéctica */}
          <div className="flex gap-2">
            <input
              type="text"
              value={debateInput}
              onChange={(e) => setDebateInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendDebateMessage(); }}
              placeholder="Escribe tu argumento o respuesta fundamentada..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all font-sans"
            />
            <button
              type="button"
              onClick={handleSendDebateMessage}
              disabled={!debateInput.trim() || isDebating}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: SIMULADOR DE FEED */}
      {/* ========================================================================= */}
      {activeTab === 'feed_lab' && (
        <div 
          data-mascot-target="feed-simulator"
          data-mascot-anchor="top-right"
          data-mascot-label="Simulador de Feed y Algoritmos de Retención"
          data-mascot-hint="Descubre cómo los algoritmos optimizan el tiempo de pantalla y la polarización"
        >
          <FeedSimulatorLab onAddXP={handleAddXP} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: ESCAPARATE DEL ECOSISTEMA GOALS FAMILY */}
      {/* ========================================================================= */}
      {activeTab === 'ecosystem' && !dynamicBatch && !infographicData && (
        <div className="space-y-6 animate-fadeIn">
          <EcosystemShowcase 
            onNavigateExperience={onNavigateExperience}
            onOpenAuth={onOpenAuth}
          />
        </div>
      )}

      {/* Modales Existentes */}
      <ModuleViewerModal
        module={activeViewingModule}
        ageBracket={ageBracket}
        isOpen={!!activeViewingModule}
        onClose={() => setActiveViewingModule(null)}
        onComplete={handleCompleteModule}
      />

      <TrainingMissionsModal
        isOpen={activeTab === 'missions'}
        onClose={() => setActiveTab('modules')}
        onAddXP={handleAddXP}
      />

      <AIFilterLabModal
        isOpen={activeTab === 'ai_lab'}
        onClose={() => setActiveTab('modules')}
        onAddXP={handleAddXP}
      />

      <MatizaToolModal
        isOpen={activeTab === 'matiza'}
        onClose={() => setActiveTab('modules')}
        onAddXP={handleAddXP}
      />

      {/* Dock Inferior Ultra-Minimalista de Criterio */}
      <MiniAppBottomNav
        experienceId="criterio"
        onOpenMenu={() => setIsSubmenuOpen(true)}
        items={[
          {
            id: 'modules',
            label: '12 Módulos',
            icon: BookOpen,
            isActive: activeTab === 'modules' && !dynamicBatch && !infographicData,
            onClick: () => { setActiveTab('modules'); setDynamicBatch(null); setInfographicData(null); }
          },
          {
            id: 'fallacies',
            label: 'Falacias',
            icon: AlertTriangle,
            isActive: activeTab === 'fallacies' && !dynamicBatch && !infographicData,
            onClick: () => { setActiveTab('fallacies'); setDynamicBatch(null); setInfographicData(null); }
          },
          {
            id: 'biases',
            label: 'Sesgos',
            icon: Brain,
            isActive: activeTab === 'biases' && !dynamicBatch && !infographicData,
            onClick: () => { setActiveTab('biases'); setDynamicBatch(null); setInfographicData(null); }
          },
          {
            id: 'ethics',
            label: 'Dilemas',
            icon: Scale,
            isActive: activeTab === 'ethics' && !dynamicBatch && !infographicData,
            onClick: () => { setActiveTab('ethics'); setDynamicBatch(null); setInfographicData(null); }
          },
          {
            id: 'debate',
            label: 'Debate Socrático',
            icon: MessageSquare,
            isActive: activeTab === 'debate' && !dynamicBatch && !infographicData,
            onClick: () => { setActiveTab('debate'); setDynamicBatch(null); setInfographicData(null); }
          }
        ]}
      />

      {/* Submenú Desplegable Discreto hacia arriba */}
      <MiniAppSubmenuSheet
        isOpen={isSubmenuOpen}
        onClose={() => setIsSubmenuOpen(false)}
        experienceId="criterio"
        onNavigateExperience={onNavigateExperience}
        customItems={submenuSections}
        onSelectAction={(actionId) => {
          if (actionId === 'learn' || actionId === 'modules-all') setActiveTab('modules');
          if (actionId === 'tab-fallacies') setActiveTab('fallacies');
          if (actionId === 'tab-biases') setActiveTab('biases');
          if (actionId === 'tab-ethics') setActiveTab('ethics');
          if (actionId === 'tab-debate') setActiveTab('debate');
          if (actionId === 'feed' || actionId === 'tab-feed-lab') setActiveTab('feed_lab');
          if (actionId === 'ai-detect' || actionId === 'tab-ai-lab') setActiveTab('ai_lab');
          if (actionId === 'matiza' || actionId === 'tab-matiza') setActiveTab('matiza');
          if (actionId === 'missions' || actionId === 'tab-missions') setActiveTab('missions');
          if (actionId === 'tab-ecosystem') setActiveTab('ecosystem');
        }}
      />

    </div>
  );
};

export default CriterioExperience;
