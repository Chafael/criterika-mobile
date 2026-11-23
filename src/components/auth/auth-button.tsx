import type { FC } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { authColors, authTypography, shadows } from '@/theme';

import type { FieldIcon } from './text-field';

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  /** Large: Bold 18/26 (1:61, 1:225). Medium: Bold 15/20 +0.15 (1:171, 1:290, 1:380). */
  size: 'large' | 'medium';
  height: number;
  icon?: FieldIcon & { Icon: FC<SvgProps> };
  iconPosition?: 'leading' | 'trailing';
  /** Raised (1:59) or the small drop shadow of 1:288. */
  elevation?: 'raised' | 'chip';
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

/** Orange pill used as the main action of each access screen. */
export function AuthButton({
  label,
  onPress,
  size,
  height,
  icon,
  iconPosition = 'trailing',
  elevation = 'raised',
  accessibilityHint,
  style,
}: AuthButtonProps) {
  const iconNode = icon ? (
    <icon.Icon width={icon.width} height={icon.height} color={icon.color ?? authColors.onPrimary} />
  ) : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        {
          height,
          boxShadow: elevation === 'raised' ? shadows.raised : shadows.chip,
        },
        pressed && styles.pressed,
        style,
      ]}>
      {iconPosition === 'leading' ? iconNode : null}
      <Text
        style={[
          size === 'large' ? authTypography.buttonLarge : authTypography.fieldLabel,
          { color: authColors.onPrimary },
        ]}>
        {label}
      </Text>
      {iconPosition === 'trailing' ? iconNode : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    borderRadius: 9999,
    backgroundColor: authColors.primary,
  },
  pressed: { opacity: 0.85 },
});
