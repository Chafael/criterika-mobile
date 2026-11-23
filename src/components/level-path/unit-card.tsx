import { StyleSheet, Text, View } from 'react-native';

import { icons } from '@/media';
import { radii, shadows, sizes, spacing, typography, useColors } from '@/theme';
import { decorGlowProfile, glowGradient } from '@/theme/glow';

type UnitCardProps = {
  unitNumber: number;
  title: string;
  description: string;
  completed: number;
  total: number;
};

/** Decoration is a 128 px circle; its blur (σ 40) reaches 64 + 80 = 144 px. */
const DECOR_RADIUS = 144;
/** Circle center sits 64 − 24 = 40 px inside the card's bottom-right corner. */
const DECOR_CENTER_INSET = 40;

/** Unit header card with progress (Figma 1:423 / 119:1455). */
export function UnitCard({ unitNumber, title, description, completed, total }: UnitCardProps) {
  const colors = useColors();
  const progress = total > 0 ? completed / total : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceCard }]}>
      <View
        pointerEvents="none"
        style={[
          styles.decor,
          { backgroundImage: glowGradient(colors.decorGlow, decorGlowProfile) },
        ]}
      />
      <View style={styles.top}>
        <View style={styles.texts}>
          <View style={[styles.badge, { backgroundColor: colors.surfaceTrack }]}>
            <icons.unitBadge color={colors.textSuccess} />
            <Text style={[typography.overline, { color: colors.textSuccess }]}>
              Unidad {unitNumber}
            </Text>
          </View>
          <Text accessibilityRole="header" style={[typography.title, styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>{description}</Text>
        </View>
        <View style={[styles.topic, { backgroundColor: colors.successContainer }]}>
          <icons.unitTopic color={colors.onSuccessContainer} />
        </View>
      </View>

      <View
        style={styles.progress}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Progreso de la unidad"
        accessibilityValue={{ min: 0, max: total, now: completed, text: `${completed} de ${total} completados` }}>
        <View style={styles.progressRow}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Progreso de la unidad</Text>
          <Text style={[typography.label, { color: colors.textSuccess }]}>
            {completed} / {total} completados
          </Text>
        </View>
        <View style={[styles.track, { backgroundColor: colors.surfaceTrack }]}>
          <View
            testID="unit-progress-fill"
            style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: colors.success }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.screen,
    padding: spacing.screen,
    borderRadius: radii.md,
    overflow: 'hidden',
    boxShadow: shadows.card,
  },
  decor: {
    position: 'absolute',
    width: DECOR_RADIUS * 2,
    height: DECOR_RADIUS * 2,
    right: DECOR_CENTER_INSET - DECOR_RADIUS,
    bottom: DECOR_CENTER_INSET - DECOR_RADIUS,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  texts: {
    flexShrink: 1,
    maxWidth: 254.28,
    gap: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  title: {
    paddingTop: spacing.xxs,
  },
  topic: {
    width: sizes.topicCircle,
    height: sizes.topicCircle,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.chip,
  },
  progress: {
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  track: {
    height: sizes.progressTrack,
    borderRadius: radii.full,
    padding: spacing.xxs,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
  },
});
