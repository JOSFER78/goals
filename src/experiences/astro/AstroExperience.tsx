import React, { useEffect } from 'react';
import { useProgress } from '../../core/context/ProgressContext';

interface AstroExperienceProps {
  onBackToGoals: () => void;
  onOpenProfile: () => void;
}

export const AstroExperience: React.FC<AstroExperienceProps> = ({
  onBackToGoals,
  onOpenProfile
}) => {
  const { finishTest, claimReto, completeStep } = useProgress();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'back-to-goals') {
        onBackToGoals();
      } else if (event.data === 'open-profile') {
        onOpenProfile();
      } else if (event.data && typeof event.data === 'object') {
        const { type, lessonId, score, total, retoId, xp } = event.data;
        if (type === 'TEST_COMPLETED') {
          finishTest(lessonId, score, total);
        } else if (type === 'CLAIM_RETO') {
          claimReto(retoId, xp);
        } else if (type === 'CELESTIAL_RETO_COMPLETED') {
          claimReto(retoId || 'reto_celestial', xp || 100);
        } else if (type === 'STEP_COMPLETED') {
          completeStep(lessonId);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onBackToGoals, onOpenProfile, finishTest, claimReto, completeStep]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-transparent">
      {/* Visor 100% Idéntico a astrolingo.web.app usando el HTML original */}
      <iframe
        src="/astrolingo-app.html"
        title="AstroLingo 3D"
        className="w-full h-full flex-1 border-0 bg-transparent"
      />
    </div>
  );
};

