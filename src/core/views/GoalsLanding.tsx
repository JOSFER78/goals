import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, 
  Cpu, Zap, Flame, Shield, Globe, Orbit, ArrowUp, ArrowDown, 
  Layers, Brain, Check, Star, Terminal, Radio, Activity, Atom, Lock
} from 'lucide-react';
import { ExperienceId } from '../types';

interface GoalsLandingProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSelectExperience: (id: ExperienceId) => void;
}

interface MiniAppSlide {
  id: ExperienceId;
  name: string;
  icon: string;
  tagline: string;
  badgeTag: string;
  themeColor: string;
  cardBorder: string;
  glowShadow: string;
  bgGradient: string;
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
      name: 'Escuela',
      icon: '📚',
      tagline: 'Tutor IA Multimodal & OCR de Cuadernos Manuscritos',
      badgeTag: 'Mini App #1 Principal',
      themeColor: '#10b981',
      cardBorder: 'border-emerald-500/50',
      glowShadow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      bgGradient: 'from-emerald-950/90 via-slate-950 to-slate-950',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      heading: 'Escanea tus Ejercicios y Cuadernos con la Cámara',
      description: 'Haz una foto a tus deberes: la IA reconoce la escritura manuscrita y te guía paso a paso sin dar la respuesta directamente.',
      image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=800&auto=format&fit=crop',
      bullets: [
        'Reconocimiento multimodal OCR de texto manuscrito y ecuaciones',
        'Explicaciones didácticas adaptadas a primaria, secundaria y bachillerato',
        'Mapa conceptual interactivo que identifica los puntos a reforzar',
        'Generación de problemas similares para practicar antes de exámenes'
      ]
    },
    {
      id: 'languages',
      name: 'Idiomas',
      icon: '🌐',
      tagline: 'AstroLingo Conversacional & Profesor de Voz en Tiempo Real',
      badgeTag: 'Voz & Memoria IA',
      themeColor: '#06b6d4',
      cardBorder: 'border-cyan-500/50',
      glowShadow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]',
      bgGradient: 'from-cyan-950/90 via-slate-950 to-slate-950',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.4)]',
      heading: 'Profesor de Voz IA en Directo con Memoria Personal',
      description: 'Habla en tiempo real con un tutor de voz IA que recuerda tus errores pasados, adapta el vocabulario y evalúa tu pronunciación.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      bullets: [
        'Conversación fluida voz a voz en tiempo real con memoria personalizada',
        'Inmersión en vocabulario científico y tecnológico aplicado',
        'Análisis de forma de onda fonética y puntuación de fluidez',
        'Corrección gramatical amable durante la charla hablada'
      ]
    },
    {
      id: 'astro',
      name: 'AstroLingo',
      icon: '🪐',
      tagline: 'Astrofísica, Misiones Espaciales & Laboratorio 3D NASA',
      badgeTag: 'Visor 3D NASA',
      themeColor: '#6366f1',
      cardBorder: 'border-indigo-500/50',
      glowShadow: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]',
      bgGradient: 'from-indigo-950/90 via-slate-950 to-slate-950',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      btnBg: 'bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black shadow-[0_0_20px_rgba(99,102,241,0.4)]',
      heading: 'Exploración Espacial 3D Fotorrealista en 8 Escalas',
      description: 'Navega en 3D interactivo a través de 8 escalas del Universo: desde la órbita Tierra-Luna hasta el agujero negro supermasivo M87*.',
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop',
      bullets: [
        'Simulador 3D en tiempo real con controles de órbita y Three.js',
        'Lecciones de misiones reales: Artemis II, Starship Raptor 3 y Webb',
        'Tests dinámicos con preguntas de ordenación cronológica espacial',
        'Visualizador de texturas procedimentales e iluminación de la NASA'
      ]
    },
    {
      id: 'verify',
      name: 'Verifica',
      icon: '🛡️',
      tagline: 'Investigación & Contraste con Fuentes Científicas Oficiales',
      badgeTag: 'Rigor & Evidencia',
      themeColor: '#f59e0b',
      cardBorder: 'border-amber-500/50',
      glowShadow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
      bgGradient: 'from-amber-950/90 via-slate-950 to-slate-950',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.4)]',
      heading: 'Verificación Científica y Auditoría de Información',
      description: 'Contrasta noticias, titulares y afirmaciones en tiempo real con bases de datos científicas oficiales de la NASA y la ESA.',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop',
      bullets: [
        'Búsqueda y análisis de fuentes de información primarias',
        'Evaluación del nivel de evidencia científica oficial',
        'Informes claros de verificación estructurados para estudiantes'
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
    <div className="relative w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar text-slate-100 font-display">

      {/* CONTROLES NAVEGACIÓN FLOTANTE LATERAL (Fijo en pantalla) */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 bg-slate-950/90 border border-slate-800/90 p-2 rounded-full backdrop-blur-md shadow-2xl">
        {[1, 2, 3, 4, 5].map((sec) => (
          <button
            key={sec}
            onClick={() => scrollToSection(sec)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeTab === sec 
                ? 'h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(34,211,238,0.9)]' 
                : 'bg-slate-700 hover:bg-slate-500'
            }`}
            title={`Ir al bloque ${sec}`}
          />
        ))}
      </div>

      {/* Contenedor Responsivo Full-Width (Estilo Unificado AstroLingo) */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* ========================================================================= */}
        {/* BLOQUE 1: HERO FUTURISTA 3D CON INFOGRAFÍA VECTORIAL CIBERNÉTICA */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-1" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center items-center py-1 relative overflow-hidden"
        >
          <div className="w-full h-full bg-slate-950/90 border border-indigo-500/30 rounded-3xl p-3 sm:p-5 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative overflow-hidden flex flex-col justify-between items-center text-center">
            
            {/* Animación de fondo Neón Orbital */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-600/20 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-[90px] pointer-events-none" />

            {/* Header del Hero */}
            <div className="space-y-1.5 z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Ecosistema de Inteligencia Educativa</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Bienvenido a <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">GOALS</span>
              </h1>
              
              <p className="text-[11px] sm:text-xs text-slate-300 max-w-lg mx-auto leading-relaxed line-clamp-2">
                La primera plataforma integral donde tus lecciones de clase, práctica de idiomas por voz y laboratorios 3D se conectan en un solo perfil.
              </p>
            </div>

            {/* INFOGRAFÍA VECTORIAL 3D FUTURISTA INTERACTIVA */}
            <div className="w-full my-auto py-1 relative z-10">
              
              {/* Esfera Central de Conexión Neón */}
              <div className="relative max-w-lg mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 shadow-inner">
                
                {/* SVG Holográfico de Fondo con Líneas Animadas */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                  <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                  <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
                </svg>

                <div className="grid grid-cols-4 gap-2 relative z-10">
                  
                  {/* Nodo 1: Escuela */}
                  <div 
                    onClick={() => onSelectExperience('school')}
                    className="group cursor-pointer bg-slate-950/90 border border-emerald-500/40 hover:border-emerald-400 p-2 rounded-xl text-center transition-all hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  >
                    <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm mb-1 group-hover:rotate-12 transition-transform">
                      📚
                    </div>
                    <div className="font-extrabold text-[10px] text-emerald-300">Escuela</div>
                    <div className="text-[8px] text-slate-400 font-medium">Tutor OCR</div>
                  </div>

                  {/* Nodo 2: Idiomas */}
                  <div 
                    onClick={() => onSelectExperience('languages')}
                    className="group cursor-pointer bg-slate-950/90 border border-cyan-500/40 hover:border-cyan-400 p-2 rounded-xl text-center transition-all hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  >
                    <div className="w-7 h-7 mx-auto rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm mb-1 group-hover:rotate-12 transition-transform">
                      🌐
                    </div>
                    <div className="font-extrabold text-[10px] text-cyan-300">Idiomas</div>
                    <div className="text-[8px] text-slate-400 font-medium">Voz IA</div>
                  </div>

                  {/* Nodo 3: AstroLingo */}
                  <div 
                    onClick={() => onSelectExperience('astro')}
                    className="group cursor-pointer bg-slate-950/90 border border-indigo-500/40 hover:border-indigo-400 p-2 rounded-xl text-center transition-all hover:scale-105 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                  >
                    <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm mb-1 group-hover:rotate-12 transition-transform">
                      🪐
                    </div>
                    <div className="font-extrabold text-[10px] text-indigo-300">AstroLingo</div>
                    <div className="text-[8px] text-slate-400 font-medium">3D NASA</div>
                  </div>

                  {/* Nodo 4: Verifica */}
                  <div 
                    onClick={() => onSelectExperience('verify')}
                    className="group cursor-pointer bg-slate-950/90 border border-amber-500/40 hover:border-amber-400 p-2 rounded-xl text-center transition-all hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                  >
                    <div className="w-7 h-7 mx-auto rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm mb-1 group-hover:rotate-12 transition-transform">
                      🛡️
                    </div>
                    <div className="font-extrabold text-[10px] text-amber-300">Verifica</div>
                    <div className="text-[8px] text-slate-400 font-medium">Rigor ESA</div>
                  </div>

                </div>

                {/* Medidor de Sincronización Global */}
                <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-300 px-1">
                  <span className="flex items-center gap-1 font-bold text-amber-400"><Zap className="w-3 h-3 fill-amber-400" /> XP Unificado</span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Perfil Sincronizado</span>
                  <span className="flex items-center gap-1 font-bold text-rose-400"><Flame className="w-3 h-3 fill-rose-400" /> Racha Global</span>
                </div>

              </div>
            </div>

            {/* Acciones e Indicador de Scroll */}
            <div className="z-10 w-full space-y-1">
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 flex items-center gap-2"
                >
                  <span>Crear Cuenta Gratuita</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => scrollToSection(2)}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-400 transition-colors pt-0.5 animate-bounce"
              >
                <span>Desliza para explorar mini apps</span>
                <ArrowDown className="w-3 h-3 text-cyan-400" />
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 2: CARRUSEL HUD FUTURISTA DE MINI APPS (AJUSTADO AL STICKY EXACTO) */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-2" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center py-1 relative overflow-hidden"
        >
          <div className={`w-full h-full bg-gradient-to-b ${currentSlide.bgGradient} border ${currentSlide.cardBorder} ${currentSlide.glowShadow} rounded-3xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
            
            {/* Header del Carrusel HUD */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1 rounded-xl bg-slate-900 border border-slate-800">{currentSlide.icon}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-black text-sm sm:text-base text-white">{currentSlide.name}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${currentSlide.badgeBg}`}>
                      {currentSlide.badgeTag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium leading-none">{currentSlide.tagline}</p>
                </div>
              </div>

              {/* Selector por Puntos */}
              <div className="flex items-center gap-1">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlideIndex === idx ? 'w-5 bg-white' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Ir a ${s.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Marco de Imagen HUD 3D con Flechas en Pantalla */}
            <div className="relative w-full flex-1 my-1.5 bg-slate-950 rounded-2xl overflow-hidden group border border-slate-800/80">
              <img
                src={currentSlide.image}
                alt={currentSlide.heading}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-3 flex flex-col justify-end">
                <h3 className="font-black text-xs sm:text-base text-white drop-shadow-md">
                  {currentSlide.heading}
                </h3>
                <p className="text-[10px] text-slate-200 line-clamp-2 leading-relaxed drop-shadow">
                  {currentSlide.description}
                </p>
              </div>

              {/* Flecha Izquierda */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/85 border border-slate-700 hover:border-white text-white flex items-center justify-center shadow-xl backdrop-blur-md active:scale-95 transition-all z-20"
                title="Anterior Mini App"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Flecha Derecha */}
              <button
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/85 border border-slate-700 hover:border-white text-white flex items-center justify-center shadow-xl backdrop-blur-md active:scale-95 transition-all z-20"
                title="Siguiente Mini App"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bullets & Botón Entrar */}
            <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
              <div className="grid grid-cols-2 gap-1.5">
                {currentSlide.bullets.slice(0, 2).map((bullet, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-1.5 flex items-start gap-1 text-[9px] text-slate-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-tight font-medium line-clamp-2">{bullet}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelectExperience(currentSlide.id)}
                className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 ${currentSlide.btnBg}`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>🔒 Desbloquear Mini App {currentSlide.name} (Requiere Acceso)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 3: METODOLOGÍA & POR QUÉ AYUDA A GOALS (EFECTOS NEÓN 3D) */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-3" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center py-1 relative overflow-hidden"
        >
          <div className="w-full h-full bg-slate-950/90 border border-cyan-500/30 rounded-3xl p-4 sm:p-5 shadow-[0_0_40px_rgba(6,182,212,0.1)] flex flex-col justify-between items-center text-center">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
                <Brain className="w-3 h-3" />
                <span>Metodología Adaptativa</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">¿Por qué GOALS ayuda al Estudiante?</h2>
              <p className="text-[10px] text-slate-400 max-w-md mx-auto">Elimina la frustración del estudio memorístico mediante tutores de inteligencia artificial.</p>
            </div>

            {/* Grid 3D de 3 Ventajas Clave */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full my-auto">
              
              <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-3.5 text-left space-y-1 hover:border-emerald-400 transition-all hover:scale-102 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-base font-black">
                  🧠
                </div>
                <h3 className="font-extrabold text-xs text-white">Tutor IA que Aprende de Ti</h3>
                <p className="text-[9px] text-slate-300 leading-relaxed">
                  Recuerda tus fallos habituales. Si necesitas reforzar un concepto de química o pronunciación, adapta los futuros tests automáticamente.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-3.5 text-left space-y-1 hover:border-cyan-400 transition-all hover:scale-102 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-base font-black">
                  🌌
                </div>
                <h3 className="font-extrabold text-xs text-white">Comprensión Espacial 3D</h3>
                <p className="text-[9px] text-slate-300 leading-relaxed">
                  Observa la física real de órbitas, satélites de la NASA y misiones espaciales con motores 3D interactivos en tiempo real.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-3.5 text-left space-y-1 hover:border-indigo-400 transition-all hover:scale-102 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-base font-black">
                  🏆
                </div>
                <h3 className="font-extrabold text-xs text-white">Gamificación Unificada</h3>
                <p className="text-[9px] text-slate-300 leading-relaxed">
                  Acumula XP en cualquiera de las 4 apps y mantén viva tu racha de estudio diaria para subir de nivel en el ranking global.
                </p>
              </div>

            </div>

            <button 
              onClick={() => scrollToSection(4)}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <span>Ver infraestructura tecnológica</span>
              <ArrowDown className="w-3 h-3 text-cyan-400" />
            </button>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 4: INFRAESTRUCTURA & TECNOLOGÍA (SISTEMA MATRIZ CIBERNÉTICO) */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-4" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center py-1 relative overflow-hidden"
        >
          <div className="w-full h-full bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col justify-between items-center text-center">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                <Cpu className="w-3 h-3 text-indigo-400" />
                <span>Rigor Científico & IA</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Infraestructura Tecnológica</h2>
              <p className="text-[10px] text-slate-400 max-w-md mx-auto">Potenciado por motores gráficos modernos y bases de conocimiento contrastadas.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full my-auto">
              
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold text-xs">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>OCR Multimodal</span>
                </div>
                <p className="text-[9px] text-slate-300 leading-relaxed">
                  Procesamiento de imagen para cuadernos manuscritos y conversación de voz sin latencia.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Fuentes NASA & ESA</span>
                </div>
                <p className="text-[9px] text-slate-300 leading-relaxed">
                  Datos telemétricos reales, constantes de física astronómica y auditoría científica.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-xs">
                  <Atom className="w-3.5 h-3.5" />
                  <span>Motor WebGL 3D</span>
                </div>
                <p className="text-[9px] text-slate-300 leading-relaxed">
                  Renderizado de partículas fotorreales en 60 FPS con controles de órbita fluidos.
                </p>
              </div>

            </div>

            <button 
              onClick={() => scrollToSection(5)}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <span>Ir al acceso final</span>
              <ArrowDown className="w-3 h-3 text-indigo-400" />
            </button>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOQUE 5: LISTO PARA COMENZAR (CTA INSTIGADOR CIBERNÉTICO) */}
        {/* ========================================================================= */}
        <section 
          id="section-snap-5" 
          className="h-[calc(100vh-89px)] min-h-[480px] snap-start flex flex-col justify-center py-1 relative overflow-hidden"
        >
          <div className="w-full h-full bg-gradient-to-b from-indigo-950/80 via-slate-950 to-slate-950 border border-indigo-500/40 rounded-3xl p-5 sm:p-7 flex flex-col justify-between items-center text-center shadow-[0_0_50px_rgba(99,102,241,0.2)]">
            
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-xl mx-auto shadow-inner animate-bounce">
              🚀
            </div>

            <div className="space-y-2 max-w-lg my-auto">
              <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                ¿Listo para transformar tu forma de aprender?
              </h2>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Crea tu cuenta en menos de 30 segundos y accede gratis a todo el ecosistema de mini apps de GOALS.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Crear Cuenta Gratuita</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-white text-white font-bold text-xs transition-all active:scale-95"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> Sin tarjeta</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> Acceso inmediato</span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
