import { getUnitProgress, type Level, type UnitClosing } from '@/data/level-path';

const closing: UnitClosing = {
  title: 'Cierre',
  cardName: 'Carta',
  badge: 'Recompensa',
  status: 'locked',
};

function level(number: number, status: Level['status']): Level {
  return { id: `n${number}`, number, title: `Nivel ${number}`, status };
}

describe('getUnitProgress', () => {
  it('cuenta el cierre de la unidad como un nivel más (2 / 5 en el diseño)', () => {
    const levels = [
      level(1, 'completed'),
      level(2, 'completed'),
      level(3, 'active'),
      level(4, 'locked'),
    ];

    expect(getUnitProgress({ levels, closing })).toEqual({ completed: 2, total: 5 });
  });

  it('cuenta el cierre como completado cuando ya se superó', () => {
    const levels = [level(1, 'completed')];

    expect(
      getUnitProgress({ levels, closing: { ...closing, status: 'completed' } }),
    ).toEqual({ completed: 2, total: 2 });
  });
});
