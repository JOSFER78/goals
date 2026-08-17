import React from 'react';
import { CriterioExperience } from '../criterio/CriterioExperience';
import { ExperienceId } from '../../core/types';

interface VerifyViewProps {
  onBackToGoals?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigateExperience?: (expId: ExperienceId) => void;
}

/**
 * Vista de CRITERIO (anteriormente Verifica)
 * Plataforma Integral de Alfabetización Informativa, Algoritmos, IA y Pensamiento Crítico
 */
export const VerifyView: React.FC<VerifyViewProps> = ({ onBackToGoals, onOpenAuth, onNavigateExperience }) => {
  return <CriterioExperience onBackToGoals={onBackToGoals} onOpenAuth={onOpenAuth} onNavigateExperience={onNavigateExperience} />;
};

export default VerifyView;
