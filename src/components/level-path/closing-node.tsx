import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { UnitClosing } from '@/data/level-path';
import { icons } from '@/media';
import { radii, shadows, sizes, spacing, typography, useColors } from '@/theme';

type ClosingNodeProps = {
  closing: UnitClosing;
  onStart?: () => void;
};

/** Unit closing with collectible card reward (Figma 1:517 / 119:1549). */
export function ClosingNode({ closing, onStart }: ClosingNodeProps) {
  const colors = useColors();
  const locked = closing.status === 'locked';
  const canStart = closing.playable && !locked && !!onStart;

  return (
    <Pressable
      style={styles.column}
      accessible
      accessibilityRole={canStart ? 'button' : undefined}
      accessibilityHint={canStart ? 'Abre la vista previa del cierre.' : undefined}
      disabled={!canStart}
      onPress={onStart}
      accessibilityLabel={`${closing.title}. ${closing.badge}: ${closing.cardName}.${
        locked ? ' Bloqueado hasta completar los niveles anteriores.' : ''
      }`}>
      <View style={[styles.card, { backgroundColor: colors.surfaceLocked }]}>
        <icons.gift color={colors.rewardIcon} />
        <Text style={[typography.captionBold, styles.cardName, { color: colors.textSecondary }]}>
          {closing.cardName}
        </Text>
        {locked ? (
          <View style={[styles.lockOverlay, { backgroundColor: colors.rewardLockOverlay }]}>
            <icons.lockSmall color={colors.textSecondary} />
          </View>
        ) : null}
      </View>
      <View style={styles.badgeRow} pointerEvents="none">
        <View style={[styles.badge, { backgroundColor: colors.reward }]}>
          <icons.star color={colors.onReward} />
          <Text style={[typography.captionBold, { color: colors.onReward }]}>{closing.badge}</Text>
        </View>
      </View>
      <View style={styles.labelMargin}>
        <View style={[styles.label, { backgroundColor: colors.surfaceCard }]}>
          <Text style={[typography.label, styles.center, { color: colors.textPrimary }]}>
            {closing.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  card: {
    width: sizes.nodeLarge,
    height: sizes.nodeLarge,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: shadows.raised,
  },
  cardName: {
    paddingTop: spacing.xxs,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    position: 'absolute',
    top: -spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radii.full,
    boxShadow: shadows.chip,
  },
  labelMargin: {
    paddingTop: spacing.md,
  },
  label: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderRadius: radii.full,
    boxShadow: shadows.chip,
  },
  center: {
    textAlign: 'center',
  },
});
