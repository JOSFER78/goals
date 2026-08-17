import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ConvolutionKernel } from '../types/aiLabTypes';
import { CONVOLUTION_PRESETS } from '../data/aiLabDilemmasData';
import { 
  Eye, 
  Grid, 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Check, 
  Info, 
  Layers, 
  Maximize2 
} from 'lucide-react';

interface ComputerVisionLabProps {
  onAddXP?: (amount: number, reason: string) => void;
}

// Imagen muestra 16x16 para inspección detallada celda a celda
const SAMPLE_PATTERNS: { name: string; grid: number[][] }[] = [
  {
    name: 'Robot con Ojos',
    grid: [
      [0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0],
      [0, 0, 0, 255, 180, 180, 180, 180, 180, 180, 180, 180, 255, 0, 0, 0],
      [0, 0, 255, 180, 255, 255, 180, 180, 180, 180, 255, 255, 180, 255, 0, 0],
      [0, 255, 180, 180, 255,   0, 180, 180, 180, 180, 255,   0, 180, 180, 255, 0],
      [0, 255, 180, 180, 255,   0, 180, 180, 180, 180, 255,   0, 180, 180, 255, 0],
      [0, 255, 180, 180, 255, 255, 180, 180, 180, 180, 255, 255, 180, 180, 255, 0],
      [0, 255, 180, 180, 180, 180, 180, 255, 255, 180, 180, 180, 180, 180, 255, 0],
      [0, 255, 180, 180, 180, 180, 255, 100, 100, 255, 180, 180, 180, 180, 255, 0],
      [0, 255, 180, 180, 180, 180, 180, 255, 255, 180, 180, 180, 180, 180, 255, 0],
      [0, 255, 180, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 180, 255, 0],
      [0, 255, 180, 255,   0,   0,   0,   0,   0,   0,   0,   0, 255, 180, 255, 0],
      [0, 255, 180, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 180, 255, 0],
      [0, 0, 255, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 255, 0, 0],
      [0, 0, 0, 255, 180, 180, 180, 180, 180, 180, 180, 180, 255, 0, 0, 0],
      [0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  {
    name: 'Cruz y Diagonal',
    grid: Array.from({ length: 16 }, (_, r) =>
      Array.from({ length: 16 }, (_, c) => {
        if (r === 8 || c === 8 || r === c) return 255;
        if (Math.abs(r - 8) <= 2 && Math.abs(c - 8) <= 2) return 180;
        return 0;
      })
    )
  }
];

export const ComputerVisionLab: React.FC<ComputerVisionLabProps> = ({ onAddXP }) => {
  const [selectedPatternIdx, setSelectedPatternIdx] = useState<number>(0);
  const [selectedKernelIdx, setSelectedKernelIdx] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>({ r: 4, c: 5 });

  const currentPattern = SAMPLE_PATTERNS[selectedPatternIdx];
  const currentKernel = CONVOLUTION_PRESETS[selectedKernelIdx];

  const inputGrid = currentPattern.grid;
  const numRows = inputGrid.length;
  const numCols = inputGrid[0].length;

  // Cálculo matemático en vivo de la matriz de convolución
  const outputGrid: number[][] = useMemo(() => {
    const k = currentKernel.matrix;
    const div = currentKernel.divisor || 1;
    const out: number[][] = [];

    for (let r = 0; r < numRows; r++) {
      const row: number[] = [];
      for (let c = 0; c < numCols; c++) {
        // Convolución con padding de ceros
        let sum = 0;
        for (let kr = -1; kr <= 1; kr++) {
          for (let kc = -1; kc <= 1; kc++) {
            const nr = r + kr;
            const nc = c + kc;
            let val = 0;
            if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
              val = inputGrid[nr][nc];
            }
            sum += val * k[kr + 1][kc + 1];
          }
        }
        const finalVal = Math.max(0, Math.min(255, Math.round(sum / div)));
        row.push(finalVal);
      }
      out.push(row);
    }
    return out;
  }, [inputGrid, currentKernel, numRows, numCols]);

  // Desglose del cálculo en la celda seleccionada / hovered
  const hoveredCalc = useMemo(() => {
    if (!hoveredCell) return null;
    const { r, c } = hoveredCell;
    const k = currentKernel.matrix;
    const terms: { pixelVal: number; kernelVal: number; mult: number }[] = [];
    let totalSum = 0;

    for (let kr = -1; kr <= 1; kr++) {
      for (let kc = -1; kc <= 1; kc++) {
        const nr = r + kr;
        const nc = c + kc;
        let pixelVal = 0;
        if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
          pixelVal = inputGrid[nr][nc];
        }
        const kernelVal = k[kr + 1][kc + 1];
        const mult = pixelVal * kernelVal;
        totalSum += mult;
        terms.push({ pixelVal, kernelVal, mult });
      }
    }

    const outputVal = Math.max(0, Math.min(255, Math.round(totalSum / currentKernel.divisor)));
    return { r, c, terms, totalSum, outputVal };
  }, [hoveredCell, inputGrid, currentKernel, numRows, numCols]);

  const handleKernelSelect = (idx: number) => {
    setSelectedKernelIdx(idx);
    if (onAddXP) onAddXP(10, `Filtro de Convolución: ${CONVOLUTION_PRESETS[idx].name}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Laboratorio de Visión Artificial & Convoluciones 3x3
            </h2>
            <p className="text-xs text-slate-400">
              Pasa el ratón sobre cualquier píxel para ver cómo el kernel convolucional multiplica y suma los valores vecinos.
            </p>
          </div>
        </div>
      </div>

      {/* Selectores de Patrones y Kernels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Selector de Patrón de Entrada */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4.5 space-y-3">
          <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5" />
            1. Imagen de Entrada (16×16 Píxeles)
          </span>
          <div className="flex gap-2">
            {SAMPLE_PATTERNS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPatternIdx(idx)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedPatternIdx === idx
                    ? 'bg-emerald-600 text-white border-emerald-400/50 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de Kernel de Convolución 3x3 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4.5 space-y-3">
          <span className="text-xs uppercase font-bold text-purple-300 tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            2. Filtro / Kernel Convolucional 3×3
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {CONVOLUTION_PRESETS.map((k, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleKernelSelect(idx)}
                className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer truncate ${
                  selectedKernelIdx === idx
                    ? 'bg-purple-600 text-white border-purple-400/50 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title={k.description}
              >
                {k.name.split(' ')[0]} {k.name.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Matrices Interactivas: Entrada -> Kernel -> Salida */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 1. Matriz de Entrada (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-4.5 space-y-3 flex flex-col items-center">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Imagen Original (Escala Grises)</span>
            <span className="text-[10px] text-slate-400 font-mono">0 a 255</span>
          </div>

          <div 
            className="grid grid-cols-16 gap-[1px] bg-slate-950 p-2 rounded-2xl border-2 border-slate-800 shadow-xl select-none"
            style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
          >
            {inputGrid.map((row, r) =>
              row.map((val, c) => {
                const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                const isNeighbor = hoveredCell && Math.abs(hoveredCell.r - r) <= 1 && Math.abs(hoveredCell.c - c) <= 1;

                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHoveredCell({ r, c })}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] transition-all cursor-pointer relative ${
                      isHovered
                        ? 'ring-2 ring-purple-400 scale-125 z-20'
                        : isNeighbor
                        ? 'ring-1 ring-cyan-400 z-10'
                        : ''
                    }`}
                    style={{
                      backgroundColor: `rgb(${val}, ${val}, ${val})`
                    }}
                    title={`Píxel (${r}, ${c}): ${val}`}
                  />
                );
              })
            )}
          </div>
          <span className="text-[10px] text-slate-400 text-center">
            Pasa el ratón sobre los píxeles
          </span>
        </div>

        {/* 2. Kernel 3x3 y Cálculo Matemático (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-purple-500/30 rounded-3xl p-4.5 space-y-3">
          <span className="text-xs font-bold text-purple-300 block text-center uppercase tracking-wider">
            Kernel: {currentKernel.name}
          </span>

          {/* Matriz 3x3 visual */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-3 rounded-2xl border border-purple-500/20 max-w-[180px] mx-auto">
            {currentKernel.matrix.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-xs text-purple-200 shadow-sm"
                >
                  {val}
                </div>
              ))
            )}
          </div>

          {/* Desglose de Cálculo celda a celda */}
          {hoveredCalc && (
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300 block text-[11px]">
                Cálculo en Píxel ({hoveredCalc.r}, {hoveredCalc.c}):
              </span>
              <div className="text-[10px] font-mono text-slate-400 max-h-24 overflow-y-auto space-y-0.5 scrollbar-thin">
                {hoveredCalc.terms.map((t, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{t.pixelVal} × {t.kernelVal} =</span>
                    <span className="text-purple-300 font-bold">{t.mult}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white text-xs">
                <span>Suma Convolución:</span>
                <span className="font-mono text-emerald-400">{hoveredCalc.outputVal}</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Matriz de Salida / Feature Map (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-4.5 space-y-3 flex flex-col items-center">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Mapa de Características (Salida)</span>
            <span className="text-[10px] text-emerald-400 font-mono">Filtrado</span>
          </div>

          <div 
            className="grid grid-cols-16 gap-[1px] bg-slate-950 p-2 rounded-2xl border-2 border-slate-800 shadow-xl select-none"
            style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
          >
            {outputGrid.map((row, r) =>
              row.map((val, c) => {
                const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] transition-all relative ${
                      isHovered ? 'ring-2 ring-emerald-400 scale-125 z-20' : ''
                    }`}
                    style={{
                      backgroundColor: `rgb(${val}, ${val}, ${val})`
                    }}
                    title={`Salida (${r}, ${c}): ${val}`}
                  />
                );
              })
            )}
          </div>
          <span className="text-[10px] text-emerald-300 font-medium text-center">
            {currentKernel.description}
          </span>
        </div>

      </div>

    </div>
  );
};
