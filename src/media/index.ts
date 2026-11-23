/**
 * Static assets exported from Figma (qbGd2GDSL2a5RWIDLK6yGz).
 * Icon fills are converted to `currentColor` at build time (.svgrrc),
 * so each icon takes its color from the theme through the `color` prop.
 */
import type { ImageSourcePropType } from 'react-native';

import GemsIcon from '@/assets/icons/gems.svg';
import LivesIcon from '@/assets/icons/lives.svg';
import StreakIcon from '@/assets/icons/streak.svg';
import TabCartasIcon from '@/assets/icons/tab-cartas.svg';
import TabDiccionarioIcon from '@/assets/icons/tab-diccionario.svg';
import TabNivelesIcon from '@/assets/icons/tab-niveles.svg';
import TabPerfilIcon from '@/assets/icons/tab-perfil.svg';
import TabTiendaIcon from '@/assets/icons/tab-tienda.svg';

export const icons = {
  /** 1:540 — 16.67 × 15.29 */
  lives: LivesIcon,
  /** 1:545 — 16.67 × 15 */
  gems: GemsIcon,
  /** 1:550 — 13.33 × 15.83 */
  streak: StreakIcon,
  /** 1:561 — 18 × 18 */
  tabNiveles: TabNivelesIcon,
  /** 1:566 — 20.04 × 19.07 */
  tabCartas: TabCartasIcon,
  /** 1:571 — 22 × 16 */
  tabDiccionario: TabDiccionarioIcon,
  /** 1:576 — 20.09 × 18 */
  tabTienda: TabTiendaIcon,
  /** 1:581 — 20 × 20 */
  tabPerfil: TabPerfilIcon,
} as const;

export const images: Record<'logoHorizontal' | 'mascotaGuia', ImageSourcePropType> = {
  /** 1:536 — "03_logo_horizontal_color.png" */
  logoHorizontal: require('@/assets/images/logo-horizontal.png'),
  /** 36:719 — "Mascota / Guía" (also used in 1:505) */
  mascotaGuia: require('@/assets/images/mascota-guia.png'),
};
