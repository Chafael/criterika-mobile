import { fireEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { renderRouter, screen } from 'expo-router/testing-library';

import Cartas from '@/app/(tabs)/cartas';
import Niveles from '@/app/(tabs)/index';
import Tienda from '@/app/(tabs)/tienda';
import LevelScreen from '@/app/nivel/[levelId]';
import {
  getDemoProgress,
  reserveDemoAttempt,
  resetDemoProgressForTests,
  settleDemoAttempt,
} from '@/data/demo-progress';

function TestLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'none' }} />;
}

const routes = {
  _layout: TestLayout,
  index: Niveles,
  'nivel/[levelId]': LevelScreen,
  cartas: Cartas,
  tienda: Tienda,
};
const press = async (name: string) => fireEvent.press(await screen.findByRole('button', { name }));
const spentLife = () => {
  const reservation = reserveDemoAttempt('');
  if (reservation.kind !== 'started') throw new Error('Expected a reservation');
  settleDemoAttempt('', reservation.id, { status: 'lost' });
};

async function solveMemory() {
  for (const card of [1, 2, 3, 5, 4, 6]) await press(`Carta oculta ${card}`);
  await press('Ver resultado');
  await press('Siguiente actividad');
}

async function solveWordSearch() {
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
  await press('Siguiente actividad');
}

async function solveQuestions() {
  for (const [index, name] of [
    'Detenerlo, auditar los datos y corregir el sesgo antes de lanzar.',
    'Si el rendimiento es comparable en las distintas poblaciones.',
    'Investigar si actúa como variable proxy y medir su impacto.',
    'Explicar los factores relevantes y ofrecer revisión de la decisión.',
    'Revisar los errores, detectar cambios y corregir el problema.',
  ].entries()) {
    await fireEvent.press(screen.getByRole('radio', { name }));
    await press('Confirmar respuesta');
    expect(screen.getByText('Respuesta correcta')).toBeOnTheScreen();
    await press(index === 4 ? 'Ver resultado de preguntas' : 'Siguiente pregunta');
  }
  await press('Siguiente actividad');
}

async function solveCrossword() {
  for (const letter of 'EQUIDAD') await press(`Letra ${letter}`);
  await press('Pista 2V, Información para aprender');
  await press('Casilla fila 2, columna 5, vacía');
  for (const letter of 'ATOS') await press(`Letra ${letter}`);
  await press('Comprobar');
  await press('Siguiente actividad');
}

async function solveMatching() {
  for (const [concept, definition] of [
    ['Sesgo histórico', 'El modelo repite desigualdades que había en el pasado.'],
    [
      'Variable proxy',
      'Un dato que revela otro sensible, como el código postal que delata el origen.',
    ],
    ['Explicabilidad', 'Poder explicarle a la persona por qué el sistema decidió así.'],
  ]) {
    await press(`Concepto: ${concept}`);
    await press(`Definición: ${definition}`);
  }
  await press('Confirmar emparejamientos');
  await press('Ver resultado de relacionar');
}

describe('Nivel de prueba', () => {
  beforeEach(() => resetDemoProgressForTests());

  it('recorre las cinco actividades, conserva el tablero al cancelar y premia la primera aprobación', async () => {
    await renderRouter(routes);
    await press('Nivel 3: Discriminación algorítmica. Nivel actual activo.');
    await press('Iniciar nivel');
    expect(screen).toHavePathname('/nivel/u2-n3');
    await press('Carta oculta 1');
    await press('Salir del nivel');
    expect(screen.getByRole('header', { name: '¿Salir del nivel?' })).toBeOnTheScreen();
    await press('Seguir jugando');
    expect(screen.getByText('Sesgo de selección')).toBeOnTheScreen();
    for (const card of [2, 3, 5, 4, 6]) await press(`Carta oculta ${card}`);
    await press('Ver resultado');
    expect(screen.getByText('Nivel 3 · 1 de 5 actividades superadas')).toBeOnTheScreen();
    await press('Siguiente actividad');
    await solveWordSearch();
    expect(screen.getByText('Nivel 3 · 2 de 5 actividades superadas')).toBeOnTheScreen();
    await solveQuestions();
    await solveCrossword();
    await solveMatching();
    expect(screen.getByRole('header', { name: '¡Nivel superado!' })).toBeOnTheScreen();
    expect(screen.getByText('+150')).toBeOnTheScreen();
    expect(getDemoProgress('')).toMatchObject({ lives: 3, gems: 600, xp: 100, active: null });
    await press('Continuar');
    expect(screen).toHavePathname('/');
    expect(
      screen.getByRole('button', {
        name: 'Nivel 4: Transparencia y explicabilidad. Nivel actual activo.',
      }),
    ).toBeOnTheScreen();
    await press('Nivel 3: Discriminación algorítmica. Completado con éxito.');
    expect(screen.getByRole('button', { name: 'Practicar nivel' })).toBeOnTheScreen();
  });

  it('difiere la recuperación, consume una vida por fallo final y permite reintentar o salir', async () => {
    await renderRouter(routes, { initialUrl: '/nivel/u2-n3' });
    for (let error = 1; error <= 3; error += 1) {
      await press('Carta oculta 1');
      await press('Carta oculta 3');
      expect(screen.getByText(`Errores: ${error} de 3`)).toBeOnTheScreen();
      await press(error === 3 ? 'Ver resultado' : 'Continuar resolución');
    }
    expect(screen.getByText('Volverás a jugar memorama al final de la cola.')).toBeOnTheScreen();
    expect(getDemoProgress('').lives).toBe(3);
    await press('Siguiente actividad');
    await solveWordSearch();
    await solveQuestions();
    await solveCrossword();
    await solveMatching();
    await press('Siguiente actividad');
    expect(screen.getByText('Ejecución 2 de 3')).toBeOnTheScreen();
    expect(screen.getByText('Errores: 0 de 3')).toBeOnTheScreen();
    expect(screen.getAllByRole('button', { name: /Carta oculta/ })).toHaveLength(6);
    for (const execution of [2, 3]) {
      for (let error = 1; error <= 3; error += 1) {
        await press('Carta oculta 1');
        await press('Carta oculta 2');
        await press(error === 3 ? 'Ver resultado' : 'Continuar resolución');
      }
      if (execution === 2) await press('Reintentar actividad');
    }
    expect(screen.getByRole('header', { name: 'No superaste el nivel' })).toBeOnTheScreen();
    expect(getDemoProgress('')).toMatchObject({ lives: 2, active: null });
    await press('Reintentar nivel');
    expect(screen.getByText('Nivel 3 · 0 de 5 actividades superadas')).toBeOnTheScreen();
    await press('Salir del nivel');
    await press('Salir del intento');
    expect(screen).toHavePathname('/');
    expect(getDemoProgress('')).toMatchObject({ lives: 1, active: null });
  });

  it('muestra la última vida agotada y deja comprar un paquete de prueba', async () => {
    spentLife();
    spentLife();
    spentLife();
    await renderRouter(routes, { initialUrl: '/nivel/u2-n3' });
    expect(await screen.findByRole('header', { name: 'No te quedan vidas' })).toBeOnTheScreen();
    expect(screen.getByText(/Recuperas una vida en/)).toBeOnTheScreen();
    await press('Comprar vidas');
    expect(screen).toHavePathname('/tienda');
    await press('Comprar 3 vidas · 150 gemas');
    await press('Confirmar compra');
    expect(screen.getByText('Vidas disponibles en tu camino.')).toBeOnTheScreen();
    expect(getDemoProgress('')).toMatchObject({ lives: 3, gems: 300 });
  });

  it('entrega la carta y el premio del cierre cuando termina la unidad', async () => {
    for (const levelId of ['u2-n3', 'u2-n4']) {
      const reservation = reserveDemoAttempt('');
      if (reservation.kind !== 'started') throw new Error('Expected a reservation');
      settleDemoAttempt('', reservation.id, {
        status: 'passed',
        levelId,
        reward: { gems: 150, xp: 100 },
      });
    }
    await renderRouter(routes, { initialUrl: '/nivel/u2-final' });
    await solveMemory();
    await solveWordSearch();
    await solveQuestions();
    await solveCrossword();
    await solveMatching();
    expect(screen.getByRole('header', { name: '¡Unidad completada!' })).toBeOnTheScreen();
    expect(screen.getByText('+300')).toBeOnTheScreen();
    expect(screen.getByText('+250')).toBeOnTheScreen();
    await press('Ver mi carta');
    expect(screen).toHavePathname('/cartas');
    expect(screen.getByText('Equidad algorítmica')).toBeOnTheScreen();
  });
});
