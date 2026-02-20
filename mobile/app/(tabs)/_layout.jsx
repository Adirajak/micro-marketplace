import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#6366f1',
      tabBarStyle: { borderTopWidth: 1, borderTopColor: '#e2e8f0' },
      headerShown: false
    }}>
      <Tabs.Screen name="index" options={{ title: 'Products', tabBarIcon: () => '🏪' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: () => '❤️' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: () => '👤' }} />
    </Tabs>
  );
}