import { MemoryService } from './memoryService';
import { NextBestActionRecommendation } from '../types';

export class NextBestActionEngine {
  /**
   * Calcula de forma determinista y adaptativa la siguiente mejor acción pedagógica
   */
  public static calculateNextAction(): NextBestActionRecommendation {
    const mastery = MemoryService.getSkillMastery();
    const errors = MemoryService.getErrorPatterns();
    const vocab = MemoryService.getVocabulary();
    const profile = MemoryService.getProfile();

    // 1. Prioridad: Errores recurrentes activos
    const recurringError = errors.find(e => e.status === 'recurring');
    if (recurringError) {
      return {
        action: 'REVIEW_ERROR',
        title: `Refuerzo: ${recurringError.correction}`,
        reason: `Hemos detectado dudas recientes con "${recurringError.incorrect}". Vamos a consolidarlo con un ejercicio rápido.`,
        targetSkill: 'grammar',
        suggestedPrompt: `Practiquemos frases usando "${recurringError.correction}".`
      };
    }

    // 2. Prioridad: Vocabulario olvidado o con baja confianza
    const forgottenWord = vocab.find(v => v.status === 'forgotten' || v.confidence < 0.5);
    if (forgottenWord) {
      return {
        action: 'REVIEW_VOCABULARY',
        title: `Repasar: ${forgottenWord.term}`,
        reason: `Hace varios días que no usamos "${forgottenWord.term}" (${forgottenWord.translation}). ¡Vamos a reactivarlo!`,
        targetSkill: 'vocabulary',
        suggestedPrompt: `¿Recuerdas cómo usar "${forgottenWord.term}" en una frase?`
      };
    }

    // 3. Prioridad: Habilidad con menor porcentaje de mastery
    const skillKeys = Object.keys(mastery) as Array<keyof typeof mastery>;
    const lowestSkill = skillKeys.reduce((min, curr) => (mastery[curr] < mastery[min] ? curr : min), skillKeys[0]);

    if (lowestSkill === 'pronunciation' || lowestSkill === 'speaking') {
      return {
        action: 'START_ROLEPLAY',
        title: 'Misión: Conversación en el Aeropuerto',
        reason: `Tu comprensión lectora es genial (${mastery.reading}%). Vamos a subir tu fluidez de Speaking (${mastery[lowestSkill]}%) con una simulación.`,
        targetSkill: lowestSkill,
        suggestedPrompt: 'Simulemos que estás en el mostrador del aeropuerto pidiendo tu tarjeta de embarque.'
      };
    }

    if (lowestSkill === 'writing') {
      return {
        action: 'WRITING_PRACTICE',
        title: 'Taller de Escritura Expresiva',
        reason: `Es un gran momento para potenciar tu Writing (${mastery.writing}%) redactando un mensaje breve.`,
        targetSkill: 'writing',
        suggestedPrompt: 'Escribe un email corto contándome sobre tu último fin de semana.'
      };
    }

    // 4. Fallback Pedagógico Óptimo: Conversación libre guiada por intereses
    const topInterest = profile.interests[0] || 'la ciencia y el espacio';
    return {
      action: 'CONTINUE_CONVERSATION',
      title: `Diálogo Libre: ${topInterest}`,
      reason: `Continúa practicando conversación natural sobre ${topInterest} para mantener tu racha activa.`,
      targetSkill: 'speaking',
      suggestedPrompt: `Cuéntame qué es lo que más te apasiona de ${topInterest}.`
    };
  }
}
