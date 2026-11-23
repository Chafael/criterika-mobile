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

  // ── Level path (1:458) ──────────────────────────────────────────────
  /** Blurred decoration in the unit card (1:424). */
  decorGlow: string;
  /** Icon on the green topic circle (1:438). */
  onSuccessContainer: string;
  /** Check icon on completed nodes (1:468). */
  onSuccess: string;
  /** Locked node and final card fill (1:509, 1:523). */
  surfaceLocked: string;
  /** Translucent label behind locked nodes (1:513). */
  surfaceLockedLabel: string;
  /** Text of locked node labels (1:514). */
  textDisabled: string;
  /** Lock on the next-unit card (1:457). */
  lockMuted: string;
  /** Halo around the active node (1:485). */
  activeGlow: string;
  /** Icon and "INICIAR" text on the active node (1:489, 1:492). */
  onActiveNode: string;
  /** Pill under the active node (1:494). */
  activeLabel: string;
  onActiveLabel: string;
  /** Play icon in the active pill (1:497). */
  activeLabelIcon: string;
  /** Reward badge above the final node (1:518). */
  reward: string;
  onReward: string;
  /** Gift icon on the final card (1:525). */
  rewardIcon: string;
  /** Overlay with the lock on the final card (1:528). */
  rewardLockOverlay: string;
  /** Mascot speech bubble text (1:503). */
  bubbleText: string;
  /** Layer behind the level preview sheet (26:239). */
  scrim: string;
};

/**
 * Level preview sheet (26:240). It only exists in light in Figma,
 * so it uses the same palette in both appearances.
 */
export const sheetColors = {
  surface: '#FFFDF8',
  handle: '#E8D3B0',
  overline: '#5F7230',
  title: '#4A2418',
  body: '#70452E',
  chip: '#F7E9CE',
  rewardBox: '#FFF4DC',
} as const;

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
    decorGlow: 'rgba(211, 233, 139, 0.3)',
    onSuccessContainer: '#576A1A',
    onSuccess: '#FFFDF8',
    surfaceLocked: '#F3E3C8',
    surfaceLockedLabel: 'rgba(249, 241, 228, 0.7)',
    textDisabled: 'rgba(83, 68, 52, 0.8)',
    lockMuted: '#D9C3AE',
    activeGlow: 'rgba(243, 154, 30, 0.3)',
    onActiveNode: '#603800',
    activeLabel: '#FFDDBB',
    onActiveLabel: '#2B1700',
    activeLabelIcon: '#885200',
    reward: '#FCBC24',
    onReward: '#261900',
    rewardIcon: '#7B5800',
    rewardLockOverlay: 'rgba(235, 211, 176, 0.4)',
    bubbleText: '#331207',
    scrim: 'rgba(43, 20, 12, 0.45)',
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
    decorGlow: 'rgba(61, 74, 28, 0.3)',
    onSuccessContainer: '#C5D88A',
    onSuccess: '#FFFDF8',
    surfaceLocked: '#3A2619',
    surfaceLockedLabel: 'rgba(42, 27, 18, 0.7)',
    textDisabled: 'rgba(217, 195, 174, 0.8)',
    lockMuted: '#D9C3AE',
    activeGlow: 'rgba(243, 154, 30, 0.3)',
    onActiveNode: '#603800',
    activeLabel: '#FFDDBB',
    onActiveLabel: '#2B1700',
    activeLabelIcon: '#885200',
    reward: '#FCBC24',
    onReward: '#261900',
    rewardIcon: '#F5B51B',
    rewardLockOverlay: 'rgba(235, 211, 176, 0.4)',
    bubbleText: '#331207',
    // The dark frame has no sheet; it keeps the light scrim (26:239).
    scrim: 'rgba(43, 20, 12, 0.45)',
  },
};
