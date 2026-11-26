import type { ActivityOutcome } from '@/data/activity';

export type MemoramaCard = {
  id: string;
  pairId: string;
  kind: 'concept' | 'meaning';
  label: string;
};

export type MemoramaContent = {
  cards: readonly MemoramaCard[];
  explanations: Readonly<Record<string, string>>;
  errorLimit: number;
  maxExecutions: number;
};

type Feedback = { kind: 'match'; pairId: string } | { kind: 'miss'; cardIds: string[] };

export type MemoramaState = {
  selectedId: string | null;
  matchedPairs: string[];
  errors: number;
  feedback: Feedback | null;
};

export const initialMemorama: MemoramaState = {
  selectedId: null,
  matchedPairs: [],
  errors: 0,
  feedback: null,
};

export function getMemoramaOutcome(
  content: MemoramaContent,
  state: MemoramaState,
): ActivityOutcome | null {
  if (state.matchedPairs.length * 2 === content.cards.length) return 'passed';
  if (state.errors >= content.errorLimit) return 'failed';
  return null;
}

export function revealMemoramaCard(
  content: MemoramaContent,
  state: MemoramaState,
  card: MemoramaCard,
): MemoramaState {
  if (
    state.selectedId === card.id ||
    state.matchedPairs.includes(card.pairId) ||
    state.feedback?.kind === 'miss' ||
    getMemoramaOutcome(content, state)
  ) {
    return state;
  }

  const first = content.cards.find(({ id }) => id === state.selectedId);
  if (!first) return { ...state, selectedId: card.id };

  if (first.pairId === card.pairId) {
    return {
      ...state,
      selectedId: null,
      matchedPairs: [...state.matchedPairs, card.pairId],
      feedback: { kind: 'match', pairId: card.pairId },
    };
  }
  return {
    ...state,
    selectedId: null,
    errors: state.errors + 1,
    feedback: { kind: 'miss', cardIds: [first.id, card.id] },
  };
}
