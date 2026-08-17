import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  DatasetType, 
  NeuralPoint 
} from '../types/aiLabTypes';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Sliders, 
  Sparkles, 
  Cpu, 
  Layers, 
  Zap,
  Info
} from 'lucide-react';

interface NeuralNetworkVisualizerProps {
  onAddXP?: (amount: number, reason: string) => void;
}

// Generadores de Datasets 2D Reales
function generateDataset(type: DatasetType, count = 120): NeuralPoint[] {
  const points: NeuralPoint[] = [];

  if (type === 'circle') {
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * 5;
      const theta = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const label = r < 2.8 ? 1 : 0;
      points.push({ x, y, label });
    }
  } else if (type === 'xor') {
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const padding = 0.5;
      if (Math.abs(x) > padding && Math.abs(y) > padding) {
        const label = (x * y > 0) ? 1 : 0;
        points.push({ x, y, label });
      }
    }
  } else if (type === 'moons') {
    const half = Math.floor(count / 2);
    // Luna 1
    for (let i = 0; i < half; i++) {
      const phi = (i / half) * Math.PI;
      const x = Math.cos(phi) * 3 - 1.5 + (Math.random() - 0.5) * 0.7;
      const y = Math.sin(phi) * 3 - 0.5 + (Math.random() - 0.5) * 0.7;
      points.push({ x, y, label: 1 });
    }
    // Luna 2
    for (let i = 0; i < half; i++) {
      const phi = (i / half) * Math.PI;
      const x = -Math.cos(phi) * 3 + 1.5 + (Math.random() - 0.5) * 0.7;
      const y = -Math.sin(phi) * 3 + 0.5 + (Math.random() - 0.5) * 0.7;
      points.push({ x, y, label: 0 });
    }
  } else if (type === 'spiral') {
    const n = Math.floor(count / 2);
    for (let i = 0; i < n; i++) {
      const r = (i / n) * 4.5 + 0.5;
      const t = 1.75 * i / n * 2 * Math.PI;
      points.push({
        x: r * Math.sin(t) + (Math.random() - 0.5) * 0.4,
        y: r * Math.cos(t) + (Math.random() - 0.5) * 0.4,
        label: 1
      });
      points.push({
        x: -r * Math.sin(t) + (Math.random() - 0.5) * 0.4,
        y: -r * Math.cos(t) + (Math.random() - 0.5) * 0.4,
        label: 0
      });
    }
  }

  return points;
}

// Funciones de activación reales
function relu(x: number) { return Math.max(0, x); }
function reluDeriv(x: number) { return x > 0 ? 1 : 0; }
function sigmoid(x: number) { return 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, x)))); }
function sigmoidDeriv(y: number) { return y * (1 - y); }
function tanh(x: number) { return Math.tanh(x); }
function tanhDeriv(y: number) { return 1 - y * y; }

export const NeuralNetworkVisualizer: React.FC<NeuralNetworkVisualizerProps> = ({ onAddXP }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lossCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [datasetType, setDatasetType] = useState<DatasetType>('circle');
  const [points, setPoints] = useState<NeuralPoint[]>(() => generateDataset('circle'));
  
  // Hiperparámetros de la red
  const [numNeuronsLayer1, setNumNeuronsLayer1] = useState<number>(4);
  const [numNeuronsLayer2, setNumNeuronsLayer2] = useState<number>(3);
  const [activation, setActivation] = useState<'relu' | 'tanh' | 'sigmoid'>('tanh');
  const [learningRate, setLearningRate] = useState<number>(0.08);

  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [epoch, setEpoch] = useState<number>(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [currentLoss, setCurrentLoss] = useState<number>(0.69);

  // Pesos de la Red (Entrada 2D -> Capa 1 -> Capa 2 -> Salida 1D)
  const weightsRef = useRef<{
    w1: number[][]; // [inputDim, h1Dim]
    b1: number[];   // [h1Dim]
    w2: number[][]; // [h1Dim, h2Dim]
    b2: number[];   // [h2Dim]
    wOut: number[]; // [h2Dim]
    bOut: number;
  }>({
    w1: [],
    b1: [],
    w2: [],
    b2: [],
    wOut: [],
    bOut: 0
  });

  // Inicializar pesos de forma aleatoria (Xavier / He)
  const initWeights = useCallback(() => {
    const scale1 = Math.sqrt(2 / 2);
    const w1 = Array.from({ length: 2 }, () =>
      Array.from({ length: numNeuronsLayer1 }, () => (Math.random() - 0.5) * scale1)
    );
    const b1 = Array.from({ length: numNeuronsLayer1 }, () => 0);

    const scale2 = Math.sqrt(2 / numNeuronsLayer1);
    const w2 = Array.from({ length: numNeuronsLayer1 }, () =>
      Array.from({ length: numNeuronsLayer2 }, () => (Math.random() - 0.5) * scale2)
    );
    const b2 = Array.from({ length: numNeuronsLayer2 }, () => 0);

    const scaleOut = Math.sqrt(2 / numNeuronsLayer2);
    const wOut = Array.from({ length: numNeuronsLayer2 }, () => (Math.random() - 0.5) * scaleOut);
    const bOut = 0;

    weightsRef.current = { w1, b1, w2, b2, wOut, bOut };
    setEpoch(0);
    setLossHistory([]);
    setCurrentLoss(0.69);
  }, [numNeuronsLayer1, numNeuronsLayer2]);

  // Al cambiar dataset o arquitectura, reiniciar
  useEffect(() => {
    setPoints(generateDataset(datasetType));
    initWeights();
  }, [datasetType, numNeuronsLayer1, numNeuronsLayer2, initWeights]);

  // Forward pass para un punto (x, y)
  const forward = (x: number, y: number) => {
    const { w1, b1, w2, b2, wOut, bOut } = weightsRef.current;
    
    // Capa 1
    const h1Act = activation === 'relu' ? relu : activation === 'tanh' ? tanh : sigmoid;
    const h1: number[] = [];
    for (let j = 0; j < numNeuronsLayer1; j++) {
      let sum = b1[j];
      sum += x * w1[0][j] + y * w1[1][j];
      h1.push(h1Act(sum));
    }

    // Capa 2
    const h2: number[] = [];
    for (let k = 0; k < numNeuronsLayer2; k++) {
      let sum = b2[k];
      for (let j = 0; j < numNeuronsLayer1; j++) {
        sum += h1[j] * w2[j][k];
      }
      h2.push(h1Act(sum));
    }

    // Salida (Sigmoide)
    let outSum = bOut;
    for (let k = 0; k < numNeuronsLayer2; k++) {
      outSum += h2[k] * wOut[k];
    }
    const output = sigmoid(outSum);

    return { h1, h2, output };
  };

  // Paso de entrenamiento: Forward + Backprop + Gradient Descent
  const trainStep = useCallback(() => {
    const { w1, b1, w2, b2, wOut, bOut } = weightsRef.current;
    const lr = learningRate;
    const h1Deriv = activation === 'relu' ? reluDeriv : activation === 'tanh' ? tanhDeriv : sigmoidDeriv;

    let totalLoss = 0;

    // Acumuladores de gradientes
    const gradW1 = Array.from({ length: 2 }, () => Array.from({ length: numNeuronsLayer1 }, () => 0));
    const gradB1 = Array.from({ length: numNeuronsLayer1 }, () => 0);
    const gradW2 = Array.from({ length: numNeuronsLayer1 }, () => Array.from({ length: numNeuronsLayer2 }, () => 0));
    const gradB2 = Array.from({ length: numNeuronsLayer2 }, () => 0);
    const gradWOut = Array.from({ length: numNeuronsLayer2 }, () => 0);
    let gradBOut = 0;

    const N = points.length;
    for (const pt of points) {
      const { h1, h2, output } = forward(pt.x, pt.y);
      const target = pt.label;

      // Binary Cross Entropy Loss
      const loss = -(target * Math.log(Math.max(1e-7, output)) + (1 - target) * Math.log(Math.max(1e-7, 1 - output)));
      totalLoss += loss;

      // dLoss / dOut
      const dOut = (output - target); // Gradiente simplificado de Cross-Entropy + Sigmoid

      // Gradientes capa de salida
      for (let k = 0; k < numNeuronsLayer2; k++) {
        gradWOut[k] += dOut * h2[k];
      }
      gradBOut += dOut;

      // Gradientes capa 2
      const dH2: number[] = [];
      for (let k = 0; k < numNeuronsLayer2; k++) {
        const dh2k = dOut * wOut[k] * h1Deriv(h2[k]);
        dH2.push(dh2k);
        gradB2[k] += dh2k;
        for (let j = 0; j < numNeuronsLayer1; j++) {
          gradW2[j][k] += dh2k * h1[j];
        }
      }

      // Gradientes capa 1
      for (let j = 0; j < numNeuronsLayer1; j++) {
        let sumBack = 0;
        for (let k = 0; k < numNeuronsLayer2; k++) {
          sumBack += dH2[k] * w2[j][k];
        }
        const dh1j = sumBack * h1Deriv(h1[j]);
        gradB1[j] += dh1j;
        gradW1[0][j] += dh1j * pt.x;
        gradW1[1][j] += dh1j * pt.y;
      }
    }

    // Actualización de pesos con Descenso de Gradiente
    for (let j = 0; j < numNeuronsLayer1; j++) {
      w1[0][j] -= (lr * gradW1[0][j]) / N;
      w1[1][j] -= (lr * gradW1[1][j]) / N;
      b1[j] -= (lr * gradB1[j]) / N;
    }
    for (let j = 0; j < numNeuronsLayer1; j++) {
      for (let k = 0; k < numNeuronsLayer2; k++) {
        w2[j][k] -= (lr * gradW2[j][k]) / N;
      }
    }
    for (let k = 0; k < numNeuronsLayer2; k++) {
      b2[k] -= (lr * gradB2[k]) / N;
      wOut[k] -= (lr * gradWOut[k]) / N;
    }
    weightsRef.current.bOut -= (lr * gradBOut) / N;

    const avgLoss = totalLoss / N;
    setCurrentLoss(avgLoss);
    setEpoch((prev) => prev + 1);
    setLossHistory((prev) => [...prev.slice(-40), avgLoss]);

    if (epoch > 0 && epoch % 200 === 0 && onAddXP) {
      onAddXP(10, `Entrenamiento Neuronal #${epoch} Épocas`);
    }
  }, [points, learningRate, activation, numNeuronsLayer1, numNeuronsLayer2, epoch, onAddXP]);

  // Bucle de animación de entrenamiento
  useEffect(() => {
    if (!isTraining) return;
    let animId: number;

    const loop = () => {
      // 5 pasos por fotograma para acelerar
      for (let i = 0; i < 5; i++) {
        trainStep();
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isTraining, trainStep]);

  // Renderizado del Canvas 2D Decision Boundary
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const res = 8; // Tamaño de celda de la cuadrícula de decisión

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // Calcular la probabilidad para cada píxel
    for (let px = 0; px < width; px += res) {
      for (let py = 0; py < height; py += res) {
        const x = (px / width) * 12 - 6;
        const y = -((py / height) * 12 - 6);
        const { output } = forward(x, y);

        // Coloración de la frontera de decisión (Púrpura vs Cyan)
        const r = Math.round(140 * output + 20 * (1 - output));
        const g = Math.round(50 * output + 180 * (1 - output));
        const b = Math.round(240 * output + 220 * (1 - output));
        const a = 160;

        for (let dx = 0; dx < res && px + dx < width; dx++) {
          for (let dy = 0; dy < res && py + dy < height; dy++) {
            const index = ((py + dy) * width + (px + dx)) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Dibujar los ejes coordenados
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Dibujar los puntos del dataset
    for (const pt of points) {
      const px = ((pt.x + 6) / 12) * width;
      const py = ((-pt.y + 6) / 12) * height;

      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
      if (pt.label === 1) {
        ctx.fillStyle = '#C084FC'; // Púrpura brillante
        ctx.strokeStyle = '#FFFFFF';
      } else {
        ctx.fillStyle = '#22D3EE'; // Cyan brillante
        ctx.strokeStyle = '#FFFFFF';
      }
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    }
  }, [points, epoch, numNeuronsLayer1, numNeuronsLayer2, activation]);

  // Renderizado del mini gráfico de pérdida (Loss Curve)
  useEffect(() => {
    const canvas = lossCanvasRef.current;
    if (!canvas || lossHistory.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const maxLoss = 1.0;
    lossHistory.forEach((loss, i) => {
      const x = (i / (lossHistory.length - 1)) * canvas.width;
      const y = canvas.height - (Math.min(maxLoss, loss) / maxLoss) * (canvas.height - 10) - 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [lossHistory]);

  return (
    <div className="space-y-6">
      
      {/* Cabecera del Laboratorio Neuronal */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Simulador de Red Neuronal 2D en Vivo
              </h2>
              <p className="text-xs text-slate-400">
                Ajusta las capas, pesos y funciones de activación para ver cómo la red aprende en tiempo real.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsTraining(!isTraining)}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isTraining
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTraining ? 'Pausar Entrenamiento' : 'Entrenar Red'}</span>
            </button>

            <button
              type="button"
              onClick={initWeights}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Reiniciar Pesos Aleatorios"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Principal: Panel de Control + Canvas de Visualización */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Panel de Hiperparámetros y Dataset (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Selector de Dataset */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4.5 space-y-3">
            <span className="text-xs uppercase font-bold text-purple-300 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              1. Selecciona el Problema (Dataset 2D)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['circle', 'xor', 'moons', 'spiral'] as DatasetType[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDatasetType(d)}
                  className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                    datasetType === d
                      ? 'bg-purple-600 text-white border-purple-400/50 shadow-md shadow-purple-600/25'
                      : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  {d === 'circle' ? 'Círculo concéntrico' : d === 'xor' ? 'Problema XOR' : d === 'moons' ? 'Dos Lunas' : 'Doble Espiral'}
                </button>
              ))}
            </div>
          </div>

          {/* Arquitectura de Capas */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4.5 space-y-4">
            <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              2. Arquitectura de la Red Oculta
            </span>

            {/* Neuronas Capa 1 */}
            <div className="flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-white block">Capa Oculta 1</span>
                <span className="text-slate-400 text-[11px]">{numNeuronsLayer1} Neuronas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={numNeuronsLayer1 <= 1}
                  onClick={() => setNumNeuronsLayer1((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-mono font-bold text-xs text-purple-300">
                  {numNeuronsLayer1}
                </span>
                <button
                  type="button"
                  disabled={numNeuronsLayer1 >= 8}
                  onClick={() => setNumNeuronsLayer1((p) => Math.min(8, p + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Neuronas Capa 2 */}
            <div className="flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-white block">Capa Oculta 2</span>
                <span className="text-slate-400 text-[11px]">{numNeuronsLayer2} Neuronas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={numNeuronsLayer2 <= 1}
                  onClick={() => setNumNeuronsLayer2((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-mono font-bold text-xs text-indigo-300">
                  {numNeuronsLayer2}
                </span>
                <button
                  type="button"
                  disabled={numNeuronsLayer2 >= 8}
                  onClick={() => setNumNeuronsLayer2((p) => Math.min(8, p + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Selector de Activación */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-bold block">Función de Activación:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['tanh', 'relu', 'sigmoid'] as ('tanh' | 'relu' | 'sigmoid')[]).map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => setActivation(act)}
                    className={`py-1.5 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                      activation === act
                        ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider de Tasa de Aprendizaje */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">Tasa de Aprendizaje (LR):</span>
                <span className="font-mono text-purple-400 font-bold">{learningRate}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.30"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

          </div>

        </div>

        {/* Columna Derecha: Canvas de Frontera de Decisión y Gráficas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Medidores de Época y Pérdida */}
            <div className="w-full flex items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Época:</span>
                <span className="font-mono font-black text-purple-300 text-sm">{epoch}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Loss (Error):</span>
                <span className={`font-mono font-black text-sm ${currentLoss < 0.15 ? 'text-emerald-400' : currentLoss < 0.4 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {currentLoss.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Canvas 2D Interactivo */}
            <div className="relative my-4 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-950">
              <canvas
                ref={canvasRef}
                width={360}
                height={360}
                className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] block"
              />
            </div>

            {/* Leyenda de Clases */}
            <div className="flex items-center justify-center gap-6 text-xs font-bold pt-1">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#C084FC] border border-white" />
                <span className="text-purple-300">Clase 1 (Puntos Violetas)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#22D3EE] border border-white" />
                <span className="text-cyan-300">Clase 0 (Puntos Cyan)</span>
              </div>
            </div>

            {/* Mini Gráfico de Pérdida */}
            <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <div className="text-[11px] text-slate-400">
                <span className="font-bold text-amber-400 block">Curva de Pérdida</span>
                <span>Objetivo: Acercar a 0</span>
              </div>
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800">
                <canvas ref={lossCanvasRef} width={180} height={35} className="block" />
              </div>
            </div>

          </div>

          {/* Explicación didáctica socrática */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/25 flex items-start gap-3 text-indigo-200 text-xs leading-relaxed">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-300 block">¿Qué está ocurriendo aquí?</span>
              <p className="mt-0.5">
                La red neuronal está ajustando matrices de pesos con el algoritmo de retropropagación (Backpropagation). El fondo muestra la probabilidad matemática que la red asigna a cada coordenada. Cuantas más capas y neuronas añadas, más compleja y curvada será la frontera de separación que la red puede trazar.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
