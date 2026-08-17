/**
 * src/core/components/navigation/MiniAppSubmenuSheet.tsx
 * Menú Desplegable Discreto hacia arriba para las MiniApps de GOALS.
 * - Cero redundancia: NO repite botones ya presentes en la barra inferior (Lecciones, Tests, Explorar).
 * - Opciones lógicas de alto valor: Misiones, rovers, asignaturas, idiomas, simuladores forenses y configuración.
 * - Formato unificado y limpio: Sin "colorines", con iconos en tarjetas redondeadas idénticas a los logos de la plataforma.
 * - Cierre y navegación instantánea con botón de volver en submenús.
 */

import React, { useState, useEffect } from 'react';
import { GOALS_EXPERIENCES } from '../../config/experiencesConfig';
import { ExperienceId } from '../../types';
import { 
  X, ChevronRight, ArrowLeft, LucideIcon,
  Globe, Orbit, Shield, Bot, Scan,
  BookOpen, Brain, MessageSquare, Volume2, ShieldCheck, Flame, Layers, Trophy,
  Compass, Sparkles, Rocket, Telescope, Settings2, SlidersHorizontal, Eye,
  Atom, FileText, Activity, Disc, Cpu, ShieldAlert, Sparkle, Target
} from 'lucide-react';

export interface DiscreteMenuItem {
  id?: string;
  label?: string;
  title?: string;
  sublabel?: string;
  description?: string;
  icon?: LucideIcon;
  logoUrl?: string;
  badge?: string | number;
  badgeBg?: string;
  onClick?: () => void;
  subItems?: DiscreteMenuItem[];
  items?: DiscreteMenuItem[];
  [key: string]: any;
}

export type SubmenuSection = DiscreteMenuItem;

export interface MiniAppSubmenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  experienceId: ExperienceId | string;
  onNavigateExperience?: (expId: ExperienceId) => void;
  onSelectAction?: (actionId: string) => void;
  customItems?: DiscreteMenuItem[];
}

export const MiniAppSubmenuSheet: React.FC<MiniAppSubmenuSheetProps> = ({
  isOpen,
  onClose,
  experienceId,
  onNavigateExperience,
  onSelectAction,
  customItems
}) => {
  // Pila de submenús activos: [ { title: 'Misiones Espaciales', items: [...] } ]
  const [menuStack, setMenuStack] = useState<{ title: string; items: DiscreteMenuItem[] }[]>([]);

  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Resetear la pila al abrir o cerrar
  useEffect(() => {
    if (!isOpen) {
      setMenuStack([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Submenú universal para cambiar de MiniApp con jerarquía clara hacia GOALS
  const switchAppSubItems: DiscreteMenuItem[] = [
    {
      id: 'switch-goals-hub',
      label: 'GOALS • Portal Principal',
      sublabel: 'Volver a la plataforma central',
      logoUrl: '/goalskid_logo.png',
      badge: 'HUB',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      onClick: () => {
        onNavigateExperience?.('home' as ExperienceId);
        onClose();
      }
    },
    {
      id: 'switch-school',
      label: 'Escuela IA',
      sublabel: 'Tutor Multimodal de Cuadernos',
      logoUrl: GOALS_EXPERIENCES.school.logoUrl,
      badge: 'Tutor OCR',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      onClick: () => {
        onNavigateExperience?.('school');
        onClose();
      }
    },
    {
      id: 'switch-languages',
      label: 'Idiomas Voz',
      sublabel: 'Profesor Particular en Directo',
      logoUrl: GOALS_EXPERIENCES.languages.logoUrl,
      badge: 'Voz IA',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      onClick: () => {
        onNavigateExperience?.('languages');
        onClose();
      }
    },
    {
      id: 'switch-astro',
      label: 'Cosmos 3D',
      sublabel: 'Astrofísica & Simulador Espacial',
      logoUrl: GOALS_EXPERIENCES.astro.logoUrl,
      badge: '3D NASA',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      onClick: () => {
        onNavigateExperience?.('astro');
        onClose();
      }
    },
    {
      id: 'switch-verify',
      label: 'Criterio',
      sublabel: 'Pensamiento Crítico & Medios',
      logoUrl: GOALS_EXPERIENCES.verify.logoUrl,
      badge: 'Rigor IA',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      onClick: () => {
        onNavigateExperience?.('verify');
        onClose();
      }
    },
    {
      id: 'switch-ai-lab',
      label: 'IA Lab',
      sublabel: 'Laboratorio Forense de IA',
      logoUrl: GOALS_EXPERIENCES['ai-lab'].logoUrl,
      badge: 'Lab IA',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      onClick: () => {
        onNavigateExperience?.('ai-lab');
        onClose();
      }
    }
  ];

  // Configuración de herramientas avanzadas sin redundancias con la barra inferior
  const getMenuItemsForApp = (appId: string): DiscreteMenuItem[] => {
    if (customItems && customItems.length > 0) return customItems;

    switch (appId) {
      case 'astro':
        return [
          {
            id: 'astro-missions',
            label: 'Misiones Espaciales',
            sublabel: 'Apolo 11, Artemis, Perseverance, Webb...',
            icon: Rocket,
            badge: '8 Misiones',
            subItems: [
              { id: 'm-apollo', label: 'Apolo 11 (Alunizaje 1969)', sublabel: 'Mar de la Tranquilidad', icon: Rocket, onClick: () => { onSelectAction?.('mission-apollo'); onClose(); } },
              { id: 'm-artemis', label: 'Artemis III (Retorno Lunar)', sublabel: 'Polo Sur Lunar', icon: Sparkles, onClick: () => { onSelectAction?.('mission-artemis'); onClose(); } },
              { id: 'm-perseverance', label: 'Rover Perseverance', sublabel: 'Cráter Jezero, Marte', icon: Compass, onClick: () => { onSelectAction?.('mission-perseverance'); onClose(); } },
              { id: 'm-webb', label: 'Telescopio James Webb', sublabel: 'Punto Lagrange L2', icon: Telescope, onClick: () => { onSelectAction?.('mission-webb'); onClose(); } },
              { id: 'm-cassini', label: 'Sonda Cassini-Huygens', sublabel: 'Anillos de Saturno & Titán', icon: Orbit, onClick: () => { onSelectAction?.('mission-cassini'); onClose(); } },
              { id: 'm-voyager', label: 'Voyager 1 Interestelar', sublabel: 'Espacio Interestelar', icon: Orbit, onClick: () => { onSelectAction?.('mission-voyager'); onClose(); } },
              { id: 'm-parker', label: 'Parker Solar Probe', sublabel: 'Corona Solar Extrema', icon: Flame, onClick: () => { onSelectAction?.('mission-parker'); onClose(); } },
              { id: 'm-rosetta', label: 'Rosetta & Philae', sublabel: 'Cometa 67P Churyumov', icon: Compass, onClick: () => { onSelectAction?.('mission-rosetta'); onClose(); } }
            ]
          },
          {
            id: 'astro-rovers',
            label: 'Rovers & Telescopios 3D',
            sublabel: 'Modelos interactivos de alta fidelidad',
            icon: Telescope,
            badge: '4 Modelos',
            subItems: [
              { id: 'r-webb', label: 'Telescopio James Webb (JWST)', sublabel: 'Infrarrojo Profundo', icon: Telescope, onClick: () => { onSelectAction?.('rover-webb'); onClose(); } },
              { id: 'r-curiosity', label: 'Rover Marciano Curiosity', sublabel: 'Laboratorio Móvil Cráter Gale', icon: Compass, onClick: () => { onSelectAction?.('rover-curiosity'); onClose(); } },
              { id: 'r-iss', label: 'Estación Espacial ISS', sublabel: 'Órbita Terrestre Baja (LEO)', icon: Orbit, onClick: () => { onSelectAction?.('rover-iss'); onClose(); } },
              { id: 'r-hubble', label: 'Telescopio Espacial Hubble', sublabel: 'Óptica de Espacio Profundo', icon: Telescope, onClick: () => { onSelectAction?.('rover-hubble'); onClose(); } }
            ]
          },
          {
            id: 'astro-eclipses',
            label: 'Eclipses & Alineaciones 2026',
            sublabel: 'Simulación del Eclipse Total Solar 2026',
            icon: Disc,
            badge: '2026',
            onClick: () => {
              onSelectAction?.('event-eclipses');
              onClose();
            }
          },
          {
            id: 'astro-scale',
            label: 'Escala Didáctica vs Científica 1:1',
            sublabel: 'Alternar proporciones astronómicas reales',
            icon: SlidersHorizontal,
            badge: '1:1 Real',
            onClick: () => {
              onSelectAction?.('toggle-scale');
              onClose();
            }
          },
          {
            id: 'astro-layers',
            label: 'Capas & Filtros Orbitales 3D',
            sublabel: 'Órbitas, balizas de navegación y vector solar',
            icon: Eye,
            onClick: () => {
              onSelectAction?.('toggle-orbits');
              onClose();
            }
          },
          {
            id: 'astro-sound',
            label: 'Paisaje Sonoro Ambisonic',
            sublabel: 'Audio cósmico binaural de la NASA',
            icon: Volume2,
            badge: 'NASA Audio',
            onClick: () => {
              onSelectAction?.('toggle-sound');
              onClose();
            }
          },
          {
            id: 'astro-switch-app',
            label: 'Cambiar de MiniApp',
            sublabel: 'Acceso a los 5 módulos de GOALS',
            icon: SlidersHorizontal,
            subItems: switchAppSubItems
          }
        ];

      case 'school':
        return [
          {
            id: 'school-subjects',
            label: 'Selector de Asignaturas',
            sublabel: 'Matemáticas, Física, Lengua, Biología...',
            icon: BookOpen,
            badge: '5 Materias',
            subItems: [
              { id: 'subj-math', label: 'Matemáticas', sublabel: 'Álgebra, Geometría y Cálculo', icon: BookOpen, onClick: () => { onSelectAction?.('subj-math'); onClose(); } },
              { id: 'subj-physics', label: 'Física y Química', sublabel: 'Cinemática, Dinámica y Materia', icon: Atom, onClick: () => { onSelectAction?.('subj-physics'); onClose(); } },
              { id: 'subj-lang', label: 'Lengua y Literatura', sublabel: 'Sintaxis, Expresión y Lectura', icon: FileText, onClick: () => { onSelectAction?.('subj-lang'); onClose(); } },
              { id: 'subj-bio', label: 'Biología y Geología', sublabel: 'Células, Ecosistemas y Tierra', icon: Layers, onClick: () => { onSelectAction?.('subj-bio'); onClose(); } },
              { id: 'subj-hist', label: 'Historia y Sociales', sublabel: 'Historia Universal y Geografía', icon: Globe, onClick: () => { onSelectAction?.('subj-hist'); onClose(); } }
            ]
          },
          {
            id: 'school-exam-sim',
            label: 'Simulador de Exámenes a Medida',
            sublabel: 'Pruebas formativas con corrección guiada',
            icon: FileText,
            badge: 'Examen IA',
            onClick: () => { onSelectAction?.('exam-sim'); onClose(); }
          },
          {
            id: 'school-socratic',
            label: 'Modo Socrático de Pistas',
            sublabel: 'Razonamiento guiado sin dar respuestas directas',
            icon: Brain,
            badge: 'Pedagógico',
            onClick: () => { onSelectAction?.('socratic-mode'); onClose(); }
          },
          {
            id: 'school-history',
            label: 'Historial de Cuadernos OCR',
            sublabel: 'Problemas resueltos y escaneos anteriores',
            icon: Scan,
            badge: 'Registro',
            onClick: () => { onSelectAction?.('ocr-history'); onClose(); }
          },
          {
            id: 'school-analytics',
            label: 'Diagnóstico Curricular & Refuerzo',
            sublabel: 'Mapa de lagunas conceptuales y fortalezas',
            icon: Activity,
            badge: 'Analytics',
            onClick: () => { onSelectAction?.('curriculum-analytics'); onClose(); }
          },
          {
            id: 'school-switch-app',
            label: 'Cambiar de MiniApp',
            sublabel: 'Acceso a los 5 módulos de GOALS',
            icon: SlidersHorizontal,
            subItems: switchAppSubItems
          }
        ];

      case 'languages':
        return [
          {
            id: 'lang-selector',
            label: 'Selector de Idiomas',
            sublabel: 'Inglés, Francés, Alemán, Italiano, Chino...',
            icon: Globe,
            badge: '5 Idiomas',
            subItems: [
              { id: 'lang-en', label: '🇬🇧 Inglés (English)', sublabel: 'Oxford & US Standard', icon: Globe, onClick: () => { onSelectAction?.('lang-en'); onClose(); } },
              { id: 'lang-fr', label: '🇫🇷 Francés (Français)', sublabel: 'Français Standard', icon: Globe, onClick: () => { onSelectAction?.('lang-fr'); onClose(); } },
              { id: 'lang-de', label: '🇩🇪 Alemán (Deutsch)', sublabel: 'Hochdeutsch', icon: Globe, onClick: () => { onSelectAction?.('lang-de'); onClose(); } },
              { id: 'lang-it', label: '🇮🇹 Italiano (Italiano)', sublabel: 'Italiano Standard', icon: Globe, onClick: () => { onSelectAction?.('lang-it'); onClose(); } },
              { id: 'lang-zh', label: '🇨🇳 Chino Mandarín (中文)', sublabel: 'Pinyin y Caracteres', icon: Globe, onClick: () => { onSelectAction?.('lang-zh'); onClose(); } }
            ]
          },
          {
            id: 'lang-phonetics',
            label: 'Laboratorio de Fonética & Acento',
            sublabel: 'Análisis acústico espectrográfico de formantes',
            icon: Volume2,
            badge: 'Acústica',
            onClick: () => { onSelectAction?.('phonetics-lab'); onClose(); }
          },
          {
            id: 'lang-speed',
            label: 'Velocidad de Voz del Tutor',
            sublabel: 'Ajustar ritmo de conversación (0.75x a 1.25x)',
            icon: SlidersHorizontal,
            badge: '1.0x Normal',
            onClick: () => { onSelectAction?.('voice-speed'); onClose(); }
          },
          {
            id: 'lang-scenarios',
            label: '50 Escenarios de Inmersión',
            sublabel: 'Viajes, entrevistas, compras, debates...',
            icon: MessageSquare,
            badge: '50 Casos',
            onClick: () => { onSelectAction?.('immersion-scenarios'); onClose(); }
          },
          {
            id: 'lang-srs',
            label: 'Repaso Espaciado SRS de Vocabulario',
            sublabel: 'Mnemotecnia y retención a largo plazo',
            icon: Brain,
            badge: 'SRS Activo',
            onClick: () => { onSelectAction?.('srs-flashcards'); onClose(); }
          },
          {
            id: 'lang-switch-app',
            label: 'Cambiar de MiniApp',
            sublabel: 'Acceso a los 5 módulos de GOALS',
            icon: SlidersHorizontal,
            subItems: switchAppSubItems
          }
        ];

      case 'verify':
        return [
          {
            id: 'verify-clickbait',
            label: 'Analizador Forense de Titulares',
            sublabel: 'Detección de sesgo, encuadre y clickbait',
            icon: ShieldAlert,
            badge: 'Forense',
            onClick: () => { onSelectAction?.('clickbait-detector'); onClose(); }
          },
          {
            id: 'verify-bubble-sim',
            label: 'Simulador de Burbuja Algorítmica',
            sublabel: 'Cómo los algoritmos polarizan las redes',
            icon: Orbit,
            badge: 'Simulador',
            onClick: () => { onSelectAction?.('bubble-sim'); onClose(); }
          },
          {
            id: 'verify-fallacies',
            label: 'Guía de Falacias Lógicas',
            sublabel: '20 falacias comunes explicadas e ilustradas',
            icon: Brain,
            badge: 'Lógica',
            onClick: () => { onSelectAction?.('fallacies-guide'); onClose(); }
          },
          {
            id: 'verify-age-range',
            label: 'Calibración de Tramo de Edad',
            sublabel: 'Ajustar el nivel de rigor conceptual',
            icon: SlidersHorizontal,
            badge: '6-16 años',
            subItems: [
              { id: 'age-6-9', label: '🧒 6 a 9 años (Primaria)', sublabel: 'Verdad, hechos y preguntas guía', icon: Sparkles, onClick: () => { onSelectAction?.('age-6-9'); onClose(); } },
              { id: 'age-10-12', label: '👦 10 a 12 años (Intermedio)', sublabel: 'Pensamiento crítico y fuentes', icon: Compass, onClick: () => { onSelectAction?.('age-10-12'); onClose(); } },
              { id: 'age-13-16', label: '🧑 13 a 16 años (Avanzado)', sublabel: 'Análisis forense de medios y sesgos', icon: ShieldCheck, onClick: () => { onSelectAction?.('age-13-16'); onClose(); } }
            ]
          },
          {
            id: 'verify-trophies',
            label: 'Medallero & Misiones de Criterio',
            sublabel: 'Trofeos obtenidos por verificación periodística',
            icon: Trophy,
            badge: 'Trofeos',
            onClick: () => { onSelectAction?.('trophies-view'); onClose(); }
          },
          {
            id: 'verify-switch-app',
            label: 'Cambiar de MiniApp',
            sublabel: 'Acceso a los 5 módulos de GOALS',
            icon: SlidersHorizontal,
            subItems: switchAppSubItems
          }
        ];

      case 'ai-lab':
        return [
          {
            id: 'ailab-latent-studio',
            label: 'Creative AI Studio & Espacio Latente',
            sublabel: 'Manipulación de vectores latentes y estilo',
            icon: Sparkles,
            badge: 'Latent Space',
            onClick: () => { onSelectAction?.('latent-studio'); onClose(); }
          },
          {
            id: 'ailab-transformer-sim',
            label: 'Simulador de Mecanismo de Atención',
            sublabel: 'Visualización de pesos en Transformers y LLMs',
            icon: Cpu,
            badge: 'Attention',
            onClick: () => { onSelectAction?.('transformer-sim'); onClose(); }
          },
          {
            id: 'ailab-adversarial',
            label: 'Laboratorio de Ataques Adversarios',
            sublabel: 'Inyección de ruido para probar robustez de CNN',
            icon: ShieldAlert,
            badge: 'Adversarial',
            onClick: () => { onSelectAction?.('adversarial-lab'); onClose(); }
          },
          {
            id: 'ailab-age-range',
            label: 'Calibración de Tramo de Edad',
            sublabel: 'Ajustar la profundidad matemática de la IA',
            icon: SlidersHorizontal,
            badge: '6-16 años',
            subItems: [
              { id: 'ai-age-6-9', label: '🧒 6 a 9 años (Primaria)', sublabel: 'Conceptos visuales de entrenamiento', icon: Sparkles, onClick: () => { onSelectAction?.('ai-age-6-9'); onClose(); } },
              { id: 'ai-age-10-12', label: '👦 10 a 12 años (Intermedio)', sublabel: 'Pesos, neuronas y clasificación', icon: Compass, onClick: () => { onSelectAction?.('ai-age-10-12'); onClose(); } },
              { id: 'ai-age-13-16', label: '🧑 13 a 16 años (Avanzado)', sublabel: 'Backpropagation, embeddings y matrices', icon: Brain, onClick: () => { onSelectAction?.('ai-age-13-16'); onClose(); } }
            ]
          },
          {
            id: 'ailab-certification',
            label: 'Certificación de Fundamentos de IA',
            sublabel: 'Evaluación integral teórico-práctica',
            icon: Trophy,
            badge: 'Certificado',
            onClick: () => { onSelectAction?.('ai-certification'); onClose(); }
          },
          {
            id: 'ailab-switch-app',
            label: 'Cambiar de MiniApp',
            sublabel: 'Acceso a los 5 módulos de GOALS',
            icon: SlidersHorizontal,
            subItems: switchAppSubItems
          }
        ];

      default:
        return [
          {
            id: 'default-switch',
            label: 'Cambiar de MiniApp',
            sublabel: 'Explorar otros módulos educativos',
            icon: SlidersHorizontal,
            subItems: switchAppSubItems
          }
        ];
    }
  };

  const currentLevel = menuStack.length > 0 ? menuStack[menuStack.length - 1] : null;
  const activeItems = currentLevel ? currentLevel.items : getMenuItemsForApp(experienceId);
  const activeTitle = currentLevel ? currentLevel.title : 'Herramientas & Simuladores';

  const handleItemClick = (item: DiscreteMenuItem) => {
    const sub = item.subItems || item.items;
    if (sub && sub.length > 0) {
      setMenuStack((prev) => [...prev, { title: item.label || item.title || '', items: sub }]);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  const handleBack = () => {
    setMenuStack((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 select-none font-display pointer-events-auto">
      
      {/* Backdrop transparente con clic para cerrar */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
        aria-label="Cerrar menú desplegable"
      />

      {/* Popover Discreto Desplegable Hacia Arriba (Anclado encima del botón Menú en la barra inferior) */}
      <div className="fixed bottom-16 left-2 sm:left-6 z-50 w-72 sm:w-84 max-h-[72vh] bg-[#0c101c]/98 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl p-2.5 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
        
        {/* Cabecera del Menú / Botón Volver */}
        <div className="px-2 py-1.5 border-b border-slate-800/80 flex items-center justify-between shrink-0 mb-1.5">
          {currentLevel ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              <span>Volver</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-xs font-bold text-slate-200 tracking-tight">
                {activeTitle}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de Ítems en Formato Coherente con Logo/Icono Cuadrado Elegante */}
        <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin p-0.5">
          {activeItems.map((item) => {
            const ItemIcon = item.icon;
            const itemLabel = item.label || item.title || '';
            const hasSub = (item.subItems && item.subItems.length > 0) || (item.items && item.items.length > 0);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className="w-full p-2 rounded-xl bg-slate-900/40 hover:bg-slate-850 border border-slate-800/50 hover:border-slate-700/80 flex items-center justify-between text-left transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Icono o Logo en tarjeta redondeada limpia (sin colorines) */}
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200 group-hover:text-white group-hover:border-slate-500 shadow-sm shrink-0 overflow-hidden">
                    {item.logoUrl ? (
                      <img src={item.logoUrl} alt={itemLabel} className="w-full h-full object-cover" />
                    ) : ItemIcon ? (
                      <ItemIcon className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                    ) : (
                      <Sparkle className="w-4 h-4 text-slate-300" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                      {itemLabel}
                    </span>
                    {item.sublabel && (
                      <span className="text-[10px] text-slate-400 truncate mt-0.2">
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-medium border ${
                      item.badgeBg || 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {hasSub && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default MiniAppSubmenuSheet;
