import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';

describe('PrimaryButton', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('muestra la etiqueta como botón accesible', async () => {
    await render(<PrimaryButton label="Iniciar nivel" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Iniciar nivel' })).toBeOnTheScreen();
    expect(screen.getByText('Iniciar nivel')).toBeOnTheScreen();
  });

  it('llama a onPress cuando el jugador lo presiona', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<PrimaryButton label="Iniciar nivel" onPress={onPress} />);

    await user.press(screen.getByRole('button', { name: 'Iniciar nivel' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('baja 4 px en 100 ms al presionar y regresa al soltar', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    await render(<PrimaryButton label="Iniciar nivel" onPress={jest.fn()} />);
    const button = screen.getByRole('button', { name: 'Iniciar nivel' });

    fireEvent(button, 'pressIn');
    expect(timing).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 4, duration: 100, useNativeDriver: true }),
    );

    fireEvent(button, 'pressOut');
    expect(timing).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 0, duration: 100, useNativeDriver: true }),
    );
  });
});
