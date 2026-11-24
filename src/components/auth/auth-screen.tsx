import type { ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authColors, spacing } from '@/theme';

type AuthScreenProps = {
  children: ReactNode;
  /** Bottom padding of the content (32 in 1:3, 0 in 1:302). Scrolling screens only. */
  paddingBottom?: number;
  /** Drawn above the content (alert banners). */
  overlay?: ReactNode;
  /**
   * `fixed` fits the content between the safe areas without scrolling; the
   * screen lays it out with FitSpace. With the keyboard open, the whole
   * content slides up instead of shrinking.
   */
  layout?: 'scroll' | 'fixed';
  /**
   * Fixed layout only: height at the bottom of the content that may stay
   * under the keyboard (for example, a footnote under the form).
   */
  keyboardOffset?: number;
};

/**
 * Shared frame of the access screens: light background (these screens have
 * no dark version in Figma), 16 px side padding, safe areas and keyboard handling.
 */
export function AuthScreen({
  children,
  paddingBottom = 32,
  overlay,
  layout = 'scroll',
  keyboardOffset = 0,
}: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  if (layout === 'fixed') {
    return (
      <View style={styles.root}>
        <KeyboardAvoidingView
          style={styles.root}
          behavior="position"
          contentContainerStyle={styles.root}
          keyboardVerticalOffset={keyboardOffset + insets.bottom}>
          <Pressable
            accessible={false}
            onPress={Keyboard.dismiss}
            style={[styles.fixed, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {children}
          </Pressable>
        </KeyboardAvoidingView>
        {overlay}
      </View>
    );
  }

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
  /** Content column of the fixed layout; overflow is clipped, never scrolled. */
  fixed: { flex: 1, overflow: 'hidden', paddingHorizontal: spacing.screen },
});
