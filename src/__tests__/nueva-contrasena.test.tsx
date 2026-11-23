import { render, screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import NuevaContrasena from '@/app/(auth)/nueva-contrasena';
import { requestPasswordReset, resetSessionForTests, signIn } from '@/data/session';
import { mockTestEmails } from '@/mocks/session';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));

async function save(password: string, confirmation: string) {
  const user = userEvent.setup();
  await render(<NuevaContrasena />);
  await user.type(screen.getByPlaceholderText('Crea una clave segura'), password);
  await user.type(screen.getByLabelText('Confirmar contraseña'), confirmation);
  await user.press(screen.getByRole('button', { name: 'Guardar contraseña' }));
}

describe('Pantalla Nueva contraseña', () => {
  beforeEach(async () => {
    resetSessionForTests();
    jest.clearAllMocks();
    await requestPasswordReset(mockTestEmails.active);
  });

  it('muestra los campos, los requisitos y el aviso de navegación', async () => {
    await render(<NuevaContrasena />);

    expect(screen.getByRole('header', { name: 'Nueva contraseña' })).toBeOnTheScreen();
    expect(screen.getByText('Paso final')).toBeOnTheScreen();
    expect(screen.getByText('0 de 4')).toBeOnTheScreen();
    expect(screen.getByText('Seguridad y acceso')).toBeOnTheScreen();
  });

  it('guarda la contraseña segura y vuelve al inicio de sesión', async () => {
    await save('Nueva#2026', 'Nueva#2026');

    expect(router.dismissTo).toHaveBeenCalledWith('/inicio-sesion');
    await expect(signIn(mockTestEmails.active, 'Nueva#2026')).resolves.toMatchObject({
      status: 'code-sent',
    });
  });

  it('exige los cuatro requisitos', async () => {
    await save('nueva2026', 'nueva2026');

    expect(
      screen.getByRole('alert', { name: /^Tu contraseña aún no es segura\./ }),
    ).toBeOnTheScreen();
    expect(router.dismissTo).not.toHaveBeenCalled();
  });

  it('exige que la confirmación coincida', async () => {
    await save('Nueva#2026', 'Nueva#2027');

    expect(
      screen.getByRole('alert', { name: /^Las contraseñas no coinciden\./ }),
    ).toBeOnTheScreen();
    expect(router.dismissTo).not.toHaveBeenCalled();
  });

  it('muestra cada contraseña por separado', async () => {
    const user = userEvent.setup();
    await render(<NuevaContrasena />);

    await user.press(screen.getByRole('button', { name: 'Mostrar nueva contraseña' }));

    expect(screen.getByPlaceholderText('Crea una clave segura')).toHaveProp(
      'secureTextEntry',
      false,
    );
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveProp('secureTextEntry', true);
  });
});
