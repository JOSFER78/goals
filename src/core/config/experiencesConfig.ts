import { BookOpen, Globe, Orbit, Shield, Brain, LucideIcon } from 'lucide-react';
import { ExperienceId } from '../types';

export interface MiniAppConfig {
  id: ExperienceId | string;
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  icon: LucideIcon;
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
    tagline: 'Tutor OCR & Cuadernos Cyber',
    badge: 'Tutor & OCR',
    icon: BookOpen,
    primaryHex: '#10B981',
    secondaryHex: '#14B8A6',
    colorClass: 'emerald',
    borderClass: 'border-emerald-500/40 hover:border-emerald-400',
    bgGradientClass: 'from-emerald-950/80 via-slate-950 to-slate-950',
    btnBgClass: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    freeBannerClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    iconColorClass: 'text-emerald-400',
    progressPct: 85,
    bgPatternClass: 'cyber-grid-pattern',
    themeKeyword: 'CYBER-ACADÉMICO',
    ambientGlow: 'rgba(16, 185, 129, 0.12)'
  },
  languages: {
    id: 'languages',
    name: 'Idiomas Voz',
    shortName: 'Idiomas',
    tagline: 'Profesor Particular de Voz',
    badge: 'Práctica de Voz',
    icon: Globe,
    primaryHex: '#06B6D4',
    secondaryHex: '#0EA5E9',
    colorClass: 'cyan',
    borderClass: 'border-cyan-500/40 hover:border-cyan-400',
    bgGradientClass: 'from-cyan-950/80 via-slate-950 to-slate-950',
    btnBgClass: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    freeBannerClass: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    iconColorClass: 'text-cyan-400',
    progressPct: 65,
    bgPatternClass: 'soundwave-grid-pattern',
    themeKeyword: 'ESTUDIO FONÉTICO',
    ambientGlow: 'rgba(6, 182, 212, 0.12)'
  },
  astro: {
    id: 'astro',
    name: 'Cosmos 3D',
    shortName: 'Cosmos 3D',
    tagline: 'Simulador Espacial NASA',
    badge: 'Astrofísica 3D',
    icon: Orbit,
    primaryHex: '#6366F1',
    secondaryHex: '#8B5CF6',
    colorClass: 'indigo',
    borderClass: 'border-indigo-500/40 hover:border-indigo-400',
    bgGradientClass: 'from-indigo-950/80 via-slate-950 to-slate-950',
    btnBgClass: 'bg-indigo-600 hover:bg-indigo-500 text-white font-black',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    freeBannerClass: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    iconColorClass: 'text-indigo-400',
    progressPct: 92,
    bgPatternClass: 'space-stars-pattern',
    themeKeyword: 'ASTROFÍSICA 3D',
    ambientGlow: 'rgba(99, 102, 241, 0.14)'
  },
  verify: {
    id: 'verify',
    name: 'Criterio',
    shortName: 'Criterio',
    tagline: 'Aprender a Informarse & IA',
    badge: 'Criterio & Rigor',
    icon: Shield,
    primaryHex: '#F59E0B',
    secondaryHex: '#EAB308',
    colorClass: 'amber',
    borderClass: 'border-amber-500/40 hover:border-amber-400',
    bgGradientClass: 'from-amber-950/80 via-slate-950 to-slate-950',
    btnBgClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    freeBannerClass: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    iconColorClass: 'text-amber-400',
    progressPct: 100,
    bgPatternClass: 'forensic-grid-pattern',
    themeKeyword: 'SALA DE RIGOR',
    ambientGlow: 'rgba(245, 158, 11, 0.14)'
  },
  'ai-lab': {
    id: 'ai-lab',
    name: 'IA Lab',
    shortName: 'IA Lab',
    tagline: 'Descubre. Entiende. Experimenta. Crea.',
    badge: 'Laboratorio de IA',
    icon: Brain,
    primaryHex: '#8B5CF6',
    secondaryHex: '#A855F7',
    colorClass: 'purple',
    borderClass: 'border-purple-500/40 hover:border-purple-400',
    bgGradientClass: 'from-purple-950/80 via-slate-950 to-slate-950',
    btnBgClass: 'bg-purple-600 hover:bg-purple-500 text-white font-black',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    freeBannerClass: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    iconColorClass: 'text-purple-400',
    progressPct: 100,
    bgPatternClass: 'neural-mesh-pattern',
    themeKeyword: 'LABORATORIO DE IA',
    ambientGlow: 'rgba(168, 85, 247, 0.16)'
  },
  criterio: {
    id: 'criterio',
    name: 'Criterio',
    shortName: 'Criterio',
    tagline: 'Aprender a Informarse & IA',
    badge: 'Criterio & Rigor',
    icon: Shield,
    primaryHex: '#F59E0B',
    secondaryHex: '#EAB308',
    colorClass: 'amber',
    borderClass: 'border-amber-500/40 hover:border-amber-400',
    bgGradientClass: 'from-amber-950/80 via-slate-950 to-slate-950',
    btnBgClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    freeBannerClass: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    iconColorClass: 'text-amber-400',
    progressPct: 100,
    bgPatternClass: 'forensic-grid-pattern',
    themeKeyword: 'SALA DE RIGOR',
    ambientGlow: 'rgba(245, 158, 11, 0.14)'
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
