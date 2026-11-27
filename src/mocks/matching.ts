import type { MatchingContent } from '@/data/matching';

export const matchingDemo: MatchingContent = {
  concepts: [
    { id: 'historico', label: 'Sesgo histórico' },
    { id: 'proxy', label: 'Variable proxy' },
    { id: 'explicable', label: 'Explicabilidad' },
  ],
  definitions: [
    { id: 'explicar', label: 'Poder explicarle a la persona por qué el sistema decidió así.' },
    { id: 'repetir', label: 'El modelo repite desigualdades que había en el pasado.' },
    {
      id: 'revelar',
      label: 'Un dato que revela otro sensible, como el código postal que delata el origen.',
    },
  ],
  pairs: { historico: 'repetir', proxy: 'revelar', explicable: 'explicar' },
  errorLimit: 3,
  hint: 'Recuerda el principio 1.4 de ACM, ser justo y tomar medidas para no discriminar.',
};
