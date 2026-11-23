import { act, render, renderHook, screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import CodigoAcceso from '@/app/(auth)/codigo-acceso';
import { resetSessionForTests, signIn, useSession } from '@/data/session';
import { mockExpiredCode, mockPassword, mockTestEmails } from '@/mocks/session';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));

jest.mock('expo-clipboard', () => ({
  getStringAsync: jest.fn(async () => ' crt-5521 '),
}));

describe('Pantalla Código de acceso', () => {
  beforeEach(async () => {
    resetSessionForTests();
    jest.clearAllMocks();
    await signIn(mockTestEmails.active, mockPassword);
  });

  it('muestra el campo, la nota del correo y los enlaces secundarios', async () => {
    await render(<CodigoAcceso />);

    expect(screen.getByRole('header', { name: 'Código de acceso' })).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('EJ. CRT-8492')).toBeOnTheScreen();
    expect(screen.getByText('Revisa tu bandeja de entrada')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Reenviar código' })).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Volver al inicio de sesión' })).toBeOnTheScreen();
  });

  it('un código válido inicia la sesión', async () => {
    const user = userEvent.setup();
    const { result } = await renderHook(() => useSession());
    await render(<CodigoAcceso />);

    await user.type(screen.getByLabelText('Código de acceso'), 'crt-2026');
    expect(screen.getByLabelText('Código de acceso')).toHaveDisplayValue('CRT-2026');
    await act(async () => {
      await user.press(screen.getByRole('button', { name: 'Verificar' }));
    });

    expect(result.current).toEqual({ email: mockTestEmails.active, firstName: 'Ada' });
  });

  it('muestra el aviso 19.16 con un código vencido', async () => {
    const user = userEvent.setup();
    await render(<CodigoAcceso />);

    await user.type(screen.getByLabelText('Código de acceso'), mockExpiredCode);
    await user.press(screen.getByRole('button', { name: 'Verificar' }));

    expect(
      screen.getByRole('alert', {
        name: 'El código venció. Los códigos duran 10 minutos y sirven una sola vez. Pide uno nuevo con Reenviar código.',
      }),
    ).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Reenviar código' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByLabelText('Código de acceso')).toHaveDisplayValue('');
  });

  it('pega el código del portapapeles en mayúsculas', async () => {
    const user = userEvent.setup();
    await render(<CodigoAcceso />);

    await user.press(screen.getByRole('button', { name: 'Pegar código desde el portapapeles' }));

    expect(screen.getByLabelText('Código de acceso')).toHaveDisplayValue('CRT-5521');
  });

  it('vuelve al inicio de sesión', async () => {
    const user = userEvent.setup();
    await render(<CodigoAcceso />);

    await user.press(screen.getByRole('link', { name: 'Volver al inicio de sesión' }));

    expect(router.dismissTo).toHaveBeenCalledWith('/inicio-sesion');
  });
});
