/** Spacing scale used across 1:388 (paddings and gaps in px). */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 14,
  screen: 16,
  section: 20,
  block: 24,
} as const;

/** Corner radii from 1:388. */
export const radii = {
  /** Logo backdrop (119:1568). */
  xs: 6,
  /** Cards and speech bubble (1:423, 1:501). */
  md: 12,
  /** Reward card and final node (130:2096, 1:523). */
  lg: 16,
  /** Bottom sheet top corners (130:2078). */
  xl: 24,
  /** Pills, chips and round buttons (1:538, 130:2101). */
  full: 9999,
} as const;

/** Fixed component sizes from 1:388. */
export const sizes = {
  headerHeight: 64,
  logoWidth: 81.91,
  logoHeight: 32,
  counterMinHeight: 36,
  tabBarHeight: 80,
  tabMinWidth: 56,
  tabMinHeight: 44,
  primaryButtonHeight: 52,
} as const;

/**
 * Shadows from 1:388, written as CSS `boxShadow` strings
 * (supported by React Native's New Architecture).
 */
export const shadows = {
  /** Header (1:534). */
  header: '0px 1px 8px 0px rgba(0, 0, 0, 0.04)',
  /** Tab bar (1:557). */
  tabBar: '0px -2px 12px 0px rgba(0, 0, 0, 0.05)',
  /** Cards (1:423). */
  card: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
  /** Floating elements: nodes, bubbles (1:466). */
  raised: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
} as const;

/** Primary button press microinteraction. */
export const pressMotion = {
  /** Hard shadow depth below the primary button (130:2101: 0 4px 0). */
  depth: 4,
  durationMs: 100,
} as const;
