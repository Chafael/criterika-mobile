import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import type { Level, LevelPreview } from '@/data/level-path';
import { radii, sheetColors, sizes, spacing, typography, useColors } from '@/theme';

type LevelPreviewSheetProps = {
  visible: boolean;
  unitNumber: number;
  level: Level | null;
  preview: LevelPreview | null;
  demo?: boolean;
  onStart: () => void;
  onClose: () => void;
};

/** Bottom sheet with the level summary (Figma 26:239 scrim + 26:240 sheet). */
export function LevelPreviewSheet({
  visible,
  unitNumber,
  level,
  preview,
  demo,
  onStart,
  onClose,
}: LevelPreviewSheetProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar vista previa"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
        />
        {level && preview ? (
          <View
            accessibilityViewIsModal
            style={[styles.sheet, { paddingBottom: 28 + insets.bottom }]}>
            <View style={styles.handleRow}>
              <View style={styles.handle} />
            </View>
            <Text style={[typography.sheetOverline, { color: sheetColors.overline }]}>
              UNIDAD {unitNumber} · NIVEL {level.number}
            </Text>
            <Text
              accessibilityRole="header"
              style={[typography.headline, { color: sheetColors.title }]}>
              {level.title}
            </Text>

            <View style={styles.activities}>
              <Text style={[typography.sheetSection, { color: sheetColors.body }]}>
                {preview.activities.length} actividades en este nivel
              </Text>
              <View style={styles.chips}>
                {preview.activities.map((activity) => (
                  <View key={activity} style={styles.chip}>
                    <Text style={[typography.chip, { color: sheetColors.body }]}>{activity}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.rewards}>
              <View style={styles.rewardValues}>
                <Text style={[typography.rewardValue, { color: sheetColors.title }]}>
                  +{preview.rewardGems} gemas
                </Text>
                <Text style={[typography.rewardValue, { color: sheetColors.title }]}>
                  +{preview.rewardXp} XP
                </Text>
              </View>
              <Text style={[typography.sheetNote, { color: sheetColors.body }]}>
                Al aprobar el nivel por primera vez.
              </Text>
            </View>

            <PrimaryButton label="Iniciar nivel" onPress={onStart} />
            {demo ? (
              <Text style={[typography.sheetNote, { color: sheetColors.body }]}>
                Prueba disponible: memorama. Las recompensas y el progreso del camino son de
                ejemplo.
              </Text>
            ) : null}
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.secondary}>
              <Text style={[typography.textButton, { color: sheetColors.body }]}>Ahora no</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    gap: spacing.xxl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.section,
    backgroundColor: sheetColors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: 'hidden',
  },
  handleRow: {
    alignItems: 'center',
  },
  handle: {
    width: sizes.handleWidth,
    height: sizes.handleHeight,
    borderRadius: 2,
    backgroundColor: sheetColors.handle,
  },
  activities: {
    gap: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: sheetColors.chip,
  },
  rewards: {
    gap: spacing.md,
    padding: spacing.xxl,
    borderRadius: radii.lg,
    backgroundColor: sheetColors.rewardBox,
  },
  rewardValues: {
    flexDirection: 'row',
    gap: spacing.block,
  },
  secondary: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
