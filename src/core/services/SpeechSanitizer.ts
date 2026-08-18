/**
 * src/core/services/SpeechSanitizer.ts
 * 
 * Filtro y Sanitizador Fonético Avanzado Anti-Emojis, Anti-Markdown y Anti-LaTeX para GOALS.
 * Diseñado específicamente para garantizar una locución ultra-limpia, natural y fluida en motores
 * de Síntesis de Voz (SpeechSynthesis / Deepgram / Azure Neural / Google TTS / ElevenLabs / SAPI).
 * 
 * Capacidades Principales:
 * 1. Purga absoluta y garantizada de todos los rangos Unicode de emojis, símbolos, banderas y emoticonos ASCII.
 * 2. Purga completa de sintaxis Markdown (encabezados, negritas, listas, tablas, enlaces, imágenes, estilos y bloques de código).
 * 3. Fonetización inteligente de fórmulas matemáticas LaTeX a español didáctico natural.
 * 4. Expansión fonética de unidades científicas y abreviaturas comunes (km/h, °C, %, pág., ej., etc.).
 * 5. Inserción y normalización de micro-pausas ortográficas para cadencia vocal humana y relajada.
 * 6. Segmentador de oraciones (utterance chunking) para prevenir cuelgues o timeouts del sintetizador.
 */

export interface SpeechSanitizerOptions {
  /** Convierte fórmulas LaTeX a español fonético natural (default: true) */
  preserveMathPhonetics?: boolean;
  /** Expande unidades y abreviaturas (km/h -> kilómetros por hora) (default: true) */
  expandAbbreviations?: boolean;
  /** Inserta y normaliza micro-pausas ortográficas para cadencia vocal (default: true) */
  insertCadencePauses?: boolean;
  /** Elimina bloques de código enteros para evitar lectura de sintaxis de programación (default: true) */
  stripCodeBlocks?: boolean;
  /** Elimina emoticonos tradicionales de texto como :) :D xD <3 (default: true) */
  stripAsciiEmoticons?: boolean;
  /** Idioma objetivo para la fonetización (default: 'es') */
  language?: 'es' | 'en';
  /** Reemplazos léxicos o fonéticos personalizados adicionales */
  customReplacements?: Record<string, string>;
}

export const DEFAULT_SPEECH_SANITIZER_OPTIONS: Required<SpeechSanitizerOptions> = {
  preserveMathPhonetics: true,
  expandAbbreviations: true,
  insertCadencePauses: true,
  stripCodeBlocks: true,
  stripAsciiEmoticons: true,
  language: 'es',
  customReplacements: {},
};

export class SpeechSanitizer {
  // ==========================================================================
  // 1. PATRONES UNICODE DE EMOJIS, SÍMBOLOS Y PICTOGRAMAS
  // ==========================================================================

  // Rangos Unicode exhaustivos (Defensivos en capas)
  private static readonly UNICODE_EMOJI_RANGES = [
    // Miscellaneous Symbols and Pictographs (1F300 - 1F5FF): 🌍, 🌟, 🚀, 💡, 🔥, etc.
    /[\u{1F300}-\u{1F5FF}]/gu,
    // Emoticons (1F600 - 1F64F): 😀, 😂, 🥰, etc.
    /[\u{1F600}-\u{1F64F}]/gu,
    // Transport and Map Symbols (1F680 - 1F6FF): 🚗, ✈️, 🚢, 🛰️, etc.
    /[\u{1F680}-\u{1F6FF}]/gu,
    // Alchemical & Geometric Shapes Extended (1F700 - 1F7FF)
    /[\u{1F700}-\u{1F7FF}]/gu,
    // Supplemental Arrows & Symbols (1F800 - 1F8FF)
    /[\u{1F800}-\u{1F8FF}]/gu,
    // Supplemental Symbols and Pictographs (1F900 - 1F9FF): 🤖, 🧠, 🥳, 🦄, 🪐, etc.
    /[\u{1F900}-\u{1F9FF}]/gu,
    // Chess & Symbols Extended-A (1FA00 - 1FAFF): 🪄, 🪅, 🩺, 🩩, etc.
    /[\u{1FA00}-\u{1FAFF}]/gu,
    // Miscellaneous Symbols (2600 - 26FF): ☀️, ☁️, ⚡, ⚽, ☕, ⚠️, ⛔, ♻️, etc.
    /[\u{2600}-\u{26FF}]/gu,
    // Dingbats (2700 - 27BF): ✂️, ✈️, ✉️, ✏️, ✨, ❄️, ⭐, ❓, ❗, 💖, etc.
    /[\u{2700}-\u{27BF}]/gu,
    // Miscellaneous Technical (2300 - 23FF): ⌚, ⌛, ⏰, ⏱️, ⌨️, ⏩, ⏪, etc.
    /[\u{2300}-\u{23FF}]/gu,
    // Specific Symbols & Geometric shapes: ⭐ (2B50), ⭕ (2B55), ⤴️ (2934), ⤵️ (2935), etc.
    /[\u{2B50}\u{2B55}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FB}-\u{25FE}\u{2B05}-\u{2B07}]/gu,
    // Mahjong & Playing Cards (1F000 - 1F0FF)
    /[\u{1F000}-\u{1F0FF}]/gu,
    // Enclosed Alphanumeric Supplement (1F100 - 1F1FF)
    /[\u{1F100}-\u{1F1FF}]/gu,
    // Regional Indicator Symbols (Flags: 🇪🇸, 🇺🇸, 🇯🇵, etc.) (1F1E6 - 1F1FF)
    /[\u{1F1E6}-\u{1F1FF}]/gu,
    // Skin tone modifiers (1F3FB - 1F3FF)
    /[\u{1F3FB}-\u{1F3FF}]/gu,
    // Zero-Width Joiner (200D) and Variation Selectors (FE00 - FE0F, E0100 - E01EF)
    /\u200D/gu,
    /[\u{FE00}-\u{FE0F}]/gu,
    /[\u{E0100}-\u{E01EF}]/gu,
    // Keycaps sequences: [0-9#*] followed by variation selector and combining enclosing keycap
    /[\u0023\u002A\u0030-\u0039]\uFE0F?\u20E3/gu,
  ];

  // Regex universal basada en propiedades Unicode estándar (ES2018+)
  private static readonly UNICODE_PROPERTY_EMOJI_REGEX = /\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Regional_Indicator}/gu;

  // Emoticonos ASCII habituales en chats y notas
  private static readonly ASCII_EMOTICON_REGEX = /(?:^|\s)(?::\)|:-\)|:\(|:-\(|:D|:-D|xD|XD|;-\)|;\)|:P|:-P|:p|:-p|:O|:-O|:o|:-o|:\*|:-\/|:\\|<3|;\(|:'\(|\^_\^|\^\^|-_-|>_<|:3|8\)|8-\)|B\)|B-\))(?=\s|$|[.,!?;:])/g;

  // ==========================================================================
  // 2. PATRONES DE CARACTERES DE CONTROL E INVISIBLES
  // ==========================================================================
  private static readonly CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  private static readonly INVISIBLE_UNICODE_REGEX = /[\u200B-\u200F\uFEFF\u00AD]/g;

  // ==========================================================================
  // 3. TABLA FONÉTICA LATEX (ESPAÑOL)
  // ==========================================================================
  private static readonly LATEX_GREEK_LETTERS_ES: Record<string, string> = {
    alpha: 'alfa',
    beta: 'beta',
    gamma: 'gamma',
    delta: 'delta',
    Delta: 'delta',
    epsilon: 'épsilon',
    varepsilon: 'épsilon',
    zeta: 'zeta',
    eta: 'eta',
    theta: 'theta',
    Theta: 'theta',
    iota: 'iota',
    kappa: 'kappa',
    lambda: 'lambda',
    Lambda: 'lambda',
    mu: 'mu',
    nu: 'nu',
    xi: 'xi',
    pi: 'pi',
    Pi: 'pi',
    rho: 'ro',
    sigma: 'sigma',
    Sigma: 'sigma',
    tau: 'tau',
    upsilon: 'ípsilon',
    phi: 'fi',
    Phi: 'fi',
    chi: 'ji',
    psi: 'psi',
    Psi: 'psi',
    omega: 'omega',
    Omega: 'omega',
  };

  private static readonly LATEX_OPERATORS_ES: Record<string, string> = {
    pm: 'más o menos',
    mp: 'menos o más',
    times: 'por',
    cdot: 'por',
    div: 'dividido entre',
    neq: 'no es igual a',
    ne: 'no es igual a',
    leq: 'menor o igual que',
    le: 'menor o igual que',
    geq: 'mayor o igual que',
    ge: 'mayor o igual que',
    approx: 'aproximadamente',
    sim: 'similar a',
    equiv: 'equivalente a',
    infty: 'infinito',
    sum: 'suma de',
    int: 'integral de',
    prod: 'producto de',
    to: 'flecha a',
    rightarrow: 'hacia',
    Rightarrow: 'implica que',
    degree: 'grados',
    circ: 'grados',
    nabla: 'nabla',
    partial: 'derivada parcial de',
  };

  // ==========================================================================
  // 4. TABLA DE UNIDADES Y ABREVIATURAS (ESPAÑOL)
  // ==========================================================================
  private static readonly ABBREVIATIONS_ES: Array<[RegExp, string]> = [
    [/\bkm\/h\b/gi, 'kilómetros por hora'],
    [/\bm\/s\b/gi, 'metros por segundo'],
    [/\bm\/s\^?2\b|\bm\/s²\b/gi, 'metros por segundo al cuadrado'],
    [/(\d+)\s*°C\b|(\d+)\s*ºC\b/gi, '$1$2 grados Celsius'],
    [/(\d+)\s*°F\b|(\d+)\s*ºF\b/gi, '$1$2 grados Fahrenheit'],
    [/(\d+)\s*K\b/g, '$1 kelvin'],
    [/(\d+)\s*%/g, '$1 por ciento'],
    [/(\d+)\s*km\b/gi, '$1 kilómetros'],
    [/(\d+)\s*cm\b/gi, '$1 centímetros'],
    [/(\d+)\s*mm\b/gi, '$1 milímetros'],
    [/(\d+)\s*kg\b/gi, '$1 kilogramos'],
    [/(\d+)\s*mg\b/gi, '$1 miligramos'],
    [/\bpág\.\s*(\d+)/gi, 'página $1'],
    [/\bpágs\.\s*(\d+)/gi, 'páginas $1'],
    [/\bp\.\s*ej\.\b/gi, 'por ejemplo'],
    [/\bej\.\b/gi, 'ejemplo'],
    [/\betc\.\b/gi, 'etcétera.'],
    [/\bvs\.?\b/gi, 'versus'],
    [/\baprox\.\b/gi, 'aproximadamente'],
    [/\bmáx\.\b/gi, 'máximo'],
    [/\bmín\.\b/gi, 'mínimo'],
    [/\bc\/u\b/gi, 'cada uno'],
    [/\bN[º°]\s*(\d+)/gi, 'número $1'],
    [/\bDr\.\s+/g, 'Doctor '],
    [/\bDra\.\s+/g, 'Doctora '],
    [/\bProf\.\s+/g, 'Profesor '],
    [/\bProfa\.\s+/g, 'Profesora '],
    [/\bSr\.\s+/g, 'Señor '],
    [/\bSra\.\s+/g, 'Señora '],
    [/\bSrta\.\s+/g, 'Señorita '],
  ];

  // ==========================================================================
  // MÉTODO PRINCIPAL DE SANITIZACIÓN
  // ==========================================================================
  /**
   * Procesa cualquier texto crudo (con Markdown, LaTeX, emojis, URLs, HTML) y produce
   * una versión fonéticamente pura, con ritmo pausado y lista para la síntesis de voz.
   */
  public static sanitize(rawText: string, options: SpeechSanitizerOptions = {}): string {
    if (!rawText || typeof rawText !== 'string') return '';

    const opts: Required<SpeechSanitizerOptions> = {
      ...DEFAULT_SPEECH_SANITIZER_OPTIONS,
      ...options,
    };

    let text = rawText;

    // 1. Descartar caracteres de control e invisibles
    text = text.replace(this.CONTROL_CHARS_REGEX, '');
    text = text.replace(this.INVISIBLE_UNICODE_REGEX, '');
    text = text.replace(/\u00A0/g, ' '); // Non-breaking space a espacio estándar

    // 2. Reemplazos de entidades HTML comunes
    text = this.decodeHtmlEntities(text);

    // 3. Tratamiento fonético de fórmulas LaTeX antes de purgar caracteres especiales
    if (opts.preserveMathPhonetics) {
      text = this.phonetizeLatex(text, opts.language);
    } else {
      // Si no se preservan, purgar fórmulas LaTeX crudas ($...$ y $$...$$)
      text = text.replace(/\$\$[\s\S]*?\$\$/g, ' ');
      text = text.replace(/\$[^$]+\$/g, ' ');
    }

    // 4. Purgar bloques de código y etiquetas HTML/SVG
    if (opts.stripCodeBlocks) {
      text = text.replace(/```[\w-]*\n?[\s\S]*?```/g, ' ');
      text = text.replace(/~~~[\w-]*\n?[\s\S]*?~~~/g, ' ');
    }
    text = text.replace(/<audio[\s\S]*?<\/audio>/gi, '');
    text = text.replace(/<video[\s\S]*?<\/video>/gi, '');
    text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<[^>]+>/g, ' ');

    // 5. Purgar imágenes Markdown ![alt](url)
    text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '');

    // 6. Procesar enlaces Markdown [Texto](url) -> Conservar 'Texto', eliminar 'url'
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|[^)]+)\)/gi, (match, linkText, url) => {
      // Si el enlace apunta a imágenes, audio o es idéntico a una url, omitirlo
      if (/\.(jpeg|jpg|gif|png|svg|webp|mp3|wav|ogg|pdf)/i.test(url) || /^https?:\/\//i.test(linkText.trim())) {
        return '';
      }
      return linkText;
    });

    // 7. Eliminar URLs crudas (http://, https://, www.)
    text = text.replace(/(?:https?:\/\/|www\.)[^\s<>)"]+/gi, '');

    // 8. Purgar Emojis Unicode y Emoticonos ASCII
    text = this.stripEmojis(text, opts.stripAsciiEmoticons);

    // 9. Sanitizar formato Markdown (tablas, encabezados, negrita, listas, etc.)
    text = this.stripMarkdown(text);

    // 10. Expansión de abreviaturas y unidades científicas
    if (opts.expandAbbreviations) {
      text = this.phonetizeAbbreviations(text, opts.language);
    }

    // 11. Aplicar reemplazos personalizados
    if (opts.customReplacements) {
      for (const [pattern, replacement] of Object.entries(opts.customReplacements)) {
        text = text.split(pattern).join(replacement);
      }
    }

    // 12. Normalización de ritmo, micro-pausas ortográficas y espacios
    if (opts.insertCadencePauses) {
      text = this.normalizeCadence(text);
    } else {
      text = text.replace(/\s+/g, ' ').trim();
    }

    return text;
  }

  // ==========================================================================
  // PURGA DE EMOJIS
  // ==========================================================================
  public static stripEmojis(text: string, stripAscii: boolean = true): string {
    if (!text) return '';

    let clean = text;

    // Capa 1: Unicode Property Escapes
    try {
      clean = clean.replace(this.UNICODE_PROPERTY_EMOJI_REGEX, '');
    } catch {
      // Fallback seguro
    }

    // Capa 2: Rangos hexadecimales exhaustivos
    for (const rangeRegex of this.UNICODE_EMOJI_RANGES) {
      clean = clean.replace(rangeRegex, '');
    }

    // Capa 3: Emoticonos de texto ASCII (:), :D, xD, <3, etc.)
    if (stripAscii) {
      clean = clean.replace(this.ASCII_EMOTICON_REGEX, ' ');
    }

    return clean;
  }

  // ==========================================================================
  // PURGA DE MARKDOWN
  // ==========================================================================
  public static stripMarkdown(text: string): string {
    if (!text) return '';

    let clean = text;

    // A. Procesamiento de Tablas Markdown (| Col1 | Col2 |)
    clean = this.cleanMarkdownTables(clean);

    // B. Encabezados (# Título -> Título.)
    clean = clean.replace(/^#{1,6}\s*(.+)$/gm, (match, title) => {
      const trimmed = title.trim();
      if (!trimmed) return '';
      return /[.!?:;]$/.test(trimmed) ? trimmed : `${trimmed}.`;
    });

    // C. Citas en bloque (> Cita)
    clean = clean.replace(/^\s*>\s*/gm, '');

    // D. Listas de tareas (- [ ] Tarea / - [x] Completada)
    clean = clean.replace(/^\s*[-*+]\s*\[[ xX]\]\s*(.+)$/gm, '$1.');

    // E. Elementos de lista (- Elemento / * Elemento / + Elemento / 1. Elemento)
    clean = clean.replace(/^\s*[-*+]\s+(.+)$/gm, (match, item) => {
      const trimmed = item.trim();
      return /[.!?:;]$/.test(trimmed) ? trimmed : `${trimmed}.`;
    });
    clean = clean.replace(/^\s*\d+[\.\)]\s+(.+)$/gm, (match, item) => {
      const trimmed = item.trim();
      return /[.!?:;]$/.test(trimmed) ? trimmed : `${trimmed}.`;
    });

    // F. Separadores horizontales (---, ***, ___)
    clean = clean.replace(/^\s*[-*_]{3,}\s*$/gm, '');

    // G. Notas al pie [^1] y referencias numéricas tipo cita [1], [2]
    clean = clean.replace(/\[\^[^\]]+\]/g, '');
    clean = clean.replace(/\[\d+\]/g, '');

    // H. Código inline `codigo` -> codigo
    clean = clean.replace(/`([^`]+)`/g, '$1');

    // I. Formato de texto enriquecido (Negrita, Cursiva, Tachado, Resaltado)
    clean = clean.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
    clean = clean.replace(/\*\*([^*]+)\*\*/g, '$1');
    clean = clean.replace(/\*([^*]+)\*/g, '$1');
    clean = clean.replace(/___([^_]+)___/g, '$1');
    clean = clean.replace(/__([^_]+)__/g, '$1');
    clean = clean.replace(/_([^_]+)_/g, '$1');
    clean = clean.replace(/~~([^~]+)~~/g, '$1');
    clean = clean.replace(/==([^=]+)==/g, '$1');
    clean = clean.replace(/~([^~]+)~/g, '$1');

    // J. Corchetes y llaves sueltas
    clean = clean.replace(/[\[\]{}]/g, ' ');

    return clean;
  }

  // ==========================================================================
  // SANITIZACIÓN DE TABLAS MARKDOWN
  // ==========================================================================
  private static cleanMarkdownTables(text: string): string {
    const lines = text.split('\n');
    const processed: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^\|?\s*:?-+:?\s*(\|:?\s*:?-+:?\s*)+\|?$/.test(line)) {
        continue;
      }
      if (line.startsWith('|') && line.endsWith('|')) {
        const cells = line
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
        if (cells.length > 0) {
          processed.push(cells.join(', ') + '.');
          continue;
        }
      }
      processed.push(lines[i]);
    }

    return processed.join('\n');
  }

  // ==========================================================================
  // FONETIZACIÓN DE FÓRMULAS LATEX
  // ==========================================================================
  public static phonetizeLatex(text: string, _lang: 'es' | 'en' = 'es'): string {
    if (!text) return '';

    const mathReplacer = (_match: string, formula: string) => {
      let f = formula.trim();

      f = f.replace(/\\(text|mathrm|mathbf|mathit|textbf|textit)\{([^{}]+)\}/g, ' $2 ');

      let fractionGuard = 0;
      while (/\\frac\{([^{}]+)\}\{([^{}]+)\}/.test(f) && fractionGuard < 10) {
        f = f.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1 sobre $2');
        fractionGuard++;
      }

      f = f.replace(/\\sqrt\[([^{}]+)\]\{([^{}]+)\}/g, 'raíz de orden $1 de $2');
      f = f.replace(/\\sqrt\{([^{}]+)\}/g, 'raíz cuadrada de $1');

      f = f.replace(/\^\{2\}|\^2\b/g, ' al cuadrado');
      f = f.replace(/\^\{3\}|\^3\b/g, ' al cubo');
      f = f.replace(/\^\{([^{}]+)\}/g, ' elevado a la $1');
      f = f.replace(/\^([0-9a-zA-Z])/g, ' elevado a la $1');

      f = f.replace(/_\{([^{}]+)\}/g, ' sub $1');
      f = f.replace(/_([0-9a-zA-Z])/g, ' sub $1');

      for (const [greek, spoken] of Object.entries(this.LATEX_GREEK_LETTERS_ES)) {
        const greekRegex = new RegExp(`\\\\${greek}\\b`, 'g');
        f = f.replace(greekRegex, ` ${spoken} `);
      }

      for (const [op, spoken] of Object.entries(this.LATEX_OPERATORS_ES)) {
        const opRegex = new RegExp(`\\\\${op}\\b`, 'g');
        f = f.replace(opRegex, ` ${spoken} `);
      }

      f = f.replace(/!=/g, ' no es igual a ');
      f = f.replace(/<=/g, ' menor o igual que ');
      f = f.replace(/>=/g, ' mayor o igual que ');
      f = f.replace(/=/g, ' es igual a ');
      f = f.replace(/\+/g, ' más ');
      f = f.replace(/(?<=\w|\d)\s*-\s*(?=\w|\d)/g, ' menos ');
      f = f.replace(/(?<=\w|\d)\s*\*\s*(?=\w|\d)/g, ' por ');

      f = f.replace(/\\[a-zA-Z]+/g, ' ');
      f = f.replace(/[{}\\]/g, ' ');

      return ` ${f.trim()} `;
    };

    let processed = text;
    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, mathReplacer);
    processed = processed.replace(/\$([^\$]+)\$/g, mathReplacer);

    return processed;
  }

  // ==========================================================================
  // EXPANSIÓN DE ABREVIATURAS Y UNIDADES
  // ==========================================================================
  public static phonetizeAbbreviations(text: string, lang: 'es' | 'en' = 'es'): string {
    if (!text) return '';
    let processed = text;

    if (lang === 'es') {
      for (const [regex, replacement] of this.ABBREVIATIONS_ES) {
        processed = processed.replace(regex, replacement);
      }
    }

    return processed;
  }

  // ==========================================================================
  // CADENCIA Y MICRO-PAUSAS ORTOGRÁFICAS
  // ==========================================================================
  public static normalizeCadence(text: string): string {
    if (!text) return '';

    let clean = text;

    // 1. Reemplazar incisos entre paréntesis por pausas de coma
    clean = clean.replace(/\s*\(([^)]+)\)\s*/g, ', $1, ');

    // 2. Reemplazar guiones largos o em-dashes por pausas de coma
    clean = clean.replace(/\s*[—–]\s*/g, ', ');

    // 3. Colapsar signos de puntuación repetitivos
    clean = clean.replace(/!{2,}/g, '!');
    clean = clean.replace(/\?{2,}/g, '?');
    clean = clean.replace(/\.{4,}/g, '...');
    clean = clean.replace(/,{2,}/g, ',');

    // 4. Normalizar espacios antes de la puntuación
    clean = clean.replace(/\s+([,.:;?!])/g, '$1');

    // 5. Asegurar un espacio después de la puntuación si le sigue una letra o dígito
    clean = clean.replace(/(?<!\d)([,.:;?!])(?!\d)(\S)/g, '$1 $2');

    // 6. Formateo de signos de apertura en español (¿ y ¡)
    clean = clean.replace(/([^\s¿¡])([¿¡])/g, '$1 $2');
    clean = clean.replace(/([¿¡])\s+/g, '$1');

    // 7. Normalizar barras inclinadas en opciones
    clean = clean.replace(/\b(\w+)\/(\w+)\b/g, '$1 o $2');

    // 8. Normalizar comillas
    clean = clean.replace(/["'«»“”]/g, '');

    // 9. Colapsar múltiples espacios
    clean = clean.replace(/\s+/g, ' ').trim();

    return clean;
  }

  // ==========================================================================
  // SEGMENTADOR DE ORACIONES (CHUNKER)
  // ==========================================================================
  public static splitIntoSpeechUtterances(text: string, maxUtteranceLength: number = 200): string[] {
    const clean = this.sanitize(text);
    if (!clean) return [];

    if (clean.length <= maxUtteranceLength) {
      return [clean];
    }

    const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const rawSentence of sentences) {
      const sentence = rawSentence.trim();
      if (!sentence) continue;

      if ((currentChunk + ' ' + sentence).trim().length <= maxUtteranceLength) {
        currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = '';
        }

        if (sentence.length > maxUtteranceLength) {
          const clauses = sentence.match(/[^,;:]+[,;:]+|[^,;:]+$/g) || [sentence];
          for (const clause of clauses) {
            const trimmedClause = clause.trim();
            if (!trimmedClause) continue;

            if ((currentChunk + ' ' + trimmedClause).trim().length <= maxUtteranceLength) {
              currentChunk = currentChunk ? `${currentChunk} ${trimmedClause}` : trimmedClause;
            } else {
              if (currentChunk) chunks.push(currentChunk);
              currentChunk = trimmedClause;
            }
          }
        } else {
          currentChunk = sentence;
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks.filter((c) => c.length > 0);
  }

  private static decodeHtmlEntities(text: string): string {
    return text
      .replace(/&amp;/g, ' y ')
      .replace(/&lt;/g, ' menor que ')
      .replace(/&gt;/g, ' mayor que ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&copy;|&reg;|&trade;/g, '')
      .replace(/&deg;/g, ' grados ')
      .replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec))
      .replace(/&#x([0-9a-fA-F]+);/g, (_match, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
}

export function sanitizeForSpeech(rawText: string, options?: SpeechSanitizerOptions): string {
  return SpeechSanitizer.sanitize(rawText, options);
}
