import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import CorrectIcon from '@/assets/icons/activity/match-correct.svg';
import EmptyIcon from '@/assets/icons/activity/match-empty.svg';
import HintIcon from '@/assets/icons/activity/match-hint.svg';
import LinkedIcon from '@/assets/icons/activity/match-linked.svg';
import MissionIcon from '@/assets/icons/activity/match-mission.svg';
import ProgressIcon from '@/assets/icons/activity/match-progress.svg';
import SelectedIcon from '@/assets/icons/activity/match-selected.svg';
import SubmitIcon from '@/assets/icons/activity/match-submit.svg';
import TapIcon from '@/assets/icons/activity/match-tap.svg';
import TypeIcon from '@/assets/icons/activity/match-type.svg';
import UnknownIcon from '@/assets/icons/activity/match-unknown.svg';
import { PuzzleStatus } from '@/components/activities/puzzle-status';
import { PrimaryButton } from '@/components/primary-button';
import type { ActivityGameProps } from '@/data/activity';
import {
  evaluateLinks,
  linkDefinition,
  type MatchingContent,
  type MatchLinks,
} from '@/data/matching';
import { colors, radii, spacing, typography } from '@/theme';

const palette = colors.light;
const gutter = 16;

export function MatchingGame({
  content,
  execution,
  wide,
  onOutcome,
}: ActivityGameProps & { content: MatchingContent }) {
  const [selected, setSelected] = useState<string>();
  const [links, setLinks] = useState<MatchLinks>({});
  const [fixed, setFixed] = useState<MatchLinks>({});
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState<ReturnType<typeof evaluateLinks>>();
  const [centers, setCenters] = useState<Record<string, number>>({});
  const [boardHeight, setBoardHeight] = useState(0);

  const count = Object.keys(links).length;
  const offset = (execution - 1) % content.definitions.length;
  const definitions = [
    ...content.definitions.slice(offset),
    ...content.definitions.slice(0, offset),
  ];
  const recordCenter = (key: string, position: number) =>
    setCenters((current) =>
      current[key] === position ? current : { ...current, [key]: position },
    );
  const hint = (
    <View style={styles.hint}>
      <View style={styles.hintIcon}>
        <HintIcon color={palette.textSuccess} />
      </View>
      <Text style={[typography.caption, styles.secondary, styles.copy]}>Pista: {content.hint}</Text>
    </View>
  );

  return (
    <View style={[styles.root, wide && styles.wide]}>
      <View style={[styles.context, wide && styles.wideContext]}>
        <PuzzleStatus
          execution={execution}
          maxExecutions={3}
          limit={`Errores: ${errors} de ${content.errorLimit}`}
        />
        <View style={styles.summary}>
          <View style={[styles.chip, styles.type]}>
            <TypeIcon color={palette.tabActive} />
            <Text style={[typography.captionBold, styles.ink]}>Relacionar</Text>
          </View>
          <View style={[styles.chip, styles.linked]}>
            <ProgressIcon color={palette.success} />
            <Text style={[typography.caption, styles.green]}>
              {count} de {content.concepts.length} enlazados
            </Text>
          </View>
        </View>
        <View style={styles.mission}>
          <View style={styles.missionIcon}>
            <MissionIcon color={palette.onActiveNode} />
          </View>
          <View style={styles.copy}>
            <Text style={[typography.overline, styles.accent]}>Misión equidad</Text>
            <Text accessibilityRole="header" style={[typography.title, styles.ink]}>
              Relaciona cada concepto con su definición
            </Text>
            <Text style={[typography.body, styles.secondary]}>
              Toca un concepto y luego su definición para vincularlos.
            </Text>
          </View>
        </View>
        {wide && hint}
      </View>
      <View style={[styles.game, wide && styles.wideGame]}>
        <View
          style={styles.board}
          onLayout={({ nativeEvent }) => setBoardHeight(nativeEvent.layout.height)}>
          {boardHeight > 0 && (
            <View pointerEvents="none" style={styles.connections}>
              <Svg width={gutter} height={boardHeight}>
                {Object.entries(links).map(([conceptId, definitionId]) => {
                  const from = centers[`concept:${conceptId}`];
                  const to = centers[`definition:${definitionId}`];
                  return from === undefined || to === undefined ? null : (
                    <Line
                      key={conceptId}
                      x1={0}
                      x2={gutter}
                      y1={from}
                      y2={to}
                      stroke={
                        fixed[conceptId] || !feedback || feedback.correctLinks[conceptId]
                          ? palette.success
                          : palette.lives
                      }
                      strokeWidth={3}
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                    />
                  );
                })}
              </Svg>
            </View>
          )}
          <View style={styles.column}>
            <Text style={[typography.overline, styles.columnHeading]}>Conceptos</Text>
            {content.concepts.map((concept, position) => {
              const isSelected = concept.id === selected;
              const definition = links[concept.id];
              const linked = Boolean(definition);
              const isFixed = Boolean(fixed[concept.id]);
              const wrong = feedback && linked && !feedback.correctLinks[concept.id];
              const letter = String.fromCharCode(
                65 + definitions.findIndex((item) => item.id === definition),
              );
              const Icon = isSelected ? SelectedIcon : linked ? LinkedIcon : EmptyIcon;
              return (
                <Pressable
                  key={concept.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Concepto: ${concept.label}`}
                  accessibilityHint={linked ? `Enlazado con ${letter}` : undefined}
                  accessibilityState={{ selected: isSelected, disabled: isFixed || !!feedback }}
                  disabled={isFixed || !!feedback}
                  onPress={() => setSelected(isSelected ? undefined : concept.id)}
                  onLayout={({ nativeEvent: { layout } }) =>
                    recordCenter(`concept:${concept.id}`, layout.y + layout.height / 2)
                  }
                  style={[
                    styles.tile,
                    linked && styles.linked,
                    isSelected && styles.selected,
                    wrong && styles.wrong,
                  ]}>
                  <View style={styles.tileHeader}>
                    <Text style={[typography.captionBold, styles.letter]}>{position + 1}</Text>
                    <Icon color={linked ? palette.success : palette.tabActive} />
                  </View>
                  <Text style={[typography.label, styles.ink]}>{concept.label}</Text>
                  <Text style={[typography.caption, styles.secondary]}>
                    {isSelected
                      ? 'Selecciona su definición'
                      : linked
                        ? `Enlazado con ${letter}`
                        : 'Sin emparejar'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.column}>
            <Text style={[typography.overline, styles.columnHeading]}>Definiciones</Text>
            {definitions.map((item, position) => {
              const concept = Object.keys(links).find((id) => links[id] === item.id);
              const isFixed = !!concept && !!fixed[concept];
              const canLink = !!selected && !isFixed && !feedback;
              const wrong = feedback && concept && !feedback.correctLinks[concept];
              const Icon = concept ? CorrectIcon : canLink ? TapIcon : UnknownIcon;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Definición: ${item.label}`}
                  accessibilityState={{ disabled: !canLink, selected: !!concept }}
                  disabled={!canLink}
                  onPress={() => {
                    if (!selected) return;
                    setLinks((current) => linkDefinition(current, selected, item.id));
                    setSelected(undefined);
                  }}
                  onLayout={({ nativeEvent: { layout } }) =>
                    recordCenter(`definition:${item.id}`, layout.y + layout.height / 2)
                  }
                  style={[
                    styles.tile,
                    concept && styles.linked,
                    canLink && !concept && styles.available,
                    wrong && styles.wrong,
                  ]}>
                  <View style={styles.tileHeader}>
                    <Text style={[typography.captionBold, styles.letter]}>
                      {String.fromCharCode(65 + position)}
                    </Text>
                    <Icon color={concept ? palette.success : palette.tabActive} />
                  </View>
                  <Text style={[typography.caption, styles.ink]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        {!wide && hint}
        {feedback && (
          <Text accessibilityLiveRegion="polite" style={[typography.body, styles.feedback]}>
            {feedback.missed
              ? feedback.missed === 1
                ? 'Una asociación incorrecta.'
                : `${feedback.missed} asociaciones incorrectas.`
              : '¡Todas las asociaciones son correctas!'}
          </Text>
        )}
        <PrimaryButton
          label={
            feedback
              ? feedback.outcome
                ? 'Ver resultado de relacionar'
                : 'Corregir asociaciones'
              : 'Confirmar emparejamientos'
          }
          leading={<SubmitIcon color={palette.onPrimary} />}
          disabled={count !== content.concepts.length && !feedback}
          onPress={() => {
            if (!feedback) {
              const result = evaluateLinks(content, links, errors);
              setErrors(result.newErrors);
              setFeedback(result);
            } else if (feedback.outcome) {
              onOutcome(feedback.outcome);
            } else {
              setLinks(feedback.correctLinks);
              setFixed(feedback.correctLinks);
              setSelected(undefined);
              setFeedback(undefined);
            }
          }}
        />
        {wide && (
          <Text style={[typography.caption, styles.columnHeading]}>
            Cada asociación incorrecta cuenta como error.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 28 },
  wide: { flexDirection: 'row', alignItems: 'flex-start', gap: 44 },
  context: { gap: spacing.screen },
  wideContext: { flex: 2, gap: 24 },
  game: { gap: 25 },
  wideGame: { flex: 3 },
  copy: { flex: 1, gap: 4 },
  summary: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 10,
    gap: 6,
    borderRadius: radii.full,
  },
  type: { backgroundColor: palette.surfaceLocked },
  linked: { backgroundColor: palette.successContainer },
  selected: { backgroundColor: palette.primary },
  available: { backgroundColor: palette.surfaceLocked },
  wrong: { backgroundColor: '#F7DED6' },
  mission: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: palette.surfaceChip,
    borderRadius: radii.lg,
    gap: 8,
    padding: spacing.screen,
  },
  missionIcon: {
    backgroundColor: palette.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.surfaceRaised,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  hintIcon: {
    backgroundColor: palette.successContainer,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: { flexDirection: 'row', gap: gutter },
  connections: { position: 'absolute', left: '50%', marginLeft: -gutter / 2, top: 0 },
  column: { flex: 1, gap: spacing.screen },
  columnHeading: { textAlign: 'center', color: palette.textSecondary },
  tile: {
    minHeight: 112,
    gap: 6,
    borderRadius: radii.lg,
    backgroundColor: palette.surfaceCard,
    padding: spacing.md,
  },
  tileHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  letter: {
    minWidth: 22,
    lineHeight: 22,
    textAlign: 'center',
    color: palette.textPrimary,
    backgroundColor: 'rgba(83,68,52,0.12)',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  feedback: {
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: palette.surfaceCard,
    color: palette.textPrimary,
  },
  ink: { color: palette.textPrimary },
  green: { color: palette.textSuccess },
  secondary: { color: palette.textSecondary },
  accent: { color: palette.tabActive },
});
