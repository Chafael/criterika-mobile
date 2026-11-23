import type { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SvgProps } from 'react-native-svg';

import type { PlayerStats } from '@/data/player';
import { icons, images } from '@/media';
import { radii, shadows, sizes, spacing, typography, useColors } from '@/theme';

type AppHeaderProps = {
  stats: PlayerStats;
};

/** Top bar with logo and player counters (Figma 1:534 light, 119:1566 dark). */
export function AppHeader({ stats }: AppHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, backgroundColor: colors.barBackground },
      ]}>
      <View style={styles.content}>
        <View style={[styles.logoFrame, { backgroundColor: colors.logoBackdrop }]}>
          <Image
            source={images.logoHorizontal}
            style={styles.logo}
            resizeMode="stretch"
            accessibilityRole="image"
            accessibilityLabel="Criterika"
          />
        </View>
        <View style={styles.counters}>
          <Counter
            Icon={icons.lives}
            iconColor={colors.lives}
            value={stats.lives}
            accessibilityLabel={`${stats.lives} vidas`}
          />
          <Counter
            Icon={icons.gems}
            iconColor={colors.gems}
            value={stats.gems}
            accessibilityLabel={`${stats.gems} gemas`}
          />
          <Counter
            Icon={icons.streak}
            iconColor={colors.streak}
            value={stats.streakDays}
            accessibilityLabel={`Racha de ${stats.streakDays} días`}
          />
        </View>
      </View>
    </View>
  );
}

type CounterProps = {
  Icon: FC<SvgProps>;
  iconColor: string;
  value: number;
  accessibilityLabel: string;
};

/** Counter pill ("Background", 1:538). */
function Counter({ Icon, iconColor, value, accessibilityLabel }: CounterProps) {
  const colors = useColors();

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.counter, { backgroundColor: colors.surfaceChip }]}>
      <Icon color={iconColor} />
      <Text style={[typography.label, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    boxShadow: shadows.header,
    zIndex: 1,
  },
  content: {
    height: sizes.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
  },
  logoFrame: {
    width: sizes.logoWidth,
    height: sizes.logoHeight,
    borderRadius: radii.xs,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  counters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: sizes.counterMinHeight,
    padding: spacing.md,
    borderRadius: radii.full,
  },
});
