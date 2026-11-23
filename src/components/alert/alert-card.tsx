import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { PrimaryButton, type PrimaryButtonPalette } from '@/components/primary-button';
import { images } from '@/media';
import { alertColors, alertShadows, authTypography } from '@/theme';

export type AlertVariant = 'dialog' | 'banner';
export type AlertTone = 'normal' | 'danger';

export type AlertContent = {
  title: string;
  message: string;
  tone?: AlertTone;
  /** Mascot pose. Normal alerts default to "Saludando" (36:715), danger ones to "Seria" (36:721). */
  mascot?: ImageSourcePropType;
};

export type AlertCardProps = AlertContent & {
  variant: AlertVariant;
  /** Dialog only. */
  primaryLabel?: string;
  onPrimary?: () => void;
  /** Dialog only. Hidden when omitted (36:722 "mostrarSecundario"). */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Banner only: tapping the banner dismisses it. */
  onPress?: () => void;
};

/** Dialog face height: 15 px padding + Bold 16 normal line height (36:728). */
const DIALOG_BUTTON_HEIGHT = 50;

const buttonPalettes: Record<AlertTone, PrimaryButtonPalette> = {
  normal: {
    face: alertColors.primary,
    shadow: alertColors.primaryShadow,
    label: alertColors.onPrimary,
  },
  danger: {
    face: alertColors.danger,
    shadow: alertColors.dangerShadow,
    label: alertColors.onDanger,
  },
};

function defaultMascot(tone: AlertTone): ImageSourcePropType {
  return tone === 'danger' ? images.mascotaSeria : images.mascotaSaludando;
}

/**
 * "Alerta" (Figma 36:752), reusable across the app.
 * - `dialog` ("Ventana"): confirms or blocks an action (36:722 / 36:732).
 * - `banner` ("Aviso"): short message at the top of the screen (36:742 / 36:747).
 * Tone `danger` is for errors and actions that cannot be undone.
 */
export function AlertCard({
  variant,
  tone = 'normal',
  title,
  message,
  mascot,
  primaryLabel = 'Aceptar',
  onPrimary,
  secondaryLabel,
  onSecondary,
  onPress,
}: AlertCardProps) {
  const pose = mascot ?? defaultMascot(tone);

  if (variant === 'banner') {
    const danger = tone === 'danger';
    return (
      <Pressable
        accessibilityRole="alert"
        accessibilityLabel={`${title}. ${message}`}
        accessibilityHint={onPress ? 'Toca para cerrar el aviso' : undefined}
        onPress={onPress}
        style={[
          styles.banner,
          danger
            ? {
                backgroundColor: alertColors.bannerDanger,
                borderColor: alertColors.bannerDangerBorder,
              }
            : { backgroundColor: alertColors.surface, borderColor: alertColors.bannerBorder },
        ]}>
        <Image source={pose} style={styles.bannerPose} resizeMode="contain" />
        <View style={styles.bannerTexts}>
          <Text
            style={[
              authTypography.bannerTitle,
              { color: danger ? alertColors.bannerDangerTitle : alertColors.title },
            ]}>
            {title}
          </Text>
          <Text
            style={[
              authTypography.bannerMessage,
              { color: danger ? alertColors.bannerDangerMessage : alertColors.message },
            ]}>
            {message}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View accessibilityRole="alert" style={styles.dialog}>
      <View
        style={[
          styles.mascotCircle,
          {
            backgroundColor:
              tone === 'danger' ? alertColors.mascotDanger : alertColors.mascotNormal,
          },
        ]}>
        <Image source={pose} style={styles.dialogPose} resizeMode="contain" />
      </View>
      <Text
        accessibilityRole="header"
        style={[styles.centered, authTypography.alertTitle, { color: alertColors.title }]}>
        {title}
      </Text>
      <Text style={[styles.centered, authTypography.alertMessage, { color: alertColors.message }]}>
        {message}
      </Text>
      <View style={styles.spacer} />
      <PrimaryButton
        label={primaryLabel}
        onPress={onPrimary ?? noop}
        palette={buttonPalettes[tone]}
        height={DIALOG_BUTTON_HEIGHT}
        labelStyle={authTypography.alertButton}
      />
      {secondaryLabel ? (
        <Pressable accessibilityRole="button" onPress={onSecondary} style={styles.secondary}>
          <Text style={[authTypography.alertSecondary, { color: alertColors.secondaryAction }]}>
            {secondaryLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function noop() {}

const styles = StyleSheet.create({
  dialog: {
    width: 326,
    alignItems: 'center',
    gap: 10,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: alertColors.surface,
    boxShadow: alertShadows.dialog,
  },
  mascotCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dialogPose: { width: 96, height: 96 },
  centered: { alignSelf: 'stretch', textAlign: 'center' },
  /** "Espacio" (36:727). */
  spacer: { height: 4 },
  secondary: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 10,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: alertShadows.banner,
  },
  bannerPose: { width: 52, height: 52 },
  bannerTexts: { flex: 1, gap: 2 },
});
