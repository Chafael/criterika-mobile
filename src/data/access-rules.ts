/**
 * Sign-up rules from Figma 1:76 (password requirements 47:1110, age note 16:11)
 * and the privacy notice 17c (51:1164, "Solo para mayores de edad").
 */

export type PasswordRequirement = {
  id: 'length' | 'uppercase' | 'number' | 'special';
  label: string;
  isMet: (password: string) => boolean;
};

export const MIN_PASSWORD_LENGTH = 8;
export const ADULT_AGE = 18;

export const passwordRequirements: readonly PasswordRequirement[] = [
  {
    id: 'length',
    label: 'Mínimo 8 caracteres',
    isMet: (password) => [...password].length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: 'uppercase',
    label: 'Al menos una letra mayúscula',
    isMet: (password) => /\p{Lu}/u.test(password),
  },
  {
    id: 'number',
    label: 'Al menos un número',
    isMet: (password) => /\p{N}/u.test(password),
  },
  {
    id: 'special',
    label: 'Al menos un carácter especial (!@#$…)',
    isMet: (password) => /[^\p{L}\p{N}\s]/u.test(password),
  },
];

/** Registration API validates the exact Unicode length of the original password. */
export const registrationPasswordRequirement: PasswordRequirement = {
  id: 'length',
  label: 'Entre 12 y 128 caracteres',
  isMet: (password) => {
    const length = Array.from(password).length;
    return length >= 12 && length <= 128;
  },
};

export function countMetRequirements(password: string): number {
  return passwordRequirements.filter((requirement) => requirement.isMet(password)).length;
}

export function isStrongPassword(password: string): boolean {
  return countMetRequirements(password) === passwordRequirements.length;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Keeps only digits and inserts the slashes of "dd/mm/aaaa" while typing. */
export function formatBirthDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('/');
}

/** Parses "dd/mm/aaaa" into a local date. Returns null if the date does not exist. */
export function parseBirthDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const exists =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return exists ? date : null;
}

export function ageOn(birthDate: Date, today: Date): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPending =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (birthdayPending) {
    age -= 1;
  }
  return age;
}

export function isAdult(birthDate: Date, today: Date = new Date()): boolean {
  return birthDate.getTime() <= today.getTime() && ageOn(birthDate, today) >= ADULT_AGE;
}
