/**
 * src/core/types/knowledge.ts
 * Modelo de Datos Formal para la Knowledge Base de GOALS (SSOT)
 */

export type KnowledgeDomain = 
  | 'astronomy' 
  | 'technology' 
  | 'science' 
  | 'mathematics' 
  | 'languages' 
  | 'history' 
  | 'misinformation'
  | 'pedagogy';

export type AuthorityLevel = 
  | 'space_agency'      // NASA, ESA, JAXA, ISRO
  | 'academic'          // Universidades, laboratorios de investigación
  | 'peer_reviewed'      // Artículos Nature, Science, arXiv
  | 'official_framework' // LOMLOE, CEFR, IAU, UNESCO
  | 'verified_web';      // Portales oficiales con revisión editorial

export interface SourceReference {
  sourceId: string;       // ej: 'src_nasa_mars_pds'
  name: string;           // 'NASA Planetary Data System'
  url: string;            // 'https://pds.nasa.gov/'
  authority: AuthorityLevel;
  dateAccessed: string;   // '2026-08-14'
  version?: string;
  doiOrCitation?: string;
}

export interface KnowledgeChunk {
  id: string;             // ej: 'chunk_astro_mars_01'
  knowledgeId: string;    // 'know_astro_mars'
  sequence: number;       // 1, 2, 3...
  subtopic: string;       // 'Atmósfera y Presión Superficial'
  content: string;        // Contenido textual limpio (100-300 palabras)
  keywords: string[];     // ['dióxido de carbono', 'presión atmosférica', '6.1 mbar']
  embeddingVector?: number[]; // Representación vectorial para búsqueda semántica
  sources: SourceReference[];
}

export interface KnowledgeFact {
  fact: string;
  verified: boolean;
  wowFactor?: string;
  sourceRefId?: string;
}

export interface KnowledgeItem {
  id: string;             // ej: 'know_astro_mars'
  slug: string;           // 'astronomy.solar_system.mars'
  domain: KnowledgeDomain;
  subject: string;        // 'Sistema Solar'
  topic: string;          // 'Planetas Rocosos'
  title: string;          // 'Marte: El Planeta Rojo'
  summary: string;        // Resumen ejecutivo
  concepts: string[];     // ['oxido_hierro', 'valles_marineris', 'monte_olimpo', 'atmosfera_marte']
  ageMin: number;         // 6
  ageMax: number;         // 99
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  facts: KnowledgeFact[];
  sources: SourceReference[];
  newsItems?: Array<{
    headline: string;
    summary: string;
    date: string;
    sourceName: string;
    sourceUrl: string;
    verified: boolean;
  }>;
  mediaGallery?: Array<{
    url: string;
    caption: string;
    credit: string;
    type: 'photo' | 'video' | 'spectrum';
  }>;
  documentRef?: {
    documentId: string;
    storagePath: string;
    fileType: 'pdf' | 'docx' | 'md' | 'image';
  };
  chunks?: KnowledgeChunk[];
  version: string;        // '2.4.0'
  status: 'draft' | 'reviewed' | 'published';
  createdAt: number;      // Epoch ms
  updatedAt: number;
  reviewedAt?: number;
}

export interface KnowledgeUpdateProposal {
  id: string;
  knowledgeId: string;
  field: string;
  currentValue: any;
  proposedValue: any;
  sourceUrl: string;
  sourceAuthority: AuthorityLevel;
  confidenceScore: number; // 0.0 a 1.0
  status: 'pending_review' | 'approved' | 'rejected';
  proposedAt: number;
  reviewedBy?: string;
  notes?: string;
}
