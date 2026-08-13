import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, 
  Cpu, Zap, Flame, Shield, Globe, Orbit, ArrowDown, 
  Brain, Check, Star, Terminal, ShieldCheck, GraduationCap, Lock
} from 'lucide-react';
import { ExperienceId } from '../types';

interface GoalsLandingProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSelectExperience: (id: ExperienceId) => void;
}

interface MiniAppSlide {
  id: ExperienceId;
  name: string;
  icon: React.ElementType;
  tagline: string;
  badgeTag: string;
  badgeBg: string;
  btnBg: string;
  heading: string;
  description: string;
  image: string;
  bullets: string[];
}

export const GoalsLanding: React.FC<GoalsLandingProps> = ({ onOpenAuth, onSelectExperience }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(1);

  const SLIDES: MiniAppSlide[] = [
    {
      id: 'school',
      name: 'Escuela IA',
      icon: GraduationCap,
      tagline: 'Tutor IA Multimodal & OCR de Cuadernos Manuscritos',
      badgeTag: 'Tutor & OCR',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold',
      heading: 'Reconocimiento Didáctico de Cuadernos y Ejercicios Manuscritos',
      description: 'Captura tus ejercicios o apuntes con la cámara. El motor OCR analiza tu caligrafía y razonamiento, orientándote paso a paso sin dar respuestas directas.',
      image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=800&auto=format&fit=crop',
      bullets: [
        'OCR multimodal especializado en texto manuscrito y expresiones algebraicas',
        'Explicaciones socráticas adaptadas a primaria, secundaria y bachillerato',
        'Mapa conceptual interactivo que identifica los puntos débiles a reforzar',
        'Generación automática de exámenes de práctica personalizados'
      ]
    },
    {
      id: 'languages',
      name: 'Idiomas Voz',
      icon: Globe,
      tagline: 'AstroLingo Conversacional & Profesor de Voz en Tiempo Real',
      badgeTag: 'Voz & Memoria IA',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      btnBg: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold',
      heading: 'Profesor de Voz IA en Directo con Memoria de Sesión',
      description: 'Mantén conversaciones en tiempo real con un tutor que recuerda tu vocabulario objetivo, analiza tu fluidez y corrige amablemente la pronunciación.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      bullets: [
        'Diálogo por voz bidireccional fluido sin latencia perceptible',
        'Inmersión práctica en vocabulario técnico y científico aplicado',
        'Evaluación continua de precisión fonética y estructura gramatical',
        'Adaptación dinámica del ritmo y dificultad según el nivel del alumno'
      ]
    },
    {
      id: 'astro',
      name: 'Cosmos 3D',
      icon: Orbit,
      tagline: 'Astrofísica, Misiones Espaciales & Simulador 3D NASA',
      badgeTag: 'Visor 3D NASA',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold',
      heading: 'Simulador 3D Interactivo con Datos de la NASA y la ESA',
      description: 'Explora el Sistema Solar en tiempo real a escala fotorrealista. Estudia la mecánica celeste de eclipses, oblicuidad terrestre y misiones espaciales.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      bullets: [
        'Renderizado 3D de alta precisión con 8 escalas celestes navegables',
        'Simulación física de la inclinación orbital de 5.14° y rotación planetaria de 24h',
        '18 lecciones interactivas basadas en misiones Artemis, James Webb y Mars 2020',
        'Evaluación mediante tests gamificados con obtención de estrellas e insignias'
      ]
    },
    {
      id: 'verify',
      name: 'Verifica',
      icon: ShieldCheck,
      tagline: 'Auditor Científico de Noticias & Contraste de Evidencia',
      badgeTag: 'Rigor & Fuentes Primarias',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      btnBg: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold',
      heading: 'Investigación y Verificación de Titulares en Tiempo Real',
      description: 'Analiza la veracidad de cualquier titular o afirmación científica contrastándola con repositorios de la ESA, NASA y publicaciones académicas primarias.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      bullets: [
        'Cálculo de índice de credibilidad basado en revisión por pares',
        'Citas directas y referencias verificadas a artículos originales',
        'Desglose analítico de sesgos, manipulaciones o afirmaciones reales',
        'Desarrollo del pensamiento crítico y rigor metodológico'
      ]
    }
  ];

  const currentSlide = SLIDES[currentSlideIndex];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const scrollToSection = (secNumber: number) => {
    setActiveTab(secNumber);
    const el = document.getElementById(`section-snap-${secNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full text-slate-100 font-display">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* ========================================================================= */}
        {/* BLOQUE 1: HERO PRINCIPAL ELEGANTE */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-1" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center items-center py-1 relative overflow-hidden"
        >
          <div className="w-full h-full bg-slate-950/80 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between items-center text-center backdrop-blur-md">
            
            {/* Header del Hero */}
            <div className="flex flex-col items-center gap-2.5 z-10 max-w-xl my-auto">
              
              <div className="flex items-center gap-3">
                <img
                  src="/goals_platform_logo.png"
                  alt="GOALS Platform Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-slate-700/80 shadow-md object-cover"
                />
                <div className="text-left">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-none">
                    GOALS
                  </h1>
                  <p className="text-xs text-indigo-400 font-semibold tracking-wide">
                    Plataforma Educativa Adaptativa
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-semibold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Inteligencia Artificial Multimodal Aplicada</span>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-sans">
                Un entorno pedagógico integrado donde la resolución de ejercicios manuscritos, la práctica de conversación por voz, el laboratorio tridimensional y el contraste de evidencia científica conviven en una experiencia unificada.
              </p>
            </div>

            {/* Panel de Nodos de Mini Apps */}
            <div className="w-full my-auto py-1 relative z-10">
              <div className="relative max-w-2xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 shadow-inner">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
                  
                  {/* Nodo 1: Escuela */}
                  <div 
                    onClick={() => onSelectExperience('school')}
                    className="group cursor-pointer bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 p-3 rounded-xl text-center transition-all hover:bg-slate-900 shadow-sm"
                  >
                    <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white">Escuela IA</div>
                    <div className="text-[10px] text-slate-400 font-medium">Tutor OCR</div>
                  </div>

                  {/* Nodo 2: Idiomas */}
                  <div 
                    onClick={() => onSelectExperience('languages')}
                    className="group cursor-pointer bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/50 p-3 rounded-xl text-center transition-all hover:bg-slate-900 shadow-sm"
                  >
                    <div className="w-8 h-8 mx-auto rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white">Idiomas Voz</div>
                    <div className="text-[10px] text-slate-400 font-medium">Profesor Voz</div>
                  </div>

                  {/* Nodo 3: Cosmos 3D */}
                  <div 
                    onClick={() => onSelectExperience('astro')}
                    className="group cursor-pointer bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/50 p-3 rounded-xl text-center transition-all hover:bg-slate-900 shadow-sm"
                  >
                    <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <Orbit className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white">Cosmos 3D</div>
                    <div className="text-[10px] text-slate-400 font-medium">Visor NASA</div>
                  </div>

                  {/* Nodo 4: Verifica */}
                  <div 
                    onClick={() => onSelectExperience('verify')}
                    className="group cursor-pointer bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/50 p-3 rounded-xl text-center transition-all hover:bg-slate-900 shadow-sm"
                  >
                    <div className="w-8 h-8 mx-auto rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white">Verifica</div>
                    <div className="text-[10px] text-slate-400 font-medium">Rigor Científico</div>
                  </div>

                </div>

                {/* Medidor de Estado del Sistema */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-2">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300"><Zap className="w-3.5 h-3.5 text-amber-400" /> Progreso Sincronizado</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Acceso Unificado</span>
                  <span className="flex items-center gap-1.5 font-medium text-slate-300"><Flame className="w-3.5 h-3.5 text-rose-400" /> Racha Diaria</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="z-10 w-full space-y-2">
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Comenzar Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => scrollToSection(2)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors pt-0.5"
              >
                <span>Explorar características detalladas</span>
                <ArrowDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 2: CARRUSEL DE MINI APPS */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-2" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center py-1 relative overflow-hidden"
        >
          <div className="w-full h-full bg-slate-950/80 border border-slate-800/80 rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-xl backdrop-blur-md">
            
            {/* Header del Carrusel */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
                  <currentSlide.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base text-white">{currentSlide.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentSlide.badgeBg}`}>
                      {currentSlide.badgeTag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{currentSlide.tagline}</p>
                </div>
              </div>

              {/* Selector de diapositivas */}
              <div className="flex items-center gap-1.5">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlideIndex === idx ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Ver ${s.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Vista Previa Visual */}
            <div className="relative w-full flex-1 my-2 bg-slate-950 rounded-2xl overflow-hidden group border border-slate-800/80">
              <img
                src={currentSlide.image}
                alt={currentSlide.heading}
                className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-all duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4 flex flex-col justify-end">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {currentSlide.heading}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mt-1">
                  {currentSlide.description}
                </p>
              </div>

              {/* Controles de Navegación */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-white text-white flex items-center justify-center shadow-lg active:scale-95 transition-all z-20 cursor-pointer"
                title="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-white text-white flex items-center justify-center shadow-lg active:scale-95 transition-all z-20 cursor-pointer"
                title="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Características y Acción */}
            <div className="space-y-2 pt-1.5 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentSlide.bullets.slice(0, 2).map((bullet, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug font-medium">{bullet}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelectExperience(currentSlide.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${currentSlide.btnBg}`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acceder a la Mini App {currentSlide.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 3: METODOLOGÍA ADAPTATIVA DE APRENDIZAJE */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-3" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center py-1 relative overflow-hidden"
        >
          <div className="w-full h-full bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between items-center text-center shadow-xl backdrop-blur-md">
            
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-semibold tracking-wider">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enfoque Pedagógico Integrado</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">¿Cómo Funciona la Metodología GOALS?</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">Reemplaza el estudio memorístico pasivo por una interacción guiada adaptada al ritmo de cada alumno.</p>
            </div>

            {/* Grid de 3 Pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full my-auto">
              
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Tutoría Adaptativa</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Identifica patrones de duda en tiempo real. Ajusta el nivel de las pistas y explicaciones según el desempeño registrado.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Orbit className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Visualización 3D</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Facilita la comprensión de conceptos abstractos de física y astronomía mediante motores interactivos basados en datos oficiales.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Gamificación Medible</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fomenta la constancia diaria acumulando puntos de experiencia y manteniendo la racha activa en todo el ecosistema.
                </p>
              </div>

            </div>

            <button 
              onClick={() => scrollToSection(4)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
            >
              <span>Ver especificaciones técnicas</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 4: RIGOR CIENTÍFICO Y ARQUITECTURA TÉCNICA */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-4" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center py-1 relative overflow-hidden"
        >
          <div className="w-full h-full bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between items-center text-center shadow-xl backdrop-blur-md">
            
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-semibold tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rigor Académico & Tecnología</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Arquitectura Tecnológica</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">Construido con estándares modernos de procesamiento visual y bases de datos contrastadas.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full my-auto">
              
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Terminal className="w-4 h-4" />
                  <span>Procesamiento OCR Multimodal</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reconocimiento de imágenes con extracción de texto manuscrito y expresiones matemáticas para orientación inmediata.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Fuentes Oficiales NASA & ESA</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Constantes físicas verificadas, datos orbitales exactos y contraste de veracidad frente a desinformación en redes.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                  <span>Motor WebGL de Rendimiento</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Simulación de cuerpos celestes con shaders procedurales fluidos y navegación en tiempo real sin complementos externos.
                </p>
              </div>

            </div>

            <button 
              onClick={() => scrollToSection(5)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
            >
              <span>Ir al acceso final</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 5: LLAMADA A LA ACCIÓN FINAL */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-5" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center py-1 relative overflow-hidden"
        >
          <div className="w-full h-full bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-xl backdrop-blur-md">
            
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="space-y-3 max-w-lg my-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Empieza a Utilizar GOALS Hoy Mismo
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Crea tu cuenta de usuario para acceder a todo el ecosistema educativo desde cualquier navegador o dispositivo.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Crear Cuenta Gratuita</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Sin tarjeta de crédito</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Acceso inmediato en la nube</span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
