import { act, renderHook } from '@testing-library/react-native';

import {
  register,
  requestPasswordReset,
  resetPassword,
  resetSessionForTests,
  signIn,
  signOut,
  useSession,
  verifyAccessCode,
} from '@/data/session';
import { mockExpiredCode, mockPassword, mockTestEmails } from '@/mocks/session';

describe('Sesión de prueba', () => {
  beforeEach(() => {
    resetSessionForTests();
  });

  it('envía el código con credenciales válidas y entra al verificarlo', async () => {
    const { result } = await renderHook(() => useSession());
    expect(result.current).toBeNull();

    await expect(signIn(' Jugador@Criterika.com ', mockPassword)).resolves.toEqual({
      status: 'code-sent',
      email: mockTestEmails.active,
    });
    await act(async () => {
      await expect(verifyAccessCode('crt-2026')).resolves.toEqual({ status: 'verified' });
    });

    expect(result.current).toEqual({ email: mockTestEmails.active, firstName: 'Ada' });

    await act(async () => {
      signOut();
    });
    expect(result.current).toBeNull();
  });

  it('rechaza el correo de credenciales incorrectas y una contraseña equivocada', async () => {
    await expect(signIn(mockTestEmails.invalidCredentials, mockPassword)).resolves.toEqual({
      status: 'invalid-credentials',
    });
    await expect(signIn(mockTestEmails.active, 'otra')).resolves.toEqual({
      status: 'invalid-credentials',
    });
  });

  it('avisa que la cuenta está bloqueada con cualquier contraseña', async () => {
    await expect(signIn(mockTestEmails.blocked, 'lo-que-sea')).resolves.toEqual({
      status: 'blocked',
    });
  });

  it('el código CRT-0000 está vencido y no inicia sesión', async () => {
    await signIn(mockTestEmails.active, mockPassword);

    await expect(verifyAccessCode(mockExpiredCode)).resolves.toEqual({ status: 'expired' });
    await expect(verifyAccessCode(' crt-0000 ')).resolves.toEqual({ status: 'expired' });
  });

  it('no verifica códigos sin un inicio de sesión pendiente', async () => {
    await expect(verifyAccessCode('CRT-1234')).resolves.toEqual({ status: 'no-pending' });
  });

  it('la cuenta creada puede iniciar sesión después', async () => {
    await register({
      firstName: 'Grace',
      lastName: 'Hopper',
      birthDate: new Date(1990, 0, 1),
      email: 'grace@criterika.com',
      password: 'Cobol#1959',
    });

    await expect(signIn('grace@criterika.com', 'Cobol#1959')).resolves.toEqual({
      status: 'code-sent',
      email: 'grace@criterika.com',
    });
  });

  it('la nueva contraseña reemplaza a la anterior', async () => {
    await requestPasswordReset(mockTestEmails.active);
    await resetPassword('Nueva#2026');

    await expect(signIn(mockTestEmails.active, mockPassword)).resolves.toEqual({
      status: 'invalid-credentials',
    });
    await expect(signIn(mockTestEmails.active, 'Nueva#2026')).resolves.toMatchObject({
      status: 'code-sent',
    });
  });
});
