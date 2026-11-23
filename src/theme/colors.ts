/**
 * Color tokens extracted from Figma (file qbGd2GDSL2a5RWIDLK6yGz).
 * Light: "06. Camino de niveles (Móvil)" 1:388.
 * Dark:  "06. Camino de niveles · Oscuro (Móvil)" 119:1451.
 */
export type ColorScheme = 'light' | 'dark';

export type ColorTokens = {
  /** Screen background (1:388 / 119:1451). */
  background: string;
  /** Translucent bar background for header and tab bar (1:534, 1:557). */
  barBackground: string;
  /** Chips, header counters, node labels (1:538, 1:470). */
  surfaceChip: string;
  /** Unit card (1:423). */
  surfaceCard: string;
  /** Progress track and unit badge (1:427, 1:445). */
  surfaceTrack: string;
  /** Raised surfaces: sheets, speech bubble (130:2078, 1:501). */
  surfaceRaised: string;
  /** Backdrop behind the logo (only visible in dark: 119:1568). */
  logoBackdrop: string;
  textPrimary: string;
  textSecondary: string;
  /** Green accent text (unit badge, progress count: 1:431, 1:444). */
  textSuccess: string;
  /** Completed nodes and progress fill (1:465, 1:446). */
  success: string;
  /** Soft green container (1:436). */
  successContainer: string;
  /** Primary action fill (130:2101). */
  primary: string;
  /** Hard shadow below the primary action (130:2101). */
  primaryShadow: string;
  /** Text on primary action (130:2102). */
  onPrimary: string;
  /** Active tab icon and label (1:563). */
  tabActive: string;
  /** Inactive tab icon and label (1:568). */
  tabInactive: string;
  /** Lives icon (1:540). */
  lives: string;
  /** Gems icon (1:545). */
  gems: string;
  /** Streak icon (1:550). */
  streak: string;
};

export const colors: Record<ColorScheme, ColorTokens> = {
  light: {
    background: '#FBF8F0',
    barBackground: 'rgba(251, 248, 240, 0.9)',
    surfaceChip: '#F9F1E4',
    surfaceCard: '#F6EAD5',
    surfaceTrack: '#F0DCBD',
    surfaceRaised: '#FFFDF8',
    logoBackdrop: 'transparent',
    textPrimary: '#331207',
    textSecondary: '#534434',
    textSuccess: '#536516',
    success: '#536516',
    successContainer: '#D3E98B',
    primary: '#F39A1E',
    primaryShadow: '#BF730D',
    onPrimary: '#4A2418',
    tabActive: '#885200',
    tabInactive: '#534434',
    lives: '#BA1A1A',
    gems: '#FCBC24',
    streak: '#F39A1E',
  },
  dark: {
    background: '#1E130D',
    barBackground: 'rgba(30, 19, 13, 0.9)',
    surfaceChip: '#2A1B12',
    surfaceCard: '#3A2619',
    surfaceTrack: '#3D2A1C',
    // Not drawn in the dark frame; reuses the light raised surface (1:501 / 119:1533).
    surfaceRaised: '#FFFDF8',
    logoBackdrop: '#F7E9CE',
    textPrimary: '#F7E9CE',
    textSecondary: '#D9C3AE',
    textSuccess: '#C5D88A',
    success: '#536516',
    successContainer: '#3D4A1C',
    // The dark frame has no primary button; it keeps the light values.
    primary: '#F39A1E',
    primaryShadow: '#BF730D',
    onPrimary: '#4A2418',
    tabActive: '#F5B51B',
    tabInactive: '#D9C3AE',
    lives: '#FF8A80',
    gems: '#FCBC24',
    streak: '#F39A1E',
  },
};
