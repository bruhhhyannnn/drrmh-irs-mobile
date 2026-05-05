import { useAuthStore } from '@/store';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Redirect href="/(app)/(home)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
