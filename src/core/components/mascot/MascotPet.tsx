import React from 'react';
import { MascotSkinId, MascotAnimState, VisemeState } from '../../types/mascot';
import { PixelMascotPet } from './PixelMascotPet';

interface MascotPetProps {
  skinId: MascotSkinId;
  animState: MascotAnimState;
  scale?: number;
  viseme?: VisemeState;
  onClick?: () => void;
  className?: string;
}

export const MascotPet: React.FC<MascotPetProps> = ({
  skinId = 'sparky',
  animState = 'idle',
  scale = 1.2,
  viseme,
  onClick,
  className = ''
}) => {
  return (
    <PixelMascotPet
      skinId={skinId}
      animState={animState}
      scale={scale}
      viseme={viseme}
      onClick={onClick}
      className={className}
    />
  );
};
