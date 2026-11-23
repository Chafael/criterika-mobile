import { render, screen, userEvent } from '@testing-library/react-native';

import Niveles from '@/app/(tabs)/index';

describe('Pantalla Niveles', () => {
  it('muestra la unidad actual, sus niveles, el cierre y la próxima unidad', async () => {
    await render(<Niveles />);

    expect(screen.getByRole('header', { name: 'Sesgo Algorítmico e IA' })).toBeOnTheScreen();
    expect(screen.getByText('1. Qué es un sesgo')).toBeOnTheScreen();
    expect(screen.getByText('4. Transparencia y explicabilidad')).toBeOnTheScreen();
    expect(screen.getByText('Cierre: Equidad algorítmica')).toBeOnTheScreen();
    expect(screen.getByLabelText('Próxima unidad: Propiedad intelectual. Bloqueada.')).toBeOnTheScreen();
  });

  it('abre la vista previa del nivel activo y la cierra con "Ahora no"', async () => {
    const user = userEvent.setup();
    await render(<Niveles />);

    await user.press(
      screen.getByRole('button', {
        name: 'Nivel 3: Discriminación algorítmica. Nivel actual activo.',
      }),
    );

    expect(screen.getByText('UNIDAD 2 · NIVEL 3')).toBeOnTheScreen();
    expect(screen.getByText('5 actividades en este nivel')).toBeOnTheScreen();
    expect(screen.getByText('+150 gemas')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Iniciar nivel' })).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Ahora no' }));

    expect(screen.queryByText('UNIDAD 2 · NIVEL 3')).toBeNull();
  });
});
