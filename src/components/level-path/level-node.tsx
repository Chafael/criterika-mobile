import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Level } from '@/data/level-path';
import { icons } from '@/media';
import { radii, shadows, sizes, spacing, typography, useColors } from '@/theme';
import { glowGradient, haloGlowProfile } from '@/theme/glow';

import { MascotBubble } from './mascot-bubble';

type LevelNodeProps = {
  level: Level;
  mascotMessage?: string;
  onStart?: () => void;
};

/** One level on the path: completed, active or locked (Figma 1:462–1:514). */
export function LevelNode({ level, mascotMessage, onStart }: LevelNodeProps) {
  switch (level.status) {
    case 'completed':
      return <CompletedNode level={level} onStart={level.playable ? onStart : undefined} />;
    case 'active':
      return <ActiveNode level={level} mascotMessage={mascotMessage} onStart={onStart} />;
    case 'locked':
      return <LockedNode level={level} />;
  }
}

function levelName(level: Level): string {
  return `${level.number}. ${level.title}`;
}

/** Completed node (1:465) and its label (1:470). */
function CompletedNode({ level, onStart }: { level: Level; onStart?: () => void }) {
  const colors = useColors();

  return (
    <Pressable
      style={styles.column}
      accessible
      accessibilityRole={onStart ? 'button' : undefined}
      accessibilityHint={onStart ? 'Abre la vista previa para practicar.' : undefined}
      disabled={!onStart}
      onPress={onStart}
      accessibilityLabel={`Nivel ${level.number}: ${level.title}. Completado con éxito.`}>
      <View style={[styles.node, styles.raised, { backgroundColor: colors.success }]}>
        <icons.check color={colors.onSuccess} />
      </View>
      <View style={styles.labelMargin}>
        <View style={[styles.label, styles.labelChip, { backgroundColor: colors.surfaceChip }]}>
          <Text style={[typography.label, styles.center, { color: colors.textPrimary }]}>
            {levelName(level)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/** Locked node (1:509) and its translucent label (1:513). */
function LockedNode({ level }: { level: Level }) {
  const colors = useColors();

  return (
    <View
      style={styles.column}
      accessible
      accessibilityLabel={`Nivel ${level.number}: ${level.title}. Bloqueado.`}>
      <View style={[styles.node, styles.chipShadow, { backgroundColor: colors.surfaceLocked }]}>
        <icons.lock color={colors.textSecondary} />
      </View>
      <View style={styles.labelMargin}>
        <View style={[styles.label, { backgroundColor: colors.surfaceLockedLabel }]}>
          <Text style={[typography.label, styles.center, { color: colors.textDisabled }]}>
            {levelName(level)}
          </Text>
        </View>
      </View>
    </View>
  );
}

/** Halo box: pill + 2σ (σ = 12) on every side, from the −8 px inset of 1:485. */
const HALO_OUTSET = 8 + 24;

/** Active node with halo, label and mascot (1:484). */
function ActiveNode({
  level,
  mascotMessage,
  onStart,
}: {
  level: Level;
  mascotMessage?: string;
  onStart?: () => void;
}) {
  const colors = useColors();

  return (
    <View style={styles.column}>
      <View
        pointerEvents="none"
        style={[styles.halo, { backgroundImage: glowGradient(colors.activeGlow, haloGlowProfile) }]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Nivel ${level.number}: ${level.title}. Nivel actual activo.`}
        accessibilityHint="Pulsa para comenzar."
        onPress={onStart}
        style={[styles.nodeLarge, styles.activeShadow, { backgroundColor: colors.primary }]}>
        <icons.play color={colors.onActiveNode} />
        <View style={styles.startMargin}>
          <Text
            style={[typography.captionStrong, styles.startText, { color: colors.onActiveNode }]}>
            Iniciar
          </Text>
        </View>
      </Pressable>
      <View style={styles.labelMargin}>
        <View
          style={[
            styles.label,
            styles.activeLabel,
            styles.raised,
            { backgroundColor: colors.activeLabel },
          ]}>
          <icons.playCircle color={colors.activeLabelIcon} />
          <Text style={[typography.label, { color: colors.onActiveLabel }]}>
            {levelName(level)}
          </Text>
        </View>
      </View>
      {mascotMessage ? <MascotBubble message={mascotMessage} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  node: {
    width: sizes.node,
    height: sizes.node,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLarge: {
    width: sizes.nodeLarge,
    height: sizes.nodeLarge,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  raised: {
    boxShadow: shadows.raised,
  },
  chipShadow: {
    boxShadow: shadows.chip,
  },
  activeShadow: {
    boxShadow: shadows.activeNode,
  },
  // "Margin" frame of 1:490 is 14 px tall with the 16 px line shifted up 2 px.
  startMargin: {
    height: 14,
    alignItems: 'center',
  },
  startText: {
    marginTop: -2,
  },
  halo: {
    position: 'absolute',
    top: -HALO_OUTSET,
    bottom: -HALO_OUTSET,
    left: -HALO_OUTSET,
    right: -HALO_OUTSET,
  },
  labelMargin: {
    paddingTop: spacing.md,
  },
  label: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderRadius: radii.full,
  },
  labelChip: {
    boxShadow: shadows.chip,
  },
  activeLabel: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
});
