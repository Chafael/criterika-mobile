import { useEffect, useState, type ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Gems from '@/assets/icons/activity/result-gems.svg';
import Lesson from '@/assets/icons/activity/result-lesson.svg';
import LifeEmpty from '@/assets/icons/activity/result-life-empty.svg';
import Life from '@/assets/icons/activity/result-life.svg';
import Path from '@/assets/icons/activity/result-path.svg';
import Scales from '@/assets/icons/activity/result-scales.svg';
import Shop from '@/assets/icons/activity/result-shop.svg';
import Unit from '@/assets/icons/activity/result-unit.svg';
import Xp from '@/assets/icons/activity/result-xp.svg';
import { RewardCardArt } from '@/components/activities/reward-card-art';
import { PrimaryButton } from '@/components/primary-button';
import type { LevelReward } from '@/data/demo-progress';
import { icons } from '@/media';
import { colors, radii, shadows, spacing, typography } from '@/theme';

const palette = colors.light;
const celebration = require('@/assets/images/mascota-riendo.png');
const reflective = require('@/assets/images/mascota-reflexiva.png');
const primary = {
  face: palette.primary,
  label: palette.onActiveNode,
  shadow: 'rgba(53, 27, 5, 0.18)',
};
const secondary = { face: palette.surfaceCard, label: palette.textPrimary, shadow: 'transparent' };

export type LevelResultData =
  | {
      kind: 'passed';
      activities: number;
      reward: LevelReward;
      lesson?: string;
      unit?: { title: string; card?: string };
    }
  | {
      kind: 'failed' | 'no-lives';
      lives: number;
      maximumLives: number;
      nextLifeAt: number | null;
      started: boolean;
    };

export function LevelResultScreen({
  levelTitle,
  levelNumber,
  unitNumber,
  result,
  onBack,
  onRetry,
  onShop,
  onCard,
}: {
  levelTitle: string;
  levelNumber: number;
  unitNumber: number;
  result: LevelResultData;
  onBack: () => void;
  onRetry: () => void;
  onShop: () => void;
  onCard: () => void;
}) {
  const { width } = useWindowDimensions();
  const wide = width >= 800;
  const unitBadge = (
    <View style={styles.badge}>
      <Unit />
      <Text style={[typography.overline, styles.secondaryText]}>
        Unidad {unitNumber} • Nivel {levelNumber}
      </Text>
    </View>
  );

  let hero: ReactNode;
  let details: ReactNode;
  if (result.kind === 'passed') {
    const rewarded = result.reward.gems > 0 || result.reward.xp > 0;
    const card = result.unit?.card;
    hero = (
      <View style={styles.celebrate}>
        <Text accessibilityRole="header" style={styles.heading}>
          {result.unit ? '¡Unidad completada!' : '¡Nivel superado!'}
        </Text>
        <Text style={styles.subtitle}>
          {result.unit
            ? `Terminaste la unidad ${result.unit.title}.`
            : `Aprobaste las ${result.activities} actividades del nivel ${levelTitle}.`}
        </Text>
        <View style={styles.celebrationArt}>
          <Image style={styles.celebrationImage} resizeMode="contain" source={celebration} />
        </View>
      </View>
    );
    details = (
      <>
        {rewarded ? (
          <View style={styles.rewards}>
            <Reward icon={<Gems />} color="#FFDEA5" value={result.reward.gems} label="Gemas" />
            <Reward
              icon={<Xp />}
              color={palette.successContainer}
              value={result.reward.xp}
              label="XP · primera vez"
            />
          </View>
        ) : (
          <View style={styles.note}>
            <Text style={[typography.body, styles.secondaryText]}>
              Completaste una práctica de un nivel que ya habías aprobado.
            </Text>
          </View>
        )}
        {card && (
          <View style={styles.card}>
            <View style={styles.cardTitle}>
              <Text style={[typography.captionBold, styles.cardBadge]}>Nueva carta obtenida</Text>
              <Text style={[typography.caption, styles.secondaryText]}>Unidad {unitNumber}</Text>
            </View>
            <View style={styles.cardSummary}>
              <RewardCardArt />
              <View style={styles.flex}>
                <Text style={[typography.title, styles.ink]}>{card}</Text>
                <Text style={[typography.body, styles.secondaryText]}>
                  Ya está en tu colección.
                </Text>
              </View>
            </View>
          </View>
        )}
        {result.lesson && (
          <View style={styles.note}>
            <Lesson />
            <Text style={[typography.body, styles.secondaryText, styles.flex]}>
              {result.lesson}
            </Text>
          </View>
        )}
        <PrimaryButton
          label={card ? 'Ver mi carta' : 'Continuar'}
          palette={primary}
          trailing={<icons.arrowForward color={palette.onActiveNode} />}
          onPress={card ? onCard : onBack}
          style={styles.action}
        />
      </>
    );
  } else {
    const noLives = result.kind === 'no-lives';
    hero = (
      <View style={styles.failure}>
        <Image style={styles.reflective} resizeMode="contain" source={reflective} />
        <Text accessibilityRole="header" style={styles.heading}>
          {result.started ? 'No superaste el nivel' : 'No te quedan vidas'}
        </Text>
        {noLives ? (
          <RecoveryTime nextLifeAt={result.nextLifeAt} />
        ) : (
          <Text style={styles.subtitle}>
            Una actividad falló 3 veces.{' '}
            {result.lives === 1 ? 'Te queda 1 vida.' : `Te quedan ${result.lives} vidas.`}
          </Text>
        )}
        <View
          accessible
          accessibilityLabel={`${result.lives} de ${result.maximumLives} vidas disponibles`}
          style={styles.hearts}>
          {Array.from({ length: result.maximumLives }, (_, n) =>
            n < result.lives ? <Life key={n} /> : <LifeEmpty key={n} />,
          )}
        </View>
      </View>
    );
    details = (
      <>
        {wide && unitBadge}
        <View style={[styles.note, styles.advice]}>
          <View style={styles.scales}>
            <Scales />
          </View>
          <View style={styles.flex}>
            <Text style={[typography.label, styles.ink]}>Un error también enseña</Text>
            <Text style={[typography.body, styles.secondaryText]}>
              {noLives
                ? 'Recupera tu energía para volver a deliberar.'
                : 'Repasa los conceptos del nivel en el diccionario antes de volver a intentarlo.'}
            </Text>
          </View>
        </View>
        <PrimaryButton
          label={noLives ? 'Comprar vidas' : 'Reintentar nivel'}
          leading={noLives ? <Shop /> : <icons.refresh color={palette.onActiveNode} />}
          palette={primary}
          onPress={noLives ? onShop : onRetry}
          style={styles.action}
        />
        <PrimaryButton
          label="Volver al camino"
          leading={<Path />}
          palette={secondary}
          onPress={onBack}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.content, wide && styles.wide]}>
          {result.kind !== 'passed' && !wide && unitBadge}
          <View style={[styles.hero, wide && styles.flex]}>{hero}</View>
          <View style={[styles.details, wide && styles.flex]}>{details}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Reward({
  icon,
  color,
  value,
  label,
}: {
  icon: ReactNode;
  color: string;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.reward}>
      <View style={[styles.rewardIcon, { backgroundColor: color }]}>{icon}</View>
      <Text style={styles.amount}>+{value}</Text>
      <Text style={[typography.label, styles.secondaryText]}>{label}</Text>
    </View>
  );
}

function RecoveryTime({ nextLifeAt }: { nextLifeAt: number | null }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (nextLifeAt === null) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [nextLifeAt]);
  if (nextLifeAt === null) return <Text style={styles.subtitle}>No tienes vidas disponibles.</Text>;
  const seconds = Math.max(0, Math.ceil((nextLifeAt - now) / 1000));
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  return <Text style={styles.subtitle}>Recuperas una vida en {clock}.</Text>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.background },
  scroll: { flexGrow: 1 },
  content: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    padding: spacing.screen,
    gap: spacing.screen,
    paddingBottom: 48,
  },
  wide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 1070,
    gap: 48,
    paddingVertical: 60,
  },
  hero: { gap: spacing.screen },
  details: { gap: spacing.screen },
  flex: { flex: 1 },
  celebrate: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
    backgroundImage:
      'radial-gradient(ellipse at 50% 68%, rgba(211, 233, 139, 0.44) 0%, rgba(240, 220, 189, 0.26) 42%, transparent 73%)',
  },
  celebrationArt: {
    height: 188,
    width: 174,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing.screen,
  },
  celebrationImage: { width: 158, height: 166 },
  heading: {
    ...typography.headline,
    fontSize: 26,
    lineHeight: 34,
    color: palette.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 330,
    color: palette.textSecondary,
    textAlign: 'center',
  },
  rewards: { flexDirection: 'row', gap: spacing.md },
  reward: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 125,
    gap: 3,
    backgroundColor: palette.surfaceRaised,
    borderRadius: radii.md,
    boxShadow: shadows.raised,
    padding: spacing.md,
  },
  rewardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  amount: { ...typography.headline, color: palette.textPrimary },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.screen,
    minHeight: 78,
    gap: spacing.md,
    borderRadius: radii.md,
    backgroundColor: palette.surfaceChip,
  },
  advice: { backgroundColor: palette.surfaceCard },
  action: { marginTop: 8, marginBottom: 4 },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.surfaceCard,
    borderRadius: radii.full,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
  },
  failure: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceRaised,
    backgroundImage:
      'linear-gradient(255deg, rgba(246, 234, 213, 0.45) 0%, transparent 50%, rgba(255, 226, 221, 0.55) 100%)',
    borderRadius: radii.md,
    padding: spacing.screen,
    minHeight: 318,
    gap: 6,
  },
  reflective: { width: 126, height: 142, marginBottom: spacing.md },
  hearts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.md,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: palette.surfaceChip,
    borderRadius: radii.full,
  },
  scales: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceTrack,
    borderRadius: radii.md,
  },
  card: {
    borderRadius: radii.md,
    padding: spacing.screen,
    backgroundColor: palette.surfaceRaised,
    gap: 8,
    boxShadow: shadows.raised,
  },
  cardTitle: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBadge: {
    backgroundColor: '#FFDEA5',
    borderRadius: radii.full,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: palette.textPrimary,
  },
  cardSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.screen,
    backgroundColor: palette.surfaceChip,
    borderRadius: radii.xs,
    padding: spacing.screen,
  },
  secondaryText: { color: palette.textSecondary },
  ink: { color: palette.textPrimary },
});
