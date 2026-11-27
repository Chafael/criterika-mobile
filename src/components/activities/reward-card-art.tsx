import { Image, StyleSheet, View } from 'react-native';

import Glow from '@/assets/icons/activity/reward-card-glow.svg';
import Ground from '@/assets/icons/activity/reward-card-ground.svg';
import Left from '@/assets/icons/activity/reward-card-left.svg';
import Middle from '@/assets/icons/activity/reward-card-middle.svg';
import Right from '@/assets/icons/activity/reward-card-right.svg';
import { colors, sheetColors } from '@/theme';

const mascot = require('@/assets/images/reward-card-mascot.png');

export function RewardCardArt() {
  return (
    <View style={styles.card} accessible={false}>
      <View style={styles.scene}>
        <View style={styles.ground}>
          <Ground />
        </View>
        <View style={styles.glow}>
          <Glow />
        </View>
        <Image source={mascot} resizeMode="contain" style={styles.mascot} />
        <View style={styles.left}>
          <Left />
        </View>
        <View style={styles.middle}>
          <Middle />
        </View>
        <View style={styles.right}>
          <Right />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 48,
    height: 60,
    padding: 2,
    borderWidth: 1,
    borderColor: sheetColors.handle,
    borderRadius: 5,
    backgroundColor: colors.light.surfaceRaised,
  },
  scene: { flex: 1, overflow: 'hidden', borderRadius: 3, backgroundColor: sheetColors.chip },
  ground: { position: 'absolute', left: -9.8, top: -11.1 },
  glow: { position: 'absolute', left: 22.86, top: 35.92 },
  mascot: { position: 'absolute', left: 4.57, top: 1.31, width: 34, height: 34 },
  left: { position: 'absolute', left: 2.61, top: 37.88 },
  middle: { position: 'absolute', left: 15.67, top: 37.88 },
  right: { position: 'absolute', left: 28.41, top: 37.88 },
});
