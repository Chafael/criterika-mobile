import { render, screen } from '@testing-library/react-native';

import { FitSpace, fitShrink } from '@/components/layout/fit-space';

describe('FitSpace', () => {
  it('empieza en su tamaño de Figma y puede encogerse hasta cero', async () => {
    await render(<FitSpace size={24} />);

    expect(screen.toJSON()).toHaveStyle({ flexBasis: 24, flexShrink: 1, minHeight: 0 });
  });

  it('fitShrink da a una caja un peso igual al espacio que puede ceder', () => {
    const height = 490;
    const shrink = fitShrink(144, height);

    expect(shrink * height).toBeCloseTo(144);
  });
});
