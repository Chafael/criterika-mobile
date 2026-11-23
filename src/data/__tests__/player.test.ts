import { renderHook } from '@testing-library/react-native';

import { usePlayerStats } from '@/data/player';
import { mockPlayerStats } from '@/mocks/player';

describe('usePlayerStats', () => {
  it('entrega los datos de prueba del jugador mientras no hay API', async () => {
    const { result } = await renderHook(() => usePlayerStats());

    expect(result.current).toEqual(mockPlayerStats);
  });
});
