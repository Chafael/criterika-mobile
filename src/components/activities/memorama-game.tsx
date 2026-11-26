import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import type { ActivityOutcome } from '@/data/activity';
import {
  getMemoramaOutcome,
  initialMemorama,
  revealMemoramaCard,
  type MemoramaContent,
} from '@/data/memorama';
import { images } from '@/media';
import { activityIcons } from '@/media/activity';
import { colors, radii, sheetColors, spacing, typography } from '@/theme';

const palette = colors.light;
const backs = [
  activityIcons.Shield,
  activityIcons.Book,
  activityIcons.Puzzle,
  activityIcons.VerifiedShield,
  activityIcons.Book,
  activityIcons.Shield,
];

export function MemoramaGame({
  content,
  execution,
  wide,
  onOutcome,
}: {
  content: MemoramaContent;
  execution: number;
  wide: boolean;
  onOutcome: (outcome: ActivityOutcome) => void;
}) {
  const [state, setState] = useState(initialMemorama);
  const { feedback } = state;
  const outcome = getMemoramaOutcome(content, state);
  const total = content.cards.length / 2;
  const found = state.matchedPairs.length;
  const offset = (execution - 1) % content.cards.length;
  const cards = [...content.cards.slice(offset), ...content.cards.slice(0, offset)];

  const proceed = () => {
    if (outcome) {
      onOutcome(outcome);
    } else {
      setState((current) => ({ ...current, feedback: null }));
    }
  };

  const notice = feedback ? (
    <View accessibilityLiveRegion="polite" style={styles.feedback}>
      <View style={[styles.feedbackIcon, feedback.kind === 'miss' && styles.revealMark]}>
        {feedback.kind === 'match' ? (
          <activityIcons.Success color={palette.textSuccess} />
        ) : (
          <activityIcons.Limit color={palette.tabActive} />
        )}
      </View>
      <Text style={[typography.body, styles.flex]}>
        {feedback.kind === 'match' ? (
          <>
            <Text style={[typography.captionBold, styles.successText]}>Acierto registrado: </Text>
            {content.explanations[feedback.pairId]}
          </>
        ) : (
          'Las cartas no forman pareja. Continúa para volver a cubrirlas.'
        )}
      </Text>
    </View>
  ) : null;

  return (
    <View style={[styles.game, wide && styles.columns]}>
      <View style={[styles.context, wide && styles.contextWide]}>
        <View style={styles.status}>
          <View style={[styles.chip, styles.execution]}>
            <activityIcons.Execution color={sheetColors.body} />
            <Text style={[typography.chip, styles.secondary]}>
              Ejecución {execution} de {content.maxExecutions}
            </Text>
          </View>
          <View style={[styles.chip, styles.limit]}>
            <activityIcons.Limit color={sheetColors.title} />
            <Text style={[typography.chip, styles.title]}>
              Errores: {state.errors} de {content.errorLimit}
            </Text>
          </View>
        </View>
        <View style={styles.status}>
          <View style={[styles.chip, styles.type]}>
            <activityIcons.Puzzle color={palette.tabActive} />
            <Text style={[typography.chip, styles.goldText]}>Memorama</Text>
          </View>
          <View style={styles.inline}>
            <activityIcons.Progress color={palette.textSuccess} />
            <Text style={[typography.label, styles.secondary]}>
              {found} de {total} pares encontrados
            </Text>
          </View>
        </View>
        <View style={styles.prompt}>
          <View style={styles.promptIcon}>
            <activityIcons.Concept color={palette.onPrimary} />
          </View>
          <View style={styles.flex}>
            <Text accessibilityRole="header" style={[typography.title, styles.title]}>
              Asocia los conceptos de equidad
            </Text>
            <Text style={[typography.body, styles.secondary]}>
              Encuentra los pares entre cada concepto y su significado.
            </Text>
          </View>
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Pares encontrados"
          accessibilityValue={{ min: 0, max: total, now: found }}
          style={styles.track}>
          <View style={[styles.fill, { width: `${(found / total) * 100}%` }]} />
        </View>
        <View style={styles.topic}>
          <View style={styles.flex}>
            <Text style={[typography.overline, styles.successText]}>Equidad algorítmica</Text>
            <Text style={[typography.button, styles.title]}>Sesgo y{'\n'}discriminación</Text>
          </View>
          <Image source={images.mascotaIdea} resizeMode="contain" style={styles.mascot} />
        </View>
        {wide ? notice : null}
      </View>
      <View style={[styles.board, wide && styles.boardWide]}>
        <View style={styles.grid}>
          {cards.map((card, index) => {
            const matched = state.matchedPairs.includes(card.pairId);
            const missed = feedback?.kind === 'miss' && feedback.cardIds.includes(card.id);
            const revealed = matched || missed || state.selectedId === card.id;
            const kind = card.kind === 'concept' ? 'Concepto' : 'Significado';
            const disabled =
              matched ||
              state.selectedId === card.id ||
              feedback?.kind === 'miss' ||
              outcome !== null;
            const Back = backs[index % backs.length];
            return (
              <Pressable
                key={card.id}
                accessibilityRole="button"
                accessibilityLabel={
                  revealed
                    ? `${kind}: ${card.label}${matched ? '. Pareja encontrada.' : ''}`
                    : `Carta oculta ${index + 1}`
                }
                accessibilityState={{ disabled, selected: revealed }}
                disabled={disabled}
                onPress={() => setState((current) => revealMemoramaCard(content, current, card))}
                style={({ pressed }) => [
                  styles.card,
                  wide && styles.cardWide,
                  revealed && styles.revealed,
                  matched && styles.matched,
                  pressed && styles.pressed,
                ]}>
                {revealed ? (
                  <>
                    <View style={styles.cardHeading}>
                      <Text
                        style={[
                          typography.overline,
                          matched ? styles.successText : styles.goldText,
                        ]}>
                        {kind}
                      </Text>
                      {matched ? (
                        <activityIcons.Match color={palette.textSuccess} />
                      ) : (
                        <View style={styles.revealIcon}>
                          <activityIcons.Reveal color={palette.tabActive} />
                        </View>
                      )}
                    </View>
                    <View style={styles.cardBody}>
                      <Text
                        style={[
                          card.kind === 'concept' ? typography.label : typography.body,
                          styles.cardTitle,
                          matched ? styles.successText : styles.title,
                        ]}>
                        {card.label}
                      </Text>
                    </View>
                    {matched ? (
                      <View style={styles.matchMark} />
                    ) : (
                      <Text style={[typography.caption, styles.revealMark]}>
                        {missed ? 'Sin pareja' : 'Descubierta'}
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    <View style={styles.backIcon}>
                      <Back color={palette.tabActive} />
                    </View>
                    <Text style={[typography.overline, styles.secondary]}>Criterika</Text>
                  </>
                )}
              </Pressable>
            );
          })}
        </View>
        {!wide ? notice : null}
        {feedback ? (
          <PrimaryButton
            label={outcome ? 'Ver resultado' : 'Continuar resolución'}
            onPress={proceed}
            height={48}
            palette={{
              face: palette.tabActive,
              label: palette.onSuccess,
              shadow: palette.surfaceTrack,
            }}
            trailing={<activityIcons.Continue color={palette.onSuccess} />}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  game: { gap: spacing.section },
  columns: { flexDirection: 'row', alignItems: 'flex-start', gap: 40 },
  context: { gap: spacing.sm },
  contextWide: { flex: 2 },
  board: { gap: spacing.section },
  boardWide: { flex: 3 },
  flex: { flex: 1, color: palette.textSecondary },
  title: { color: palette.textPrimary },
  secondary: { color: palette.textSecondary },
  successText: { color: palette.textSuccess },
  goldText: { color: palette.tabActive },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  execution: { backgroundColor: sheetColors.chip },
  limit: {
    borderWidth: 1,
    borderColor: sheetColors.handle,
    backgroundColor: palette.surfaceRaised,
  },
  type: { backgroundColor: palette.surfaceLocked },
  prompt: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: palette.surfaceChip,
    padding: spacing.screen,
    borderRadius: radii.lg,
  },
  promptIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primary,
  },
  track: {
    height: 8,
    borderRadius: radii.full,
    overflow: 'hidden',
    backgroundColor: palette.surfaceTrack,
  },
  fill: { height: '100%', backgroundColor: palette.success },
  topic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.surfaceCard,
    paddingVertical: 8,
    paddingHorizontal: spacing.screen,
    marginTop: spacing.sm,
    borderRadius: radii.lg,
  },
  mascot: { width: 80, height: 80 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 },
  card: {
    width: '49%',
    minHeight: 110,
    gap: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceLocked,
    borderRadius: radii.lg,
  },
  cardWide: { minHeight: 140 },
  revealed: {
    backgroundColor: palette.surfaceRaised,
    boxShadow: '0px 2px 4px rgba(43, 20, 12, 0.12)',
  },
  matched: { backgroundColor: palette.successContainer, boxShadow: 'none' },
  pressed: { opacity: 0.8 },
  cardHeading: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBody: { flexGrow: 1, alignSelf: 'stretch', justifyContent: 'center', paddingHorizontal: 4 },
  cardTitle: { textAlign: 'center' },
  backIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchMark: { width: 32, height: 5, borderRadius: 4, backgroundColor: '#ACC265' },
  revealIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.activeGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealMark: {
    paddingHorizontal: 8,
    borderRadius: radii.full,
    backgroundColor: palette.activeLabel,
    color: palette.onActiveLabel,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.screen,
    backgroundColor: palette.surfaceChip,
    borderRadius: radii.lg,
  },
  feedbackIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.successContainer,
  },
});
