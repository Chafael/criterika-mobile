import type { LevelPath } from '@/data/level-path';

/** Sample content shown in Figma 1:388 and 26:78 until the API is wired. */
export const mockLevelPath: LevelPath = {
  unit: {
    number: 2,
    title: 'Sesgo Algorítmico e IA',
    description: 'Cómo los datos y los algoritmos pueden discriminar, y qué hacer para evitarlo.',
  },
  levels: [
    { id: 'u2-n1', number: 1, title: 'Qué es un sesgo', status: 'completed' },
    { id: 'u2-n2', number: 2, title: 'Datos representativos', status: 'completed' },
    { id: 'u2-n3', number: 3, title: 'Discriminación algorítmica', status: 'active' },
    { id: 'u2-n4', number: 4, title: 'Transparencia y explicabilidad', status: 'locked' },
  ],
  closing: {
    title: 'Cierre: Equidad algorítmica',
    cardName: 'Carta Ética',
    badge: 'Recompensa',
    status: 'locked',
  },
  nextUnitTitle: 'Propiedad intelectual',
  mascotMessage: '¡Vamos a reflexionar juntos!',
  previews: [
    {
      levelId: 'u2-n3',
      activities: ['Memorama', 'Sopa de letras', 'Preguntas', 'Crucigrama', 'Relacionar'],
      rewardGems: 150,
      rewardXp: 100,
    },
  ],
};
