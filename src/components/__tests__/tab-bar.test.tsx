import { render, screen, userEvent } from '@testing-library/react-native';
import type { BottomTabBarProps } from 'expo-router/tabs';

import { TabBar } from '@/components/tab-bar';
import { colors } from '@/theme';

const ROUTE_NAMES = ['index', 'cartas', 'diccionario', 'tienda', 'perfil'];

function buildProps(activeIndex: number, defaultPrevented = false) {
  const emit = jest.fn(() => ({ defaultPrevented }));
  const navigateToTab = jest.fn();
  const props = {
    state: {
      index: activeIndex,
      routes: ROUTE_NAMES.map((name) => ({ key: `${name}-key`, name })),
    },
    descriptors: {},
    emitter: { emit },
    navigateToTab,
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  } as unknown as BottomTabBarProps;
  return { props, emit, navigateToTab };
}

describe('TabBar', () => {
  it('muestra las cinco pestañas en el orden del diseño', async () => {
    const { props } = buildProps(0);
    await render(<TabBar {...props} />);

    const labels = screen.getAllByRole('tab').map((tab) => tab.props.accessibilityLabel);
    expect(labels).toEqual(['Niveles', 'Cartas', 'Diccionario', 'Tienda', 'Perfil']);
  });

  it('marca como seleccionada solo la pestaña activa y la pinta con el color activo', async () => {
    const { props } = buildProps(2);
    await render(<TabBar {...props} />);

    expect(screen.getByRole('tab', { name: 'Diccionario' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Niveles' })).not.toBeSelected();
    expect(screen.getByText('Diccionario')).toHaveStyle({ color: colors.light.tabActive });
    expect(screen.getByText('Niveles')).toHaveStyle({ color: colors.light.tabInactive });
  });

  it('navega a otra pestaña al presionarla', async () => {
    const { props, emit, navigateToTab } = buildProps(0);
    const user = userEvent.setup();
    await render(<TabBar {...props} />);

    await user.press(screen.getByRole('tab', { name: 'Tienda' }));

    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'tabPress', target: 'tienda-key' }),
    );
    expect(navigateToTab).toHaveBeenCalledWith('tienda-key');
  });

  it('no navega al presionar la pestaña que ya está activa', async () => {
    const { props, navigateToTab } = buildProps(0);
    const user = userEvent.setup();
    await render(<TabBar {...props} />);

    await user.press(screen.getByRole('tab', { name: 'Niveles' }));

    expect(navigateToTab).not.toHaveBeenCalled();
  });

  it('no navega si alguien cancela el evento de la pestaña', async () => {
    const { props, navigateToTab } = buildProps(0, true);
    const user = userEvent.setup();
    await render(<TabBar {...props} />);

    await user.press(screen.getByRole('tab', { name: 'Perfil' }));

    expect(navigateToTab).not.toHaveBeenCalled();
  });
});
