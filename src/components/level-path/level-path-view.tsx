import { StyleSheet, View, type ViewStyle } from 'react-native';

import type { Level, UnitClosing } from '@/data/level-path';
import { illustrations } from '@/media';
import { sizes, spacing } from '@/theme';

import { ClosingNode } from './closing-node';
import { LevelNode } from './level-node';

type LevelPathViewProps = {
  levels: Level[];
  closing: UnitClosing;
  mascotMessage: string;
  onStartLevel: (level: Level) => void;
  onStartClosing: () => void;
};

/**
 * Horizontal placement of each node along the winding path (1:462–1:507):
 * center (+8 px top), right 32, left 24, right 40. Repeats for longer units.
 */
const SLOTS: ViewStyle[] = [
  { justifyContent: 'center', paddingTop: spacing.md },
  { justifyContent: 'flex-end', paddingRight: 32 },
  { justifyContent: 'flex-start', paddingLeft: spacing.block },
  { justifyContent: 'flex-end', paddingRight: 40 },
];

/** Space below each node: 48 under the active one, 40 otherwise, 24 after the closing. */
const GAP_AFTER = { default: 40, active: 48, closing: spacing.block } as const;

/** Winding path with the unit's level nodes (Figma 1:458). */
export function LevelPathView({
  levels,
  closing,
  mascotMessage,
  onStartLevel,
  onStartClosing,
}: LevelPathViewProps) {
  return (
    <View style={styles.container}>
      <illustrations.levelPath
        width="100%"
        height={sizes.pathHeight}
        preserveAspectRatio="none"
        style={styles.illustration}
      />
      {levels.map((level, index) => (
        <View
          key={level.id}
          style={[
            styles.row,
            SLOTS[index % SLOTS.length],
            { paddingBottom: level.status === 'active' ? GAP_AFTER.active : GAP_AFTER.default },
          ]}>
          <LevelNode
            level={level}
            mascotMessage={level.status === 'active' ? mascotMessage : undefined}
            onStart={() => onStartLevel(level)}
          />
        </View>
      ))}
      <View style={[styles.row, styles.center, { paddingBottom: GAP_AFTER.closing }]}>
        <ClosingNode closing={closing} onStart={onStartClosing} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
  },
  illustration: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
});
