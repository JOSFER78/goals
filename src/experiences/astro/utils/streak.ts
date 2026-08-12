export function getTodayString(): string {
  return new Date().toDateString();
}

export function checkStreak(lastDay: string | null, currentStreak: number): { streak: number; lastDay: string } {
  const today = getTodayString();
  if (lastDay === today) {
    return { streak: currentStreak, lastDay: today };
  }
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const streak = lastDay === yesterday ? currentStreak + 1 : 1;
  return { streak, lastDay: today };
}

export function getAstronautRank(xp: number): { title: string; icon: string; badgeColor: string } {
  if (xp >= 600) {
    return { title: 'Capitán Intergaláctico', icon: '🌌', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30' };
  }
  if (xp >= 300) {
    return { title: 'Comandante Artemis', icon: '🚀', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' };
  }
  if (xp >= 100) {
    return { title: 'Explorador de Órbita', icon: '🛰️', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30' };
  }
  return { title: 'Recluta Espacial', icon: '🧑‍🚀', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30' };
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
