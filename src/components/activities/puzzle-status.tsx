import { StyleSheet, Text, View } from 'react-native';

import { activityIcons } from '@/media/activity';
import { colors, radii, typography } from '@/theme';

const palette = colors.light;

export function PuzzleStatus({
  execution,
  maxExecutions,
  limit,
}: {
  execution: number;
  maxExecutions: number;
  limit: string;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.chip, styles.execution]}>
        <activityIcons.Execution color="#70452E" />
        <Text style={[typography.captionBold, styles.executionText]}>
          Ejecución {execution} de {maxExecutions}
        </Text>
      </View>
      <View style={[styles.chip, styles.limit]}>
        <activityIcons.Limit color={palette.textPrimary} />
        <Text style={[typography.captionBold, styles.limitText]}>{limit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  execution: { backgroundColor: '#F7E9CE' },
  executionText: { color: '#70452E' },
  limit: { backgroundColor: palette.surfaceRaised, borderWidth: 1, borderColor: '#E8D3B0' },
  limitText: { color: palette.textPrimary },
});
