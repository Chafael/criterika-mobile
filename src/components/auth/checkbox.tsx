import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { authColors } from '@/theme';

type CheckboxProps = {
  checked: boolean;
};

/**
 * 22 px checkbox (51:1146). Figma only draws the unchecked state; the checked
 * state fills it with the border color and draws a light check mark.
 */
export function Checkbox({ checked }: CheckboxProps) {
  return (
    <View
      style={[
        styles.box,
        { backgroundColor: checked ? authColors.checkboxBorder : authColors.surfaceRaised },
      ]}>
      {checked ? (
        <Svg width={14} height={14} viewBox="0 0 24 24">
          <Path
            d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
            fill={authColors.surfaceRaised}
          />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: authColors.checkboxBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
