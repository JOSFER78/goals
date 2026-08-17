import { BookOpen, Globe, Orbit, Shield, Brain, LucideIcon } from 'lucide-react';
import { ExperienceId } from '../types';

export interface MiniAppConfig {
  id: ExperienceId | string;
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  icon: LucideIcon;
  logoUrl?: string;
  primaryHex: string;
  secondaryHex: string;
  colorClass: string;
  borderClass: string;
  bgGradientClass: string;
  btnBgClass: string;
  badgeClass: string;
  freeBannerClass: string;
  iconColorClass: string;
  progressPct: number;
  bgPatternClass: string;
  themeKeyword: string;
  ambientGlow: string;
}

export const GOALS_EXPERIENCES: Record<string, MiniAppConfig> = {
  school: {
    id: 'school',
    name: 'Escuela IA',
    shortName: 'Escuela',
    tagline: 'Tutor OCR & Cuadernos de Estudio',
    badge: 'Tutor & OCR',
    icon: BookOpen,
    logoUrl: '/assets/miniapps/school_logo.png',
    primaryHex: '#10B981',
    secondaryHex: '#059669',
    colorClass: 'emerald',
    borderClass: 'border-emerald-500/30 hover:border-emerald-500/60',
    bgGradientClass: 'from-slate-900/60 via-slate-950 to-slate-950',
    btnBgClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    freeBannerClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    iconColorClass: 'text-emerald-400',
    progressPct: 85,
    bgPatternClass: 'cyber-grid-pattern',
    themeKeyword: 'ACADÉMICO',
    ambientGlow: 'rgba(16, 185, 129, 0.04)'
  },
  languages: {
    id: 'languages',
    name: 'Idiomas Voz',
    shortName: 'Idiomas',
    tagline: 'Profesor Particular de Voz',
    badge: 'Práctica de Voz',
    icon: Globe,
    logoUrl: '/assets/miniapps/languages_logo.png',
    primaryHex: '#0284C7',
    secondaryHex: '#0369A1',
    colorClass: 'cyan',
    borderClass: 'border-cyan-500/30 hover:border-cyan-500/60',
    bgGradientClass: 'from-slate-900/60 via-slate-950 to-slate-950',
    btnBgClass: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    freeBannerClass: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    iconColorClass: 'text-cyan-400',
    progressPct: 65,
    bgPatternClass: 'soundwave-grid-pattern',
    themeKeyword: 'ESTUDIO FONÉTICO',
    ambientGlow: 'rgba(2, 132, 199, 0.04)'
  },
  astro: {
    id: 'astro',
    name: 'Cosmos 3D',
    shortName: 'Cosmos 3D',
    tagline: 'Simulador Espacial NASA',
    badge: 'Astrofísica 3D',
    icon: Orbit,
    logoUrl: '/assets/miniapps/cosmos_logo.png',
    primaryHex: '#4F46E5',
    secondaryHex: '#4338CA',
    colorClass: 'indigo',
    borderClass: 'border-indigo-500/30 hover:border-indigo-500/60',
    bgGradientClass: 'from-slate-900/60 via-slate-950 to-slate-950',
    btnBgClass: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold',
    badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    freeBannerClass: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    iconColorClass: 'text-indigo-400',
    progressPct: 92,
    bgPatternClass: 'space-stars-pattern',
    themeKeyword: 'ASTROFÍSICA 3D',
    ambientGlow: 'rgba(79, 70, 229, 0.04)'
  },
  verify: {
    id: 'verify',
    name: 'Criterio',
    shortName: 'Criterio',
    tagline: 'Aprender a Informarse & IA',
    badge: 'Criterio & Rigor',
    icon: Shield,
    logoUrl: '/assets/miniapps/criterio_logo.png',
    primaryHex: '#D97706',
    secondaryHex: '#B45309',
    colorClass: 'amber',
    borderClass: 'border-amber-500/30 hover:border-amber-500/60',
    bgGradientClass: 'from-slate-900/60 via-slate-950 to-slate-950',
    btnBgClass: 'bg-amber-600 hover:bg-amber-500 text-white font-bold',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    freeBannerClass: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    iconColorClass: 'text-amber-400',
    progressPct: 100,
    bgPatternClass: 'forensic-grid-pattern',
    themeKeyword: 'SALA DE RIGOR',
    ambientGlow: 'rgba(217, 119, 6, 0.04)'
  },
  'ai-lab': {
    id: 'ai-lab',
    name: 'IA Lab',
    shortName: 'IA Lab',
    tagline: 'Descubre. Entiende. Experimenta. Crea.',
    badge: 'Laboratorio de IA',
    icon: Brain,
    logoUrl: '/assets/miniapps/ialab_logo.png',
    primaryHex: '#7C3AED',
    secondaryHex: '#6D28D9',
    colorClass: 'purple',
    borderClass: 'border-purple-500/30 hover:border-purple-500/60',
    bgGradientClass: 'from-slate-900/60 via-slate-950 to-slate-950',
    btnBgClass: 'bg-purple-600 hover:bg-purple-500 text-white font-bold',
    badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    freeBannerClass: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
    iconColorClass: 'text-purple-400',
    progressPct: 100,
    bgPatternClass: 'neural-mesh-pattern',
    themeKeyword: 'LABORATORIO DE IA',
    ambientGlow: 'rgba(124, 58, 237, 0.04)'
  },
  criterio: {
    id: 'criterio',
    name: 'Criterio',
    shortName: 'Criterio',
    tagline: 'Aprender a Informarse & IA',
    badge: 'Criterio & Rigor',
    icon: Shield,
    logoUrl: '/assets/miniapps/criterio_logo.png',
    primaryHex: '#D97706',
    secondaryHex: '#B45309',
    colorClass: 'amber',
    borderClass: 'border-amber-500/30 hover:border-amber-500/60',
    bgGradientClass: 'from-slate-900/60 via-slate-950 to-slate-950',
    btnBgClass: 'bg-amber-600 hover:bg-amber-500 text-white font-bold',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    freeBannerClass: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    iconColorClass: 'text-amber-400',
    progressPct: 100,
    bgPatternClass: 'forensic-grid-pattern',
    themeKeyword: 'SALA DE RIGOR',
    ambientGlow: 'rgba(217, 119, 6, 0.04)'
  },
  admin: {
    id: 'admin',
    name: 'Panel de Administración',
    shortName: 'Admin & 3D',
    tagline: 'Gestión de accesos, aprobación y 3D Genesis IA Studio',
    badge: 'Super Admin',
    icon: Shield,
    primaryHex: '#F59E0B',
    secondaryHex: '#06B6D4',
    colorClass: 'amber',
    borderClass: 'border-amber-500/40 hover:border-amber-400',
    bgGradientClass: 'from-amber-950/60 via-slate-950 to-slate-950',
    btnBgClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    freeBannerClass: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    iconColorClass: 'text-amber-400',
    progressPct: 100,
    bgPatternClass: 'cyber-grid-pattern',
    themeKeyword: 'SUPER ADMINISTRACIÓN',
    ambientGlow: 'rgba(245, 158, 11, 0.12)'
  },
  profile: {
    id: 'profile',
    name: 'Centro de Usuario',
    shortName: 'Mi Perfil',
    tagline: 'Misiones, evoluciones, estadísticas y personalización',
    badge: 'Perfil de Aprendizaje',
    icon: Shield,
    primaryHex: '#6366F1',
    secondaryHex: '#38BDF8',
    colorClass: 'indigo',
    borderClass: 'border-indigo-500/40 hover:border-indigo-400',
    bgGradientClass: 'from-indigo-950/60 via-slate-950 to-slate-950',
    btnBgClass: 'bg-indigo-600 hover:bg-indigo-500 text-white font-black',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    freeBannerClass: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    iconColorClass: 'text-indigo-400',
    progressPct: 100,
    bgPatternClass: 'neural-mesh-pattern',
    themeKeyword: 'CENTRO DE APRENDIZAJE',
    ambientGlow: 'rgba(99, 102, 241, 0.12)'
  }
};
