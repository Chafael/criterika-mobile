import { Modal, StyleSheet, View } from 'react-native';

import { alertColors } from '@/theme';

import { AlertCard, type AlertContent } from './alert-card';

type AlertDialogProps = AlertContent & {
  visible: boolean;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Android back button. Defaults to the secondary action, then the primary one. */
  onRequestClose?: () => void;
};

/**
 * "Ventana" alert centered over a dimmed screen
 * (scrim 37:2119, card 37:2109 in "19.09 Cuenta bloqueada").
 */
export function AlertDialog({
  visible,
  onRequestClose,
  onPrimary,
  onSecondary,
  ...card
}: AlertDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onRequestClose ?? onSecondary ?? onPrimary}>
      <View style={styles.root}>
        <View accessibilityViewIsModal style={styles.card}>
          <AlertCard variant="dialog" onPrimary={onPrimary} onSecondary={onSecondary} {...card} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: alertColors.scrim,
  },
  card: { width: '100%', maxWidth: 326 },
});
