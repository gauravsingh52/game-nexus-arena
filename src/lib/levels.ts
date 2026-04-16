export interface LevelInfo {
  level: string;
  minPoints: number;
  maxPoints: number;
  progress: number; // 0-100
  color: string;
  badge: string;
}

const THRESHOLDS = [
  { level: "Beginner", min: 0, max: 1000, color: "text-muted-foreground", badge: "🌱" },
  { level: "Intermediate", min: 1000, max: 5000, color: "text-neon-green", badge: "⚡" },
  { level: "Advanced", min: 5000, max: 15000, color: "text-neon-blue", badge: "🔥" },
  { level: "Expert", min: 15000, max: 50000, color: "text-neon-purple", badge: "💎" },
  { level: "Legend", min: 50000, max: 100000, color: "text-neon-orange", badge: "👑" },
  { level: "Mythic", min: 100000, max: Infinity, color: "text-neon-pink", badge: "🏆" },
];

export const getLevelInfo = (points: number): LevelInfo => {
  const tier = THRESHOLDS.find(t => points >= t.min && points < t.max) ?? THRESHOLDS[THRESHOLDS.length - 1];
  const range = tier.max === Infinity ? 100000 : tier.max - tier.min;
  const progress = Math.min(100, ((points - tier.min) / range) * 100);
  return {
    level: tier.level,
    minPoints: tier.min,
    maxPoints: tier.max,
    progress,
    color: tier.color,
    badge: tier.badge,
  };
};

export const getNextLevel = (points: number): { name: string; pointsNeeded: number } | null => {
  const idx = THRESHOLDS.findIndex(t => points >= t.min && points < t.max);
  if (idx === -1 || idx >= THRESHOLDS.length - 1) return null;
  const next = THRESHOLDS[idx + 1];
  return { name: next.level, pointsNeeded: next.min - points };
};
