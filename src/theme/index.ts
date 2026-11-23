import { useColorScheme } from 'react-native';

import { colors, type ColorTokens } from './colors';

export { alertColors, alertShadows, authColors, authTypography } from './auth';
export { colors, sheetColors, type ColorScheme, type ColorTokens } from './colors';
export { pressMotion, radii, shadows, sizes, spacing } from './metrics';
export { fontFamily, typography } from './typography';

/** Returns the color tokens for the current system appearance. */
export function useColors(): ColorTokens {
  const scheme = useColorScheme();
  return colors[scheme === 'dark' ? 'dark' : 'light'];
}
