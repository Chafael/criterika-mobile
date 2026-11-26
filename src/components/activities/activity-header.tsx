import { Pressable, StyleSheet, Text, View } from 'react-native';

import { activityIcons } from '@/media/activity';
import { colors, radii, spacing, typography } from '@/theme';

const palette = colors.light;

export function ActivityHeader({
  title,
  level,
  completed,
  total,
  wide,
  onExit,
}: {
  title: string;
  level: number;
  completed: number;
  total: number;
  wide: boolean;
  onExit: () => void;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Salir del nivel"
        onPress={onExit}
        style={styles.exit}>
        <activityIcons.Close color={palette.textPrimary} />
      </Pressable>
      <View style={styles.summary}>
        <Text accessibilityRole="header" style={[typography.label, styles.title]}>
          {title}
        </Text>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Progreso del nivel"
          accessibilityValue={{ min: 0, max: total, now: completed }}
          style={styles.track}>
          <View style={[styles.fill, { width: `${(completed / total) * 100}%` }]} />
        </View>
        <Text style={[typography.captionBold, styles.subtitle]}>
          Nivel {level} · {completed} de {total} actividades superadas
        </Text>
      </View>
      {wide ? (
        <View style={styles.life} accessibilityLabel="Una vida en juego en este nivel de prueba">
          <activityIcons.ReservedLife color="#8E2A1E" />
          <Text style={[typography.captionBold, styles.lifeText]}>1 en juego</Text>
        </View>
      ) : (
        <View style={styles.exit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.surfaceTrack,
  },
  exit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  summary: { flex: 1, alignItems: 'center', gap: 2 },
  title: { color: palette.textPrimary, textAlign: 'center' },
  subtitle: { color: palette.textSecondary, textAlign: 'center' },
  track: {
    width: '80%',
    maxWidth: 140,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: palette.surfaceCard,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: palette.success },
  life: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radii.full,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FDECEA',
  },
  lifeText: { color: '#8E2A1E' },
});
