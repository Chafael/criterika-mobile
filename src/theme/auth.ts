import type { TextStyle } from 'react-native';

import { fontFamily } from './typography';

/**
 * Access flow palette (Figma 1:2, 1:76, 1:240, 1:178, 1:301).
 * These screens only exist in light in Figma, so the same palette is used
 * in both system appearances.
 */
export const authColors = {
  background: '#FBF8F0',
  /** Welcome card and back buttons on 1:76 / 1:301 (1:8, 1:80, 1:305). */
  surfaceCard: '#F6EAD5',
  /** Inputs, notes and back button on 1:178 (1:39, 1:293, 1:181). */
  surfaceField: '#F9F1E4',
  /** Form cards and inputs on 1:76 (1:23, 1:111). */
  surfaceRaised: '#FFFDF8',
  /** Mascot backdrop and badge (1:264, 1:198). */
  surfaceMuted: '#F3E3C8',
  /** Requirements tracker background (47:1110). */
  surfaceRequirements: 'rgba(249, 241, 228, 0.7)',
  /** Requirements progress track (47:1116). */
  track: '#F6EAD5',
  /** Strip under the login form (1:65). */
  surfaceSignUp: 'rgba(249, 241, 228, 0.5)',
  textPrimary: '#331207',
  textSecondary: '#534434',
  /** Placeholders (1:41). */
  placeholder: '#7A6656',
  /** Requirement texts and counter (47:1115, 47:1122). */
  textMuted: '#7D6857',
  /** Pending requirement circle (47:1119). */
  iconMuted: '#867462',
  /** Security footnote (1:75). */
  textFootnote: 'rgba(83, 68, 52, 0.8)',
  /** Text links (1:48). */
  link: '#885200',
  /** Underlined links in the terms rows (51:1147). */
  linkStrong: '#A0560A',
  /** Terms row text (51:1147) and privacy row text (70:1383). */
  termsText: '#4A2418',
  privacyText: '#70452E',
  /** Checkbox border (51:1146). */
  checkboxBorder: '#70452E',
  /** Required asterisk (1:118). */
  required: '#BA1A1A',
  primary: '#F39A1E',
  /** Text and icons on the primary button (1:61). */
  onPrimary: '#603800',
  /** "Ética & Ley" chip text and icon (1:16). */
  success: '#536516',
  /** "BIENVENIDO" and "Paso final" badges (1:97, 1:313). */
  successContainer: '#D3E98B',
  onSuccessContainer: '#576A1A',
  /** Decorative circles on the welcome card (1:9, 1:10). */
  decorPrimary: 'rgba(243, 154, 30, 0.2)',
  decorSuccess: 'rgba(211, 233, 139, 0.3)',
  /** Mascot halos (1:94, 1:323). */
  mascotHalo: 'rgba(255, 184, 104, 0.3)',
  mascotHaloSoft: 'rgba(255, 221, 187, 0.4)',
} as const;

/** "Alerta" component (Figma 36:752). It has no dark variant. */
export const alertColors = {
  surface: '#FFFDF8',
  title: '#4A2418',
  message: '#70452E',
  secondaryAction: '#70452E',
  /** Mascot circle (36:723 normal, 36:733 danger). */
  mascotNormal: '#FFF4DC',
  mascotDanger: '#FDECEA',
  primary: '#F39A1E',
  primaryShadow: '#BF730D',
  onPrimary: '#4A2418',
  danger: '#C0392B',
  dangerShadow: '#801F14',
  onDanger: '#FFFDF8',
  /** Banner ("Aviso") borders and danger fill (36:742, 36:747). */
  bannerBorder: '#F1E2C8',
  bannerDanger: '#FDECEA',
  bannerDangerBorder: '#F2B8B0',
  bannerDangerTitle: '#8E2A1E',
  bannerDangerMessage: '#7A2A1E',
  /** Layer behind dialogs (37:2119). */
  scrim: 'rgba(43, 20, 13, 0.5)',
} as const;

export const alertShadows = {
  /** Dialog drop shadow (36:722). */
  dialog: '0px 12px 16px 0px rgba(43, 20, 13, 0.25)',
  /** Banner drop shadow (36:742). */
  banner: '0px 8px 10px 0px rgba(43, 20, 13, 0.18)',
} as const;

type TypeStyle = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'>;

/** Text styles of the access flow and the alerts. */
export const authTypography = {
  /** Screen titles — Bold 26/34, −0.26 (1:28, 1:202). */
  display: { fontFamily: fontFamily.bold, fontSize: 26, lineHeight: 34, letterSpacing: -0.26 },
  /** Centered titles — Bold 26/34, −0.65 (1:247). */
  displayTight: {
    fontFamily: fontFamily.bold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.65,
  },
  /** "Nueva contraseña" — Bold 26/32.5, −0.65 (1:319). */
  displayCompact: {
    fontFamily: fontFamily.bold,
    fontSize: 26,
    lineHeight: 32.5,
    letterSpacing: -0.65,
  },
  /** "Crear cuenta" — Bold 22/27.5 (1:100). */
  headline: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 27.5 },
  /** Larger body — Medium 15/24 (1:67, 1:205). */
  bodyLarge: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 24 },
  /** Code screen description — Medium 15/24.38 (1:249). */
  bodyRelaxed: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 24.38 },
  /** Compact note — Medium 13/16.25 (1:233). */
  note: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 16.25 },
  /** Terms rows — Medium 13, normal line height (51:1147). */
  terms: { fontFamily: fontFamily.medium, fontSize: 13 },
  termsLink: { fontFamily: fontFamily.bold, fontSize: 13 },
  /** Large field label and medium buttons — Bold 15/20, +0.15 (1:35, 1:171). */
  fieldLabel: { fontFamily: fontFamily.bold, fontSize: 15, lineHeight: 20, letterSpacing: 0.15 },
  /** Input text — Medium 15, normal line height (1:41). */
  input: { fontFamily: fontFamily.medium, fontSize: 15 },
  /** Access code input — Bold 18, uppercase (1:283). */
  codeInput: { fontFamily: fontFamily.bold, fontSize: 18 },
  /** Large button — Bold 18/26 (1:61). */
  buttonLarge: { fontFamily: fontFamily.bold, fontSize: 18, lineHeight: 26 },
  /** Dialog title — Bold 20 (36:725). */
  alertTitle: { fontFamily: fontFamily.bold, fontSize: 20 },
  /** Dialog message — Medium 14, line height 1.4 (36:726). */
  alertMessage: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 19.6 },
  /** Dialog primary button — Bold 16 (36:729). */
  alertButton: { fontFamily: fontFamily.bold, fontSize: 16 },
  /** Dialog secondary button — Bold 14 (36:731). */
  alertSecondary: { fontFamily: fontFamily.bold, fontSize: 14 },
  /** Banner title — Bold 14 (36:745). */
  bannerTitle: { fontFamily: fontFamily.bold, fontSize: 14 },
  /** Banner message — Medium 13 (36:746). */
  bannerMessage: { fontFamily: fontFamily.medium, fontSize: 13 },
} as const satisfies Record<string, TypeStyle>;
