import React, { useState } from 'react';
import { 
  Headphones, Play, Pause, Volume2, RotateCcw, CheckCircle2, 
  XCircle, Sparkles, Loader2, Award, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { VoiceEngine } from '../services/voiceEngine';
import { StudentLanguageProfile } from '../types';

interface ListeningDeckPadProps {
  profile: StudentLanguageProfile;
  onAddXP: (amount: number, reason: string) => void;
}

interface ListeningActivity {
  id: string;
  title: string;
  topic: string;
  level: string;
  audioText: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const LISTENING_CATALOG: ListeningActivity[] = [
  {
    id: 'l1',
    title: 'Anuncio en el Aeropuerto de Heathrow',
    topic: 'Viajes & Transportes',
    level: 'A2',
    audioText: 'Attention passengers on flight BA472 to New York JFK. The departure gate has been changed to Gate 34B. Boarding will commence in approximately fifteen minutes. Please have your boarding pass and passport ready.',
    question: 'Where has the departure gate been changed to?',
    options: ['Gate 15A', 'Gate 34B', 'Gate 47B', 'Gate 24A'],
    correctIndex: 1,
    explanation: 'El audio anuncia claramente: "The departure gate has been changed to Gate 34B".'
  },
  {
    id: 'l2',
    title: 'Informe del Telescopio James Webb',
    topic: 'Astrofísica & Ciencia',
    level: 'B2',
    audioText: 'Astronomers analyzing deep field infrared data from the James Webb Space Telescope have discovered an ancient spiral galaxy that formed merely three hundred and fifty million years after the Big Bang, challenging our previous cosmological models.',
    question: 'Why is this discovery challenging previous cosmological models?',
    options: [
      'Because the telescope broke during transmission',
      'Because the galaxy is too close to our Sun',
      'Because the spiral galaxy formed very early after the Big Bang',
      'Because it contains no stars or planets'
    ],
    correctIndex: 2,
    explanation: 'El audio explica que se formó tan solo 350 millones de años tras el Big Bang, antes de lo que predecían los modelos cosmológicos estándar.'
  },
  {
    id: 'l3',
    title: 'Reserva en un Hotel Boutique',
    topic: 'Hostelería & Servicios',
    level: 'B1',
    audioText: 'Good afternoon, Mr. Davis. We have confirmed your reservation for three nights in the executive suite. Breakfast is served from seven to ten thirty in the rooftop garden, and high-speed Wi-Fi is complimentary throughout your stay.',
    question: 'Where is breakfast served?',
    options: ['In the hotel lobby', 'In the rooftop garden', 'In your room only', 'At the nearby restaurant'],
    correctIndex: 1,
    explanation: 'La recepcionista menciona: "Breakfast is served from seven to ten thirty in the rooftop garden".'
  }
];

export const ListeningDeckPad: React.FC<ListeningDeckPadProps> = ({ profile, onAddXP }) => {
  const [selectedActivity, setSelectedActivity] = useState<ListeningActivity>(LISTENING_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(0.9);
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isDictationMode, setIsDictationMode] = useState<boolean>(false);
  const [dictationInput, setDictationInput] = useState<string>('');
  const [dictationScore, setDictationScore] = useState<number | null>(null);

  const handlePlayAudio = () => {
    if (isPlaying) {
      VoiceEngine.stopSpeaking();
      setIsPlaying(false);
    } else {
      VoiceEngine.speakText(
        selectedActivity.audioText,
        profile.targetLanguage,
        speed,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setUserChoice(idx);
    setIsAnswered(true);

    if (idx === selectedActivity.correctIndex) {
      onAddXP(25, `Listening: ${selectedActivity.title} acertado`);
    }
  };

  const handleCheckDictation = () => {
    if (!dictationInput.trim()) return;
    const targetWords = selectedActivity.audioText.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
    const userWords = dictationInput.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);

    let matches = 0;
    userWords.forEach(w => {
      if (targetWords.includes(w)) matches++;
    });

    const calculatedScore = Math.min(100, Math.round((matches / targetWords.length) * 100));
    setDictationScore(calculatedScore);
    onAddXP(calculatedScore > 70 ? 30 : 15, 'Dictado y transcripción auditiva evaluada');
  };

  const handleSelectActivity = (act: ListeningActivity) => {
    VoiceEngine.stopSpeaking();
    setSelectedActivity(act);
    setUserChoice(null);
    setIsAnswered(false);
    setIsPlaying(false);
    setDictationInput('');
    setDictationScore(null);
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Listening Deck: Comprensión Auditiva & Dictados
            </h3>
            <p className="text-xs text-slate-400">Entrena el oído con audio neuronal a velocidades ajustables y ejercicios de comprensión.</p>
          </div>
        </div>

        {/* Selector de Modo */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsDictationMode(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !isDictationMode
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-cyan-300'
            }`}
          >
            Comprensión Oral
          </button>
          <button
            onClick={() => setIsDictationMode(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDictationMode
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-cyan-300'
            }`}
          >
            Modo Dictado
          </button>
        </div>
      </div>

      {/* Catálogo de Audios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {LISTENING_CATALOG.map((act) => {
          const isSel = selectedActivity.id === act.id;
          return (
            <button
              key={act.id}
              onClick={() => handleSelectActivity(act)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSel
                  ? 'border-cyan-400 bg-slate-950 shadow-md ring-1 ring-cyan-500/30'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  {act.level}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{act.topic}</span>
              </div>
              <p className="font-bold text-xs text-white mt-1 leading-tight">{act.title}</p>
            </button>
          );
        })}
      </div>

      {/* Reproductor de Audio Neuronal */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAudio}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-950 font-black transition-all cursor-pointer shadow-lg active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse'
                  : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/25'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">{selectedActivity.title}</h4>
              <p className="text-xs text-cyan-300">
                {isPlaying ? 'Reproduciendo audio...' : 'Haz clic en reproducir para escuchar el audio'}
              </p>
            </div>
          </div>

          {/* Ajuste de Velocidad */}
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Velocidad:</span>
            {[0.75, 0.9, 1.1].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                  speed === s ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Onda Sonora Reactiva */}
        <div className="h-16 flex items-center justify-center gap-1 bg-slate-900/60 rounded-xl px-4 border border-slate-800/80">
          {[20, 50, 75, 30, 90, 60, 40, 85, 30, 70, 45, 95, 40, 65, 80, 25, 60, 85, 40, 55].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'
              }`}
              style={{ height: `${isPlaying ? h : 15}%` }}
            />
          ))}
        </div>

        {/* Modo 1: Pregunta de Comprensión Oral */}
        {!isDictationMode ? (
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pregunta de Comprensión:
            </p>
            <h5 className="text-sm sm:text-base font-bold text-white">
              {selectedActivity.question}
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {selectedActivity.options.map((opt, idx) => {
                const isChosen = userChoice === idx;
                const isRight = idx === selectedActivity.correctIndex;
                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl text-xs sm:text-sm font-bold text-left transition-all border cursor-pointer ${
                      isChosen
                        ? isRight
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : isAnswered && isRight
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/40'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-200 animate-fadeIn">
                <span className="text-cyan-400 font-bold block mb-1">Explicación Pedagógica:</span>
                <p>{selectedActivity.explanation}</p>
              </div>
            )}
          </div>
        ) : (
          /* Modo 2: Dictado y Transcripción */
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Escribe exactamente lo que escuchas en el audio (Dictado):
            </p>
            <textarea
              rows={3}
              value={dictationInput}
              onChange={(e) => setDictationInput(e.target.value)}
              placeholder="Escucha con atención y escribe la transcripción aquí..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
            />

            <button
              onClick={handleCheckDictation}
              disabled={!dictationInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-40"
            >
              Comprobar Precisión del Dictado
            </button>

            {dictationScore !== null && (
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300">Precisión Léxica Auditiva:</span>
                  <span className="font-mono font-black text-sm text-emerald-400">{dictationScore}% Coincidencia</span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-slate-400">
                  <span className="text-white font-bold block mb-0.5">Texto Original:</span>
                  <p className="text-[11px] font-mono leading-relaxed">{selectedActivity.audioText}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
