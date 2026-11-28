import { fireEvent, render, screen } from '@testing-library/react-native';

import { CrosswordGame } from '@/components/activities/crossword-game';
import { WordSearchGame } from '@/components/activities/word-search-game';

const press = (name: string) => fireEvent.press(screen.getByRole('button', { name }));

describe('Sopa de letras', () => {
  it('permite consultar definiciones y corregir selecciones sin quitar hallazgos', async () => {
    const outcome = jest.fn();
    await render(<WordSearchGame wide={false} index={2} execution={1} onOutcome={outcome} />);
    await press('Definición de EQUIDAD');
    expect(screen.getByText(/EQUIDAD: Tratar de forma justa/)).toBeOnTheScreen();

    await press('D, fila 1, columna 1');
    await press('E, fila 2, columna 2');
    await press('Comprobar palabra');
    expect(screen.getByText(/Selecciona de izquierda a derecha/)).toBeOnTheScreen();
    await press('Limpiar');
    await press('D, fila 1, columna 1');
    await press('S, fila 1, columna 5');
    await press('Comprobar palabra');
    expect(screen.getByText('1 de 4 halladas')).toBeOnTheScreen();
    await press('D, fila 1, columna 1, encontrada');
    await press('S, fila 1, columna 5, encontrada');
    await press('Comprobar palabra');
    expect(screen.getByText('Ya encontraste esa palabra.')).toBeOnTheScreen();
    expect(screen.getByText('1 de 4 halladas')).toBeOnTheScreen();
    expect(outcome).not.toHaveBeenCalled();
  });
});

describe('Crucigrama', () => {
  it('conserva las letras cruzadas, marca errores y devuelve el resultado al agotar comprobaciones', async () => {
    const outcome = jest.fn();
    await render(<CrosswordGame wide execution={1} onOutcome={outcome} />);
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeDisabled();
    for (const letter of 'EQUIDAD') await press(`Letra ${letter}`);
    await press('Girar, cambiar orientación');
    expect(screen.getByRole('button', { name: 'Casilla fila 1, columna 5, D' })).toBeSelected();
    await press('Casilla fila 2, columna 5, vacía');
    for (const letter of 'ATOZ') await press(`Letra ${letter}`);

    await press('Comprobar');
    expect(screen.getByText('Comprobaciones: 1 de 3')).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Casilla fila 5, columna 5, Z, incorrecta' }),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeDisabled();
    expect(outcome).not.toHaveBeenCalled();
    for (const letter of 'XY') {
      await press('Borrar letra');
      await press(`Letra ${letter}`);
      await press('Comprobar');
    }
    expect(outcome).toHaveBeenCalledTimes(1);
    expect(outcome).toHaveBeenCalledWith('failed');
  });
});
