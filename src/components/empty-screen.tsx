import { StyleSheet, View } from 'react-native';

import { useColors } from '@/theme';

/** Blank screen on the app background, used until each tab is built. */
export function EmptyScreen() {
  const colors = useColors();
  return <View style={[styles.root, { backgroundColor: colors.background }]} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
