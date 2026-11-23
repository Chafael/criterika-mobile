import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { colors } from '@/theme';
import { useAppFonts } from '@/theme/fonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loaded, error } = useAppFonts();
  const ready = loaded || error !== null;
  const isDark = useColorScheme() === 'dark';
  const tokens = colors[isDark ? 'dark' : 'light'];
  const base = isDark ? DarkTheme : DefaultTheme;

  // The translucent header and tab bar sit on the screen background in Figma,
  // so the navigator background must match the design token.
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: tokens.background,
      card: tokens.background,
      text: tokens.textPrimary,
      primary: tokens.tabActive,
    },
  };

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
