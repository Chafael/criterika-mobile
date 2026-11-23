import { Image, StyleSheet, Text, View } from 'react-native';

import { images } from '@/media';
import { radii, shadows, sizes, spacing, typography, useColors } from '@/theme';

type MascotBubbleProps = {
  message: string;
};

/** Group frame of 1:500: 192 × 64, placed 80 px right and 48 px above the node column. */
const GROUP = { width: 192, height: 64, left: 80, top: -48 } as const;
/** Bubble pointer: 12 px square rotated 45°, centered 22 px from the bubble's left edge. */
const POINTER = { size: 12, centerX: 22 } as const;

/** Mascot "Guía" with speech bubble next to the active node (Figma 1:500). */
export function MascotBubble({ message }: MascotBubbleProps) {
  const colors = useColors();

  return (
    <View pointerEvents="none" style={styles.group} accessible accessibilityLabel={message}>
      <View style={[styles.bubble, { backgroundColor: colors.surfaceRaised }]}>
        <Text style={[typography.bubble, { color: colors.bubbleText }]}>{message}</Text>
        <View style={[styles.pointer, { backgroundColor: colors.surfaceRaised }]} />
      </View>
      <View style={styles.mascot}>
        <Image source={images.mascotaGuia} resizeMode="stretch" style={styles.mascotImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    position: 'absolute',
    width: GROUP.width,
    height: GROUP.height,
    left: GROUP.left,
    top: GROUP.top,
    justifyContent: 'center',
  },
  bubble: {
    width: sizes.bubbleWidth,
    paddingLeft: spacing.xl,
    paddingRight: 46.56,
    paddingTop: 7.25,
    paddingBottom: spacing.md,
    borderRadius: radii.md,
    boxShadow: shadows.raised,
  },
  pointer: {
    position: 'absolute',
    width: POINTER.size,
    height: POINTER.size,
    left: POINTER.centerX - POINTER.size / 2,
    bottom: -POINTER.size / 2,
    transform: [{ rotate: '45deg' }],
  },
  mascot: {
    position: 'absolute',
    left: 128,
    top: -4,
    width: sizes.mascot,
    height: sizes.mascot,
    // Figma's shadow follows the PNG alpha; drop-shadow does the same where supported.
    filter: [{ dropShadow: { offsetX: 0, offsetY: 4, standardDeviation: 3, color: 'rgba(0, 0, 0, 0.07)' } }],
  },
  mascotImage: {
    position: 'absolute',
    top: 0,
    height: '100%',
    left: '2.73%',
    width: '94.53%',
  },
});
