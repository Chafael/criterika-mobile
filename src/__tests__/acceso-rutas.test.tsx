import { userEvent } from '@testing-library/react-native';
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

  it.each([
    ['Términos y condiciones', '/terminos-condiciones', 'Términos y condiciones'],
    ['Aviso de privacidad', '/aviso-privacidad', 'Aviso de privacidad'],
  ])(
    'Crear cuenta abre %s sin sesión y al volver conserva lo escrito',
    async (link, path, header) => {
      const user = userEvent.setup();
      const { getPathname } = await renderRouter('./src/app', { initialUrl: '/crear-cuenta' });

      await user.type(screen.getByLabelText('Nombre, obligatorio'), 'Ada');
      await user.press(screen.getByRole('checkbox'));
      await user.press(screen.getByRole('link', { name: link }));

      expect(getPathname()).toBe(path);
      expect(await screen.findByRole('header', { name: header })).toBeOnTheScreen();

      await user.press(screen.getByRole('button', { name: 'Volver atrás' }));

      expect(getPathname()).toBe('/crear-cuenta');
      expect(screen.getByLabelText('Nombre, obligatorio')).toHaveDisplayValue('Ada');
      expect(screen.getByRole('checkbox')).toBeChecked();
    },
  );

  it('los documentos legales también se abren con la sesión iniciada', async () => {
    await act(async () => {
      await signIn(mockTestEmails.active, mockPassword);
      await verifyAccessCode('CRT-2026');
    });
    const { getPathname } = await renderRouter('./src/app', {
      initialUrl: '/aviso-privacidad',
    });

    expect(getPathname()).toBe('/aviso-privacidad');
    expect(await screen.findByRole('header', { name: 'Aviso de privacidad' })).toBeOnTheScreen();
  });
});
