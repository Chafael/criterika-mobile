export type Question = {
  id: string;
  title: string;
  prompt: string;
  principle: string;
  hint: string;
  options: { id: string; label: string }[];
  correctOption: string;
  explanation: string;
};

export type QuestionContent = { questions: Question[]; requiredCorrect: number };

export function answerQuestion(
  content: QuestionContent,
  index: number,
  correct: number,
  option: string,
) {
  const question = content.questions[index];
  const isCorrect = option === question.correctOption;
  const totalCorrect = correct + Number(isCorrect);
  const last = index + 1 === content.questions.length;
  const outcome = last ? (totalCorrect >= content.requiredCorrect ? 'passed' : 'failed') : null;
  return { isCorrect, totalCorrect, outcome } as const;
}
