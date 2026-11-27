import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Theme from '@/assets/icons/activity/cross-theme.svg';
import Progress from '@/assets/icons/activity/cross-progress.svg';
import Concept from '@/assets/icons/activity/cross-concept.svg';
import Turn from '@/assets/icons/activity/cross-turn.svg';
import Clue from '@/assets/icons/activity/cross-clue.svg';
import Delete from '@/assets/icons/activity/cross-delete.svg';
import Check from '@/assets/icons/activity/cross-check.svg';
import { PuzzleStatus } from '@/components/activities/puzzle-status';
import { PrimaryButton } from '@/components/primary-button';
import type { ActivityOutcome } from '@/data/activity';
import {
  checkCrossword,
  clueCells,
  cluesAt,
  type CrosswordClue,
  type CrosswordLetters,
} from '@/data/crossword';
import { cellKey } from '@/data/puzzle-grid';
import { crossword } from '@/mocks/crossword';
import { colors, radii, spacing, typography } from '@/theme';

const palette = colors.light;
const brown = '#885100';
const green = '#536515';
const danger = '#8E2A1E';
const keys = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const board = Array.from({ length: crossword.rows }, (_, row) =>
  Array.from({ length: crossword.columns }, (_, col) => {
    const cell = { row, col };
    return { cell, clues: cluesAt(crossword.clues, cell) };
  }),
);

export function CrosswordGame({
  wide,
  execution,
  onOutcome,
}: {
  wide: boolean;
  execution: number;
  onOutcome: (result: ActivityOutcome) => void;
}) {
  const [clue, setClue] = useState(crossword.clues[0]);
  const [active, setActive] = useState(clue.start);
  const [letters, setLetters] = useState<CrosswordLetters>({});
  const [checks, setChecks] = useState(0);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const score = checkCrossword(crossword.clues, letters);
  const path = clueCells(clue).map(cellKey);
  const current = path.indexOf(cellKey(active));
  const alternate = crossword.clues.find((candidate) => candidate.direction !== clue.direction);

  function choose(next: CrosswordClue, cell = next.start) {
    if (finished) return;
    setClue(next);
    setActive(cell);
  }

  function enter(letter: string) {
    if (finished) return;
    setLetters({ ...letters, [cellKey(active)]: letter });
    setActive(clueCells(clue)[current + 1] ?? active);
    setChecked(false);
  }

  function erase() {
    if (finished) return;
    const target = letters[cellKey(active)] ? active : (clueCells(clue)[current - 1] ?? active);
    setLetters({ ...letters, [cellKey(target)]: '' });
    setActive(target);
    setChecked(false);
  }

  function check() {
    if (!score.complete || checked || finished) return;
    const nextCheck = checks + 1;
    setChecks(nextCheck);
    setChecked(true);
    if (score.solved.length === crossword.clues.length || nextCheck >= crossword.maxChecks) {
      setFinished(true);
      onOutcome(score.solved.length === crossword.clues.length ? 'passed' : 'failed');
    }
  }

  const clues = (
    <View style={styles.clues}>
      <View style={styles.inline}>
        <Clue color={brown} />
        <Text accessibilityRole="header" style={[typography.title, styles.ink]}>
          Pistas de la sesión
        </Text>
      </View>
      {crossword.clues.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={`Pista ${item.id}, ${item.label}`}
          accessibilityState={{ selected: item.id === clue.id, disabled: finished }}
          disabled={finished}
          onPress={() => choose(item)}
          style={[styles.clueCard, item.id === clue.id && styles.clueSelected]}>
          <Text style={[typography.captionBold, styles.clueTag]}>{item.id}</Text>
          <View style={styles.copy}>
            <Text style={[typography.captionBold, styles.green]}>
              {item.direction === 'horizontal' ? 'HORIZONTAL' : 'VERTICAL'} · {item.answer.length}{' '}
              LETRAS
            </Text>
            <Text style={[typography.body, styles.ink]}>{item.definition}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={[styles.layout, wide && styles.wide]}>
      <View style={[styles.column, wide && styles.side]}>
        <PuzzleStatus
          execution={execution}
          maxExecutions={3}
          limit={`Comprobaciones: ${checks} de ${crossword.maxChecks}`}
        />
        <View style={styles.between}>
          <View style={[styles.inline, styles.theme]}>
            <Theme color={brown} />
            <Text style={[typography.captionBold, styles.ink]}>Ética y Equidad</Text>
          </View>
          <View style={[styles.inline, styles.count]}>
            <Progress color={green} />
            <Text style={[typography.captionBold, styles.green]}>
              {checked ? score.solved.length : 0} / {crossword.clues.length} palabras
            </Text>
          </View>
        </View>
        <View style={styles.intro}>
          <View style={styles.concept}>
            <Concept color={brown} />
          </View>
          <View style={styles.copy}>
            <Text style={[typography.captionBold, styles.brown]}>DESAFÍO NORMATIVO</Text>
            <Text style={[typography.label, styles.ink]}>
              Completa el crucigrama resolviendo las definiciones de principios éticos.
            </Text>
          </View>
        </View>
        {wide && clues}
      </View>
      <View style={[styles.column, wide && styles.main]}>
        <View style={styles.board}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map(({ cell, clues: cellClues }) => {
                const key = cellKey(cell);
                if (!cellClues.length) return <View key={key} style={styles.space} />;
                const start = cellClues.find((item) => cellKey(item.start) === key);
                const selected = key === cellKey(active) && !finished;
                const error = checked && score.incorrect.has(key);
                const correct = checked && !error;
                const letter = letters[key];
                return (
                  <Pressable
                    key={key}
                    accessibilityRole="button"
                    accessibilityLabel={`Casilla fila ${cell.row + 1}, columna ${cell.col + 1}, ${letter || 'vacía'}${error ? ', incorrecta' : correct ? ', correcta' : ''}`}
                    accessibilityState={{ selected, disabled: finished }}
                    disabled={finished}
                    onPress={() =>
                      choose(cellClues.find((item) => item.id === clue.id) ?? cellClues[0], cell)
                    }
                    style={[
                      styles.space,
                      styles.cell,
                      path.includes(key) && styles.inClue,
                      correct && styles.correct,
                      error && styles.wrong,
                      selected && styles.current,
                    ]}>
                    {start && <Text style={styles.marker}>{start.id.slice(0, -1)}</Text>}
                    <Text style={[typography.button, styles.ink]}>{letter}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
        <Text style={[typography.caption, styles.hint]}>
          Toca una casilla o una pista para escribir letras.
        </Text>
        <View style={[styles.between, styles.activeClue]}>
          <Text style={[typography.captionBold, styles.activeTag]}>{clue.id}</Text>
          <Text numberOfLines={2} style={[typography.label, styles.copy, styles.ink]}>
            {clue.label}
          </Text>
          {alternate && (
            <Pressable
              accessibilityRole="button"
              disabled={finished}
              accessibilityLabel="Girar, cambiar orientación"
              style={[styles.inline, styles.turn]}
              onPress={() =>
                choose(
                  alternate,
                  cluesAt(crossword.clues, active).includes(alternate) ? active : alternate.start,
                )
              }>
              <Turn color={brown} />
              <Text style={[typography.captionBold, styles.brown]}>Girar</Text>
            </Pressable>
          )}
        </View>
        {!wide && clues}
        <View style={styles.keyboard}>
          {keys.map((row, index) => (
            <View key={row} style={styles.keyRow}>
              {Array.from(row, (letter) => (
                <Pressable
                  key={letter}
                  accessibilityRole="button"
                  accessibilityLabel={`Letra ${letter}`}
                  disabled={finished}
                  onPress={() => enter(letter)}
                  style={styles.key}>
                  <Text style={[typography.button, styles.ink]}>{letter}</Text>
                </Pressable>
              ))}
              {index === keys.length - 1 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Borrar letra"
                  disabled={finished}
                  onPress={erase}
                  style={[styles.key, styles.delete]}>
                  <Delete color={palette.textPrimary} />
                </Pressable>
              )}
            </View>
          ))}
        </View>
        {checked && score.incorrect.size > 0 ? (
          <Text
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={[typography.body, styles.error]}>
            Revisa las casillas marcadas. {score.solved.length} de {crossword.clues.length} palabras
            correctas.
          </Text>
        ) : null}
        <PrimaryButton
          label="Comprobar"
          disabled={!score.complete || checked || finished}
          onPress={check}
          leading={<Check color="#FFFDF8" />}
          palette={{ face: brown, shadow: '#704300', label: '#FFFDF8' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: { gap: spacing.screen },
  wide: { flexDirection: 'row', alignItems: 'flex-start', gap: 32 },
  column: { gap: 14 },
  side: { flex: 2 },
  main: { flex: 3 },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ink: { color: palette.textPrimary },
  brown: { color: brown },
  green: { color: green },
  error: { color: danger },
  theme: {
    backgroundColor: '#F1E1C5',
    borderRadius: radii.full,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  count: {
    backgroundColor: '#D3E98B',
    borderRadius: radii.full,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  intro: {
    flexDirection: 'row',
    gap: 9,
    backgroundColor: palette.surfaceRaised,
    borderRadius: radii.lg,
    padding: 15,
  },
  concept: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: radii.full,
    backgroundColor: '#FCDCB7',
  },
  copy: { flex: 1, gap: 3 },
  board: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    padding: 12,
    backgroundColor: '#F1E1C5',
    borderRadius: radii.lg,
    gap: 6,
    boxShadow: '0px 2px 4px rgba(43,20,12,0.16)',
  },
  row: { flexDirection: 'row', gap: 6 },
  space: { flex: 1, aspectRatio: 1 },
  cell: {
    borderWidth: 1,
    borderColor: '#DDB98C',
    backgroundColor: palette.surfaceRaised,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inClue: { backgroundColor: '#FFF6E6' },
  current: { borderWidth: 2, borderColor: brown, backgroundColor: '#F99A16' },
  correct: { backgroundColor: '#DEEEA9', borderColor: green },
  wrong: { backgroundColor: '#FADBCF', borderColor: danger },
  marker: { position: 'absolute', top: 1, left: 4, color: palette.textPrimary, fontSize: 8 },
  hint: { color: palette.textSecondary, textAlign: 'center', marginTop: -7 },
  activeClue: { borderRadius: 8, backgroundColor: '#FCDCB7', padding: 8 },
  activeTag: {
    backgroundColor: brown,
    color: '#FFFDF8',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  turn: {
    backgroundColor: palette.surfaceRaised,
    paddingHorizontal: 8,
    minHeight: 30,
    borderRadius: radii.full,
  },
  clues: { gap: 8 },
  clueCard: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: palette.surfaceRaised,
    padding: 14,
    borderRadius: radii.lg,
  },
  clueSelected: { backgroundColor: '#FAEFDE' },
  clueTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4E8D0',
    color: brown,
    borderRadius: 8,
    padding: 6,
  },
  keyboard: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    backgroundColor: '#F4E8D0',
    padding: 8,
    borderRadius: radii.lg,
    gap: 5,
  },
  keyRow: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  key: {
    flex: 1,
    maxWidth: 52,
    minHeight: 44,
    backgroundColor: palette.surfaceRaised,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 1px 2px rgba(43,20,12,0.12)',
  },
  delete: { backgroundColor: '#F0DCBD' },
});
