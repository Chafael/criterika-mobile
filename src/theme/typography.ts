import type { TextStyle } from 'react-native';

/**
 * Plus Jakarta Sans is the only family used in the mobile screens.
 * Keys match the names registered with expo-font in src/theme/fonts.ts.
 */
export const fontFamily = {
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

type TypeStyle = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textTransform'
>;

/** Text styles taken from 1:388. */
export const typography = {
  /** Unit and card titles — Bold 18/26 (1:433). */
  title: { fontFamily: fontFamily.bold, fontSize: 18, lineHeight: 26 },
  /** Sheet title — Bold 22 (130:2082). */
  headline: { fontFamily: fontFamily.bold, fontSize: 22 },
  /** Primary action label — Bold 16 (130:2102). */
  button: { fontFamily: fontFamily.bold, fontSize: 16 },
  /** Body copy — Medium 13/20 (1:435). */
  body: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 20 },
  /** Counters and node labels — Bold 13/18, +0.26 (1:542, 1:471). */
  label: { fontFamily: fontFamily.bold, fontSize: 13, lineHeight: 18, letterSpacing: 0.26 },
  /** Tab labels and captions — SemiBold 11/16, +0.33 (1:563). */
  caption: { fontFamily: fontFamily.semiBold, fontSize: 11, lineHeight: 16, letterSpacing: 0.33 },
  /** Uppercase badges — SemiBold 11/16, +0.55 (1:431). */
  overline: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.55,
    textTransform: 'uppercase',
  },
  /** Node call to action — ExtraBold 11/16, +0.33 (1:492). */
  captionStrong: {
    fontFamily: fontFamily.extraBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.33,
    textTransform: 'uppercase',
  },
  /** Small bold labels — Bold 11/16, +0.33 (1:522, 1:527). */
  captionBold: { fontFamily: fontFamily.bold, fontSize: 11, lineHeight: 16, letterSpacing: 0.33 },
  /** Mascot speech bubble — Bold 11/13.75, +0.33 (1:503). */
  bubble: { fontFamily: fontFamily.bold, fontSize: 11, lineHeight: 13.75, letterSpacing: 0.33 },
  /** Sheet overline — Bold 12 (26:243). */
  sheetOverline: { fontFamily: fontFamily.bold, fontSize: 12 },
  /** Sheet section title — Bold 13 (26:246). */
  sheetSection: { fontFamily: fontFamily.bold, fontSize: 13 },
  /** Activity chips — Bold 12 (26:249). */
  chip: { fontFamily: fontFamily.bold, fontSize: 12 },
  /** Reward values — Bold 18 (26:260). */
  rewardValue: { fontFamily: fontFamily.bold, fontSize: 18 },
  /** Sheet note — Medium 12 (26:262). */
  sheetNote: { fontFamily: fontFamily.medium, fontSize: 12 },
  /** Text button — Bold 14 (26:272). */
  textButton: { fontFamily: fontFamily.bold, fontSize: 14 },
} as const satisfies Record<string, TypeStyle>;
