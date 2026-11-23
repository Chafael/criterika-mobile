/**
 * Test accounts for the access flow, until the backend API is wired.
 *
 * | Case                         | Email                     | Password        | Result                                  |
 * | ---------------------------- | ------------------------- | --------------- | --------------------------------------- |
 * | Sign in                      | jugador@criterika.com     | Criterika#2026  | Sends the access code, then enters      |
 * | Wrong credentials (19.15)    | incorrecta@criterika.com  | any             | "Correo o contraseña incorrectos" alert |
 * | Blocked account (19.09)      | bloqueada@criterika.com   | any             | "Cuenta bloqueada" dialog               |
 *
 * Any other email or password also returns wrong credentials.
 *
 * Access code (03): any code enters except `CRT-0000`, which is expired (19.16).
 * Accounts created in "Crear cuenta" and passwords changed in "Nueva contraseña"
 * live in memory until the app restarts.
 */
export type MockAccount = {
  email: string;
  password: string;
  firstName: string;
  status: 'active' | 'blocked';
};

export const mockTestEmails = {
  active: 'jugador@criterika.com',
  invalidCredentials: 'incorrecta@criterika.com',
  blocked: 'bloqueada@criterika.com',
} as const;

export const mockPassword = 'Criterika#2026';

export const mockExpiredCode = 'CRT-0000';

export const mockAccounts: readonly MockAccount[] = [
  { email: mockTestEmails.active, password: mockPassword, firstName: 'Ada', status: 'active' },
  { email: mockTestEmails.blocked, password: mockPassword, firstName: 'Alan', status: 'blocked' },
];
