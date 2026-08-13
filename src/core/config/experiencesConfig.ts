import { BookOpen, Globe, Orbit, Shield, LucideIcon } from 'lucide-react';
import { ExperienceId } from '../types';

export interface MiniAppConfig {
  id: ExperienceId;
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
}

export const GOALS_EXPERIENCES: Record<ExperienceId, MiniAppConfig> = {
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
    progressPct: 85
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
    progressPct: 65
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
    progressPct: 92
  },
  verify: {
    id: 'verify',
    name: 'Verifica',
    shortName: 'Verifica',
    tagline: 'Investigación & Rigor',
    badge: 'Fuentes Oficiales',
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
    progressPct: 100
  }
};
