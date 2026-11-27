import type { ActivityOutcome } from '@/data/activity';

export const levelActivityNames = [
  'Memorama',
  'Sopa de letras',
  'Preguntas',
  'Crucigrama',
  'Relacionar',
] as const;

export type ActivityName = (typeof levelActivityNames)[number];

export type AttemptActivity = { name: ActivityName; execution: number };

export type LevelAttempt = {
  pending: AttemptActivity[];
  completed: number;
  failure: boolean;
};

export const maxExecutions = 3;

export function newLevelAttempt(): LevelAttempt {
  return {
    pending: levelActivityNames.map((name) => ({ name, execution: 1 })),
    completed: 0,
    failure: false,
  };
}

export function finishActivity(attempt: LevelAttempt, outcome: ActivityOutcome): LevelAttempt {
  const [current, ...pending] = attempt.pending;
  if (!current || attempt.failure) return attempt;
  if (outcome === 'passed') {
    return { pending, completed: attempt.completed + 1, failure: false };
  }
  if (current.execution >= maxExecutions) {
    return { pending: [], completed: attempt.completed, failure: true };
  }
  return {
    pending: [...pending, { ...current, execution: current.execution + 1 }],
    completed: attempt.completed,
    failure: false,
  };
}
