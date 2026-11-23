import { Stack } from 'expo-router';

import { authColors } from '@/theme';

export const unstable_settings = {
  anchor: 'inicio-sesion',
};

/** Access flow (Figma section "01 · Acceso"). Only reachable while signed out. */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: authColors.background },
      }}
    />
  );
}
