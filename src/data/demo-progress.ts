import { useEffect, useSyncExternalStore } from 'react';

import { mockPlayerStats } from '@/mocks/player';

export const demoMaxLives = 5;
export const lifeInterval = 60 * 60 * 1000;
export const demoLifePackages = [
  { lives: 1, gems: 100 },
  { lives: 3, gems: 150 },
  { lives: 5, gems: 250 },
] as const;

type Progress = {
  lives: number;
  gems: number;
  xp: number;
  streakDays: number;
  lastApproval: string | null;
  nextLifeAt: number | null;
  completed: string[];
  active: number | null;
};

export type LevelReward = { gems: number; xp: number };

const initial: Progress = {
  ...mockPlayerStats,
  xp: 0,
  lastApproval: null,
  nextLifeAt: null,
  completed: [],
  active: null,
};

const players = new Map<string, Progress>();
const listeners = new Set<() => void>();
let nextId = 0;
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

function updatePlayer(player: string, next: Progress) {
  if (getDemoProgress(player) === next) return;
  players.set(player, next);
  listeners.forEach((listener) => listener());
}

export function getDemoProgress(player: string) {
  return players.get(player) ?? initial;
}

export function refreshDemoLives(player: string, now = Date.now()) {
  const progress = getDemoProgress(player);
  if (progress.nextLifeAt === null || now < progress.nextLifeAt) return progress;
  const regenerated = Math.floor((now - progress.nextLifeAt) / lifeInterval) + 1;
  const lives = Math.min(demoMaxLives, progress.lives + regenerated);
  const next = {
    ...progress,
    lives,
    nextLifeAt: lives === demoMaxLives ? null : progress.nextLifeAt + regenerated * lifeInterval,
  };
  updatePlayer(player, next);
  return next;
}

export function useDemoProgress(player: string) {
  const snapshot = () => getDemoProgress(player);
  const progress = useSyncExternalStore(subscribe, snapshot, snapshot);
  useEffect(() => {
    if (progress.nextLifeAt === null) return;
    const timer = setTimeout(
      () => refreshDemoLives(player),
      Math.max(0, progress.nextLifeAt - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [player, progress.nextLifeAt]);
  return progress;
}

export function reserveDemoAttempt(player: string) {
  const progress = refreshDemoLives(player);
  if (progress.active !== null) return { kind: 'busy' } as const;
  if (progress.lives === 0) return { kind: 'no-lives' } as const;
  const id = ++nextId;
  updatePlayer(player, { ...progress, active: id });
  return { kind: 'started', id } as const;
}

export function settleDemoAttempt(
  player: string,
  id: number,
  result: { status: 'lost' } | { status: 'passed'; levelId: string; reward: LevelReward },
  now = Date.now(),
): LevelReward | null {
  const progress = refreshDemoLives(player, now);
  if (progress.active !== id) return null;
  if (result.status === 'lost') {
    updatePlayer(player, {
      ...progress,
      active: null,
      lives: progress.lives - 1,
      nextLifeAt: progress.nextLifeAt ?? now + lifeInterval,
    });
    return null;
  }
  const repeated = progress.completed.includes(result.levelId);
  const reward = repeated ? { gems: 0, xp: 0 } : result.reward;
  const today = new Date(now).toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const streakDays =
    progress.lastApproval === today
      ? progress.streakDays
      : progress.lastApproval === null || progress.lastApproval === yesterday.toDateString()
        ? progress.streakDays + 1
        : 1;
  updatePlayer(player, {
    ...progress,
    active: null,
    gems: progress.gems + reward.gems,
    xp: progress.xp + reward.xp,
    completed: repeated ? progress.completed : [...progress.completed, result.levelId],
    streakDays,
    lastApproval: today,
  });
  return reward;
}

export function purchaseDemoLives(player: string, quantity: number) {
  const pack = demoLifePackages.find(({ lives }) => lives === quantity);
  const progress = refreshDemoLives(player);
  if (!pack || progress.lives + pack.lives > demoMaxLives) return 'limit';
  if (progress.gems < pack.gems) return 'gems';
  const lives = progress.lives + pack.lives;
  updatePlayer(player, {
    ...progress,
    lives,
    gems: progress.gems - pack.gems,
    nextLifeAt: lives === demoMaxLives ? null : progress.nextLifeAt,
  });
  return 'purchased';
}

export function resetDemoProgressForTests() {
  players.clear();
  listeners.forEach((listener) => listener());
}
