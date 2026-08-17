/**
 * MarkdownCurriculumParser.ts
 * Parser de AST Markdown para Lecciones y Tests del Currículum GOALS
 * Soporta Frontmatter YAML, Alertas GitHub, Directivas 3D, Fotos NASA y Bancos de Preguntas.
 */

import { 
  CurriculumLesson, 
  CurriculumStep, 
  CurriculumTest, 
  CurriculumQuestion, 
  StepContentType 
} from '../types/curriculum';

export interface ParsedCurriculumDocument {
  lesson: CurriculumLesson;
  test: CurriculumTest;
  rawAst: {
    frontmatter: Record<string, any>;
    stepBlocks: any[];
    testBlocks: any[];
  };
}

export class MarkdownCurriculumParser {
  private static FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  private static STEP_HEADER_REGEX = /^##\s+(?:Paso\s+(\d+)|Step\s+(\d+)|(\d+)\.|\d+)?[:.]?\s*(.+)$/im;
  private static SUBTITLE_REGEX = /^###\s+(.+)$/m;
  private static ALERT_REGEX = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|WOW|NOW|MODEL3D|PHOTO|FORMULA|AUDIO|ORDER|CHOICE|MATCHING)(?:[:\s]([^\]]*))?\]\s*\r?\n([\s\S]*?)(?=(?:^>\s*\[!|\n\n(?![>])|$))/gim;
  private static IMAGE_REGEX = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)/;
  private static QUESTION_HEADER_REGEX = /^###\s+(?:Q\d+|Pregunta\s+(\d+)|Question\s+(\d+)|(\d+)\.|\d+)?[:.]?\s*(.+?)(?:\s*\((choice|order)\))?$/im;
  private static CHOICE_ITEM_REGEX = /^\s*-\s*\[([ xX])\]\s*(.+)$/gm;
  private static ORDER_ITEM_REGEX = /^\s*\d+\.\s*(.+)$/gm;
  private static EXPLANATION_REGEX = />\s*\*\*Explicaci[oó]n\*\*:\s*(.+)$/im;
  private static HINT_REGEX = />\s*\*\*Pista\*\*:\s*(.+)$/im;
  private static DIFFICULTY_REGEX = />\s*\*\*Dificultad\*\*:\s*(easy|medium|hard)/im;
  private static XP_REGEX = />\s*\*\*XP\*\*:\s*(\d+)/im;

  /**
   * Parsea un texto Markdown completo a lección y test tipados
   */
  public static parse(markdownContent: string, defaultDiscipline: string = 'astro'): ParsedCurriculumDocument {
    const raw = markdownContent.trim();
    
    // 1. Extraer Frontmatter YAML
    const { frontmatter, contentWithoutFrontmatter } = this.parseFrontmatter(raw);

    const disciplineId = frontmatter.disciplineId || frontmatter.discipline || defaultDiscipline;
    const lessonOrder = Number(frontmatter.order || frontmatter.id || 1);
    const lessonId = frontmatter.id ? (String(frontmatter.id).startsWith('lesson_') ? frontmatter.id : `lesson_${frontmatter.id}`) : `lesson_${lessonOrder}`;
    const testId = frontmatter.linkedTestId || `test_${disciplineId}_${lessonOrder}`;

    // 2. Dividir secciones: Teoría (Steps) vs Evaluación (Test)
    const testSectionIndex = contentWithoutFrontmatter.search(/^##\s+(?:Evaluaci[oó]n|Test|Quiz|Preguntas|🧠)/im);
    
    let theoryContent = contentWithoutFrontmatter;
    let testContent = '';

    if (testSectionIndex !== -1) {
      theoryContent = contentWithoutFrontmatter.substring(0, testSectionIndex).trim();
      testContent = contentWithoutFrontmatter.substring(testSectionIndex).trim();
    }

    // 3. Parsear Pasos Teóricos
    const steps = this.parseSteps(theoryContent);

    // 4. Parsear Preguntas de Evaluación
    const questions = this.parseQuestions(testContent);

    // 5. Construir Objeto CurriculumLesson
    const lesson: CurriculumLesson = {
      id: lessonId,
      disciplineId,
      order: lessonOrder,
      title: frontmatter.title || 'Lección sin título',
      subtitle: frontmatter.subtitle || frontmatter.tag || 'Exploración interactiva',
      tag: frontmatter.tag || `Tema ${lessonOrder} • ${disciplineId.toUpperCase()}`,
      icon: frontmatter.icon || '🌌',
      heroImage: frontmatter.heroImage || frontmatter.hero || null,
      xpReward: Number(frontmatter.xpReward || frontmatter.xp || 50),
      estimatedMinutes: Number(frontmatter.estimatedMinutes || 8),
      prerequisites: Array.isArray(frontmatter.prerequisites) ? frontmatter.prerequisites : undefined,
      knowledgeSlugs: Array.isArray(frontmatter.knowledgeSlugs) ? frontmatter.knowledgeSlugs : (frontmatter.knowledgeSlug ? [frontmatter.knowledgeSlug] : undefined),
      knowledgeItemIds: Array.isArray(frontmatter.knowledgeItemIds) ? frontmatter.knowledgeItemIds : (frontmatter.knowledgeItemId ? [frontmatter.knowledgeItemId] : undefined),
      steps,
      linkedTestId: testId,
      version: Number(frontmatter.version || 1),
      status: (frontmatter.status === 'draft' || frontmatter.status === 'archived') ? frontmatter.status : 'published',
      createdAt: frontmatter.createdAt ? Number(frontmatter.createdAt) : Date.now(),
      updatedAt: Date.now()
    };

    // 6. Construir Objeto CurriculumTest
    const test: CurriculumTest = {
      id: testId,
      lessonId,
      disciplineId,
      title: frontmatter.testTitle || `Evaluación: ${lesson.title}`,
      passScorePercent: Number(frontmatter.passScorePercent || 75),
      xpReward: Number(frontmatter.testXpReward || 100),
      timeLimitSeconds: frontmatter.timeLimitSeconds ? Number(frontmatter.timeLimitSeconds) : undefined,
      questions,
      version: Number(frontmatter.version || 1),
      status: lesson.status,
      createdAt: lesson.createdAt,
      updatedAt: Date.now()
    };

    return {
      lesson,
      test,
      rawAst: {
        frontmatter,
        stepBlocks: steps,
        testBlocks: questions
      }
    };
  }

  /**
   * Parser YAML ligero y seguro sin dependencias externas
   */
  public static parseFrontmatter(markdown: string): { frontmatter: Record<string, any>; contentWithoutFrontmatter: string } {
    const match = markdown.match(this.FRONTMATTER_REGEX);
    if (!match) {
      return { frontmatter: {}, contentWithoutFrontmatter: markdown };
    }

    const yamlBlock = match[1];
    const contentWithoutFrontmatter = markdown.substring(match[0].length).trim();
    const frontmatter: Record<string, any> = {};

    const lines = yamlBlock.split(/\r?\n/);
    let currentKey: string | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('- ') && currentKey) {
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = [];
        }
        frontmatter[currentKey].push(this.castValue(trimmed.substring(2).trim()));
        continue;
      }

      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.substring(0, colonIdx).trim();
        const rawVal = line.substring(colonIdx + 1).trim();

        if (rawVal === '') {
          currentKey = key;
          frontmatter[key] = [];
        } else {
          currentKey = null;
          frontmatter[key] = this.castValue(rawVal);
        }
      }
    }

    return { frontmatter, contentWithoutFrontmatter };
  }

  /**
   * Parsea los bloques de pasos teóricos
   */
  private static parseSteps(theoryContent: string): CurriculumStep[] {
    const stepChunks = theoryContent.split(/(?=^##\s+)/m).filter(c => c.trim().length > 0);
    const steps: CurriculumStep[] = [];

    let stepIndex = 1;

    for (const chunk of stepChunks) {
      if (!chunk.startsWith('## ')) continue;

      const firstLineEnd = chunk.indexOf('\n');
      const headerLine = firstLineEnd === -1 ? chunk : chunk.substring(0, firstLineEnd).trim();
      const bodyContent = firstLineEnd === -1 ? '' : chunk.substring(firstLineEnd).trim();

      const headerMatch = headerLine.match(this.STEP_HEADER_REGEX);
      const stepNumber = headerMatch && (headerMatch[1] || headerMatch[2] || headerMatch[3]) 
        ? parseInt(headerMatch[1] || headerMatch[2] || headerMatch[3], 10) 
        : stepIndex;
      
      const stepTitle = headerMatch && headerMatch[4] ? headerMatch[4].trim() : headerLine.replace(/^##\s*/, '').trim();

      const subMatch = bodyContent.match(this.SUBTITLE_REGEX);
      const subtitle = subMatch ? subMatch[1].trim() : undefined;

      let stepType: StepContentType = 'concept';
      let wowFact: string | undefined;
      let nowFact: string | undefined;
      let badge: string | undefined;
      let sceneId: string | undefined;
      let model3dConfig: any = undefined;
      let photoConfig: { url: string; caption?: string; credit?: string } | undefined;
      let formulaConfig: any = undefined;
      let audioConfig: any = undefined;

      // Extraer todas las imágenes del paso
      const allPhotos: Array<{ url: string; caption?: string; credit?: string }> = [];
      const globalImgRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)/g;
      let imgMatch: RegExpExecArray | null;
      while ((imgMatch = globalImgRegex.exec(bodyContent)) !== null) {
        allPhotos.push({
          caption: imgMatch[1] || undefined,
          url: imgMatch[2],
          credit: imgMatch[3] || 'NASA / ESA'
        });
      }

      if (allPhotos.length > 0) {
        photoConfig = allPhotos[0];
      }

      let realWorldNews: any = undefined;
      let practicalCase: any = undefined;
      let videoConfig: any = undefined;

      // Procesar Alertas
      const cleanedBody = bodyContent.replace(this.ALERT_REGEX, (_fullAlert, alertType, alertParam, alertText) => {
        const type = alertType.toUpperCase();
        const content = alertText.replace(/^>\s?/gm, '').trim();
        const param = alertParam ? alertParam.trim() : '';

        if (type === 'WOW' || type === 'NOTE') {
          wowFact = content;
        } else if (type === 'NOW' || type === 'TIP') {
          nowFact = content;
          if (content.length > 30) {
            realWorldNews = {
              headline: content.split('\n')[0].replace(/^#+\s*/, ''),
              summary: content,
              date: '2026',
              source: 'NASA / ESA Science Updates',
              url: 'https://science.nasa.gov/',
              verified: true
            };
          }
        } else if (type === 'NEWS') {
          const params = this.parseParamString(param);
          realWorldNews = {
            headline: params.headline || content.split('\n')[0],
            summary: content,
            date: params.date || '2026',
            source: params.source || 'NASA / ESA',
            url: params.url || 'https://science.nasa.gov/',
            verified: true
          };
        } else if (type === 'CASE' || type === 'PRACTICE') {
          practicalCase = {
            title: param || 'Caso Práctico en el Mundo Real',
            situation: content,
            challenge: 'Analiza los datos y deduce la solución basándote en la teoría aprendida.'
          };
        } else if (type === 'VIDEO') {
          const params = this.parseParamString(param);
          videoConfig = {
            url: params.url || content,
            title: params.title || 'Exploración Científica en Vídeo',
            provider: (params.provider || 'youtube') as any,
            embedUrl: params.embedUrl || params.url || content
          };
        } else if (type === 'MODEL3D' || type === 'IMPORTANT') {
          if (type === 'MODEL3D' || content.includes('Scene ID') || content.includes('Escena')) {
            stepType = 'model3d';
            const effectiveSceneId = param || content || 'space_default';
            model3dConfig = { sceneId: effectiveSceneId.replace(/['"]/g, '') };
          }
        } else if (type === 'PHOTO') {
          try {
            const params = this.parseParamString(param || content);
            const p = {
              url: params.url || content,
              caption: params.caption,
              credit: params.credit
            };
            allPhotos.push(p);
            photoConfig = p;
          } catch {
            const p = { url: param || content };
            allPhotos.push(p);
            photoConfig = p;
          }
        } else if (type === 'FORMULA') {
          stepType = 'math_formula';
          const params = this.parseParamString(param);
          formulaConfig = {
            latex: content,
            explanation: params.explanation || '',
            variables: params.vars ? JSON.parse(params.vars) : {}
          };
        } else if (type === 'AUDIO') {
          stepType = 'audio_phrasal';
          const params = this.parseParamString(param);
          audioConfig = {
            url: params.url || content,
            speaker: params.speaker || 'Native Voice',
            phoneticIpa: params.ipa
          };
        }

        return '';
      });

      const cleanContent = cleanedBody
        .replace(this.SUBTITLE_REGEX, '')
        .replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)/g, '')
        .replace(/\*Crédito:[^\n]*\*/g, '')
        .replace(/^>+\s*\[!.*$/gm, '')
        .replace(/^>+\s*.*$/gm, '')
        .replace(/^-{3,}$/gm, '')
        .trim();

      const badgeMatch = cleanContent.match(/\[badge:\s*([^\]]+)\]/i);
      if (badgeMatch) {
        badge = badgeMatch[1].trim();
      }

      steps.push({
        stepNumber,
        type: stepType,
        title: stepTitle,
        subtitle,
        content: cleanContent.replace(/\[badge:\s*[^\]]+\]/i, '').trim(),
        icon: this.detectStepIcon(stepTitle, stepType),
        badge,
        wowFact,
        nowFact,
        photo: photoConfig,
        photos: allPhotos.length > 0 ? allPhotos : undefined,
        video: videoConfig,
        realWorldNews,
        practicalCase,
        model3d: model3dConfig,
        formula: formulaConfig,
        audio: audioConfig
      });

      stepIndex++;
    }

    return steps;
  }

  /**
   * Parsea las preguntas de test
   */
  private static parseQuestions(testContent: string): CurriculumQuestion[] {
    if (!testContent) return [];

    const questionChunks = testContent.split(/(?=^###\s+)/m).filter(c => c.trim().length > 0);
    const questions: CurriculumQuestion[] = [];

    let questionIdx = 1;

    for (const chunk of questionChunks) {
      if (!chunk.startsWith('### ')) continue;

      const firstLineEnd = chunk.indexOf('\n');
      const headerLine = firstLineEnd === -1 ? chunk : chunk.substring(0, firstLineEnd).trim();
      const body = firstLineEnd === -1 ? '' : chunk.substring(firstLineEnd).trim();

      const headerMatch = headerLine.match(this.QUESTION_HEADER_REGEX);
      const prompt = headerMatch && headerMatch[4] ? headerMatch[4].trim() : headerLine.replace(/^###\s*/, '').trim();
      const declaredType = headerMatch && headerMatch[5] ? headerMatch[5].toLowerCase() : undefined;

      const explMatch = body.match(this.EXPLANATION_REGEX);
      const explanation = explMatch ? explMatch[1].trim() : 'Revisa el material de la lección para reforzar este concepto.';

      const hintMatch = body.match(this.HINT_REGEX);
      const hint = hintMatch ? hintMatch[1].trim() : undefined;

      const diffMatch = body.match(this.DIFFICULTY_REGEX);
      const difficulty = (diffMatch ? diffMatch[1] : 'medium') as 'easy' | 'medium' | 'hard';

      const xpMatch = body.match(this.XP_REGEX);
      const xp = xpMatch ? parseInt(xpMatch[1], 10) : 10;

      const imgMatch = body.match(this.IMAGE_REGEX);
      const media = imgMatch ? { type: 'image' as const, url: imgMatch[2], caption: imgMatch[1] } : undefined;

      // 1. Detectar si es tipo ORDER
      if (declaredType === 'order' || /\[!ORDER\]/i.test(body) || />\s*\*\*Tipo\*\*:\s*order/i.test(body)) {
        const items: string[] = [];
        let itemMatch: RegExpExecArray | null;
        const cleanOrderBody = body.replace(this.EXPLANATION_REGEX, '').replace(this.HINT_REGEX, '');
        
        while ((itemMatch = this.ORDER_ITEM_REGEX.exec(cleanOrderBody)) !== null) {
          items.push(itemMatch[1].trim());
        }

        const orderItems = items.map((it, idx) => ({ id: `item_${idx + 1}`, label: it }));
        const correctOrder = orderItems.map(it => it.id);

        questions.push({
          id: questionIdx,
          type: 'order',
          prompt,
          explanation,
          hint,
          difficulty,
          xp,
          media,
          orderItems,
          correctOrder
        });
      } 
      // 2. Tipo CHOICE por defecto
      else {
        const options: string[] = [];
        let correctAnswerIdx: number = 0;
        let choiceMatch: RegExpExecArray | null;
        let optIndex = 0;

        while ((choiceMatch = this.CHOICE_ITEM_REGEX.exec(body)) !== null) {
          const isChecked = choiceMatch[1].toLowerCase() === 'x';
          const optionText = choiceMatch[2].trim();
          options.push(optionText);

          if (isChecked) {
            correctAnswerIdx = optIndex;
          }
          optIndex++;
        }

        questions.push({
          id: questionIdx,
          type: 'choice',
          prompt,
          explanation,
          hint,
          difficulty,
          xp,
          media,
          options: options.length > 0 ? options : ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
          correctAnswer: correctAnswerIdx
        });
      }

      questionIdx++;
    }

    return questions;
  }

  private static castValue(val: string): any {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val === 'null') return null;
    if (!isNaN(Number(val)) && val !== '') return Number(val);
    if (val.startsWith('[') && val.endsWith(']')) {
      return val.substring(1, val.length - 1).split(',').map(s => this.castValue(s.trim()));
    }
    return val.replace(/^["'](.*)["']$/, '$1');
  }

  private static parseParamString(paramStr: string): Record<string, string> {
    const result: Record<string, string> = {};
    const regex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^,]+))/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(paramStr)) !== null) {
      const key = match[1];
      const value = match[2] || match[3] || match[4];
      result[key] = value.trim();
    }
    return result;
  }

  private static detectStepIcon(title: string, type: StepContentType): string {
    if (type === 'model3d') return '🪐';
    if (type === 'math_formula') return '📐';
    if (type === 'audio_phrasal') return '🎧';
    const lower = title.toLowerCase();
    if (lower.includes('tierra') || lower.includes('earth')) return '🌍';
    if (lower.includes('iss') || lower.includes('estación') || lower.includes('satélite')) return '🛰️';
    if (lower.includes('luna') || lower.includes('eclipse')) return '🌑';
    if (lower.includes('sol') || lower.includes('estrella')) return '☀️';
    if (lower.includes('hubble') || lower.includes('telescopio') || lower.includes('webb')) return '🔭';
    if (lower.includes('marte')) return '🔴';
    if (lower.includes('galaxia') || lower.includes('universo')) return '🌌';
    return '✨';
  }
}
