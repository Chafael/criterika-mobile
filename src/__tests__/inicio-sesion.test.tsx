import { render, screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import InicioSesion from '@/app/(auth)/inicio-sesion';
import { resetSessionForTests } from '@/data/session';
import { mockPassword, mockTestEmails } from '@/mocks/session';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));

async function signInWith(email: string, password: string) {
  const user = userEvent.setup();
  await render(<InicioSesion />);
  await user.type(screen.getByLabelText('Correo electrónico'), email);
  await user.type(screen.getByLabelText('Contraseña'), password);
  await user.press(screen.getByRole('button', { name: 'Iniciar sesión' }));
  return user;
}

type HostNode = { type: string; children: (HostNode | string)[] | null };

/** Types of every host element in a rendered tree. */
function hostTypes(node: ReturnType<typeof screen.toJSON>): string[] {
  if (node === null || typeof node === 'string') {
    return [];
  }
  const nodes = (Array.isArray(node) ? node : [node]) as HostNode[];
  return nodes.flatMap((item) => [
    item.type,
    ...(item.children ?? []).flatMap((child) =>
      hostTypes(child as ReturnType<typeof screen.toJSON>),
    ),
  ]);
}

describe('Pantalla Inicio de sesión', () => {
  beforeEach(() => {
    resetSessionForTests();
    jest.clearAllMocks();
  });

  it('muestra el formulario, la bienvenida y los enlaces del diseño', async () => {
    await render(<InicioSesion />);

    expect(screen.getByRole('header', { name: 'Iniciar sesión' })).toBeOnTheScreen();
    expect(screen.getByText('¡Hola, colega!')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('desarrollador@criterika.edu')).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Recuperar contraseña' })).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Crear cuenta' })).toBeOnTheScreen();
    expect(
      screen.getByText('Tus datos de aprendizaje están protegidos bajo estándares éticos'),
    ).toBeOnTheScreen();
  });

  it('queda fija: no usa ScrollView, así que no se puede deslizar', async () => {
    await render(<InicioSesion />);

    expect(hostTypes(screen.toJSON())).not.toContain('RCTScrollView');
  });

  it('con credenciales válidas va al código de acceso', async () => {
    await signInWith(mockTestEmails.active, mockPassword);

    expect(router.push).toHaveBeenCalledWith('/codigo-acceso');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('muestra el aviso 19.15 con credenciales incorrectas y se cierra al tocarlo', async () => {
    const user = await signInWith(mockTestEmails.invalidCredentials, mockPassword);

    const alert = screen.getByRole('alert', {
      name: 'Correo o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.',
    });
    expect(router.push).not.toHaveBeenCalled();

    await user.press(alert);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('muestra la ventana 19.09 cuando la cuenta está bloqueada', async () => {
    const user = await signInWith(mockTestEmails.blocked, 'cualquiera');

    expect(screen.getByRole('header', { name: 'Cuenta bloqueada' })).toBeOnTheScreen();
    expect(screen.getByText(/soporte@criterika\.com/)).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Entendido' }));
    expect(screen.queryByRole('header', { name: 'Cuenta bloqueada' })).toBeNull();
  });

  it('muestra y oculta la contraseña', async () => {
    const user = userEvent.setup();
    await render(<InicioSesion />);

    expect(screen.getByLabelText('Contraseña')).toHaveProp('secureTextEntry', true);
    await user.press(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(screen.getByLabelText('Contraseña')).toHaveProp('secureTextEntry', false);
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeOnTheScreen();
  });

  it('abre recuperar contraseña y crear cuenta', async () => {
    const user = userEvent.setup();
    await render(<InicioSesion />);

    await user.press(screen.getByRole('link', { name: 'Recuperar contraseña' }));
    await user.press(screen.getByRole('link', { name: 'Crear cuenta' }));

    expect(router.push).toHaveBeenNthCalledWith(1, '/recuperar-contrasena');
    expect(router.push).toHaveBeenNthCalledWith(2, '/crear-cuenta');
  });
});
