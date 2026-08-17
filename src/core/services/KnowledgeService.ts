/**
 * src/core/services/KnowledgeService.ts
 * Servicio Híbrido de Gestión de Knowledge Base (L1 RAM -> L2 LocalStorage -> L3 Fallback -> L4 Firestore)
 */

import { KnowledgeItem, KnowledgeChunk, SourceReference } from '../types/knowledge';
import { db, doc, getDoc, setDoc, collection, getDocs } from '../config/firebase';

const CACHE_KEY_KNOWLEDGE = 'goals_knowledge_items_v1';
const CACHE_KEY_CHUNKS = 'goals_knowledge_chunks_v1';

export class KnowledgeService {
  private static instance: KnowledgeService;

  // L1 Cache
  private itemsCache: Map<string, KnowledgeItem> = new Map();
  private chunksCache: Map<string, KnowledgeChunk> = new Map();
  private initialized: boolean = false;

  private constructor() {
    this.loadFromLocalStorage();
  }

  public static getInstance(): KnowledgeService {
    if (!KnowledgeService.instance) {
      KnowledgeService.instance = new KnowledgeService();
    }
    return KnowledgeService.instance;
  }

  /**
   * Inicializa y precarga los elementos de conocimiento
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Si L1 y L2 están vacíos, cargar desde Firestore si está disponible
    if (this.itemsCache.size === 0 && db) {
      try {
        const snap = await getDocs(collection(db, 'knowledge'));
        snap.forEach((docSnap) => {
          const item = docSnap.data() as KnowledgeItem;
          this.itemsCache.set(item.id, item);
        });

        const chunkSnap = await getDocs(collection(db, 'knowledgeChunks'));
        chunkSnap.forEach((docSnap) => {
          const chunk = docSnap.data() as KnowledgeChunk;
          this.chunksCache.set(chunk.id, chunk);
        });

        this.saveToLocalStorage();
      } catch (err) {
        console.warn('⚠️ No se pudo sincronizar Knowledge con Firestore (Modo Offline activo):', err);
      }
    }

    this.initialized = true;
  }

  /**
   * Guarda o actualiza un KnowledgeItem y sus Chunks en L1, L2 y L4
   */
  public async saveKnowledgeItem(item: KnowledgeItem, chunks?: KnowledgeChunk[]): Promise<void> {
    const updatedItem = {
      ...item,
      updatedAt: Date.now()
    };

    // 1. Guardar en L1
    this.itemsCache.set(updatedItem.id, updatedItem);

    if (chunks && chunks.length > 0) {
      chunks.forEach(c => this.chunksCache.set(c.id, c));
      updatedItem.chunks = chunks;
    }

    // 2. Guardar en L2
    this.saveToLocalStorage();

    // 3. Sincronizar en L4 Firestore
    if (db) {
      try {
        const cleanPayload = JSON.parse(JSON.stringify(updatedItem));
        await setDoc(doc(db, 'knowledge', updatedItem.id), cleanPayload, { merge: true });
        if (chunks && chunks.length > 0) {
          for (const c of chunks) {
            const cleanChunk = JSON.parse(JSON.stringify(c));
            await setDoc(doc(db, 'knowledgeChunks', c.id), cleanChunk, { merge: true });
          }
        }
      } catch (err) {
        console.error(`❌ Error guardando Knowledge ${updatedItem.id} en Firestore:`, err);
      }
    }
  }

  /**
   * Obtiene un KnowledgeItem por ID
   */
  public getKnowledgeItem(id: string): KnowledgeItem | undefined {
    return this.itemsCache.get(id);
  }

  /**
   * Obtiene un KnowledgeItem por Slug jerárquico
   */
  public getKnowledgeItemBySlug(slug: string): KnowledgeItem | undefined {
    for (const item of this.itemsCache.values()) {
      if (item.slug === slug) return item;
    }
    return undefined;
  }

  /**
   * Obtiene todos los chunks registrados
   */
  public getAllChunks(): KnowledgeChunk[] {
    return Array.from(this.chunksCache.values());
  }

  /**
   * Obtiene todos los items registrados
   */
  public getAllItems(): KnowledgeItem[] {
    return Array.from(this.itemsCache.values());
  }

  private loadFromLocalStorage(): void {
    try {
      const storedItems = localStorage.getItem(CACHE_KEY_KNOWLEDGE);
      if (storedItems) {
        const parsed: KnowledgeItem[] = JSON.parse(storedItems);
        parsed.forEach(i => this.itemsCache.set(i.id, i));
      }

      const storedChunks = localStorage.getItem(CACHE_KEY_CHUNKS);
      if (storedChunks) {
        const parsed: KnowledgeChunk[] = JSON.parse(storedChunks);
        parsed.forEach(c => this.chunksCache.set(c.id, c));
      }
    } catch {
      // Entorno no navegador o localStorage deshabilitado
    }
  }

  private saveToLocalStorage(): void {
    try {
      const items = Array.from(this.itemsCache.values());
      const chunks = Array.from(this.chunksCache.values());
      localStorage.setItem(CACHE_KEY_KNOWLEDGE, JSON.stringify(items));
      localStorage.setItem(CACHE_KEY_CHUNKS, JSON.stringify(chunks));
    } catch {
      // Ignorar en SSR / CLI
    }
  }
}

export const knowledgeService = KnowledgeService.getInstance();
