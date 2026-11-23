import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AlertBanner } from '@/components/alert/alert-banner';
import type { AlertContent } from '@/components/alert/alert-card';
import { AlertDialog } from '@/components/alert/alert-dialog';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthScreen } from '@/components/auth/auth-screen';
import { TextField } from '@/components/auth/text-field';
import { signIn } from '@/data/session';
import { icons, images } from '@/media';
import { authColors, authTypography, radii, shadows, typography } from '@/theme';

/** "19.15 Alerta: Credenciales incorrectas" (37:2981). */
const invalidCredentialsAlert: AlertContent = {
  tone: 'danger',
  title: 'Correo o contraseña incorrectos',
  message: 'Revisa tus datos e inténtalo de nuevo.',
};

/** "01. Inicio de sesión" (Figma 1:2) with alerts 19.15 (37:2908) and 19.09 (37:2036). */
export default function InicioSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [banner, setBanner] = useState<AlertContent | null>(null);
  const [blocked, setBlocked] = useState(false);

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
    <AuthScreen overlay={<AlertBanner alert={banner} onDismiss={() => setBanner(null)} />}>
      <View style={styles.brand}>
        <Image
          source={images.logoTagline}
          style={styles.logo}
          resizeMode="stretch"
          accessibilityRole="image"
          accessibilityLabel="Criterika. Cada elección cuenta"
        />
      </View>

      <View style={styles.welcomeMargin}>
        <View style={styles.welcome}>
          <View style={[styles.decor, styles.decorPrimary]} />
          <View style={[styles.decor, styles.decorSuccess]} />
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
      </View>

      <View style={styles.card}>
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

        <View style={styles.form}>
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
          <AuthButton
            label="Iniciar sesión"
            size="large"
            height={52}
            icon={{ Icon: icons.arrowForward, width: 13.333, height: 13.333 }}
            onPress={submit}
            style={styles.submit}
          />
        </View>

        <View style={styles.signUp}>
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
      </View>

      <View style={styles.note}>
        <icons.lockNote width={10.667} height={14} color={authColors.success} />
        <Text style={[typography.caption, styles.noteText, { color: authColors.textFootnote }]}>
          Tus datos de aprendizaje están protegidos bajo estándares éticos
        </Text>
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

const styles = StyleSheet.create({
  /** Brand header (1:4). */
  brand: { alignItems: 'center', paddingTop: 8, paddingBottom: 16 },
  logo: { width: 192, height: 54.75 },
  /** Welcome card (1:8). */
  welcomeMargin: { paddingBottom: 24 },
  welcome: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: authColors.surfaceCard,
    boxShadow: shadows.card,
  },
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
  /** Form card (1:23). */
  card: {
    padding: 20,
    borderRadius: radii.lg,
    backgroundColor: authColors.surfaceRaised,
    boxShadow: shadows.raised,
  },
  cardHeader: { gap: 4, paddingBottom: 20 },
  form: { gap: 16 },
  forgot: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  submit: { marginTop: 8 },
  /** Sign up strip (1:65): full card width, 24 px below the form, flush with the card bottom. */
  signUp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginHorizontal: -20,
    marginBottom: -20,
    padding: 20,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
    backgroundColor: authColors.surfaceSignUp,
  },
  signUpLink: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  /** Security note (1:71). */
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 24,
  },
  /** 329.06 px text + 4.94 px padding (1:74), so the row centers like in Figma. */
  noteText: { flexShrink: 1, maxWidth: 334, paddingRight: 4.94 },
});
