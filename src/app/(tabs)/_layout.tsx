import { Tabs } from 'expo-router';

import { AppHeader } from '@/components/app-header';
import { TAB_CONFIG, TabBar } from '@/components/tab-bar';
import { usePlayerStats } from '@/data/player';

export default function TabsLayout() {
  const stats = usePlayerStats();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ header: () => <AppHeader stats={stats} /> }}>
      {Object.entries(TAB_CONFIG).map(([name, { label }]) => (
        <Tabs.Screen key={name} name={name} options={{ title: label }} />
      ))}
    </Tabs>
  );
}
