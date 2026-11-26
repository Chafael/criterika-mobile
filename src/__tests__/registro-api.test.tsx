import { fireEvent, render, renderHook, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import CodigoAcceso from '@/app/(auth)/codigo-acceso';
import CrearCuenta from '@/app/(auth)/crear-cuenta';
import { resetSessionForTests, useSession } from '@/data/session';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), dismissTo: jest.fn() },
}));
jest.mock('@/data/registration-api', () => {
  process.env.EXPO_PUBLIC_API_URL = 'https://api.example.test';
  return jest.requireActual('@/data/registration-api');
});
jest.mock('expo-crypto', () => ({
  randomUUID: jest.requireActual<{ randomUUID: () => string }>('node:crypto').randomUUID,
}));

const terminosVersionId = 'a0000000-0000-4000-8000-000000000001';
const avisoVersionId = 'a0000000-0000-4000-8000-000000000002';
const challenge = {
  id: 'a0000000-0000-4000-8000-000000000003',
  expiraEn: '2099-01-01T00:00:00.000Z',
  reenvioDisponibleEn: '2020-01-01T00:00:00.000Z',
};
const documents = {
  terminos: {
    id: terminosVersionId,
    version: '1.0',
    contenidoMarkdown: '# Reglas vigentes',
    finalidades: [],
  },
  avisoPrivacidad: {
    id: avisoVersionId,
    version: '1.0',
    contenidoMarkdown: '# Aviso vigente',
    finalidades: [{ id: 'cuenta', descripcion: 'Gestionar la cuenta', necesaria: true }],
  },
};
const verified = {
  accessToken: 'access-test',
  refreshToken: 'refresh-test',
  accessExpiresIn: 900,
  sessionExpiresAt: '2099-01-01T00:00:00.000Z',
  sessionId: 'session-test',
  tokenType: 'Bearer',
  usuario: { id: 'account-test', nombre: 'Ada', correo: 'ada@example.test' },
};

function response(status: number, body: unknown) {
  return { ok: status < 400, status, headers: new Headers(), json: async () => body } as Response;
}

describe('Registro con API', () => {
  beforeEach(() => {
    resetSessionForTests();
    jest.clearAllMocks();
  });
  afterEach(() => jest.restoreAllMocks());

  it('envía los documentos y consentimientos vigentes, reenvía el código e inicia sesión al verificar', async () => {
    const fetcher = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(200, documents))
      .mockRejectedValueOnce(new Error('connection lost'))
      .mockResolvedValueOnce(response(202, challenge))
      .mockResolvedValueOnce(response(401, { code: 'CODE_INVALID' }))
      .mockResolvedValueOnce(response(401, { code: 'CODE_EXPIRED' }))
      .mockResolvedValueOnce(response(202, challenge))
      .mockResolvedValueOnce(response(201, verified));
    const form = await render(<CrearCuenta />);
    const press = (name: string) => fireEvent.press(screen.getByRole('button', { name }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Leer Términos y condiciones' }));
    expect(screen.getByRole('header', { name: 'Reglas vigentes' })).toBeOnTheScreen();
    await press('Cerrar documento');

    const fields = {
      Nombre: 'Ada',
      Apellidos: 'Lovelace',
      'Fecha de nacimiento': '10121999',
      'Correo electrónico': ' ADA@example.test ',
      Contraseña: 'Seguro2026!x',
      'Confirmar contraseña': 'Seguro2026!x',
    };
    for (const [label, value] of Object.entries(fields)) {
      await fireEvent.changeText(screen.getByLabelText(`${label}, obligatorio`), value);
    }
    await press('Crear cuenta');
    expect(fetcher).toHaveBeenCalledTimes(1);
    for (const name of [
      'Acepto los Términos y condiciones de Criterika',
      'Reconozco que se presentó el Aviso de privacidad',
      'Consiento: Gestionar la cuenta (necesaria)',
    ]) {
      const checkbox = screen.getByRole('checkbox', { name });
      expect(checkbox).not.toBeChecked();
      await fireEvent.press(checkbox);
    }
    await press('Crear cuenta');
    expect(router.push).not.toHaveBeenCalled();
    await press('Crear cuenta');
    expect(router.push).toHaveBeenCalledWith('/codigo-acceso');
    const [url, start] = fetcher.mock.calls[2];
    expect(url).toBe('https://api.example.test/api/v1/auth/registrations');
    expect(new Headers(start?.headers).get('Idempotency-Key')).toBe(
      new Headers(fetcher.mock.calls[1][1]?.headers).get('Idempotency-Key'),
    );
    expect(JSON.parse(String(start?.body))).toMatchObject({
      nombre: 'Ada',
      apellidos: 'Lovelace',
      fechaNacimiento: '1999-12-10',
      correo: 'ada@example.test',
      aceptacion: {
        terminosVersionId,
        avisoVersionId,
        aceptaTerminos: true,
        reconoceAvisoPresentado: true,
        consienteFinalidadesIds: ['cuenta'],
      },
    });
    await form.unmount();

    const { result } = await renderHook(() => useSession());
    await render(<CodigoAcceso />);
    await fireEvent.changeText(screen.getByLabelText('Código de acceso'), '000001');
    await press('Verificar');
    expect(screen.getByRole('alert', { name: /El código es incorrecto/ })).toBeOnTheScreen();
    await press('Verificar');
    expect(screen.getByRole('alert', { name: /El código venció/ })).toBeOnTheScreen();
    await press('Reenviar código');
    expect(fetcher.mock.calls[5][0]).toBe(
      `https://api.example.test/api/v1/auth/registrations/${challenge.id}/resend`,
    );
    expect(screen.getByLabelText('Código de acceso')).toHaveDisplayValue('');
    await fireEvent.changeText(screen.getByLabelText('Código de acceso'), '012345');
    await press('Verificar');
    expect(fetcher.mock.calls[6][0]).toBe(
      `https://api.example.test/api/v1/auth/registrations/${challenge.id}/verify`,
    );
    expect(JSON.parse(String(fetcher.mock.calls[6][1]?.body))).toEqual({ codigo: '012345' });
    expect(result.current).toMatchObject({
      firstName: 'Ada',
      email: 'ada@example.test',
      backend: { sessionId: 'session-test' },
    });
  }, 20000);
});
