import { useSyncExternalStore } from 'react';

import { mockAccounts, mockExpiredCode, type MockAccount } from '@/mocks/session';

export type Session = {
  email: string;
  firstName: string;
};

export type SignInResult =
  | { status: 'code-sent'; email: string }
  | { status: 'invalid-credentials' }
  | { status: 'blocked' };

export type VerifyCodeResult = { status: 'verified' } | { status: 'expired' } | { status: 'no-pending' };

export type RegisterInput = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
};

export type RegisterResult = { status: 'code-sent'; email: string };

/**
 * Session state for the whole app. Screens read it with `useSession()` and
 * change it through the async functions below, which use the mocks in
 * `src/mocks/session.ts` for now. Replace their bodies with the backend
 * calls without touching the screens.
 */
let accounts: MockAccount[] = [...mockAccounts];
let session: Session | null = null;
/** Account waiting for its access code (after sign in or sign up). */
let pending: MockAccount | null = null;
/** Email that asked for a password reset. */
let resetEmail: string | null = null;

const listeners = new Set<() => void>();

function setSession(next: Session | null) {
  session = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSession() {
  return session;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function findAccount(email: string) {
  const normalized = normalizeEmail(email);
  return accounts.find((account) => account.email === normalized);
}

/** Current session, or null while signed out. Re-renders on sign in and sign out. */
export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSession, getSession);
}

/** Checks the credentials and, when valid, sends an access code to the email. */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const account = findAccount(email);
  if (account?.status === 'blocked') {
    return { status: 'blocked' };
  }
  if (!account || account.password !== password) {
    return { status: 'invalid-credentials' };
  }
  pending = account;
  return { status: 'code-sent', email: account.email };
}

/** Creates the account and sends an access code to verify the email. */
export async function register(input: RegisterInput): Promise<RegisterResult> {
  const account: MockAccount = {
    email: normalizeEmail(input.email),
    password: input.password,
    firstName: input.firstName.trim(),
    status: 'active',
  };
  accounts = [...accounts.filter((item) => item.email !== account.email), account];
  pending = account;
  return { status: 'code-sent', email: account.email };
}

/** Verifies the access code. On success the session starts. */
export async function verifyAccessCode(code: string): Promise<VerifyCodeResult> {
  if (!pending) {
    return { status: 'no-pending' };
  }
  if (code.trim().toUpperCase() === mockExpiredCode) {
    return { status: 'expired' };
  }
  const { email, firstName } = pending;
  pending = null;
  setSession({ email, firstName });
  return { status: 'verified' };
}

/** Sends a new access code to the pending account. */
export async function resendAccessCode(): Promise<void> {}

/** Sends a one-time reset link (valid for 10 minutes) to the email. */
export async function requestPasswordReset(email: string): Promise<void> {
  resetEmail = normalizeEmail(email);
}

/** Saves the new password for the email that asked for the reset link. */
export async function resetPassword(password: string): Promise<void> {
  if (resetEmail) {
    const email = resetEmail;
    accounts = accounts.map((account) =>
      account.email === email ? { ...account, password } : account,
    );
  }
  resetEmail = null;
}

export function signOut() {
  setSession(null);
}

/** Restores the initial mock state. Only for tests. */
export function resetSessionForTests() {
  accounts = [...mockAccounts];
  pending = null;
  resetEmail = null;
  setSession(null);
}
