export type GridCell = { row: number; col: number };

export function cellKey({ row, col }: GridCell) {
  return `${row}:${col}`;
}

export function forwardLine(start: GridCell, end: GridCell): GridCell[] {
  if (start.row === end.row && end.col >= start.col) {
    return Array.from({ length: end.col - start.col + 1 }, (_, i) => ({
      row: start.row,
      col: start.col + i,
    }));
  }
  if (start.col === end.col && end.row >= start.row) {
    return Array.from({ length: end.row - start.row + 1 }, (_, i) => ({
      row: start.row + i,
      col: start.col,
    }));
  }
  return [];
}
