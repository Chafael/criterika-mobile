import { cellKey, forwardLine, type GridCell } from './puzzle-grid';

export type SearchWord = {
  word: string;
  definition: string;
  start: GridCell;
  end: GridCell;
};

export function checkWord(words: SearchWord[], found: string[], start: GridCell, end: GridCell) {
  if (forwardLine(start, end).length < 2) return { kind: 'invalid' } as const;
  const target = words.find(
    (word) => cellKey(word.start) === cellKey(start) && cellKey(word.end) === cellKey(end),
  );
  if (!target) return { kind: 'miss' } as const;
  if (found.includes(target.word)) return { kind: 'duplicate' } as const;
  return { kind: 'found', target } as const;
}
