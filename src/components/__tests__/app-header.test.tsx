import { render, screen } from '@testing-library/react-native';

import { AppHeader } from '@/components/app-header';

describe('AppHeader', () => {
  const stats = { lives: 3, gems: 450, streakDays: 7 };

  it('muestra las vidas, las gemas y la racha del jugador', async () => {
    await render(<AppHeader stats={stats} />);

    expect(screen.getByLabelText('3 vidas')).toHaveTextContent('3');
    expect(screen.getByLabelText('450 gemas')).toHaveTextContent('450');
    expect(screen.getByLabelText('Racha de 7 días')).toHaveTextContent('7');
  });

  it('muestra el logo de Criterika', async () => {
    await render(<AppHeader stats={stats} />);

    expect(screen.getByRole('image', { name: 'Criterika' })).toBeOnTheScreen();
  });
});
