import { mockPlayerStats } from '@/mocks/player';

export type PlayerStats = {
  lives: number;
  gems: number;
  streakDays: number;
};

/**
 * Player counters shown in the header.
 * Returns mock data for now; replace the body with the backend call
 * without changing the screens that consume it.
 */
export function usePlayerStats(): PlayerStats {
  return mockPlayerStats;
}
