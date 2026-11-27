import { mockLevelPath } from '@/mocks/level-path';
import { useDemoProgress } from '@/data/demo-progress';
import { useSession } from '@/data/session';

export type LevelStatus = 'completed' | 'active' | 'locked';

export type Level = {
  id: string;
  number: number;
  title: string;
  status: LevelStatus;
  playable?: boolean;
  final?: boolean;
};

export type LevelPreview = {
  levelId: string;
  activities: string[];
  rewardGems: number;
  rewardXp: number;
};

export type UnitClosing = {
  id: string;
  title: string;
  cardName: string;
  badge: string;
  status: LevelStatus;
  playable?: boolean;
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

export const demoClosingId = 'u2-final';

export function findPathLevel(path: LevelPath, id: string) {
  return (
    path.levels.find((level) => level.id === id) ??
    (id === path.closing.id ? toClosingLevel(path) : undefined)
  );
}

export function toClosingLevel(path: LevelPath): Level {
  return { ...path.closing, number: path.levels.length + 1, final: true };
}

export function useDemoPlayer() {
  return useSession()?.email ?? '';
}

/** Apply approvals from the demo session to the sample unit. */
export function useLevelPath(): LevelPath {
  const { completed } = useDemoProgress(useDemoPlayer());
  let canStart = true;
  const levels = mockLevelPath.levels.map((level): Level => {
    if (level.status === 'completed' || completed.includes(level.id))
      return { ...level, status: 'completed' };
    const next = { ...level, status: canStart ? 'active' : 'locked' } as const;
    canStart = false;
    return next;
  });
  const closing: UnitClosing = {
    ...mockLevelPath.closing,
    status: completed.includes(demoClosingId) ? 'completed' : canStart ? 'active' : 'locked',
  };
  return { ...mockLevelPath, levels, closing };
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
