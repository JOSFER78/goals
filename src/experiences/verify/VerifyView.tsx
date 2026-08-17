import React from 'react';
import { CriterioExperience } from '../criterio/CriterioExperience';

interface VerifyViewProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

/**
 * Vista de CRITERIO (anteriormente Verifica)
 * Plataforma Integral de Alfabetización Informativa, Algoritmos, IA y Pensamiento Crítico
 */
export const VerifyView: React.FC<VerifyViewProps> = ({ onOpenAuth }) => {
  return <CriterioExperience onOpenAuth={onOpenAuth} />;
};

export default VerifyView;
