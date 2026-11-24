import { render, screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import AvisoPrivacidad from '@/app/aviso-privacidad';
import TerminosCondiciones from '@/app/terminos-condiciones';
import { mockLegalDocuments } from '@/mocks/legal';

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn(() => true) },
}));

const { terms, privacy } = mockLegalDocuments;

describe('Pantalla Términos y condiciones', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el documento desde su título, con el primer apartado abierto', async () => {
    await render(<TerminosCondiciones />);

    expect(await screen.findByRole('header', { name: 'Términos y condiciones' })).toBeOnTheScreen();
    expect(screen.getByText(terms.title)).toBeOnTheScreen();
    expect(screen.getByText(terms.lastUpdated)).toBeOnTheScreen();
    expect(screen.getByText(terms.intro[0])).toBeOnTheScreen();

    const [first, second] = terms.sections;
    expect(screen.getByRole('button', { name: first.title })).toBeExpanded();
    expect(screen.getByText(first.paragraphs[0])).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: second.title })).toBeCollapsed();
    expect(screen.queryByText(second.paragraphs[0])).toBeNull();
    expect(screen.getByText('Escríbenos a soporte@criterika.com')).toBeOnTheScreen();
  });

  it('cada apartado se abre y se cierra con su texto completo', async () => {
    const user = userEvent.setup();
    await render(<TerminosCondiciones />);
    await screen.findByText(terms.title);

    for (const section of terms.sections.slice(1)) {
      await user.press(screen.getByRole('button', { name: section.title }));
      expect(screen.getByRole('button', { name: section.title })).toBeExpanded();
      for (const paragraph of section.paragraphs) {
        expect(screen.getByText(paragraph)).toBeOnTheScreen();
      }
    }

    const [first] = terms.sections;
    await user.press(screen.getByRole('button', { name: first.title }));
    expect(screen.getByRole('button', { name: first.title })).toBeCollapsed();
    expect(screen.queryByText(first.paragraphs[0])).toBeNull();
  });

  it('el botón de volver regresa a la pantalla anterior', async () => {
    const user = userEvent.setup();
    await render(<TerminosCondiciones />);
    await screen.findByText(terms.title);

    await user.press(screen.getByRole('button', { name: 'Volver atrás' }));

    expect(router.back).toHaveBeenCalled();
  });
});

describe('Pantalla Aviso de privacidad', () => {
  it('muestra el aviso integral con todos los apartados abiertos', async () => {
    await render(<AvisoPrivacidad />);

    expect(await screen.findByRole('header', { name: 'Aviso de privacidad' })).toBeOnTheScreen();
    expect(screen.getByText(privacy.title)).toBeOnTheScreen();
    expect(screen.getByText(privacy.lastUpdated)).toBeOnTheScreen();
    expect(
      screen.getByText('Datos personales y derechos ARCO: privacidad@criterika.com'),
    ).toBeOnTheScreen();
    for (const section of privacy.sections) {
      expect(screen.getByRole('button', { name: section.title })).toBeExpanded();
      for (const paragraph of section.paragraphs) {
        expect(screen.getByText(paragraph)).toBeOnTheScreen();
      }
    }
  });

  it('un apartado del aviso también se puede cerrar', async () => {
    const user = userEvent.setup();
    await render(<AvisoPrivacidad />);
    const [first] = privacy.sections;
    await screen.findByText(first.paragraphs[0]);

    await user.press(screen.getByRole('button', { name: first.title }));

    expect(screen.getByRole('button', { name: first.title })).toBeCollapsed();
    expect(screen.queryByText(first.paragraphs[0])).toBeNull();
  });
});
