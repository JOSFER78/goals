/**
 * src/core/components/mascot/SpatialFlightOverlay.tsx
 * Canvas Overlay para Renderizado de Estelas de Partículas Stardust
 */

import React, { useRef, useEffect } from 'react';
import { Particle } from '../../services/mascotFlightPhysics';

interface SpatialFlightOverlayProps {
  particles: Particle[];
  isFlying: boolean;
}

export const SpatialFlightOverlay: React.FC<SpatialFlightOverlayProps> = ({
  particles,
  isFlying
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particles.length === 0 && !isFlying) return;

    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }, [particles, isFlying]);

  if (!isFlying && particles.length === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-300"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
