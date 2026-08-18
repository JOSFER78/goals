import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, 
  Globe, Orbit, ArrowDown, Brain, Star, ShieldCheck, GraduationCap,
  BookOpen, Compass, Layers, Activity, Eye, Sliders, BarChart3, ScanLine, 
  Volume2, Mic, FileText, Cpu, Terminal, Shield, Download, Smartphone,
  Check, X, Zap, Lock, Award, PlayCircle
} from 'lucide-react';
import { ExperienceId } from '../types';
import { GOALS_EXPERIENCES } from '../config/experiencesConfig';
import { useTheme } from '../context/ThemeContext';
import { ApkDownloadGuideModal } from '../components/ApkDownloadGuideModal';

interface GoalsLandingProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSelectExperience: (id: ExperienceId) => void;
}

interface FeatureDetail {
  title: string;
  desc: string;
  tag: string;
  icon: React.ElementType;
  image: string;
}

interface MiniAppSlide {
  id: ExperienceId;
  name: string;
  icon: React.ElementType;
  tagline: string;
  badgeTag: string;
  badgeMetric: string;
  heading: string;
  description: string;
  image: string;
  colorTheme: {
    accent: string;
    border: string;
    bgGlow: string;
    badgeBg: string;
  };
  features: FeatureDetail[];
}

export const GoalsLanding: React.FC<GoalsLandingProps> = ({ onOpenAuth, onSelectExperience }) => {
  const { isDark } = useTheme();
  const [selectedDisciplineIndex, setSelectedDisciplineIndex] = useState<number>(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);
  const [selectedAgeStage, setSelectedAgeStage] = useState<'primary' | 'secondary' | 'baccalaureate'>('secondary');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState<boolean>(false);

  const DISCIPLINES: MiniAppSlide[] = [
    {
      id: 'school',
      name: 'Escuela IA',
      icon: GraduationCap,
      tagline: 'Tutor IA Multimodal & OCR de Cuadernos',
      badgeTag: 'Visión Didáctica',
      badgeMetric: '99.4% Precisión OCR',
      heading: 'Reconocimiento de Cuadernos Manuscritos y Método Socrático',
      description: 'Fotografía tus ejercicios escritos a mano. El motor de visión analiza tu razonamiento y te orienta con pistas pedagógicas progresivas sin dar la solución masticada.',
      image: '/assets/previews/school_ocr.webp',
      colorTheme: {
        accent: 'text-emerald-400',
        border: 'border-emerald-500/40',
        bgGlow: 'bg-emerald-500/10',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      },
      features: [
        {
          title: 'OCR de Cuadernos y Fórmulas',
          desc: 'Escanea texto manuscrito, operaciones matemáticas y diagramas con precisión analítica.',
          tag: 'Visión IA',
          icon: ScanLine,
          image: '/assets/previews/school_ocr.webp'
        },
        {
          title: 'Tutoría Socrática Adaptativa',
          desc: 'Preguntas guía calibradas al nivel del estudiante para deducir el paso correcto.',
          tag: 'Pedagogía',
          icon: Brain,
          image: '/assets/previews/school_socratic.webp'
        },
        {
          title: 'Mapa de Refuerzo de Conceptos',
          desc: 'Detecta lagunas en conocimientos previos y sugiere ejercicios para consolidar la base.',
          tag: 'Diagnóstico',
          icon: Compass,
          image: '/assets/previews/school_conceptmap.webp'
        },
        {
          title: 'Simulacros de Examen a Medida',
          desc: 'Genera pruebas personalizadas con corrección explicada y feedback inmediato.',
          tag: 'Evaluación',
          icon: FileText,
          image: '/assets/previews/school_exam.webp'
        }
      ]
    },
    {
      id: 'languages',
      name: 'Idiomas Voz',
      icon: Globe,
      tagline: 'Profesor Particular de Voz en Tiempo Real',
      badgeTag: 'Voz Bidireccional',
      badgeMetric: '< 120ms Latencia',
      heading: 'Inmersión Conversacional por Voz sin Miedo al Error',
      description: 'Habla con naturalidad con un tutor que escucha tu entonación, evalúa la precisión fonética y recuerda tu vocabulario lección tras lección.',
      image: '/assets/previews/languages_conversation.webp',
      colorTheme: {
        accent: 'text-cyan-400',
        border: 'border-cyan-500/40',
        bgGlow: 'bg-cyan-500/10',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
      },
      features: [
        {
          title: 'Diálogos de Voz Fluidos',
          desc: 'Conversaciones espontáneas en tiempo real adaptadas a tu nivel y ritmo.',
          tag: 'Voz Directa',
          icon: Mic,
          image: '/assets/previews/languages_conversation.webp'
        },
        {
          title: 'Diagnóstico Fonético Acústico',
          desc: 'Retroalimentación visual y auditiva para perfeccionar acento y cadencia.',
          tag: 'Fonética',
          icon: Volume2,
          image: '/assets/previews/languages_phonetics.webp'
        },
        {
          title: 'Memoria de Vocabulario y Sesión',
          desc: 'Refuerza orgánicamente las palabras que te costaron en sesiones anteriores.',
          tag: 'Memoria IA',
          icon: Layers,
          image: '/assets/previews/languages_memory.webp'
        },
        {
          title: 'Escenarios Reales del Mundo',
          desc: 'Simulaciones de viajes, entrevistas, ciencia y situaciones cotidianas.',
          tag: 'Inmersión',
          icon: Globe,
          image: '/assets/previews/languages_scenarios.webp'
        }
      ]
    },
    {
      id: 'astro',
      name: 'Cosmos 3D',
      icon: Orbit,
      tagline: 'Simulador Astrofísico con Datos Oficiales NASA',
      badgeTag: '3D Fotorrealista',
      badgeMetric: '12 Escalas Cósmicas',
      heading: 'Exploración del Sistema Solar con Mecánica Orbital Real',
      description: 'Navega por el espacio a escala fotorrealista con efemérides orbitales de la NASA. Comprende eclipses, estaciones y trayectorias espaciales históricas.',
      image: '/assets/previews/cosmos_motor3d.webp',
      colorTheme: {
        accent: 'text-indigo-400',
        border: 'border-indigo-500/40',
        bgGlow: 'bg-indigo-500/10',
        badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
      },
      features: [
        {
          title: 'Motor 3D Orbital NASA',
          desc: 'Simulación precisa de planetas, satélites y órbitas con datos oficiales del JPL.',
          tag: 'Astrofísica',
          icon: Orbit,
          image: '/assets/previews/cosmos_motor3d.webp'
        },
        {
          title: 'Mecánica Celeste Interactiva',
          desc: 'Experimenta con gravedad, iluminación solar, solsticios y alineaciones planetarias.',
          tag: 'Física Real',
          icon: Activity,
          image: '/assets/previews/cosmos_celestial.webp'
        },
        {
          title: '18 Misiones Espaciales Guiadas',
          desc: 'Sigue el recorrido de Artemis II, James Webb Telescope y Curiosity en Marte.',
          tag: 'Misiones',
          icon: Compass,
          image: '/assets/previews/cosmos_missions.webp'
        },
        {
          title: 'Retos de Astrofísica con XP',
          desc: 'Supera misiones interactivas para desbloquear rangos de astronauta y estrellas.',
          tag: 'Gamificación',
          icon: Star,
          image: '/assets/previews/cosmos_gamification.webp'
        }
      ]
    },
    {
      id: 'verify',
      name: 'Criterio',
      icon: ShieldCheck,
      tagline: 'Pensamiento Crítico & Alfabetización Algorítmica',
      badgeTag: 'Rigor & Fuentes',
      badgeMetric: '100% Fuentes Oficiales',
      heading: 'Aprende a Identificar Hechos en la Era de los Algoritmos',
      description: 'Desarrolla criterio propio frente a la desinformación. Audita sesgos algorítmicos, detecta deepfakes y contrasta afirmaciones con fuentes científicas oficiales.',
      image: '/assets/previews/criterio_sources.webp',
      colorTheme: {
        accent: 'text-amber-400',
        border: 'border-amber-500/40',
        bgGlow: 'bg-amber-500/10',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      },
      features: [
        {
          title: 'Contraste con Fuentes Primarias',
          desc: 'Verificación automática frente a publicaciones de la NASA, ESA, CSIC y BOE.',
          tag: 'Rigor Oficial',
          icon: ShieldCheck,
          image: '/assets/previews/criterio_sources.webp'
        },
        {
          title: 'Detección de Sesgos y Deepfakes',
          desc: 'Laboratorio forense para identificar contenidos sintéticos y manipulación digital.',
          tag: 'Auditoría',
          icon: Eye,
          image: '/assets/previews/criterio_biases.webp'
        },
        {
          title: 'Método PAUSA en 60 Misiones',
          desc: 'Entrenamiento cognitivo para verificar antes de compartir en redes sociales.',
          tag: 'Método PAUSA',
          icon: ShieldCheck,
          image: '/assets/previews/criterio_pausa.webp'
        },
        {
          title: 'Matriz de Análisis MATIZA',
          desc: 'Herramienta de análisis en 4 capas para evaluar noticias y debates complejos.',
          tag: 'Debate Crítico',
          icon: Sliders,
          image: '/assets/previews/criterio_matiza.webp'
        }
      ]
    },
    {
      id: 'ai-lab',
      name: 'IA Lab',
      icon: Brain,
      tagline: 'Laboratorio Práctico de Redes Neuronales & LLMs',
      badgeTag: 'Ciencia de Datos',
      badgeMetric: 'Inferencia 2D en Vivo',
      heading: 'Comprende el Funcionamiento Interno de la Inteligencia Artificial',
      description: 'Entrena redes neuronales 2D en tiempo real, visualiza cómo predicen los modelos de lenguaje mediante tokens y experimenta con visión artificial.',
      image: '/assets/previews/ialab_neural2d.webp',
      colorTheme: {
        accent: 'text-purple-400',
        border: 'border-purple-500/40',
        bgGlow: 'bg-purple-500/10',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      },
      features: [
        {
          title: 'Simulador de Redes 2D',
          desc: 'Ajusta capas, neuronas y tasas de aprendizaje mientras ves la frontera de decisión.',
          tag: 'Redes 2D',
          icon: Brain,
          image: '/assets/previews/ialab_neural2d.webp'
        },
        {
          title: 'Explorador de Tokens y Temperatura',
          desc: 'Inspecciona cómo los LLMs calculan probabilidades para predecir palabras.',
          tag: 'LLM Forense',
          icon: Terminal,
          image: '/assets/previews/ialab_tokens.webp'
        },
        {
          title: 'Convolución y Visión Artificial',
          desc: 'Aplica matrices de filtro 3x3 para entender la detección de bordes e imágenes.',
          tag: 'Visión Real',
          icon: Cpu,
          image: '/assets/previews/ialab_convolution.webp'
        },
        {
          title: 'Ética y Ley de IA Europea (AI Act)',
          desc: 'Casos interactivos para auditar sesgos algorítmicos y privacidad de datos.',
          tag: 'Ética IA',
          icon: BarChart3,
          image: '/assets/previews/ialab_ethics.webp'
        }
      ]
    }
  ];

  const currentDiscipline = DISCIPLINES[selectedDisciplineIndex];
  const activeFeature = currentDiscipline.features[activeFeatureIndex] || currentDiscipline.features[0];

  const handlePrevFeature = () => {
    if (activeFeatureIndex > 0) {
      setActiveFeatureIndex(prev => prev - 1);
    } else {
      const prevDiscipline = selectedDisciplineIndex === 0 ? DISCIPLINES.length - 1 : selectedDisciplineIndex - 1;
      setSelectedDisciplineIndex(prevDiscipline);
      setActiveFeatureIndex(DISCIPLINES[prevDiscipline].features.length - 1);
    }
  };

  const handleNextFeature = () => {
    if (activeFeatureIndex < currentDiscipline.features.length - 1) {
      setActiveFeatureIndex(prev => prev + 1);
    } else {
      const nextDiscipline = selectedDisciplineIndex === DISCIPLINES.length - 1 ? 0 : selectedDisciplineIndex + 1;
      setSelectedDisciplineIndex(nextDiscipline);
      setActiveFeatureIndex(0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') handlePrevFeature();
      if (e.key === 'ArrowRight') handleNextFeature();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDisciplineIndex, activeFeatureIndex]);

  const scrollToSection = (secId: string) => {
    const el = document.getElementById(secId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const FAQS = [
    {
      q: '¿Cómo evita GOALS que los estudiantes copien sin razonar?',
      a: 'A diferencia de los chatbots convencionales que ofrecen la respuesta resuelta de forma inmediata, GOALS utiliza el método socrático. Nuestro motor pedagógico analiza el ejercicio manuscrito por OCR e interactúa mediante preguntas orientadoras graduadas para que el alumno deduzca el razonamiento por sí mismo.'
    },
    {
      q: '¿Cómo se adapta el contenido según la edad del alumno?',
      a: 'La plataforma calibra automáticamente el vocabulario, la profundidad matemática y los modelos visuales en 5 franjas clave (desde 6 años en Primaria hasta 18 años en Bachillerato y preparación universitaria), manteniendo una curva de dificultad óptima.'
    },
    {
      q: '¿Se puede probar la plataforma sin registrarse?',
      a: 'Sí. Todos los visitantes pueden acceder libremente en Modo Visita a cualquiera de las experiencias para interactuar con los simuladores y visores 3D. Al registrar una cuenta gratuita, se desbloquea el guardado persistente de progreso, retos y estrellas.'
    },
    {
      q: '¿Cómo garantiza GOALS la privacidad y seguridad de los menores?',
      a: 'GOALS cuenta con un entorno 100% blindado: no incluye anuncios publicitarios, no comercializa datos de usuarios y sigue rigurosamente las normativas de protección de datos europea (RGPD) y el AI Act de la Unión Europea.'
    },
    {
      q: '¿Dispone de aplicación móvil para teléfonos y tablets Android?',
      a: 'Sí. Disponemos de la aplicación nativa APK v2.5.1 optimizada para Android con aceleración gráfica 3D por hardware y controles multitáctiles de dos dedos, descargable directamente desde la plataforma.'
    }
  ];

  return (
    <div className={`relative w-full font-display transition-colors duration-300 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 py-6 sm:py-10 pb-20">

        {/* ========================================================================= */}
        {/* SECCIÓN 1: HERO MONUMENTAL DE ALTO IMPACTO */}
        {/* ========================================================================= */}
        <section id="hero-section" className="relative flex flex-col items-center justify-center text-center pt-4 sm:pt-10">
          
          {/* Luz ambiental sutil de fondo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-160 h-72 sm:h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

          {/* Badge de Versión Sobrio */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-6 border transition-all animate-fadeIn ${
            isDark 
              ? 'bg-slate-900/90 border-slate-700/80 text-slate-200 shadow-lg shadow-black/40' 
              : 'bg-white/90 border-slate-200 text-slate-800 shadow-sm'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white">GOALS Platform v2.5.1</span>
            <span className="text-slate-500">·</span>
            <span className="text-indigo-400 font-semibold">Tutoría IA Socrática & 3D</span>
          </div>

          {/* Título Principal Monumental */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] max-w-4xl mx-auto">
            La IA que enseña a pensar, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              no a resolver por ti.
            </span>
          </h1>

          <p className={`text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mt-4 sm:mt-6 font-sans ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Resolución guiada de cuadernos por visión OCR, profesor particular de voz en directo, simulador espacial 3D con datos de la NASA y laboratorio forense de IA.
          </p>

          {/* Badges de Confianza y Valor Pedagógico */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-6">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-medium border ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>De 6 a 18 Años (Primaria a Bachillerato)</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-medium border ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <Orbit className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Datos Oficiales NASA / CSIC</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-medium border ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>100% Sin Publicidad ni Rastreo</span>
            </div>
          </div>

          {/* Botones de Acción Primarios */}
          <div className="flex flex-wrap justify-center items-center gap-3.5 sm:gap-4 mt-8">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-6 sm:px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Comenzar Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsApkGuideOpen(true)}
              className={`px-5 sm:px-7 py-3 rounded-2xl border font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200 shadow-md' 
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Descargar APK v2.5.1</span>
            </button>
            <button
              onClick={() => scrollToSection('showcase-section')}
              className={`px-4 sm:px-6 py-3 rounded-2xl border font-medium text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
              }`}
            >
              <span>Ver Showcase</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECCIÓN 2: SHOWCASE INTERACTIVO UNIFICADO (EXPERIENCIA EN VIVO) */}
        {/* ========================================================================= */}
        <section id="showcase-section" className="relative scroll-mt-20">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Ecosistema de Tecnologías
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Experimenta las 5 Disciplinas de GOALS
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Selecciona cualquier módulo para explorar sus capacidades didácticas y probar la interfaz interactiva:
            </p>
          </div>

          <div className={`w-full rounded-3xl p-4 sm:p-7 border transition-all ${
            isDark 
              ? 'bg-[#0c101c]/95 border-slate-800/90 shadow-2xl shadow-black/50 backdrop-blur-xl' 
              : 'bg-white border-slate-200 shadow-xl'
          }`}>
            
            {/* 1. Selector de Pestañas de Disciplinas (Con Iconos y Colores de Marca) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-3 border-b border-slate-800/80 mb-6">
              {DISCIPLINES.map((disc, idx) => {
                const isSelected = selectedDisciplineIndex === idx;
                const IconComponent = disc.icon;
                return (
                  <button
                    key={disc.id}
                    onClick={() => { 
                      setSelectedDisciplineIndex(idx); 
                      setActiveFeatureIndex(0); 
                    }}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                      isSelected
                        ? isDark
                          ? `${disc.colorTheme.badgeBg} border shadow-lg shadow-indigo-950/40`
                          : 'bg-indigo-50 border-indigo-300 text-indigo-900'
                        : isDark
                          ? 'bg-slate-900/60 hover:bg-slate-800/90 border-slate-800/80 text-slate-400 hover:text-slate-200'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? disc.colorTheme.accent : 'text-slate-400'}`} />
                    <span>{disc.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md border ${
                      isSelected ? 'bg-slate-950/60 border-slate-700 text-white' : 'bg-slate-950/30 border-slate-800/50 text-slate-500'
                    }`}>
                      {disc.badgeTag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 2. Grid Interactivo de 2 Columnas (Visualizador a la Izquierda, Controles a la Derecha) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Columna Izquierda: Imagen Fotorrealista de la Característica Activa */}
              <div className="lg:col-span-7 relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800/90 bg-slate-950 shadow-2xl group">
                <img
                  src={activeFeature.image || currentDiscipline.image}
                  alt={activeFeature.title}
                  key={`${currentDiscipline.id}_${activeFeatureIndex}`}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-102 animate-fadeIn"
                />

                {/* Badge Flotante Superior con Métrica Real */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-700 text-[10px] font-mono font-bold text-emerald-400 backdrop-blur-md shadow-md">
                    ⚡ {currentDiscipline.badgeMetric}
                  </span>
                </div>

                {/* Controles de Navegación de Variantes */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
                  <button
                    type="button"
                    onClick={handlePrevFeature}
                    className="w-8 h-8 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                    {activeFeatureIndex + 1} / {currentDiscipline.features.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextFeature}
                    className="w-8 h-8 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    title="Siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Columna Derecha: Información Detallada, Selector de Variantes y Acceso Inmediato */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4 text-left">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase border ${currentDiscipline.colorTheme.badgeBg}`}>
                      {activeFeature.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Función {activeFeatureIndex + 1} de {currentDiscipline.features.length}
                    </span>
                  </div>

                  <h3 className={`font-bold text-lg sm:text-2xl leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activeFeature.title}
                  </h3>

                  <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {activeFeature.desc}
                  </p>
                </div>

                {/* Selector de las 4 Variantes como chips interactivos */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {currentDiscipline.features.map((feat, idx) => {
                    const isSelected = activeFeatureIndex === idx;
                    const IconComp = feat.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveFeatureIndex(idx)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? isDark
                              ? `${currentDiscipline.colorTheme.badgeBg} ring-1 ring-indigo-500/50 shadow-md`
                              : 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm'
                            : isDark 
                              ? 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900/60' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <div className={`p-1 rounded-lg shrink-0 ${
                          isSelected ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-900 border border-slate-800 text-slate-400'
                        }`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-semibold truncate">{feat.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Botón de Entrada Directa a Explorar la MiniApp */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectExperience(currentDiscipline.id)}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 cursor-pointer shadow-lg shadow-indigo-600/30"
                  >
                    <span>Entrar a Explorar {currentDiscipline.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECCIÓN 3: MATRIZ PEDAGÓGICA (IA CONVENCIONAL VS MÉTODO SOCRÁTICO GOALS) */}
        {/* ========================================================================= */}
        <section className="relative">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Diferencial Pedagógico
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ¿Por qué GOALS no es otro simple Chatbot?
            </h2>
            <p className={`text-xs sm:text-sm max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Comparativa entre el uso pasivo de IAs comerciales y el método de tutoría adaptativa de GOALS:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Tarjeta: IAs Genéricas / Chatbots */}
            <div className={`p-5 sm:p-6 rounded-3xl border ${
              isDark ? 'bg-slate-950/60 border-rose-500/20' : 'bg-rose-50/40 border-rose-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Chatbots de IA Convencionales
                  </h3>
                  <p className="text-xs text-rose-400">Respuesta automática sin proceso de aprendizaje</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs font-sans">
                <li className="flex items-start gap-2 text-slate-400">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Resuelven el ejercicio de inmediato:</strong> El estudiante copia el resultado sin comprender los pasos ni deducir el método.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Alucinaciones en datos científicos:</strong> Inventan referencias o datos astronómicos sin contrastar con fuentes oficiales.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Modelos genéricos no calibrados:</strong> Usan el mismo lenguaje complejo para un niño de 8 años que para un adulto.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Monetización y rastreo:</strong> Entornos con cookies publicitarias y venta de perfiles para marketing.</span>
                </li>
              </ul>
            </div>

            {/* Tarjeta: Método GOALS */}
            <div className={`p-5 sm:p-6 rounded-3xl border relative shadow-xl ${
              isDark ? 'bg-[#0c101c] border-emerald-500/40 shadow-emerald-950/20' : 'bg-white border-emerald-300 shadow-sm'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Ecosistema Educativo GOALS
                  </h3>
                  <p className="text-xs text-emerald-400">Tutoría Socrática, Visión y Pensamiento Crítico</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs font-sans">
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Preguntas orientadoras (Método Socrático):</strong> Guía paso a paso para que el estudiante construya su propio razonamiento.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Fuentes oficiales verificadas (100%):</strong> Coordenadas NASA/JPL, publicaciones del CSIC, ESA y BOE.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Motor de calibración por edad (6-18 años):</strong> Ajuste pedagógico del léxico, nivel matemático y dinámicas visuales.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Entorno seguro infantil:</strong> Cero anuncios, cero rastreo comercial y cumplimiento riguroso del AI Act europeo.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECCIÓN 4: MOTOR ADAPTATIVO POR ETAPAS EDUCATIVAS (6 A 18 AÑOS) */}
        {/* ========================================================================= */}
        <section className="relative">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Evolución Curricular
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Diseñado para Acompañar cada Etapa de Crecimiento
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              GOALS adapta su metodología, complejidad y estilo de interacción según el nivel académico:
            </p>
          </div>

          {/* Selector de Etapa */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setSelectedAgeStage('primary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedAgeStage === 'primary'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              🎒 Primaria (6-11 años)
            </button>
            <button
              onClick={() => setSelectedAgeStage('secondary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedAgeStage === 'secondary'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              🧬 Secundaria / ESO (12-15 años)
            </button>
            <button
              onClick={() => setSelectedAgeStage('baccalaureate')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedAgeStage === 'baccalaureate'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              🌌 Bachillerato & Selectividad (16-18 años)
            </button>
          </div>

          {/* Contenido Dinámico de la Etapa */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            isDark ? 'bg-[#0c101c] border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            {selectedAgeStage === 'primary' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-3 md:col-span-2 text-left">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Etapa Primaria · 1º a 6º (6 - 11 Años)
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Curiosidad Guiada, Gamificación y Hábitos de Estudio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    Interfaz altamente visual y amigable. Refuerzo positivo con estrellas, misiones de astronomía táctil y lectura asistida por voz. Aprender a razonar operaciones básicas sin frustración.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-400">⭐ Sistema de Estrellas</span>
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">🪐 Exploración Táctil 3D</span>
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">📝 OCR de Letra Infantil</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                    🎒
                  </div>
                  <h4 className="font-bold text-sm text-white">Objetivo Principal</h4>
                  <p className="text-xs text-slate-400 font-sans">Desarrollar confianza matemática y motivación diaria sin memorización pasiva.</p>
                </div>
              </div>
            )}

            {selectedAgeStage === 'secondary' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-3 md:col-span-2 text-left">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Etapa Secundaria · 1º a 4º ESO (12 - 15 Años)
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Álgebra, Física Experimental y Fluidez en Idiomas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    Resolución estructurada de ecuaciones, leyes físicas de la gravedad con simulador espacial y debates conversacionales por voz en inglés para ganar seguridad comunicativa.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-indigo-400">📐 Desglose de Fórmulas</span>
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-400">🎙️ Fluidez Oral en Inglés</span>
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-400">🛡️ Detección de Fake News</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-xl">
                    🧬
                  </div>
                  <h4 className="font-bold text-sm text-white">Objetivo Principal</h4>
                  <p className="text-xs text-slate-400 font-sans">Dominar el método analítico y la comunicación oral con rigor.</p>
                </div>
              </div>
            )}

            {selectedAgeStage === 'baccalaureate' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-3 md:col-span-2 text-left">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Etapa Bachillerato & Universidad (16 - 18 Años)
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Laboratorio Forense de IA, Cálculo y Exámenes Oficiales
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    Entrenamiento de redes neuronales reales, análisis de sesgos éticos y simulacros de examen exhaustivos para preparar pruebas de acceso universitario.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-purple-400">🧠 Redes Neuronales 2D</span>
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">📊 Auditoría de Algoritmos</span>
                    <span className="text-[11px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">📝 Exámenes de Selectividad</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto text-xl">
                    🌌
                  </div>
                  <h4 className="font-bold text-sm text-white">Objetivo Principal</h4>
                  <p className="text-xs text-slate-400 font-sans">Alcanzar excelencia conceptual y pensamiento crítico de nivel preuniversitario.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECCIÓN 5: PREGUNTAS FRECUENTES (FAQ) */}
        {/* ========================================================================= */}
        <section id="faq-section" className="relative">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-800/40 px-3 py-1 rounded-full border border-slate-700">
              Dudas Resueltas
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Preguntas Frecuentes
            </h2>
            <p className={`text-xs sm:text-sm max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Todo lo que necesitas saber antes de empezar a aprender con GOALS:
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className={`w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                      isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-indigo-600'
                    }`}
                  >
                    <span>{faq.q}</span>
                    <span className={`text-slate-400 text-lg transition-transform duration-200 ${isOpen ? 'rotate-45 text-indigo-400' : ''}`}>+</span>
                  </button>
                  {isOpen && (
                    <div className={`px-4 sm:px-5 pb-5 text-xs font-sans leading-relaxed border-t pt-3 ${
                      isDark ? 'border-slate-800/60 text-slate-300' : 'border-slate-200 text-slate-600'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECCIÓN 6: CTA FINAL MONUMENTAL (ACCESO WEB + DESCARGA APK ANDROID) */}
        {/* ========================================================================= */}
        <section className="relative">
          <div className={`rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto border relative overflow-hidden shadow-2xl ${
            isDark 
              ? 'bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border-indigo-500/30' 
              : 'bg-gradient-to-b from-indigo-50 to-white border-indigo-200'
          }`}>
            
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Acceso Inmediato
              </span>
              <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Empieza a Desarrollar tu Autonomía Intelectual
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Únete a la plataforma educativa con IA multimodal más completa. Prueba cualquier disciplina en la web o instala la aplicación nativa para Android.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3.5 pt-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Crear Cuenta Gratuita</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsApkGuideOpen(true)}
                className={`px-6 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 shadow-md' 
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Instalar APK v2.5.1</span>
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className={`px-5 py-3.5 rounded-2xl border font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${
                  isDark 
                    ? 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                Iniciar Sesión
              </button>
            </div>

            {/* Micro badges inferiores */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-[11px] text-slate-400 pt-3 border-t border-slate-800/60 font-sans">
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> Sin tarjeta de crédito</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> Acceso instantáneo en navegador</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> APK 100% libre de anuncios</span>
            </div>

          </div>
        </section>

      </div>

      {/* Modal Guía de Descarga y Permisos de APK */}
      <ApkDownloadGuideModal
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
      />
    </div>
  );
};
