import { getCurrentLegalDocuments } from '@/data/legal';

describe('Documentos legales vigentes', () => {
  it('devuelve los Términos y condiciones completos, en el orden del documento', async () => {
    const { terms } = await getCurrentLegalDocuments();

    expect(terms.title).toBe('Términos y Condiciones con Descargo de Responsabilidad de Criterika');
    expect(terms.lastUpdated).toBe('Última actualización: 23 de octubre de 2026.');
    expect(terms.sections.map((section) => section.title)).toEqual([
      'Identificación del equipo y contacto',
      'Aceptación y requisitos de uso',
      'Registro y seguridad de la cuenta',
      'Alcance educativo y descargo de asesoría jurídica',
      'Niveles y registro del progreso',
      'Vidas y consecuencias de interrumpir un nivel',
      'Gemas y colección de cartas',
      'Licencia de uso y restricciones del software',
      'Propiedad intelectual y usos académicos permitidos',
      'Uso permitido y conductas prohibidas',
      'Suspensiones y cancelación por incumplimiento',
      'Privacidad y eliminación de la cuenta',
      'Disponibilidad y limitación de responsabilidad',
      'Actualizaciones del contenido y de estas condiciones',
      'Legislación y solución de controversias',
    ]);
    expect(terms.sections.at(-1)?.paragraphs.at(-1)).toBe(
      'Si una cláusula resulta inválida o inaplicable, se tendrá por no puesta en la parte afectada y las demás continuarán vigentes en cuanto puedan subsistir legalmente. En ningún caso se interpretará el documento para reducir derechos que la legislación reconozca de manera irrenunciable.',
    );
  });

  it('devuelve el Aviso de privacidad integral, no un resumen', async () => {
    const { privacy } = await getCurrentLegalDocuments();

    expect(privacy.title).toBe('Aviso de Privacidad Integral de Criterika');
    expect(privacy.lastUpdated).toBe('Última actualización: 23 de octubre de 2026.');
    expect(privacy.sections.map((section) => section.title)).toEqual([
      'Responsables y medios de contacto',
      'Datos personales que recabamos',
      'Finalidades necesarias del tratamiento',
      'Tratamientos opcionales y finalidades secundarias',
      'Proveedores de servicios y transferencias',
      'Derechos ARCO y procedimiento para ejercerlos',
      'Revocación del consentimiento y limitación del uso',
      'Conservación y eliminación de datos personales',
      'Medidas de seguridad y confidencialidad',
      'Imágenes del dispositivo y tecnologías de sesión',
      'Restricción a personas mayores de edad y datos de pago',
      'Consulta y modificaciones al aviso de privacidad',
    ]);
    expect(privacy.sections.at(-1)?.paragraphs.at(-1)).toBe(
      'Las modificaciones se comunicarán al correo electrónico registrado y se publicará la versión actualizada en los espacios de consulta de la aplicación. La comunicación indicará la fecha de entrada en vigor y los cambios relevantes. Cuando una modificación incorpore un tratamiento que requiera su consentimiento, lo solicitaremos antes de iniciar ese tratamiento.',
    );
  });

  it('no trae datos de la entrega escolar ni párrafos vacíos', async () => {
    const documents = await getCurrentLegalDocuments();
    const text = JSON.stringify(documents);

    for (const schoolData of ['UNIVERSIDAD', 'Materia', 'Docente', 'Página', '243703']) {
      expect(text).not.toContain(schoolData);
    }
    for (const document of Object.values(documents)) {
      const paragraphs = [...document.intro, ...document.sections.flatMap((s) => s.paragraphs)];
      expect(
        paragraphs.every((paragraph) => paragraph === paragraph.trim() && paragraph !== ''),
      ).toBe(true);
    }
  });
});
