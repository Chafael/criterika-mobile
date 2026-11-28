import { useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { pressMotion, radii, sizes, typography, useColors } from '@/theme';

/** Face, hard shadow and label colors. Defaults to the theme's primary action. */
export type PrimaryButtonPalette = {
  face: string;
  shadow: string;
  label: string;
};

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  palette?: PrimaryButtonPalette;
  /** Face height in px (52 by default, 130:2101). */
  height?: number;
  labelStyle?: StyleProp<TextStyle>;
  trailing?: ReactNode;
  leading?: ReactNode;
  disabled?: boolean;
};

/**
 * Primary action ("Button - Iniciar nivel", Figma 130:2101).
 *
 * The design's hard shadow (`0 4px 0 #BF730D`, no blur) is drawn as a
 * same-shaped layer offset 4 px down. On press the face slides down 4 px
 * in 100 ms, covering that layer, so the shadow goes from 4 px to 0.
 * Only `transform` is animated, which runs on the native driver.
 */
export function PrimaryButton({
  label,
  onPress,
  style,
  accessibilityHint,
  palette,
  height = sizes.primaryButtonHeight,
  labelStyle,
  trailing,
  leading,
  disabled = false,
}: PrimaryButtonProps) {
  const colors = useColors();
  const {
    face,
    shadow,
    label: labelColor,
  } = palette ?? {
    face: colors.primary,
    shadow: colors.primaryShadow,
    label: colors.onPrimary,
  };
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
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => animateTo(pressMotion.depth)}
      onPressOut={() => animateTo(0)}
      style={[styles.root, { height }, disabled && styles.disabled, style]}>
      <View style={[styles.layer, styles.shadow, { backgroundColor: shadow }]} />
      <Animated.View
        style={[styles.layer, { backgroundColor: face, transform: [{ translateY: offset }] }]}>
        {leading}
        <Text style={[typography.button, labelStyle, { color: labelColor }]}>{label}</Text>
        {trailing}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  disabled: { opacity: 0.55 },
  layer: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  shadow: {
    top: pressMotion.depth,
    bottom: -pressMotion.depth,
  },
});
