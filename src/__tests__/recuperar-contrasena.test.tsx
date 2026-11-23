import { render, screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import RecuperarContrasena from '@/app/(auth)/recuperar-contrasena';
import { resetSessionForTests } from '@/data/session';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));

describe('Pantalla Recuperar contraseña', () => {
  beforeEach(() => {
    resetSessionForTests();
    jest.clearAllMocks();
  });

  it('muestra el campo, la nota de vigencia y la nota de privacidad', async () => {
    await render(<RecuperarContrasena />);

    expect(screen.getByRole('header', { name: 'Recuperar contraseña' })).toBeOnTheScreen();
    expect(screen.getByText('Seguridad de cuenta')).toBeOnTheScreen();
    expect(
      screen.getByText('Te enviaremos un enlace de un solo uso válido por 10 minutos.'),
    ).toBeOnTheScreen();
    expect(screen.getByText(/En Criterika promovemos la privacidad/)).toBeOnTheScreen();
  });

  it('con un correo válido envía el enlace y abre la nueva contraseña', async () => {
    const user = userEvent.setup();
    await render(<RecuperarContrasena />);

    await user.type(screen.getByLabelText('Correo electrónico'), 'jugador@criterika.com');
    await user.press(screen.getByRole('button', { name: 'Enviar enlace' }));

    expect(router.push).toHaveBeenCalledWith('/nueva-contrasena');
  });

  it('avisa si el correo no es válido', async () => {
    const user = userEvent.setup();
    await render(<RecuperarContrasena />);

    await user.type(screen.getByLabelText('Correo electrónico'), 'jugador');
    await user.press(screen.getByRole('button', { name: 'Enviar enlace' }));

    expect(
      screen.getByRole('alert', { name: /^Revisa tu correo electrónico\./ }),
    ).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('vuelve al inicio de sesión', async () => {
    const user = userEvent.setup();
    await render(<RecuperarContrasena />);

    await user.press(screen.getByRole('button', { name: 'Volver al inicio de sesión' }));

    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
