import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Search from '@/assets/icons/activity/search-word.svg';
import Found from '@/assets/icons/activity/found-word.svg';
import Done from '@/assets/icons/activity/word-done.svg';
import Open from '@/assets/icons/activity/word-open.svg';
import Direction from '@/assets/icons/activity/word-direction.svg';
import Touch from '@/assets/icons/activity/word-touch.svg';
import Info from '@/assets/icons/activity/word-info.svg';
import Book from '@/assets/icons/activity/word-book.svg';
import Check from '@/assets/icons/activity/word-check.svg';
import { PuzzleStatus } from '@/components/activities/puzzle-status';
import { PrimaryButton } from '@/components/primary-button';
import type { ActivityOutcome } from '@/data/activity';
import { cellKey, forwardLine, type GridCell } from '@/data/puzzle-grid';
import { checkWord, type SearchWord } from '@/data/word-search';
import { wordSearch } from '@/mocks/word-search';
import { colors, radii, spacing, typography } from '@/theme';

const palette = colors.light;
const definitions = wordSearch.words;

export function WordSearchGame({ wide, index, execution, onOutcome }: {
  wide: boolean;
  index: number;
  execution: number;
  onOutcome: (result: ActivityOutcome) => void;
}) {
  const [selection, setSelection] = useState<GridCell[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [definition, setDefinition] = useState<SearchWord>(definitions[0]);
  const [feedback, setFeedback] = useState({ message: '', error: false });
  const [start, end] = selection;
  const line = start ? forwardLine(start, end ?? start) : [];
  const selectedKeys = new Set(line.map(cellKey));
  const foundKeys = new Set(definitions.flatMap((word) =>
    found.includes(word.word) ? forwardLine(word.start, word.end).map(cellKey) : []));
  const preview = line.map(({ row, col }) => wordSearch.rows[row][col]).join('');
  const complete = found.length === definitions.length;

  function select(cell: GridCell) {
    setFeedback({ message: '', error: false });
    if (!start || (end && !forwardLine(start, cell).length) || cellKey(cell) === cellKey(start)) {
      setSelection(start && cellKey(cell) === cellKey(start) ? [] : [cell]);
    } else {
      setSelection([start, cell]);
    }
  }

  function check() {
    if (complete) {
      onOutcome('passed');
      return;
    }
    if (!start || !end) return;
    const result = checkWord(definitions, found, start, end);
    if (result.kind === 'found') {
      setFound([...found, result.target.word]);
      setDefinition(result.target);
      setFeedback({ message: `Encontraste ${result.target.word}.`, error: false });
      setSelection([]);
    } else {
      setFeedback({
        message: result.kind === 'duplicate'
          ? 'Ya encontraste esa palabra.'
          : result.kind === 'invalid'
            ? 'Selecciona de izquierda a derecha o de arriba hacia abajo.'
            : 'La selección no coincide con una palabra objetivo.',
        error: result.kind !== 'duplicate',
      });
    }
  }

  const definitionCard = (
    <View style={styles.definition}>
      <View style={styles.book}><Book color="#885100" /></View>
      <View style={styles.copy}>
        <Text style={[typography.captionBold, styles.brown]}>CONCEPTO CLAVE</Text>
        <Text style={[typography.label, styles.ink]}>{definition.word}: {definition.definition}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.layout, wide && styles.wide]}>
      <View style={[styles.column, wide && styles.side]}>
        <PuzzleStatus execution={execution} maxExecutions={3} limit="Sin límite de errores" />
        <View style={styles.between}>
          <View style={styles.inline}>
            <Text style={[typography.captionBold, styles.number]}>{index}</Text>
            <Text style={[typography.label, styles.brown]}>SOPA DE LETRAS</Text>
          </View>
          <View style={[styles.inline, styles.count]}><Found color="#536515" /><Text style={[typography.captionBold, styles.green]}>{found.length} de {definitions.length} halladas</Text></View>
        </View>
        <View style={styles.intro}>
          <View style={styles.search}><Search color="#885100" /></View>
          <View style={styles.copy}>
            <Text accessibilityRole="header" style={[typography.title, styles.ink]}>Encuentra en la cuadrícula los términos clave sobre sesgo y equidad</Text>
            <Text style={[typography.body, styles.ink]}>Toca las letras en orden o selecciona la inicial y final para marcar cada concepto ético.</Text>
          </View>
        </View>
        <View>
          <View style={styles.between}>
            <Text style={[typography.captionBold, styles.ink]}>TÉRMINOS OBJETIVO</Text>
            <Text style={[typography.caption, styles.green]}>Toca una palabra para ver su definición</Text>
          </View>
          <View style={styles.words}>
            {definitions.map((word) => {
              const solved = found.includes(word.word);
              return (
                <Pressable key={word.word} accessibilityRole="button" accessibilityLabel={`Definición de ${word.word}${solved ? ', resuelta' : ''}`} onPress={() => setDefinition(word)} style={[styles.word, solved && styles.wordDone]}>
                  {solved ? <Done color="#536515" /> : <Text style={styles.initial}>{word.word[0]}</Text>}
                  <Text style={[typography.label, styles.ink, solved && styles.strike]}>{word.word}</Text>
                  {solved ? <Text style={[typography.caption, styles.solved]}>Resuelto</Text> : <Open color="#D9BE9F" />}
                </Pressable>
              );
            })}
          </View>
        </View>
        {wide && definitionCard}
      </View>
      <View style={[styles.column, wide && styles.main]}>
        <View style={styles.board}>
          <View style={styles.between}>
            <View style={styles.inline}><Touch color="#885100" /><Text style={[typography.caption, styles.ink]}>Modo táctil activo</Text></View>
            {preview ? <Text style={[typography.label, styles.preview]}>{preview}</Text> : null}
          </View>
          <View style={styles.grid}>
            {wordSearch.rows.map((letters, row) => (
              <View style={styles.row} key={row}>
                {Array.from(letters, (letter, col) => {
                  const key = cellKey({ row, col });
                  const selected = selectedKeys.has(key);
                  const matched = foundKeys.has(key);
                  return (
                    <Pressable key={col} accessibilityRole="button" accessibilityLabel={`${letter}, fila ${row + 1}, columna ${col + 1}${matched ? ', encontrada' : ''}`} accessibilityState={{ selected, disabled: complete }} disabled={complete} onPress={() => select({ row, col })} style={[styles.cell, matched && styles.cellFound, selected && styles.cellSelected]}>
                      <Text style={[typography.button, matched && !selected ? styles.green : styles.ink]}>{letter}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
          <View style={styles.selection}>
            {line.length > 1 ? <Direction color="#885100" /> : <Info color="#885100" />}
            <Text style={[typography.caption, styles.ink]}>{start ? `Selección: ${preview}` : 'Selecciona la letra inicial y final.'}</Text>
            {start && <Pressable accessibilityRole="button" onPress={() => { setSelection([]); setFeedback({ message: '', error: false }); }} style={styles.clear}><Text style={[typography.captionBold, styles.brown, styles.underline]}>Limpiar</Text></Pressable>}
          </View>
        </View>
        {!wide && definitionCard}
        {feedback.message ? <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={[typography.body, feedback.error ? styles.error : styles.green]}>{feedback.message}</Text> : null}
        <PrimaryButton label={complete ? 'Ver resultado' : 'Comprobar palabra'} disabled={!complete && selection.length < 2} onPress={check} leading={<Check color={palette.onPrimary} />} />
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
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 5 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  count: { backgroundColor: '#EAF1CC', borderRadius: radii.full, paddingHorizontal: 8, paddingVertical: 4 },
  number: { textAlign: 'center', minWidth: 24, borderRadius: radii.full, backgroundColor: '#F99A16', padding: 4, color: palette.textPrimary },
  ink: { color: palette.textPrimary },
  brown: { color: '#885100' },
  green: { color: '#536515' },
  error: { color: '#8E2A1E' },
  intro: { flexDirection: 'row', gap: 8, backgroundColor: palette.surfaceCard, borderRadius: radii.lg, padding: 15 },
  search: { alignSelf: 'flex-start', padding: 8, borderRadius: 8, backgroundColor: '#F8DFB9' },
  copy: { flex: 1, gap: 5 },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  word: { flexBasis: '48%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, backgroundColor: palette.surfaceCard, padding: 6, minHeight: 38 },
  wordDone: { backgroundColor: '#F4E8D0' },
  strike: { textDecorationLine: 'line-through', color: '#6E604D' },
  initial: { overflow: 'hidden', borderRadius: 16, backgroundColor: '#EEE0CC', color: palette.textPrimary, paddingHorizontal: 5, fontSize: 11 },
  solved: { paddingHorizontal: 4, borderRadius: 8, backgroundColor: '#D3E98B', color: '#415210', marginLeft: 'auto' },
  definition: { flexDirection: 'row', gap: 8, borderRadius: radii.lg, backgroundColor: '#F4E8D0', padding: 14 },
  book: { alignSelf: 'flex-start', backgroundColor: '#F0D18A', borderRadius: radii.full, padding: 6 },
  board: { padding: 10, backgroundColor: palette.surfaceRaised, borderRadius: radii.lg, gap: 8, boxShadow: '0px 2px 4px rgba(43,20,12,0.16)' },
  grid: { width: '100%', maxWidth: 440, alignSelf: 'center', gap: 5 },
  row: { flexDirection: 'row', gap: 5 },
  cell: { flex: 1, aspectRatio: 0.9, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: palette.surfaceCard },
  cellFound: { backgroundColor: '#DEEEA9' },
  cellSelected: { backgroundColor: '#F99A16' },
  preview: { color: '#885100', backgroundColor: '#FFF0DF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  selection: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center', alignItems: 'center' },
  clear: { paddingHorizontal: 3, minHeight: 26, justifyContent: 'center' },
  underline: { textDecorationLine: 'underline' },
});
