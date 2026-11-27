import type { SearchWord } from '@/data/word-search';

/** Figma 08. The placements use zero-based row and column coordinates. */
export const wordSearch = {
  rows: ['DATOSMLP', 'KEBNFRJC', 'HQWYLZXS', 'AUDITARE', 'VINPKMBS', 'LDFCYWNG', 'TAJRVHQO', 'MDXBEUZK'],
  words: [
    { word: 'DATOS', definition: 'Información que un modelo utiliza para aprender y tomar decisiones.', start: { row: 0, col: 0 }, end: { row: 0, col: 4 } },
    { word: 'EQUIDAD', definition: 'Tratar de forma justa a todas las personas, sin ventajas ni desventajas injustificadas para ningún grupo.', start: { row: 1, col: 1 }, end: { row: 7, col: 1 } },
    { word: 'AUDITAR', definition: 'Revisar cómo opera un sistema y evaluar si sus resultados son justos.', start: { row: 3, col: 0 }, end: { row: 3, col: 6 } },
    { word: 'SESGO', definition: 'Una tendencia sistemática que puede favorecer o perjudicar a ciertos grupos.', start: { row: 2, col: 7 }, end: { row: 6, col: 7 } },
  ] satisfies SearchWord[],
};
