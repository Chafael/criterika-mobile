import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AlertBanner } from '@/components/alert/alert-banner';
import type { AlertContent } from '@/components/alert/alert-card';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthScreen } from '@/components/auth/auth-screen';
import { registrationAlert } from '@/components/auth/registration-alert';
import { TextField } from '@/components/auth/text-field';
import {
  createRegistrationKey,
  RegistrationError,
  retainRegistrationKey,
} from '@/data/registration-api';
import { getPendingRegistration, resendAccessCode, verifyAccessCode } from '@/data/session';
import { icons, images } from '@/media';
import { authColors, authTypography, radii, shadows, sizes, typography } from '@/theme';

/** "19.16 Alerta: Código vencido" (37:3045). */
const expiredCodeAlert: AlertContent = {
  tone: 'danger',
  title: 'El código venció',
  message:
    'Los códigos duran 10 minutos y sirven una sola vez. Pide uno nuevo con Reenviar código.',
};

/**
 * "03. Código de acceso" (Figma 1:240) with alert 19.16 (37:2986).
 * A successful code starts the session; the root layout then shows the tabs.
 */
export default function CodigoAcceso() {
  const [code, setCode] = useState('');
  const [banner, setBanner] = useState<AlertContent | null>(null);
  const [busy, setBusy] = useState<'verify' | 'resend' | null>(null);
  const inFlight = useRef(false);
  const verifyKey = useRef<string | undefined>(undefined);
  const resendKey = useRef<string | undefined>(undefined);
  const [now, setNow] = useState(() => Date.now());
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifyCooldown, setVerifyCooldown] = useState(0);
  const registration = getPendingRegistration();
  const resendAt = Math.max(
    registration ? Date.parse(registration.reenvioDisponibleEn) : 0,
    resendCooldown,
  );
  const secondsUntilResend = Math.max(0, Math.ceil((resendAt - now) / 1000));
  const waitingToVerify = verifyCooldown > now;

  useEffect(() => {
    if (!secondsUntilResend && !waitingToVerify) return;
    const timer = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(timer);
  }, [now, secondsUntilResend, waitingToVerify]);

  const updateCode = (text: string) => {
    if (inFlight.current) return;
    const next = registration ? text.replace(/\D/g, '').slice(0, 6) : text.toUpperCase();
    if (next !== code) verifyKey.current = undefined;
    setCode(next);
  };

  const backToSignIn = () => router.dismissTo('/inicio-sesion');

  const verify = async () => {
    if (inFlight.current || (registration && Date.now() < verifyCooldown) || !code.trim()) return;
    if (registration && !/^\d{6}$/.test(code)) {
      setBanner({
        tone: 'danger',
        title: 'Escribe los seis dígitos',
        message: 'Usa el código del correo de verificación.',
      });
      return;
    }
    inFlight.current = true;
    setBusy('verify');
    setBanner(null);
    try {
      if (registration) verifyKey.current ??= createRegistrationKey();
      const result = await verifyAccessCode(code, verifyKey.current);
      verifyKey.current = undefined;
      if (result.status === 'expired') {
        setBanner(expiredCodeAlert);
      } else if (result.status === 'no-pending') {
        backToSignIn();
      }
    } catch (error) {
      if (!retainRegistrationKey(error)) verifyKey.current = undefined;
      if (error instanceof RegistrationError && error.retryAfterSeconds) {
        const timestamp = Date.now();
        setNow(timestamp);
        setVerifyCooldown(timestamp + error.retryAfterSeconds * 1000);
      }
      setBanner(registrationAlert(error));
    } finally {
      inFlight.current = false;
      setBusy(null);
    }
  };

  const paste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      updateCode(text.trim());
    }
  };

  const resend = async () => {
    if (inFlight.current || Date.now() < resendAt) return;
    inFlight.current = true;
    setBusy('resend');
    setBanner(null);
    try {
      if (registration) resendKey.current ??= createRegistrationKey();
      await resendAccessCode(resendKey.current);
      resendKey.current = undefined;
      verifyKey.current = undefined;
      setCode('');
      setNow(Date.now());
      if (registration) {
        setBanner({
          title: 'Enviamos otro código',
          message: 'Revisa tu correo y usa el código más reciente.',
        });
      }
    } catch (error) {
      if (!retainRegistrationKey(error)) resendKey.current = undefined;
      if (error instanceof RegistrationError && error.retryAfterSeconds) {
        const timestamp = Date.now();
        setNow(timestamp);
        setResendCooldown(timestamp + error.retryAfterSeconds * 1000);
      }
      setBanner(registrationAlert(error));
    } finally {
      inFlight.current = false;
      setBusy(null);
    }
  };

  return (
    <AuthScreen overlay={<AlertBanner alert={banner} onDismiss={() => setBanner(null)} />}>
      <View style={styles.brand}>
        <Image
          source={images.logoHorizontal}
          style={styles.logo}
          resizeMode="stretch"
          accessibilityRole="image"
          accessibilityLabel="Criterika"
        />
      </View>

      <View style={styles.mascotBox}>
        <View style={styles.mascotBackdrop} />
        <Image source={images.mascotaIdea} style={styles.mascot} resizeMode="contain" />
      </View>

      <View style={styles.intro}>
        <Text
          accessibilityRole="header"
          style={[authTypography.displayTight, styles.center, { color: authColors.textPrimary }]}>
          Código de acceso
        </Text>
        <Text style={[authTypography.bodyRelaxed, styles.center, styles.introBody]}>
          {registration
            ? 'Te enviamos un código a tu correo. Vence en 10 minutos y solo sirve una vez.'
            : 'Modo de prueba. Usa un código de demostración para continuar.'}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.form}>
          <TextField
            label="Código de acceso"
            gap={8}
            height={56}
            radius={8}
            variant="code"
            labelAccessory={
              <View style={styles.hint}>
                <icons.numbers width={13.333} height={10.667} color={authColors.textSecondary} />
                <Text style={[typography.caption, { color: authColors.textSecondary }]}>
                  Escribe o pega
                </Text>
              </View>
            }
            trailingAction={{
              Icon: icons.clipboard,
              width: 15,
              height: 16.667,
              accessibilityLabel: 'Pegar código desde el portapapeles',
              onPress: paste,
            }}
            placeholder={registration ? 'Ej. 123456' : 'EJ. CRT-8492'}
            value={code}
            onChangeText={updateCode}
            keyboardType={registration ? 'number-pad' : 'default'}
            maxLength={registration ? 6 : undefined}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            onSubmitEditing={verify}
          />
          <AuthButton
            label={busy === 'verify' ? 'Verificando…' : 'Verificar'}
            disabled={busy !== null || waitingToVerify}
            size="medium"
            height={48}
            elevation="chip"
            icon={{ Icon: icons.arrowForward, width: 13.333, height: 13.333 }}
            onPress={verify}
            style={styles.submit}
          />
        </View>

        <View style={styles.inbox}>
          <icons.markEmailRead width={17.5} height={17} color={authColors.link} />
          <View style={styles.inboxText}>
            <Text style={[typography.caption, { color: authColors.textPrimary }]}>
              Revisa tu bandeja de entrada
            </Text>
            <Text style={[typography.body, { color: authColors.textSecondary }]}>
              Si no lo encuentras en unos instantes, comprueba tu carpeta de spam o correo no
              deseado.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.links}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: busy !== null || secondsUntilResend > 0 }}
          disabled={busy !== null || secondsUntilResend > 0}
          onPress={resend}
          style={styles.resend}>
          <icons.refresh width={12} height={12} color={authColors.link} />
          <Text style={[typography.label, { color: authColors.link }]}>
            {busy === 'resend'
              ? 'Enviando…'
              : secondsUntilResend
                ? `Reenviar código en ${secondsUntilResend} s`
                : 'Reenviar código'}
          </Text>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={backToSignIn} style={styles.back}>
          <icons.arrowBackSmall width={10.667} height={10.667} color={authColors.textSecondary} />
          <Text style={[typography.body, { color: authColors.textSecondary }]}>
            Volver al inicio de sesión
          </Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  /** Brand header (1:242). */
  brand: { alignItems: 'center', paddingTop: 12, paddingBottom: 20 },
  logo: { width: sizes.logoWidth, height: sizes.logoHeight },
  /** Mascot (1:263) with its 4 px bottom margin. */
  mascotBox: {
    alignSelf: 'center',
    width: 144,
    height: 144,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotBackdrop: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: radii.full,
    backgroundColor: authColors.surfaceMuted,
    opacity: 0.7,
  },
  mascot: { width: 128, height: 128 },
  /** Title block (1:245). */
  intro: { alignItems: 'center', gap: 7.19, paddingHorizontal: 8 },
  center: { textAlign: 'center' },
  introBody: { maxWidth: 320, color: authColors.textSecondary },
  /** Form card (1:269). */
  card: {
    marginTop: 24,
    gap: 20,
    padding: 20,
    borderRadius: radii.md,
    backgroundColor: authColors.surfaceRaised,
    boxShadow: shadows.raised,
  },
  form: { gap: 16 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  submit: { marginTop: 4 },
  /** Inbox note (1:293). */
  inbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: authColors.surfaceField,
  },
  inboxText: { flex: 1 },
  /** Secondary links (1:251): 6 px after the card plus their 24 px margin (1:250). */
  links: { alignItems: 'center', gap: 12, paddingTop: 30 },
  resend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
