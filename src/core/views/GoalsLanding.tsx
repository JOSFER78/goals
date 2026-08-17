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

interface GoalsLandingProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSelectExperience: (id: ExperienceId) => void;
}

interface FeatureDetail {
  title: string;
  desc: string;
  tag: string;
  icon: React.ElementType;
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
      image: '/assets/previews/school_preview.jpg',
      features: [
        {
          title: 'OCR de Cuadernos Manuscritos',
          desc: 'Escanea texto escrito a mano y expresiones matemáticas con 99.4% de precisión.',
          tag: 'Visión',
          icon: ScanLine
        },
        {
          title: 'Tutoría Socrática Adaptativa',
          desc: 'Pistas pedagógicas calibradas al nivel del estudiante sin dar la solución directa.',
          tag: 'Pedagogía',
          icon: Brain
        },
        {
          title: 'Mapa Conceptual de Refuerzo',
          desc: 'Detecta lagunas conceptuales previas y sugiere repasos específicos.',
          tag: 'Diagnóstico',
          icon: Compass
        },
        {
          title: 'Exámenes de Práctica a Medida',
          desc: 'Genera simulacros de examen adaptados con corrección explicada inmediata.',
          tag: 'Evaluación',
          icon: FileText
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
      image: '/assets/previews/languages_preview.jpg',
      features: [
        {
          title: 'Conversación en Tiempo Real',
          desc: 'Diálogos fluidos y bidireccionales sin latencia, adaptados a tu ritmo.',
          tag: 'Voz en Vivo',
          icon: Mic
        },
        {
          title: 'Evaluación Fonética de Acento',
          desc: 'Análisis acústico que orienta sobre entonación, ritmo y fonética.',
          tag: 'Fonética',
          icon: Volume2
        },
        {
          title: 'Memoria de Progreso y Sesión',
          desc: 'El tutor recuerda expresiones complejas y las refuerza orgánicamente.',
          tag: 'Memoria',
          icon: Layers
        },
        {
          title: 'Escenarios Temáticos Reales',
          desc: 'Práctica inmersiva en viajes, ciencia, negocios y vida cotidiana.',
          tag: 'Inmersión',
          icon: Globe
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
      image: '/assets/previews/cosmos_preview.jpg',
      features: [
        {
          title: 'Motor 3D de 12 Escalas',
          desc: 'Navegación fotorrealista desde órbita terrestre hasta galaxias lejanas.',
          tag: 'Motor 3D',
          icon: Orbit
        },
        {
          title: 'Mecánica Celeste & Física Real',
          desc: 'Datos orbitales oficiales de la NASA, inclinación terrestre e iluminación solar.',
          tag: 'Física NASA',
          icon: Activity
        },
        {
          title: '18 Misiones Espaciales Guiadas',
          desc: 'Trayectorias de las misiones Artemis II, James Webb y Perseverance.',
          tag: 'Misiones',
          icon: Compass
        },
        {
          title: 'Retos Gamificados con XP',
          desc: 'Tests interactivos para desbloquear rangos, estrellas y puntos de progreso.',
          tag: 'Gamificación',
          icon: Star
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
      image: '/assets/previews/criterio_preview.jpg',
      features: [
        {
          title: 'Contraste con Fuentes Oficiales',
          desc: 'Verificación directa frente a publicaciones de NASA, ESA, CSIC y BOE.',
          tag: 'Fuentes 100%',
          icon: ShieldCheck
        },
        {
          title: 'Detección de Sesgos y Alucinaciones',
          desc: 'Laboratorio para identificar textos sintéticos, deepfakes y desinformación.',
          tag: 'Auditoría IA',
          icon: Eye
        },
        {
          title: 'Método PAUSA en 60 Misiones',
          desc: 'Entrenamiento cognitivo para verificar antes de compartir en redes sociales.',
          tag: 'Método PAUSA',
          icon: ShieldCheck
        },
        {
          title: 'Estación de Análisis MATIZA',
          desc: 'Evaluación en 4 capas de rigor para analizar debates y noticias complejas.',
          tag: 'Rigor Crítico',
          icon: Sliders
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
      image: '/assets/previews/ialab_preview.jpg',
      features: [
        {
          title: 'Simulador 2D de Redes Neuronales',
          desc: 'Ajusta capas y tasas de aprendizaje mientras ves la frontera de decisión en vivo.',
          tag: 'Redes 2D',
          icon: Brain
        },
        {
          title: 'Explorador de Tokens y Probabilidad',
          desc: 'Inspecciona cómo los LLMs predicen la siguiente palabra según la temperatura.',
          tag: 'LLM Tokens',
          icon: Terminal
        },
        {
          title: 'Convolución y Visión Artificial',
          desc: 'Aplica matrices de filtro 3x3 celda a celda para entender la visión por computador.',
          tag: 'Visión IA',
          icon: Cpu
        },
        {
          title: 'Ética y Ley de IA Europea',
          desc: 'Casos interactivos para auditar sesgos algorítmicos y privacidad de datos.',
          tag: 'Ética & Ley',
          icon: BarChart3
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 py-8">

        {/* ========================================================================= */}
        {/* BLOQUE 1: HERO PRINCIPAL ELEGANTE Y SOBERBIO */}
        {/* ========================================================================= */}
        <section id="hero-section" className="relative flex flex-col items-center justify-center text-center pt-4 pb-6">
          
          {/* Badge de Versión Sobrio */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide mb-5 transition-colors ${
            isDark 
              ? 'bg-slate-900 border border-slate-800 text-slate-300' 
              : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold">Goalskid v2.5.0</span>
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

          <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mt-4 font-sans ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Resolución guiada de cuadernos manuscritos por OCR, tutor conversacional de idiomas por voz, simulador espacial NASA y laboratorio de IA en una experiencia unificada y sin distracciones.
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-wrap justify-center items-center gap-3.5 mt-7">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-6 sm:px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Comenzar Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('carousel-section')}
              className={`px-5 sm:px-6 py-3 rounded-xl border font-medium text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <span>Ver Demostración</span>
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* BENTO GRID DE LAS 5 MINIAPPS (LIMPIO Y SIN SATURACIÓN) */}
          {/* ========================================================================= */}
          <div id="miniapps-bento" className="w-full mt-10 pt-4">
            <div className="flex items-center justify-between mb-4 text-left">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Módulos de Aprendizaje
                </span>
                <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  5 Experiencias Integradas
                </h2>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">Selecciona cualquier módulo para explorar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 text-left">

              {/* CARD 1: Escuela IA */}
              <div 
                onClick={() => { setCurrentSlideIndex(0); setActiveFeatureIndex(0); scrollToSection('carousel-section'); }}
                className={`lg:col-span-2 group cursor-pointer p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
                  isDark 
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/assets/miniapps/school_logo.png" 
                      alt="Escuela IA" 
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Escuela IA
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Tutor OCR de Cuadernos</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                </div>
                <div className={`mt-3 p-2.5 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Reconocimiento manuscrito y orientación socrática paso a paso.
                </div>
              </div>

              {/* CARD 2: Idiomas Voz */}
              <div 
                onClick={() => { setCurrentSlideIndex(1); setActiveFeatureIndex(0); scrollToSection('carousel-section'); }}
                className={`lg:col-span-2 group cursor-pointer p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
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
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Idiomas Voz
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Profesor Particular de Voz</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                </div>
                <div className={`mt-3 p-2.5 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Práctica conversacional en directo con corrección fonética amable.
                </div>
              </div>

              {/* CARD 3: Cosmos 3D */}
              <div 
                onClick={() => { setCurrentSlideIndex(2); setActiveFeatureIndex(0); scrollToSection('carousel-section'); }}
                className={`lg:col-span-2 group cursor-pointer p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
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
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Cosmos 3D
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Simulador Espacial NASA</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                </div>
                <div className={`mt-3 p-2.5 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Visualización tridimensional fotorrealista con mecánica celeste oficial.
                </div>
              </div>

              {/* CARD 4: Criterio */}
              <div 
                onClick={() => { setCurrentSlideIndex(3); setActiveFeatureIndex(0); scrollToSection('carousel-section'); }}
                className={`lg:col-span-3 group cursor-pointer p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
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
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Criterio
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Pensamiento Crítico & IA</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                </div>
                <div className={`mt-3 p-2.5 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Auditoría de afirmaciones y contraste con fuentes científicas oficiales.
                </div>
              </div>

              {/* CARD 5: IA Lab */}
              <div 
                onClick={() => { setCurrentSlideIndex(4); setActiveFeatureIndex(0); scrollToSection('carousel-section'); }}
                className={`lg:col-span-3 group cursor-pointer p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
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
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700/50 shadow-sm" 
                    />
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        IA Lab
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Laboratorio de Inteligencia Artificial</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                </div>
                <div className={`mt-3 p-2.5 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  Simulación de redes neuronales 2D, tokenización y visión artificial.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 2: CARRUSEL SOBERBIO Y NAVEGABLE (CON FLECHAS ACTIVAS) */}
        {/* ========================================================================= */}
        <section id="carousel-section" className="relative py-2">
          <div className={`w-full rounded-3xl p-5 sm:p-7 border transition-colors ${
            isDark 
              ? 'bg-[#0c101c] border-slate-800/90 shadow-xl' 
              : 'bg-white border-slate-200 shadow-md'
          }`}>
            
            {/* Header del Carrusel: Selector y Controles */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              
              <div className="flex items-center gap-3">
                <img 
                  src={GOALS_EXPERIENCES[currentSlide.id]?.logoUrl} 
                  alt={currentSlide.name} 
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700/40 shadow-sm" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`font-bold text-lg sm:text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {currentSlide.name}
                    </h2>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {currentSlide.badgeTag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{currentSlide.tagline}</p>
                </div>
              </div>

              {/* Selector de Pestañas y Flechas */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <div className={`flex items-center gap-1 p-1 rounded-xl border overflow-x-auto scrollbar-none ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  {SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => { setCurrentSlideIndex(idx); setActiveFeatureIndex(0); }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        currentSlideIndex === idx 
                          ? isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>

                {/* Flechas de Navegación de Módulo */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handlePrevSlide}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                    title="Módulo Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                    title="Módulo Siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Split Layout: Vista Previa y Opciones Explicadas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mt-6">
              
              {/* Imagen / Visualizador Limpio */}
              <div className={`lg:col-span-7 rounded-2xl overflow-hidden border flex flex-col justify-end relative min-h-[340px] sm:min-h-[400px] group ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <img
                  src={currentSlide.image}
                  alt={currentSlide.heading}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-102"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none"></div>

                {/* Flechas Flotantes Laterales en la Foto */}
                <button
                  type="button"
                  onClick={handlePrevFeature}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-20 shadow-lg"
                  title="Anterior (Flecha Izquierda)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleNextFeature}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-20 shadow-lg"
                  title="Siguiente (Flecha Derecha)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Pie con Descripción de la Funcionalidad Activa */}
                <div className="relative z-10 p-4 sm:p-5 bg-slate-950/85 backdrop-blur-md border-t border-slate-800/80 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {activeFeature.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeFeatureIndex + 1} de {currentSlide.features.length}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {activeFeature.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">
                    {activeFeature.desc}
                  </p>
                </div>
              </div>

              {/* Columna Derecha: 4 Opciones Explicadas */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5 text-left">
                
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                    Características Explicadas
                  </span>

                  <div className="space-y-2">
                    {currentSlide.features.map((feat, idx) => {
                      const isSelected = activeFeatureIndex === idx;
                      const IconComponent = feat.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveFeatureIndex(idx)}
                          className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3 ${
                            isSelected 
                              ? isDark 
                                ? 'bg-slate-900 border-indigo-500 text-white' 
                                : 'bg-indigo-50/70 border-indigo-300 text-slate-900'
                              : isDark 
                                ? 'bg-slate-950/60 hover:bg-slate-900/60 border-slate-800/80 text-slate-300' 
                                : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-indigo-500' 
                              : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                          }`}>
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs truncate">
                              {feat.title}
                            </h4>
                            <p className={`text-[11px] font-sans mt-0.5 leading-relaxed ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {feat.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Botón de Entrada */}
                <button
                  onClick={() => onSelectExperience(currentSlide.id)}
                  className="w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 cursor-pointer shadow-sm"
                >
                  <span>Explorar {currentSlide.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 3: METODOLOGÍA PEDAGÓGICA */}
        {/* ========================================================================= */}
        <section id="methodology-section" className="relative py-2">
          <div className={`w-full rounded-3xl p-6 sm:p-8 text-center border transition-colors ${
            isDark ? 'bg-[#0c101c] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            
            <div className="space-y-2 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Enfoque Pedagógico
              </span>
              <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Aprendizaje Guiado y Adaptativo
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-sans ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Reemplaza el estudio pasivo por una interacción orientada que se calibra al nivel de cada alumno.
              </p>
            </div>

            {/* Grid de 3 Pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left mt-6">
              
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
        <section id="faq-section" className="relative py-2">
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
