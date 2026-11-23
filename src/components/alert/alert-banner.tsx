import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme';

import { AlertCard, type AlertContent } from './alert-card';

type AlertBannerProps = {
  /** Nothing is rendered while null. */
  alert: AlertContent | null;
  onDismiss: () => void;
};

/** Distance from the top of the screen content (37:2981 and 37:3045 sit at y = 70). */
const BANNER_TOP = 70;

/**
 * "Aviso" alert floating over the top of the screen.
 * Place it as the last child of the screen root so it draws above the content.
 */
export function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const insets = useSafeAreaInsets();

  if (!alert) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={[styles.root, { top: insets.top + BANNER_TOP }]}>
      <AlertCard variant="banner" onPress={onDismiss} {...alert} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: spacing.screen,
    right: spacing.screen,
  },
});
