import { useDemoProgress } from '@/data/demo-progress';
import { useDemoPlayer } from '@/data/level-path';

export type PlayerStats = {
  lives: number;
  gems: number;
  streakDays: number;
};

/** Player counters shown in the header. */
export function usePlayerStats(): PlayerStats {
  const { lives, gems, streakDays, active } = useDemoProgress(useDemoPlayer());
  return { lives: lives - Number(active !== null), gems, streakDays };
}
