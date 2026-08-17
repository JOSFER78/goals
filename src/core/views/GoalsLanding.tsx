import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, 
  Globe, Orbit, ArrowDown, Brain, Star, ShieldCheck, GraduationCap,
  BookOpen, Compass, Layers, Activity, Eye, Sliders, BarChart3, ScanLine, 
  Volume2, Mic, FileText, Cpu, Terminal
} from 'lucide-react';
import { ExperienceId } from '../types';
import { GOALS_EXPERIENCES } from '../config/experiencesConfig';
import { useTheme } from '../context/ThemeContext';
import { FeatureScreenVisualizer } from '../components/FeatureScreenVisualizer';

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
  heading: string;
  description: string;
  image: string;
  features: FeatureDetail[];
}

export const GoalsLanding: React.FC<GoalsLandingProps> = ({ onOpenAuth, onSelectExperience }) => {
  const { isDark } = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const SLIDES: MiniAppSlide[] = [
    {
      id: 'school',
      name: 'Escuela IA',
      icon: GraduationCap,
      tagline: 'Tutor IA Multimodal & OCR de Cuadernos',
      badgeTag: 'Tutor & OCR',
      heading: 'Reconocimiento Didáctico de Cuadernos y Ejercicios Manuscritos',
      description: 'Captura tus ejercicios manuscritos con la cámara. El motor OCR analiza tu razonamiento y te orienta paso a paso mediante método socrático.',
      image: '/assets/previews/school_ocr.webp',
      features: [
        {
          title: 'OCR de Cuadernos Manuscritos',
          desc: 'Escanea texto escrito a mano y expresiones matemáticas con 99.4% de precisión.',
          tag: 'Visión',
          icon: ScanLine,
          image: '/assets/previews/school_ocr.webp'
        },
        {
          title: 'Tutoría Socrática Adaptativa',
          desc: 'Pistas pedagógicas calibradas al nivel del estudiante sin dar la solución directa.',
          tag: 'Pedagogía',
          icon: Brain,
          image: '/assets/previews/school_socratic.webp'
        },
        {
          title: 'Mapa Conceptual de Refuerzo',
          desc: 'Detecta lagunas conceptuales previas y sugiere repasos específicos.',
          tag: 'Diagnóstico',
          icon: Compass,
          image: '/assets/previews/school_conceptmap.webp'
        },
        {
          title: 'Exámenes de Práctica a Medida',
          desc: 'Genera simulacros de examen adaptados con corrección explicada inmediata.',
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
      badgeTag: 'Voz & Memoria',
      heading: 'Inmersión Conversacional por Voz en Directo',
      description: 'Mantén diálogos naturales con un tutor IA que recuerda tu vocabulario, evalúa tu fluidez verbal y perfecciona tu pronunciación.',
      image: '/assets/previews/languages_conversation.webp',
      features: [
        {
          title: 'Conversación en Tiempo Real',
          desc: 'Diálogos fluidos y bidireccionales sin latencia, adaptados a tu ritmo.',
          tag: 'Voz en Vivo',
          icon: Mic,
          image: '/assets/previews/languages_conversation.webp'
        },
        {
          title: 'Evaluación Fonética de Acento',
          desc: 'Análisis acústico que orienta sobre entonación, ritmo y fonética.',
          tag: 'Fonética',
          icon: Volume2,
          image: '/assets/previews/languages_phonetics.webp'
        },
        {
          title: 'Memoria de Progreso y Sesión',
          desc: 'El tutor recuerda expresiones complejas y las refuerza orgánicamente.',
          tag: 'Memoria',
          icon: Layers,
          image: '/assets/previews/languages_memory.webp'
        },
        {
          title: 'Escenarios Temáticos Reales',
          desc: 'Práctica inmersiva en viajes, ciencia, negocios y vida cotidiana.',
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
      tagline: 'Simulador Astrofísico con Datos NASA',
      badgeTag: 'Visor 3D NASA',
      heading: 'Simulador 3D Interactivo con Datos Oficiales',
      description: 'Explora el Sistema Solar a escala fotorrealista. Estudia la mecánica celeste de eclipses, órbitas reales y misiones espaciales oficiales.',
      image: '/assets/previews/cosmos_motor3d.webp',
      features: [
        {
          title: 'Motor 3D de 12 Escalas',
          desc: 'Navegación fotorrealista desde órbita terrestre hasta galaxias lejanas.',
          tag: 'Motor 3D',
          icon: Orbit,
          image: '/assets/previews/cosmos_motor3d.webp'
        },
        {
          title: 'Mecánica Celeste & Física Real',
          desc: 'Datos orbitales oficiales de la NASA, inclinación terrestre e iluminación solar.',
          tag: 'Física NASA',
          icon: Activity,
          image: '/assets/previews/cosmos_celestial.webp'
        },
        {
          title: '18 Misiones Espaciales Guiadas',
          desc: 'Trayectorias de las misiones Artemis II, James Webb y Perseverance.',
          tag: 'Misiones',
          icon: Compass,
          image: '/assets/previews/cosmos_missions.webp'
        },
        {
          title: 'Retos Gamificados con XP',
          desc: 'Tests interactivos para desbloquear rangos, estrellas y puntos de progreso.',
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
      tagline: 'Pensamiento Crítico & Alfabetización en IA',
      badgeTag: 'Criterio & Rigor',
      heading: 'Aprende a Informarte en la Era de los Algoritmos',
      description: 'Comprende el funcionamiento de los algoritmos de recomendación, audita sesgos y contrasta información con fuentes científicas oficiales.',
      image: '/assets/previews/criterio_sources.webp',
      features: [
        {
          title: 'Contraste con Fuentes Oficiales',
          desc: 'Verificación directa frente a publicaciones de NASA, ESA, CSIC y BOE.',
          tag: 'Fuentes 100%',
          icon: ShieldCheck,
          image: '/assets/previews/criterio_sources.webp'
        },
        {
          title: 'Detección de Sesgos y Alucinaciones',
          desc: 'Laboratorio para identificar textos sintéticos, deepfakes y desinformación.',
          tag: 'Auditoría IA',
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
          title: 'Estación de Análisis MATIZA',
          desc: 'Evaluación en 4 capas de rigor para analizar debates y noticias complejas.',
          tag: 'Rigor Crítico',
          icon: Sliders,
          image: '/assets/previews/criterio_matiza.webp'
        }
      ]
    },
    {
      id: 'ai-lab',
      name: 'IA Lab',
      icon: Brain,
      tagline: 'Laboratorio Práctico de Inteligencia Artificial',
      badgeTag: 'Laboratorio de IA',
      heading: 'Entiende y Experimenta con Redes Neuronales y LLMs',
      description: 'Visualiza el entrenamiento de redes 2D, comprende la tokenización de los modelos de lenguaje y aplica filtros de visión artificial.',
      image: '/assets/previews/ialab_neural2d.webp',
      features: [
        {
          title: 'Simulador 2D de Redes Neuronales',
          desc: 'Ajusta capas y tasas de aprendizaje mientras ves la frontera de decisión en vivo.',
          tag: 'Redes 2D',
          icon: Brain,
          image: '/assets/previews/ialab_neural2d.webp'
        },
        {
          title: 'Explorador de Tokens y Probabilidad',
          desc: 'Inspecciona cómo los LLMs predicen la siguiente palabra según la temperatura.',
          tag: 'LLM Tokens',
          icon: Terminal,
          image: '/assets/previews/ialab_tokens.webp'
        },
        {
          title: 'Convolución y Visión Artificial',
          desc: 'Aplica matrices de filtro 3x3 celda a celda para entender la visión por computador.',
          tag: 'Visión IA',
          icon: Cpu,
          image: '/assets/previews/ialab_convolution.webp'
        },
        {
          title: 'Ética y Ley de IA Europea',
          desc: 'Casos interactivos para auditar sesgos algorítmicos y privacidad de datos.',
          tag: 'Ética & Ley',
          icon: BarChart3,
          image: '/assets/previews/ialab_ethics.webp'
        }
      ]
    }
  ];

  const currentSlide = SLIDES[currentSlideIndex];
  const activeFeature = currentSlide.features[activeFeatureIndex] || currentSlide.features[0];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    setActiveFeatureIndex(0);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    setActiveFeatureIndex(0);
  };

  const handlePrevFeature = () => {
    if (activeFeatureIndex > 0) {
      setActiveFeatureIndex(prev => prev - 1);
    } else {
      const prevSlide = currentSlideIndex === 0 ? SLIDES.length - 1 : currentSlideIndex - 1;
      setCurrentSlideIndex(prevSlide);
      setActiveFeatureIndex(SLIDES[prevSlide].features.length - 1);
    }
  };

  const handleNextFeature = () => {
    if (activeFeatureIndex < currentSlide.features.length - 1) {
      setActiveFeatureIndex(prev => prev + 1);
    } else {
      const nextSlide = currentSlideIndex === SLIDES.length - 1 ? 0 : currentSlideIndex + 1;
      setCurrentSlideIndex(nextSlide);
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
  }, [currentSlideIndex, activeFeatureIndex]);

  const scrollToSection = (secId: string) => {
    const el = document.getElementById(secId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const FAQS = [
    {
      q: '¿Qué es Goalskid y a quién está dirigido?',
      a: 'Goalskid es una plataforma educativa adaptativa diseñada para estudiantes de Primaria, Secundaria y Bachillerato (6 a 18 años). Integra tutoría OCR de cuadernos, práctica conversacional de idiomas por voz, simulador 3D del Sistema Solar NASA, pensamiento crítico y laboratorio interactivo de IA.'
    },
    {
      q: '¿Cómo funciona la tutoría con OCR de cuadernos?',
      a: 'El alumno captura una foto de su cuaderno o ejercicio manuscrito. Goalskid reconoce el texto y las fórmulas matemáticas, evalúa el razonamiento y proporciona pistas pedagógicas orientativas paso a paso mediante método socrático, sin resolver el ejercicio directamente.'
    },
    {
      q: '¿Se puede acceder en modo visita sin registrarse?',
      a: 'Sí. Todos los visitantes pueden explorar libremente las 5 MiniApps y probar los módulos en modo lectura/visita. Al crear una cuenta gratuita, la plataforma guarda el progreso personal, estrellas conseguidas y calibración de nivel.'
    },
    {
      q: '¿Dispone de aplicación móvil para Android?',
      a: 'Sí. Goalskid cuenta con una APK nativa optimizada para Android con aceleración 3D por hardware y controles táctiles de dos dedos.'
    }
  ];

  return (
    <div className={`relative w-full font-display transition-colors duration-300 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* ========================================================================= */}
        {/* BLOQUE 1: HERO PRINCIPAL ELEGANTE Y SOBERBIO */}
        {/* ========================================================================= */}
        <section id="hero-section" className="snap-section min-h-[calc(100svh-3.75rem)] md:min-h-[calc(100vh-3.75rem)] relative flex flex-col items-center justify-center text-center py-4 sm:py-6">
          
          {/* Badge de Versión Sobrio */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide mb-4 sm:mb-6 transition-colors ${
            isDark 
              ? 'bg-slate-900 border border-slate-800 text-slate-300' 
              : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold">Goalskid v2.5.1</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">Ecosistema Educativo Adaptativo</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-3xl mx-auto">
            Aprende con Claridad, <br className="hidden sm:inline" />
            <span className={isDark ? 'text-slate-200' : 'text-indigo-600'}>
              IA Multimodal y Visión 3D
            </span>
          </h1>

          <p className={`text-xs sm:text-base max-w-2xl mx-auto leading-relaxed mt-3 sm:mt-4 font-sans ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Resolución guiada de cuadernos manuscritos por OCR, tutor conversacional de idiomas por voz, simulador espacial NASA y laboratorio de IA en una experiencia unificada y sin distracciones.
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-3.5 mt-6 sm:mt-7">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md shadow-indigo-600/30 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Comenzar Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('miniapps-bento')}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border font-medium text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <span>Explorar 5 MiniApps</span>
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Selector Rápido de las 5 MiniApps en Hero (Directo a Modo Visita) */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 w-full max-w-4xl mx-auto">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
              Explora cualquier experiencia en vivo (Modo Visita):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
              {SLIDES.map((slide) => {
                const IconComp = slide.icon;
                return (
                  <button
                    key={slide.id}
                    onClick={() => onSelectExperience(slide.id)}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer group ${
                      isDark 
                        ? 'bg-slate-900/70 hover:bg-slate-800/90 border-slate-800 hover:border-indigo-500/50' 
                        : 'bg-white hover:bg-indigo-50/50 border-slate-200 hover:border-indigo-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Visitar →
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {slide.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{slide.badgeTag}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BENTO GRID DE LAS 5 MINIAPPS (LIMPIO Y SIN SATURACIÓN) */}
        {/* ========================================================================= */}
        <section id="miniapps-bento" className="snap-section min-h-[calc(100svh-3.75rem)] md:min-h-[calc(100vh-3.75rem)] relative flex flex-col justify-center py-4 sm:py-6">
          <div className="w-full text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Módulos de Aprendizaje
                </span>
                <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  5 Experiencias Integradas
                </h2>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">Selecciona cualquier módulo para explorar</span>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-3.5 text-left scrollbar-none pb-2">

              {/* CARD 1: Escuela IA */}
              <div 
                onClick={() => onSelectExperience('school')}
                className={`w-[85vw] sm:w-auto shrink-0 snap-center lg:col-span-2 group cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
                  isDark 
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <img 
                      src="/assets/miniapps/school_logo.png" 
                      alt="Escuela IA" 
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Escuela IA
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Tutor OCR de Cuadernos</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform font-mono">Visitar →</span>
                </div>
                <div className={`mt-2.5 sm:mt-3 p-2 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Reconocimiento manuscrito y orientación socrática paso a paso.
                </div>
              </div>

              {/* CARD 2: Idiomas Voz */}
              <div 
                onClick={() => onSelectExperience('languages')}
                className={`w-[85vw] sm:w-auto shrink-0 snap-center lg:col-span-2 group cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
                  isDark 
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/assets/miniapps/languages_logo.png" 
                      alt="Idiomas Voz" 
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Idiomas Voz
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Profesor Particular de Voz</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform font-mono">Visitar →</span>
                </div>
                <div className={`mt-2.5 sm:mt-3 p-2 sm:p-2.5 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Práctica conversacional en directo con corrección fonética amable.
                </div>
              </div>

              {/* CARD 3: Cosmos 3D */}
              <div 
                onClick={() => onSelectExperience('astro')}
                className={`w-[85vw] sm:w-auto shrink-0 snap-center lg:col-span-2 group cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
                  isDark 
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/assets/miniapps/cosmos_logo.png" 
                      alt="Cosmos 3D" 
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Cosmos 3D
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Simulador Espacial NASA</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform font-mono">Visitar →</span>
                </div>
                <div className={`mt-2.5 sm:mt-3 p-2 sm:p-2.5 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Visualización tridimensional fotorrealista con mecánica celeste oficial.
                </div>
              </div>

              {/* CARD 4: Criterio */}
              <div 
                onClick={() => onSelectExperience('verify')}
                className={`w-[85vw] sm:w-auto shrink-0 snap-center lg:col-span-3 group cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
                  isDark 
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/assets/miniapps/criterio_logo.png" 
                      alt="Criterio" 
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Criterio
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Pensamiento Crítico & IA</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform font-mono">Visitar →</span>
                </div>
                <div className={`mt-2.5 sm:mt-3 p-2 sm:p-2.5 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Auditoría de afirmaciones y contraste con fuentes científicas oficiales.
                </div>
              </div>

              {/* CARD 5: IA Lab */}
              <div 
                onClick={() => onSelectExperience('ai-lab')}
                className={`w-[85vw] sm:w-auto shrink-0 snap-center lg:col-span-3 group cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
                  isDark 
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/assets/miniapps/ialab_logo.png" 
                      alt="IA Lab" 
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        IA Lab
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Laboratorio de Inteligencia Artificial</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-400 group-hover:translate-x-0.5 transition-transform font-mono">Visitar →</span>
                </div>
                <div className={`mt-2.5 sm:mt-3 p-2 sm:p-2.5 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Simulación de redes neuronales 2D, tokenización y visión artificial.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 2: SHOWCASE SOBERBIO DE EXPERIENCIAS (DISEÑO LIMPIO 2026) */}
        {/* ========================================================================= */}
        <section id="carousel-section" className="snap-section min-h-[calc(100svh-3.75rem)] md:min-h-[calc(100vh-3.75rem)] relative flex flex-col justify-center py-4 sm:py-6">
          <div className={`w-full rounded-3xl p-4 sm:p-6 border transition-colors ${
            isDark 
              ? 'bg-[#0c101c] border-slate-800/90 shadow-xl' 
              : 'bg-white border-slate-200 shadow-md'
          }`}>
            
            {/* 1. Selector Superior de las 5 MiniApps */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3.5 mb-4 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2.5">
                <img 
                  src={GOALS_EXPERIENCES[currentSlide.id]?.logoUrl} 
                  alt={currentSlide.name} 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-slate-700/40 shadow-sm" 
                />
                <div>
                  <h2 className={`font-bold text-sm sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currentSlide.name}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-slate-400">{currentSlide.tagline}</p>
                </div>
              </div>

              {/* Selector de Pestañas Minimalista */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => { setCurrentSlideIndex(idx); setActiveFeatureIndex(0); }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      currentSlideIndex === idx 
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isDark ? 'bg-slate-900/60 border border-slate-800/60 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Grid de 2 Columnas (Imagen a la izquierda, Texto y Variantes a la derecha) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
              
              {/* Visor de Imagen Fotorrealista 100% Limpio (Sin texto encima) */}
              <div className="lg:col-span-7 relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-lg group">
                <img
                  src={activeFeature.image || currentSlide.image}
                  alt={activeFeature.title}
                  key={`${currentSlide.id}_${activeFeatureIndex}`}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-102 animate-fadeIn"
                />

                {/* Flechas de navegación sobre la imagen en las esquinas inferiores */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-20">
                  <button
                    type="button"
                    onClick={handlePrevFeature}
                    className="w-8 h-8 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                    {activeFeatureIndex + 1} / {currentSlide.features.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextFeature}
                    className="w-8 h-8 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    title="Siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Columna Informativa y Selector de Variantes */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-3 text-left">
                
                {/* Badge y Titular */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {activeFeature.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Variante {activeFeatureIndex + 1} de {currentSlide.features.length}
                    </span>
                  </div>
                  <h3 className={`font-bold text-base sm:text-xl leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activeFeature.title}
                  </h3>
                  <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {activeFeature.desc}
                  </p>
                </div>

                {/* Selector de las 4 Variantes como chips interactivos */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {currentSlide.features.map((feat, idx) => {
                    const isSelected = activeFeatureIndex === idx;
                    const IconComp = feat.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveFeatureIndex(idx)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/30'
                            : isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900/60' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <div className={`p-1 rounded-lg ${isSelected ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}>
                          <IconComp className="w-3.5 h-3.5 shrink-0" />
                        </div>
                        <span className="text-[11px] font-medium truncate">{feat.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Botón de Acción Principal */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectExperience(currentSlide.id)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 cursor-pointer shadow-md"
                  >
                    <span>Explorar {currentSlide.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 3: METODOLOGÍA PEDAGÓGICA */}
        {/* ========================================================================= */}
        <section id="methodology-section" className="snap-section min-h-[calc(100svh-3.75rem)] md:min-h-[calc(100vh-3.75rem)] relative flex flex-col justify-center py-4 sm:py-6">
          <div className={`w-full rounded-3xl p-5 sm:p-8 text-center border transition-colors ${
            isDark ? 'bg-[#0c101c] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            
            <div className="space-y-2 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Enfoque Pedagógico
              </span>
              <h2 className={`text-xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Aprendizaje Guiado y Adaptativo
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-sans ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Reemplaza el estudio pasivo por una interacción orientada que se calibra al nivel de cada alumno.
              </p>
            </div>

            {/* Grid de 3 Pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left mt-5 sm:mt-6">
              
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-2.5">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Tutoría Socrática
                </h3>
                <p className={`text-xs font-sans mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Formula preguntas orientadoras para que el estudiante deduzca el razonamiento por sí mismo.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-2.5">
                  <Orbit className="w-4 h-4" />
                </div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Visualización Espacial
                </h3>
                <p className={`text-xs font-sans mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Facilita la comprensión de conceptos abstractos de física y geometría con modelos 3D interactivos.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-2.5">
                  <Star className="w-4 h-4" />
                </div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Progreso Medible
                </h3>
                <p className={`text-xs font-sans mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Fomenta la constancia diaria acumulando estrellas, rachas e insignias por cada lección completada.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 4: PREGUNTAS FRECUENTES (FAQ) */}
        {/* ========================================================================= */}
        <section id="faq-section" className="snap-section min-h-[calc(100svh-3.75rem)] md:min-h-[calc(100vh-3.75rem)] relative flex flex-col justify-center py-4 sm:py-6">
          <div className={`w-full rounded-3xl p-6 sm:p-8 text-left border transition-colors ${
            isDark ? 'bg-[#0c101c] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            
            <div className="text-center space-y-1.5 max-w-xl mx-auto mb-6">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Dudas Comunes
              </span>
              <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Preguntas Frecuentes
              </h2>
            </div>

            <div className="space-y-2 max-w-3xl mx-auto">
              {FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx}
                    className={`rounded-xl border transition-all ${
                      isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className={`w-full p-4 flex items-center justify-between gap-4 text-left font-semibold text-xs sm:text-sm cursor-pointer transition-colors ${
                        isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-indigo-600'
                      }`}
                    >
                      <span>{faq.q}</span>
                      <span className={`text-slate-400 text-base transition-transform duration-200 ${isOpen ? 'rotate-45 text-indigo-500' : ''}`}>+</span>
                    </button>
                    {isOpen && (
                      <div className={`px-4 pb-4 text-xs font-sans leading-relaxed border-t pt-3 ${
                        isDark ? 'border-slate-800/60 text-slate-300' : 'border-slate-200 text-slate-600'
                      }`}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Acceso Final */}
            <div className={`rounded-2xl p-6 text-center space-y-3 max-w-2xl mx-auto mt-8 border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Comienza a aprender con Goalskid
              </h3>
              <p className={`text-xs font-sans max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Crea una cuenta gratuita para guardar tu progreso o explora directamente en modo visita.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3 pt-1">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Crear Cuenta Gratuita
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-medium transition-all active:scale-95 cursor-pointer ${
                    isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'
                  }`}
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
