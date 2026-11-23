/**
 * Static assets exported from Figma (qbGd2GDSL2a5RWIDLK6yGz).
 * Icon fills are converted to `currentColor` at build time (.svgrrc),
 * so each icon takes its color from the theme through the `color` prop.
 */
import type { ImageSourcePropType } from 'react-native';

import CheckIcon from '@/assets/icons/check.svg';
import GemsIcon from '@/assets/icons/gems.svg';
import GiftIcon from '@/assets/icons/gift.svg';
import LivesIcon from '@/assets/icons/lives.svg';
import LockLargeIcon from '@/assets/icons/lock-large.svg';
import LockSmallIcon from '@/assets/icons/lock-small.svg';
import LockIcon from '@/assets/icons/lock.svg';
import NextUnitIcon from '@/assets/icons/next-unit.svg';
import PlayCircleIcon from '@/assets/icons/play-circle.svg';
import PlayIcon from '@/assets/icons/play.svg';
import StarIcon from '@/assets/icons/star.svg';
import StreakIcon from '@/assets/icons/streak.svg';
import UnitBadgeIcon from '@/assets/icons/unit-badge.svg';
import UnitTopicIcon from '@/assets/icons/unit-topic.svg';
import LevelPathIllustration from '@/assets/illustrations/level-path.svg';
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
  /** 1:429 — 10.67 × 13.33 */
  unitBadge: UnitBadgeIcon,
  /** 1:438 — 18 × 19 */
  unitTopic: UnitTopicIcon,
  /** 1:452 — 15.84 × 16.67 */
  nextUnit: NextUnitIcon,
  /** 1:457 — 16 × 21 */
  lockLarge: LockLargeIcon,
  /** 1:468 — 26.67 × 26.67 */
  check: CheckIcon,
  /** 1:489 — 15.58 × 19.83 */
  play: PlayIcon,
  /** 1:497 — 13.33 × 13.33 */
  playCircle: PlayCircleIcon,
  /** 1:511 — 17.33 × 22.75 */
  lock: LockIcon,
  /** 1:520 — 11.67 × 11.08 */
  star: StarIcon,
  /** 1:525 — 26.67 × 25.33 */
  gift: GiftIcon,
  /** 1:530 — 14.67 × 19.25 */
  lockSmall: LockSmallIcon,
} as const;

/** Multi-color illustrations: keep their original Figma colors. */
export const illustrations = {
  /** 1:459 — 390 × 766, path joining the level nodes */
  levelPath: LevelPathIllustration,
} as const;

export const images: Record<'logoHorizontal' | 'mascotaGuia', ImageSourcePropType> = {
  /** 1:536 — "03_logo_horizontal_color.png" */
  logoHorizontal: require('@/assets/images/logo-horizontal.png'),
  /** 36:719 — "Mascota / Guía" (also used in 1:505) */
  mascotaGuia: require('@/assets/images/mascota-guia.png'),
};
