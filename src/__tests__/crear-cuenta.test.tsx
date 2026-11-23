import { render, screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import CrearCuenta from '@/app/(auth)/crear-cuenta';
import { resetSessionForTests, signIn } from '@/data/session';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));

type Overrides = Partial<{
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  confirmation: string;
  acceptTerms: boolean;
}>;

async function fillForm(overrides: Overrides = {}) {
  const values = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    birthDate: '10122000',
    email: 'ada@criterika.com',
    password: 'Analitica#1843',
    confirmation: 'Analitica#1843',
    acceptTerms: true,
    ...overrides,
  };
  const user = userEvent.setup();
  await render(<CrearCuenta />);
  const type = async (label: string, text: string) => {
    if (text) await user.type(screen.getByLabelText(label), text);
  };
  await type('Nombre, obligatorio', values.firstName);
  await type('Apellidos, obligatorio', values.lastName);
  await type('Fecha de nacimiento, obligatorio', values.birthDate);
  await type('Correo electrónico, obligatorio', values.email);
  await type('Contraseña, obligatorio', values.password);
  await type('Confirmar contraseña, obligatorio', values.confirmation);
  if (values.acceptTerms) {
    await user.press(screen.getByRole('checkbox'));
  }
  await user.press(screen.getByRole('button', { name: 'Crear cuenta' }));
  return user;
}

function expectAlert(title: string) {
  expect(screen.getByRole('alert', { name: new RegExp(`^${title}\\.`) })).toBeOnTheScreen();
  expect(router.push).not.toHaveBeenCalled();
}

describe('Pantalla Crear cuenta', () => {
  beforeEach(() => {
    resetSessionForTests();
    jest.clearAllMocks();
  });

  it('muestra los campos, los requisitos y los avisos legales del diseño', async () => {
    await render(<CrearCuenta />);

    expect(screen.getByRole('header', { name: 'Crear cuenta' })).toBeOnTheScreen();
    expect(screen.getByText('Debes tener 18 años o más para registrarte.')).toBeOnTheScreen();
    expect(screen.getByText('0 de 4')).toBeOnTheScreen();
    expect(screen.getByText('Términos y condiciones')).toBeOnTheScreen();
    expect(screen.getByText('Aviso de privacidad')).toBeOnTheScreen();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('aplica la máscara de la fecha y actualiza los requisitos al escribir', async () => {
    const user = userEvent.setup();
    await render(<CrearCuenta />);

    await user.type(screen.getByLabelText('Fecha de nacimiento, obligatorio'), '10122000');
    await user.type(screen.getByLabelText('Contraseña, obligatorio'), 'Analitica#1');

    expect(screen.getByLabelText('Fecha de nacimiento, obligatorio')).toHaveDisplayValue(
      '10/12/2000',
    );
    expect(screen.getByText('4 de 4')).toBeOnTheScreen();
  });

  it('crea la cuenta con datos válidos y pide el código de acceso', async () => {
    await fillForm();

    expect(router.push).toHaveBeenCalledWith('/codigo-acceso');
    await expect(signIn('ada@criterika.com', 'Analitica#1843')).resolves.toMatchObject({
      status: 'code-sent',
    });
  });

  it('pide los campos obligatorios', async () => {
    await fillForm({ lastName: '' });
    expectAlert('Completa los campos obligatorios');
  });

  it('solo admite mayores de edad', async () => {
    const thisYear = new Date().getFullYear();
    await fillForm({ birthDate: `0101${thisYear - 17}` });

    expect(
      screen.getByRole('alert', {
        name: 'Solo para mayores de edad. Debes tener 18 años o más para registrarte.',
      }),
    ).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('rechaza una fecha que no existe', async () => {
    await fillForm({ birthDate: '31022000' });
    expectAlert('Revisa tu fecha de nacimiento');
  });

  it('rechaza un correo inválido', async () => {
    await fillForm({ email: 'ada.criterika' });
    expectAlert('Revisa tu correo electrónico');
  });

  it('exige los cuatro requisitos de la contraseña', async () => {
    await fillForm({ password: 'analitica1843', confirmation: 'analitica1843' });
    expectAlert('Tu contraseña aún no es segura');
  });

  it('exige que la confirmación coincida', async () => {
    await fillForm({ confirmation: 'Analitica#1844' });
    expectAlert('Las contraseñas no coinciden');
  });

  it('exige aceptar los términos', async () => {
    await fillForm({ acceptTerms: false });
    expectAlert('Acepta los Términos y condiciones');
  });

  it('vuelve al inicio de sesión desde la flecha y desde el enlace', async () => {
    const user = userEvent.setup();
    await render(<CrearCuenta />);

    await user.press(screen.getByRole('button', { name: 'Volver atrás' }));
    await user.press(screen.getByRole('link', { name: '¿Ya tienes cuenta? Iniciar sesión' }));

    expect(router.dismissTo).toHaveBeenCalledTimes(2);
    expect(router.dismissTo).toHaveBeenCalledWith('/inicio-sesion');
  });
});
