import type { FC, ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { authColors, authTypography, shadows, typography } from '@/theme';

export type FieldIcon = {
  Icon: FC<SvgProps>;
  width: number;
  height: number;
  color?: string;
};

type TrailingAction = FieldIcon & {
  accessibilityLabel: string;
  onPress: () => void;
};

export type TextFieldProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  label: string;
  /** "plain" draws the asterisk in the label color (1:107), "danger" in red (1:118). */
  requiredMark?: 'plain' | 'danger';
  /** 15 px label (1:35) or 13 px label (1:107). */
  labelSize?: 'large' | 'small';
  /** Optional icon before the label (1:210). */
  labelIcon?: FieldIcon;
  /** Element at the right of the label row: a link or a hint (1:47, 1:276). */
  labelAccessory?: ReactNode;
  /** Space between label row and input. */
  gap: number;
  /** Input fill: field (#F9F1E4) or raised (#FFFDF8, 1:111). */
  surface?: 'field' | 'raised';
  radius?: 8 | 12;
  height?: 48 | 56;
  /** Soft card shadow under the input (1:39). */
  elevated?: boolean;
  /** Icon centered in a 48 px slot at the left; the text starts at 44 px. */
  leadingIcon?: FieldIcon;
  trailingAction?: TrailingAction;
  /** Code input style: Bold 18 uppercase (1:283). */
  variant?: 'text' | 'code';
  /** Content under the input (notes, requirements). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Labeled input used across the access flow (1:32, 1:104, 1:272, 1:208, 1:329). */
export function TextField({
  label,
  requiredMark,
  labelSize = 'small',
  labelIcon,
  labelAccessory,
  gap,
  surface = 'field',
  radius = 12,
  height = 48,
  elevated = false,
  leadingIcon,
  trailingAction,
  variant = 'text',
  children,
  style,
  ...inputProps
}: TextFieldProps) {
  const labelStyle = labelSize === 'large' ? authTypography.fieldLabel : typography.label;
  const accessibleLabel = requiredMark ? `${label}, obligatorio` : label;

  return (
    <View style={[styles.root, { gap }, style]}>
      <View style={styles.labelRow}>
        <View style={styles.labelStart}>
          {labelIcon ? (
            <labelIcon.Icon
              width={labelIcon.width}
              height={labelIcon.height}
              color={labelIcon.color ?? authColors.link}
            />
          ) : null}
          <Text style={[labelStyle, { color: authColors.textPrimary }]}>
            {label}
            {requiredMark ? (
              <Text style={requiredMark === 'danger' ? { color: authColors.required } : undefined}>
                {' *'}
              </Text>
            ) : null}
          </Text>
        </View>
        {labelAccessory}
      </View>
      <View
        style={[
          styles.box,
          {
            height,
            borderRadius: radius,
            backgroundColor:
              surface === 'raised' ? authColors.surfaceRaised : authColors.surfaceField,
          },
          elevated && styles.elevated,
        ]}>
        <TextInput
          accessibilityLabel={accessibleLabel}
          placeholderTextColor={authColors.placeholder}
          style={[
            variant === 'code' ? authTypography.codeInput : authTypography.input,
            styles.input,
            {
              color: authColors.textPrimary,
              paddingLeft: leadingIcon ? 44 : 16,
              paddingRight: trailingAction ? 48 : 16,
            },
          ]}
          {...inputProps}
        />
        {leadingIcon ? (
          <View pointerEvents="none" style={styles.leading}>
            <leadingIcon.Icon
              width={leadingIcon.width}
              height={leadingIcon.height}
              color={leadingIcon.color ?? authColors.textSecondary}
            />
          </View>
        ) : null}
        {trailingAction ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={trailingAction.accessibilityLabel}
            onPress={trailingAction.onPress}
            hitSlop={4}
            style={[styles.trailing, { right: height === 56 ? 6 : 4 }]}>
            <trailingAction.Icon
              width={trailingAction.width}
              height={trailingAction.height}
              color={trailingAction.color ?? authColors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'stretch' },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelStart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  box: {
    justifyContent: 'center',
  },
  elevated: { boxShadow: shadows.card },
  input: {
    flex: 1,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  /** Icons sit centered 24 px from the left edge (1:42, 1:53, 1:125). */
  leading: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** 44 px target centered 26 px from the right edge (1:54); 28 px on the 56 px code field (1:284). */
  trailing: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
