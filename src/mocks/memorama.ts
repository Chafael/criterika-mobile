import type { MemoramaContent } from '@/data/memorama';

/** Figma 07 · Sesgo y discriminación. Only the active sample level is playable. */
export const memoramaDemo = {
  levelId: 'u2-n3',
  content: {
    errorLimit: 3,
    maxExecutions: 3,
    cards: [
      { id: 'selection', pairId: 'selection', kind: 'concept', label: 'Sesgo de selección' },
      {
        id: 'selection-meaning',
        pairId: 'selection',
        kind: 'meaning',
        label: 'Datos que no representan a todos',
      },
      { id: 'audit', pairId: 'audit', kind: 'concept', label: 'Auditoría de equidad' },
      {
        id: 'fairness-meaning',
        pairId: 'fairness',
        kind: 'meaning',
        label: 'Mismo trato para casos equivalentes',
      },
      {
        id: 'audit-meaning',
        pairId: 'audit',
        kind: 'meaning',
        label: 'Revisión de decisiones y resultados',
      },
      { id: 'fairness', pairId: 'fairness', kind: 'concept', label: 'Equidad algorítmica' },
    ],
    explanations: {
      selection:
        'El sesgo de selección aparece cuando los datos de entrenamiento dejan fuera a algunos grupos.',
      audit:
        'Una auditoría de equidad compara los resultados de un sistema entre distintos grupos.',
      fairness:
        'La equidad algorítmica ayuda a que el sistema trate de forma justa casos equivalentes.',
    },
  } satisfies MemoramaContent,
};
