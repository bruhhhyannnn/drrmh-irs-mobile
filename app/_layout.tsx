import '../global.css';

import { supabase } from '@/lib';
import { useAuthStore, type UserProfile } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  const { setUser, clearUser, user } = useAuthStore();

  useEffect(() => {
    // Restore session on mount if Supabase has a valid token but zustand lost the profile
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !user) {
        fetchAndSetProfile(session.user.id, setUser);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchAndSetProfile(session.user.id, setUser);
      }
      if (event === 'SIGNED_OUT') {
        clearUser();
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

async function fetchAndSetProfile(authId: string, setUser: (u: UserProfile) => void) {
  const { data: profile } = await supabase
    .from('users')
    .select(
      'id, auth_id, first_name, last_name, email, unit_id, position_id, user_type_id, user_type:user_types(name)'
    )
    .eq('auth_id', authId)
    .single();

  if (!profile) return;

  const userTypeName = (profile.user_type as unknown as { name: string })?.name ?? '';
  if (userTypeName !== 'ERT Member') return;

  setUser({
    id: profile.id,
    auth_id: profile.auth_id,
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    unit_id: profile.unit_id,
    position_id: profile.position_id,
    user_type_id: profile.user_type_id,
    user_type_name: userTypeName,
  });
}
