import { Redirect, router, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityHeader } from '@/components/activities/activity-header';
import { MemoramaGame } from '@/components/activities/memorama-game';
import { AlertDialog } from '@/components/alert/alert-dialog';
import { PrimaryButton } from '@/components/primary-button';
import type { ActivityOutcome } from '@/data/activity';
import { useLevelPath, type Level } from '@/data/level-path';
import { images } from '@/media';
import { memoramaDemo } from '@/mocks/memorama';
import { colors, radii, sheetColors, spacing, typography } from '@/theme';

const palette = colors.light;
const successMascot = require('@/assets/images/mascota-riendo.png');

export default function LevelScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const path = useLevelPath();
  const level = path.levels.find(({ id }) => id === levelId && id === memoramaDemo.levelId);

  return level ? <DemoAttempt key={level.id} level={level} /> : <Redirect href="/" />;
}

function DemoAttempt({ level }: { level: Level }) {
  const { width } = useWindowDimensions();
  const wide = width >= 800;
  const [execution, setExecution] = useState(1);
  const [outcome, setOutcome] = useState<ActivityOutcome | null>(null);
  const [exit, setExit] = useState<{ confirm: () => void } | null>(null);
  const content = memoramaDemo.content;
  const passed = outcome === 'passed';
  const canRetry = outcome === 'failed' && execution < content.maxExecutions;
  const active = !passed && (outcome === null || canRetry);

  const allowExit = usePreventRemove(active, ({ repeat }) => setExit({ confirm: repeat }));
  const returnToPath = () => router.dismissTo('/');
  const onExit = () => {
    if (active) setExit({ confirm: returnToPath });
    else returnToPath();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ActivityHeader
        title={level.title}
        level={level.number}
        completed={passed ? 1 : 0}
        total={1}
        wide={wide}
        onExit={onExit}
      />
      <ScrollView contentContainerStyle={[styles.content, wide && styles.wide]}>
        <MemoramaGame
          key={execution}
          content={content}
          execution={execution}
          wide={wide}
          onOutcome={setOutcome}
        />
      </ScrollView>
      {outcome ? (
        <View
          style={[styles.result, passed && styles.resultSuccess]}
          accessibilityLiveRegion="polite">
          <View style={styles.resultCopy}>
            <Image
              source={passed ? successMascot : images.mascotaGuia}
              resizeMode="contain"
              style={styles.resultMascot}
            />
            <View style={styles.resultText}>
              <Text
                accessibilityRole="header"
                style={[typography.title, passed ? styles.success : styles.title]}>
                {passed
                  ? '¡Actividad superada!'
                  : canRetry
                    ? 'Vuelve a intentar el memorama'
                    : 'Actividad no superada'}
              </Text>
              <Text style={[typography.body, styles.body]}>
                {passed
                  ? 'Encontraste todos los pares y completaste el nivel de prueba.'
                  : canRetry
                    ? 'Alcanzaste el límite de errores. Puedes volver a jugar con el tablero reiniciado.'
                    : 'Se agotaron las ejecuciones de este intento. Puedes volver al camino e iniciar otro.'}
              </Text>
            </View>
          </View>
          <PrimaryButton
            label={canRetry ? 'Reintentar actividad' : 'Volver al camino'}
            palette={
              passed ? { face: '#5F7230', label: palette.onSuccess, shadow: '#4A5A21' } : undefined
            }
            onPress={() => {
              if (canRetry) {
                setExecution((current) => current + 1);
                setOutcome(null);
              } else {
                returnToPath();
              }
            }}
          />
        </View>
      ) : null}
      <AlertDialog
        visible={exit !== null}
        title="¿Salir del nivel?"
        message="Si sales ahora, el intento termina y el avance en este nivel de prueba no se guarda."
        mascot={images.mascotaSeria}
        primaryLabel="Seguir jugando"
        secondaryLabel="Salir del intento"
        onPrimary={() => setExit(null)}
        onRequestClose={() => setExit(null)}
        onSecondary={() => {
          if (!exit) return;
          setExit(null);
          allowExit();
          exit.confirm();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.background },
  content: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    padding: spacing.screen,
    paddingBottom: spacing.section,
  },
  wide: { maxWidth: 1160, paddingTop: spacing.section, paddingHorizontal: spacing.section },
  result: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    backgroundColor: sheetColors.rewardBox,
    boxShadow: '0px -4px 16px rgba(43, 20, 12, 0.12)',
    padding: 20,
    gap: spacing.screen,
  },
  resultSuccess: { backgroundColor: '#ECF1DF' },
  resultCopy: { flexDirection: 'row', alignItems: 'center', gap: spacing.screen },
  resultMascot: { width: 72, height: 72 },
  resultText: { flex: 1 },
  title: { color: sheetColors.title },
  success: { color: '#38471C' },
  body: { color: palette.textSecondary },
});
