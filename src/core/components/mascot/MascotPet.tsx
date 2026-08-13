import React, { useRef, useState, useEffect } from 'react';
import { MascotSkinId, MascotAnimState } from '../../types/mascot';
import { MASCOT_SKINS } from '../../config/mascotSkins';

interface MascotPetProps {
  skinId: MascotSkinId;
  animState: MascotAnimState;
  scale?: number;
}

export const MascotPet: React.FC<MascotPetProps> = ({ skinId, animState, scale = 1 }) => {
  const skin = MASCOT_SKINS[skinId] || MASCOT_SKINS.astrobot;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Seguimiento suave del ratón (pupilas)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf: number;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const maxR = 4;
      const clamped = Math.min(dist * 0.02, maxR);
      targetX = clamped * Math.cos(angle);
      targetY = clamped * Math.sin(angle);
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      setEyeOffset({ x: currentX, y: currentY });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    loop();
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const isThinking = animState === 'thinking';
  const isSpeaking = animState === 'speaking';
  const size = 64 * scale;

  const petStyle: React.CSSProperties = {
    width: size,
    height: size,
    filter: `drop-shadow(0 0 ${8 * scale}px ${skin.primaryColor}80)`,
    transition: 'width 0.3s ease, height 0.3s ease, filter 0.3s ease',
    cursor: 'grab',
  };

  return (
    <div ref={containerRef} style={petStyle} className="select-none relative">
      {/* Glow pulsante detrás */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl animate-pulse opacity-40 pointer-events-none"
        style={{ background: skin.primaryColor }}
      />

      {/* SVG del Pet Animado */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10"
        style={{
          animation: `petBounce 2.5s ease-in-out infinite, petBreath 3s ease-in-out infinite`,
        }}
      >
        <style>{`
          @keyframes petBounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes petBreath {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.03); }
          }
          @keyframes blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes wag {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(15deg); }
            75% { transform: rotate(-15deg); }
          }
          @keyframes glow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          @keyframes speak {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(2.5); }
          }
          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(22px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(22px) rotate(-360deg); }
          }
        `}</style>

        {/* ═══ ASTROBOT 🤖 ═══ */}
        {skinId === 'astrobot' && (<>
          {/* Cuerpo */}
          <rect x="25" y="28" width="50" height="42" rx="14" fill="#0B1628" stroke="#00F0FF" strokeWidth="2.5"/>
          {/* Visor */}
          <rect x="30" y="34" width="40" height="22" rx="8" fill="#051520" opacity="0.9"/>
          {/* Ojos con tracking */}
          <circle cx={42 + eyeOffset.x} cy={45 + eyeOffset.y} r="5" fill="#00F0FF" style={{animation: 'blink 4s ease-in-out infinite', transformOrigin: '42px 45px'}}>
            <animate attributeName="opacity" values="1;1;0.8;1" dur="0.15s" begin="3.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx={58 + eyeOffset.x} cy={45 + eyeOffset.y} r="5" fill="#00F0FF" style={{animation: 'blink 4s ease-in-out infinite 0.05s', transformOrigin: '58px 45px'}}/>
          {/* Reflejos de los ojos */}
          <circle cx={40 + eyeOffset.x} cy={43 + eyeOffset.y} r="1.5" fill="white" opacity="0.9"/>
          <circle cx={56 + eyeOffset.x} cy={43 + eyeOffset.y} r="1.5" fill="white" opacity="0.9"/>
          {/* Boca */}
          <rect x="43" y="56" width="14" height={isSpeaking ? "4" : "2"} rx="1" fill="#8B5CF6" style={isSpeaking ? {animation: 'speak 0.3s ease-in-out infinite'} : {}}/>
          {/* Antena */}
          <line x1="50" y1="28" x2="50" y2="16" stroke="#00F0FF" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="50" cy="13" r="4" fill="#8B5CF6" style={{animation: isThinking ? 'glow 0.5s ease infinite' : 'glow 2s ease infinite'}}/>
          {/* Orejas */}
          <rect x="18" y="40" width="7" height="14" rx="3" fill="#00F0FF" opacity="0.8"/>
          <rect x="75" y="40" width="7" height="14" rx="3" fill="#00F0FF" opacity="0.8"/>
          {/* Propulsor */}
          <polygon points="40,70 60,70 50,82" fill="#00F0FF" opacity="0.6" style={{animation: 'glow 1.5s ease infinite'}}/>
          {/* Thinking orbit */}
          {isThinking && <>
            <circle cx="50" cy="45" r="3" fill="#FFD700" style={{animation: 'orbit 1.5s linear infinite', transformOrigin: '50px 45px'}}/>
            <circle cx="50" cy="45" r="2" fill="#FF6B6B" style={{animation: 'orbit 1.5s linear infinite 0.5s', transformOrigin: '50px 45px'}}/>
          </>}
        </>)}

        {/* ═══ BÚHO 🦉 ═══ */}
        {skinId === 'buho' && (<>
          {/* Cuerpo */}
          <ellipse cx="50" cy="55" rx="28" ry="30" fill="#064E3B" stroke="#10B981" strokeWidth="2"/>
          {/* Pechera */}
          <ellipse cx="50" cy="62" rx="16" ry="14" fill="#0D7050" opacity="0.6"/>
          {/* Orejas pluma */}
          <polygon points="28,28 22,10 38,24" fill="#047857"/>
          <polygon points="72,28 78,10 62,24" fill="#047857"/>
          {/* Ojos gigantes */}
          <circle cx="38" cy="46" r="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5"/>
          <circle cx="62" cy="46" r="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5"/>
          {/* Pupilas con tracking */}
          <circle cx={38 + eyeOffset.x} cy={46 + eyeOffset.y} r="5.5" fill="#064E3B" style={{animation: 'blink 5s ease-in-out infinite', transformOrigin: '38px 46px'}}/>
          <circle cx={62 + eyeOffset.x} cy={46 + eyeOffset.y} r="5.5" fill="#064E3B" style={{animation: 'blink 5s ease-in-out infinite 0.1s', transformOrigin: '62px 46px'}}/>
          {/* Reflejos */}
          <circle cx={36 + eyeOffset.x} cy={44 + eyeOffset.y} r="2" fill="white" opacity="0.8"/>
          <circle cx={60 + eyeOffset.x} cy={44 + eyeOffset.y} r="2" fill="white" opacity="0.8"/>
          {/* Monóculo */}
          <circle cx="62" cy="46" r="14" fill="none" stroke="#F59E0B" strokeWidth="2"/>
          <line x1="76" y1="46" x2="84" y2="58" stroke="#F59E0B" strokeWidth="2"/>
          {/* Pico */}
          <polygon points="46,56 54,56 50,64" fill="#F59E0B"/>
          {/* Patas */}
          <ellipse cx="40" cy="84" rx="8" ry="4" fill="#047857"/>
          <ellipse cx="60" cy="84" rx="8" ry="4" fill="#047857"/>
          {isThinking && <circle cx="50" cy="46" r="3" fill="#FFD700" style={{animation: 'orbit 2s linear infinite', transformOrigin: '50px 46px'}}/>}
        </>)}

        {/* ═══ DRAGÓN 🐲 ═══ */}
        {skinId === 'dragon' && (<>
          {/* Cuerpo */}
          <ellipse cx="50" cy="55" rx="26" ry="28" fill="#1E1B4B" stroke="#3B82F6" strokeWidth="2"/>
          {/* Panza */}
          <ellipse cx="50" cy="60" rx="14" ry="15" fill="#2E2870" opacity="0.5"/>
          {/* Cuernos */}
          <path d="M 30 30 Q 22 12 18 22" stroke="#06B6D4" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <path d="M 70 30 Q 78 12 82 22" stroke="#06B6D4" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          {/* Ojos */}
          <circle cx={38 + eyeOffset.x} cy={48 + eyeOffset.y} r="6" fill="#06B6D4" style={{animation: 'glow 2s ease infinite'}}/>
          <circle cx={62 + eyeOffset.x} cy={48 + eyeOffset.y} r="6" fill="#06B6D4" style={{animation: 'glow 2s ease infinite 0.3s'}}/>
          <circle cx={36 + eyeOffset.x} cy={46 + eyeOffset.y} r="2" fill="white" opacity="0.8"/>
          <circle cx={60 + eyeOffset.x} cy={46 + eyeOffset.y} r="2" fill="white" opacity="0.8"/>
          {/* Narinas */}
          <circle cx="44" cy="60" r="2" fill="#0B0520"/>
          <circle cx="56" cy="60" r="2" fill="#0B0520"/>
          {/* Fuego al hablar */}
          {isSpeaking && <>
            <ellipse cx="50" cy="72" rx="6" ry="10" fill="#06B6D4" opacity="0.7" style={{animation: 'speak 0.2s ease infinite'}}/>
            <ellipse cx="50" cy="72" rx="3" ry="6" fill="#38BDF8" opacity="0.9" style={{animation: 'speak 0.15s ease infinite'}}/>
          </>}
          {/* Escamas brillantes */}
          <circle cx="50" cy="34" r="2.5" fill="#3B82F6" style={{animation: 'glow 1.5s ease infinite'}}/>
          <circle cx="42" cy="38" r="2" fill="#6366F1" style={{animation: 'glow 1.5s ease infinite 0.3s'}}/>
          <circle cx="58" cy="38" r="2" fill="#6366F1" style={{animation: 'glow 1.5s ease infinite 0.6s'}}/>
          {/* Cola */}
          <path d="M 76 55 Q 88 50 92 40 Q 95 35 90 32" stroke="#3B82F6" strokeWidth="4" fill="none" strokeLinecap="round" style={{animation: 'wag 2s ease-in-out infinite', transformOrigin: '76px 55px'}}/>
          {isThinking && <circle cx="50" cy="48" r="3" fill="#FFD700" style={{animation: 'orbit 1.2s linear infinite', transformOrigin: '50px 48px'}}/>}
        </>)}

        {/* ═══ GATITO 🐱 ═══ */}
        {skinId === 'gatito' && (<>
          {/* Casco espacial transparente */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.3"/>
          {/* Cabeza */}
          <ellipse cx="50" cy="52" rx="24" ry="22" fill="#2E1065" stroke="#A855F7" strokeWidth="1.5"/>
          {/* Orejas */}
          <polygon points="28,34 22,12 42,26" fill="#A855F7" stroke="#EC4899" strokeWidth="1.5"/>
          <polygon points="72,34 78,12 58,26" fill="#A855F7" stroke="#EC4899" strokeWidth="1.5"/>
          {/* Interior oreja */}
          <polygon points="30,33 26,18 39,28" fill="#EC4899" opacity="0.5"/>
          <polygon points="70,33 74,18 61,28" fill="#EC4899" opacity="0.5"/>
          {/* Ojos */}
          <ellipse cx={40 + eyeOffset.x} cy={48 + eyeOffset.y} rx="5" ry="6.5" fill="#F43F5E" style={{animation: 'blink 3.5s ease-in-out infinite', transformOrigin: '40px 48px'}}/>
          <ellipse cx={60 + eyeOffset.x} cy={48 + eyeOffset.y} rx="5" ry="6.5" fill="#F43F5E" style={{animation: 'blink 3.5s ease-in-out infinite 0.08s', transformOrigin: '60px 48px'}}/>
          {/* Reflejos */}
          <circle cx={38 + eyeOffset.x} cy={46 + eyeOffset.y} r="2" fill="white" opacity="0.9"/>
          <circle cx={58 + eyeOffset.x} cy={46 + eyeOffset.y} r="2" fill="white" opacity="0.9"/>
          {/* Nariz */}
          <polygon points="48,57 52,57 50,60" fill="#EC4899"/>
          {/* Bigotes */}
          <line x1="26" y1="55" x2="38" y2="56" stroke="#EC4899" strokeWidth="1.2" opacity="0.7"/>
          <line x1="26" y1="59" x2="37" y2="58" stroke="#EC4899" strokeWidth="1.2" opacity="0.7"/>
          <line x1="74" y1="55" x2="62" y2="56" stroke="#EC4899" strokeWidth="1.2" opacity="0.7"/>
          <line x1="74" y1="59" x2="63" y2="58" stroke="#EC4899" strokeWidth="1.2" opacity="0.7"/>
          {/* Boca sonriente */}
          <path d="M 44 62 Q 50 67 56 62" fill="none" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Cola */}
          <path d="M 74 58 Q 86 52 88 42 Q 89 36 85 34" stroke="#A855F7" strokeWidth="3.5" fill="none" strokeLinecap="round" style={{animation: 'wag 1.8s ease-in-out infinite', transformOrigin: '74px 58px'}}/>
          {/* Estrellitas del casco */}
          <circle cx="32" cy="30" r="1.5" fill="#EC4899" style={{animation: 'glow 2s ease infinite'}}/>
          <circle cx="68" cy="28" r="1" fill="#A855F7" style={{animation: 'glow 2s ease infinite 0.5s'}}/>
          <circle cx="50" cy="18" r="1.5" fill="#F43F5E" style={{animation: 'glow 2s ease infinite 1s'}}/>
          {isThinking && <circle cx="50" cy="50" r="3" fill="#FFD700" style={{animation: 'orbit 1.5s linear infinite', transformOrigin: '50px 50px'}}/>}
        </>)}
      </svg>
    </div>
  );
};
