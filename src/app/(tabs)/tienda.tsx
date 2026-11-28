import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AlertDialog } from '@/components/alert/alert-dialog';
import { PrimaryButton } from '@/components/primary-button';
import {
  demoLifePackages,
  demoMaxLives,
  purchaseDemoLives,
  useDemoProgress,
} from '@/data/demo-progress';
import { useDemoPlayer } from '@/data/level-path';
import { icons } from '@/media';
import { radii, spacing, typography, useColors } from '@/theme';

export default function Tienda() {
  const colors = useColors();
  const player = useDemoPlayer();
  const progress = useDemoProgress(player);
  const [pack, setPack] = useState<(typeof demoLifePackages)[number]>();
  const [notice, setNotice] = useState('');
  return (
    <ScrollView contentContainerStyle={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text
          accessibilityRole="header"
          style={[typography.headline, { color: colors.textPrimary }]}>
          Paquetes de vidas
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          Usa tus gemas de demostración para recuperar hasta {demoMaxLives} vidas.
        </Text>
        {demoLifePackages.map((item) => {
          const limit = progress.lives + item.lives > demoMaxLives;
          const poor = progress.gems < item.gems;
          const description = item.lives === 1 ? '1 vida' : `${item.lives} vidas`;
          return (
            <View
              key={item.lives}
              style={[styles.package, { backgroundColor: colors.surfaceCard }]}>
              <Text style={[typography.title, { color: colors.textPrimary }]}>{description}</Text>
              {limit || poor ? (
                <Text style={[typography.body, { color: colors.textSecondary }]}>
                  {limit ? 'El paquete supera el límite de vidas.' : 'Gemas insuficientes.'}
                </Text>
              ) : null}
              <PrimaryButton
                label={`Comprar ${description} · ${item.gems} gemas`}
                leading={<icons.gems color={colors.onPrimary} />}
                height={48}
                disabled={limit || poor}
                onPress={() => setPack(item)}
              />
            </View>
          );
        })}
        {notice && (
          <Text
            accessibilityLiveRegion="polite"
            style={[typography.label, { color: colors.textPrimary }]}>
            {notice}
          </Text>
        )}
      </View>
      <AlertDialog
        visible={!!pack}
        title="¿Comprar el paquete?"
        message={pack ? `El paquete cuesta ${pack.gems} gemas de demostración.` : ''}
        primaryLabel="Confirmar compra"
        secondaryLabel="Cancelar"
        onPrimary={() => {
          if (!pack) return;
          const result = purchaseDemoLives(player, pack.lives);
          setPack(undefined);
          setNotice(
            result === 'purchased'
              ? 'Vidas disponibles en tu camino.'
              : result === 'limit'
                ? 'El paquete supera el límite de vidas.'
                : 'Gemas insuficientes.',
          );
        }}
        onSecondary={() => setPack(undefined)}
        onRequestClose={() => setPack(undefined)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flexGrow: 1, padding: spacing.screen },
  content: { gap: spacing.screen, width: '100%', maxWidth: 540, alignSelf: 'center' },
  package: {
    borderRadius: radii.md,
    gap: spacing.md,
    padding: spacing.screen,
    paddingBottom: spacing.section,
  },
});
