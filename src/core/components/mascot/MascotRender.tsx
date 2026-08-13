import React, { useEffect, useRef, useState } from 'react';
import { MascotSkinId, MascotAnimState } from '../../types/mascot';

interface MascotRenderProps {
  skinId: MascotSkinId;
  animState: MascotAnimState;
}

export const MascotRender: React.FC<MascotRenderProps> = ({ skinId, animState }) => {
  const isSpeaking = animState === 'speaking';
  const isThinking = animState === 'thinking';
  const isHovered = animState === 'hover';
  const isDragged = animState === 'dragging';

  // Seguimiento suave del ratón (Eye Tracking por LERP)
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const maxRadius = 5; // Radio máx pupilas en píxeles SVG
      const clamped = Math.min(dist, maxRadius);

      targetX = clamped * Math.cos(angle);
      targetY = clamped * Math.sin(angle);
    };

    const renderLoop = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      setPupilOffset({ x: currentX, y: currentY });
      animFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('pointermove', handlePointerMove);
    renderLoop();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      {/* Halo ambiental resplandeciente */}
      <div 
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
          isThinking ? 'opacity-90 scale-125 animate-pulse' : 'opacity-50'
        }`}
        style={{
          background: skinId === 'astrobot' ? '#00F0FF' :
                      skinId === 'buho' ? '#10B981' :
                      skinId === 'dragon' ? '#3B82F6' : '#EC4899'
        }}
      />

      {/* Partícula Orbital en Estado Thinking */}
      {isThinking && (
        <div className="absolute inset-0 border-2 border-dashed border-white/70 rounded-full animate-spin duration-3000" />
      )}

      {/* Avatar 1: ASTROBOT 🤖 */}
      {skinId === 'astrobot' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,240,255,0.9)]">
          <line x1="50" y1="20" x2="50" y2="8" stroke="#00F0FF" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="6" r="4" fill="#8B5CF6" className={isThinking ? 'animate-ping' : 'animate-pulse'} />

          <rect x="20" y="20" width="60" height="50" rx="16" fill="#0B0F19" stroke="#00F0FF" strokeWidth="3" />
          <rect x="28" y="30" width="44" height="24" rx="8" fill="#051923" />

          {/* Ojos con seguimiento LERP */}
          <g transform={`translate(${pupilOffset.x.toFixed(1)}, ${pupilOffset.y.toFixed(1)})`}>
            {isDragged ? (
              <>
                <circle cx="40" cy="42" r="6" fill="#00F0FF" />
                <circle cx="60" cy="42" r="6" fill="#00F0FF" />
              </>
            ) : isHovered ? (
              <>
                <path d="M 35 44 Q 40 38 45 44" stroke="#00F0FF" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 55 44 Q 60 38 65 44" stroke="#00F0FF" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="40" cy="42" r="4.5" fill="#00F0FF" className={isSpeaking ? 'animate-bounce' : ''} />
                <circle cx="60" cy="42" r="4.5" fill="#00F0FF" className={isSpeaking ? 'animate-bounce' : ''} />
              </>
            )}
          </g>

          <rect 
            x="42" 
            y="58" 
            width="16" 
            height={isSpeaking ? "6" : "2"} 
            rx="1" 
            fill="#8B5CF6" 
            className="transition-all duration-150"
          />

          <polygon points="40,70 60,70 50,85" fill="#00F0FF" className="animate-pulse" opacity="0.8" />
        </svg>
      )}

      {/* Avatar 2: BÚHO SABIO 🦉 */}
      {skinId === 'buho' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">
          <circle cx="50" cy="50" r="34" fill="#064E3B" stroke="#10B981" strokeWidth="3" />
          <polygon points="25,25 35,10 40,30" fill="#047857" />
          <polygon points="75,25 65,10 60,30" fill="#047857" />
          
          <circle cx="38" cy="46" r="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="62" cy="46" r="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />

          <g transform={`translate(${pupilOffset.x.toFixed(1)}, ${pupilOffset.y.toFixed(1)})`}>
            <circle cx="38" cy="46" r="5" fill="#064E3B" />
            <circle cx="62" cy="46" r="5" fill="#064E3B" />
          </g>

          <circle cx="62" cy="46" r="14" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="76" y1="46" x2="84" y2="60" stroke="#F59E0B" strokeWidth="2" />

          <polygon points="46,54 54,54 50,62" fill="#F59E0B" />
        </svg>
      )}

      {/* Avatar 3: DRAGÓN CÓSMICO 🐲 */}
      {skinId === 'dragon' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.9)]">
          <path d="M 30 30 Q 20 15 15 25" stroke="#06B6D4" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 70 30 Q 80 15 85 25" stroke="#06B6D4" strokeWidth="4" fill="none" strokeLinecap="round" />

          <circle cx="50" cy="52" r="32" fill="#1E1B4B" stroke="#3B82F6" strokeWidth="3" />

          <g transform={`translate(${pupilOffset.x.toFixed(1)}, ${pupilOffset.y.toFixed(1)})`}>
            <circle cx="38" cy="48" r="5" fill="#06B6D4" />
            <circle cx="62" cy="48" r="5" fill="#06B6D4" />
          </g>

          {isSpeaking && (
            <path d="M 45 60 Q 50 75 55 60" fill="#06B6D4" className="animate-ping" />
          )}

          <path d="M 46 32 Q 50 28 54 32" stroke="#3B82F6" strokeWidth="2" fill="none" />
        </svg>
      )}

      {/* Avatar 4: GATITO GALÁCTICO 🐱 */}
      {skinId === 'gatito' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]">
          <circle cx="50" cy="50" r="36" fill="rgba(236, 72, 153, 0.2)" stroke="#EC4899" strokeWidth="2" />

          <polygon points="26,30 20,10 40,22" fill="#A855F7" stroke="#EC4899" strokeWidth="2" />
          <polygon points="74,30 80,10 60,22" fill="#A855F7" stroke="#EC4899" strokeWidth="2" />

          <circle cx="50" cy="52" r="24" fill="#2E1065" />

          <g transform={`translate(${pupilOffset.x.toFixed(1)}, ${pupilOffset.y.toFixed(1)})`}>
            <ellipse cx="40" cy="48" rx="4" ry="6" fill="#F43F5E" />
            <ellipse cx="60" cy="48" rx="4" ry="6" fill="#F43F5E" />
          </g>

          <polygon points="48,56 52,56 50,59" fill="#EC4899" />
          <line x1="28" y1="54" x2="36" y2="54" stroke="#EC4899" strokeWidth="1.5" />
          <line x1="64" y1="54" x2="72" y2="54" stroke="#EC4899" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
};
