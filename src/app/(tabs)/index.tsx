import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { LevelPathView } from '@/components/level-path/level-path-view';
import { LevelPreviewSheet } from '@/components/level-path/level-preview-sheet';
import { NextUnitCard } from '@/components/level-path/next-unit-card';
import { UnitCard } from '@/components/level-path/unit-card';
import { getUnitProgress, useLevelPath, type Level } from '@/data/level-path';
import { spacing, useColors } from '@/theme';

/** "06. Camino de niveles" (Figma 1:388) with its level preview (26:78). */
export default function Niveles() {
  const colors = useColors();
  const path = useLevelPath();
  const progress = getUnitProgress(path);
  const [selected, setSelected] = useState<Level | null>(null);
  const preview = selected
    ? (path.previews.find((item) => item.levelId === selected.id) ?? null)
    : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.unitMargin}>
          <UnitCard
            unitNumber={path.unit.number}
            title={path.unit.title}
            description={path.unit.description}
            completed={progress.completed}
            total={progress.total}
          />
        </View>
        <LevelPathView
          levels={path.levels}
          closing={path.closing}
          mascotMessage={path.mascotMessage}
          onStartLevel={setSelected}
        />
        <View style={styles.nextMargin}>
          <NextUnitCard title={path.nextUnitTitle} />
        </View>
      </ScrollView>

      <LevelPreviewSheet
        visible={selected !== null}
        unitNumber={path.unit.number}
        level={selected}
        preview={preview}
        // Activities are not built yet; starting just closes the preview.
        onStart={() => setSelected(null)}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    // Figma "Main" pb 96 minus the 80 px tab bar, which here sits below the scroll.
    paddingBottom: spacing.screen,
  },
  unitMargin: {
    paddingTop: spacing.md,
    // 16 px card margin + 20 px gap before the path (1:422 ends at 210, path starts at 230).
    paddingBottom: spacing.screen + spacing.section,
    paddingHorizontal: spacing.screen,
  },
  nextMargin: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.screen,
  },
});
