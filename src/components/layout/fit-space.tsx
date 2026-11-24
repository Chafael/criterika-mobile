import { View } from 'react-native';

type FitSpaceProps = {
  /** Height from Figma, used when the screen has room for it. */
  size: number;
};

/**
 * Vertical space of a fixed (non scrolling) screen. It starts at its Figma
 * size and shrinks with the other spaces, in proportion to their sizes, when
 * the content is taller than the screen. Content around it keeps its size
 * (React Native items do not shrink by default).
 */
export function FitSpace({ size }: FitSpaceProps) {
  return <View style={{ flexBasis: size, flexShrink: 1, minHeight: 0 }} />;
}

/**
 * `flexShrink` for a box that holds FitSpaces: its shrink weight in the parent
 * (flexShrink × height) then equals the space it can give up, so its inner
 * spaces shrink at the same rate as the spaces around it.
 */
export function fitShrink(innerSpace: number, height: number) {
  return innerSpace / height;
}
