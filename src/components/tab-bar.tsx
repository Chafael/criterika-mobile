import type { BottomTabBarProps } from 'expo-router/tabs';
import type { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { icons } from '@/media';
import { shadows, sizes, spacing, typography, useColors } from '@/theme';

type TabConfig = {
  label: string;
  Icon: FC<SvgProps>;
};

/** Tabs in the order of Figma 1:558, keyed by route name. */
export const TAB_CONFIG: Record<string, TabConfig> = {
  index: { label: 'Niveles', Icon: icons.tabNiveles },
  cartas: { label: 'Cartas', Icon: icons.tabCartas },
  diccionario: { label: 'Diccionario', Icon: icons.tabDiccionario },
  tienda: { label: 'Tienda', Icon: icons.tabTienda },
  perfil: { label: 'Perfil', Icon: icons.tabPerfil },
};

/** Bottom navigation (Figma 1:557 light, 119:1585 dark). */
export function TabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.root,
        { paddingBottom: insets.bottom, backgroundColor: colors.barBackground },
      ]}>
      <View role="tablist" style={styles.row}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) {
            return null;
          }
          const focused = index === state.index;
          const color = focused ? colors.tabActive : colors.tabInactive;
          const { Icon, label } = config;

          const onPress = () => {
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          return (
            <Pressable
              key={route.key}
              role="tab"
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
              style={styles.tab}>
              <Icon color={color} />
              <Text style={[typography.caption, styles.label, { color }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
    boxShadow: shadows.tabBar,
  },
  row: {
    width: '100%',
    maxWidth: 512,
    height: sizes.tabBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
  },
  tab: {
    minWidth: sizes.tabMinWidth,
    minHeight: sizes.tabMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  label: {
    paddingTop: spacing.xxs,
  },
});
