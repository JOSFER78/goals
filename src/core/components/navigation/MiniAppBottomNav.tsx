/**
 * src/core/components/navigation/MiniAppBottomNav.tsx
 * Barra Inferior Estándar de Ancho Completo (Full Width) para las MiniApps de GOALS.
 * Barra clásica fija de borde a borde con botones estilizados, discretos y sin recuadros toscos.
 */

import React from 'react';
import { GOALS_EXPERIENCES } from '../../config/experiencesConfig';
import { ExperienceId } from '../../types';
import { BookOpen, FlaskConical, Trophy, Menu, LucideIcon, ChevronUp, ChevronDown } from 'lucide-react';

export type MiniAppPillar = 'learn' | 'lab' | 'tests' | string;

export interface MiniAppNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  isActive: boolean;
  onClick: () => void;
}

export interface MiniAppBottomNavProps {
  experienceId: ExperienceId | string;
  activePillar?: MiniAppPillar;
  onSelectPillar?: (pillar: MiniAppPillar) => void;
  onOpenMenu: () => void;
  items?: MiniAppNavItem[];
  labels?: {
    learn?: string;
    lab?: string;
    tests?: string;
    menu?: string;
  };
  icons?: {
    learn?: LucideIcon;
    lab?: LucideIcon;
    tests?: LucideIcon;
    menu?: LucideIcon;
  };
  badges?: {
    learn?: string | number;
    lab?: string | number;
    tests?: string | number;
    menu?: string | number;
  };
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const MiniAppBottomNav: React.FC<MiniAppBottomNavProps> = ({
  experienceId,
  activePillar,
  onSelectPillar,
  onOpenMenu,
  items,
  labels,
  icons,
  badges,
  isCollapsible = false,
  isCollapsed = false,
  onToggleCollapse,
  className = ''
}) => {
  const expConfig = GOALS_EXPERIENCES[experienceId];
  const MenuIcon = icons?.menu || Menu;
  const menuLabel = labels?.menu || 'Menú';

  // Si no se pasa array de items dinámico, construimos a partir de los 3 pilares tradicionales
  const navItems: MiniAppNavItem[] = items || [
    {
      id: 'learn',
      label: labels?.learn || 'Lecciones',
      icon: icons?.learn || BookOpen,
      badge: badges?.learn,
      isActive: activePillar === 'learn',
      onClick: () => onSelectPillar?.('learn')
    },
    {
      id: 'lab',
      label: labels?.lab || 'Explorar 3D',
      icon: icons?.lab || FlaskConical,
      badge: badges?.lab,
      isActive: activePillar === 'lab',
      onClick: () => onSelectPillar?.('lab')
    },
    {
      id: 'tests',
      label: labels?.tests || 'Tests (12)',
      icon: icons?.tests || Trophy,
      badge: badges?.tests,
      isActive: activePillar === 'tests',
      onClick: () => onSelectPillar?.('tests')
    }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 w-full select-none font-display pointer-events-auto ${className}`}>
      
      {/* Tirador de Autoplegado para modo inmersivo / simulador 3D */}
      {isCollapsible && onToggleCollapse && (
        <div className="flex justify-center w-full mb-[-1px] pointer-events-auto">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="px-4 py-0.5 rounded-t-xl bg-[#0c101c]/95 hover:bg-slate-900 border-t border-x border-slate-800/90 text-[10px] font-mono font-bold text-slate-300 backdrop-blur-xl shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title={isCollapsed ? 'Desplegar barra de navegación' : 'Plegar barra de navegación'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isCollapsed ? 'Mostrar Navegación' : 'Ocultar'}</span>
          </button>
        </div>
      )}

      {/* Barra Inferior Clásica a Todo el Ancho (Full-Width Bar) */}
      {!isCollapsed && (
        <nav 
          role="navigation"
          aria-label="Navegación de MiniApp"
          className="w-full bg-[#0c101c]/95 border-t border-slate-800/90 backdrop-blur-2xl px-2 sm:px-6 py-2 flex items-center justify-around sm:justify-center sm:gap-10 shadow-2xl shadow-black/90"
        >
          {/* 1. Botón Hamburguesa Menú a la Izquierda */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="px-2.5 sm:px-4 py-1 flex flex-col items-center gap-1 transition-all cursor-pointer text-slate-400 hover:text-white active:scale-95 group focus:outline-none shrink-0"
            title="Abrir menú de herramientas y opciones"
          >
            <div className="relative">
              <MenuIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              {badges?.menu !== undefined && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </div>
            <span className="text-[11px] font-medium tracking-tight text-slate-400 group-hover:text-slate-200">
              {menuLabel}
            </span>
          </button>

          {/* Separador vertical fino */}
          <div className="w-[1px] h-6 bg-slate-800/80 my-auto shrink-0 hidden sm:block" />

          {/* 2. Botones Dinámicos de la MiniApp (Lecciones, Explorar 3D, Tests, etc.) */}
          <div className="flex items-center gap-1 sm:gap-6 flex-1 sm:flex-initial justify-around sm:justify-center">
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  className={`px-2.5 sm:px-4 py-1 flex flex-col items-center gap-1 transition-all cursor-pointer relative focus:outline-none active:scale-95 group shrink-0 ${
                    item.isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="relative">
                    <ItemIcon className={`w-5 h-5 transition-colors ${
                      item.isActive ? (expConfig?.iconColorClass || 'text-cyan-400') : 'text-slate-400 group-hover:text-slate-300'
                    }`} />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[8px] font-mono font-black leading-none">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] tracking-tight truncate max-w-[85px] sm:max-w-none">
                    {item.label}
                  </span>
                  {item.isActive && (
                    <span className={`w-1.5 h-1.5 rounded-full ${expConfig?.iconColorClass ? expConfig.iconColorClass.replace('text-', 'bg-') : 'bg-cyan-400'} shadow-sm -mt-0.5`} />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

    </div>
  );
};

export default MiniAppBottomNav;
