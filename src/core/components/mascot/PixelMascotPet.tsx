import React, { useRef, useEffect } from 'react';
import { MascotSkinId, MascotAnimState, VisemeState } from '../../types/mascot';
import { MASCOT_SKINS } from '../../config/mascotSkins';
import { PixelCanvasEngine } from '../../services/PixelCanvasEngine';

interface PixelMascotPetProps {
  skinId: MascotSkinId;
  animState: MascotAnimState;
  scale?: number;
  viseme?: VisemeState;
  onClick?: () => void;
  className?: string;
}

export const PixelMascotPet: React.FC<PixelMascotPetProps> = ({
  skinId = 'sparky',
  animState = 'idle',
  scale = 1.2,
  viseme,
  onClick,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<PixelCanvasEngine | null>(null);
  const skin = MASCOT_SKINS[skinId] || MASCOT_SKINS.sparky;

  // Multiplicador de escala en píxeles enteros (base 24px)
  const pixelScale = Math.max(2, Math.round(3 * scale));
  const containerSize = 24 * pixelScale;

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new PixelCanvasEngine(canvasRef.current, skinId, pixelScale);
    engine.setAnimState(animState);
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Actualizar skin cuando cambie
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSkin(skinId);
      engineRef.current.setScale(pixelScale);
    }
  }, [skinId, pixelScale]);

  // Actualizar estado de animación
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setAnimState(animState);
    }
  }, [animState]);

  // Actualizar visemas de habla
  useEffect(() => {
    if (engineRef.current && viseme) {
      engineRef.current.setViseme(viseme);
    }
  }, [viseme]);

  return (
    <div
      onClick={onClick}
      style={{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        filter: `drop-shadow(0 0 ${8 * scale}px ${skin.primaryColor}70)`,
        transition: 'filter 0.3s ease',
      }}
      className={`relative select-none flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Halo ambiental suave */}
      <div
        className="absolute inset-2 rounded-full blur-xl opacity-40 pointer-events-none transition-all duration-500"
        style={{ background: skin.primaryColor }}
      />

      {/* Canvas Pixel-Art 2D */}
      <canvas
        ref={canvasRef}
        className="relative z-10 block"
        style={{
          imageRendering: 'pixelated',
          width: `${containerSize}px`,
          height: `${containerSize}px`,
        }}
      />
    </div>
  );
};
