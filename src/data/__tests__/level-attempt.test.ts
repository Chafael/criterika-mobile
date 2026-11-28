import {
  getDemoProgress,
  lifeInterval,
  refreshDemoLives,
  reserveDemoAttempt,
  resetDemoProgressForTests,
  settleDemoAttempt,
} from '@/data/demo-progress';
import { finishActivity, newLevelAttempt } from '@/data/level-attempt';
import { evaluateLinks, linkDefinition } from '@/data/matching';
import { answerQuestion } from '@/data/question';
import { matchingDemo } from '@/mocks/matching';
import { questionsDemo } from '@/mocks/questions';

describe('Reglas del nivel de prueba', () => {
  beforeEach(() => resetDemoProgressForTests());

  it('agota la actividad en su tercer fallo después de recorrer los pendientes', () => {
    let attempt = finishActivity(newLevelAttempt(), 'failed');
    expect(attempt.pending[0].name).toBe('Sopa de letras');
    for (let step = 0; step < 4; step++) attempt = finishActivity(attempt, 'passed');
    expect(attempt.pending).toEqual([{ name: 'Memorama', execution: 2 }]);
    attempt = finishActivity(attempt, 'failed');
    expect(attempt.pending).toEqual([{ name: 'Memorama', execution: 3 }]);
    expect(finishActivity(attempt, 'failed')).toEqual({ pending: [], completed: 4, failure: true });
  });

  it('reserva una sola vida, solo premia la primera aprobación y mantiene la separación por cuenta', () => {
    const reward = { gems: 150, xp: 100 };
    const approved = { status: 'passed', levelId: 'u2-n3', reward } as const;
    const initial = reserveDemoAttempt('first');
    if (initial.kind !== 'started') throw new Error('Expected a reservation');
    expect(reserveDemoAttempt('first')).toEqual({ kind: 'busy' });
    expect(settleDemoAttempt('first', initial.id, approved)).toEqual(reward);
    expect(settleDemoAttempt('first', initial.id, approved)).toBeNull();
    const practice = reserveDemoAttempt('first');
    if (practice.kind !== 'started') throw new Error('Expected a reservation');
    expect(settleDemoAttempt('first', practice.id, approved)).toEqual({ gems: 0, xp: 0 });
    expect(getDemoProgress('first')).toMatchObject({ lives: 3, gems: 600, xp: 100 });
    expect(getDemoProgress('other')).toMatchObject({ lives: 3, gems: 450, xp: 0 });
  });

  it('consume una vida en cada fallo y conserva la hora de regeneración tras otro fallo', () => {
    const start = Date.now();
    for (const time of [start, start + 5000]) {
      const attempt = reserveDemoAttempt('first');
      if (attempt.kind !== 'started') throw new Error('Expected a reservation');
      settleDemoAttempt('first', attempt.id, { status: 'lost' }, time);
    }
    expect(getDemoProgress('first')).toMatchObject({ lives: 1, nextLifeAt: start + lifeInterval });
    expect(refreshDemoLives('first', start + lifeInterval - 1).lives).toBe(1);
    expect(refreshDemoLives('first', start + lifeInterval).lives).toBe(2);
  });

  it('requiere cuatro respuestas correctas de cinco y evalúa al terminar', () => {
    expect(answerQuestion(questionsDemo, 0, 0, 'a')).toMatchObject({
      isCorrect: false,
      outcome: null,
    });
    expect(answerQuestion(questionsDemo, 4, 3, 'a').outcome).toBe('failed');
    expect(answerQuestion(questionsDemo, 4, 3, 'b').outcome).toBe('passed');
  });

  it('impide duplicar definiciones, conserva aciertos y cuenta cada vínculo incorrecto', () => {
    const selected = linkDefinition(
      { historico: 'repetir', proxy: 'revelar' },
      'explicable',
      'revelar',
    );
    expect(selected).toEqual({ historico: 'repetir', explicable: 'revelar' });
    expect(evaluateLinks(matchingDemo, selected, 2)).toEqual({
      correctLinks: { historico: 'repetir' },
      missed: 1,
      newErrors: 3,
      outcome: 'failed',
    });
    expect(evaluateLinks(matchingDemo, matchingDemo.pairs, 0).outcome).toBe('passed');
  });
});
