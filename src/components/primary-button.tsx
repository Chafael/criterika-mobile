import { useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { pressMotion, radii, sizes, typography, useColors } from '@/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

/**
 * Primary action ("Button - Iniciar nivel", Figma 130:2101).
 *
 * The design's hard shadow (`0 4px 0 #BF730D`, no blur) is drawn as a
 * same-shaped layer offset 4 px down. On press the face slides down 4 px
 * in 100 ms, covering that layer, so the shadow goes from 4 px to 0.
 * Only `transform` is animated, which runs on the native driver.
 */
export function PrimaryButton({ label, onPress, style, accessibilityHint }: PrimaryButtonProps) {
  const colors = useColors();
  const [offset] = useState(() => new Animated.Value(0));

  const animateTo = (toValue: number) => {
    Animated.timing(offset, {
      toValue,
      duration: pressMotion.durationMs,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      onPressIn={() => animateTo(pressMotion.depth)}
      onPressOut={() => animateTo(0)}
      style={[styles.root, style]}>
      <View
        style={[styles.layer, styles.shadow, { backgroundColor: colors.primaryShadow }]}
      />
      <Animated.View
        style={[
          styles.layer,
          { backgroundColor: colors.primary, transform: [{ translateY: offset }] },
        ]}>
        <Text style={[typography.button, { color: colors.onPrimary }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    height: sizes.primaryButtonHeight,
    width: '100%',
  },
  layer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  shadow: {
    top: pressMotion.depth,
    bottom: -pressMotion.depth,
  },
});
