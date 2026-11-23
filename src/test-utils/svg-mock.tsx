import { View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

/** Stand-in for .svg imports in Jest; exposes the color it receives. */
export default function SvgMock({ color }: SvgProps) {
  return <View testID="svg-icon" accessibilityHint={String(color ?? '')} />;
}
