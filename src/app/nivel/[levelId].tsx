import { Redirect, useLocalSearchParams } from 'expo-router';

import { DemoLevelAttempt } from '@/components/activities/demo-level-attempt';
import { findPathLevel, useDemoPlayer, useLevelPath } from '@/data/level-path';

export default function LevelScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const path = useLevelPath();
  const player = useDemoPlayer();
  const level = findPathLevel(path, levelId);
  const preview = path.previews.find((item) => item.levelId === levelId);

  if (!level?.playable || level.status === 'locked' || !preview) return <Redirect href="/" />;
  return (
    <DemoLevelAttempt
      key={`${player}:${level.id}`}
      player={player}
      level={level}
      preview={preview}
      path={path}
    />
  );
}
