import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { PresentationEngine } from '../../services/PresentationEngine';
import { learnerProfileService } from '../../services/LearnerProfileService';
import { 
  Sparkles, GraduationCap, User, ArrowRight, CheckCircle2, 
  Rocket, Star, BookOpen, Compass
} from 'lucide-react';
import { AVAILABLE_INTERESTS, AVAILABLE_SUBJECTS, AVAILABLE_GRADES } from '../../types/childProfile';

interface InitialOnboardingGateProps {
  onComplete: () => void;
}

export const InitialOnboardingGate: React.FC<InitialOnboardingGateProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { saveChildProfileData, showToast } = useProgress();

  const [name, setName] = useState<string>(user?.displayName || '');
  const [selectedAge, setSelectedAge] = useState<number>(9);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('astrobot');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Espacio y Astronomía 🚀', 'Minecraft 🎮']);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Ciencias Naturales', 'Inglés']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const levelBadge = PresentationEngine.getLevelBadge(selectedAge);
  const educationalStage = PresentationEngine.getEducationalStage(selectedAge);
  const presentationProfile = PresentationEngine.computeProfile(selectedAge);
  const suggestedGrade = levelBadge.label.split(' (')[0];

  const currentGrade = selectedGrade || suggestedGrade;

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleSubject = (subj: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Por favor, escribe tu nombre o apodo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = user?.uid || 'guest';
      const newProfile = learnerProfileService.createProfile({
        userId,
        name: name.trim(),
        age: selectedAge,
        grade: currentGrade,
        avatar: selectedAvatar,
        interests: selectedInterests,
        favoriteSubjects: selectedSubjects,
        learningStyle: selectedAge <= 9 ? 'visual' : 'practico'
      });

      await learnerProfileService.saveProfile(newProfile);

      // Guardar también en contexto global de progreso para sincronización inmediata
      saveChildProfileData({
        childName: name.trim(),
        age: selectedAge,
        grade: currentGrade,
        schoolName: '',
        favoriteSubjects: selectedSubjects,
        weakSubjects: [],
        extracurriculars: ['Robótica y Código 🤖'],
        interests: selectedInterests,
        learningStyle: selectedAge <= 9 ? 'visual' : 'practico',
        avatar: selectedAvatar,
        educationalStage,
        learnerProfile: newProfile
      });

      showToast(`🌟 ¡Perfil creado con éxito! Bienvenido a GOALS, ${name.trim()}.`);
      onComplete();
    } catch (err) {
      console.error('Error guardando perfil:', err);
      showToast('Error al guardar el perfil. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900/95 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-300">
        
        {/* Glow ambiental */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil Educativo Global de GOALS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
            ¡Bienvenido a GOALS! 🚀
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Configura tu perfil de aprendizaje para calibrar el lenguaje, la profundidad y las experiencias a tu nivel escolar.
          </p>
        </div>

        <form onSubmit={handleCompleteOnboarding} className="space-y-5">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>¿Cómo te llamas o cuál es tu apodo?</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Lucas, Sofía, Alex..."
              required
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Selector de Edad Dinámico */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>¿Cuántos años tienes?</span>
              </label>
              <span className="text-sm font-extrabold text-cyan-400 font-mono">
                {selectedAge} años
              </span>
            </div>

            <input
              type="range"
              min={6}
              max={15}
              value={selectedAge}
              onChange={(e) => {
                const newAge = Number(e.target.value);
                setSelectedAge(newAge);
                setSelectedGrade(''); // reset to auto-suggest
              }}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
              <span>6 años</span>
              <span>9 años</span>
              <span>12 años</span>
              <span>15 años</span>
            </div>

            {/* Badge de Etapa Escolar */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${levelBadge.color}`}>
              <div className="space-y-0.5">
                <div className="text-xs font-bold">{levelBadge.label}</div>
                <div className="text-[11px] opacity-80">{levelBadge.stageTitle} • Persona IA: {presentationProfile.aiPersona}</div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-black/30">
                Tramo {presentationProfile.ageTranche}
              </span>
            </div>
          </div>

          {/* Curso Escolar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Curso Escolar (LOMLOE)</span>
            </label>
            <select
              value={currentGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {AVAILABLE_GRADES.map(grade => (
                <option key={grade} value={grade} className="bg-slate-900 text-white">
                  {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Intereses y Pasiones */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>¿Qué temas te apasionan? (Opcional)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin p-1">
              {AVAILABLE_INTERESTS.slice(0, 8).map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/30 border border-indigo-400 text-indigo-200'
                        : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón de Entrada Directa a GOALS */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 hover:opacity-95 active:scale-95 text-white font-bold text-sm shadow-xl shadow-indigo-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Guardando perfil...</span>
            ) : (
              <>
                <span>Entrar a GOALS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
