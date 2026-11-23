import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authColors, spacing } from '@/theme';

type AuthScreenProps = {
  children: ReactNode;
  /** Bottom padding of the content (32 in 1:3, 0 in 1:302). */
  paddingBottom?: number;
  /** Drawn above the scroll content (alert banners). */
  overlay?: ReactNode;
};

/**
 * Shared frame of the access screens: light background (these screens have
 * no dark version in Figma), 16 px side padding, scroll and keyboard handling.
 */
export function AuthScreen({ children, paddingBottom = 32, overlay }: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: insets.top,
              paddingBottom: paddingBottom + insets.bottom,
            },
          ]}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: authColors.background },
  content: { paddingHorizontal: spacing.screen },
});
