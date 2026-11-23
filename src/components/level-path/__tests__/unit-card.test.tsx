import { render, screen } from '@testing-library/react-native';

import { UnitCard } from '@/components/level-path/unit-card';

describe('UnitCard', () => {
  it('muestra la unidad, su descripción y el avance', async () => {
    await render(
      <UnitCard
        unitNumber={2}
        title="Sesgo Algorítmico e IA"
        description="Cómo los datos y los algoritmos pueden discriminar."
        completed={2}
        total={5}
      />,
    );

    expect(screen.getByText('Unidad 2')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Sesgo Algorítmico e IA' })).toBeOnTheScreen();
    expect(screen.getByText('2 / 5 completados')).toBeOnTheScreen();
    expect(screen.getByRole('progressbar')).toHaveAccessibilityValue({ min: 0, max: 5, now: 2 });
  });

  it('llena la barra en proporción a los niveles completados', async () => {
    await render(<UnitCard unitNumber={1} title="T" description="D" completed={2} total={5} />);

    expect(screen.getByTestId('unit-progress-fill')).toHaveStyle({ width: '40%' });
  });
});
