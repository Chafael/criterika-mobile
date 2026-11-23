import { render, screen, userEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { AlertBanner } from '@/components/alert/alert-banner';
import { AlertCard } from '@/components/alert/alert-card';
import { AlertDialog } from '@/components/alert/alert-dialog';

type Instance = ReturnType<typeof screen.getByText>;

function closestWithBackground(node: Instance): Instance | null {
  let current = node.parent;
  while (current) {
    const style = StyleSheet.flatten(current.props.style);
    if (typeof current.type === 'string' && style?.backgroundColor) {
      return current;
    }
    current = current.parent;
  }
  return null;
}

describe('Alerta', () => {
  it('ventana: muestra título, mensaje y las dos acciones', async () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();
    const user = userEvent.setup();
    await render(
      <AlertCard
        variant="dialog"
        title="¿Salir del nivel?"
        message="Perderás tu avance."
        primaryLabel="Salir"
        onPrimary={onPrimary}
        secondaryLabel="Seguir jugando"
        onSecondary={onSecondary}
      />,
    );

    expect(screen.getByRole('header', { name: '¿Salir del nivel?' })).toBeOnTheScreen();
    expect(screen.getByText('Perderás tu avance.')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Salir' }));
    await user.press(screen.getByRole('button', { name: 'Seguir jugando' }));

    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('ventana: oculta el botón secundario si no se indica', async () => {
    await render(
      <AlertCard
        variant="dialog"
        tone="danger"
        title="Título"
        message="Mensaje"
        primaryLabel="Entendido"
      />,
    );

    expect(screen.getByRole('button', { name: 'Entendido' })).toBeOnTheScreen();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('ventana de peligro: usa el botón rojo con sombra dura', async () => {
    await render(
      <AlertDialog
        visible
        tone="danger"
        title="Cuenta bloqueada"
        message="Mensaje"
        primaryLabel="Entendido"
        onPrimary={jest.fn()}
      />,
    );

    const label = screen.getByText('Entendido');
    expect(label).toHaveStyle({ color: '#FFFDF8' });
    const face = closestWithBackground(label);
    expect(face).toHaveStyle({ backgroundColor: '#C0392B' });
  });

  it('aviso: se anuncia como alerta y se cierra al tocarlo', async () => {
    const onDismiss = jest.fn();
    const user = userEvent.setup();
    await render(
      <AlertBanner
        alert={{ tone: 'danger', title: 'El código venció', message: 'Pide uno nuevo.' }}
        onDismiss={onDismiss}
      />,
    );

    const banner = screen.getByRole('alert', { name: 'El código venció. Pide uno nuevo.' });
    await user.press(banner);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('aviso: no muestra nada sin alerta', async () => {
    await render(<AlertBanner alert={null} onDismiss={jest.fn()} />);

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
