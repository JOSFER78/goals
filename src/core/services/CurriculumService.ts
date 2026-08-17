/**
 * CurriculumService — Servicio Híbrido de Base de Datos y Contenidos Educativos para GOALS
 * Arquitectura Cache-First: L1 RAM (Map) -> L2 LocalStorage -> L3 Fallback Modular -> L4 Firestore onSnapshot.
 */
import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  onSnapshot 
} from '../config/firebase';
import { 
  CurriculumLesson, 
  CurriculumTest 
} from '../types/curriculum';
import { LESSONS as ASTRO_FALLBACK_LESSONS } from '../../experiences/astro/data/lessonsIndex';

type UnsubscribeFn = () => void;
type UpdateListener = (disciplineId: string, updatedLessons: CurriculumLesson[]) => void;

class CurriculumService {
  private memoryCacheLessons = new Map<string, CurriculumLesson[]>();
  private memoryCacheTests = new Map<string, Map<string, CurriculumTest>>();
  private activeSubscriptions = new Map<string, UnsubscribeFn>();
  private listeners: Set<UpdateListener> = new Set();
  private storagePrefix = 'goals_curriculum_v2_';

  // ========================================================
  // 1. CARGA DE LECCIONES (Cache-First + Background Refresh)
  // ========================================================
  public async getLessons(disciplineId: string = 'astro'): Promise<CurriculumLesson[]> {
    // 1. Nivel L1: Memoria RAM
    if (this.memoryCacheLessons.has(disciplineId)) {
      const cached = this.memoryCacheLessons.get(disciplineId)!;
      this.ensureRealtimeSubscription(disciplineId);
      return cached;
    }

    // 2. Nivel L2: Caché Local Persistente (LocalStorage)
    const localData = this.readFromLocalStorage<CurriculumLesson[]>(`lessons_${disciplineId}`);
    if (localData && localData.length > 0) {
      this.memoryCacheLessons.set(disciplineId, localData);
      this.ensureRealtimeSubscription(disciplineId);
      return localData;
    }

    // 3. Nivel L3: Firestore Cloud Fetch
    try {
      if (db) {
        const lessonsRef = collection(db, 'curriculums', disciplineId, 'lessons');
        const snapshot = await getDocs(lessonsRef);
        
        if (!snapshot.empty) {
          const cloudLessons = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
          } as CurriculumLesson)).sort((a, b) => a.order - b.order);

          this.saveToCache(disciplineId, cloudLessons);
          this.ensureRealtimeSubscription(disciplineId);
          return cloudLessons;
        }
      }
    } catch (err) {
      console.warn(`[CurriculumService] Firestore offline o no disponible para '${disciplineId}'. Usando fallback modular.`, err);
    }

    // 4. Nivel L4: Fallback Modular Local Estático
    const fallbackData = this.getModularLocalFallback(disciplineId);
    this.saveToCache(disciplineId, fallbackData);
    this.ensureRealtimeSubscription(disciplineId);
    return fallbackData;
  }

  // ========================================================
  // 2. CARGA DE TESTS / EVALUACIONES
  // ========================================================
  public async getTest(disciplineId: string = 'astro', testId: string): Promise<CurriculumTest | null> {
    const disciplineTests = this.memoryCacheTests.get(disciplineId);
    if (disciplineTests && disciplineTests.has(testId)) {
      return disciplineTests.get(testId)!;
    }

    const localKey = `test_${disciplineId}_${testId}`;
    const localTest = this.readFromLocalStorage<CurriculumTest>(localKey);
    if (localTest) {
      this.cacheTestInMemory(disciplineId, localTest);
      return localTest;
    }

    try {
      if (db) {
        const testRef = doc(db, 'curriculums', disciplineId, 'tests', testId);
        const snap = await getDoc(testRef);
        if (snap.exists()) {
          const testData = { id: snap.id, ...snap.data() } as CurriculumTest;
          this.writeToLocalStorage(localKey, testData);
          this.cacheTestInMemory(disciplineId, testData);
          return testData;
        }
      }
    } catch (err) {
      console.warn(`[CurriculumService] Error obteniendo test '${testId}':`, err);
    }

    return this.generateFallbackTestFromLessons(disciplineId, testId);
  }

  // ========================================================
  // 3. SINCRONIZACIÓN EN TIEMPO REAL (onSnapshot)
  // ========================================================
  public subscribeToDiscipline(disciplineId: string, callback: (lessons: CurriculumLesson[]) => void): UnsubscribeFn {
    const current = this.memoryCacheLessons.get(disciplineId);
    if (current) callback(current);

    const listener: UpdateListener = (updatedId, lessons) => {
      if (updatedId === disciplineId) {
        callback(lessons);
      }
    };

    this.listeners.add(listener);
    this.ensureRealtimeSubscription(disciplineId);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private ensureRealtimeSubscription(disciplineId: string) {
    if (this.activeSubscriptions.has(disciplineId) || !db) return;

    try {
      const lessonsRef = collection(db, 'curriculums', disciplineId, 'lessons');
      const unsubscribe = onSnapshot(lessonsRef, (snapshot) => {
        if (!snapshot.empty) {
          const updatedLessons = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
          } as CurriculumLesson)).sort((a, b) => a.order - b.order);

          const current = this.memoryCacheLessons.get(disciplineId);
          const hasChanges = JSON.stringify(current) !== JSON.stringify(updatedLessons);

          if (hasChanges) {
            console.log(`[CurriculumService] 🔥 Sincronización en caliente para '${disciplineId}'`);
            this.saveToCache(disciplineId, updatedLessons);
            this.notifyListeners(disciplineId, updatedLessons);
          }
        }
      }, (error) => {
        console.warn(`[CurriculumService] Listener en tiempo real pausado para '${disciplineId}':`, error.message);
      });

      this.activeSubscriptions.set(disciplineId, unsubscribe);
    } catch (e) {
      console.warn('[CurriculumService] Error iniciando listener:', e);
    }
  }

  // ========================================================
  // 4. GUARDADO / PUBLICACIÓN EN FIRESTORE
  // ========================================================
  public async saveLesson(disciplineId: string, lesson: CurriculumLesson): Promise<void> {
    if (!db) throw new Error('Firestore no está configurado');

    lesson.updatedAt = Date.now();
    lesson.version = (lesson.version || 0) + 1;

    const lessonRef = doc(db, 'curriculums', disciplineId, 'lessons', lesson.id);
    await setDoc(lessonRef, lesson, { merge: true });

    const lessons = this.memoryCacheLessons.get(disciplineId) || [];
    const index = lessons.findIndex(l => l.id === lesson.id);
    if (index >= 0) {
      lessons[index] = lesson;
    } else {
      lessons.push(lesson);
    }
    lessons.sort((a, b) => a.order - b.order);
    this.saveToCache(disciplineId, lessons);
    this.notifyListeners(disciplineId, lessons);
  }

  // ========================================================
  // 5. MÉTODOS DE CACHÉ Y FALLBACKS MODULARES
  // ========================================================
  private saveToCache(disciplineId: string, lessons: CurriculumLesson[]) {
    this.memoryCacheLessons.set(disciplineId, lessons);
    this.writeToLocalStorage(`lessons_${disciplineId}`, lessons);
  }

  private cacheTestInMemory(disciplineId: string, test: CurriculumTest) {
    if (!this.memoryCacheTests.has(disciplineId)) {
      this.memoryCacheTests.set(disciplineId, new Map());
    }
    this.memoryCacheTests.get(disciplineId)!.set(test.id, test);
  }

  private notifyListeners(disciplineId: string, lessons: CurriculumLesson[]) {
    this.listeners.forEach(fn => {
      try { fn(disciplineId, lessons); } catch (err) { console.error(err); }
    });
  }

  private readFromLocalStorage<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.storagePrefix + key);
      return raw ? JSON.parse(raw) as T : null;
    } catch {
      return null;
    }
  }

  private writeToLocalStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
    } catch (e) {
      console.warn('[CurriculumService] Falló LocalStorage:', e);
    }
  }

  private getModularLocalFallback(disciplineId: string): CurriculumLesson[] {
    if (disciplineId === 'astro') {
      return ASTRO_FALLBACK_LESSONS.map((l) => ({
        id: `lesson_${l.id}`,
        disciplineId: 'astro',
        order: l.id,
        title: l.title,
        subtitle: l.tag || 'Exploración Astronómica',
        tag: l.tag,
        icon: l.icon,
        heroImage: l.hero || null,
        xpReward: 50,
        estimatedMinutes: 8,
        version: 1,
        status: 'published',
        createdAt: 1723600000000,
        updatedAt: 1723600000000,
        linkedTestId: `test_astro_${l.id}`,
        steps: (l.steps || []).map((s, idx) => ({
          stepNumber: idx + 1,
          type: s.scene ? 'model3d' : 'concept',
          title: s.t,
          content: s.text,
          icon: s.icon,
          wowFact: s.wow,
          nowFact: s.now,
          photo: s.photo,
          model3d: s.scene ? { sceneId: s.scene } : undefined
        }))
      }));
    }
    return [];
  }

  private generateFallbackTestFromLessons(disciplineId: string, testId: string): CurriculumTest | null {
    if (disciplineId === 'astro') {
      const match = testId.match(/test_astro_(\d+)/);
      if (match) {
        const lessonNum = parseInt(match[1], 10);
        const rawLesson = ASTRO_FALLBACK_LESSONS.find(l => l.id === lessonNum);
        if (rawLesson && rawLesson.test) {
          return {
            id: testId,
            lessonId: `lesson_${lessonNum}`,
            disciplineId: 'astro',
            title: `Test de Evaluación: ${rawLesson.title}`,
            passScorePercent: 70,
            xpReward: 30,
            version: 1,
            status: 'published',
            createdAt: 1723600000000,
            updatedAt: 1723600000000,
            questions: rawLesson.test.map((q: any, idx: number) => ({
              id: idx + 1,
              type: q.type === 'order' ? 'order' : 'choice',
              prompt: q.question,
              explanation: 'Revisa los conceptos teóricos de la lección para afianzar este punto.',
              difficulty: 'medium',
              xp: 10,
              options: q.options || undefined,
              correctAnswer: q.answer !== undefined ? q.answer : undefined,
              orderItems: q.items ? q.items.map((item: string, i: number) => ({ id: `it_${i}`, label: item })) : undefined,
              correctOrder: q.correctOrder ? q.correctOrder.map((_: string, i: number) => `it_${i}`) : undefined,
              media: q.photo ? { type: 'image', url: q.photo } : undefined
            }))
          };
        }
      }
    }
    return null;
  }
}

export const curriculumService = new CurriculumService();
