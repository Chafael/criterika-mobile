import { fireEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { renderRouter, screen } from 'expo-router/testing-library';

import Niveles from '@/app/(tabs)/index';
import LevelScreen from '@/app/nivel/[levelId]';

function TestLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'none' }} />;
}

describe('Nivel de prueba', () => {
  it('conserva el tablero al cancelar la salida y recorre las tres actividades hasta volver al camino', async () => {
    await renderRouter({ _layout: TestLayout, index: Niveles, 'nivel/[levelId]': LevelScreen });
    const press = (name: string) => fireEvent.press(screen.getByRole('button', { name }));

    await press('Nivel 3: Discriminación algorítmica. Nivel actual activo.');
    await press('Iniciar nivel');
    expect(screen).toHavePathname('/nivel/u2-n3');
    await press('Carta oculta 1');
    await press('Salir del nivel');
    expect(screen.getByRole('header', { name: '¿Salir del nivel?' })).toBeOnTheScreen();
    await press('Seguir jugando');

    expect(screen.getByText('Sesgo de selección')).toBeOnTheScreen();
    await press('Carta oculta 2');
    expect(screen.getByText('1 de 3 pares encontrados')).toBeOnTheScreen();
    await press('Carta oculta 3');
    await press('Carta oculta 5');
    await press('Carta oculta 4');
    await press('Carta oculta 6');
    await press('Ver resultado');
    expect(screen.getByRole('header', { name: '¡Actividad superada!' })).toBeOnTheScreen();
    expect(screen.getByText('Nivel 3 · 1 de 3 actividades superadas')).toBeOnTheScreen();
    await press('Siguiente actividad');
    for (const [start, end] of [
      ['D, fila 1, columna 1', 'S, fila 1, columna 5'],
      ['E, fila 2, columna 2', 'D, fila 8, columna 2'],
      ['A, fila 4, columna 1', 'R, fila 4, columna 7'],
      ['S, fila 3, columna 8', 'O, fila 7, columna 8'],
    ]) {
      await press(start);
      await press(end);
      await press('Comprobar palabra');
    }
    await press('Ver resultado');
    expect(screen.getByText('Nivel 3 · 2 de 3 actividades superadas')).toBeOnTheScreen();
    await press('Siguiente actividad');
    for (const letter of 'EQUIDAD') await press(`Letra ${letter}`);
    await press('Pista 2V, Información para aprender');
    await press('Casilla fila 2, columna 5, vacía');
    for (const letter of 'ATOS') await press(`Letra ${letter}`);
    await press('Comprobar');
    expect(screen.getByText('Nivel 3 · 3 de 3 actividades superadas')).toBeOnTheScreen();
    await press('Volver al camino');
    expect(screen).toHavePathname('/');
  });

  it('cuenta un error por pareja incorrecta y reinicia el tablero en la siguiente ejecución', async () => {
    await renderRouter(
      { _layout: TestLayout, index: Niveles, 'nivel/[levelId]': LevelScreen },
      {
        initialUrl: '/nivel/u2-n3',
      },
    );
    const press = (name: string) => fireEvent.press(screen.getByRole('button', { name }));
    for (let error = 1; error <= 3; error += 1) {
      await press('Carta oculta 1');
      await press('Carta oculta 3');
      expect(screen.getByText(`Errores: ${error} de 3`)).toBeOnTheScreen();
      await press(error === 3 ? 'Ver resultado' : 'Continuar resolución');
    }
    await press('Reintentar actividad');
    expect(screen.getByText('Ejecución 2 de 3')).toBeOnTheScreen();
    expect(screen.getByText('Errores: 0 de 3')).toBeOnTheScreen();
    expect(screen.getAllByRole('button', { name: /Carta oculta/ })).toHaveLength(6);

    await press('Salir del nivel');
    await press('Salir del intento');
    expect(screen).toHavePathname('/');
  });
});
