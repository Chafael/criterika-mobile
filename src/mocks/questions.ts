import type { QuestionContent } from '@/data/question';

export const questionsDemo: QuestionContent = {
  requiredCorrect: 4,
  questions: [
    {
      id: 'seleccion',
      title: 'Dilema de selección de personal',
      prompt:
        'Tu equipo desarrolla un sistema que filtra solicitudes de empleo. En pruebas descarta más solicitudes de mujeres porque aprendió de contrataciones pasadas. ¿Qué debes hacer?',
      principle: 'Principio de no discriminación',
      hint: 'Piensa en quién sale perjudicado y si podría reclamar la decisión.',
      options: [
        { id: 'a', label: 'Lanzarlo así, porque solo refleja los datos reales.' },
        { id: 'b', label: 'Detenerlo, auditar los datos y corregir el sesgo antes de lanzar.' },
        { id: 'c', label: 'Quitar el campo de género y lanzarlo sin más revisión.' },
      ],
      correctOption: 'b',
      explanation:
        'Las decisiones pasadas pueden contener sesgos. Auditar los datos y las decisiones permite detectar a quién perjudica el sistema.',
    },
    {
      id: 'muestra',
      title: 'Datos representativos',
      prompt:
        'Un sistema se entrenó principalmente con solicitudes de una ciudad. ¿Qué conviene revisar antes de usarlo en todo el país?',
      principle: 'Representatividad de los datos',
      hint: 'Considera a las personas que casi no aparecen en el conjunto de entrenamiento.',
      options: [
        { id: 'a', label: 'Si el rendimiento es comparable en las distintas poblaciones.' },
        { id: 'b', label: 'Solo el número total de ejemplos.' },
        { id: 'c', label: 'Si el nombre de la ciudad se puede abreviar.' },
      ],
      correctOption: 'a',
      explanation:
        'Las métricas por población ayudan a detectar diferencias que el promedio oculta.',
    },
    {
      id: 'proxy',
      title: 'Variables que revelan información sensible',
      prompt:
        'Quitaste una característica sensible, pero otra variable sigue reproduciendo disparidades. ¿Qué harías?',
      principle: 'Prevención del sesgo indirecto',
      hint: 'Un dato puede revelar indirectamente otro dato.',
      options: [
        { id: 'a', label: 'Conservarla sin investigar.' },
        { id: 'b', label: 'Cambiar el nombre de la variable.' },
        { id: 'c', label: 'Investigar si actúa como variable proxy y medir su impacto.' },
      ],
      correctOption: 'c',
      explanation:
        'Eliminar un campo sensible puede ser insuficiente cuando otra variable funciona como sustituto.',
    },
    {
      id: 'explicar',
      title: 'Una decisión comprensible',
      prompt:
        'Una persona quiere saber por qué su solicitud fue rechazada. ¿Cómo debe responder el equipo?',
      principle: 'Explicabilidad',
      hint: 'La persona necesita entender los factores que influyeron en su caso.',
      options: [
        { id: 'a', label: 'Explicar los factores relevantes y ofrecer revisión de la decisión.' },
        { id: 'b', label: 'Mostrar únicamente la puntuación del modelo.' },
        { id: 'c', label: 'Decir que todas las decisiones automáticas son definitivas.' },
      ],
      correctOption: 'a',
      explanation:
        'Una explicación clara y una vía de revisión permiten cuestionar una decisión que afecta a la persona.',
    },
    {
      id: 'auditoria',
      title: 'Seguimiento tras el lanzamiento',
      prompt:
        'El sistema cambió su tasa de error después de varios meses. ¿Cuál es la decisión más responsable?',
      principle: 'Responsabilidad continua',
      hint: 'El contexto de uso y los datos pueden cambiar con el tiempo.',
      options: [
        { id: 'a', label: 'Conservar el sistema hasta la próxima versión anual.' },
        { id: 'b', label: 'Revisar los errores, detectar cambios y corregir el problema.' },
        { id: 'c', label: 'Eliminar las métricas anteriores.' },
      ],
      correctOption: 'b',
      explanation:
        'El seguimiento continuo ayuda a encontrar y corregir daños después del lanzamiento.',
    },
  ],
};
