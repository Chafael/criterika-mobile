import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useSession } from '@/data/session';
import { colors } from '@/theme';
import { useAppFonts } from '@/theme/fonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loaded, error } = useAppFonts();
  const session = useSession();
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

  // The app opens on the sign in screen; tabs only exist with a session.
  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={session !== null} redirectTo="/inicio-sesion">
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={session === null}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
