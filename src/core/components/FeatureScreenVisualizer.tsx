import React from 'react';
import { 
  ScanLine, Brain, Compass, FileText, Globe, Volume2, Layers, 
  Orbit, Activity, Star, ShieldCheck, Eye, Sliders, Cpu, 
  Terminal, BarChart3, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { ExperienceId } from '../types';

interface FeatureScreenVisualizerProps {
  miniAppId: ExperienceId;
  featureIndex: number;
  isDark: boolean;
}

export const FeatureScreenVisualizer: React.FC<FeatureScreenVisualizerProps> = ({
  miniAppId,
  featureIndex
}) => {
  // Render Escuela IA Screens
  if (miniAppId === 'school') {
    if (featureIndex === 0) {
      // OCR de Cuadernos
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          {/* Header de la App */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Escuela IA · Visión OCR</span>
                <span className="text-[10px] text-emerald-400 block font-mono">Confianza: 99.4% · Cuaderno Manuscrito</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              ● En Vivo
            </span>
          </div>

          {/* Cuaderno + Detección OCR */}
          <div className="my-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cuaderno Real */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
              <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                <span>Captura con Cámara</span>
                <span className="text-emerald-400">OCR Activo</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/10 border border-emerald-500/60 relative font-serif text-slate-200 text-sm tracking-wide">
                <span className="text-[9px] font-mono text-emerald-300 absolute -top-2 left-2 bg-slate-900 px-1 border border-emerald-500/40 rounded">
                  Bounding Box IA
                </span>
                <p className="font-mono text-emerald-200 text-sm">3x² - 12x + 9 = 0</p>
                <p className="text-[11px] text-slate-400 mt-1 font-sans italic">«Factorizar por método de raíces cuadráticas»</p>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Trazo manuscrito reconocido
              </div>
            </div>

            {/* Análisis y Desglose Socrático */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div className="text-[10px] font-mono text-indigo-400 mb-1">Estructura Algebraica</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                  <span className="text-slate-400 font-mono">Coeficiente a:</span>
                  <span className="text-indigo-300 font-bold font-mono">3</span>
                </div>
                <div className="flex justify-between bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                  <span className="text-slate-400 font-mono">Coeficiente b:</span>
                  <span className="text-indigo-300 font-bold font-mono">-12</span>
                </div>
                <div className="flex justify-between bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                  <span className="text-slate-400 font-mono">Término indep. c:</span>
                  <span className="text-indigo-300 font-bold font-mono">9</span>
                </div>
              </div>
              <div className="text-[10px] text-indigo-300 bg-indigo-500/10 p-1.5 rounded border border-indigo-500/20 mt-2">
                💡 Pista: Puedes simplificar dividiendo todo entre 3.
              </div>
            </div>
          </div>

          {/* Footer de estado */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Resolución guiada paso a paso</span>
            <span className="text-slate-300 font-bold">1/4 Pasos Completados</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 1) {
      // Tutoría Socrática
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Brain className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Escuela IA · Tutor Socrático</span>
                <span className="text-[10px] text-indigo-400 block font-mono">Pedagogía Activa · Sin Respuestas Directas</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
              Modo Diálogo
            </span>
          </div>

          <div className="my-3 space-y-2.5">
            {/* Mensaje Tutor */}
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                IA
              </div>
              <div className="p-2.5 rounded-2xl rounded-tl-none bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-100">
                Si dividimos la ecuación <span className="font-mono text-emerald-300 font-bold">3x² - 12x + 9 = 0</span> entre 3, ¿qué ecuación equivalente obtienes?
              </div>
            </div>

            {/* Mensaje Alumno */}
            <div className="flex items-start gap-2 max-w-[85%] ml-auto flex-row-reverse">
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                Tú
              </div>
              <div className="p-2.5 rounded-2xl rounded-tr-none bg-slate-800 border border-slate-700 text-xs text-slate-100">
                Obtengo <span className="font-mono text-emerald-300 font-bold">x² - 4x + 3 = 0</span>.
              </div>
            </div>

            {/* Respuesta Tutor */}
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                IA
              </div>
              <div className="p-2.5 rounded-2xl rounded-tl-none bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-100">
                ¡Brillante deducción! 🎯 Ahora busca dos números que multiplicados den <span className="font-mono text-amber-300 font-bold">+3</span> y sumados den <span className="font-mono text-amber-300 font-bold">-4</span>.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Andamiaje cognitivo adaptativo</span>
            <span className="text-emerald-400 font-bold">Progreso: 65%</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 2) {
      // Mapa Conceptual
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Compass className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Escuela IA · Grafo de Conocimiento</span>
                <span className="text-[10px] text-cyan-400 block font-mono">Diagnóstico de Lagunas & Conexiones</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
              Grafo 2D
            </span>
          </div>

          <div className="my-3 grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
              <span className="text-[10px] font-mono text-emerald-400 block">Dominado</span>
              <p className="text-xs font-bold text-slate-100 mt-1">Polinomios</p>
              <span className="text-[10px] font-mono text-emerald-300 font-bold">100%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
              <span className="text-[10px] font-mono text-indigo-400 block">En Curso</span>
              <p className="text-xs font-bold text-slate-100 mt-1">Ecuaciones 2º</p>
              <span className="text-[10px] font-mono text-indigo-300 font-bold">85%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40">
              <span className="text-[10px] font-mono text-amber-400 block">Refuerzo Sugerido</span>
              <p className="text-xs font-bold text-slate-100 mt-1">Factorización</p>
              <span className="text-[10px] font-mono text-amber-300 font-bold">Laguna: -15%</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Ruta personalizada generada para hoy</span>
            <span className="text-indigo-400 font-bold flex items-center gap-1">Ver Repaso <ArrowUpRight className="w-3.5 h-3.5" /></span>
          </div>
        </div>
      );
    }

    // Exámenes de Práctica
    return (
      <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">Goalskid Escuela IA · Simulacro Completado</span>
              <span className="text-[10px] text-amber-400 block font-mono">Corrección Inmediata & Explicaciones</span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
            Aprobado con Excelencia
          </span>
        </div>

        <div className="my-3 flex items-center justify-around p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
          <div className="text-center">
            <span className="text-3xl font-black text-emerald-400 font-mono">9.5</span>
            <span className="text-[10px] text-slate-400 block font-mono">Puntuación / 10</span>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="text-center">
            <div className="flex justify-center text-amber-400 gap-0.5 mb-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-[10px] text-slate-300 font-bold block">3 Estrellas</span>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="text-center">
            <span className="text-xl font-bold text-indigo-400 font-mono">+65 XP</span>
            <span className="text-[10px] text-slate-400 block font-mono">Subida de Rango</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>10 de 10 preguntas respondidas con rigor</span>
          <span className="text-emerald-400">100% Precisión</span>
        </div>
      </div>
    );
  }

  // Render Idiomas Voz Screens
  if (miniAppId === 'languages') {
    if (featureIndex === 0) {
      // Conversación en Tiempo Real
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
                <Globe className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Idiomas Voz · AstroLingo Tutor</span>
                <span className="text-[10px] text-sky-400 block font-mono">Voz Bidireccional de Baja Latencia (&lt;120ms)</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Audio en Vivo
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/60 text-xs text-sky-100 flex items-center gap-2">
              <span className="text-lg">🧑‍🚀</span>
              <div>
                <span className="font-bold text-sky-300 block text-[10px]">AstroLingo:</span>
                "Welcome to the orbital observatory! Which planet are we studying today?"
              </div>
            </div>

            {/* Onda de Audio Ecualizador */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 flex-1 h-6">
                {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 30, 65, 85, 40].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-sky-400 rounded-full transition-all duration-300 animate-pulse" 
                    style={{ height: `${h}%`, animationDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-sky-300 pl-2">Escuchando...</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
              <span className="text-lg">👧</span>
              <div>
                <span className="font-bold text-slate-300 block text-[10px]">Tu voz:</span>
                "I would love to explore the rings of Saturn and their icy composition."
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Conversación natural sin pausas forzadas</span>
            <span className="text-emerald-400 font-bold">Fluidez: 96%</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 1) {
      // Evaluación Fonética
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Idiomas Voz · Análisis Acústico</span>
                <span className="text-[10px] text-emerald-400 block font-mono">Espectrograma & Precisión de Fonemas</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              Fonética Avanzada
            </span>
          </div>

          <div className="my-3 space-y-2.5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Precisión Global</span>
                <span className="text-xl font-black text-emerald-400 font-mono">98.4%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Entonación</span>
                <span className="text-xl font-black text-indigo-400 font-mono">Nativa</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Velocidad</span>
                <span className="text-xl font-black text-cyan-400 font-mono">132 wpm</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">Desglose de Fonemas Evaluados:</span>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">/θ/ (99%)</span>
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">/æ/ (97%)</span>
                <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs border border-indigo-500/30">/r/ (96%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Feedback en tiempo real al pronunciar</span>
            <span className="text-emerald-400">Excelente Articulación</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 2) {
      // Memoria de Progreso
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Layers className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Idiomas Voz · Memoria Espaciada</span>
                <span className="text-[10px] text-amber-400 block font-mono">Repetición Inteligente (Curva del Olvido)</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
              Retención 94%
            </span>
          </div>

          <div className="my-3 grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-2xl font-black text-amber-400 font-mono">48</span>
              <span className="text-[10px] text-slate-400 block font-mono mt-0.5">Expresiones Consolidadas</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-2xl font-black text-emerald-400 font-mono">14 Días</span>
              <span className="text-[10px] text-slate-400 block font-mono mt-0.5">Racha de Práctica Diaria</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Próximo repaso programado automáticamente</span>
            <span className="text-amber-400 font-mono font-bold">En 48h (3 palabras)</span>
          </div>
        </div>
      );
    }

    // Escenarios Temáticos
    return (
      <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Globe className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">Goalskid Idiomas Voz · Escenario de Inmersión</span>
              <span className="text-[10px] text-purple-400 block font-mono">Simulaciones Reales sin Filtros</span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
            Nivel B2 / C1
          </span>
        </div>

        <div className="my-3 p-3 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-200">Misión: Entrevista en Centro Espacial Europeo</span>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-900/60 px-2 py-0.5 rounded">Misión 8</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Objetivo: Explicar la trayectoria orbital del telescopio James Webb usando vocabulario técnico de astrofísica en inglés.
          </p>
          <div className="flex gap-1.5 pt-1 text-[10px] font-mono text-purple-300">
            <span className="bg-purple-900/40 px-1.5 py-0.5 rounded border border-purple-700/40">Lagrange Point L2</span>
            <span className="bg-purple-900/40 px-1.5 py-0.5 rounded border border-purple-700/40">Solar Shield</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
          <span>Inmersión total en contextos profesionales y científicos</span>
          <span className="text-purple-300 font-bold">12 Escenarios Activos</span>
        </div>
      </div>
    );
  }

  // Render Cosmos 3D Screens
  if (miniAppId === 'astro') {
    if (featureIndex === 0) {
      // Motor 3D de 12 Escalas
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Orbit className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Cosmos 3D · Visor Astrofísico NASA</span>
                <span className="text-[10px] text-indigo-400 block font-mono">12 Escalas Dinámicas (Órbita Baja a Galaxias)</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
              WebGL 60 FPS
            </span>
          </div>

          <div className="my-3 grid grid-cols-2 gap-3 relative z-10">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] font-mono text-indigo-400 block">Telemetría de la Tierra:</span>
              <div className="flex justify-between font-mono text-[11px]"><span className="text-slate-400">Radio:</span><span className="text-slate-200">6.371 km</span></div>
              <div className="flex justify-between font-mono text-[11px]"><span className="text-slate-400">Inclinación:</span><span className="text-slate-200">23.44°</span></div>
              <div className="flex justify-between font-mono text-[11px]"><span className="text-slate-400">Atmósfera:</span><span className="text-emerald-400">Rayleigh Shader</span></div>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] font-mono text-indigo-400 block">Nivel de Escala Activo:</span>
              <p className="text-xs font-bold text-indigo-200 mt-1">Escala 3: Sistema Tierra-Luna</p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-indigo-500 h-1.5 rounded-full w-1/4"></div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 block pt-1">Zoom suave con rueda o gesto táctil</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono relative z-10">
            <span>Datos astronómicos oficiales del JPL Horizons</span>
            <span className="text-indigo-400 font-bold">100% Precisión Física</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 1) {
      // Mecánica Celeste & Física Real
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Cosmos 3D · Mecánica Celeste</span>
                <span className="text-[10px] text-cyan-400 block font-mono">Ecuaciones de Kepler & Vectores de Gravedad</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
              Física NASA
            </span>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">Estación Espacial Internacional (ISS)</span>
                <span className="font-bold text-cyan-300 font-mono text-sm">Altitud 408 km · 27.600 km/h</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Órbita LEO
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-slate-300">
              ☀️ <span className="font-bold text-cyan-200">Simulador de Eclipses:</span> Calcula la umbra y penumbra exacta proyectada por la Luna sobre la superficie terrestre en tiempo real.
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Vectores gravitacionales calculados en tiempo real</span>
            <span className="text-cyan-400 font-bold">Simulación Continua</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 2) {
      // 18 Misiones Espaciales Guiadas
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <Compass className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Cosmos 3D · Misión Artemis II</span>
                <span className="text-[10px] text-blue-400 block font-mono">Trayectoria de Inyección Translunar NASA</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
              18 Misiones
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-200 block">Nave Espacial Orion</span>
                <span className="text-[10px] text-slate-300 block">Trayectoria de Retorno Libre alrededor de la Luna</span>
              </div>
              <span className="text-xs font-mono font-bold text-blue-300 bg-blue-900/60 px-2 py-1 rounded border border-blue-700/50">
                Paso 3 de 5
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 block font-mono">Lanzamiento</span>
                <span className="text-[11px] text-slate-200 font-mono font-bold">SLS Block 1</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 block font-mono">Distancia Luna</span>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">384.400 km</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 block font-mono">Reentrada</span>
                <span className="text-[11px] text-amber-400 font-mono font-bold">11 km/s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Incluye James Webb, Voyager 1 y Perseverance</span>
            <span className="text-blue-400 font-bold">Waypoints 3D</span>
          </div>
        </div>
      );
    }

    // Retos Gamificados con XP
    return (
      <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">Goalskid Cosmos 3D · Misión Completada</span>
              <span className="text-[10px] text-amber-400 block font-mono">Progreso Gamificado & Rangos Astronómicos</span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
            ¡Victoria!
          </span>
        </div>

        <div className="my-3 p-3 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border border-amber-500/30 text-center space-y-1.5">
          <div className="flex justify-center text-amber-400 gap-1">
            <Star className="w-5 h-5 fill-amber-400 animate-bounce" />
            <Star className="w-5 h-5 fill-amber-400 animate-bounce" style={{ animationDelay: '100ms' }} />
            <Star className="w-5 h-5 fill-amber-400 animate-bounce" style={{ animationDelay: '200ms' }} />
          </div>
          <span className="text-sm font-black text-slate-100 block tracking-wide">RANGO DESBLOQUEADO: COMANDANTE ORBITAL</span>
          <div className="flex justify-center gap-4 text-xs font-mono pt-1">
            <span className="text-amber-300 font-bold">+50 XP</span>
            <span className="text-emerald-300 font-bold">+1 Insignia NASA</span>
            <span className="text-indigo-300 font-bold">Nivel 12</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
          <span>Desbloquea nuevas sondas y telescopios al ganar XP</span>
          <span className="text-amber-400 font-bold">100% Retos Superados</span>
        </div>
      </div>
    );
  }

  // Render Criterio Screens
  if (miniAppId === 'verify') {
    if (featureIndex === 0) {
      // Contraste con Fuentes Oficiales
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Criterio · Auditoría de Fuentes Oficiales</span>
                <span className="text-[10px] text-emerald-400 block font-mono">Contraste Primario: NASA · ESA · CSIC · BOE</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              Verificado 100%
            </span>
          </div>

          <div className="my-2.5 space-y-1.5 text-xs">
            <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-center justify-between">
              <span className="text-rose-200 text-[11px] truncate">«Asteroide colisionará con la Tierra en 2032»</span>
              <span className="text-[9px] font-mono bg-rose-900/80 text-rose-300 px-1.5 py-0.5 rounded shrink-0">Bulo Viral</span>
            </div>

            <div className="space-y-1">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-slate-200">NASA JPL CNEOS:</span>
                  <span className="text-slate-300 truncate">Probabilidad &lt; 0.001% (Paso seguro)</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold shrink-0">100% Fiable</span>
              </div>

              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-slate-200">ESA NEO Coordination:</span>
                  <span className="text-slate-300 truncate">Órbita confirmada a 1.2 distancias lunares</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold shrink-0">Oficial</span>
              </div>

              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-slate-200">CSIC / IAC España:</span>
                  <span className="text-slate-300 truncate">Observaciones fotométricas ratificadas</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold shrink-0">CSIC</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Sin opiniones: Datos primarios verificados</span>
            <span className="text-emerald-400 font-bold">Veredicto Científico</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 1) {
      // Detección de Sesgos y Alucinaciones
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <Eye className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Criterio · Laboratorio Forense de IA</span>
                <span className="text-[10px] text-purple-400 block font-mono">Auditoría de Textos Sintéticos & Deepfakes</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
              Escáner Forense
            </span>
          </div>

          <div className="my-2.5 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-purple-300 block">Probabilidad Generado por IA</span>
                <span className="text-xl font-black text-rose-400 font-mono">87.4%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-purple-300 block">Sesgo Emocional</span>
                <span className="text-xl font-black text-amber-400 font-mono">Alto (Urgencia)</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">Mapa de Calor Sintético (Perplejidad de Tokens):</span>
              <p className="font-mono text-xs leading-relaxed">
                <span className="bg-rose-500/30 text-rose-200 px-1 rounded">Increíble descubrimiento</span>{' '}
                <span className="bg-rose-500/30 text-rose-200 px-1 rounded">los científicos ocultan</span>{' '}
                <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded">la verdad sobre</span>{' '}
                <span className="bg-rose-500/30 text-rose-200 px-1 rounded">la energía libre</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Detección de patrones y artefactos algorítmicos</span>
            <span className="text-rose-400 font-bold">Alerta: Texto Sintético</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 2) {
      // Método PAUSA en 60 Misiones
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid Criterio · Protocolo PAUSA</span>
                <span className="text-[10px] text-indigo-400 block font-mono">Entrenamiento Cognitivo Anti-Desinformación</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
              60 Misiones
            </span>
          </div>

          <div className="my-2.5 space-y-1 text-xs">
            <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono flex items-center justify-center text-[10px]">P</span>
              <span className="text-slate-200 font-medium">Parar antes de reaccionar o compartir por impulso</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono flex items-center justify-center text-[10px]">A</span>
              <span className="text-slate-200 font-medium">Analizar el autor, reputación y fecha de publicación</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono flex items-center justify-center text-[10px]">U</span>
              <span className="text-slate-200 font-medium">Ubicar la fuente primaria oficial con enlaces reales</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 font-bold font-mono flex items-center justify-center text-[10px]">S</span>
              <span className="text-slate-200 font-medium">Sintetizar el consenso científico sin sesgos</span>
              <span className="text-[10px] text-indigo-400 font-mono ml-auto shrink-0">En Curso</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Hábitos críticos automatizados para redes sociales</span>
            <span className="text-indigo-400 font-bold">Misión 24 de 60</span>
          </div>
        </div>
      );
    }

    // Estación MATIZA
    return (
      <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">Goalskid Criterio · Matriz MATIZA</span>
              <span className="text-[10px] text-teal-400 block font-mono">Evaluación Rigurosa en 4 Capas de Juicio</span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono border border-teal-500/30">
            Rigor Científico
          </span>
        </div>

        <div className="my-2.5 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between font-mono text-[10px] text-teal-300 mb-1">
              <span>Capa 1: Hechos</span>
              <span>88%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-teal-400 h-1.5 rounded-full w-[88%]"></div></div>
            <span className="text-[10px] text-slate-400 mt-1 block">Datos auditables</span>
          </div>

          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between font-mono text-[10px] text-cyan-300 mb-1">
              <span>Capa 2: Método</span>
              <span>92%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-cyan-400 h-1.5 rounded-full w-[92%]"></div></div>
            <span className="text-[10px] text-slate-400 mt-1 block">Rigor metodológico</span>
          </div>

          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between font-mono text-[10px] text-amber-300 mb-1">
              <span>Capa 3: Intereses</span>
              <span>12%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-400 h-1.5 rounded-full w-[12%]"></div></div>
            <span className="text-[10px] text-slate-400 mt-1 block">Conflicto nulo</span>
          </div>

          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between font-mono text-[10px] text-purple-300 mb-1">
              <span>Capa 4: Matices</span>
              <span>95%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-purple-400 h-1.5 rounded-full w-[95%]"></div></div>
            <span className="text-[10px] text-slate-400 mt-1 block">Consenso amplio</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
          <span>Análisis profundo de debates contemporáneos</span>
          <span className="text-teal-400 font-bold">Matriz Completa</span>
        </div>
      </div>
    );
  }

  // Render IA Lab Screens
  if (miniAppId === 'ai-lab') {
    if (featureIndex === 0) {
      // Simulador 2D de Redes Neuronales
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Brain className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid IA Lab · Redes Neuronales 2D</span>
                <span className="text-[10px] text-indigo-400 block font-mono">Frontera de Decisión no Lineal & Backpropagation</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
              Época: 340
            </span>
          </div>

          <div className="my-2.5 grid grid-cols-2 gap-2 text-xs">
            {/* Gráfico 2D */}
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-indigo-300 mb-1">Frontera de Clasificación:</span>
              <div className="w-full h-20 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-purple-900/20 to-emerald-900/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 absolute top-3 left-4 shadow-sm"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 absolute top-6 left-8 shadow-sm"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-3 right-5 shadow-sm"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-6 right-8 shadow-sm"></div>
                <span className="text-[9px] font-mono text-slate-400 relative z-10">Frontera Curva Óptima</span>
              </div>
            </div>

            {/* Hiperparámetros */}
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between"><span className="text-slate-400">Capas ocultas:</span><span className="text-indigo-300 font-bold">3 capas</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Neuronas/capa:</span><span className="text-indigo-300 font-bold">8 neuronas</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Tasa aprend.:</span><span className="text-emerald-300 font-bold">0.03</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Pérdida (Loss):</span><span className="text-emerald-300 font-bold">0.012</span></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Experimenta en vivo sin escribir código</span>
            <span className="text-emerald-400 font-bold">Precisión: 99.1%</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 1) {
      // Explorador de Tokens
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid IA Lab · Explorador de Tokens LLM</span>
                <span className="text-[10px] text-blue-400 block font-mono">Distribución de Probabilidad del Siguiente Token</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
              Temp: 0.7
            </span>
          </div>

          <div className="my-2.5 space-y-1.5 text-xs">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">
              <span className="text-slate-400">Prompt:</span> «El telescopio espacial Webb observó una...»
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-emerald-300 font-bold">1. "galaxia"</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-400 h-1.5 rounded-full w-[64%]"></div></div>
                  <span className="text-emerald-400 font-bold">64.2%</span>
                </div>
              </div>

              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200">2. "estrella"</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-800 rounded-full h-1.5"><div className="bg-indigo-400 h-1.5 rounded-full w-[22%]"></div></div>
                  <span className="text-slate-300">21.8%</span>
                </div>
              </div>

              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">3. "atmósfera"</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-800 rounded-full h-1.5"><div className="bg-slate-600 h-1.5 rounded-full w-[9%]"></div></div>
                  <span className="text-slate-400">9.1%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Comprende cómo razonan y generan texto los LLMs</span>
            <span className="text-blue-400 font-bold">Muestreo Top-K</span>
          </div>
        </div>
      );
    }

    if (featureIndex === 2) {
      // Convolución y Visión Artificial
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Goalskid IA Lab · Convolución 3x3</span>
                <span className="text-[10px] text-emerald-400 block font-mono">Filtros Espaciales & Detección de Bordes (Sobel)</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              Kernel 3x3
            </span>
          </div>

          <div className="my-2.5 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <span className="text-[10px] text-emerald-300 block">Matriz de Filtro Sobel:</span>
              <div className="grid grid-cols-3 gap-1 text-center font-bold">
                <span className="bg-slate-800 p-1 rounded text-rose-300">-1</span>
                <span className="bg-slate-800 p-1 rounded text-slate-400">0</span>
                <span className="bg-slate-800 p-1 rounded text-emerald-300">+1</span>
                <span className="bg-slate-800 p-1 rounded text-rose-300">-2</span>
                <span className="bg-slate-800 p-1 rounded text-slate-400">0</span>
                <span className="bg-slate-800 p-1 rounded text-emerald-300">+2</span>
                <span className="bg-slate-800 p-1 rounded text-rose-300">-1</span>
                <span className="bg-slate-800 p-1 rounded text-slate-400">0</span>
                <span className="bg-slate-800 p-1 rounded text-emerald-300">+1</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between text-[11px]">
              <span className="text-[10px] font-mono text-slate-400">Efecto Visual:</span>
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                🔍 Resalta los contornos verticales y gradientes de brillo de la imagen.
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Paso 1: Feature Maps</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Fundamentos reales de redes neuronales convolucionales (CNN)</span>
            <span className="text-emerald-400 font-bold">Visión IA</span>
          </div>
        </div>
      );
    }

    // Ética y Ley de IA Europea
    return (
      <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/95 to-slate-950 text-white font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">Goalskid IA Lab · Auditoría Ley IA Europea</span>
              <span className="text-[10px] text-amber-400 block font-mono">Evaluación de Riesgo & Privacidad (EU AI Act)</span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
            Conforme 100%
          </span>
        </div>

        <div className="my-2.5 space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">Nivel de Riesgo Algorítmico</span>
              <span className="font-bold text-emerald-300 font-mono text-sm">Riesgo Mínimo (Educación Transparente)</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60">
              Categoría Aprobada
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-slate-300 space-y-1">
            <span className="font-bold text-amber-200 block">Principio de Explicabilidad:</span>
            <p>El sistema garantiza que todas las decisiones del tutor socrático sean comprensibles para el estudiante y sus tutores legales.</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
          <span>Cumplimiento del marco ético y regulatorio de la Unión Europea</span>
          <span className="text-amber-400 font-bold">Auditoría Superada</span>
        </div>
      </div>
    );
  }

  return null;
};
