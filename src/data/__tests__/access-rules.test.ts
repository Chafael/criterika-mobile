import {
  countMetRequirements,
  formatBirthDateInput,
  isAdult,
  isStrongPassword,
  isValidEmail,
  parseBirthDate,
  passwordRequirements,
} from '@/data/access-rules';

function metIds(password: string) {
  return passwordRequirements.filter((item) => item.isMet(password)).map((item) => item.id);
}

describe('Reglas de acceso', () => {
  describe('contraseña', () => {
    it('lista los cuatro requisitos del diseño', () => {
      expect(passwordRequirements.map((item) => item.label)).toEqual([
        'Mínimo 8 caracteres',
        'Al menos una letra mayúscula',
        'Al menos un número',
        'Al menos un carácter especial (!@#$…)',
      ]);
    });

    it('evalúa cada requisito por separado', () => {
      expect(metIds('')).toEqual([]);
      expect(metIds('abcdefgh')).toEqual(['length']);
      expect(metIds('Abc')).toEqual(['uppercase']);
      expect(metIds('abc1')).toEqual(['number']);
      expect(metIds('abc!')).toEqual(['special']);
      expect(metIds('Ñandú 2026')).toEqual(['length', 'uppercase', 'number']);
    });

    it('solo es segura con los cuatro requisitos', () => {
      expect(countMetRequirements('Criterika2026')).toBe(3);
      expect(isStrongPassword('Criterika2026')).toBe(false);
      expect(isStrongPassword('Criterika#2026')).toBe(true);
      expect(isStrongPassword('Cr#2026')).toBe(false);
    });
  });

  it('valida el formato del correo', () => {
    expect(isValidEmail('ada@criterika.com')).toBe(true);
    expect(isValidEmail(' ada@criterika.com ')).toBe(true);
    expect(isValidEmail('ada@criterika')).toBe(false);
    expect(isValidEmail('ada criterika.com')).toBe(false);
  });

  describe('fecha de nacimiento', () => {
    it('aplica la máscara dd/mm/aaaa mientras se escribe', () => {
      expect(formatBirthDateInput('1')).toBe('1');
      expect(formatBirthDateInput('150')).toBe('15/0');
      expect(formatBirthDateInput('15062000')).toBe('15/06/2000');
      expect(formatBirthDateInput('15/06/20001')).toBe('15/06/2000');
    });

    it('rechaza fechas que no existen', () => {
      expect(parseBirthDate('31/02/2000')).toBeNull();
      expect(parseBirthDate('15/6/2000')).toBeNull();
      expect(parseBirthDate('29/02/2004')).toEqual(new Date(2004, 1, 29));
    });

    it('solo admite mayores de edad', () => {
      const today = new Date(2026, 10, 23);
      expect(isAdult(new Date(2008, 10, 23), today)).toBe(true);
      expect(isAdult(new Date(2008, 10, 24), today)).toBe(false);
      expect(isAdult(new Date(2030, 0, 1), today)).toBe(false);
    });
  });
});
