import { Redirect, router, usePreventRemove } from 'expo-router';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RecoveryIcon from '@/assets/icons/activity/recovery.svg';
import { ActivityHeader } from '@/components/activities/activity-header';
import { CrosswordGame } from '@/components/activities/crossword-game';
import { LevelResultScreen } from '@/components/activities/level-result-screen';
import { MatchingGame } from '@/components/activities/matching-game';
import { MemoramaGame } from '@/components/activities/memorama-game';
import { QuestionGame } from '@/components/activities/question-game';
import { WordSearchGame } from '@/components/activities/word-search-game';
import { AlertDialog } from '@/components/alert/alert-dialog';
import { PrimaryButton } from '@/components/primary-button';
import type { ActivityGameProps, ActivityOutcome } from '@/data/activity';
import {
  demoMaxLives,
  reserveDemoAttempt,
  settleDemoAttempt,
  useDemoProgress,
  type LevelReward,
} from '@/data/demo-progress';
import {
  finishActivity,
  levelActivityNames,
  newLevelAttempt,
  type ActivityName,
} from '@/data/level-attempt';
import type { Level, LevelPath, LevelPreview } from '@/data/level-path';
import { images } from '@/media';
import { matchingDemo } from '@/mocks/matching';
import { memoramaDemo } from '@/mocks/memorama';
import { questionsDemo } from '@/mocks/questions';
import { colors, radii, sheetColors, spacing, typography } from '@/theme';

const palette = colors.light;
const successMascot = require('@/assets/images/mascota-riendo.png');

const games: Record<ActivityName, ComponentType<ActivityGameProps>> = {
  Memorama: (props) => <MemoramaGame {...props} content={memoramaDemo.content} />,
  'Sopa de letras': WordSearchGame,
  Preguntas: (props) => <QuestionGame {...props} content={questionsDemo} />,
  Crucigrama: CrosswordGame,
  Relacionar: (props) => <MatchingGame {...props} content={matchingDemo} />,
};

export function DemoLevelAttempt({
  player,
  level,
  preview,
  path,
}: {
  player: string;
  level: Level;
  preview: LevelPreview;
  path: LevelPath;
}) {
  const { width } = useWindowDimensions();
  const wide = width >= 800;
  const progress = useDemoProgress(player);
  const token = useRef<number | null>(null);
  const attached = useRef(false);
  const [activityState, setActivityState] = useState(newLevelAttempt);
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [finalReward, setFinalReward] = useState<LevelReward | null>(null);
  const [outcome, setOutcome] = useState<ActivityOutcome | null>(null);
  const [exit, setExit] = useState<{ confirm: () => void } | null>(null);
  const [activity] = activityState.pending;
  const Game = activity && games[activity.name];
  const active = started && !!activity && finalReward === null;
  const allowExit = usePreventRemove(active, ({ repeat }) => setExit({ confirm: repeat }));
  const returnToPath = () => router.dismissTo('/');
  const goToTab = (tab: '/cartas' | '/tienda') => router.dismissTo(tab);

  useEffect(() => {
    attached.current = true;
    if (token.current === null) {
      const result = reserveDemoAttempt(player);
      if (result.kind === 'started') {
        token.current = result.id;
        setStarted(true);
      } else {
        setBusy(result.kind === 'busy');
      }
    }
    return () => {
      // Let React's development effect replay reconnect to the same reservation.
      const id = token.current;
      attached.current = false;
      queueMicrotask(() => {
        if (id !== null && token.current === id && !attached.current) {
          token.current = null;
          settleDemoAttempt(player, id, { status: 'lost' });
        }
      });
    };
  }, [player]);

  const restart = () => {
    const result = reserveDemoAttempt(player);
    if (result.kind !== 'started') return;
    token.current = result.id;
    setStarted(true);
    setActivityState(newLevelAttempt());
    setOutcome(null);
    setFinalReward(null);
  };

  const onOutcome = (value: ActivityOutcome) => {
    const id = token.current;
    if (id === null || outcome) return;
    const next = finishActivity(activityState, value);
    if (next.failure) {
      token.current = null;
      settleDemoAttempt(player, id, { status: 'lost' });
      setActivityState(next);
    } else if (next.pending.length === 0) {
      token.current = null;
      const reward = settleDemoAttempt(player, id, {
        status: 'passed',
        levelId: level.id,
        reward: { gems: preview.rewardGems, xp: preview.rewardXp },
      });
      if (reward) setFinalReward(reward);
      setActivityState(next);
    } else {
      setOutcome(value);
    }
  };

  if (busy) return <Redirect href="/" />;

  const resultProps = {
    levelTitle: level.title,
    levelNumber: level.number,
    unitNumber: path.unit.number,
    onBack: returnToPath,
    onRetry: restart,
    onShop: () => goToTab('/tienda'),
    onCard: () => goToTab('/cartas'),
  };
  if (finalReward) {
    const first = finalReward.xp > 0 || finalReward.gems > 0;
    return (
      <LevelResultScreen
        {...resultProps}
        result={{
          kind: 'passed',
          activities: activityState.completed,
          reward: finalReward,
          lesson: first
            ? level.final
              ? `Se desbloqueó la unidad ${path.unit.number + 1}: ${path.nextUnitTitle}.`
              : 'Repasaste cómo reconocer y reducir el sesgo en los sistemas algorítmicos.'
            : undefined,
          unit: level.final
            ? { title: path.unit.title, card: first ? path.closing.cardName : undefined }
            : undefined,
        }}
      />
    );
  }
  if (activityState.failure || (!started && progress.lives === 0)) {
    return (
      <LevelResultScreen
        {...resultProps}
        result={{
          kind: progress.lives === 0 ? 'no-lives' : 'failed',
          lives: progress.lives,
          maximumLives: demoMaxLives,
          nextLifeAt: progress.nextLifeAt,
          started,
        }}
      />
    );
  }
  if (!started || !Game) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.content}>
          <PrimaryButton label="Iniciar nivel" onPress={restart} />
        </View>
      </SafeAreaView>
    );
  }

  const passed = outcome === 'passed';
  const next = outcome && finishActivity(activityState, outcome);
  const nextName = next && next.pending[0]?.name.toLowerCase();

  return (
    <SafeAreaView style={styles.root}>
      <ActivityHeader
        title={level.title}
        level={level.number}
        completed={activityState.completed + Number(passed)}
        total={levelActivityNames.length}
        wide={wide}
        onExit={() => setExit({ confirm: returnToPath })}
      />
      <ScrollView
        key={`${activity.name}:${activity.execution}`}
        contentContainerStyle={[styles.content, wide && styles.wide]}>
        {activity.execution > 1 && (
          <View style={styles.recovery}>
            <RecoveryIcon color={palette.tabActive} />
            <Text style={[typography.caption, styles.body]}>
              Recuperación · Sus errores se reiniciaron.
            </Text>
          </View>
        )}
        <Game
          index={levelActivityNames.indexOf(activity.name) + 1}
          execution={activity.execution}
          wide={wide}
          onOutcome={onOutcome}
        />
      </ScrollView>
      {next ? (
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
                {passed ? '¡Actividad superada!' : 'Actividad pendiente de recuperación'}
              </Text>
              <Text style={[typography.body, styles.body]}>
                {passed
                  ? `Sigue con ${nextName}.`
                  : `Volverás a jugar ${activity.name.toLowerCase()} al final de la cola.`}
              </Text>
            </View>
          </View>
          <PrimaryButton
            label={
              next.pending[0]?.name === activity.name
                ? 'Reintentar actividad'
                : 'Siguiente actividad'
            }
            palette={
              passed ? { face: '#5F7230', label: palette.onSuccess, shadow: '#4A5A21' } : undefined
            }
            onPress={() => {
              setActivityState(next);
              setOutcome(null);
            }}
          />
        </View>
      ) : null}
      <AlertDialog
        visible={exit !== null}
        title="¿Salir del nivel?"
        message="Si sales ahora, pierdes la vida reservada y el intento termina."
        mascot={images.mascotaSeria}
        primaryLabel="Seguir jugando"
        secondaryLabel="Salir del intento"
        onPrimary={() => setExit(null)}
        onRequestClose={() => setExit(null)}
        onSecondary={() => {
          const id = token.current;
          if (!exit || id === null) return;
          token.current = null;
          settleDemoAttempt(player, id, { status: 'lost' });
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
  recovery: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
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
