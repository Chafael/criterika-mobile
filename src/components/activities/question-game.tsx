import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PuzzleStatus } from '@/components/activities/puzzle-status';
import { PrimaryButton } from '@/components/primary-button';
import type { ActivityGameProps } from '@/data/activity';
import { answerQuestion, type QuestionContent } from '@/data/question';
import CaseIcon from '@/assets/icons/activity/question-case.svg';
import HintIcon from '@/assets/icons/activity/question-hint.svg';
import OptionIcon from '@/assets/icons/activity/question-option.svg';
import SubmitIcon from '@/assets/icons/activity/question-submit.svg';
import ThemeIcon from '@/assets/icons/activity/question-theme.svg';
import { colors, radii, spacing, typography } from '@/theme';

const palette = colors.light;

export function QuestionGame({
  content,
  execution,
  wide,
  onOutcome,
  onResetScroll,
}: ActivityGameProps & { content: QuestionContent }) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string>();
  const [feedback, setFeedback] = useState<ReturnType<typeof answerQuestion>>();
  const question = content.questions[index];

  // Rotate the choices on recovery without changing the answer identifiers.
  const offset = (execution - 1) % question.options.length;
  const options = [...question.options.slice(offset), ...question.options.slice(0, offset)];
  const hint = (
    <View style={[styles.hint, wide && styles.hintWide]}>
      <View style={[styles.icon, styles.hintIcon]}>
        <HintIcon color={palette.textSuccess} />
      </View>
      <View style={styles.copy}>
        <Text style={[typography.overline, styles.secondary]}>Pista</Text>
        <Text style={[typography.caption, styles.ink]}>{question.hint}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, wide && styles.wide]}>
      <View style={[styles.context, wide && styles.wideContext]}>
        <PuzzleStatus
          execution={execution}
          maxExecutions={3}
          limit={`Necesitas ${content.requiredCorrect} de ${content.questions.length} correctas`}
        />
        <View style={styles.summary}>
          <View style={[styles.badge, styles.topic]}>
            <ThemeIcon color={palette.tabActive} />
            <Text style={[typography.overline, styles.secondary]}>Equidad · ACM 1.4</Text>
          </View>
          <Text style={[typography.captionBold, styles.badge, styles.counter]}>
            Pregunta <Text style={typography.title}>{index + 1}</Text> / {content.questions.length}
          </Text>
        </View>
        <View style={styles.case}>
          <View style={styles.heading}>
            <View style={[styles.icon, styles.caseIcon]}>
              <CaseIcon color={palette.tabActive} />
            </View>
            <View style={styles.copy}>
              <Text style={[typography.overline, styles.accent]}>Caso práctico</Text>
              <Text accessibilityRole="header" style={[typography.title, styles.ink]}>
                {question.title}
              </Text>
            </View>
          </View>
          <Text style={[typography.body, styles.secondary]}>{question.prompt}</Text>
          <View style={styles.principle}>
            <View style={styles.dot} />
            <Text style={[typography.caption, styles.secondary]}>{question.principle}</Text>
          </View>
        </View>
        {wide && hint}
      </View>
      <View style={[styles.decisions, wide && styles.wideDecisions]}>
        <View style={styles.summary}>
          <Text style={[typography.overline, styles.secondary]}>Selecciona tu decisión</Text>
          <View style={styles.badge}>
            <OptionIcon color={palette.tabActive} />
            <Text style={[typography.caption, styles.accent]}>1 opción</Text>
          </View>
        </View>
        {options.map((option, position) => {
          const chosen = option.id === selected;
          const correctOption = feedback && option.id === question.correctOption;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: chosen, disabled: !!feedback }}
              disabled={!!feedback}
              key={option.id}
              onPress={() => setSelected(option.id)}
              style={[
                styles.option,
                chosen && styles.selected,
                correctOption && styles.correct,
                chosen && feedback && !feedback.isCorrect && styles.incorrect,
              ]}>
              <Text style={[typography.label, styles.letter]}>
                {String.fromCharCode(65 + position)}
              </Text>
              <Text style={[typography.body, styles.ink, styles.copy]}>{option.label}</Text>
            </Pressable>
          );
        })}
        {!wide && hint}
        {feedback && (
          <View
            accessibilityLiveRegion="polite"
            style={[styles.feedback, feedback.isCorrect && styles.correct]}>
            <Text style={[typography.label, styles.ink]}>
              {feedback.isCorrect ? 'Respuesta correcta' : 'Respuesta incorrecta'}
            </Text>
            <Text style={[typography.body, styles.secondary]}>{question.explanation}</Text>
          </View>
        )}
        <PrimaryButton
          label={
            feedback
              ? feedback.outcome
                ? 'Ver resultado de preguntas'
                : 'Siguiente pregunta'
              : 'Confirmar respuesta'
          }
          disabled={!selected}
          trailing={<SubmitIcon color={palette.onPrimary} />}
          style={styles.submit}
          onPress={() => {
            if (!selected) return;
            if (!feedback) {
              setFeedback(answerQuestion(content, index, correct, selected));
            } else if (feedback.outcome) {
              onOutcome(feedback.outcome);
            } else {
              setCorrect(feedback.totalCorrect);
              setIndex(index + 1);
              setSelected(undefined);
              setFeedback(undefined);
              onResetScroll?.();
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 20 },
  wide: { flexDirection: 'row', gap: 64, alignItems: 'flex-start' },
  context: { gap: spacing.screen },
  wideContext: { flex: 2, gap: 28 },
  decisions: { gap: spacing.md },
  wideDecisions: { flex: 3 },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: { borderRadius: radii.full, flexDirection: 'row', alignItems: 'center', gap: 4 },
  topic: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: palette.surfaceLocked },
  counter: {
    color: palette.tabActive,
    backgroundColor: palette.surfaceCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  case: { backgroundColor: palette.surfaceChip, borderRadius: radii.lg, padding: 24, gap: 10 },
  heading: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: radii.md,
  },
  caseIcon: { backgroundColor: palette.surfaceTrack },
  hintIcon: {
    backgroundColor: palette.successContainer,
    borderRadius: radii.full,
    width: 34,
    height: 34,
  },
  copy: { flex: 1 },
  principle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.success },
  option: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.surfaceRaised,
    minHeight: 66,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.screen,
    backgroundColor: palette.surfaceRaised,
  },
  selected: { borderColor: palette.tabActive, backgroundColor: palette.surfaceCard },
  correct: { backgroundColor: '#EDF2DA', borderColor: palette.success },
  incorrect: { backgroundColor: '#FBEBE4', borderColor: palette.lives },
  letter: {
    minWidth: 32,
    lineHeight: 32,
    borderRadius: radii.xs,
    textAlign: 'center',
    color: palette.textSecondary,
    backgroundColor: palette.surfaceCard,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.screen,
    backgroundColor: palette.surfaceLocked,
    marginTop: spacing.sm,
  },
  hintWide: { marginTop: 12 },
  feedback: {
    gap: 4,
    padding: spacing.screen,
    borderRadius: radii.lg,
    backgroundColor: palette.surfaceCard,
  },
  submit: { marginTop: 12 },
  ink: { color: palette.textPrimary },
  secondary: { color: palette.textSecondary },
  accent: { color: palette.tabActive },
});
