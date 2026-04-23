import { supabase } from '@/lib';
import { useAuthStore, useOfflineStore } from '@/store';
import NetInfo from '@react-native-community/netinfo';
import { Redirect, Tabs } from 'expo-router';
import { FileText, Home, Send, User } from 'lucide-react-native';
import { useEffect } from 'react';

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();
  const { queue } = useOfflineStore();

  useOfflineSync();

  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7f1616',
        tabBarInactiveTintColor: '#98a2b3',
        tabBarStyle: {
          borderTopColor: '#7f1616',
          backgroundColor: '#ffffff',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report/index"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
          tabBarBadge: queue.length > 0 ? queue.length : undefined,
        }}
      />
      <Tabs.Screen
        name="my-reports"
        options={{
          title: 'My Reports',
          tabBarIcon: ({ color, size }) => <Send size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />

      {/* Hidden from tab bar but accessible via router.push */}
      <Tabs.Screen name="report/[id]" options={{ href: null }} />
      <Tabs.Screen name="events/[id]" options={{ href: null }} />
    </Tabs>
  );
}

// Auto-sync offline queue when connection is restored
function useOfflineSync() {
  const { queue, dequeue, incrementRetry, setIsSyncing } = useOfflineStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (!state.isConnected || queue.length === 0 || !user) return;

      setIsSyncing(true);
      for (const item of queue) {
        try {
          const { error } = await supabase
            .from('reports')
            .insert({ ...item.payload, user_id: user.id });

          if (error) {
            incrementRetry(item.id);
          } else {
            dequeue(item.id);
          }
        } catch {
          incrementRetry(item.id);
        }
      }
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [queue, user, dequeue, incrementRetry, setIsSyncing]);
}
