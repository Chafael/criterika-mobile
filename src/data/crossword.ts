import { cellKey, type GridCell } from './puzzle-grid';

export type CrosswordClue = {
  id: string;
  direction: 'horizontal' | 'vertical';
  start: GridCell;
  label: string;
  definition: string;
  answer: string;
};

export type CrosswordLetters = Record<string, string>;

export function clueCells(clue: CrosswordClue): GridCell[] {
  return Array.from(clue.answer, (_, index) => ({
    row: clue.start.row + (clue.direction === 'vertical' ? index : 0),
    col: clue.start.col + (clue.direction === 'horizontal' ? index : 0),
  }));
}

export function cluesAt(clues: CrosswordClue[], cell: GridCell) {
  const key = cellKey(cell);
  return clues.filter((clue) => clueCells(clue).some((candidate) => cellKey(candidate) === key));
}

export function checkCrossword(clues: CrosswordClue[], letters: CrosswordLetters) {
  const solved: string[] = [];
  const incorrect = new Set<string>();
  let complete = true;
  for (const clue of clues) {
    let correct = true;
    clueCells(clue).forEach((cell, index) => {
      const key = cellKey(cell);
      if (!letters[key]) complete = false;
      if (letters[key] !== clue.answer[index]) {
        correct = false;
        incorrect.add(key);
      }
    });
    if (correct) solved.push(clue.id);
  }
  return { complete, solved, incorrect };
}
