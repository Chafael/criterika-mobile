import { mockLevelPath } from '@/mocks/level-path';

export type LevelStatus = 'completed' | 'active' | 'locked';

export type Level = {
  id: string;
  number: number;
  title: string;
  status: LevelStatus;
};

export type LevelPreview = {
  levelId: string;
  activities: string[];
  rewardGems: number;
  rewardXp: number;
};

export type UnitClosing = {
  title: string;
  cardName: string;
  badge: string;
  status: LevelStatus;
};

export type LevelPath = {
  unit: {
    number: number;
    title: string;
    description: string;
  };
  levels: Level[];
  closing: UnitClosing;
  nextUnitTitle: string;
  mascotMessage: string;
  previews: LevelPreview[];
};

/**
 * Level path of the current unit.
 * Returns mock data for now; replace the body with the backend call
 * without changing the screen.
 */
export function useLevelPath(): LevelPath {
  return mockLevelPath;
}

/**
 * Unit progress as shown in 1:444: the closing node counts as one more
 * level, so 4 levels + closing = 5.
 */
export function getUnitProgress(path: Pick<LevelPath, 'levels' | 'closing'>): {
  completed: number;
  total: number;
} {
  const statuses = [...path.levels.map((level) => level.status), path.closing.status];
  return {
    completed: statuses.filter((status) => status === 'completed').length,
    total: statuses.length,
  };
}
