import { Pressable, StyleSheet } from 'react-native';

import { icons } from '@/media';
import { authColors, shadows } from '@/theme';

type BackButtonProps = {
  accessibilityLabel: string;
  onPress: () => void;
  /** Card (#F6EAD5, 1:80 / 1:305) or field (#F9F1E4, 1:181) fill. */
  surface: 'card' | 'field';
  /** 16 px arrow (1:81) or the thinner 13.28 px arrow (1:182). */
  arrow?: 'regular' | 'thin';
  /** Small drop shadow (1:80, 1:181). 1:305 has none. */
  elevated?: boolean;
};

/** 44 px round back button at the top left of the access screens. */
export function BackButton({
  accessibilityLabel,
  onPress,
  surface,
  arrow = 'regular',
  elevated = true,
}: BackButtonProps) {
  const Arrow = arrow === 'thin' ? icons.arrowBackThin : icons.arrowBack;
  const size = arrow === 'thin' ? 13.275 : 16;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[
        styles.root,
        {
          backgroundColor: surface === 'card' ? authColors.surfaceCard : authColors.surfaceField,
        },
        elevated && styles.elevated,
      ]}>
      <Arrow width={size} height={size} color={authColors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elevated: { boxShadow: shadows.chip },
});
