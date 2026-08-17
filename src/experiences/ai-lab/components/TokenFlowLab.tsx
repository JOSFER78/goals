import React, { useState, useMemo } from 'react';
import { 
  TokenItem, 
  NextWordCandidate 
} from '../types/aiLabTypes';
import { 
  Binary, 
  Sparkles, 
  Thermometer, 
  Layers, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  Zap, 
  ArrowRight,
  Sliders,
  Check
} from 'lucide-react';

interface TokenFlowLabProps {
  onAddXP?: (amount: number, reason: string) => void;
}

// Colores para los chips de tokens
const TOKEN_COLORS = [
  'bg-purple-500/20 text-purple-200 border-purple-500/40',
  'bg-cyan-500/20 text-cyan-200 border-cyan-500/40',
  'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  'bg-amber-500/20 text-amber-200 border-amber-500/40',
  'bg-rose-500/20 text-rose-200 border-rose-500/40',
  'bg-indigo-500/20 text-indigo-200 border-indigo-500/40',
  'bg-teal-500/20 text-teal-200 border-teal-500/40',
  'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/40'
];

// Algoritmo de tokenización en vivo de subpalabras / BPE didáctico
function tokenizeText(text: string): TokenItem[] {
  if (!text) return [];

  // Expresión regular que separa palabras comunes, signos de puntuación, emojis y fragmentos
  const regex = /([A-ZÁÉÍÓÚÑa-záéíóúñ]+|\d+|[^\s\w]+|\s+)/gu;
  const matches = text.match(regex) || [text];

  const tokens: TokenItem[] = [];
  let colorIdx = 0;

  for (const part of matches) {
    // Si la palabra es larga (> 8 caracteres), la dividimos en subpalabras
    if (part.length > 8 && /^[A-ZÁÉÍÓÚÑa-záéíóúñ]+$/.test(part)) {
      const mid = Math.ceil(part.length / 2);
      const sub1 = part.slice(0, mid);
      const sub2 = part.slice(mid);

      const id1 = Math.abs(hashString(sub1)) % 90000 + 1000;
      tokens.push({
        text: sub1,
        id: id1,
        color: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
        bytes: Array.from(new TextEncoder().encode(sub1))
      });
      colorIdx++;

      const id2 = Math.abs(hashString(sub2)) % 90000 + 1000;
      tokens.push({
        text: sub2,
        id: id2,
        color: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
        bytes: Array.from(new TextEncoder().encode(sub2))
      });
      colorIdx++;
    } else {
      const id = Math.abs(hashString(part)) % 90000 + 1000;
      tokens.push({
        text: part,
        id,
        color: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
        bytes: Array.from(new TextEncoder().encode(part))
      });
      colorIdx++;
    }
  }

  return tokens;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Candidatos contextuales según la última palabra del prompt
const CONTEXTUAL_VOCABULARY: Record<string, { word: string; logit: number; isHallucinationRisk?: boolean }[]> = {
  default: [
    { word: ' inteligente', logit: 4.2 },
    { word: ' artificial', logit: 3.8 },
    { word: ' del', logit: 3.1 },
    { word: ' para', logit: 2.7 },
    { word: ' humano', logit: 1.9 },
    { word: ' galáctico', logit: 0.8, isHallucinationRisk: true },
    { word: ' cuántico', logit: 0.6, isHallucinationRisk: true }
  ],
  espacio: [
    { word: ' exterior', logit: 5.1 },
    { word: ' interestelar', logit: 4.2 },
    { word: ' profundo', logit: 3.9 },
    { word: ' tiempo', logit: 3.2 },
    { word: ' dimensional', logit: 1.8 },
    { word: ' alienígena', logit: 0.9, isHallucinationRisk: true }
  ],
  inteligencia: [
    { word: ' artificial', logit: 6.2 },
    { word: ' humana', logit: 4.5 },
    { word: ' colectiva', logit: 3.2 },
    { word: ' emocional', logit: 3.0 },
    { word: ' sintética', logit: 2.1 },
    { word: ' alienígena', logit: 0.5, isHallucinationRisk: true }
  ],
  sol: [
    { word: ' brilla', logit: 4.8 },
    { word: ' es', logit: 4.5 },
    { word: ' calienta', logit: 3.9 },
    { word: ' y', logit: 3.3 },
    { word: ' gigante', logit: 2.5 },
    { word: ' cuadrado', logit: 0.2, isHallucinationRisk: true }
  ]
};

export const TokenFlowLab: React.FC<TokenFlowLabProps> = ({ onAddXP }) => {
  const [inputText, setInputText] = useState<string>('La Inteligencia Artificial aprende de los datos');
  const [promptText, setPromptText] = useState<string>('El Sol');
  
  // Parámetros de Muestreo (Sampling)
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(5);
  const [topP, setTopP] = useState<number>(0.90);

  const tokens = useMemo(() => tokenizeText(inputText), [inputText]);

  // Obtener vocabulario de candidatos según el texto del prompt
  const candidates: NextWordCandidate[] = useMemo(() => {
    const lower = promptText.trim().toLowerCase();
    const lastWord = lower.split(/\s+/).pop() || '';
    
    let rawList = CONTEXTUAL_VOCABULARY[lastWord] || CONTEXTUAL_VOCABULARY.default;

    // 1. Aplicar Temperatura a los Logits: Logit / T
    const tempSafe = Math.max(0.01, temperature);
    const scaledLogits = rawList.map((item) => ({
      ...item,
      scaled: item.logit / tempSafe
    }));

    // Softmax
    const maxScaled = Math.max(...scaledLogits.map((s) => s.scaled));
    const exps = scaledLogits.map((s) => Math.exp(s.scaled - maxScaled));
    const sumExp = exps.reduce((a, b) => a + b, 0);
    const rawProbs = exps.map((e) => e / sumExp);

    // Combinar
    let combined = rawList.map((item, idx) => ({
      word: item.word,
      rawProb: rawProbs[idx],
      adjustedProb: rawProbs[idx],
      isHallucinationRisk: item.isHallucinationRisk
    }));

    // Ordenar por probabilidad descendente
    combined.sort((a, b) => b.adjustedProb - a.adjustedProb);

    // 2. Aplicar Top-K
    combined = combined.slice(0, topK);

    // 3. Aplicar Top-P (Nucleus)
    let cumulative = 0;
    const nucleusFiltered: NextWordCandidate[] = [];
    for (const c of combined) {
      nucleusFiltered.push(c);
      cumulative += c.adjustedProb;
      if (cumulative >= topP) break;
    }

    // Renormalizar probabilidades del conjunto final
    const finalSum = nucleusFiltered.reduce((a, b) => a + b.adjustedProb, 0);
    return nucleusFiltered.map((c) => ({
      ...c,
      adjustedProb: c.adjustedProb / (finalSum || 1)
    }));
  }, [promptText, temperature, topK, topP]);

  // Generar siguiente palabra mediante muestreo ponderado
  const handleSampleNextWord = () => {
    if (candidates.length === 0) return;

    let r = Math.random();
    let selectedWord = candidates[0].word;
    let acc = 0;

    for (const c of candidates) {
      acc += c.adjustedProb;
      if (r <= acc) {
        selectedWord = c.word;
        break;
      }
    }

    setPromptText((prev) => prev + selectedWord);
    if (onAddXP) onAddXP(5, 'Generación de Token en LLM Lab');
  };

  const handleResetPrompt = () => {
    setPromptText('El Sol');
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera del Laboratorio */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Binary className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Laboratorio de Tokens & Predicción de Siguiente Palabra
            </h2>
            <p className="text-xs text-slate-400">
              Observa cómo un LLM descompone el lenguaje en números y predice la continuación mediante probabilidad y temperatura.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: TOKENIZADOR EN VIVO */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            1. Tokenizador en Tiempo Real (Byte-Pair Encoding)
          </span>
          <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/20">
            {tokens.length} Tokens | {inputText.length} Caracteres
          </span>
        </div>

        {/* Input Text Box */}
        <div className="space-y-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-2xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
            placeholder="Escribe cualquier texto en español, inglés, emojis o código..."
          />

          {/* Presets rápidos */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-bold">Probar:</span>
            {[
              'La Inteligencia Artificial aprende de los datos',
              'Antigravedad y astrofísica cuántica 🚀✨',
              'function calcularProbabilidad(tokens: string[]) { return true; }'
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(preset)}
                className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-cyan-300 border border-slate-800 text-[11px] font-medium transition-all cursor-pointer truncate max-w-[200px]"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Visualización de Chips de Tokens */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Representación de Tokens en Memoria:
          </span>
          
          <div className="flex flex-wrap gap-2 items-center">
            {tokens.map((token, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-xl border flex flex-col items-center gap-0.5 shadow-sm transition-all hover:scale-105 ${token.color}`}
              >
                <span className="font-mono text-xs font-bold whitespace-pre">
                  {token.text === ' ' ? '␣ (espacio)' : token.text}
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  ID: #{token.id}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECCIÓN 2: SIMULADOR DE PREDICCIÓN DE SIGUIENTE PALABRA */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-purple-300 tracking-wider flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5" />
            2. Generador y Árbol de Probabilidades de la Siguiente Palabra
          </span>
        </div>

        {/* Prompt en construcción */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Texto Generado por el LLM:</span>
            <button
              type="button"
              onClick={handleResetPrompt}
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reiniciar Texto</span>
            </button>
          </div>

          <div className="text-base sm:text-lg font-mono text-white p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            {promptText}
            <span className="inline-block w-2 h-5 bg-purple-400 ml-1 animate-pulse" />
          </div>
        </div>

        {/* Sliders de Temperatura, Top-K y Top-P */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          
          {/* Slider Temperatura */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Temperatura (T):</span>
              <span className="font-mono text-purple-400 font-bold">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-purple-500 bg-slate-900 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              {temperature < 0.3 ? 'Determinista / Seguro' : temperature > 1.2 ? 'Muy Creativo / Caótico' : 'Equilibrado'}
            </span>
          </div>

          {/* Slider Top-K */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Top-K:</span>
              <span className="font-mono text-cyan-400 font-bold">{topK} opciones</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 bg-slate-900 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              Solo elige entre los K tokens más probables
            </span>
          </div>

          {/* Slider Top-P */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Top-P (Nucleus):</span>
              <span className="font-mono text-emerald-400 font-bold">{(topP * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-900 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              Corta el muestreo al alcanzar el P% de probabilidad
            </span>
          </div>

        </div>

        {/* Tabla de Distribución de Probabilidades de la Siguiente Palabra */}
        <div className="space-y-2.5">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
            Candidatos para el Siguiente Token:
          </span>

          <div className="space-y-2">
            {candidates.map((c, idx) => {
              const pct = (c.adjustedProb * 100).toFixed(1);
              return (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-slate-400 font-mono text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-mono font-bold text-sm text-white">
                      "{c.word}"
                    </span>
                    {c.isHallucinationRisk && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                        Riesgo Alucinación
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-1 max-w-xs">
                    <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-xs text-purple-300 w-12 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón de Generación de Token */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={handleSampleNextWord}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar Siguiente Token (+5 XP)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
