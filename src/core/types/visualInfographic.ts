/**
 * src/core/types/visualInfographic.ts
 * Contratos de datos para el Pizarrón Agéntico de Infografías y Desglose Visual de Cuadernos
 */

export interface InfographicKeyTakeaway {
  id: string;
  icon: string;
  title: string;
  description: string;
  tag?: string;
  color?: 'emerald' | 'cyan' | 'indigo' | 'amber' | 'rose' | 'purple';
}

export interface FlowDiagramStep {
  stepNumber: number;
  title: string;
  shortDesc: string;
  details?: string;
  icon?: string;
  connectorLabel?: string;
}

export interface ConceptCardData {
  id: string;
  concept: string;
  subtitle: string;
  simpleExplanation: string;
  realWorldAnalogy: string;
  inDepthNote?: string;
  formulaOrRule?: string;
  iconName?: string;
}

export interface NoteHotspotPin {
  id: number;
  label: string;
  xPercent: number;
  yPercent: number;
  topicTitle: string;
  explanation: string;
  formulaOrKeyRule?: string;
  teacherTip?: string;
}

export interface QuickQuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EducationalInfographicPayload {
  id: string;
  mode: 'conceptual' | 'notebook_deconstruction';
  title: string;
  subtitle: string;
  subject: string;
  topic: string;
  targetAge?: number;
  summaryQuote: string;
  keyTakeaways: InfographicKeyTakeaway[];
  flowDiagram?: FlowDiagramStep[];
  conceptCards: ConceptCardData[];
  notebookPhotoUrl?: string;
  notebookPins?: NoteHotspotPin[];
  quickQuiz?: QuickQuizItem[];
  didacticTip?: string;
  generatedAt: number;
}
