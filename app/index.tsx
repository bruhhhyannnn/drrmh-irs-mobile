import { useAuthStore } from '@/store';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Redirect href="/(app)" /> : <Redirect href="/(auth)/sign-in" />;
}
