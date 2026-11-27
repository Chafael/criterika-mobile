import { StyleSheet, Text, View } from 'react-native';

import { RewardCardArt } from '@/components/activities/reward-card-art';
import { useDemoProgress } from '@/data/demo-progress';
import { demoClosingId, useDemoPlayer, useLevelPath } from '@/data/level-path';
import { radii, spacing, typography, useColors } from '@/theme';

export default function Cartas() {
  const colors = useColors();
  const path = useLevelPath();
  const { completed } = useDemoProgress(useDemoPlayer());
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text accessibilityRole="header" style={[typography.headline, { color: colors.textPrimary }]}>
        Mi colección
      </Text>
      {completed.includes(demoClosingId) ? (
        <View style={[styles.card, { backgroundColor: colors.surfaceCard }]}>
          <RewardCardArt />
          <View style={styles.copy}>
            <Text style={[typography.title, { color: colors.textPrimary }]}>
              {path.closing.cardName}
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              Carta obtenida al completar la unidad {path.unit.number} de demostración.
            </Text>
          </View>
        </View>
      ) : (
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          Completa el cierre de una unidad para obtener su carta.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.screen, alignItems: 'center', gap: spacing.screen },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    gap: spacing.screen,
    padding: spacing.screen,
    width: '100%',
    maxWidth: 540,
  },
  copy: { flex: 1 },
});
