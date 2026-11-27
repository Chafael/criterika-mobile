import { StyleSheet, Text, View } from 'react-native';

import { icons } from '@/media';
import { radii, sizes, spacing, typography, useColors } from '@/theme';

type NextUnitCardProps = {
  title: string;
  unlocked?: boolean;
};

/** Locked preview of the next unit (Figma 1:448 / 119:1480). */
export function NextUnitCard({ title, unlocked = false }: NextUnitCardProps) {
  const colors = useColors();

  return (
    <View
      accessible
      accessibilityLabel={`Próxima unidad: ${title}. ${unlocked ? 'Desbloqueada.' : 'Bloqueada.'}`}
      style={[styles.card, { backgroundColor: colors.surfaceChip }]}>
      <View style={styles.left}>
        <View style={[styles.circle, { backgroundColor: colors.surfaceCard }]}>
          <icons.nextUnit color={colors.textSecondary} />
        </View>
        <View style={styles.texts}>
          <Text style={[typography.overline, { color: colors.textSecondary }]}>Próxima unidad</Text>
          <Text style={[typography.title, { color: colors.textPrimary }]}>{title}</Text>
        </View>
      </View>
      {unlocked ? (
        <icons.check color={colors.textSuccess} />
      ) : (
        <icons.lockLarge color={colors.lockMuted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.screen,
    borderRadius: radii.md,
    opacity: 0.8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
  },
  circle: {
    width: sizes.nextUnitCircle,
    height: sizes.nextUnitCircle,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    gap: 2.5,
    paddingTop: 5.5,
    flexShrink: 1,
  },
});
