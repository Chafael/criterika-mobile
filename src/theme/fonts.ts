import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';

import { fontFamily } from './typography';

const fontSources = {
  [fontFamily.medium]: PlusJakartaSans_500Medium,
  [fontFamily.semiBold]: PlusJakartaSans_600SemiBold,
  [fontFamily.bold]: PlusJakartaSans_700Bold,
  [fontFamily.extraBold]: PlusJakartaSans_800ExtraBold,
};

/** Loads every Plus Jakarta Sans weight used by the design. */
export function useAppFonts(): { loaded: boolean; error: Error | null } {
  const [loaded, error] = useFonts(fontSources);
  return { loaded, error };
}
