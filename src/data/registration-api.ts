import { randomUUID } from 'expo-crypto';

export const registrationEnabled = Boolean(process.env.EXPO_PUBLIC_API_URL?.trim());

export type RegistrationPurpose = { id: string; descripcion: string; necesaria: boolean };
export type RegistrationDocument = {
  id: string;
  version: string;
  contenidoMarkdown: string;
  finalidades: RegistrationPurpose[];
};
export type RegistrationDocuments = {
  terminos: RegistrationDocument;
  avisoPrivacidad: RegistrationDocument;
};
export type RegistrationAcceptance = {
  terminosVersionId: string;
  avisoVersionId: string;
  aceptaTerminos: true;
  reconoceAvisoPresentado: true;
  consienteFinalidadesIds: string[];
};
export type RegistrationChallenge = {
  id: string;
  expiraEn: string;
  reenvioDisponibleEn: string;
};
export type RegistrationSession = {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  sessionExpiresAt: string;
  sessionId: string;
  tokenType: 'Bearer';
  usuario: { id: string; nombre: string; correo: string };
};
type StartInput = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
};

export class RegistrationError extends Error {
  constructor(
    readonly code: string,
    readonly retryable: boolean = false,
    readonly retryAfterSeconds?: number,
  ) {
    super(code);
    this.name = 'RegistrationError';
  }
}

/** Reuse an intent key when the result might already have committed on the server. */
export function retainRegistrationKey(error: unknown) {
  return error instanceof RegistrationError && error.retryable;
}

export const createRegistrationKey = randomUUID;

function apiRoot() {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');
  return url?.endsWith('/api/v1') ? url : `${url}/api/v1`;
}

function object(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new RegistrationError('UNEXPECTED_RESPONSE', true);
  }
  return value as Record<string, unknown>;
}

async function request(path: string, write?: { key: string; data?: unknown }): Promise<unknown> {
  if (!registrationEnabled) throw new RegistrationError('API_NOT_CONFIGURED');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${apiRoot()}${path}`, {
      method: write ? 'POST' : 'GET',
      headers: {
        Accept: 'application/json, application/problem+json',
        ...(write ? { 'Content-Type': 'application/json', 'Idempotency-Key': write.key } : {}),
      },
      body: write?.data === undefined ? undefined : JSON.stringify(write.data),
      signal: controller.signal,
    });
    const value: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const problem = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
      const code = typeof problem.code === 'string' ? problem.code : 'SERVER_UNAVAILABLE';
      const wait = Number(response.headers.get('Retry-After'));
      throw new RegistrationError(
        code,
        response.status >= 500 || code === 'REQUEST_IN_PROGRESS',
        Number.isFinite(wait) && wait > 0 ? Math.ceil(wait) : undefined,
      );
    }
    return value;
  } catch (error) {
    if (error instanceof RegistrationError) throw error;
    throw new RegistrationError('NETWORK_ERROR', true);
  } finally {
    clearTimeout(timeout);
  }
}

function document(value: unknown): RegistrationDocument {
  const { id, version, contenidoMarkdown, finalidades } = object(value);
  if (
    typeof id !== 'string' ||
    typeof version !== 'string' ||
    typeof contenidoMarkdown !== 'string' ||
    !contenidoMarkdown.trim() ||
    !Array.isArray(finalidades)
  ) {
    throw new RegistrationError('UNEXPECTED_RESPONSE', true);
  }
  const purposes = finalidades.map((purpose: unknown) => {
    const { id, descripcion, necesaria } = object(purpose);
    if (
      typeof id !== 'string' ||
      typeof descripcion !== 'string' ||
      typeof necesaria !== 'boolean'
    ) {
      throw new RegistrationError('UNEXPECTED_RESPONSE', true);
    }
    return { id, descripcion, necesaria };
  });
  return { id, version, contenidoMarkdown, finalidades: purposes };
}

export async function getRegistrationDocuments(): Promise<RegistrationDocuments> {
  const { terminos, avisoPrivacidad } = object(await request('/legal/documents/current'));
  return { terminos: document(terminos), avisoPrivacidad: document(avisoPrivacidad) };
}

function challenge(value: unknown): RegistrationChallenge {
  const { id, expiraEn, reenvioDisponibleEn } = object(value);
  if (
    typeof id !== 'string' ||
    typeof expiraEn !== 'string' ||
    typeof reenvioDisponibleEn !== 'string' ||
    !Number.isFinite(Date.parse(expiraEn)) ||
    !Number.isFinite(Date.parse(reenvioDisponibleEn))
  ) {
    throw new RegistrationError('UNEXPECTED_RESPONSE', true);
  }
  return { id, expiraEn, reenvioDisponibleEn };
}

export async function startRegistration(
  input: StartInput,
  aceptacion: RegistrationAcceptance,
  key: string,
) {
  const { birthDate } = input;
  const month = String(birthDate.getMonth() + 1).padStart(2, '0');
  const day = String(birthDate.getDate()).padStart(2, '0');
  return challenge(
    await request('/auth/registrations', {
      key,
      data: {
        nombre: input.firstName.trim(),
        apellidos: input.lastName.trim(),
        fechaNacimiento: `${birthDate.getFullYear()}-${month}-${day}`,
        correo: input.email.trim().toLowerCase(),
        contrasena: input.password,
        aceptacion,
      },
    }),
  );
}

export async function resendRegistration(id: string, key: string) {
  return challenge(await request(`/auth/registrations/${encodeURIComponent(id)}/resend`, { key }));
}

export async function verifyRegistration(
  id: string,
  codigo: string,
  key: string,
): Promise<RegistrationSession> {
  const result = object(
    await request(`/auth/registrations/${encodeURIComponent(id)}/verify`, {
      key,
      data: { codigo },
    }),
  );
  const { accessToken, refreshToken, accessExpiresIn, sessionExpiresAt, sessionId, tokenType } =
    result;
  const { id: accountId, nombre, correo } = object(result.usuario);
  if (
    typeof accessToken !== 'string' ||
    !accessToken ||
    typeof refreshToken !== 'string' ||
    !refreshToken ||
    typeof accessExpiresIn !== 'number' ||
    typeof sessionExpiresAt !== 'string' ||
    typeof sessionId !== 'string' ||
    tokenType !== 'Bearer' ||
    typeof accountId !== 'string' ||
    typeof nombre !== 'string' ||
    typeof correo !== 'string'
  ) {
    throw new RegistrationError('UNEXPECTED_RESPONSE', true);
  }
  return {
    accessToken,
    refreshToken,
    accessExpiresIn,
    sessionExpiresAt,
    sessionId,
    tokenType,
    usuario: { id: accountId, nombre, correo },
  };
}
