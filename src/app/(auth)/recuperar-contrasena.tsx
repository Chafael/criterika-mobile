import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AlertBanner } from '@/components/alert/alert-banner';
import type { AlertContent } from '@/components/alert/alert-card';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthScreen } from '@/components/auth/auth-screen';
import { BackButton } from '@/components/auth/back-button';
import { TextField } from '@/components/auth/text-field';
import { isValidEmail } from '@/data/access-rules';
import { registrationEnabled } from '@/data/registration-api';
import { requestPasswordReset } from '@/data/session';
import { icons, images } from '@/media';
import { authColors, authTypography, radii, shadows, typography } from '@/theme';

/** Not drawn in Figma; reuses the "Aviso" danger alert (36:747). */
const invalidEmailAlert: AlertContent = {
  tone: 'danger',
  title: 'Revisa tu correo electrónico',
  message: 'Escribe un correo válido, como tu.correo@ejemplo.com.',
};

/**
 * "04. Recuperar contraseña" (Figma 1:178).
 * Without a backend there is no email: after sending, the app opens
 * "Nueva contraseña" as if the person had tapped the link.
 */
export default function RecuperarContrasena() {
  const [email, setEmail] = useState('');
  const [banner, setBanner] = useState<AlertContent | null>(null);

  const send = async () => {
    if (registrationEnabled) {
      setBanner({
        title: 'Recuperación de contraseña en preparación',
        message: 'El envío de enlaces para restablecer contraseñas aún no está habilitado.',
      });
      return;
    }
    if (!isValidEmail(email)) {
      setBanner(invalidEmailAlert);
      return;
    }
    setBanner(null);
    await requestPasswordReset(email);
    router.push('/nueva-contrasena');
  };

  return (
    <AuthScreen overlay={<AlertBanner alert={banner} onDismiss={() => setBanner(null)} />}>
      <View style={styles.topBar}>
        <BackButton
          accessibilityLabel="Volver al inicio de sesión"
          surface="field"
          arrow="thin"
          onPress={() => router.back()}
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

      <View style={styles.showcase}>
        <View style={styles.mascotBox}>
          <View style={styles.mascotBackdrop} />
          <Image source={images.mascotaConsultando} style={styles.mascot} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={[typography.overline, { color: authColors.textSecondary }]}>
            Seguridad de cuenta
          </Text>
        </View>
        <Text
          accessibilityRole="header"
          style={[
            authTypography.display,
            styles.center,
            styles.title,
            { color: authColors.textPrimary },
          ]}>
          Recuperar contraseña
        </Text>
        <Text
          style={[
            authTypography.bodyLarge,
            styles.center,
            styles.description,
            { color: authColors.textSecondary },
          ]}>
          Introduce tu correo electrónico registrado y te enviaremos un enlace para restablecer tu
          contraseña.
        </Text>

        <View style={styles.form}>
          <TextField
            label="Correo electrónico"
            labelSize="large"
            labelIcon={{ Icon: icons.mailOutline, width: 15, height: 12 }}
            gap={12}
            elevated
            placeholder="tu.correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            onSubmitEditing={send}>
            <Text style={[typography.body, styles.helper, { color: authColors.textSecondary }]}>
              Te enviaremos un enlace de un solo uso válido por 10 minutos.
            </Text>
          </TextField>
          <AuthButton
            label="Enviar enlace"
            size="large"
            height={48}
            icon={{ Icon: icons.send, width: 15.833, height: 13.333 }}
            onPress={send}
            style={styles.submit}
          />
        </View>

        <View style={styles.trust}>
          <icons.shield width={12} height={17} color={authColors.link} />
          <Text
            style={[authTypography.note, styles.trustText, { color: authColors.textSecondary }]}>
            En Criterika promovemos la privacidad: tus accesos se procesan mediante cifrado seguro
            conforme a normativas de protección de datos.
          </Text>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  /** Top bar (1:180). The logo is centered in the space left of a 44 px right padding. */
  topBar: { flexDirection: 'row', alignItems: 'center', paddingTop: 8, paddingBottom: 16 },
  logoSlot: { flex: 1, alignItems: 'center', paddingRight: 44 },
  logo: { width: 71.67, height: 28 },
  /** Mascot showcase (1:186). */
  showcase: { alignItems: 'center', paddingVertical: 8 },
  mascotBox: { width: 112, height: 112, alignItems: 'center', justifyContent: 'center' },
  mascotBackdrop: {
    position: 'absolute',
    top: 2.8,
    left: 2.8,
    right: 2.8,
    bottom: 2.8,
    borderRadius: radii.full,
    backgroundColor: authColors.surfaceCard,
    opacity: 0.7,
  },
  mascot: { width: 96, height: 96 },
  /** Main card (1:195) with its 4 px top margin. */
  card: {
    marginTop: 4,
    padding: 24,
    borderRadius: radii.md,
    backgroundColor: authColors.surfaceRaised,
    boxShadow: shadows.chip,
  },
  badge: {
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: authColors.surfaceMuted,
  },
  center: { textAlign: 'center' },
  title: { paddingTop: 4 },
  description: { paddingTop: 8 },
  /** Form (1:207): 16 px margin plus 4 px padding. */
  form: { paddingTop: 20 },
  helper: { marginTop: -8 },
  submit: { marginTop: 16 },
  /** Trust note (1:229). */
  trust: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: authColors.surfaceField,
  },
  trustText: { flex: 1 },
});
