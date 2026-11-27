/** An activity reports its result to the level that runs it. */
export type ActivityOutcome = 'passed' | 'failed';

export type ActivityGameProps = {
  wide: boolean;
  index: number;
  execution: number;
  onOutcome: (result: ActivityOutcome) => void;
  onResetScroll?: () => void;
};
