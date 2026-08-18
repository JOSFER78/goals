import React, { useRef, useEffect } from 'react';
import { CompanionState } from '../../hooks/useLiveVoiceCompanion';
import { VisemeState } from '../../types/mascot';

interface LiveVoiceVisualizerProps {
  state: CompanionState;
  audioLevel: number;
  frequencyData?: Uint8Array;
  viseme?: VisemeState;
  isV2V?: boolean;
  primaryColor?: string;
  glowColor?: string;
  size?: number;
  children?: React.ReactNode;
}

export const LiveVoiceVisualizer: React.FC<LiveVoiceVisualizerProps> = ({
  state,
  audioLevel,
  frequencyData,
  viseme = { aperture: 0, width: 1, shape: 'rest', intensity: 0 },
  isV2V = false,
  primaryColor = '#F97316',
  glowColor = 'rgba(249, 115, 22, 0.45)',
  size = 140,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef<number>(0);
  const particlesRef = useRef<Array<{ angle: number; distance: number; size: number; speed: number; opacity: number }>>([]);

  useEffect(() => {
    const p = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      p.push({
        angle: (i / count) * Math.PI * 2,
        distance: size * 0.42 + Math.random() * (size * 0.15),
        size: 1.5 + Math.random() * 2.5,
        speed: (Math.random() * 0.02 + 0.01) * (i % 2 === 0 ? 1 : -1),
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
    particlesRef.current = p;
  }, [size]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      phaseRef.current += 0.04;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      const isListening = state === 'listening';
      const isSpeaking = state === 'speaking';
      const isThinking = state === 'thinking';

      // 1. Halo ambiental
      const baseRadius = size * 0.35;
      const dynamicBoost = isListening
        ? audioLevel * (size * 0.25)
        : isSpeaking
          ? viseme.aperture * (size * 0.2)
          : 0;

      const currentRadius = baseRadius + dynamicBoost;

      const grad = ctx.createRadialGradient(cx, cy, baseRadius * 0.4, cx, cy, currentRadius * 1.3);
      grad.addColorStop(0, primaryColor + (isListening || isSpeaking ? '55' : '22'));
      grad.addColorStop(0.7, glowColor);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, currentRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Ondas radiales
      if (isListening || isSpeaking) {
        const ringCount = 3;
        for (let r = 0; r < ringCount; r++) {
          const ringPhase = (phaseRef.current + r * 1.2) % (Math.PI * 2);
          const ringProgress = ringPhase / (Math.PI * 2);
          const ringRadius = baseRadius + ringProgress * (size * 0.3) + dynamicBoost * 0.5;
          const alpha = (1 - ringProgress) * (isListening ? 0.7 : 0.5);

          ctx.strokeStyle = primaryColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 1.5 + (1 - ringProgress) * 2;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 3. Anillo cuántico (Thinking)
      if (isThinking) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(phaseRef.current * 1.5);
        ctx.setLineDash([6, 10]);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Barras de espectro radial
      if (frequencyData && isListening && frequencyData.length > 0) {
        const barCount = 20;
        const step = (Math.PI * 2) / barCount;
        for (let i = 0; i < barCount; i++) {
          const val = frequencyData[i % frequencyData.length] / 255;
          const barHeight = val * (size * 0.22) + 2;
          const angle = i * step + phaseRef.current * 0.2;

          const startX = cx + Math.cos(angle) * (baseRadius + 4);
          const startY = cy + Math.sin(angle) * (baseRadius + 4);
          const endX = cx + Math.cos(angle) * (baseRadius + 4 + barHeight);
          const endY = cy + Math.sin(angle) * (baseRadius + 4 + barHeight);

          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }

      // 5. Partículas orbitales
      particlesRef.current.forEach((p) => {
        const speedMultiplier = isListening ? 1 + audioLevel * 3 : isSpeaking ? 1.8 : isThinking ? 2.5 : 0.8;
        p.angle += p.speed * speedMultiplier;
        const rad = p.distance + (isListening ? audioLevel * 15 : 0);

        const px = cx + Math.cos(p.angle) * rad;
        const py = cy + Math.sin(p.angle) * rad;

        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(px, py, p.size * (isListening || isSpeaking ? 1.3 : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [state, audioLevel, frequencyData, viseme, primaryColor, glowColor, size]);

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
