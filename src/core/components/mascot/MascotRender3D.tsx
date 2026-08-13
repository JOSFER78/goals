import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { MascotSkinId, MascotAnimState } from '../../types/mascot';
import { MASCOT_SKINS } from '../../config/mascotSkins';

// ─── Utilidad: vector normalizado del ratón ───
const useMousePosition = () => {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return mouse;
};

// ─── Toon Gradient Map (cartoon shading) ───
const useToonGradient = () => {
  return useMemo(() => {
    const colors = new Uint8Array([80, 160, 240]);
    const tex = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
};

// ═══════════════════════════════════════════════
// ASTROBOT 🤖 — Robot Espacial STEM
// ═══════════════════════════════════════════════
const AstroBotModel: React.FC<{ animState: MascotAnimState }> = ({ animState }) => {
  const headRef = useRef<THREE.Group>(null!);
  const eyeLRef = useRef<THREE.Mesh>(null!);
  const eyeRRef = useRef<THREE.Mesh>(null!);
  const antennaRef = useRef<THREE.Mesh>(null!);
  const mouthRef = useRef<THREE.Mesh>(null!);
  const mouse = useMousePosition();
  const gradientMap = useToonGradient();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Respiración
    if (headRef.current) {
      headRef.current.scale.y = 1 + Math.sin(t * 2) * 0.02;
    }

    // Seguimiento del ratón con la cabeza
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.current.x * 0.4, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.current.y * 0.2, 0.08);
    }

    // Pupilas siguen el ratón
    const pupilOffset = 0.06;
    if (eyeLRef.current) {
      eyeLRef.current.position.x = -0.25 + mouse.current.x * pupilOffset;
      eyeLRef.current.position.y = 0.15 + mouse.current.y * pupilOffset;
    }
    if (eyeRRef.current) {
      eyeRRef.current.position.x = 0.25 + mouse.current.x * pupilOffset;
      eyeRRef.current.position.y = 0.15 + mouse.current.y * pupilOffset;
    }

    // Antena pulsante
    if (antennaRef.current) {
      const scale = animState === 'thinking' ? 1.4 + Math.sin(t * 8) * 0.4 : 1 + Math.sin(t * 3) * 0.15;
      antennaRef.current.scale.setScalar(scale);
    }

    // Boca animada en speaking
    if (mouthRef.current) {
      const mouthScale = animState === 'speaking' ? 1 + Math.sin(t * 12) * 0.5 : 1;
      mouthRef.current.scale.y = mouthScale;
    }
  });

  return (
    <group ref={headRef}>
      {/* Cabeza — Cubo redondeado metálico */}
      <RoundedBox args={[1.1, 0.9, 0.8]} radius={0.18} smoothness={4}>
        <meshToonMaterial color="#0B1628" gradientMap={gradientMap} />
      </RoundedBox>

      {/* Visor (pantalla de la cara) */}
      <RoundedBox args={[0.85, 0.5, 0.05]} radius={0.1} smoothness={4} position={[0, 0.05, 0.39]}>
        <meshStandardMaterial color="#051520" metalness={0.6} roughness={0.3} />
      </RoundedBox>

      {/* Ojos LED — Esferas glowing */}
      <mesh ref={eyeLRef} position={[-0.25, 0.15, 0.43]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={2} />
      </mesh>
      <mesh ref={eyeRRef} position={[0.25, 0.15, 0.43]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={2} />
      </mesh>

      {/* Boca LED */}
      <mesh ref={mouthRef} position={[0, -0.12, 0.43]}>
        <boxGeometry args={[0.3, 0.04, 0.02]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={1.5} />
      </mesh>

      {/* Antena */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshToonMaterial color="#00F0FF" gradientMap={gradientMap} />
      </mesh>
      <mesh ref={antennaRef} position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={3} />
      </mesh>

      {/* Orejas laterales */}
      <mesh position={[-0.62, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.2, 0.15]} />
        <meshToonMaterial color="#00F0FF" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0.62, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.2, 0.15]} />
        <meshToonMaterial color="#00F0FF" gradientMap={gradientMap} />
      </mesh>

      {/* Propulsor inferior */}
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.2, 0.25, 8]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1.5} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════════════════
// BÚHO SABIO 🦉 — Tutor Didáctico
// ═══════════════════════════════════════════════
const BuhoModel: React.FC<{ animState: MascotAnimState }> = ({ animState }) => {
  const headRef = useRef<THREE.Group>(null!);
  const pupilLRef = useRef<THREE.Mesh>(null!);
  const pupilRRef = useRef<THREE.Mesh>(null!);
  const mouse = useMousePosition();
  const gradientMap = useToonGradient();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (headRef.current) {
      headRef.current.scale.y = 1 + Math.sin(t * 1.8) * 0.025;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.current.x * 0.35, 0.06);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.current.y * 0.15, 0.06);
    }

    const pupilOff = 0.05;
    if (pupilLRef.current) {
      pupilLRef.current.position.x = -0.28 + mouse.current.x * pupilOff;
      pupilLRef.current.position.y = 0.12 + mouse.current.y * pupilOff;
    }
    if (pupilRRef.current) {
      pupilRRef.current.position.x = 0.28 + mouse.current.x * pupilOff;
      pupilRRef.current.position.y = 0.12 + mouse.current.y * pupilOff;
    }
  });

  return (
    <group ref={headRef}>
      {/* Cuerpo — Esfera grande */}
      <mesh>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshToonMaterial color="#064E3B" gradientMap={gradientMap} />
      </mesh>

      {/* Orejas de pluma */}
      <mesh position={[-0.4, 0.55, 0]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.12, 0.35, 4]} />
        <meshToonMaterial color="#047857" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0.4, 0.55, 0]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.12, 0.35, 4]} />
        <meshToonMaterial color="#047857" gradientMap={gradientMap} />
      </mesh>

      {/* Ojos grandes */}
      <mesh position={[-0.28, 0.12, 0.45]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#FEF3C7" />
      </mesh>
      <mesh position={[0.28, 0.12, 0.45]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#FEF3C7" />
      </mesh>

      {/* Pupilas */}
      <mesh ref={pupilLRef} position={[-0.28, 0.12, 0.58]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#064E3B" />
      </mesh>
      <mesh ref={pupilRRef} position={[0.28, 0.12, 0.58]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#064E3B" />
      </mesh>

      {/* Monóculo */}
      <mesh position={[0.28, 0.12, 0.4]}>
        <torusGeometry args={[0.2, 0.015, 8, 24]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pico */}
      <mesh position={[0, -0.08, 0.55]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.08, 0.15, 3]} />
        <meshToonMaterial color="#F59E0B" gradientMap={gradientMap} />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════════════════
// DRAGÓN CÓSMICO 🐲 — Guía de Metas
// ═══════════════════════════════════════════════
const DragonModel: React.FC<{ animState: MascotAnimState }> = ({ animState }) => {
  const headRef = useRef<THREE.Group>(null!);
  const eyeLRef = useRef<THREE.Mesh>(null!);
  const eyeRRef = useRef<THREE.Mesh>(null!);
  const mouse = useMousePosition();
  const gradientMap = useToonGradient();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (headRef.current) {
      headRef.current.scale.y = 1 + Math.sin(t * 1.5) * 0.03;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.current.x * 0.5, 0.07);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.current.y * 0.2, 0.07);
    }

    const off = 0.05;
    if (eyeLRef.current) {
      eyeLRef.current.position.x = -0.22 + mouse.current.x * off;
      eyeLRef.current.position.y = 0.1 + mouse.current.y * off;
    }
    if (eyeRRef.current) {
      eyeRRef.current.position.x = 0.22 + mouse.current.x * off;
      eyeRRef.current.position.y = 0.1 + mouse.current.y * off;
    }
  });

  return (
    <group ref={headRef}>
      {/* Cabeza */}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshToonMaterial color="#1E1B4B" gradientMap={gradientMap} />
      </mesh>

      {/* Cuernos */}
      <mesh position={[-0.35, 0.5, -0.1]} rotation={[0.2, 0, 0.5]}>
        <coneGeometry args={[0.06, 0.4, 6]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.35, 0.5, -0.1]} rotation={[0.2, 0, -0.5]}>
        <coneGeometry args={[0.06, 0.4, 6]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={1.5} />
      </mesh>

      {/* Ojos de constelación */}
      <mesh ref={eyeLRef} position={[-0.22, 0.1, 0.45]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={2.5} />
      </mesh>
      <mesh ref={eyeRRef} position={[0.22, 0.1, 0.45]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={2.5} />
      </mesh>

      {/* Escamas */}
      <mesh position={[0, 0.35, 0.35]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.12, 0.38, 0.3]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.12, 0.38, 0.3]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={1} />
      </mesh>

      {/* Hocico */}
      <mesh position={[0, -0.15, 0.42]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshToonMaterial color="#2E1B6B" gradientMap={gradientMap} />
      </mesh>

      {/* Fosas nasales */}
      <mesh position={[-0.06, -0.1, 0.58]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#0B0520" />
      </mesh>
      <mesh position={[0.06, -0.1, 0.58]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#0B0520" />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════════════════
// GATITO GALÁCTICO 🐱 — Compañero de Idiomas
// ═══════════════════════════════════════════════
const GatitoModel: React.FC<{ animState: MascotAnimState }> = ({ animState }) => {
  const headRef = useRef<THREE.Group>(null!);
  const eyeLRef = useRef<THREE.Mesh>(null!);
  const eyeRRef = useRef<THREE.Mesh>(null!);
  const earLRef = useRef<THREE.Mesh>(null!);
  const earRRef = useRef<THREE.Mesh>(null!);
  const mouse = useMousePosition();
  const gradientMap = useToonGradient();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (headRef.current) {
      headRef.current.scale.y = 1 + Math.sin(t * 2.2) * 0.02;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.current.x * 0.45, 0.09);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.current.y * 0.15, 0.09);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, mouse.current.x * 0.08, 0.05);
    }

    // Orejas reactivas
    if (earLRef.current) {
      earLRef.current.rotation.z = 0.35 + Math.sin(t * 3) * 0.08;
    }
    if (earRRef.current) {
      earRRef.current.rotation.z = -0.35 + Math.sin(t * 3 + 0.5) * 0.08;
    }

    const off = 0.06;
    if (eyeLRef.current) {
      eyeLRef.current.position.x = -0.2 + mouse.current.x * off;
      eyeLRef.current.position.y = 0.08 + mouse.current.y * off;
    }
    if (eyeRRef.current) {
      eyeRRef.current.position.x = 0.2 + mouse.current.x * off;
      eyeRRef.current.position.y = 0.08 + mouse.current.y * off;
    }
  });

  return (
    <group ref={headRef}>
      {/* Casco espacial transparente */}
      <mesh>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color="#EC4899" transparent opacity={0.12} roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Cabeza */}
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshToonMaterial color="#2E1065" gradientMap={gradientMap} />
      </mesh>

      {/* Orejas triangulares */}
      <mesh ref={earLRef} position={[-0.35, 0.5, 0]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.15, 0.35, 3]} />
        <meshToonMaterial color="#A855F7" gradientMap={gradientMap} />
      </mesh>
      <mesh ref={earRRef} position={[0.35, 0.5, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.15, 0.35, 3]} />
        <meshToonMaterial color="#A855F7" gradientMap={gradientMap} />
      </mesh>

      {/* Interior oreja */}
      <mesh position={[-0.35, 0.48, 0.05]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.08, 0.2, 3]} />
        <meshToonMaterial color="#EC4899" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0.35, 0.48, 0.05]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.08, 0.2, 3]} />
        <meshToonMaterial color="#EC4899" gradientMap={gradientMap} />
      </mesh>

      {/* Ojos grandes */}
      <mesh ref={eyeLRef} position={[-0.2, 0.08, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#F43F5E" emissive="#F43F5E" emissiveIntensity={1.8} />
      </mesh>
      <mesh ref={eyeRRef} position={[0.2, 0.08, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#F43F5E" emissive="#F43F5E" emissiveIntensity={1.8} />
      </mesh>

      {/* Nariz */}
      <mesh position={[0, -0.06, 0.48]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#EC4899" />
      </mesh>

      {/* Bigotes */}
      {[-1, 1].map(side => (
        <React.Fragment key={side}>
          <mesh position={[side * 0.22, -0.04, 0.42]} rotation={[0, 0, side * 0.15]}>
            <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
            <meshStandardMaterial color="#EC4899" />
          </mesh>
          <mesh position={[side * 0.24, -0.08, 0.4]} rotation={[0, 0, side * 0.3]}>
            <cylinderGeometry args={[0.005, 0.005, 0.25, 4]} />
            <meshStandardMaterial color="#EC4899" />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};

// ═══════════════════════════════════════════════
// COMPONENTE PRINCIPAL: MascotRender3D
// ═══════════════════════════════════════════════
interface MascotRender3DProps {
  skinId: MascotSkinId;
  animState: MascotAnimState;
  scale?: number;
}

export const MascotRender3D: React.FC<MascotRender3DProps> = ({ skinId, animState, scale = 1 }) => {
  const skin = MASCOT_SKINS[skinId] || MASCOT_SKINS.astrobot;
  const glowColor = skin.primaryColor;

  return (
    <div 
      style={{ 
        width: `${64 * scale}px`, 
        height: `${64 * scale}px`,
        minWidth: '48px',
        minHeight: '48px',
        filter: `drop-shadow(0 0 ${12 * scale}px ${glowColor})`,
        transition: 'width 0.3s, height 0.3s, filter 0.3s',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        frameloop="always"
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 3, 4]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-2, 1, 2]} intensity={0.4} color={glowColor} />
        <pointLight position={[0, -1, 2]} intensity={0.3} color={glowColor} />

        {/* Flotación orgánica viva */}
        <Float 
          speed={animState === 'thinking' ? 4 : 2} 
          rotationIntensity={animState === 'hover' ? 0.6 : 0.2} 
          floatIntensity={animState === 'speaking' ? 0.8 : 0.5}
        >
          {skinId === 'astrobot' && <AstroBotModel animState={animState} />}
          {skinId === 'buho' && <BuhoModel animState={animState} />}
          {skinId === 'dragon' && <DragonModel animState={animState} />}
          {skinId === 'gatito' && <GatitoModel animState={animState} />}
        </Float>
      </Canvas>
    </div>
  );
};
