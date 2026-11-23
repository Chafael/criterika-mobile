import { act, renderRouter, screen } from 'expo-router/testing-library';

import { resetSessionForTests, signIn, signOut, verifyAccessCode } from '@/data/session';
import { mockPassword, mockTestEmails } from '@/mocks/session';

describe('Rutas protegidas por la sesión', () => {
  beforeEach(() => {
    resetSessionForTests();
  });

  it('la app abre en el inicio de sesión y no muestra las pestañas', async () => {
    const { getPathname } = await renderRouter('./src/app', { initialUrl: '/' });

    expect(getPathname()).toBe('/inicio-sesion');
    expect(screen.getByRole('header', { name: 'Iniciar sesión' })).toBeOnTheScreen();
    expect(screen.queryByRole('tab', { name: 'Niveles' })).toBeNull();
  });

  it('las pestañas aparecen al entrar y desaparecen al cerrar sesión', async () => {
    const { getPathname } = await renderRouter('./src/app', { initialUrl: '/' });

    await act(async () => {
      await signIn(mockTestEmails.active, mockPassword);
      await verifyAccessCode('CRT-2026');
    });

    expect(getPathname()).toBe('/');
    expect(screen.getByRole('tab', { name: 'Niveles' })).toBeOnTheScreen();

    await act(async () => {
      signOut();
    });

    expect(getPathname()).toBe('/inicio-sesion');
  });
});
