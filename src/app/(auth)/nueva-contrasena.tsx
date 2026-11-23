import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AlertBanner } from '@/components/alert/alert-banner';
import type { AlertContent } from '@/components/alert/alert-card';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthScreen } from '@/components/auth/auth-screen';
import { BackButton } from '@/components/auth/back-button';
import { PasswordRequirements } from '@/components/auth/password-requirements';
import { TextField, type TextFieldProps } from '@/components/auth/text-field';
import { isStrongPassword } from '@/data/access-rules';
import { resetPassword } from '@/data/session';
import { icons, images } from '@/media';
import { authColors, authTypography, radii, shadows, typography } from '@/theme';

/** Not drawn in Figma; reuse the "Aviso" danger alert (36:747). */
const weakPasswordAlert: AlertContent = {
  tone: 'danger',
  title: 'Tu contraseña aún no es segura',
  message: 'Cumple los 4 requisitos de seguridad.',
};
const mismatchAlert: AlertContent = {
  tone: 'danger',
  title: 'Las contraseñas no coinciden',
  message: 'Escribe la misma contraseña en los dos campos.',
};

/** Both fields: 8 px radius, field fill, no leading icon, 6 px gap (1:333). */
const fieldBase = {
  gap: 6,
  radius: 8,
  secureTextEntry: true,
  autoCapitalize: 'none',
  autoComplete: 'new-password',
  textContentType: 'newPassword',
} as const satisfies Partial<TextFieldProps>;

/**
 * "05. Nueva contraseña" (Figma 1:301).
 * Saving returns to "Inicio de sesión", as the note on the screen says.
 */
export default function NuevaContrasena() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [banner, setBanner] = useState<AlertContent | null>(null);

  const goToSignIn = () => router.dismissTo('/inicio-sesion');

  const save = async () => {
    if (!isStrongPassword(password)) {
      setBanner(weakPasswordAlert);
      return;
    }
    if (password !== confirmation) {
      setBanner(mismatchAlert);
      return;
    }
    setBanner(null);
    await resetPassword(password);
    goToSignIn();
  };

  return (
    <AuthScreen
      paddingBottom={0}
      overlay={<AlertBanner alert={banner} onDismiss={() => setBanner(null)} />}>
      <View style={styles.topBar}>
        <BackButton
          accessibilityLabel="Volver a Inicio de sesión"
          surface="card"
          elevated={false}
          onPress={goToSignIn}
        />
        <View style={styles.logoSlot}>
          <Image
            source={images.logoHorizontal}
            style={styles.logo}
            resizeMode="stretch"
            accessibilityRole="image"
            accessibilityLabel="Criterika"
          />
        </View>
      </View>

      <View style={styles.intro}>
        <View style={styles.introText}>
          <View style={styles.badge}>
            <icons.history width={13.333} height={13.333} color={authColors.onSuccessContainer} />
            <Text style={[typography.caption, { color: authColors.onSuccessContainer }]}>
              Paso final
            </Text>
          </View>
          <Text
            accessibilityRole="header"
            accessibilityLabel="Nueva contraseña"
            style={[authTypography.displayCompact, { color: authColors.textPrimary }]}>
            {/* Figma wraps the title in its 218 px column (1:319); the break keeps it on every font renderer. */}
            {'Nueva\ncontraseña'}
          </Text>
          <Text style={[typography.body, styles.introBody, { color: authColors.textSecondary }]}>
            Ingresa tu nueva contraseña para acceder a tu cuenta.
          </Text>
        </View>
        <View style={styles.mascotBox}>
          <View style={styles.mascotHalo} />
          <Image source={images.mascotaIdea} style={styles.mascot} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.card}>
        <TextField
          {...fieldBase}
          label="Nueva contraseña"
          trailingAction={{
            Icon: icons.eye,
            width: 18.333,
            height: 12.5,
            accessibilityLabel: passwordVisible
              ? 'Ocultar nueva contraseña'
              : 'Mostrar nueva contraseña',
            onPress: () => setPasswordVisible((visible) => !visible),
          }}
          placeholder="Crea una clave segura"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}>
          <PasswordRequirements password={password} />
        </TextField>
        <TextField
          {...fieldBase}
          label="Confirmar contraseña"
          style={styles.confirmation}
          trailingAction={{
            Icon: icons.eye,
            width: 18.333,
            height: 12.5,
            accessibilityLabel: confirmationVisible
              ? 'Ocultar confirmación de contraseña'
              : 'Mostrar confirmación de contraseña',
            onPress: () => setConfirmationVisible((visible) => !visible),
          }}
          placeholder="Repite la contraseña"
          value={confirmation}
          onChangeText={setConfirmation}
          secureTextEntry={!confirmationVisible}
          onSubmitEditing={save}
        />

        <View style={styles.aside}>
          <icons.info width={16.667} height={18.667} color={authColors.link} />
          <View style={styles.asideText}>
            <Text style={[typography.label, { color: authColors.textPrimary }]}>
              Seguridad y acceso
            </Text>
            <Text style={[typography.body, { color: authColors.textSecondary }]}>
              Al guardar tu nueva contraseña, se actualizarán tus credenciales de seguridad y serás
              redirigido de forma automática a la pantalla de{' '}
              <Text style={styles.bold}>Inicio de sesión</Text>.
            </Text>
          </View>
        </View>

        <AuthButton
          label="Guardar contraseña"
          size="medium"
          height={52}
          icon={{ Icon: icons.shieldCheck, width: 13.333, height: 16.667 }}
          iconPosition="leading"
          onPress={save}
          style={styles.submit}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  /** Header (1:304) and its 8 px margin. */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 8,
  },
  logoSlot: { flex: 1, alignItems: 'center', paddingRight: 44 },
  logo: { width: 92.16, height: 36 },
  /** Mascot panel (1:311) and its 16 px margin. */
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    marginBottom: 16,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: authColors.surfaceField,
    boxShadow: shadows.card,
  },
  introText: { flex: 1, gap: 3, paddingRight: 4, alignItems: 'flex-start' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: authColors.successContainer,
  },
  introBody: { paddingTop: 1 },
  mascotBox: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center' },
  mascotHalo: {
    position: 'absolute',
    top: -2.4,
    left: -2.4,
    right: -2.4,
    bottom: -2.4,
    borderRadius: radii.full,
    backgroundColor: authColors.mascotHaloSoft,
  },
  mascot: { width: 96, height: 96 },
  /** Form card (1:326) and its 16 px margin. */
  card: {
    gap: 16,
    padding: 16,
    marginBottom: 16,
    borderRadius: radii.md,
    backgroundColor: authColors.surfaceRaised,
    boxShadow: shadows.raised,
  },
  confirmation: { paddingTop: 4 },
  /** Navigation note (1:367). */
  aside: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: authColors.surfaceCard,
  },
  asideText: { flex: 1, gap: 2 },
  bold: { fontFamily: typography.label.fontFamily },
  /** The label sits 2 px low: 18 px top and 14 px bottom padding (1:375). */
  submit: { paddingTop: 4 },
});
