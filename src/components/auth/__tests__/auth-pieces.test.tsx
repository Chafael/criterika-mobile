import { render, screen, userEvent } from '@testing-library/react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { BackButton } from '@/components/auth/back-button';
import { PasswordRequirements } from '@/components/auth/password-requirements';
import { TextField } from '@/components/auth/text-field';
import { icons } from '@/media';

describe('Piezas del acceso', () => {
  it('el campo anuncia su etiqueta, si es obligatorio, y reenvía lo escrito', async () => {
    const onChangeText = jest.fn();
    const user = userEvent.setup();
    await render(
      <TextField
        label="Correo electrónico"
        requiredMark="danger"
        gap={4}
        placeholder="tu.correo@ejemplo.com"
        onChangeText={onChangeText}
      />,
    );

    const input = screen.getByLabelText('Correo electrónico, obligatorio');
    await user.type(input, 'ada@criterika.com');

    expect(screen.getByPlaceholderText('tu.correo@ejemplo.com')).toBeOnTheScreen();
    expect(onChangeText).toHaveBeenLastCalledWith('ada@criterika.com');
  });

  it('el campo ejecuta su acción de la derecha', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(
      <TextField
        label="Contraseña"
        gap={6}
        trailingAction={{
          Icon: icons.eye,
          width: 18.333,
          height: 12.5,
          accessibilityLabel: 'Mostrar contraseña',
          onPress,
        }}
      />,
    );

    await user.press(screen.getByRole('button', { name: 'Mostrar contraseña' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('los requisitos cuentan los que se cumplen', async () => {
    const { rerender } = await render(<PasswordRequirements password="" />);

    expect(screen.getByText('0 de 4')).toBeOnTheScreen();
    expect(screen.getByLabelText('Mínimo 8 caracteres: pendiente')).toBeOnTheScreen();

    await rerender(<PasswordRequirements password="criterika1" />);

    expect(screen.getByText('2 de 4')).toBeOnTheScreen();
    expect(screen.getByLabelText('Mínimo 8 caracteres: cumplido')).toBeOnTheScreen();
    expect(screen.getByLabelText('Al menos un número: cumplido')).toBeOnTheScreen();
    expect(screen.getByLabelText('Al menos una letra mayúscula: pendiente')).toBeOnTheScreen();
  });

  it('el botón principal y el de volver responden al toque', async () => {
    const onMain = jest.fn();
    const onBack = jest.fn();
    const user = userEvent.setup();
    await render(
      <>
        <BackButton accessibilityLabel="Volver atrás" surface="card" onPress={onBack} />
        <AuthButton label="Iniciar sesión" size="large" height={52} onPress={onMain} />
      </>,
    );

    await user.press(screen.getByRole('button', { name: 'Volver atrás' }));
    await user.press(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onMain).toHaveBeenCalledTimes(1);
  });
});
