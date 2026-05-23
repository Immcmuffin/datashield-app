import { Tabs } from 'expo-router'
import { Text } from 'react-native'

export default function AppLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#0f1117', borderTopColor: '#222' },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#666',
    }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🛡️</Text> }} />
      <Tabs.Screen name="pricing" options={{ title: 'Plans', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💳</Text> }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text> }} />
    </Tabs>
  )
}
