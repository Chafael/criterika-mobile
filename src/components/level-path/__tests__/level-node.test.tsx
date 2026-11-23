import { render, screen, userEvent } from '@testing-library/react-native';

import { LevelNode } from '@/components/level-path/level-node';
import type { Level } from '@/data/level-path';

const base = { id: 'n', number: 3, title: 'Discriminación algorítmica' };

describe('LevelNode', () => {
  it('anuncia un nivel completado y no lo ofrece como botón', async () => {
    const level: Level = { ...base, status: 'completed' };
    await render(<LevelNode level={level} />);

    expect(
      screen.getByLabelText('Nivel 3: Discriminación algorítmica. Completado con éxito.'),
    ).toBeOnTheScreen();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('anuncia un nivel bloqueado sin permitir iniciarlo', async () => {
    const level: Level = { ...base, status: 'locked' };
    await render(<LevelNode level={level} />);

    expect(
      screen.getByLabelText('Nivel 3: Discriminación algorítmica. Bloqueado.'),
    ).toBeOnTheScreen();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('permite iniciar el nivel activo y muestra el mensaje de la mascota', async () => {
    const onStart = jest.fn();
    const user = userEvent.setup();
    const level: Level = { ...base, status: 'active' };
    await render(<LevelNode level={level} mascotMessage="¡Vamos a reflexionar juntos!" onStart={onStart} />);

    await user.press(
      screen.getByRole('button', { name: 'Nivel 3: Discriminación algorítmica. Nivel actual activo.' }),
    );

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(screen.getByText('¡Vamos a reflexionar juntos!')).toBeOnTheScreen();
    expect(screen.getByText('3. Discriminación algorítmica')).toBeOnTheScreen();
  });
});
