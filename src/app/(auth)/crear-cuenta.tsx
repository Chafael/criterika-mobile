import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AlertBanner } from '@/components/alert/alert-banner';
import type { AlertContent } from '@/components/alert/alert-card';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthScreen } from '@/components/auth/auth-screen';
import { BackButton } from '@/components/auth/back-button';
import { Checkbox } from '@/components/auth/checkbox';
import { PasswordRequirements } from '@/components/auth/password-requirements';
import { TextField, type TextFieldProps } from '@/components/auth/text-field';
import {
  formatBirthDateInput,
  isAdult,
  isStrongPassword,
  isValidEmail,
  parseBirthDate,
} from '@/data/access-rules';
import { register } from '@/data/session';
import { icons, images } from '@/media';
import { authColors, authTypography, radii, shadows, typography } from '@/theme';

type Form = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  confirmation: string;
  acceptedTerms: boolean;
};

const emptyForm: Form = {
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  password: '',
  confirmation: '',
  acceptedTerms: false,
};

/** Age note under the birth date (16:11), also used as the alert message. */
const ADULT_ONLY_NOTE = 'Debes tener 18 años o más para registrarte.';

/**
 * First broken rule, in the order of the form. The alert copy is not drawn
 * in Figma; it reuses the "Aviso" danger alert (36:747).
 */
function validate(form: Form): AlertContent | null {
  const required = [form.firstName, form.lastName, form.birthDate, form.email, form.password];
  if (required.some((value) => value.trim() === '') || form.confirmation === '') {
    return {
      tone: 'danger',
      title: 'Completa los campos obligatorios',
      message: 'Los campos con * son necesarios para crear tu cuenta.',
    };
  }
  const birthDate = parseBirthDate(form.birthDate);
  if (!birthDate) {
    return {
      tone: 'danger',
      title: 'Revisa tu fecha de nacimiento',
      message: 'Escríbela como dd/mm/aaaa.',
    };
  }
  if (!isAdult(birthDate)) {
    return { tone: 'danger', title: 'Solo para mayores de edad', message: ADULT_ONLY_NOTE };
  }
  if (!isValidEmail(form.email)) {
    return {
      tone: 'danger',
      title: 'Revisa tu correo electrónico',
      message: 'Escribe un correo válido, como tu.correo@ejemplo.com.',
    };
  }
  if (!isStrongPassword(form.password)) {
    return {
      tone: 'danger',
      title: 'Tu contraseña aún no es segura',
      message: 'Cumple los 4 requisitos de seguridad.',
    };
  }
  if (form.password !== form.confirmation) {
    return {
      tone: 'danger',
      title: 'Las contraseñas no coinciden',
      message: 'Escribe la misma contraseña en los dos campos.',
    };
  }
  if (!form.acceptedTerms) {
    return {
      tone: 'danger',
      title: 'Acepta los Términos y condiciones',
      message: 'Para crear tu cuenta debes aceptarlos y consultar el Aviso de privacidad.',
    };
  }
  return null;
}

/** Fields on this screen share the raised fill, shadow, 12 px radius and 4 px gap (1:111). */
const fieldBase = {
  gap: 4,
  surface: 'raised',
  elevated: true,
} as const satisfies Partial<TextFieldProps>;

/** "02. Crear cuenta" (Figma 1:76). */
export default function CrearCuenta() {
  const [form, setForm] = useState<Form>(emptyForm);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [banner, setBanner] = useState<AlertContent | null>(null);

  const update = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    const problem = validate(form);
    setBanner(problem);
    const birthDate = parseBirthDate(form.birthDate);
    if (problem || !birthDate) {
      return;
    }
    await register({
      firstName: form.firstName,
      lastName: form.lastName,
      birthDate,
      email: form.email,
      password: form.password,
    });
    router.push('/codigo-acceso');
  };

  const goToSignIn = () => router.dismissTo('/inicio-sesion');
  const toggleTerms = () => update('acceptedTerms', !form.acceptedTerms);

  return (
    <AuthScreen overlay={<AlertBanner alert={banner} onDismiss={() => setBanner(null)} />}>
      <View style={styles.topBar}>
        <BackButton accessibilityLabel="Volver atrás" surface="card" onPress={goToSignIn} />
      </View>

      <View style={styles.brand}>
        <Image
          source={images.logoTagline}
          style={styles.logo}
          resizeMode="stretch"
          accessibilityRole="image"
          accessibilityLabel="Criterika. Cada elección cuenta"
        />
      </View>

      <View style={styles.intro}>
        <View style={styles.mascotBox}>
          <View style={styles.mascotHalo} />
          <Image source={images.mascotaFilosofo} style={styles.mascot} resizeMode="contain" />
        </View>
        <View style={styles.introText}>
          <View style={styles.badge}>
            <Text style={[typography.overline, { color: authColors.onSuccessContainer }]}>
              Bienvenido
            </Text>
          </View>
          <Text
            accessibilityRole="header"
            style={[authTypography.headline, styles.introTitle, { color: authColors.textPrimary }]}>
            Crear cuenta
          </Text>
          <Text style={[typography.body, { color: authColors.textSecondary }]}>
            Comienza tu camino hacia el código ético y la justicia digital.
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <TextField
          {...fieldBase}
          label="Nombre"
          requiredMark="plain"
          leadingIcon={{ Icon: icons.person, width: 13.333, height: 13.333 }}
          placeholder="Ej. Ada"
          value={form.firstName}
          onChangeText={(value) => update('firstName', value)}
          autoComplete="given-name"
          textContentType="givenName"
        />
        <TextField
          {...fieldBase}
          label="Apellidos"
          requiredMark="plain"
          leadingIcon={{ Icon: icons.person, width: 13.333, height: 13.333 }}
          placeholder="Ej. Lovelace"
          value={form.lastName}
          onChangeText={(value) => update('lastName', value)}
          autoComplete="family-name"
          textContentType="familyName"
        />
        <TextField
          {...fieldBase}
          label="Fecha de nacimiento"
          requiredMark="danger"
          leadingIcon={{ Icon: icons.calendar, width: 15, height: 16.667 }}
          placeholder="dd/mm/aaaa"
          value={form.birthDate}
          onChangeText={(value) => update('birthDate', formatBirthDateInput(value))}
          keyboardType="number-pad"
          maxLength={10}
          autoComplete="birthdate-full"
          accessibilityHint={ADULT_ONLY_NOTE}>
          <Text style={[typography.caption, { color: authColors.textSecondary }]}>
            {ADULT_ONLY_NOTE}
          </Text>
        </TextField>
        <TextField
          {...fieldBase}
          label="Correo electrónico"
          requiredMark="danger"
          leadingIcon={{ Icon: icons.mail, width: 16.667, height: 13.333 }}
          placeholder="tu.correo@ejemplo.com"
          value={form.email}
          onChangeText={(value) => update('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <TextField
          {...fieldBase}
          label="Contraseña"
          requiredMark="danger"
          leadingIcon={{ Icon: icons.lockField, width: 13.333, height: 17.5 }}
          trailingAction={{
            Icon: icons.eye,
            width: 18.333,
            height: 12.5,
            accessibilityLabel: passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña',
            onPress: () => setPasswordVisible((visible) => !visible),
          }}
          placeholder="Crea una contraseña segura"
          value={form.password}
          onChangeText={(value) => update('password', value)}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword">
          <PasswordRequirements password={form.password} />
        </TextField>
        <TextField
          {...fieldBase}
          label="Confirmar contraseña"
          requiredMark="danger"
          leadingIcon={{ Icon: icons.lockReset, width: 16.667, height: 16.667 }}
          trailingAction={{
            Icon: icons.eye,
            width: 18.333,
            height: 12.5,
            accessibilityLabel: confirmationVisible
              ? 'Ocultar confirmación de contraseña'
              : 'Mostrar confirmación de contraseña',
            onPress: () => setConfirmationVisible((visible) => !visible),
          }}
          placeholder="Repite tu contraseña"
          value={form.confirmation}
          onChangeText={(value) => update('confirmation', value)}
          secureTextEntry={!confirmationVisible}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
        />

        <View style={styles.terms}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: form.acceptedTerms }}
            accessibilityLabel="Acepto los Términos y condiciones de Criterika"
            onPress={toggleTerms}
            hitSlop={11}>
            <Checkbox checked={form.acceptedTerms} />
          </Pressable>
          <Text
            onPress={toggleTerms}
            style={[authTypography.terms, styles.termsText, { color: authColors.termsText }]}>
            Acepto los{' '}
            <Text
              accessibilityRole="link"
              onPress={() => router.push('/terminos-condiciones')}
              style={styles.inlineLink}>
              Términos y condiciones
            </Text>{' '}
            de Criterika.
          </Text>
        </View>
        <Text style={[authTypography.terms, { color: authColors.privacyText }]}>
          Antes de crear tu cuenta, consulta el{' '}
          <Text
            accessibilityRole="link"
            onPress={() => router.push('/aviso-privacidad')}
            style={styles.inlineLink}>
            Aviso de privacidad
          </Text>
          .
        </Text>

        <View style={styles.actions}>
          <AuthButton
            label="Crear cuenta"
            size="medium"
            height={50}
            icon={{ Icon: icons.personCheck, width: 18.333, height: 15.033 }}
            iconPosition="leading"
            onPress={submit}
          />
          <Pressable accessibilityRole="link" onPress={goToSignIn} style={styles.signIn}>
            <Text style={[typography.label, { color: authColors.textPrimary }]}>
              ¿Ya tienes cuenta?{' '}
              <Text style={[styles.underline, { color: authColors.link }]}>Iniciar sesión</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  /** Back button bar (1:79) and its 8 px margin. */
  topBar: { paddingVertical: 8, marginBottom: 8 },
  /** Logo (1:90). */
  brand: { alignItems: 'center', paddingBottom: 12 },
  logo: { width: 196.38, height: 56 },
  /** Welcome panel (1:92) and its 16 px margin. */
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginBottom: 16,
    borderRadius: radii.lg,
    backgroundColor: authColors.surfaceField,
    boxShadow: shadows.chip,
  },
  mascotBox: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  mascotHalo: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.full,
    backgroundColor: authColors.mascotHalo,
  },
  mascot: { width: 80, height: 80 },
  introText: { flex: 1, gap: 2, paddingTop: 4, alignItems: 'flex-start' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: authColors.successContainer,
  },
  introTitle: { paddingTop: 1 },
  /** Form (1:103). */
  form: { gap: 14 },
  terms: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingTop: 4 },
  termsText: { flex: 1 },
  inlineLink: {
    ...authTypography.termsLink,
    color: authColors.linkStrong,
    textDecorationLine: 'underline',
  },
  actions: { gap: 12, paddingTop: 8 },
  signIn: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  underline: { textDecorationLine: 'underline' },
});
