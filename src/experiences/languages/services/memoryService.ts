import { 
  StudentLanguageProfile, 
  SkillMastery, 
  VocabularyItem, 
  ErrorPattern, 
  EpisodicMemory, 
  CEFRLevel 
} from '../types';
import { getChildProfile } from '../../../core/services/aiService';

const PROFILE_STORAGE_KEY = 'goals_languages_student_profile';
const MASTERY_STORAGE_KEY = 'goals_languages_skill_mastery';
const VOCABULARY_STORAGE_KEY = 'goals_languages_vocabulary_db';
const ERRORS_STORAGE_KEY = 'goals_languages_error_patterns';
const MEMORIES_STORAGE_KEY = 'goals_languages_episodic_memories';

export const DEFAULT_STUDENT_PROFILE: StudentLanguageProfile = {
  id: 'student_default',
  name: 'Alex',
  age: 9,
  nativeLanguage: 'Español',
  targetLanguage: 'Inglés',
  overallLevel: 'A2',
  interests: ['Minecraft 🎮', 'Espacio y Astronomía 🚀', 'Robótica 🤖', 'Fútbol ⚽'],
  learningStyle: 'visual',
  correctionPreference: 'contextual',
  dailyGoalMinutes: 15
};

export const DEFAULT_SKILL_MASTERY: SkillMastery = {
  speaking: 68,
  listening: 75,
  reading: 80,
  writing: 62,
  grammar: 65,
  vocabulary: 72,
  pronunciation: 60,
  fluency: 64
};

const INITIAL_VOCABULARY: VocabularyItem[] = [
  { id: 'v1', term: 'boarding pass', translation: 'tarjeta de embarque', status: 'active', confidence: 0.85, lastUsed: 'Ayer', category: 'travel' },
  { id: 'v2', term: 'gravitational pull', translation: 'atracción gravitatoria', status: 'mastered', confidence: 0.95, lastUsed: 'Hace 3 días', category: 'science' },
  { id: 'v3', term: 'schedule a meeting', translation: 'programar una reunión', status: 'recognized', confidence: 0.65, lastUsed: 'Hoy', category: 'work' },
  { id: 'v4', term: 'comfortable', translation: 'cómodo / confortable', status: 'forgotten', confidence: 0.40, lastUsed: 'Hace 1 semana', category: 'general' }
];

const INITIAL_ERROR_PATTERNS: ErrorPattern[] = [
  { id: 'e1', incorrect: 'goed', correction: 'went', category: 'irregular_past', frequency: 4, severity: 'medium', status: 'recurring', lastSeen: 'Ayer', pedagogicalNote: 'Confusión con verbos irregulares de alta frecuencia en pasado.' },
  { id: 'e2', incorrect: 'depend of', correction: 'depend on', category: 'prepositions', frequency: 3, severity: 'low', status: 'active', lastSeen: 'Hoy', pedagogicalNote: 'Traducción literal del español (depender de -> depend on).' },
  { id: 'e3', incorrect: 'I have 12 years', correction: 'I am 12 years old', category: 'syntax', frequency: 2, severity: 'medium', status: 'active', lastSeen: 'Ayer', pedagogicalNote: 'Expresión de la edad con verbo to be en lugar de have.' }
];

const INITIAL_EPISODIC_MEMORIES: EpisodicMemory[] = [
  {
    id: 'm1',
    timestamp: Date.now() - 86400000,
    dateStr: 'Ayer',
    summary: 'Practicamos diálogo de viajes y descripción de hobbies espaciales.',
    activityType: 'conversation',
    topicsCovered: ['Viajes', 'Astrofísica', 'Minecraft'],
    keyStrengths: ['Gran comprensión auditiva', 'Uso fluido de adjetivos'],
    areasToReinforce: ['Verbos irregulares en pasado (went / saw)']
  }
];

export class MemoryService {
  /**
   * Obtiene el perfil de idiomas del estudiante, sincronizado con el perfil global de Goals
   */
  public static getProfile(): StudentLanguageProfile {
    if (typeof window === 'undefined') return DEFAULT_STUDENT_PROFILE;
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      const child = getChildProfile();
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          name: child.childName || parsed.name,
          age: child.age || parsed.age,
          interests: child.interests.length > 0 ? child.interests : parsed.interests
        };
      }
      return {
        ...DEFAULT_STUDENT_PROFILE,
        name: child.childName || DEFAULT_STUDENT_PROFILE.name,
        age: child.age || DEFAULT_STUDENT_PROFILE.age,
        interests: child.interests.length > 0 ? child.interests : DEFAULT_STUDENT_PROFILE.interests
      };
    } catch {
      return DEFAULT_STUDENT_PROFILE;
    }
  }

  public static updateProfile(partial: Partial<StudentLanguageProfile>): StudentLanguageProfile {
    const current = this.getProfile();
    const updated = { ...current, ...partial };
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('goals_languages_profile_updated', { detail: updated }));
    }
    return updated;
  }

  public static getSkillMastery(): SkillMastery {
    if (typeof window === 'undefined') return DEFAULT_SKILL_MASTERY;
    try {
      const stored = localStorage.getItem(MASTERY_STORAGE_KEY);
      return stored ? { ...DEFAULT_SKILL_MASTERY, ...JSON.parse(stored) } : DEFAULT_SKILL_MASTERY;
    } catch {
      return DEFAULT_SKILL_MASTERY;
    }
  }

  public static updateSkillMastery(skill: keyof SkillMastery, delta: number): SkillMastery {
    const current = this.getSkillMastery();
    const nextVal = Math.min(100, Math.max(10, (current[skill] || 50) + delta));
    const updated = { ...current, [skill]: nextVal };
    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('goals_languages_mastery_updated', { detail: updated }));
    }
    return updated;
  }

  public static getVocabulary(): VocabularyItem[] {
    if (typeof window === 'undefined') return INITIAL_VOCABULARY;
    try {
      const stored = localStorage.getItem(VOCABULARY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_VOCABULARY;
    } catch {
      return INITIAL_VOCABULARY;
    }
  }

  public static addOrUpdateVocabulary(term: string, translation: string, status: VocabularyItem['status'] = 'active'): void {
    const list = this.getVocabulary();
    const existingIndex = list.findIndex(v => v.term.toLowerCase() === term.toLowerCase());
    const nowStr = 'Hoy';

    if (existingIndex >= 0) {
      list[existingIndex].translation = translation;
      list[existingIndex].status = status;
      list[existingIndex].lastUsed = nowStr;
      list[existingIndex].confidence = Math.min(1.0, list[existingIndex].confidence + 0.1);
    } else {
      list.unshift({
        id: `v_${Date.now()}`,
        term: term.trim(),
        translation: translation.trim(),
        status,
        confidence: 0.7,
        lastUsed: nowStr
      });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(VOCABULARY_STORAGE_KEY, JSON.stringify(list));
    }
  }

  public static getErrorPatterns(): ErrorPattern[] {
    if (typeof window === 'undefined') return INITIAL_ERROR_PATTERNS;
    try {
      const stored = localStorage.getItem(ERRORS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ERROR_PATTERNS;
    } catch {
      return INITIAL_ERROR_PATTERNS;
    }
  }

  public static recordError(incorrect: string, correction: string, category: ErrorPattern['category'] = 'general'): void {
    const errors = this.getErrorPatterns();
    const existing = errors.find(e => e.incorrect.toLowerCase() === incorrect.toLowerCase());

    if (existing) {
      existing.frequency += 1;
      existing.status = existing.frequency >= 3 ? 'recurring' : 'active';
      existing.lastSeen = 'Hoy';
    } else {
      errors.unshift({
        id: `e_${Date.now()}`,
        incorrect: incorrect.trim(),
        correction: correction.trim(),
        category,
        frequency: 1,
        severity: 'medium',
        status: 'active',
        lastSeen: 'Hoy'
      });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(errors));
    }
  }

  public static getEpisodicMemories(): EpisodicMemory[] {
    if (typeof window === 'undefined') return INITIAL_EPISODIC_MEMORIES;
    try {
      const stored = localStorage.getItem(MEMORIES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_EPISODIC_MEMORIES;
    } catch {
      return INITIAL_EPISODIC_MEMORIES;
    }
  }

  public static addEpisodicMemory(memory: Omit<EpisodicMemory, 'id' | 'timestamp' | 'dateStr'>): void {
    const list = this.getEpisodicMemories();
    const newEntry: EpisodicMemory = {
      ...memory,
      id: `m_${Date.now()}`,
      timestamp: Date.now(),
      dateStr: 'Hoy'
    };
    list.unshift(newEntry);
    if (list.length > 20) list.pop(); // Mantener las 20 sesiones más recientes

    if (typeof window !== 'undefined') {
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(list));
    }
  }

  /**
   * Genera un resumen pedagógico compacto para inyectar en el contexto del Teacher Agent
   */
  public static getPedagogicalContextSummary(): string {
    const profile = this.getProfile();
    const mastery = this.getSkillMastery();
    const errors = this.getErrorPatterns().filter(e => e.status !== 'resolved').slice(0, 3);
    const vocab = this.getVocabulary().slice(0, 5);
    const memories = this.getEpisodicMemories().slice(0, 2);

    const errorStr = errors.length > 0
      ? errors.map(e => `[${e.incorrect} -> ${e.correction} (${e.category})]`).join(', ')
      : 'Sin errores críticos registrados';

    const vocabStr = vocab.length > 0
      ? vocab.map(v => `${v.term} (${v.translation})`).join(', ')
      : 'Vocabulario general';

    const memoryStr = memories.length > 0
      ? memories.map(m => `[${m.dateStr}: ${m.summary} | Reforzar: ${m.areasToReinforce.join(', ')}]`).join('; ')
      : 'Primera sesión con el alumno.';

    return `EXPEDIENTE PEDAGÓGICO DE ${profile.name.toUpperCase()}:
- Edad: ${profile.age} años | Nivel CEFR: ${profile.overallLevel} | Idioma: ${profile.targetLanguage}
- Intereses: ${profile.interests.join(', ')}
- Estilo: ${profile.learningStyle} | Modo Corrección: ${profile.correctionPreference}
- Dominio Habilidades: Speaking (${mastery.speaking}%), Grammar (${mastery.grammar}%), Vocab (${mastery.vocabulary}%), Fluency (${mastery.fluency}%)
- Errores Frecuentes a Corregir con Delicadeza: ${errorStr}
- Vocabulario Reciente en Uso: ${vocabStr}
- Memoria Episódica Reciente: ${memoryStr}`;
  }
}
