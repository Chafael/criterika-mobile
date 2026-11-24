import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AlertBanner } from '@/components/alert/alert-banner';
import type { AlertContent } from '@/components/alert/alert-card';
import { AlertDialog } from '@/components/alert/alert-dialog';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthScreen } from '@/components/auth/auth-screen';
import { TextField } from '@/components/auth/text-field';
import { FitSpace, fitShrink } from '@/components/layout/fit-space';
import { signIn } from '@/data/session';
import { icons, images } from '@/media';
import { authColors, authTypography, radii, shadows, typography } from '@/theme';

/** "19.15 Alerta: Credenciales incorrectas" (37:2981). */
const invalidCredentialsAlert: AlertContent = {
  tone: 'danger',
  title: 'Correo o contraseña incorrectos',
  message: 'Revisa tus datos e inténtalo de nuevo.',
};

/**
 * "01. Inicio de sesión" (Figma 1:2) with alerts 19.15 (37:2908) and 19.09 (37:2036).
 *
 * The screen does not scroll: every vertical space from Figma is a FitSpace,
 * so on short phones the spaces shrink together and texts, fields and the
 * button keep their size.
 */
export default function InicioSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [banner, setBanner] = useState<AlertContent | null>(null);
  const [blocked, setBlocked] = useState(false);
  /** Height under the form card; it may stay under the keyboard. */
  const [footerHeight, setFooterHeight] = useState(0);

  const submit = async () => {
    setBanner(null);
    const result = await signIn(email, password);
    if (result.status === 'invalid-credentials') {
      setBanner(invalidCredentialsAlert);
    } else if (result.status === 'blocked') {
      setBlocked(true);
    } else {
      setPassword('');
      router.push('/codigo-acceso');
    }
  };

  return (
    <AuthScreen
      layout="fixed"
      keyboardOffset={footerHeight}
      overlay={<AlertBanner alert={banner} onDismiss={() => setBanner(null)} />}>
      {/* Brand header (1:4). */}
      <FitSpace size={8} />
      <Image
        source={images.logoTagline}
        style={styles.logo}
        resizeMode="stretch"
        accessibilityRole="image"
        accessibilityLabel="Criterika. Cada elección cuenta"
      />
      <FitSpace size={16} />

      {/* Welcome card (1:8). */}
      <View style={styles.welcome}>
        <View style={[styles.decor, styles.decorPrimary]} />
        <View style={[styles.decor, styles.decorSuccess]} />
        <FitSpace size={16} />
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeText}>
            <View style={styles.chip}>
              <icons.verified width={14.667} height={14} color={authColors.success} />
              <Text style={[typography.caption, { color: authColors.success }]}>Ética & Ley</Text>
            </View>
            <Text
              style={[typography.title, styles.welcomeTitle, { color: authColors.textPrimary }]}>
              ¡Hola, colega!
            </Text>
            <Text style={[typography.body, { color: authColors.textSecondary }]}>
              Tu criterio ético define cada línea de código. Entra y sigamos resolviendo dilemas.
            </Text>
          </View>
          <Image source={images.mascotaSaludando} style={styles.mascot} resizeMode="contain" />
        </View>
        <FitSpace size={16} />
      </View>
      <FitSpace size={24} />

      {/* Form card (1:23). */}
      <View style={styles.card}>
        <FitSpace size={20} />
        <View style={styles.cardHeader}>
          <Text
            accessibilityRole="header"
            style={[authTypography.display, { color: authColors.textPrimary }]}>
            Iniciar sesión
          </Text>
          <Text style={[typography.body, { color: authColors.textSecondary }]}>
            Ingresa tus credenciales para acceder a tus módulos de aprendizaje.
          </Text>
        </View>
        <FitSpace size={20} />

        <TextField
          label="Correo electrónico"
          labelSize="large"
          gap={6}
          elevated
          leadingIcon={{ Icon: icons.mail, width: 16.667, height: 13.333 }}
          placeholder="desarrollador@criterika.edu"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <FitSpace size={16} />
        <TextField
          label="Contraseña"
          labelSize="large"
          gap={6}
          elevated
          labelAccessory={
            <Pressable
              accessibilityRole="link"
              onPress={() => router.push('/recuperar-contrasena')}
              style={styles.forgot}>
              <Text style={[typography.label, { color: authColors.link }]}>
                Recuperar contraseña
              </Text>
            </Pressable>
          }
          leadingIcon={{ Icon: icons.lockField, width: 13.333, height: 17.5 }}
          trailingAction={{
            Icon: icons.eye,
            width: 18.333,
            height: 12.5,
            accessibilityLabel: passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña',
            onPress: () => setPasswordVisible((visible) => !visible),
          }}
          placeholder="••••••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          onSubmitEditing={submit}
        />
        {/* 16 px form gap + 8 px margin above the button (1:59). */}
        <FitSpace size={24} />
        <AuthButton
          label="Iniciar sesión"
          size="large"
          height={52}
          icon={{ Icon: icons.arrowForward, width: 13.333, height: 13.333 }}
          onPress={submit}
        />
        <FitSpace size={24} />

        {/* Sign up strip (1:65): full card width, flush with the card bottom. */}
        <View style={styles.signUp}>
          <FitSpace size={20} />
          <View style={styles.signUpRow}>
            <Text style={[authTypography.bodyLarge, { color: authColors.textSecondary }]}>
              ¿No tienes cuenta?{' '}
            </Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.push('/crear-cuenta')}
              style={styles.signUpLink}>
              <Text style={[authTypography.fieldLabel, { color: authColors.link }]}>
                Crear cuenta
              </Text>
            </Pressable>
          </View>
          <FitSpace size={20} />
        </View>
      </View>

      {/* Security note (1:71) and the 32 px bottom padding (1:3). */}
      <View
        style={styles.footer}
        onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}>
        <FitSpace size={24} />
        <View style={styles.note}>
          <icons.lockNote width={10.667} height={14} color={authColors.success} />
          <Text style={[typography.caption, styles.noteText, { color: authColors.textFootnote }]}>
            Tus datos de aprendizaje están protegidos bajo estándares éticos
          </Text>
        </View>
        <FitSpace size={32} />
      </View>

      <AlertDialog
        visible={blocked}
        tone="danger"
        title="Cuenta bloqueada"
        message="Esta cuenta fue bloqueada de forma definitiva por incumplir las reglas de uso. Si crees que es un error, escríbenos a soporte@criterika.com."
        primaryLabel="Entendido"
        onPrimary={() => setBlocked(false)}
      />
    </AuthScreen>
  );
}

/**
 * Natural heights at 390 px wide, used to weight how much each box shrinks
 * (see `fitShrink`): welcome card 146, form card 490, sign up strip 84,
 * footer 88.
 */
const styles = StyleSheet.create({
  logo: { alignSelf: 'center', width: 192, height: 54.75 },
  welcome: {
    flexShrink: fitShrink(32, 146),
    paddingHorizontal: 16,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: authColors.surfaceCard,
    boxShadow: shadows.card,
  },
  welcomeRow: { flexDirection: 'row', alignItems: 'center' },
  decor: { position: 'absolute', borderRadius: radii.full },
  decorPrimary: {
    width: 128,
    height: 128,
    right: -24,
    bottom: -24,
    backgroundColor: authColors.decorPrimary,
  },
  decorSuccess: {
    width: 80,
    height: 80,
    left: 32,
    top: -32,
    backgroundColor: authColors.decorSuccess,
  },
  welcomeText: { flex: 1, gap: 2, paddingRight: 12, alignItems: 'flex-start' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radii.full,
    backgroundColor: authColors.background,
    boxShadow: shadows.chip,
  },
  welcomeTitle: { paddingTop: 4 },
  mascot: { width: 112, height: 112 },
  /** Inner spaces: 20 + 20 + 16 + 24 + 24 and the strip's 40. */
  card: {
    flexShrink: fitShrink(144, 490),
    paddingHorizontal: 20,
    borderRadius: radii.lg,
    backgroundColor: authColors.surfaceRaised,
    boxShadow: shadows.raised,
  },
  cardHeader: { gap: 4 },
  forgot: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  signUp: {
    flexShrink: fitShrink(40, 84),
    marginHorizontal: -20,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
    backgroundColor: authColors.surfaceSignUp,
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  signUpLink: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  /** Takes the extra height on tall phones, so the content stays at the top. */
  footer: { flexGrow: 1, flexShrink: fitShrink(56, 88) },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  /** 329.06 px text + 4.94 px padding (1:74), so the row centers like in Figma. */
  noteText: { flexShrink: 1, maxWidth: 334, paddingRight: 4.94 },
});
