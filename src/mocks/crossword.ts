import type { CrosswordClue } from '@/data/crossword';

/** Figma 10. EQUIDAD and DATOS share the first D. */
export const crossword = {
  rows: 5,
  columns: 7,
  maxChecks: 3,
  clues: [
    {
      id: '1H',
      direction: 'horizontal',
      start: { row: 0, col: 0 },
      label: 'Trato justo entre grupos',
      definition: 'Trato justo que evita ventajas o desventajas injustificadas entre grupos.',
      answer: 'EQUIDAD',
    },
    {
      id: '2V',
      direction: 'vertical',
      start: { row: 0, col: 4 },
      label: 'Información para aprender',
      definition: 'Lo que aprende un modelo. Si no representa a todos, produce sesgos.',
      answer: 'DATOS',
    },
  ] satisfies CrosswordClue[],
};
